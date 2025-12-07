'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteItem(
  itemId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Verify user owns the item's list
    const { data: item, error: itemError } = await supabase
      .from('gift_items')
      .select(`
        id,
        list_id,
        gift_lists!inner(user_id)
      `)
      .eq('id', itemId)
      .single()

    if (itemError || !item) {
      return { success: false, error: 'Item not found' }
    }

    // @ts-expect-error - Supabase types issue with nested relations
    if (item.gift_lists.user_id !== user.id) {
      return { success: false, error: 'Access denied' }
    }

    // Delete item (cascade will delete retailer_links)
    const { error: deleteError } = await supabase
      .from('gift_items')
      .delete()
      .eq('id', itemId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return { success: false, error: 'Failed to delete item' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete item error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
