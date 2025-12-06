# Phase 2 Agent 4 - Filters & Totals

## Mission
Build filter buttons and running cost totals display.

## Files to Create

### 1. `C:\Users\kevin\projects\giftwise\components\dashboard\filter-bar.tsx`
**Purpose:** Filter buttons to show all/required/optional/high-value items

**Props:**
```typescript
export interface FilterBarProps {
  activeFilter: 'all' | 'required' | 'optional' | 'high-value'
  onFilterChange: (filter: 'all' | 'required' | 'optional' | 'high-value') => void
}
```

**Requirements:**
- Four filter buttons: All, Required, Optional, High Value
- Active filter: indigo background `bg-[#6366f1]`, white text
- Inactive filters: gray background `bg-[#2d2d2d]`, muted text
- Small uppercase labels with letter spacing
- Reference MVP: lines 62-80 in `reference/gift-planner-tabbed.html`

**Component Structure:**
```typescript
const filters = [
  { key: 'all', label: 'All' },
  { key: 'required', label: 'Required' },
  { key: 'optional', label: 'Optional' },
  { key: 'high-value', label: 'High Value' }
]
```

### 2. `C:\Users\kevin\projects\giftwise\components\dashboard\totals-display.tsx`
**Purpose:** Display running cost totals for required/optional/combined items

**Props:**
```typescript
export interface TotalsDisplayProps {
  items: GiftItem[]
  filterStatus?: 'all' | 'required' | 'optional'
}
```

**Requirements:**
- Three totals sections:
  1. Required items total (low - high range)
  2. Optional items total (low - high range)
  3. Combined total (low - high range)
- Format: "$125 - $200" (with comma separators for thousands)
- Skip completed items in totals
- Use `calculateTotals` utility function
- Reference MVP: lines 320-350 in `reference/gift-planner-tabbed.html`

**Display Format:**
```
Required: $1,250 - $1,500
Optional: $450 - $600
Combined: $1,700 - $2,100
```

### 3. `C:\Users\kevin\projects\giftwise\lib\utils\totals.ts`
**Purpose:** Utility functions to calculate cost totals

**Functions:**
```typescript
export interface TotalsResult {
  requiredLow: number
  requiredHigh: number
  optionalLow: number
  optionalHigh: number
  combinedLow: number
  combinedHigh: number
}

export function calculateTotals(items: GiftItem[]): TotalsResult
export function formatPrice(amount: number): string
```

**Implementation Logic:**
```typescript
export function calculateTotals(items: GiftItem[]): TotalsResult {
  // Filter out completed items
  const activeItems = items.filter(item => !item.is_completed)

  const required = activeItems.filter(item => item.status === 'required')
  const optional = activeItems.filter(item => item.status === 'optional')

  const sumLow = (items: GiftItem[]) =>
    items.reduce((sum, item) => sum + (item.price_low || 0), 0)

  const sumHigh = (items: GiftItem[]) =>
    items.reduce((sum, item) => sum + (item.price_high || item.price_low || 0), 0)

  return {
    requiredLow: sumLow(required),
    requiredHigh: sumHigh(required),
    optionalLow: sumLow(optional),
    optionalHigh: sumHigh(optional),
    combinedLow: sumLow(activeItems),
    combinedHigh: sumHigh(activeItems)
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
```

## Key Imports
```typescript
import type { GiftItem } from '@/types/database'
import { calculateTotals, formatPrice } from '@/lib/utils/totals'
import { Button } from '@/components/ui/button'
```

## Testing Checklist
- [ ] Filter buttons toggle correctly
- [ ] Active filter has indigo styling
- [ ] Totals calculate correctly (required/optional/combined)
- [ ] Completed items excluded from totals
- [ ] Price formatting includes commas
- [ ] TypeScript compiles without errors
- [ ] Dark theme styling matches MVP

## Reference Files
- `C:\Users\kevin\projects\giftwise\reference\gift-planner-tabbed.html` (lines 62-80, 320-350)
- `C:\Users\kevin\projects\giftwise\reference\gift-app.js` (totals calculation)
- `C:\Users\kevin\projects\giftwise\types\database.ts`
