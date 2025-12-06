'use client'

import type { GiftList } from '@/types/database'

export interface GiftListTabsProps {
  lists: GiftList[]
  activeListId: string
  onTabChange: (listId: string) => void
  selectionCounts: Map<string, number>
}

export function GiftListTabs({
  lists,
  activeListId,
  onTabChange,
  selectionCounts,
}: GiftListTabsProps) {
  return (
    <div className="flex gap-3 px-5 pb-4">
      {lists.map((list) => {
        const isActive = list.id === activeListId
        const count = selectionCounts.get(list.id) || 0

        // Base styles
        const baseStyles =
          'px-7 py-3 font-bold text-lg rounded-lg border-2 transition-all'

        // Inactive styles
        const inactiveStyles =
          'bg-[#2d2d2d] border-[#3d3d3d] text-[#a1a1aa] hover:border-[#6366f1] hover:-translate-y-0.5'

        // Active styles with indigo gradient
        const activeStyles =
          'bg-gradient-to-r from-[#6366f1] to-[#4f46e5] border-[#6366f1] text-white shadow-lg shadow-[rgba(99,102,241,0.4)]'

        const styles = `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`

        return (
          <button
            key={list.id}
            onClick={() => onTabChange(list.id)}
            className={styles}
          >
            {list.name}
            {count > 0 && (
              <span className="ml-2 inline-block bg-[rgba(255,255,255,0.25)] text-white px-2 py-0.5 rounded-full text-xs font-bold min-w-[22px] text-center">
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
