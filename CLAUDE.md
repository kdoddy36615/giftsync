# GiftSync - Multi-User Gift Planning Monorepo

## Project Overview

GiftSync is a gift planning application with multi-retailer price comparison and collaborative shopping workflows. This monorepo contains both the web and mobile apps.

## Monorepo Structure

```
giftsync/
├── apps/
│   ├── web/                 # Next.js 16 web app
│   │   ├── CLAUDE.md        # Web-specific instructions
│   │   └── PROGRESS.md      # Web progress tracking
│   └── mobile/              # Expo React Native app
│       ├── CLAUDE.md        # Mobile-specific instructions
│       └── PROGRESS.md      # Mobile progress tracking
├── packages/
│   ├── shared/              # Shared types, constants, utils
│   ├── api-client/          # API client for mobile
│   └── hooks/               # Shared React hooks
├── .claude/
│   ├── agents/              # Specialized Claude agents
│   └── commands/            # Slash commands
├── CLAUDE.md                # This file (monorepo overview)
├── PROGRESS.md              # Cross-app progress tracking
├── PIVOT-RESEARCH.md        # Strategic research
├── turbo.json               # Turborepo config
├── pnpm-workspace.yaml      # pnpm workspace config
└── package.json             # Root workspace package
```

## Tech Stack

| App | Stack |
|-----|-------|
| Web | Next.js 16, TypeScript, TailwindCSS v4, Supabase, Vercel |
| Mobile | Expo, React Native, TypeScript, expo-secure-store, EAS |
| Shared | pnpm workspaces, Turborepo |

## Key Commands

```bash
# Monorepo root
pnpm install              # Install all dependencies
pnpm dev                  # Start web app dev server
pnpm build                # Build web app
pnpm dev:mobile           # Start Expo dev server
pnpm test                 # Run web tests

# Web app (from apps/web/)
npm run dev               # Start dev server (localhost:3000)
npm run build             # Production build
npm run type-check        # TypeScript check

# Mobile app (from apps/mobile/)
npx expo start            # Start Expo dev server
eas build --profile development --platform android
eas build --profile development --platform ios
```

## Progress Tracking

| File | Purpose |
|------|---------|
| `PROGRESS.md` | Root - cross-app status overview |
| `apps/web/PROGRESS.md` | Web app feature progress |
| `apps/mobile/PROGRESS.md` | Mobile app feature progress |

Use the `/status` command or `monorepo-overseer` agent to sync progress across apps.

## Agent Team

| Agent | Model | Purpose |
|-------|-------|---------|
| `architect` | opus | Plans features, designs architecture |
| `product-owner` | opus | Prioritization, feature decisions |
| `project-manager` | sonnet | Coordinates agents, tracks progress |
| `monorepo-overseer` | haiku | Syncs progress across apps |
| `code-reviewer` | sonnet | Reviews code quality |
| `qa-tester` | sonnet | Tests functionality |
| `security` | sonnet | Audits for vulnerabilities |
| `designer` | sonnet | UI consistency |
| `ux` | sonnet | User flows, usability |
| `researcher` | haiku | Docs lookup, solutions |
| `cost-director` | haiku | Token usage monitoring |
| `component-builder` | haiku | Builds dashboard components |

## Database Schema

Shared across web and mobile via Supabase:

- `gift_lists` - People you're shopping for
- `gift_items` - Individual gift items
- `retailer_links` - Store URLs and prices per item
- `list_collaborators` - Shared access to lists
- `invites` - Pending collaboration invites

## Dark Theme Colors (Shared)

```
Background: #0f0f0f
Card: #141414
Border: #2d2d2d
Text: #e4e4e7
Accent: #6366f1 (indigo)
Success: #10b981 (green)
Danger: #dc2626 (red)
```

## Per-App Instructions

See each app's CLAUDE.md for app-specific instructions:
- `apps/web/CLAUDE.md` - Web app patterns, Supabase server client
- `apps/mobile/CLAUDE.md` - Mobile patterns, SecureStore, EAS builds

## MVP Reference

The original MVP is in `apps/web/reference/`:
- `gift-planner-tabbed.html` - UI structure and styling
- `gift-app.js` - Interaction logic
- `gift-data.js` - Data structure

Reference these when implementing matching features in mobile.

## Environment Variables

### Web (`apps/web/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
```

### Mobile (`apps/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=https://giftsync.vercel.app
```
