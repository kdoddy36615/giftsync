# GiftWise - Multi-User Gift Planning Application

## Project Overview

GiftWise is a web application that helps users manage gift lists for multiple people with multi-retailer price comparison and bulk shopping workflows. Originally built as a personal tool, it's being transformed into a public multi-user application.

## MVP Reference (IMPORTANT)

The working MVP is in **`./reference/`**:

| File | Purpose |
|------|---------|
| `reference/gift-planner-tabbed.html` | Main UI - HTML structure + CSS styling to replicate |
| `reference/gift-app.js` | JavaScript logic - selection, bulk actions, filters, tab switching |
| `reference/gift-data.js` | Data structure - schema reference for items |

**ALWAYS reference the MVP first when implementing features** to understand:
- How the UI should look (dark theme, colors, layout)
- How interactions should work (click to select, bulk actions)
- Data structure and field names

To view the MVP in browser: open `reference/gift-planner-tabbed.html` directly.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deployment:** Vercel

## Architecture

```
app/
├── (auth)/          # Authentication pages (login, signup)
├── (dashboard)/     # Main app interface
└── api/             # API routes

components/
├── ui/              # Reusable primitives (Button, Input, Modal)
├── dashboard/       # Gift list components
└── modals/          # Add/Edit item modals

lib/
├── supabase/        # Supabase client utilities
└── utils/           # Utility functions

types/               # TypeScript type definitions
hooks/               # React hooks
```

## Key Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Code Standards

### TypeScript
- Use strict mode
- Export types/interfaces for all components
- Use `type` for object shapes, `interface` for extendable contracts

### Components
- Use `forwardRef` for all UI primitives
- Follow kebab-case for file names (e.g., `gift-items-table.tsx`)
- Use PascalCase for component names

### Styling
- Dark theme by default:
  - Background: `#0f0f0f`
  - Card: `#141414`
  - Border: `#2d2d2d`
  - Text: `#e4e4e7`
  - Accent: `#6366f1` (indigo)
  - Danger: `#dc2626` (red)
- Use Tailwind classes, avoid custom CSS
- Use `cn()` utility for conditional classes

### State Management
- Selection state: React `useState` (per-session)
- Completed status: Supabase DB (persistent)
- Use React hooks for data fetching

## Database Schema

### Tables
- `gift_lists` - People you're shopping for
- `gift_items` - Individual gift items
- `retailer_links` - Store URLs and prices per item

### Key Fields
- Items have `status` ('required' | 'optional')
- Items can be `is_completed` (purchased)
- Retailer links have `is_best_price` and `is_highend` flags

## Features

### Core
- Multi-tab interface (one tab per person)
- Click-to-select rows for bulk actions
- Multi-retailer price comparison per item
- Mark items as purchased (persistent)

### Bulk Actions
- Select All / Select Required / Select Optional / Clear
- Open Cheapest / Open Highend / Open Amazon tabs
- Mark selected as Purchased / Unpurchase

### UX
- Privacy blur toggle (spacebar)
- Running cost totals (Required / Optional / Combined)
- Filter by status and value tags

## Agent Team

This project uses 10 specialized Claude subagents:

| Agent | Model | Purpose |
|-------|-------|---------|
| `architect` | opus | Plans features, designs component architecture |
| `product-owner` | opus | Prioritization, feature decisions, product vision |
| `project-manager` | sonnet | Coordinates agents, tracks progress, can spawn agents |
| `code-reviewer` | sonnet | Reviews code quality, patterns, best practices |
| `qa-tester` | sonnet | Tests functionality, finds edge cases |
| `security` | sonnet | Audits for vulnerabilities, auth, data safety |
| `designer` | sonnet | UI consistency, dark theme, visual polish |
| `ux` | sonnet | User flows, interaction design, usability |
| `researcher` | haiku | Quick docs lookup, best practices, solutions |
| `cost-director` | haiku | Monitors token usage, optimizes agent efficiency |

**Hierarchy:**
- `product-owner` + `architect` = Strategic decisions (opus)
- `project-manager` = Orchestration, can create new agents
- Others = Specialized execution

## Coordination Files

- `claude-progress.txt` - Work log for agent sessions
- `AGENTS.md` - File claims and shared contracts
- `feature-status.json` - Feature completion tracking

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Quick Reference

### Supabase Client
```typescript
// Browser (Client Components)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Server (Server Components, Actions)
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### Database Types
```typescript
import type { GiftList, GiftItem, RetailerLink } from '@/types/database'
```

### UI Components
```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
```
