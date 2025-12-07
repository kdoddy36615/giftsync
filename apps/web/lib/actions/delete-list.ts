'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteList(
  listId: string
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

    // Verify user owns the list
    const { data: list, error: listError } = await supabase
      .from('gift_lists')
      .select('id, user_id')
      .eq('id', listId)
      .eq('user_id', user.id)
      .single()

    if (listError || !list) {
      return { success: false, error: 'List not found or access denied' }
    }

    // Delete list (cascade will delete items and retailer links via database foreign keys)
    const { error: deleteError } = await supabase
      .from('gift_lists')
      .delete()
      .eq('id', listId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return { success: false, error: 'Failed to delete list' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete list error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
