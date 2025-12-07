'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createRetailerLinks, type RetailerLinkData } from './create-retailer-links'
import type { QuickAddData } from '@/types/ai'
import type { GiftItem } from '@/types/database'

interface CreateItemWithAIDataParams {
  listId: string
  itemName: string
  aiData: QuickAddData
}

export async function createItemWithAIData({
  listId,
  itemName,
  aiData,
}: CreateItemWithAIDataParams): Promise<{ success: boolean; error?: string; itemId?: string }> {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify user owns the list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: list, error: listError } = await (supabase as any)
      .from('gift_lists')
      .select('user_id')
      .eq('id', listId)
      .single() as { data: { user_id: string } | null; error: unknown }

    if (listError || !list) {
      return { success: false, error: 'List not found' }
    }

    if (list.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Create the item with AI-suggested data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newItem, error: itemError } = await (supabase as any)
      .from('gift_items')
      .insert({
        list_id: listId,
        name: itemName,
        status: aiData.suggestedStatus || 'required',
        price_low: aiData.priceRange.low,
        price_high: aiData.priceRange.high,
        research_content: aiData.description,
        is_completed: false,
      })
      .select()
      .single() as { data: GiftItem | null; error: unknown }

    if (itemError || !newItem) {
      console.error('Failed to create item:', itemError)
      return { success: false, error: 'Failed to create item' }
    }

    const itemId = newItem.id

    // Create retailer links
    if (aiData.retailers && aiData.retailers.length > 0) {
      const retailerData: RetailerLinkData[] = aiData.retailers.map((r) => ({
        storeName: r.storeName,
        url: r.searchUrl,
        price: r.estimatedPrice,
        isBestPrice: r.isBestPrice,
        isHighend: r.isHighend,
      }))

      const linksResult = await createRetailerLinks(itemId, retailerData)

      if (!linksResult.success) {
        // Rollback: delete the item if links failed
        await supabase.from('gift_items').delete().eq('id', itemId)
        return {
          success: false,
          error: 'Failed to create retailer links. Item creation rolled back.',
        }
      }
    }

    // Revalidate the dashboard
    revalidatePath('/dashboard')

    return { success: true, itemId }
  } catch (error) {
    console.error('Create item with AI data error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
