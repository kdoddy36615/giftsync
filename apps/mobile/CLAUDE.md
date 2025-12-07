# GiftSync Mobile App

## Overview

React Native mobile app (iOS + Android) using Expo with EAS builds.

## Tech Stack

- **Framework:** Expo (managed workflow)
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Auth Storage:** expo-secure-store
- **Database:** Supabase (via API routes)
- **Builds:** EAS (required for Windows - no local iOS builds)

## Directory Structure

```
apps/mobile/
├── app/
│   ├── (auth)/          # Login, signup screens
│   ├── (tabs)/          # Main tab navigator
│   │   ├── index.tsx    # Dashboard (list of lists)
│   │   ├── list/[id].tsx # List detail
│   │   └── settings.tsx # Settings
│   └── invite/[token].tsx # Accept invite
├── components/
│   ├── ui/              # Reusable primitives
│   ├── lists/           # List components
│   ├── items/           # Item components
│   └── shared/          # Shared components
├── lib/
│   └── supabase/client.ts # Supabase with SecureStore
├── providers/
│   ├── AuthProvider.tsx
│   └── ToastProvider.tsx
├── app.json
└── eas.json
```

## Key Commands

```bash
# From monorepo root
pnpm dev:mobile         # Start Expo dev server

# From apps/mobile/
npx expo start          # Start dev server
npx expo start --clear  # Clear cache and start

# EAS Builds
eas build --profile development --platform android
eas build --profile development --platform ios
```

## Supabase Setup

```typescript
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const SecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(url, key, {
  auth: {
    storage: SecureStoreAdapter,
    detectSessionInUrl: false,
  },
})
```

## API Endpoints (consumed from web app)

```
GET  /api/dashboard           - Fetch all user data
POST /api/lists               - Create list
PATCH /api/lists/[id]         - Update list
DELETE /api/lists/[id]        - Delete list
POST /api/items               - Create item
PATCH /api/items/[id]         - Update item
DELETE /api/items/[id]        - Delete item
POST /api/items/mark-complete - Bulk mark complete
POST /api/ai/quick-add        - AI quick add
POST /api/ai/budget           - AI budget analysis
```

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=https://giftsync.vercel.app
```

## Dependencies

```bash
# Core
@supabase/supabase-js
expo-secure-store
expo-router
react-native-url-polyfill

# UI (optional)
react-native-reanimated
react-native-gesture-handler
```

## Dark Theme Colors

Same as web app:
```
Background: #0f0f0f
Card: #141414
Border: #2d2d2d
Text: #e4e4e7
Accent: #6366f1 (indigo)
Success: #10b981 (green)
Danger: #dc2626 (red)
```

## Mobile-Specific Patterns

### Instead of window.open (bulk tabs)
```typescript
import { Share } from 'react-native'

const shareLinks = async (links: string[]) => {
  await Share.share({
    message: links.join('\n'),
    title: 'Gift Links'
  })
}
```

### Instead of spacebar (privacy blur)
```typescript
<TouchableOpacity onPress={() => setBlurred(!blurred)}>
  <Text>{blurred ? 'Show' : 'Hide'} Prices</Text>
</TouchableOpacity>
```
