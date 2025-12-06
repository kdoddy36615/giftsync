'use server'

import { createClient } from '@/lib/supabase/server'

export interface MarkItemsCompleteResponse {
  success: boolean
  error?: string
  updatedCount?: number
}

/**
 * Mark gift items as completed/purchased or uncompleted
 * @param itemIds - Array of gift item IDs to update
 * @param completed - Whether to mark as completed (true) or uncompleted (false)
 * @returns Response object with success status and optional error message
 */
export async function markItemsComplete(
  itemIds: string[],
  completed: boolean
): Promise<MarkItemsCompleteResponse> {
  try {
    // Validate input
    if (!itemIds || itemIds.length === 0) {
      return {
        success: false,
        error: 'No items provided to mark complete',
      }
    }

    const supabase = await createClient()

    // 1. Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // 2. Verify ownership - join through gift_lists to check user_id
    const { data: items, error: verifyError } = await supabase
      .from('gift_items')
      .select('id, list_id, gift_lists!inner(user_id)')
      .in('id', itemIds)

    if (verifyError || !items) {
      console.error('Error verifying ownership:', verifyError)
      return {
        success: false,
        error: 'Failed to verify ownership',
      }
    }

    // 3. Check all items belong to current user
    const allOwned = items.every(
      (item: any) => item.gift_lists.user_id === user.id
    )

    if (!allOwned || items.length !== itemIds.length) {
      console.warn(`Unauthorized access attempt: user ${user.id} tried to modify items they don't own`)
      return {
        success: false,
        error: 'Unauthorized: Cannot modify items you do not own',
      }
    }

    // 4. Now safe to update
    const { data, error } = await supabase
      .from('gift_items')
      // @ts-expect-error - is_completed field exists in database
      .update({ is_completed: completed })
      .in('id', itemIds)
      .select('id')

    if (error) {
      console.error('Error marking items complete:', error)
      return {
        success: false,
        error: `Failed to update items: ${error.message}`,
      }
    }

    return {
      success: true,
      updatedCount: data?.length || 0,
    }
  } catch (error) {
    console.error('Unexpected error in markItemsComplete:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while updating items',
    }
  }
}
