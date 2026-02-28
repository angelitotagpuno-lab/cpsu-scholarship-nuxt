# Project Architecture

## 1. Current Stack
- **Frontend:** Nuxt 4, Vue 3, Pinia, Nuxt UI
- **Backend:** Nitro server routes (`server/api/**`)
- **Data/Auth provider:** Supabase (`@supabase/supabase-js`)
- **Language:** TypeScript across app and server

This document reflects the architecture currently implemented in the repository (not a future-state design).

## 2. Runtime Layers

### Frontend (`app/`)
- `pages/`: route-driven UI (public landing, user pages, admin pages, auth page)
- `layouts/`: page shells (`landing`, `admin`, `user-header`)
- `stores/`: Pinia state (`auth.store.ts`, `user.store.ts`)
- `composables/`: UI-facing client orchestration (`useAuth.ts`)
- `middleware/auth.global.ts`: route guarding for `/admin/**` and `/login`

### Backend (`server/`)
- `api/v1/auth/*`: implemented auth endpoints (`login`, `me`, `logout`)
- `api/v1/users/*`: scaffolded CRUD route handlers (currently placeholder responses)
- `middleware/auth.ts`: server-side auth guard for `/api/v1/users/**`
- `utils/supabase.ts`: Supabase client initialization via runtime config
- `repositories/user.respository.ts`: data access class for `users` table (not yet wired into user routes)

### Shared Contracts
- `server/types/`: backend types (database/query)
- `shared/models/`: shared model definitions

## 3. Request/Data Flow

### Auth flow (implemented)
1. `app/stores/auth.store.ts` calls `app/composables/useAuth.ts`
2. Composable calls `/api/v1/auth/login` or `/api/v1/auth/me` via `$fetch`
3. Server validates with Supabase Auth and sets/reads `auth_token` cookie
4. Store updates reactive auth state for route middleware and UI

### Protected API flow (partially implemented)
1. Request to `/api/v1/users/**`
2. `server/middleware/auth.ts` validates cookie/Bearer token using Supabase
3. Route handler executes
4. Current handlers return placeholders; repository integration is pending

## 4. Security and Configuration
- Auth token is stored in an HTTP-only cookie (`auth_token`)
- Cookie is `secure` in production and `sameSite: "strict"`
- Runtime config keys:
  - `NUXT_SUPABASE_URL`
  - `NUXT_SUPABASE_PUBLISHABLE_KEY`

## 5. Architectural Status
- **Implemented:** auth state + middleware + auth API endpoints
- **Scaffolded:** user CRUD endpoints and repository abstraction
- **Next alignment step:** connect `server/api/v1/users/*` handlers to `UserRepository` with validation and consistent response contracts
