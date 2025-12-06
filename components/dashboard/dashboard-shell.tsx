'use client'

import { useState } from 'react'
import type { GiftList, GiftItem, RetailerLink } from '@/types/database'
import type { FilterType } from '@/types/dashboard'
import { useSelection } from '@/hooks/use-selection'
import { usePrivacyBlur } from '@/hooks/use-privacy-blur'
import { useBulkOpen, type GiftItemWithLinks } from '@/hooks/use-bulk-open'
import { markItemsComplete } from '@/lib/actions/mark-complete'
import { GiftListTabs } from './gift-list-tabs'
import { FilterBar } from './filter-bar'
import { ActionButtons } from './action-buttons'
import { TotalsDisplay } from './totals-display'
import { GiftItemsTable } from './gift-items-table'

export interface DashboardShellProps {
  lists: GiftList[]
  items: GiftItem[]
  links: RetailerLink[]
}

export type { GiftItemWithLinks }

export function DashboardShell({ lists, items, links }: DashboardShellProps) {
  const [activeListId, setActiveListId] = useState<string | null>(
    lists.length > 0 ? lists[0].id : null
  )
  const [filter, setFilter] = useState<FilterType>('all')

  const { isBlurred } = usePrivacyBlur()
  const { openTabs } = useBulkOpen()

  // Combine items with their retailer links
  const itemsWithLinks: GiftItemWithLinks[] = items.map((item) => ({
    ...item,
    retailer_links: links.filter((link) => link.item_id === item.id),
  }))

  // Filter items for the active list
  const activeListItems = itemsWithLinks.filter(
    (item) => item.list_id === activeListId
  )

  // Selection state management
  const {
    selections,
    toggleSelection,
    selectAll,
    selectRequired,
    selectOptional,
    clearSelection,
  } = useSelection(lists, itemsWithLinks)

  const selectedItemIds = activeListId ? (selections.get(activeListId) || new Set<string>()) : new Set<string>()
  const selectedCount = selectedItemIds.size

  // Get selected items
  const selectedItems = activeListItems.filter((item) =>
    selectedItemIds.has(item.id)
  )

  // Selection counts per list for tab badges
  const selectionCounts = new Map<string, number>()
  lists.forEach((list) => {
    const count = selections.get(list.id)?.size || 0
    selectionCounts.set(list.id, count)
  })

  // Action handlers
  const handleSelectAll = () => {
    if (activeListId) selectAll(activeListId)
  }

  const handleSelectRequired = () => {
    if (activeListId) selectRequired(activeListId)
  }

  const handleSelectOptional = () => {
    if (activeListId) selectOptional(activeListId)
  }

  const handleClearSelection = () => {
    if (activeListId) clearSelection(activeListId)
  }

  const handleOpenCheapest = () => {
    openTabs(selectedItems, 'cheapest')
  }

  const handleOpenHighend = () => {
    openTabs(selectedItems, 'highend')
  }

  const handleOpenAmazon = () => {
    openTabs(selectedItems, 'amazon')
  }

  const handleMarkPurchased = async () => {
    const itemIds = Array.from(selectedItemIds) as string[]
    const result = await markItemsComplete(itemIds, true)
    if (result.success) {
      // Clear selection after marking complete
      if (activeListId) clearSelection(activeListId)
      // Refresh page to show updated data
      window.location.reload()
    } else {
      console.error('Failed to mark items as purchased:', result.error)
      alert('Failed to mark items as purchased. Please try again.')
    }
  }

  const handleUnmarkPurchased = async () => {
    const itemIds = Array.from(selectedItemIds) as string[]
    const result = await markItemsComplete(itemIds, false)
    if (result.success) {
      // Clear selection after unmarking
      if (activeListId) clearSelection(activeListId)
      // Refresh page to show updated data
      window.location.reload()
    } else {
      console.error('Failed to unmark items:', result.error)
      alert('Failed to unmark items. Please try again.')
    }
  }

  const handleRowClick = (itemId: string) => {
    if (activeListId) {
      toggleSelection(activeListId, itemId)
    }
  }

  // Empty state
  if (lists.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-12 text-center">
        <h2 className="text-2xl font-bold text-[#e4e4e7] mb-2">
          No Gift Lists Yet
        </h2>
        <p className="text-[#a1a1aa]">
          Create your first gift list to start planning
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar activeFilter={filter} onFilterChange={setFilter} />

      {/* Gift List Tabs */}
      <GiftListTabs
        lists={lists}
        activeListId={activeListId || ''}
        selectionCounts={selectionCounts}
        onTabChange={setActiveListId}
      />

      {/* Action Buttons */}
      <ActionButtons
        selectedCount={selectedCount}
        onSelectAll={handleSelectAll}
        onSelectRequired={handleSelectRequired}
        onSelectOptional={handleSelectOptional}
        onClearSelection={handleClearSelection}
        onOpenCheapest={handleOpenCheapest}
        onOpenHighend={handleOpenHighend}
        onOpenAmazon={handleOpenAmazon}
        onMarkPurchased={handleMarkPurchased}
        onUnmarkPurchased={handleUnmarkPurchased}
      />

      {/* Totals Display */}
      <TotalsDisplay items={activeListItems} />

      {/* Gift Items Table */}
      <GiftItemsTable
        items={activeListItems}
        selectedItemIds={selectedItemIds}
        filter={filter}
        isBlurred={isBlurred}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
