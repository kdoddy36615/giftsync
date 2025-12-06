# Public Gift Planner Web App - Implementation Plan

## Executive Summary

Transform the personal gift planning HTML app into a public multi-user web application. Users can create accounts, manage gift lists for multiple people, add items with multi-retailer price comparison, and use bulk selection features to streamline shopping.

## Tech Stack

**Framework:** Next.js 14+ with App Router
- Server components for better performance
- Server actions for API calls
- Built-in routing and optimization
- Easy Vercel deployment

**Database & Auth:** Supabase
- PostgreSQL database
- Built-in authentication (email/password, OAuth)
- Row Level Security (RLS) for data isolation
- Real-time subscriptions (future enhancement)

**Frontend:** React + TailwindCSS
- Component-based architecture
- Tailwind for styling (similar to current dark theme)
- Client-side state management with React hooks

**Deployment:** Vercel
- Zero-config deployment from GitHub
- Edge functions support
- Custom domain support

**Why Next.js over vanilla HTML/JS:**
- User management requires backend (auth, DB queries)
- Server-side rendering improves SEO/sharing
- API routes for product URL parsing
- Built-in optimizations (images, fonts, code splitting)
- Easier to maintain as features grow

## Database Schema

### Tables

**users** (managed by Supabase Auth)
- id (uuid, primary key)
- email
- created_at

