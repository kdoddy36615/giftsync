/**
 * Supabase Type Helpers
 * Utility types to work around Supabase's generated types
 * Eliminates the need for @ts-expect-error directives
 */

import type { Database } from '@/types/database'

/**
 * Helper type for INSERT operations
 * Omits auto-generated fields (id, created_at, updated_at)
 */
export type InsertSafe<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>

/**
 * Helper type for UPDATE operations
 * Makes all fields optional except the ones you want to update
 */
export type UpdateSafe<T> = Partial<Omit<T, 'id' | 'created_at' | 'user_id'>>

/**
 * Type-safe insert helpers for each table
 */
export type GiftListInsert = Database['public']['Tables']['gift_lists']['Insert']
export type GiftItemInsert = Database['public']['Tables']['gift_items']['Insert']
export type RetailerLinkInsert = Database['public']['Tables']['retailer_links']['Insert']

/**
 * Type-safe update helpers for each table
 */
export type GiftListUpdate = Database['public']['Tables']['gift_lists']['Update']
export type GiftItemUpdate = Database['public']['Tables']['gift_items']['Update']
export type RetailerLinkUpdate = Database['public']['Tables']['retailer_links']['Update']

/**
 * Helper to create type-safe insert data
 * @example
 * const insertData = createInsertData<GiftList>({
 *   user_id: user.id,
 *   name: 'My List',
 * })
 */
export function createInsertData<T extends { id?: string; created_at?: string }>(
  data: Omit<T, 'id' | 'created_at'>
): Omit<T, 'id' | 'created_at'> {
  return data
}

/**
 * Helper to create type-safe update data
 * @example
 * const updateData = createUpdateData<GiftItem>({
 *   name: 'Updated Name',
 *   status: 'required',
 * })
 */
export function createUpdateData<T extends { id?: string; user_id?: string }>(
  data: Partial<Omit<T, 'id' | 'user_id' | 'created_at'>>
): Partial<Omit<T, 'id' | 'user_id' | 'created_at'>> {
  return data
}
