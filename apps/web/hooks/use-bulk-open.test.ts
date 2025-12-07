import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBulkOpen, type GiftItemWithLinks } from './use-bulk-open'
import type { RetailerLink } from '@/types/database'
import { BULK_OPERATION } from '@/lib/constants/timing'

describe('useBulkOpen', () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  const mockLinks: RetailerLink[] = [
    {
      id: 'link-1',
      item_id: 'item-1',
      store_name: 'Amazon',
      url: 'https://amazon.com/item1',
      price: 100,
      is_best_price: true,
      is_highend: false,
      created_at: '2024-01-01',
    },
    {
      id: 'link-2',
      item_id: 'item-1',
      store_name: 'Best Buy',
      url: 'https://bestbuy.com/item1',
      price: 150,
      is_best_price: false,
      is_highend: true,
      created_at: '2024-01-01',
    },
  ]

  const mockItems: GiftItemWithLinks[] = [
    {
      id: 'item-1',
      list_id: 'list-1',
      name: 'Laptop',
      status: 'required',
      price_low: 100,
      price_high: 150,
      is_completed: false,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      priority: 1,
      notes: null,
      value_tag: null,
      product_images: null,
      research_content: null,
      sort_order: 0,
      retailer_links: mockLinks,
    },
  ]

  it('should open cheapest links', async () => {
    const { result } = renderHook(() => useBulkOpen())

    act(() => {
      result.current.openTabs(mockItems, 'cheapest')
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://amazon.com/item1',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('should open highend links', async () => {
    const { result } = renderHook(() => useBulkOpen())

    act(() => {
      result.current.openTabs(mockItems, 'highend')
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://bestbuy.com/item1',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('should open amazon links', async () => {
    const { result } = renderHook(() => useBulkOpen())

    act(() => {
      result.current.openTabs(mockItems, 'amazon')
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://amazon.com/item1',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('should handle multiple items with staggered delay', async () => {
    const multiItems: GiftItemWithLinks[] = [
      { ...mockItems[0], id: 'item-1' },
      { ...mockItems[0], id: 'item-2' },
      { ...mockItems[0], id: 'item-3' },
    ]

    const { result } = renderHook(() => useBulkOpen())

    // Call openTabs - this schedules setTimeout calls
    act(() => {
      result.current.openTabs(multiItems, 'cheapest')
    })

    // No timers have fired yet (all are pending)
    expect(windowOpenSpy).toHaveBeenCalledTimes(0)

    // First tab opens immediately (0 * delay = 0ms)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(windowOpenSpy).toHaveBeenCalledTimes(1)

    // Second tab opens after TAB_OPEN_DELAY (1 * delay)
    act(() => {
      vi.advanceTimersByTime(BULK_OPERATION.TAB_OPEN_DELAY)
    })
    expect(windowOpenSpy).toHaveBeenCalledTimes(2)

    // Third tab opens after another TAB_OPEN_DELAY (2 * delay)
    act(() => {
      vi.advanceTimersByTime(BULK_OPERATION.TAB_OPEN_DELAY)
    })
    expect(windowOpenSpy).toHaveBeenCalledTimes(3)
  })

  it('should handle items with no matching links', async () => {
    const itemsWithoutLinks: GiftItemWithLinks[] = [
      {
        ...mockItems[0],
        retailer_links: [],
      },
    ]

    const { result } = renderHook(() => useBulkOpen())

    act(() => {
      result.current.openTabs(itemsWithoutLinks, 'cheapest')
      vi.runAllTimers()
    })

    expect(windowOpenSpy).not.toHaveBeenCalled()
  })

  it('should handle empty items array', async () => {
    const { result } = renderHook(() => useBulkOpen())

    act(() => {
      result.current.openTabs([], 'cheapest')
      vi.runAllTimers()
    })

    expect(windowOpenSpy).not.toHaveBeenCalled()
  })

  it('should find amazon links case-insensitively', async () => {
    const itemsWithDifferentCase: GiftItemWithLinks[] = [
      {
        ...mockItems[0],
        retailer_links: [
          {
            ...mockLinks[0],
            store_name: 'AMAZON',
            url: 'https://amazon.com/uppercase',
          },
        ],
      },
    ]

    const { result } = renderHook(() => useBulkOpen())

    act(() => {
      result.current.openTabs(itemsWithDifferentCase, 'amazon')
    })

    act(() => {
      vi.runAllTimers()
    })

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://amazon.com/uppercase',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('should skip items without matching target link', async () => {
    const mixedItems: GiftItemWithLinks[] = [
      {
        ...mockItems[0],
        id: 'item-1',
        retailer_links: [mockLinks[0]], // Has best_price
      },
      {
        ...mockItems[0],
        id: 'item-2',
        retailer_links: [
          { ...mockLinks[0], is_best_price: false, is_highend: false },
        ], // No best_price
      },
    ]

    const { result } = renderHook(() => useBulkOpen())

    act(() => {
      result.current.openTabs(mixedItems, 'cheapest')
      vi.runAllTimers()
    })

    // Should only open one tab
    expect(windowOpenSpy).toHaveBeenCalledTimes(1)
  })
})
