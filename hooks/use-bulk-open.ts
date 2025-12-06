'use client'

import { useCallback } from 'react'
import type { GiftItem, RetailerLink } from '@/types/database'
import type { BulkOpenTarget } from '@/types/dashboard'

export type GiftItemWithLinks = GiftItem & {
  retailer_links: RetailerLink[]
}

export function useBulkOpen() {
  const openTabs = useCallback(
    (items: GiftItemWithLinks[], target: BulkOpenTarget) => {
      // Extract links to open based on target type
      const linksToOpen: RetailerLink[] = []

      items.forEach((item) => {
        let link: RetailerLink | undefined

        if (target === 'cheapest') {
          link = item.retailer_links.find((l) => l.is_best_price)
        } else if (target === 'highend') {
          link = item.retailer_links.find((l) => l.is_highend)
        } else if (target === 'amazon') {
          link = item.retailer_links.find((l) =>
            l.store_name?.toLowerCase().includes('amazon')
          )
        }

        if (link) {
          linksToOpen.push(link)
        }
      })

      // Open all links in new tabs with staggered delay to avoid popup blocker
      linksToOpen.forEach((link, index) => {
        setTimeout(() => {
          window.open(link.url, '_blank', 'noopener,noreferrer')
        }, index * 300)
      })
    },
    []
  )

  return { openTabs }
}
