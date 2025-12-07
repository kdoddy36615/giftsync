// AI Quick Add Types

export interface QuickAddRetailer {
  storeName: string
  searchUrl: string
  estimatedPrice: number
  isBestPrice: boolean
  isHighend: boolean
}

export interface QuickAddData {
  description: string
  priceRange: { low: number; high: number }
  retailers: QuickAddRetailer[]
  suggestedStatus: 'required' | 'optional'
  category?: string
  imageKeywords: string
  imageSearchUrl: string
}

export interface QuickAddResponse {
  success: true
  data: QuickAddData
  cached: boolean
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface QuickAddError {
  success: false
  error: string
  code: 'BUDGET_EXCEEDED' | 'INVALID_INPUT' | 'AI_FAILURE' | 'RATE_LIMITED' | 'UNKNOWN'
}

export type QuickAddResult = QuickAddResponse | QuickAddError

// Database types
export interface AICache {
  id: string
  query_hash: string
  query_text: string
  response_json: QuickAddData
  created_at: string
  expires_at: string
  hit_count: number
}

export interface AIUsage {
  id: string
  user_id: string
  month_year: string
  tokens_used: number
  cost_cents: number
  request_count: number
  created_at: string
  updated_at: string
}
