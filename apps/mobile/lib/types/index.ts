// Shared types for mobile app - matches web app database schema

export interface GiftList {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
  item_count?: number
}

export interface GiftItem {
  id: string
  list_id: string
  name: string
  status: 'required' | 'optional'
  priority: number
  price_low: number | null
  price_high: number | null
  notes: string | null
  value_tag: string | null
  product_images: string[] | null
  research_content: string | null
  sort_order: number
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface RetailerLink {
  id: string
  item_id: string
  store_name: string
  url: string
  price: number | null
  is_best_price: boolean
  is_highend: boolean
  created_at: string
}

export interface ListMember {
  id: string
  list_id: string
  user_id: string
  role: 'owner' | 'editor' | 'viewer'
  invited_by: string | null
  invited_at: string
  accepted_at: string | null
}

export interface ListInvite {
  id: string
  list_id: string
  invite_token: string
  email: string
  role: 'editor' | 'viewer'
  invited_by: string
  created_at: string
  expires_at: string
  accepted_at: string | null
  accepted_by: string | null
}

// Input types for mutations
export interface CreateListInput {
  name: string
  color?: string
}

export interface UpdateListInput {
  name?: string
  color?: string
}

export interface CreateItemInput {
  list_id: string
  name: string
  status?: 'required' | 'optional'
  notes?: string
  price_low?: number | null
  price_high?: number | null
  value_tag?: string | null
}

export interface UpdateItemInput {
  name?: string
  status?: 'required' | 'optional'
  notes?: string | null
  price_low?: number | null
  price_high?: number | null
  value_tag?: string | null
  is_completed?: boolean
}

// Extended types with relations
export interface GiftItemWithLinks extends GiftItem {
  retailer_links: RetailerLink[]
}

export interface GiftListWithItems extends GiftList {
  gift_items: GiftItem[]
}

// Filter types
export type FilterType = 'all' | 'required' | 'optional' | 'high-value'
