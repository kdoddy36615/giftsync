'use client'

import type { GiftItem, RetailerLink } from '@/types/database'
import { StatusBadge } from './status-badge'
import { PriceItem } from './price-item'

export interface GiftItemRowProps {
  item: GiftItem & { retailer_links?: RetailerLink[] }
  isSelected: boolean
  onRowClick: () => void
  onEditItem?: (item: GiftItem) => void
}

export function GiftItemRow({
  item,
  isSelected,
  onRowClick,
  onEditItem,
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

      {/* Edit Icon */}
      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
        {onEditItem && (
          <button
            onClick={() => onEditItem(item)}
            className="text-[#71717a] hover:text-[#6366f1] transition-colors p-1"
            aria-label="Edit item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </td>
    </tr>
  )
}
