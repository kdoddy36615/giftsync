# GiftSync Mobile App - Master Implementation Plan

## Executive Summary

Complete the mobile app to feature parity with core web functionality. The app currently has read-only viewing with basic tap-to-complete. This plan adds full CRUD operations, making the app a true execution platform for gift planning.

**Critical Issue:** The app has a dead-end empty state - users see "Create your first list" but no create button exists. This must be fixed immediately.

---

## Agent Team Consensus

| Agent | Key Recommendation |
|-------|-------------------|
| **Architect** | Extract UI primitives, use bottom sheets, local state + custom hooks |
| **Product Owner** | Critical path: Create list → Create item → Retailer links → Totals |
| **UX** | FAB bottom-right, long-press for selection, bottom sheets for forms |
| **Designer** | 56x56 FAB, bottom sheets with handle, 2-column retailer grid |
| **Security** | Remove hardcoded demo creds, strengthen passwords, sanitize errors |

---

## Implementation Phases

### Phase 1: Foundation (Day 1)

**Goal:** Extract reusable components, add critical dependencies

**Tasks:**
1. Create shared types file (`lib/types/index.ts`)
2. Extract UI primitives:
   - `components/ui/Button.tsx` (primary, secondary, danger, ghost)
   - `components/ui/TextInput.tsx` (with label, error state)
   - `components/ui/IconButton.tsx` (for FAB, header actions)
   - `components/ui/Card.tsx` (pressable with accent border)
   - `components/ui/Badge.tsx` (status: required/optional/purchased)
   - `components/ui/EmptyState.tsx` (icon, title, subtitle, CTA)
   - `components/ui/LoadingScreen.tsx`
   - `components/ui/Toast.tsx`
3. Install `@gorhom/bottom-sheet`
4. Create `components/ui/BottomSheet.tsx` wrapper
5. Rename `two.tsx` to `settings.tsx`

**Security Fix (Priority 1):**
- Conditionally hide demo login in production builds
- Strengthen password validation to 8+ chars with complexity

---

### Phase 2: List CRUD (Day 2)

**Goal:** Users can create, edit, and delete gift lists

**Tasks:**
1. Create `hooks/useGiftLists.ts` with CRUD operations
2. Add FAB to dashboard (`components/ui/FAB.tsx`)
3. Create `components/lists/ListFormSheet.tsx` (bottom sheet)
   - Fields: name (required), color picker (6 presets)
4. Wire up create list flow
5. Add long-press action sheet to list cards (Edit, Delete)
6. Create `components/ui/ConfirmDialog.tsx`
7. Wire up edit/delete flows

**Empty State Fix:**
- Add "Create List" button to empty state (not just FAB)

---

### Phase 3: Item CRUD (Days 3-4)

**Goal:** Users can create, edit, and delete gift items

**Tasks:**
1. Create `hooks/useGiftItems.ts` with CRUD operations
2. Add FAB to list detail screen
3. Create `components/items/ItemFormSheet.tsx` (taller bottom sheet ~70%)
   - Fields: name, status toggle, price_low, price_high, notes
4. Wire up create item flow
5. Add long-press action sheet to item cards (Edit, Delete)
6. Wire up edit/delete flows
7. Create `components/items/ItemCard.tsx` (extracted from current inline)

---

### Phase 4: Retailer Links (Day 5)

**Goal:** Display retailer links with prices, open in browser

**Tasks:**
1. Fetch retailer_links with items in list detail query
2. Create `components/items/RetailerLinkCard.tsx`
   - 2-column grid layout
   - Store name, price, best price highlight
   - Tap to open URL via `Linking.openURL()`
3. Add retailer section to ItemCard when expanded
4. Add running cost totals to list header

---

### Phase 5: Filter & Selection (Day 6)

**Goal:** Filter items, select multiple, perform bulk actions

**Tasks:**
1. Create `components/items/FilterBar.tsx`
   - Horizontal chips: All, Required, Optional, High Value
   - "Hide Purchased" toggle
2. Create `providers/SelectionProvider.tsx`
3. Implement selection mode:
   - Long-press item → enters selection mode
   - Tap items to toggle selection
   - Show selection count in header
4. Create `components/items/BottomActionBar.tsx`
   - Shows when items selected
   - Actions: Mark Purchased, Share Links, Clear
5. Implement Share Links via `Share.share()`

---

### Phase 6: Polish (Day 7)

**Goal:** Loading states, error handling, haptics, accessibility

