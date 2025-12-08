import { useState, useCallback } from 'react'
import { getSupabase } from '../lib/supabase/client'
import type { GiftList, CreateListInput, UpdateListInput } from '../lib/types'

// Default colors for new lists
export const LIST_COLORS = [
  '#6366f1', // indigo (default)
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
] as const

interface GiftListWithMeta extends GiftList {
  is_shared?: boolean
  is_owner?: boolean
  role?: 'viewer' | 'editor'
}

interface UseGiftListsReturn {
  lists: GiftListWithMeta[]
  sharedLists: GiftListWithMeta[]
  isLoading: boolean
  error: string | null
  fetch: () => Promise<void>
  create: (input: CreateListInput) => Promise<{ success: boolean; list?: GiftList; error?: string }>
  update: (id: string, input: UpdateListInput) => Promise<{ success: boolean; error?: string }>
  remove: (id: string) => Promise<{ success: boolean; error?: string }>
}

export function useGiftLists(): UseGiftListsReturn {
  const [lists, setLists] = useState<GiftListWithMeta[]>([])
  const [sharedLists, setSharedLists] = useState<GiftListWithMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        return
      }

      // Fetch user's own lists
      const { data: ownLists, error: ownError } = await supabase
        .from('gift_lists')
        .select(`
          id,
          user_id,
          name,
          color,
          created_at,
          updated_at,
          gift_items(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ownError) throw ownError

      const listsWithCount = ownLists?.map(list => ({
        ...list,
        item_count: list.gift_items?.[0]?.count || 0,
        is_owner: true,
        is_shared: false,
      })) || []

      // Fetch shared lists (lists where user is a collaborator)
      const { data: collaborations, error: collabError } = await supabase
        .from('list_collaborators')
        .select(`
          role,
          gift_lists (
            id,
            user_id,
            name,
            color,
            created_at,
            updated_at,
            gift_items(count)
          )
        `)
        .eq('user_id', user.id)

      if (collabError) {
        console.warn('Could not fetch shared lists:', collabError)
      }

      const sharedListsData = collaborations?.map(collab => {
        const list = collab.gift_lists as unknown as GiftList & { gift_items: { count: number }[] }
        return {
          ...list,
          item_count: list.gift_items?.[0]?.count || 0,
          is_owner: false,
          is_shared: true,
          role: collab.role as 'viewer' | 'editor',
        }
      }).filter(list => list.id) || []

      setLists(listsWithCount)
      setSharedLists(sharedListsData)
      setError(null)
    } catch (err) {
      console.error('Fetch lists error:', err)
      setError('Unable to load gift lists. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const create = useCallback(async (input: CreateListInput) => {
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data, error: createError } = await supabase
        .from('gift_lists')
        .insert({
          user_id: user.id,
          name: input.name.trim(),
          color: input.color || LIST_COLORS[0],
        })
        .select()
        .single()

      if (createError) throw createError

      // Optimistically add to state
      setLists(prev => [{ ...data, item_count: 0, is_owner: true, is_shared: false }, ...prev])

      return { success: true, list: data }
    } catch (err) {
      console.error('Create list error:', err)
      return { success: false, error: 'Failed to create list. Please try again.' }
    }
  }, [])

  const update = useCallback(async (id: string, input: UpdateListInput) => {
    try {
      const supabase = getSupabase()

      const { error: updateError } = await supabase
        .from('gift_lists')
        .update({
          ...(input.name && { name: input.name.trim() }),
          ...(input.color && { color: input.color }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Optimistically update state
      setLists(prev =>
        prev.map(list =>
          list.id === id
            ? {
                ...list,
                ...(input.name && { name: input.name.trim() }),
                ...(input.color && { color: input.color }),
              }
            : list
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Update list error:', err)
      return { success: false, error: 'Failed to update list. Please try again.' }
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    // Store previous state for rollback
    const previousLists = lists

    try {
      // Optimistically remove from state
      setLists(prev => prev.filter(list => list.id !== id))

      const supabase = getSupabase()

      const { error: deleteError } = await supabase
        .from('gift_lists')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      return { success: true }
    } catch (err) {
      console.error('Delete list error:', err)
      // Rollback on error
      setLists(previousLists)
      return { success: false, error: 'Failed to delete list. Please try again.' }
    }
  }, [lists])

  return {
    lists,
    sharedLists,
    isLoading,
    error,
    fetch,
    create,
    update,
    remove,
  }
}
