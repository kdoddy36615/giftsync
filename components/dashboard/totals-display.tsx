'use client'

import * as React from 'react'
import { calculateTotals, formatPriceRange } from '@/lib/utils/totals'
import type { GiftItem } from '@/types/database'

export interface TotalsDisplayProps {
  items: GiftItem[]
}

export const TotalsDisplay: React.FC<TotalsDisplayProps> = ({ items }) => {
  const totals = calculateTotals(items)

  return (
    <div className="flex flex-col gap-3 min-w-[280px]">
      <div className="bg-[#141414] px-5 py-4 rounded-md border-l-4 border-[#10b981]">
        <div className="text-[0.85em] uppercase tracking-wide font-semibold text-[#a1a1aa] mb-1">
          Required
        </div>
        <div className="text-[1.3em] font-bold text-white">
          {formatPriceRange(totals.required.low, totals.required.high)}
        </div>
      </div>

      <div className="bg-[#141414] px-5 py-4 rounded-md border-l-4 border-[#f59e0b]">
        <div className="text-[0.85em] uppercase tracking-wide font-semibold text-[#a1a1aa] mb-1">
          Optional
        </div>
        <div className="text-[1.3em] font-bold text-white">
          {formatPriceRange(totals.optional.low, totals.optional.high)}
        </div>
      </div>

      <div className="bg-[#141414] px-5 py-4 rounded-md border-l-4 border-[#6366f1]">
        <div className="text-[0.85em] uppercase tracking-wide font-semibold text-[#a1a1aa] mb-1">
          Combined Total
        </div>
        <div className="text-[1.3em] font-bold text-white">
          {formatPriceRange(totals.combined.low, totals.combined.high)}
        </div>
      </div>
    </div>
  )
}
