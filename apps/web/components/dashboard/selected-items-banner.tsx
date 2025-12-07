'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import type { GiftItemWithLinks } from '@/hooks/use-bulk-open'

export interface SelectedItemsBannerProps {
  selectedItems: GiftItemWithLinks[]
  onOpenCheapest: () => void
  onMarkPurchased: () => void
  onClearSelection: () => void
  isMarkingPurchased?: boolean
}

/**
 * Sticky banner that appears when items are selected
 * Shows count, total price, and quick action buttons
 */
export function SelectedItemsBanner({
  selectedItems,
  onOpenCheapest,
  onMarkPurchased,
  onClearSelection,
  isMarkingPurchased = false,
}: SelectedItemsBannerProps) {
  // Calculate total price from selected items
  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      // Find cheapest price for this item
      const prices = item.retailer_links
        .map((link) => link.price)
        .filter((price): price is number => price !== null)

      if (prices.length === 0) return sum

      const cheapest = Math.min(...prices)
      return sum + cheapest
    }, 0)
  }, [selectedItems])

  const count = selectedItems.length

  // Don't render if no items selected
  if (count === 0) return null

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] border-2 border-[#6366f1] rounded-lg shadow-lg shadow-[rgba(99,102,241,0.4)] p-4 mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Count and Total */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-white font-bold text-lg">
              {count} {count === 1 ? 'item' : 'items'} selected
            </div>
            <div className="text-indigo-100 text-sm">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenCheapest}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-40 hover:border-opacity-60 font-semibold"
          >
            Open Cheapest
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onMarkPurchased}
            loading={isMarkingPurchased}
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-semibold"
          >
            Mark Purchased
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearSelection}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-40 hover:border-opacity-60 font-semibold"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
