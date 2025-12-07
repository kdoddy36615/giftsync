'use server'

import { createClient } from '@/lib/supabase/server'
import type { GiftList } from '@/types/database'

export interface UpdateListInput {
  listId: string
  name?: string
  color?: string
}

export async function updateList(
  data: UpdateListInput
): Promise<{ success: true; list: GiftList } | { success: false; error: string }> {
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
      .eq('id', data.listId)
      .eq('user_id', user.id)
      .single()

    if (listError || !list) {
      return { success: false, error: 'List not found or access denied' }
    }

    // Build update object
    const updates: { name?: string; color?: string; updated_at: string } = {
      updated_at: new Date().toISOString(),
    }

    if (data.name !== undefined) {
      const trimmedName = data.name.trim()
      if (!trimmedName) {
        return { success: false, error: 'List name is required' }
      }
      if (trimmedName.length > 100) {
        return { success: false, error: 'List name must be less than 100 characters' }
      }
      updates.name = trimmedName
    }

    if (data.color !== undefined) {
      updates.color = data.color
    }

    // Update list
    const { data: updatedList, error: updateError } = await supabase
      .from('gift_lists')
      // @ts-expect-error - Supabase types issue
      .update(updates)
      .eq('id', data.listId)
      .select()
      .single()

    if (updateError || !updatedList) {
      console.error('Update error:', updateError)
      return { success: false, error: 'Failed to update list' }
    }

    return { success: true, list: updatedList as GiftList }
  } catch (error) {
    console.error('Update list error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
