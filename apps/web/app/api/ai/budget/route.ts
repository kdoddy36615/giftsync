import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Budget constants
const MONTHLY_BUDGET_CENTS = 1000 // $10
const ESTIMATED_COST_PER_REQUEST = 0.0316 // cents (based on GPT-4o-mini pricing)
const TOTAL_REQUESTS_PER_BUDGET = Math.floor(MONTHLY_BUDGET_CENTS / ESTIMATED_COST_PER_REQUEST)

interface BudgetResponse {
  success: true
  data: {
    remainingCents: number
    totalCents: number
    percentUsed: number
    estimatedRequestsRemaining: number
    estimatedTotalRequests: number
  }
}

interface BudgetError {
  success: false
  error: string
}

type BudgetResult = BudgetResponse | BudgetError

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json<BudgetResult>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const monthYear = new Date().toISOString().slice(0, 7) // "2025-12"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('ai_usage')
      .select('cost_cents, request_count')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single() as { data: { cost_cents: number; request_count: number } | null; error: unknown }

    const spentCents = data?.cost_cents || 0
    const requestCount = data?.request_count || 0
    const remainingCents = Math.max(0, MONTHLY_BUDGET_CENTS - spentCents)
    const percentUsed = Math.round((spentCents / MONTHLY_BUDGET_CENTS) * 100)

    // Calculate estimated remaining requests based on actual usage
    let estimatedRequestsRemaining: number
    if (requestCount > 0) {
      const avgCostPerRequest = spentCents / requestCount
      estimatedRequestsRemaining = Math.floor(remainingCents / avgCostPerRequest)
    } else {
      estimatedRequestsRemaining = Math.floor(remainingCents / ESTIMATED_COST_PER_REQUEST)
    }

    return NextResponse.json<BudgetResult>({
      success: true,
      data: {
        remainingCents,
        totalCents: MONTHLY_BUDGET_CENTS,
        percentUsed,
        estimatedRequestsRemaining,
        estimatedTotalRequests: TOTAL_REQUESTS_PER_BUDGET,
      },
    })
  } catch (error) {
    return NextResponse.json<BudgetResult>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get budget',
      },
      { status: 500 }
    )
  }
}
