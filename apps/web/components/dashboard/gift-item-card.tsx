'use client'

import type { GiftItem, RetailerLink } from '@/types/database'
import { StatusBadge } from './status-badge'
import { PriceItem } from './price-item'

export interface GiftItemCardProps {
  item: GiftItem & { retailer_links?: RetailerLink[] }
  isSelected: boolean
  onCardClick: () => void
  onEditItem?: (item: GiftItem) => void
}

/**
 * Mobile card view for gift items
 * Optimized for small screens with vertical layout
 */
export function GiftItemCard({
  item,
  isSelected,
  onCardClick,
  onEditItem,
}: GiftItemCardProps) {
  const cardBaseStyles =
    'bg-[#141414] border-2 border-[#2d2d2d] rounded-lg p-4 transition-all cursor-pointer hover:border-[#6366f1]'

  // Selected state styles
  const selectedStyles = isSelected
    ? 'border-[#6366f1] bg-[rgba(99,102,241,0.12)]'
    : ''

  // Completed state styles
  const completedStyles = item.is_completed
    ? 'border-[#dc2626] bg-[rgba(220,38,38,0.15)] opacity-70'
    : ''

  const cardStyles = `${cardBaseStyles} ${completedStyles || selectedStyles}`
  const nameStyles = item.is_completed
    ? 'line-through text-[#a1a1aa]'
    : 'font-semibold text-white'

  const priceRange =
    item.price_low && item.price_high
      ? `$${item.price_low}-${item.price_high}`
      : 'N/A'

  const retailerLinks = item.retailer_links || []

  return (
    <div className={cardStyles} onClick={onCardClick}>
      {/* Header: Name + Edit Button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`text-base flex-1 ${nameStyles}`}>{item.name}</div>
        {onEditItem && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEditItem(item)
            }}
            className="text-[#71717a] hover:text-[#6366f1] transition-colors p-1 flex-shrink-0"
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
      </div>

      {/* Status + Price Range */}
      <div className="flex items-center gap-3 mb-3">
        <StatusBadge status={item.status} />
        <span className="text-sm text-[#a1a1aa]">{priceRange}</span>
      </div>

      {/* Retailer Links */}
      {retailerLinks.length > 0 && (
        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-2">
            Retailers
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {retailerLinks.map((link) => (
              <PriceItem key={link.id} link={link} />
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {item.notes && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#71717a] mb-1">
            Notes
          </div>
          <div className="text-sm text-[#a1a1aa]">{item.notes}</div>
        </div>
      )}
    </div>
  )
}
