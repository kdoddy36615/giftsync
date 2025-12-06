# Agent Coordination

This file prevents conflicts between parallel agents. **READ BEFORE WRITING ANY FILES.**

---

## Currently Claimed Files

| Agent | Scope | Files/Directories | Started |
|-------|-------|-------------------|---------|
| Phase2-Agent1 | Tabs & Table Foundation | components/dashboard/gift-list-tabs.tsx, gift-item-row.tsx, status-badge.tsx, price-item.tsx | 2025-12-06 14:00 |
| Phase2-Agent2 | Table Container & Grid | components/dashboard/gift-items-table.tsx, price-grid.tsx | 2025-12-06 14:00 |
| Phase2-Agent3 | Action Buttons | components/dashboard/action-buttons.tsx, lib/actions/mark-complete.ts | 2025-12-06 14:00 |
| Phase2-Agent4 | Filters & Totals | components/dashboard/filter-bar.tsx, totals-display.tsx, lib/utils/totals.ts | 2025-12-06 14:00 |

> **Before editing any file:** Check this table. If claimed, DO NOT EDIT.
> **When starting work:** Add your row FIRST, then begin coding.
> **When done:** Remove your row and update claude-progress.txt.

---

## Completed Work & Shared Contracts

### Types & Interfaces
| File | Exports | Description |
|------|---------|-------------|
| /types/dashboard.ts | DashboardData, SelectionState, BulkOpenTarget | Dashboard data structure, selection state Map, bulk open targets |

### Utilities & Hooks
| File | Exports | Description |
|------|---------|-------------|
| /hooks/use-selection.ts | useSelection() | Selection state management hook with toggleItem, selectAll, selectRequired, selectOptional, clearSelection, isSelected |
| /hooks/use-privacy-blur.ts | usePrivacyBlur() | Privacy blur toggle hook with spacebar listener |
| /hooks/use-bulk-open.ts | useBulkOpen() | Bulk tab opening hook for cheapest/highend/amazon links |

### Components
| File | Props Interface | Description |
|------|-----------------|-------------|
| /app/(auth)/layout.tsx | { children: React.ReactNode } | Auth layout with centered card design on dark background |
| /app/(auth)/login/page.tsx | - | Login page with email/password form |
| /app/(auth)/signup/page.tsx | - | Signup page with email/password/confirm password |
| /app/(dashboard)/layout.tsx | { children: React.ReactNode } | Dashboard layout with header, dark theme container |
| /app/(dashboard)/page.tsx | - | Dashboard home page with gift lists data fetching |
| /middleware.ts | - | Next.js middleware for auth route protection |

---

## Import Conventions

When these files exist, use these exact imports:

```typescript
// Supabase (when created)
import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'

// Database types (when created)
import type { Database } from '@/types/database'
import type { GiftList, GiftItem, RetailerLink } from '@/types/database'

// UI Components (when created)
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
```

---

## File Ownership Rules

To prevent conflicts, agents should only work within their assigned scope:

| Scope | Directories | Notes |
|-------|-------------|-------|
| Auth | `/app/(auth)/*`, `/components/auth/*` | Login, signup, middleware |
| Supabase | `/lib/supabase/*`, `/types/*` | Client setup, types |
| UI Components | `/components/ui/*` | Reusable primitives |
| Dashboard | `/app/(dashboard)/*`, `/components/dashboard/*` | Main app UI |
| Hooks | `/hooks/*` | React hooks |

---

## Conflict Resolution

If you discover a conflict:
1. STOP immediately
2. Note the conflict in claude-progress.txt
3. Do not attempt to merge or fix
4. Report back to orchestrator

---

## Agent Communication Log

Use this section for important messages between agents:

```
[2025-12-06 12:00] Main: Initialized coordination files. Ready for parallel work.
[2025-12-06 13:00] Project Manager: Built Phase 1 foundation - middleware, dashboard types/hooks, dashboard layout. TypeScript check passed.
[2025-12-06 14:00] Project Manager: Spawning 4 parallel agents for Phase 2 component building. Task files created in .claude/tasks/. File claims registered.
```
