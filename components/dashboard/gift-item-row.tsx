'use client'

import type { GiftItem, RetailerLink } from '@/types/database'
import { StatusBadge } from './status-badge'
import { PriceItem } from './price-item'

export interface GiftItemRowProps {
  item: GiftItem & { retailer_links?: RetailerLink[] }
  isSelected: boolean
  onRowClick: () => void
}

export function GiftItemRow({
  item,
  isSelected,
  onRowClick,
}: GiftItemRowProps) {
  const rowBaseStyles =
    'border-b border-[#2d2d2d] transition-all cursor-pointer hover:bg-[#242424]'

  // Selected state styles
  const selectedStyles = isSelected
    ? 'bg-[rgba(99,102,241,0.12)] border-l-4 border-l-[#6366f1]'
    : ''

  // Completed state styles
  const completedStyles = item.is_completed
    ? 'bg-[rgba(220,38,38,0.15)] border-l-4 border-l-[#dc2626] opacity-70'
    : ''

  const rowStyles = `${rowBaseStyles} ${completedStyles || selectedStyles}`
  const nameStyles = item.is_completed ? 'line-through text-[#a1a1aa]' : 'font-semibold text-white'

  const priceRange = item.price_low && item.price_high
    ? `$${item.price_low}-${item.price_high}`
    : 'N/A'

  const retailerLinks = item.retailer_links || []

  return (
    <tr className={rowStyles} onClick={onRowClick}>
      {/* Item Name */}
      <td className="px-6 py-3 pr-4">
        <div className={`text-base ${nameStyles}`}>{item.name}</div>
      </td>

      {/* Status Badge */}
      <td className="px-3 py-3">
        <StatusBadge status={item.status} />
      </td>

      {/* Price Range */}
      <td className="px-3 py-3 text-[#a1a1aa] text-sm">
        {priceRange}
      </td>

      {/* Retailer Price Grid */}
      <td
        className="px-3 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))' }}>
          {retailerLinks.map((link) => (
            <PriceItem key={link.id} link={link} />
          ))}
        </div>
      </td>

      {/* Notes */}
      <td className="px-3 py-3 text-sm text-[#a1a1aa]">
        {item.notes || ''}
      </td>
    </tr>
  )
}
