'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface RetailerLinkData {
  storeName: string
  url: string
  price: number | null
  isBestPrice: boolean
  isHighend: boolean
}

export async function createRetailerLinks(
  itemId: string,
  retailers: RetailerLinkData[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Verify user owns the item (through list ownership)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: item, error: itemError } = await (supabase as any)
      .from('gift_items')
      .select('list_id, gift_lists!inner(user_id)')
      .eq('id', itemId)
      .single() as { data: { list_id: string; gift_lists: { user_id: string } } | null; error: unknown }

    if (itemError || !item) {
      return { success: false, error: 'Item not found' }
    }

    // Check ownership
    if (item.gift_lists.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Prepare retailer links for insertion
    const links = retailers.map((r) => ({
      item_id: itemId,
      store_name: r.storeName,
      url: r.url,
      price: r.price,
      is_best_price: r.isBestPrice,
      is_highend: r.isHighend,
    }))

    // Batch insert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any).from('retailer_links').insert(links)

    if (insertError) {
      console.error('Failed to create retailer links:', insertError)
      return { success: false, error: 'Failed to create retailer links' }
    }

    // Revalidate the dashboard
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Create retailer links error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
