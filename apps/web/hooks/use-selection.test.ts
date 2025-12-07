import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSelection, type GiftItemWithLinks } from './use-selection'
import type { GiftList } from '@/types/database'

const mockLists: GiftList[] = [
  {
    id: 'list-1',
    user_id: 'user-1',
    name: 'Christmas 2024',
    color: '#6366f1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

const mockItems: GiftItemWithLinks[] = [
  {
    id: 'item-1',
    list_id: 'list-1',
    name: 'Laptop',
    status: 'required',
    price_low: 800,
    price_high: 1200,
    is_completed: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    priority: 1,
    notes: null,
    value_tag: null,
    product_images: null,
    research_content: null,
    sort_order: 0,
    retailer_links: [],
  },
  {
    id: 'item-2',
    list_id: 'list-1',
    name: 'Mouse',
    status: 'optional',
    price_low: 20,
    price_high: 50,
    is_completed: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    priority: 2,
    notes: null,
    value_tag: null,
    product_images: null,
    research_content: null,
    sort_order: 1,
    retailer_links: [],
  },
  {
    id: 'item-3',
    list_id: 'list-1',
    name: 'Keyboard',
    status: 'required',
    price_low: 100,
    price_high: 200,
    is_completed: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    priority: 3,
    notes: null,
    value_tag: null,
    product_images: null,
    research_content: null,
    sort_order: 2,
    retailer_links: [],
  },
]

describe('useSelection', () => {
  it('should initialize with empty selections', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))
    expect(result.current.selections.size).toBe(0)
  })

  it('should toggle selection on', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.toggleSelection('list-1', 'item-1')
    })

    expect(result.current.selections.get('list-1')?.has('item-1')).toBe(true)
  })

  it('should toggle selection off', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.toggleSelection('list-1', 'item-1')
      result.current.toggleSelection('list-1', 'item-1')
    })

    // When toggling off the last item, the list is removed from the Map
    expect(result.current.selections.has('list-1')).toBe(false)
  })

  it('should select all items', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.selectAll('list-1')
    })

    const selections = result.current.selections.get('list-1')
    expect(selections?.size).toBe(3)
    expect(selections?.has('item-1')).toBe(true)
    expect(selections?.has('item-2')).toBe(true)
    expect(selections?.has('item-3')).toBe(true)
  })

  it('should select only required items', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.selectRequired('list-1')
    })

    const selections = result.current.selections.get('list-1')
    expect(selections?.size).toBe(2)
    expect(selections?.has('item-1')).toBe(true)
    expect(selections?.has('item-3')).toBe(true)
    expect(selections?.has('item-2')).toBe(false)
  })

  it('should select only optional items', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.selectOptional('list-1')
    })

    const selections = result.current.selections.get('list-1')
    expect(selections?.size).toBe(1)
    expect(selections?.has('item-2')).toBe(true)
    expect(selections?.has('item-1')).toBe(false)
  })

  it('should clear selection', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.selectAll('list-1')
      result.current.clearSelection('list-1')
    })

    expect(result.current.selections.get('list-1')).toBe(undefined)
  })

  it('should check if item is selected', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.toggleSelection('list-1', 'item-1')
    })

    expect(result.current.isSelected('list-1', 'item-1')).toBe(true)
    expect(result.current.isSelected('list-1', 'item-2')).toBe(false)
  })

  it('should handle selection across multiple lists', () => {
    const multiLists: GiftList[] = [
      { ...mockLists[0], id: 'list-1' },
      { ...mockLists[0], id: 'list-2' },
    ]
    const multiItems: GiftItemWithLinks[] = [
      { ...mockItems[0], list_id: 'list-1' },
      { ...mockItems[1], list_id: 'list-2' },
    ]

    const { result } = renderHook(() => useSelection(multiLists, multiItems))

    act(() => {
      result.current.toggleSelection('list-1', 'item-1')
      result.current.toggleSelection('list-2', 'item-2')
    })

    expect(result.current.selections.get('list-1')?.has('item-1')).toBe(true)
    expect(result.current.selections.get('list-2')?.has('item-2')).toBe(true)
  })

  it('should remove list from map when last item is deselected', () => {
    const { result } = renderHook(() => useSelection(mockLists, mockItems))

    act(() => {
      result.current.toggleSelection('list-1', 'item-1')
      result.current.toggleSelection('list-1', 'item-1')
    })

    expect(result.current.selections.has('list-1')).toBe(false)
  })

  it('should update selections when items change (rerender)', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useSelection(mockLists, items),
      {
        initialProps: { items: mockItems },
      }
    )

    act(() => {
      result.current.selectAll('list-1')
    })

    expect(result.current.selections.get('list-1')?.size).toBe(3)

    // Simulate item removal
    const updatedItems = mockItems.slice(0, 2)
    rerender({ items: updatedItems })

    // BUG: Selection still includes deleted item 'item-3'
    // After fix, this should clean up deleted items from selection
    act(() => {
      result.current.selectAll('list-1')
    })

    expect(result.current.selections.get('list-1')?.size).toBe(2)
  })
})
