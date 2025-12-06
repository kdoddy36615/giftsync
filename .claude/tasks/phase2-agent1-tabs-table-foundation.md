# Phase 2 Agent 1 - Tabs & Table Foundation

## Mission
Build the foundational components for tab navigation and individual table row elements.

## Files to Create

### 1. `C:\Users\kevin\projects\giftwise\components\dashboard\gift-list-tabs.tsx`
**Purpose:** Tab navigation to switch between different people's gift lists

**Props:**
```typescript
export interface GiftListTabsProps {
  lists: GiftList[]
  activeListId: string | null
  onTabChange: (listId: string) => void
}
```

**Requirements:**
- Display each gift list as a tab button
- Active tab: indigo background `bg-[#6366f1]`, white text
- Inactive tab: gray background `bg-[#2d2d2d]`, muted text `text-[#a1a1aa]`
- Hover effect on inactive tabs: `hover:bg-[#3d3d3d]`
- Reference MVP: lines 83-119 in `reference/gift-planner-tabbed.html`

### 2. `C:\Users\kevin\projects\giftwise\components\dashboard\gift-item-row.tsx`
**Purpose:** Individual table row for a gift item with click-to-select

**Props:**
```typescript
export interface GiftItemRowProps {
  item: GiftItem
  retailerLinks: RetailerLink[]
  isSelected: boolean
  onToggleSelect: (itemId: string) => void
}
```

**Requirements:**
- Clickable row with `onClick` handler
- Selected state: indigo left border `border-l-4 border-[#6366f1]`, highlighted background `bg-[#1a1a1a]`
- Hover effect: `hover:bg-[#1a1a1a]`
- Display: item name, status badge, price range, retailer count, notes
- If `is_completed`, add strikethrough and opacity
- Reference MVP: lines 255-280 in `reference/gift-planner-tabbed.html`

### 3. `C:\Users\kevin\projects\giftwise\components\dashboard\status-badge.tsx`
**Purpose:** Display Required/Optional status badge

**Props:**
```typescript
export interface StatusBadgeProps {
  status: 'required' | 'optional'
}
```

**Requirements:**
- Required: indigo background `bg-[#6366f1]`, white text, "Required" label
- Optional: gray background `bg-[#2d2d2d]`, muted text `text-[#a1a1aa]`, "Optional" label
- Small rounded badge with padding `px-2 py-1 rounded text-xs font-semibold`

### 4. `C:\Users\kevin\projects\giftwise\components\dashboard\price-item.tsx`
**Purpose:** Display a single retailer price link

**Props:**
```typescript
export interface PriceItemProps {
  link: RetailerLink
}
```

**Requirements:**
- Display store name and price
- Best price: green text `text-[#10b981]`, bold
- Highend: yellow badge or indicator
- Clickable link to retailer URL
- Reference MVP: lines 290-310 in `reference/gift-planner-tabbed.html`

## Key Imports
```typescript
import type { GiftList, GiftItem, RetailerLink } from '@/types/database'
import { cn } from '@/lib/utils'
```

## Testing Checklist
- [ ] All components compile without TypeScript errors
- [ ] Props interfaces exported
- [ ] Dark theme colors match exactly
- [ ] Click handlers work (for interactive components)
- [ ] Components use `'use client'` directive where needed

## Reference Files
- `C:\Users\kevin\projects\giftwise\reference\gift-planner-tabbed.html` (lines 83-119 for tabs, 255-310 for rows)
- `C:\Users\kevin\projects\giftwise\types\database.ts`
- `C:\Users\kevin\projects\giftwise\components\ui\button.tsx` (for styling reference)
