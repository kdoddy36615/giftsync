'use client'

import type { GiftList } from '@/types/database'

export interface GiftListTabsProps {
  lists: GiftList[]
  activeListId: string
  onTabChange: (listId: string) => void
  selectionCounts: Map<string, number>
  onCreateList: () => void
  onEditList?: (list: GiftList) => void
  onShareList?: (list: GiftList) => void
}

export function GiftListTabs({
  lists,
  activeListId,
  onTabChange,
  selectionCounts,
  onCreateList,
  onEditList,
  onShareList,
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
          <div key={list.id} className="relative group">
            <button
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
            {/* Action buttons - appear on hover */}
            <div className="absolute -top-1 -right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Share button */}
              {onShareList && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onShareList(list)
                  }}
                  className="bg-[#6366f1] hover:bg-[#5558e3] border border-[#6366f1] rounded-full p-1.5 shadow-md"
                  aria-label={`Share ${list.name}`}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
              )}
              {/* Edit button */}
              {onEditList && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditList(list)
                  }}
                  className="bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-[#3d3d3d] rounded-full p-1.5 shadow-md"
                  aria-label={`Edit ${list.name}`}
                >
                  <svg
                    className="w-3 h-3 text-[#a1a1aa]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )
      })}

      {/* New List Button */}
      <button
        onClick={onCreateList}
        className="px-7 py-3 font-bold text-lg rounded-lg border-2 border-dashed border-[#3d3d3d] text-[#a1a1aa] hover:border-[#6366f1] hover:text-[#6366f1] hover:-translate-y-0.5 transition-all"
      >
        + New List
      </button>
    </div>
  )
}
