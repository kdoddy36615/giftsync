# Phase 2 Agent 2 - Table Container & Grid

## Mission
Build the main table container and price grid display components.

## Files to Create

### 1. `C:\Users\kevin\projects\giftwise\components\dashboard\gift-items-table.tsx`
**Purpose:** Main table container that displays all gift items with selection

**Props:**
```typescript
export interface GiftItemsTableProps {
  items: GiftItem[]
  retailerLinks: RetailerLink[]
  selectedItems: Set<string>
  onToggleSelect: (itemId: string) => void
  filterStatus?: 'all' | 'required' | 'optional'
}
```

**Requirements:**
- Table with columns: Name, Status, Price Range, Retailers, Notes
- Filter items by `filterStatus` prop
- Uses `GiftItemRow` component for each row
- Empty state message if no items
- Dark theme table styling with borders `border-[#2d2d2d]`
- Header row with column titles
- Reference MVP: lines 240-250 in `reference/gift-planner-tabbed.html`

**Key Logic:**
```typescript
const filteredItems = items.filter(item => {
  if (filterStatus === 'required') return item.status === 'required'
  if (filterStatus === 'optional') return item.status === 'optional'
  return true
})
```

### 2. `C:\Users\kevin\projects\giftwise\components\dashboard\price-grid.tsx`
**Purpose:** Grid display of all retailer prices for a single item

**Props:**
```typescript
export interface PriceGridProps {
  itemId: string
  retailerLinks: RetailerLink[]
}
```

**Requirements:**
- Display all retailer links for the item
- Grid layout: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2`
- Each price uses `PriceItem` component
- Highlight best price in green
- Show highend indicator
- If no links, show "No retailers" message
- Reference MVP: lines 290-310 in `reference/gift-planner-tabbed.html`

**Key Logic:**
```typescript
const itemLinks = retailerLinks.filter(link => link.item_id === itemId)
```

## Key Imports
```typescript
import type { GiftItem, RetailerLink } from '@/types/database'
import { GiftItemRow } from './gift-item-row'
import { PriceGrid } from './price-grid'
import { PriceItem } from './price-item'
import { cn } from '@/lib/utils'
```

## Testing Checklist
- [ ] Table displays all items correctly
- [ ] Filter prop works (required/optional/all)
- [ ] Empty state shows when no items
- [ ] Price grid shows all retailer links
- [ ] Best price highlighted in green
- [ ] TypeScript compiles without errors
- [ ] Components use `'use client'` if needed

## Reference Files
- `C:\Users\kevin\projects\giftwise\reference\gift-planner-tabbed.html` (lines 240-310)
- `C:\Users\kevin\projects\giftwise\types\database.ts`
- `C:\Users\kevin\projects\giftwise\components\dashboard\gift-item-row.tsx` (from Agent 1)
- `C:\Users\kevin\projects\giftwise\components\dashboard\price-item.tsx` (from Agent 1)