**Tasks:**
1. Add loading skeletons to dashboard and list detail
2. Sanitize error messages (don't expose internal details)
3. Add haptic feedback on key actions (iOS strong, Android light)
4. Add accessibility labels to all interactive elements
5. Test keyboard avoidance on all forms
6. Create `lib/logger.ts` (conditional logging)
7. Test on both iOS and Android simulators

---

### Phase 7: Deep Linking & EAS (Day 8)

**Goal:** Accept invite links, configure builds

**Tasks:**
1. Configure deep link scheme in `app.json`
2. Create `app/invite/[token].tsx` screen
3. Implement invite acceptance flow with validation
4. Configure `eas.json` with development, preview, production profiles
5. Run first EAS builds for both platforms
6. Update `PROGRESS.md` with completion status

---

## File Structure (Final)

```
apps/mobile/
├── app/
│   ├── _layout.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Dashboard
│   │   └── settings.tsx        # Renamed from two.tsx
│   ├── list/
│   │   └── [id].tsx            # List detail
│   └── invite/
│       └── [token].tsx         # Deep link invite
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── IconButton.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── Toast.tsx
│   │   ├── FAB.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── index.ts
│   ├── lists/
│   │   ├── ListCard.tsx
│   │   └── ListFormSheet.tsx
│   ├── items/
│   │   ├── ItemCard.tsx
│   │   ├── ItemFormSheet.tsx
│   │   ├── FilterBar.tsx
│   │   ├── BottomActionBar.tsx
│   │   └── RetailerLinkCard.tsx
│   └── shared/
│       └── CostSummary.tsx
├── hooks/
│   ├── useGiftLists.ts
│   ├── useGiftItems.ts
│   └── useSelection.ts
├── providers/
│   ├── AuthProvider.tsx        # Existing
│   ├── SelectionProvider.tsx   # New
│   └── ToastProvider.tsx       # New
├── lib/
│   ├── constants/
│   │   ├── colors.ts           # Existing
│   │   └── typography.ts       # New
│   ├── supabase/
│   │   └── client.ts           # Existing
│   ├── types/
│   │   └── index.ts            # New - shared types
│   └── logger.ts               # New
├── app.json                    # Update scheme
└── eas.json                    # New
```

---

## Component Specifications

### FAB (Floating Action Button)
```
Position: bottom-right, 24px from edges
Size: 56x56
Color: #6366f1 (accent)
Shadow: rgba(99,102,241,0.4), offset 0,4, radius 12
Icon: 24x24 white plus
Pressed: #5558e3
```

### Bottom Sheet
```
Background: #141414
Border radius: 20px (top corners only)
Border: 1px #2d2d2d (no bottom)
Handle: 40x4, #3d3d3d, centered, 16px margin bottom
Max height: 85% of screen
Backdrop: rgba(0,0,0,0.7)
```

### Item Selection State
```
Normal: #141414 background, 1px #2d2d2d border
Selected: 4px left border #6366f1, rgba(99,102,241,0.15) background
Completed: 4px left border #10b981, 0.7 opacity
```

### Filter Bar Chip
```
Inactive: #2d2d2d background, #a1a1aa text
Active: rgba(99,102,241,0.2) background, #6366f1 border, #6366f1 text
Size: 20px border radius, 16px horizontal padding, 8px vertical
```

---

## Security Checklist

- [ ] Remove/hide demo login in production builds
- [ ] Strengthen password to 8+ chars with uppercase/lowercase/number
- [ ] Sanitize error messages (generic user-facing, detailed in logs)
- [ ] Add rate limiting to auth attempts
- [ ] Validate deep link tokens (UUID format, server-side verification)
- [ ] Remove console.log in production
- [ ] Add accessibility labels

---

## Dependencies to Add

```bash
pnpm add @gorhom/bottom-sheet
# Note: react-native-reanimated and react-native-gesture-handler already installed
```

---

## Success Criteria

Before release, verify:
- [ ] User can create a new list from dashboard
- [ ] User can add items to a list
- [ ] User can see retailer links and prices
- [ ] User can mark items as purchased
- [ ] User can filter items by status
- [ ] User can select multiple items and perform bulk actions
- [ ] Running cost totals are displayed
- [ ] App works on iOS and Android
- [ ] No critical security issues
- [ ] Empty states have clear CTAs

---

## What's Deferred to v1.1

- AI Quick Add (requires API integration)
- AI Budget Analysis
- Push notifications
- Offline-first with background sync
- Privacy blur toggle
- Invite creation (can accept, not create)

---

## Questions for User

1. **Retailer Links:** Should users be able to add/edit retailer links from mobile, or is this read-only (added via web)?

2. **Demo Login:** Should we keep the demo login for testing, or remove it entirely? If keep, should it only appear in development builds?

3. **Color Picker:** For list colors, should we use 6-8 preset colors (simpler) or a full color picker (more options)?

4. **Deep Linking Domain:** What domain should universal links use? `giftsync.vercel.app` or a custom domain?
