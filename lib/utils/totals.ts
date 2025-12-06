import type { GiftItem } from '@/types/database'

export interface TotalsCalculation {
  required: {
    low: number
    high: number
  }
  optional: {
    low: number
    high: number
  }
  combined: {
    low: number
    high: number
  }
}

/**
 * Calculate totals for required, optional, and combined items
 * Sums price_low and price_high for items grouped by status
 */
export function calculateTotals(items: GiftItem[]): TotalsCalculation {
  const requiredItems = items.filter((item) => item.status === 'required')
  const optionalItems = items.filter((item) => item.status === 'optional')

  const requiredLow = requiredItems.reduce((sum, item) => sum + (item.price_low || 0), 0)
  const requiredHigh = requiredItems.reduce((sum, item) => sum + (item.price_high || 0), 0)

  const optionalLow = optionalItems.reduce((sum, item) => sum + (item.price_low || 0), 0)
  const optionalHigh = optionalItems.reduce((sum, item) => sum + (item.price_high || 0), 0)

  return {
    required: {
      low: requiredLow,
      high: requiredHigh,
    },
    optional: {
      low: optionalLow,
      high: optionalHigh,
    },
    combined: {
      low: requiredLow + optionalLow,
      high: requiredHigh + optionalHigh,
    },
  }
}

/**
 * Format a price range as a currency string
 */
export function formatPriceRange(low: number, high: number): string {
  return `$${low.toFixed(2)} - $${high.toFixed(2)}`
}
