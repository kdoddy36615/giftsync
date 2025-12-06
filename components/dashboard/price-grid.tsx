'use client'

import type { RetailerLink } from '@/types/database'
import { PriceItem } from './price-item'

export interface PriceGridProps {
  links: RetailerLink[]
}

export function PriceGrid({ links }: PriceGridProps) {
  if (!links || links.length === 0) {
    return (
      <div className="rounded-lg border border-[#2d2d2d] bg-[#141414] px-6 py-8 text-center text-[#a1a1aa]">
        No retailer links
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
      {links.map((link) => (
        <PriceItem key={link.id} link={link} />
      ))}
    </div>
  )
}
