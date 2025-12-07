# GiftSync Web App

## Overview

Next.js 16 web application for gift planning with multi-retailer price comparison.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS v4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Testing:** Vitest + Testing Library
- **Deployment:** Vercel

## Directory Structure

```
apps/web/
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (dashboard)/     # Main dashboard
│   └── api/             # API routes
├── components/
│   ├── ui/              # Reusable primitives
│   ├── dashboard/       # Dashboard components
│   └── modals/          # Modal components
├── hooks/               # React hooks
├── lib/
│   ├── supabase/        # Supabase clients
│   ├── actions/         # Server actions
│   └── utils/           # Utilities
├── types/               # TypeScript types
├── reference/           # MVP reference files
└── __tests__/           # Test files
```

## Key Commands

```bash
# From monorepo root
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm test             # Run tests
pnpm type-check       # TypeScript check

# From apps/web/
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build
npm run lint          # ESLint
npm run test          # Vitest
npm run type-check    # TypeScript check
```

## Code Standards

### Dark Theme Colors

```
Background: #0f0f0f
Card: #141414
Border: #2d2d2d
Text: #e4e4e7
Accent: #6366f1 (indigo)
Success: #10b981 (green)
Danger: #dc2626 (red)
```

### Components

- Use `forwardRef` for UI primitives
- File names: kebab-case (e.g., `gift-items-table.tsx`)
- Component names: PascalCase
- Export props interface for every component
- Use `'use client'` for interactive components

### Supabase

```typescript
// Browser (Client Components)
import { createClient } from '@/lib/supabase/client'

// Server (Server Components, Actions)
import { createClient } from '@/lib/supabase/server'
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
```

## Database Schema

### Tables

- `gift_lists` - People you're shopping for
- `gift_items` - Individual gift items
- `retailer_links` - Store URLs and prices per item
- `list_collaborators` - Shared access to lists
- `invites` - Pending collaboration invites

### Key Types

```typescript
import type { GiftList, GiftItem, RetailerLink } from '@/types/database'
```
