import { createClient } from '@/lib/supabase/server'
import type { QuickAddData, AICache, AIUsage } from '@/types/ai'
import crypto from 'crypto'

const CACHE_TTL_DAYS = 7

/**
 * Generate a cache key hash from the query
 */
export function generateCacheHash(query: string): string {
  const normalized = query.toLowerCase().trim()
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

/**
 * Get cached AI response
 * Note: Uses type assertions because ai_cache table isn't in generated Supabase types yet.
 * Run migration 002_ai_cache_and_usage.sql then regenerate types to remove these.
 */
export async function getCachedResponse(
  query: string
): Promise<QuickAddData | null> {
  try {
    const supabase = await createClient()
    const hash = generateCacheHash(query)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('ai_cache')
      .select('response_json, expires_at, hit_count')
      .eq('query_hash', hash)
      .single() as { data: Pick<AICache, 'response_json' | 'expires_at' | 'hit_count'> | null; error: unknown }

    if (error || !data) return null

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      // Expired - delete it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('ai_cache').delete().eq('query_hash', hash)
      return null
    }

    // Increment hit count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('ai_cache')
      .update({ hit_count: data.hit_count + 1 })
      .eq('query_hash', hash)

    return data.response_json
  } catch (error) {
    console.error('Cache lookup error:', error)
    return null
  }
}

/**
 * Store AI response in cache
 */
export async function setCachedResponse(
  query: string,
  response: QuickAddData
): Promise<void> {
  try {
    const supabase = await createClient()
    const hash = generateCacheHash(query)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('ai_cache').upsert({
      query_hash: hash,
      query_text: query,
      response_json: response,
      expires_at: expiresAt.toISOString(),
      hit_count: 0,
    })
  } catch (error) {
    console.error('Cache store error:', error)
    // Don't throw - caching failure shouldn't break the feature
  }
}

/**
 * Track AI usage for a user
 */
export async function trackUsage(
  userId: string,
  tokens: number,
  costCents: number
): Promise<void> {
  try {
    const supabase = await createClient()
    const monthYear = new Date().toISOString().slice(0, 7) // "2025-12"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('ai_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .single() as { data: AIUsage | null; error: unknown }

    if (existing) {
      // Update existing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('ai_usage')
        .update({
          tokens_used: existing.tokens_used + tokens,
          cost_cents: existing.cost_cents + costCents,
          request_count: existing.request_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      // Create new
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('ai_usage').insert({
        user_id: userId,
        month_year: monthYear,
        tokens_used: tokens,
        cost_cents: costCents,
        request_count: 1,
      })
    }
  } catch (error) {
    console.error('Usage tracking error:', error)
  }
}

/**
 * Check if user is within budget
 */
export async function isWithinBudget(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const monthYear = new Date().toISOString().slice(0, 7)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('ai_usage')
      .select('cost_cents')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .single() as { data: Pick<AIUsage, 'cost_cents'> | null; error: unknown }

    if (!data) return true // No usage yet

    // $10 budget = 1000 cents
    return data.cost_cents < 1000
  } catch (error) {
    console.error('Budget check error:', error)
    return false // Fail closed
  }
}

/**
 * Get user's remaining budget
 */
export async function getRemainingBudget(userId: string): Promise<number> {
  try {
    const supabase = await createClient()
    const monthYear = new Date().toISOString().slice(0, 7)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('ai_usage')
      .select('cost_cents')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .single() as { data: Pick<AIUsage, 'cost_cents'> | null; error: unknown }

    const spent = data?.cost_cents || 0
    const remaining = Math.max(0, 1000 - spent) / 100 // Convert to dollars

    return remaining
  } catch (error) {
    console.error('Budget retrieval error:', error)
    return 0
  }
}