**gift_lists** (people you're shopping for)
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- name (text) - e.g., "Emily", "Lucas"
- color (text) - hex color for UI theming
- created_at (timestamp)
- updated_at (timestamp)

**gift_items**
- id (uuid, primary key)
- list_id (uuid, foreign key → gift_lists)
- name (text)
- status (text) - "required" or "optional"
- priority (boolean) - shows "ORDER SOON" tag
- price_low (decimal)
- price_high (decimal)
- notes (text)
- value_tag (text) - "HIGH", null
- product_images (text[]) - array of URLs
- research_content (text) - markdown for research panel
- sort_order (integer) - for custom ordering
- is_completed (boolean) - purchased/completed status
- created_at (timestamp)
- updated_at (timestamp)

**retailer_links**
- id (uuid, primary key)
- item_id (uuid, foreign key → gift_items)
- store_name (text) - "Amazon", "Target", etc.
- url (text)
- price (decimal)
- is_best_price (boolean) - cheapest option
- is_highend (boolean) - premium option
- created_at (timestamp)

**Row Level Security (RLS) Policies:**
- Users can only read/write their own gift_lists
- Users can only read/write gift_items in their own lists
- Users can only read/write retailer_links for their own items

## Authentication Flow

1. **Sign Up / Sign In**
   - Email + Password via Supabase Auth
   - OAuth providers (Google, GitHub) - optional future enhancement

2. **Session Management**
   - Supabase handles JWT tokens
   - Next.js middleware protects authenticated routes
   - Redirect unauthenticated users to login page

3. **User Dashboard**
   - After login, show user's gift lists (tabs)
   - If no lists exist, show onboarding to create first list

## Core Feature Migration

### Current Features → Public App

| Current Feature | Migration Strategy |
|----------------|-------------------|
| **Multi-tab interface** | Each user gets their own tabs (gift_lists table) |
| **localStorage selections** | Move to React state (per-session, not persisted) |
| **localStorage completed** | Move to DB (`is_completed` field) persists permanently |
| **Static gift data** | Dynamic CRUD - users add/edit/delete items via forms |
| **Bulk tab opening** | Same functionality, open selected items' links with delays |
| **Selection helpers** | Same UI, but state in React instead of localStorage |
| **Price comparison** | Same display, data from `retailer_links` table |
| **Filters (All/Required/Optional)** | Same filtering logic in React |
| **Research panels** | Migrate to DB, editable by users |
| **Image carousels** | Same UI, images stored as URLs in DB |
| **Blur privacy toggle** | Same spacebar toggle, CSS-based |

### New Features for Public App

1. **User accounts** - Sign up, login, logout
2. **Add/Edit Items Form** - Modal or slide-over panel for CRUD operations
3. **Add Retailer Links** - Dynamic form to add store + URL + price
4. **Product URL Parser** - Paste Amazon/Target URL, auto-extract product info (Phase 2+)
5. **List Management** - Create/rename/delete gift lists
6. **Sharing (Future)** - Share read-only view of list with others

## Product URL Parsing Strategy

### MVP Approach (Phase 1)
**Manual Entry** - Users paste URL and manually enter:
- Store name (dropdown: Amazon, Target, Walmart, etc.)
- Price
- Mark as best/highend

### Enhanced Approach (Phase 2+)
**Backend scraping service:**
```
POST /api/parse-product-url
Body: { url: "https://amazon.com/..." }
Response: {
  title: "Product Name",
  price: 79.99,
  images: [...],
  store: "Amazon"
}
```

**Implementation options:**
1. **Cheerio/Puppeteer** - Scrape HTML directly (may break with site updates)
2. **Third-party API** - Use service like ScraperAPI, Diffbot (costs money)
3. **Browser Extension** - User installs extension to extract data client-side (more reliable)

**Recommendation:** Start with manual entry (MVP), add browser extension later for better UX.

## Implementation Phases

### Phase 1: Foundation (MVP)
**Goal:** Get basic multi-user app working with manual data entry

1. **Project Setup**
   - Create Next.js app with TypeScript and TailwindCSS
   - Install Supabase client dependencies
   - Set up Git repository

2. **Supabase Setup**
   - Create Supabase project
   - Create database tables (schema above)
   - Configure RLS policies
   - Set up Supabase Auth

3. **Authentication**
   - Build login page (`/login`)
   - Build signup page (`/signup`)
   - Add middleware to protect app routes
   - Add logout functionality

4. **Core UI - Dashboard**
   - Migrate current HTML/CSS to React components
   - Tab interface for gift lists (read from DB)
   - Display items in table format
   - Preserve dark theme styling

5. **Item Management**
   - Add Item modal/form (manual entry)
   - Edit Item functionality
   - Delete Item functionality
   - Add Retailer Links sub-form

6. **Selection & Bulk Actions**
   - Click-to-select rows (React state)
   - Selection helpers (Select All, Required, Optional, Clear)
   - Open Selected in tabs (Cheapest/Highend/Amazon)
   - Mark as Completed/Uncompleted

7. **Filters & Totals**
   - Filter buttons (All/Required/Optional/High Value)
   - Dynamic cost calculations
   - Running totals display

8. **Polish**
   - Blur toggle (spacebar)
   - Responsive design
   - Loading states
   - Error handling

### Phase 2: Enhanced Features
1. Product URL Parser API
2. Image Optimization (Next.js Image component)
3. List Management (create/rename/delete lists)
4. Advanced Filters (search, price range, sort)

### Phase 3: Collaboration & Sharing
1. Share Lists (read-only links)
2. Collaboration (invite co-managers, real-time updates)

### Phase 4: Mobile & PWA
1. Mobile Optimization
2. Progressive Web App (service worker, offline support)

## Directory Structure

```
app-name/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── parse-product-url/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── modals/
│   └── ui/
├── lib/
│   ├── supabase/
│   └── utils/
├── hooks/
├── types/
├── public/
└── supabase/
    └── migrations/
```

## Key Decisions & Trade-offs

| Decision | Rationale |
|----------|-----------|
| **Next.js over vanilla** | Need backend for auth/DB, better for public app |
| **Supabase over custom API** | Faster to market, built-in auth, free tier generous |
| **Manual URL entry (MVP)** | Scraping is fragile, can add later |
| **No real-time collaboration (MVP)** | Complex feature, add after validating core UX |
| **Client-side selection state** | No need to persist selections, reduces DB writes |
| **DB-persisted completed status** | Users want this to persist across sessions |

## Success Criteria

**Phase 1 MVP Complete When:**
- [ ] User can sign up and log in
- [ ] User can create multiple gift lists (people)
- [ ] User can add/edit/delete gift items manually
- [ ] User can add multiple retailer links per item
- [ ] User can select items and open in bulk
- [ ] User can mark items as completed (persists)
- [ ] Filters and totals work correctly
- [ ] Dark theme and current UX preserved
- [ ] Deployed to Vercel on custom domain

## Files to Reference from Current App

- `gift-planner-tabbed.html` - CSS patterns and HTML structure
- `gift-app.js` - JavaScript logic to port to React
- `gift-data.js` - Data schema reference

## Notes

- Start simple with manual entry - don't over-engineer MVP
- Preserve the UX that works well in current app
- Use TypeScript for better DX and fewer bugs
- Keep dark theme and color scheme
- Focus on core value: multi-retailer price comparison + bulk shopping workflow
