'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { GiftList, GiftItem } from '@/types/database'
import type { SelectionState } from '@/types/dashboard'

export interface GiftItemWithLinks extends GiftItem {
  retailer_links: Array<{
    id: string
    item_id: string
    store_name: string
    url: string
    price: number | null
    is_best_price: boolean
    is_highend: boolean
    created_at: string
  }>
}

export function useSelection(lists: GiftList[], itemsWithLinks: GiftItemWithLinks[]) {
  const [selections, setSelections] = useState<SelectionState>(new Map())

  // Store items in a ref so selection functions can access them
  const itemsRef = useRef<GiftItemWithLinks[]>(itemsWithLinks)

  // Update ref when items change
  useEffect(() => {
    itemsRef.current = itemsWithLinks
  }, [itemsWithLinks])

  const toggleSelection = useCallback((listId: string, itemId: string) => {
    setSelections((prev) => {
      const newSelection = new Map(prev)
      // Create a new Set to avoid mutating previous state
      const listSelection = new Set(newSelection.get(listId) || new Set<string>())

      if (listSelection.has(itemId)) {
        listSelection.delete(itemId)
      } else {
        listSelection.add(itemId)
      }

      if (listSelection.size === 0) {
        newSelection.delete(listId)
      } else {
        newSelection.set(listId, listSelection)
      }

      return newSelection
    })
  }, [])

  const selectAll = useCallback((listId: string) => {
    const listItems = itemsRef.current.filter((item) => item.list_id === listId)
    const allItemIds = new Set(listItems.map((item) => item.id))
    setSelections((prev) => {
      const newSelection = new Map(prev)
      newSelection.set(listId, allItemIds)
      return newSelection
    })
  }, [])

  const selectRequired = useCallback((listId: string) => {
    const listItems = itemsRef.current.filter((item) => item.list_id === listId)
    const requiredItemIds = new Set(
      listItems.filter((item) => item.status === 'required').map((item) => item.id)
    )
    setSelections((prev) => {
      const newSelection = new Map(prev)
      newSelection.set(listId, requiredItemIds)
      return newSelection
    })
  }, [])

  const selectOptional = useCallback((listId: string) => {
    const listItems = itemsRef.current.filter((item) => item.list_id === listId)
    const optionalItemIds = new Set(
      listItems.filter((item) => item.status === 'optional').map((item) => item.id)
    )
    setSelections((prev) => {
      const newSelection = new Map(prev)
      newSelection.set(listId, optionalItemIds)
      return newSelection
    })
  }, [])

  const clearSelection = useCallback((listId: string) => {
    setSelections((prev) => {
      const newSelection = new Map(prev)
      newSelection.delete(listId)
      return newSelection
    })
  }, [])

  const isSelected = useCallback(
    (listId: string, itemId: string) => {
      return selections.get(listId)?.has(itemId) ?? false
    },
    [selections]
  )

  return {
    selections,
    toggleSelection,
    selectAll,
    selectRequired,
    selectOptional,
    clearSelection,
    isSelected,
  }
}
