export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      gift_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      gift_items: {
        Row: {
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
        Insert: {
          id?: string
          list_id: string
          name: string
          status?: 'required' | 'optional'
          priority?: number
          price_low?: number | null
          price_high?: number | null
          notes?: string | null
          value_tag?: string | null
          product_images?: string[] | null
          research_content?: string | null
          sort_order?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          name?: string
          status?: 'required' | 'optional'
          priority?: number
          price_low?: number | null
          price_high?: number | null
          notes?: string | null
          value_tag?: string | null
          product_images?: string[] | null
          research_content?: string | null
          sort_order?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      retailer_links: {
        Row: {
          id: string
          item_id: string
          store_name: string
          url: string
          price: number | null
          is_best_price: boolean
          is_highend: boolean
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          store_name: string
          url: string
          price?: number | null
          is_best_price?: boolean
          is_highend?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          store_name?: string
          url?: string
          price?: number | null
          is_best_price?: boolean
          is_highend?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types for working with the tables
export type GiftList = Database['public']['Tables']['gift_lists']['Row']
export type GiftListInsert = Database['public']['Tables']['gift_lists']['Insert']
export type GiftListUpdate = Database['public']['Tables']['gift_lists']['Update']

export type GiftItem = Database['public']['Tables']['gift_items']['Row']
export type GiftItemInsert = Database['public']['Tables']['gift_items']['Insert']
export type GiftItemUpdate = Database['public']['Tables']['gift_items']['Update']

export type RetailerLink = Database['public']['Tables']['retailer_links']['Row']
export type RetailerLinkInsert = Database['public']['Tables']['retailer_links']['Insert']
export type RetailerLinkUpdate = Database['public']['Tables']['retailer_links']['Update']
