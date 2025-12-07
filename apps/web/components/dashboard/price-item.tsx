'use client'

import type { RetailerLink } from '@/types/database'
import { sanitizeUrl } from '@/lib/utils/url-validator'

export interface PriceItemProps {
  link: RetailerLink
}

export function PriceItem({ link }: PriceItemProps) {
  const priceColor = link.is_best_price ? 'text-[#10b981]' : 'text-[#6366f1]'
  const price = link.price ? `$${link.price}` : 'N/A'
  const safeUrl = sanitizeUrl(link.url)

  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="block bg-[#2d2d2d] rounded px-2 py-1.5 transition-all hover:bg-[#3d3d3d] hover:-translate-y-0.5"
    >
      <div className="text-xs text-[#a1a1aa] mb-0.5">{link.store_name}</div>
      <div className={`text-sm font-bold ${priceColor}`}>{price}</div>
    </a>
  )
}
