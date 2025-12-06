'use client'

import type { GiftItem, RetailerLink } from '@/types/database'
import { GiftItemRow } from './gift-item-row'
import { cn } from '@/lib/utils'

export interface GiftItemsTableProps {
  items: Array<GiftItem & { retailer_links?: RetailerLink[] }>
  selectedItemIds: Set<string>
  filter: 'all' | 'required' | 'optional' | 'high-value'
  isBlurred: boolean
  onRowClick: (itemId: string) => void
}

export function GiftItemsTable({
  items,
  selectedItemIds,
  filter,
  isBlurred,
  onRowClick,
}: GiftItemsTableProps) {
  // Filter items based on the current filter
  const filteredItems = items.filter((item) => {
    switch (filter) {
      case 'required':
        return item.status === 'required'
      case 'optional':
        return item.status === 'optional'
      case 'high-value':
        return item.value_tag === 'HIGH'
      case 'all':
      default:
        return true
    }
  })

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-lg border-2 border-[#2d2d2d] bg-[#0f0f0f]',
        isBlurred && 'blur-lg pointer-events-none select-none'
      )}
    >
      <table className="w-full border-collapse">
        <thead className="bg-[#1a1a1a]">
          <tr>
            <th className="w-[20%] px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] border-b-2 border-[#2d2d2d]">
              Item
            </th>
            <th className="w-[7%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] border-b-2 border-[#2d2d2d]">
              Status
            </th>
            <th className="w-[7%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] border-b-2 border-[#2d2d2d]">
              Price
            </th>
            <th className="w-[33%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] border-b-2 border-[#2d2d2d]">
              Retailers
            </th>
            <th className="w-[23%] px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#a1a1aa] border-b-2 border-[#2d2d2d]">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-8 text-center text-[#a1a1aa] bg-[#141414]"
              >
                No items found
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <GiftItemRow
                key={item.id}
                item={item}
                isSelected={selectedItemIds.has(item.id)}
                onRowClick={() => onRowClick(item.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
