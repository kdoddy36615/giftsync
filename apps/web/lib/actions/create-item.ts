'use server'

import { createClient } from '@/lib/supabase/server'
import type { GiftItem } from '@/types/database'
import type { CreateItemInput } from '@/types/forms'
import { logger } from '@/lib/utils/logger'
import { validateItemName } from '@/lib/constants/validation'

/**
 * Create a new gift item in a list
 * @param data - The item data including name, status, notes, and value tag
 * @returns Response with success status and the created item or error message
 */
export async function createItem(
  data: CreateItemInput
): Promise<{ success: true; item: GiftItem } | { success: false; error: string }> {
  try {
    const supabase = await createClient()

    // 1. Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // 2. Validate input
    const validationError = validateItemName(data.name)
    if (validationError) {
      return { success: false, error: validationError }
    }

    // 3. Verify user owns the list
    const { data: list, error: listError } = await supabase
      .from('gift_lists')
      .select('id')
      .eq('id', data.listId)
      .eq('user_id', user.id)
      .single()

    if (listError || !list) {
      logger.security('Unauthorized item creation attempt', {
        userId: user.id,
        listId: data.listId,
      })
      return { success: false, error: 'List not found or access denied' }
    }

    // 4. Insert new item
    const { data: newItem, error: insertError } = await supabase
      .from('gift_items')
      // @ts-expect-error - Supabase generated types have issues with insert operations
      .insert({
        list_id: data.listId,
        name: data.name.trim(),
        status: data.status,
        notes: data.notes?.trim() || null,
        value_tag: data.valueTag,
        is_completed: false,
      })
      .select()
      .single()

    if (insertError || !newItem) {
      logger.error('Failed to create item', insertError, {
        userId: user.id,
        listId: data.listId,
      })
      return { success: false, error: 'Failed to create item' }
    }

    return { success: true, item: newItem as GiftItem }
  } catch (error) {
    logger.error('Unexpected error in createItem', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
