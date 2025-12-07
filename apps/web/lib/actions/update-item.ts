'use server'

import { createClient } from '@/lib/supabase/server'
import type { GiftItem } from '@/types/database'
import type { UpdateItemInput } from '@/types/forms'

export async function updateItem(
  data: UpdateItemInput
): Promise<{ success: true; item: GiftItem } | { success: false; error: string }> {
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
      .eq('id', data.itemId)
      .single()

    if (itemError || !item) {
      return { success: false, error: 'Item not found' }
    }

    // @ts-expect-error - Supabase types issue with nested relations
    if (item.gift_lists.user_id !== user.id) {
      return { success: false, error: 'Access denied' }
    }

    // Update item
    const { data: updatedItem, error: updateError } = await supabase
      .from('gift_items')
      // @ts-expect-error - Supabase types issue
      .update({
        name: data.name.trim(),
        status: data.status,
        notes: data.notes.trim() || null,
        value_tag: data.valueTag,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.itemId)
      .select()
      .single()

    if (updateError || !updatedItem) {
      console.error('Update error:', updateError)
      return { success: false, error: 'Failed to update item' }
    }

    return { success: true, item: updatedItem as GiftItem }
  } catch (error) {
    console.error('Update item error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
