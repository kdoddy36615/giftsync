/**
 * Validation Constants
 * Centralized validation limits for consistent enforcement across the app
 */

export const VALIDATION_LIMITS = {
  // Gift List validation
  LIST_NAME_MIN: 1,
  LIST_NAME_MAX: 100,
  LIST_DESCRIPTION_MAX: 500,

  // Gift Item validation
  ITEM_NAME_MIN: 1,
  ITEM_NAME_MAX: 200,
  ITEM_NOTES_MAX: 1000,

  // Retailer Link validation
  STORE_NAME_MAX: 100,
  URL_MAX: 2048,

  // Batch operations
  MAX_ITEMS_PER_BATCH: 50,
  MAX_LINKS_PER_ITEM: 10,
} as const

/**
 * Validation error messages
 * Use these for consistent user-facing error messages
 */
export const VALIDATION_MESSAGES = {
  // List validation
  LIST_NAME_REQUIRED: 'List name is required',
  LIST_NAME_TOO_SHORT: `List name must be at least ${VALIDATION_LIMITS.LIST_NAME_MIN} character`,
  LIST_NAME_TOO_LONG: `List name must be less than ${VALIDATION_LIMITS.LIST_NAME_MAX} characters`,
  LIST_DESCRIPTION_TOO_LONG: `Description must be less than ${VALIDATION_LIMITS.LIST_DESCRIPTION_MAX} characters`,

  // Item validation
  ITEM_NAME_REQUIRED: 'Item name is required',
  ITEM_NAME_TOO_SHORT: `Item name must be at least ${VALIDATION_LIMITS.ITEM_NAME_MIN} character`,
  ITEM_NAME_TOO_LONG: `Item name must be less than ${VALIDATION_LIMITS.ITEM_NAME_MAX} characters`,
  ITEM_NOTES_TOO_LONG: `Notes must be less than ${VALIDATION_LIMITS.ITEM_NOTES_MAX} characters`,

  // Retailer link validation
  STORE_NAME_REQUIRED: 'Store name is required',
  STORE_NAME_TOO_LONG: `Store name must be less than ${VALIDATION_LIMITS.STORE_NAME_MAX} characters`,
  URL_REQUIRED: 'URL is required',
  URL_INVALID: 'Invalid URL format',
  URL_TOO_LONG: `URL must be less than ${VALIDATION_LIMITS.URL_MAX} characters`,

  // Batch operations
  TOO_MANY_ITEMS: `Cannot process more than ${VALIDATION_LIMITS.MAX_ITEMS_PER_BATCH} items at once`,
  TOO_MANY_LINKS: `Cannot add more than ${VALIDATION_LIMITS.MAX_LINKS_PER_ITEM} links per item`,
} as const

/**
 * Validation helper functions
 */

export function validateListName(name: string): string | null {
  const trimmed = name.trim()

  if (!trimmed) {
    return VALIDATION_MESSAGES.LIST_NAME_REQUIRED
  }

  if (trimmed.length < VALIDATION_LIMITS.LIST_NAME_MIN) {
    return VALIDATION_MESSAGES.LIST_NAME_TOO_SHORT
  }

  if (trimmed.length > VALIDATION_LIMITS.LIST_NAME_MAX) {
    return VALIDATION_MESSAGES.LIST_NAME_TOO_LONG
  }

  return null
}

export function validateItemName(name: string): string | null {
  const trimmed = name.trim()

  if (!trimmed) {
    return VALIDATION_MESSAGES.ITEM_NAME_REQUIRED
  }

  if (trimmed.length < VALIDATION_LIMITS.ITEM_NAME_MIN) {
    return VALIDATION_MESSAGES.ITEM_NAME_TOO_SHORT
  }

  if (trimmed.length > VALIDATION_LIMITS.ITEM_NAME_MAX) {
    return VALIDATION_MESSAGES.ITEM_NAME_TOO_LONG
  }

  return null
}

export function validateStoreName(name: string): string | null {
  const trimmed = name.trim()

  if (!trimmed) {
    return VALIDATION_MESSAGES.STORE_NAME_REQUIRED
  }

  if (trimmed.length > VALIDATION_LIMITS.STORE_NAME_MAX) {
    return VALIDATION_MESSAGES.STORE_NAME_TOO_LONG
  }

  return null
}
