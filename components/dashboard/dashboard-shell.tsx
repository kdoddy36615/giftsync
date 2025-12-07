'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { GiftList, GiftItem, RetailerLink } from '@/types/database'
import type { FilterType } from '@/types/dashboard'
import { useSelection } from '@/hooks/use-selection'
import { usePrivacyBlur } from '@/hooks/use-privacy-blur'
import { useBulkOpen, type GiftItemWithLinks } from '@/hooks/use-bulk-open'
import { useToast } from '@/hooks/use-toast'
import { markItemsComplete } from '@/lib/actions/mark-complete'
import { ToastContainer } from '@/components/ui/toast'
import { DashboardErrorBoundary } from '@/components/error-boundary'
import { GiftListTabs } from './gift-list-tabs'
import { FilterBar } from './filter-bar'
import { SelectedItemsBanner } from './selected-items-banner'
import { TotalsDisplay } from './totals-display'
import { GiftItemsTable } from './gift-items-table'
import { ItemFormModal } from '@/components/modals/item-form-modal'
import { ListFormModal } from '@/components/modals/list-form-modal'
import { InviteModal } from './invite-modal'

export interface DashboardShellProps {
  lists: GiftList[]
  items: GiftItem[]
  links: RetailerLink[]
}

export type { GiftItemWithLinks }

export function DashboardShell({ lists, items, links }: DashboardShellProps) {
  const router = useRouter()
  const [activeListId, setActiveListId] = useState<string | null>(
    lists.length > 0 ? lists[0].id : null
  )
  const [filter, setFilter] = useState<FilterType>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GiftItem | null>(null)
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  const [editingList, setEditingList] = useState<GiftList | null>(null)
  const [sharingList, setSharingList] = useState<GiftList | null>(null)
  const [isMarkingPurchased, setIsMarkingPurchased] = useState(false)

  const { isBlurred } = usePrivacyBlur()
  const { openTabs } = useBulkOpen()
  const { toasts, dismissToast, success, error } = useToast()

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
  const handleClearSelection = () => {
    if (activeListId) clearSelection(activeListId)
  }

  const handleOpenCheapest = () => {
    const count = selectedItems.length
    openTabs(selectedItems, 'cheapest')
    success(`Opening cheapest options for ${count} ${count === 1 ? 'item' : 'items'}`)
  }

  const handleMarkPurchased = async () => {
    setIsMarkingPurchased(true)
    try {
      const itemIds = Array.from(selectedItemIds) as string[]
      const count = itemIds.length
      const result = await markItemsComplete(itemIds, true)
      if (result.success) {
        success(`Marked ${count} ${count === 1 ? 'item' : 'items'} as purchased`)
        // Clear selection after marking complete
        if (activeListId) clearSelection(activeListId)
        // Refresh data to show updated state
        router.refresh()
      } else {
        console.error('Failed to mark items as purchased:', result.error)
        error('Failed to mark items as purchased. Please try again.')
      }
    } finally {
      setIsMarkingPurchased(false)
    }
  }

  const handleRowClick = (itemId: string) => {
    if (activeListId) {
      toggleSelection(activeListId, itemId)
    }
  }

  const handleAddItem = () => {
    setIsAddModalOpen(true)
  }

  const handleEditItem = (item: GiftItem) => {
    setEditingItem(item)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setEditingItem(null)
  }

  const handleCreateList = () => {
    setIsCreateListOpen(true)
  }

  const handleEditList = (list: GiftList) => {
    setEditingList(list)
  }

  const handleCloseListModal = () => {
    setIsCreateListOpen(false)
    setEditingList(null)
  }

  const handleListCreated = (listId: string) => {
    // Switch to the newly created list
    setActiveListId(listId)
  }

  const handleShareList = (list: GiftList) => {
    setSharingList(list)
  }

  const handleCloseShareModal = () => {
    setSharingList(null)
  }

  // Empty state
  if (lists.length === 0) {
    return (
      <>
        <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-12 text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold text-[#e4e4e7] mb-2">
            Welcome to GiftSync!
          </h2>
          <p className="text-[#a1a1aa] mb-6">
            Plan gifts for multiple people, compare prices, and shop smarter with bulk actions.
          </p>
          <button
            onClick={handleCreateList}
            className="bg-[#6366f1] hover:bg-[#5558e3] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            + Create Your First Gift List
          </button>
        </div>

        {/* Create List Modal */}
        <ListFormModal
          open={isCreateListOpen}
          onClose={handleCloseListModal}
          onListCreated={handleListCreated}
        />
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tabs + Filter + Add Button in header row */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <DashboardErrorBoundary>
          <GiftListTabs
            lists={lists}
            activeListId={activeListId || ''}
            selectionCounts={selectionCounts}
            onTabChange={setActiveListId}
            onCreateList={handleCreateList}
            onEditList={handleEditList}
            onShareList={handleShareList}
          />
        </DashboardErrorBoundary>

        <div className="flex gap-4 items-center">
          <FilterBar activeFilter={filter} onFilterChange={setFilter} />
          <button
            onClick={handleAddItem}
            className="bg-[#6366f1] hover:bg-[#5558e3] text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            + Add Item
          </button>
        </div>
      </div>

      {/* Selected Items Banner - only shows when items selected */}
      {selectedCount > 0 && (
        <SelectedItemsBanner
          selectedItems={selectedItems}
          onOpenCheapest={handleOpenCheapest}
          onMarkPurchased={handleMarkPurchased}
          onClearSelection={handleClearSelection}
          isMarkingPurchased={isMarkingPurchased}
        />
      )}

      {/* Empty State for List with No Items */}
      <DashboardErrorBoundary>
        {activeListItems.length === 0 ? (
          <div className="bg-[#141414] border border-[#2d2d2d] rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-[#e4e4e7] mb-2">
              No items in this list yet
            </h3>
            <p className="text-[#a1a1aa] mb-6">
              Start adding gift ideas to compare prices and stay organized.
            </p>
            <button
              onClick={handleAddItem}
              className="bg-[#6366f1] hover:bg-[#5558e3] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              + Add First Item
            </button>
          </div>
        ) : (
          <>
            {/* Totals Display */}
            <TotalsDisplay items={activeListItems} />

            {/* Gift Items Table */}
            <GiftItemsTable
              items={activeListItems}
              selectedItemIds={selectedItemIds}
              filter={filter}
              isBlurred={isBlurred}
              onRowClick={handleRowClick}
              onEditItem={handleEditItem}
            />
          </>
        )}
      </DashboardErrorBoundary>

      {/* Add/Edit Item Modal */}
      <ItemFormModal
        open={isAddModalOpen || editingItem !== null}
        onClose={handleCloseModal}
        listId={activeListId || ''}
        item={editingItem || undefined}
      />

      {/* Create/Edit List Modal */}
      <ListFormModal
        open={isCreateListOpen || editingList !== null}
        onClose={handleCloseListModal}
        list={editingList || undefined}
        onListCreated={handleListCreated}
      />

      {/* Share/Invite Modal */}
      {sharingList && (
        <InviteModal
          open={true}
          onClose={handleCloseShareModal}
          list={sharingList}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={dismissToast} />
    </div>
  )
}
