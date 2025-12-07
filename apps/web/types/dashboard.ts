import type { GiftList, GiftItem, RetailerLink } from '@/types/database'

export type DashboardData = {
  lists: GiftList[]
  items: GiftItem[]
  retailerLinks: RetailerLink[]
}

// Map of listId to Set of selected itemIds
export type SelectionState = Map<string, Set<string>>

// Filter options for the dashboard
export type FilterType = 'all' | 'required' | 'optional' | 'high-value'

// Bulk tab opening targets
export type BulkOpenTarget = 'cheapest' | 'highend' | 'amazon'
