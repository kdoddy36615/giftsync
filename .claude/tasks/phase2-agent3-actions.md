# Phase 2 Agent 3 - Action Buttons & Operations

## Mission
Build bulk action buttons and server actions for marking items complete.

## Files to Create

### 1. `C:\Users\kevin\projects\giftwise\components\dashboard\action-buttons.tsx`
**Purpose:** All bulk action buttons for selected items

**Props:**
```typescript
export interface ActionButtonsProps {
  selectedItems: Set<string>
  items: GiftItem[]
  retailerLinks: RetailerLink[]
  onSelectAll: () => void
  onSelectRequired: () => void
  onSelectOptional: () => void
  onClearSelection: () => void
  onMarkComplete: (itemIds: string[]) => Promise<void>
  onUnmarkComplete: (itemIds: string[]) => Promise<void>
}
```

**Requirements:**
- **Selection Helpers Section:**
  - Select All button
  - Select Required button
  - Select Optional button
  - Clear Selection button

- **Open Tabs Section:**
  - Open Cheapest button (uses `useBulkOpen` hook)
  - Open Highend button (uses `useBulkOpen` hook)
  - Open Amazon button (uses `useBulkOpen` hook)

- **Purchase Actions Section:**
  - Mark as Purchased button (calls `onMarkComplete`)
  - Unpurchase button (calls `onUnmarkComplete`)

**Button States:**
- Disabled when `selectedItems.size === 0`
- Use `Button` component from `@/components/ui/button`
- Primary variant for main actions, secondary for helpers
- Reference MVP: lines 145-200 in `reference/gift-planner-tabbed.html`

**Integration with Hooks:**
```typescript
const { openBulkTabs } = useBulkOpen()

const handleOpenCheapest = () => {
  const selectedItemsArray = Array.from(selectedItems)
  const links = retailerLinks.filter(link => selectedItemsArray.includes(link.item_id))
  openBulkTabs(links, 'cheapest')
}
```

### 2. `C:\Users\kevin\projects\giftwise\lib\actions\mark-complete.ts`
**Purpose:** Server action to mark items as completed/purchased

**Functions:**
```typescript
'use server'

export async function markItemsComplete(itemIds: string[]): Promise<void>
export async function unmarkItemsComplete(itemIds: string[]): Promise<void>
```

**Requirements:**
- Use Supabase server client from `@/lib/supabase/server`
- Update `gift_items` table, set `is_completed` field
- Handle errors gracefully
- Revalidate path after mutation

**Implementation:**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markItemsComplete(itemIds: string[]): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('gift_items')
    .update({ is_completed: true })
    .in('id', itemIds)

  if (error) throw error
  revalidatePath('/dashboard')
}

export async function unmarkItemsComplete(itemIds: string[]): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('gift_items')
    .update({ is_completed: false })
    .in('id', itemIds)

  if (error) throw error
  revalidatePath('/dashboard')
}
```

## Key Imports
```typescript
// Component
import { Button } from '@/components/ui/button'
import { useBulkOpen } from '@/hooks/use-bulk-open'
import type { GiftItem, RetailerLink } from '@/types/database'

// Server Action
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
```

## Testing Checklist
- [ ] All buttons render correctly
- [ ] Buttons disabled when no selection
- [ ] Open tabs buttons work (useBulkOpen integration)
- [ ] Mark complete/uncomplete server actions work
- [ ] Server actions revalidate path
- [ ] TypeScript compiles without errors
- [ ] Dark theme styling matches MVP

## Reference Files
- `C:\Users\kevin\projects\giftwise\reference\gift-planner-tabbed.html` (lines 145-200)
- `C:\Users\kevin\projects\giftwise\reference\gift-app.js` (bulk action logic)
- `C:\Users\kevin\projects\giftwise\hooks\use-bulk-open.ts`
- `C:\Users\kevin\projects\giftwise\lib\supabase\server.ts`
