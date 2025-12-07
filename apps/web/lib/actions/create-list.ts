'use server'

import { createClient } from '@/lib/supabase/server'
import type { GiftList } from '@/types/database'
import { logger } from '@/lib/utils/logger'
import { validateListName } from '@/lib/constants/validation'
import { DEFAULT_COLORS } from '@/lib/constants/colors'

export interface CreateListInput {
  name: string
  color?: string
}

/**
 * Create a new gift list
 * @param data - The list data (name and optional color)
 * @returns Response with success status and the created list or error message
 */
export async function createList(
  data: CreateListInput
): Promise<{ success: true; list: GiftList } | { success: false; error: string }> {
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
    const validationError = validateListName(data.name)
    if (validationError) {
      return { success: false, error: validationError }
    }

    const trimmedName = data.name.trim()

    // 3. Insert new list
    const { data: newList, error: insertError } = await supabase
      .from('gift_lists')
      // @ts-expect-error - Supabase generated types have issues with insert operations
      .insert({
        user_id: user.id,
        name: trimmedName,
        color: data.color || DEFAULT_COLORS.LIST,
      })
      .select()
      .single()

    if (insertError || !newList) {
      logger.error('Failed to create list', insertError, { userId: user.id })
      return { success: false, error: 'Failed to create list' }
    }

    return { success: true, list: newList as GiftList }
  } catch (error) {
    logger.error('Unexpected error in createList', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
