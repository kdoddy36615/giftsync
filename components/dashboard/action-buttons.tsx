'use client'

import { Button } from '@/components/ui/button'
import type { BulkOpenTarget } from '@/types/dashboard'

export interface ActionButtonsProps {
  selectedCount: number
  onSelectAll: () => void
  onSelectRequired: () => void
  onSelectOptional: () => void
  onClearSelection: () => void
  onOpenCheapest: () => void
  onOpenHighend: () => void
  onOpenAmazon: () => void
  onMarkPurchased: () => void
  onUnmarkPurchased: () => void
}

/**
 * Action buttons component for bulk operations on gift items
 * Provides selection helpers and bulk action buttons
 */
export function ActionButtons({
  selectedCount,
  onSelectAll,
  onSelectRequired,
  onSelectOptional,
  onClearSelection,
  onOpenCheapest,
  onOpenHighend,
  onOpenAmazon,
  onMarkPurchased,
  onUnmarkPurchased,
}: ActionButtonsProps) {
  // Disable bulk action buttons when nothing is selected
  const isDisabled = selectedCount === 0

  return (
    <div className="space-y-3">
      {/* Selection Helper Buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider min-w-[140px]">
          Selection:
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={onSelectAll}
          className="border border-indigo-500 bg-transparent text-indigo-500 hover:bg-indigo-500 hover:text-white"
        >
          Select All
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onSelectRequired}
          className="border border-indigo-500 bg-transparent text-indigo-500 hover:bg-indigo-500 hover:text-white"
        >
          Select Required
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onSelectOptional}
          className="border border-indigo-500 bg-transparent text-indigo-500 hover:bg-indigo-500 hover:text-white"
        >
          Select Optional
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearSelection}
          className="border border-indigo-500 bg-transparent text-indigo-500 hover:bg-indigo-500 hover:text-white"
        >
          Clear
        </Button>
      </div>

      {/* Open Tabs Buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider min-w-[140px]">
          Open in Tabs:
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenCheapest}
          disabled={isDisabled}
        >
          Open Cheapest
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenHighend}
          disabled={isDisabled}
        >
          Open Highend
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenAmazon}
          disabled={isDisabled}
        >
          Open Amazon
        </Button>
      </div>

      {/* Purchase Status Buttons */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider min-w-[140px]">
          Mark Purchased:
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={onMarkPurchased}
          disabled={isDisabled}
          className="bg-red-600 hover:bg-red-700"
        >
          Mark as Purchased
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onUnmarkPurchased}
          disabled={isDisabled}
        >
          Unmark
        </Button>
      </div>
    </div>
  )
}
