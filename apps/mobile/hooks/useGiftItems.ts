import { useState, useCallback } from 'react'
import { getSupabase } from '../lib/supabase/client'
import type { GiftItem, GiftItemWithLinks, CreateItemInput, UpdateItemInput, RetailerLink } from '../lib/types'

interface UseGiftItemsReturn {
  items: GiftItemWithLinks[]
  isLoading: boolean
  error: string | null
  fetch: (listId: string) => Promise<void>
  create: (input: CreateItemInput) => Promise<{ success: boolean; item?: GiftItem; error?: string }>
  update: (id: string, input: UpdateItemInput) => Promise<{ success: boolean; error?: string }>
  remove: (id: string) => Promise<{ success: boolean; error?: string }>
  toggleComplete: (id: string, currentValue: boolean) => Promise<{ success: boolean; error?: string }>
  bulkMarkComplete: (ids: string[], value: boolean) => Promise<{ success: boolean; error?: string }>
}

export function useGiftItems(): UseGiftItemsReturn {
  const [items, setItems] = useState<GiftItemWithLinks[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async (listId: string) => {
    try {
      setIsLoading(true)
      const supabase = getSupabase()

      const { data, error: fetchError } = await supabase
        .from('gift_items')
        .select(`
          id,
          list_id,
          name,
          status,
          priority,
          price_low,
          price_high,
          notes,
          value_tag,
          product_images,
          research_content,
          sort_order,
          is_completed,
          created_at,
          updated_at,
          retailer_links (
            id,
            item_id,
            store_name,
            url,
            price,
            is_best_price,
            is_highend,
            created_at
          )
        `)
        .eq('list_id', listId)
        .order('sort_order', { ascending: true })

      if (fetchError) throw fetchError

      setItems(data || [])
      setError(null)
    } catch (err) {
      console.error('Fetch items error:', err)
      setError('Unable to load items. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const create = useCallback(async (input: CreateItemInput) => {
    try {
      const supabase = getSupabase()

      // Get max sort_order for this list
      const { data: maxOrder } = await supabase
        .from('gift_items')
        .select('sort_order')
        .eq('list_id', input.list_id)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()

      const nextOrder = (maxOrder?.sort_order || 0) + 1

      const { data, error: createError } = await supabase
        .from('gift_items')
        .insert({
          list_id: input.list_id,
          name: input.name.trim(),
          status: input.status || 'required',
          notes: input.notes?.trim() || null,
          price_low: input.price_low || null,
          price_high: input.price_high || null,
          value_tag: input.value_tag || null,
          sort_order: nextOrder,
        })
        .select()
        .single()

      if (createError) throw createError

      // Optimistically add to state with empty retailer_links
      setItems(prev => [...prev, { ...data, retailer_links: [] }])

      return { success: true, item: data }
    } catch (err) {
      console.error('Create item error:', err)
      return { success: false, error: 'Failed to create item. Please try again.' }
    }
  }, [])

  const update = useCallback(async (id: string, input: UpdateItemInput) => {
    try {
      const supabase = getSupabase()

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (input.name !== undefined) updateData.name = input.name.trim()
      if (input.status !== undefined) updateData.status = input.status
      if (input.notes !== undefined) updateData.notes = input.notes?.trim() || null
      if (input.price_low !== undefined) updateData.price_low = input.price_low
      if (input.price_high !== undefined) updateData.price_high = input.price_high
      if (input.value_tag !== undefined) updateData.value_tag = input.value_tag
      if (input.is_completed !== undefined) updateData.is_completed = input.is_completed

      const { error: updateError } = await supabase
        .from('gift_items')
        .update(updateData)
        .eq('id', id)

      if (updateError) throw updateError

      // Optimistically update state
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, ...updateData } : item
        )
      )

      return { success: true }
    } catch (err) {
      console.error('Update item error:', err)
      return { success: false, error: 'Failed to update item. Please try again.' }
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    // Store previous state for rollback
    const previousItems = items

    try {
      // Optimistically remove from state
      setItems(prev => prev.filter(item => item.id !== id))

      const supabase = getSupabase()

      const { error: deleteError } = await supabase
        .from('gift_items')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      return { success: true }
    } catch (err) {
      console.error('Delete item error:', err)
      // Rollback on error
      setItems(previousItems)
      return { success: false, error: 'Failed to delete item. Please try again.' }
    }
  }, [items])

  const toggleComplete = useCallback(async (id: string, currentValue: boolean) => {
    const newValue = !currentValue

    // Optimistic update
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, is_completed: newValue } : item
      )
    )

    try {
      const supabase = getSupabase()

      const { error: updateError } = await supabase
        .from('gift_items')
        .update({ is_completed: newValue })
        .eq('id', id)

      if (updateError) throw updateError

      return { success: true }
    } catch (err) {
      console.error('Toggle complete error:', err)
      // Rollback on error
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, is_completed: currentValue } : item
        )
      )
      return { success: false, error: 'Failed to update item. Please try again.' }
    }
  }, [])

  const bulkMarkComplete = useCallback(async (ids: string[], value: boolean) => {
    // Store previous state for rollback
    const previousItems = items

    // Optimistic update
    setItems(prev =>
      prev.map(item =>
        ids.includes(item.id) ? { ...item, is_completed: value } : item
      )
    )

    try {
      const supabase = getSupabase()

      const { error: updateError } = await supabase
        .from('gift_items')
        .update({ is_completed: value })
        .in('id', ids)

      if (updateError) throw updateError

      return { success: true }
    } catch (err) {
      console.error('Bulk mark complete error:', err)
      // Rollback on error
      setItems(previousItems)
      return { success: false, error: 'Failed to update items. Please try again.' }
    }
  }, [items])

  return {
    items,
    isLoading,
    error,
    fetch,
    create,
    update,
    remove,
    toggleComplete,
    bulkMarkComplete,
  }
}
