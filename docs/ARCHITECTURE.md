# 📘 Project Architecture Documentation

**Stack:** Nuxt 4 + Nitro + Supabase  
**Architecture Style:** Modular Vertical Slices with Server-Side Data Access  
**Target Platforms:** Web + Native Mobile (Shared Backend)

---

# 1. Architectural Overview

## 1.1 System Layers

### Client (Nuxt 4)

- Presentation Layer (Pages / Components)
- State Layer (Pinia)
- Application Layer (Composables)
- Client Repository Layer (HTTP only)

### Server (Nitro)

- API Layer (`server/api`)
- Service Layer (Business Logic)
- Repository Layer (Supabase access)
- Database (Supabase PostgreSQL)

---

## 1.2 Data Flow

Page
↓
Pinia Store
↓
Composable (Use Case)
↓
Client Repository ($fetch)
↓
Nitro API
↓
Server Service
↓
Server Repository
↓
Supabase DB

---

### Core Rules

- Frontend NEVER calls Supabase directly.
- Supabase Service Role Key is server-only.
- Business validation MUST exist server-side.
- Client validation is optional (UX optimization only).
- Database is the system source of truth.

---

# 2. Project Structure

/app
/pages
/components

/modules
/orders
/domain
/data
/state
useOrders.ts
index.ts

/server
/api
/orders
/modules
/orders
order.service.ts
order.repository.ts

/lib
supabase-server.ts

---

# 3. Modular Vertical Slice Pattern

Each feature (Orders, Users, Inventory, etc.) is isolated.

Example:

/modules/orders
/domain
/data
/state
useOrders.ts
index.ts

Each module is self-contained and independent.

---

# 4. Client Layer Responsibilities

## 4.1 Domain Layer (`/modules/orders/domain`)

Contains:

- Type definitions
- Pure business logic
- Stateless utility functions

Rules:

- ❌ No Supabase
- ❌ No HTTP
- ❌ No Pinia
- ❌ No Vue imports
- ✅ Pure functions only

Example responsibilities:

- Calculate totals
- Validate order items
- Transform domain models

---

## 4.2 Data Layer (`/modules/orders/data`)

Client-side repository.

Responsibilities:

- Call `/api`
- Handle HTTP communication
- Normalize responses if needed

Rules:

- ❌ No business logic
- ❌ No direct Supabase usage
- ✅ Use `$fetch`

---

## 4.3 State Layer (`/modules/orders/state`)

Pinia store.

Responsibilities:

- Store server data
- Manage loading states
- Call composables
- Mirror backend state

Rules:

- ❌ No business rules
- ❌ No direct Supabase access
- ❌ No heavy validation logic

Pinia is the client source of truth.  
Supabase is the system source of truth.

---

## 4.4 Composable (`useOrders.ts`)

Acts as use-case orchestrator.

Responsibilities:

- Coordinate domain logic
- Call client repository
- Prepare payloads

Rules:

- ❌ No direct Supabase access
- ❌ No UI logic
- ✅ Orchestration only

---

## 4.5 Public API (`index.ts`)

Exports only what other modules can access.

Example:

```ts
export { useOrders } from "./useOrders";
export { useOrderStore } from "./state/order.store";
export type { Order, OrderItem } from "./domain/order.types";
```

Other modules MUST import only from:

import { useOrderStore } from '@/modules/orders'

Never import internal files directly.

---

# 5. Server Layer Responsibilities

## 5.1 Supabase Server Client

Location:

/lib/supabase-server.ts

Uses:

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

Rules:

- Never exposed to frontend
- Only used in server repository layer

---

## 5.2 Server Repository

Location:

/server/modules/orders/order.repository.ts

Responsibilities:

- Raw database operations
- Query Supabase
- Handle DB errors

Rules:

- ❌ No business validation
- ❌ No HTTP handling
- ✅ Database access only

---

## 5.3 Server Service

Location:

/server/modules/orders/order.service.ts

Responsibilities:

- Business rules
- Validation
- Authorization (future)
- Transaction orchestration

Rules:

- Must validate all critical operations
- Must be the authoritative business logic layer

---

## 5.4 API Layer

Location:

/server/api/orders/\*.ts

Responsibilities:

- Parse request
- Call service
- Return response

Rules:

- ❌ No DB queries
- ❌ No business logic
- ✅ Thin transport layer only

---

# 6. Security Principles

1. Supabase Service Role Key exists only on the server.
2. Client communicates only with Nitro API
3. Server validates all critical operations.
4. Sensitive logic must live server-side.
5. Supabase RLS policies must still be configured properly.
6. Never trust client-provided totals or sensitive fields.

---

# 7. Modular Boundary Rules

Modules:

- Must NOT import internal files from other modules.
- Must import only from another module’s index.ts.

Correct:
`import { useOrderStore } from '@/modules/orders'`

Incorrect:
`import { calculateOrderTotal } from '@/modules/orders/domain/order.service'`

This prevents cross-module coupling.

---

# 8. Agile / Scrum Compatibility

This architecture enables:

- Parallel feature development
- Safe refactoring
- Independent module evolution
- Reduced regression risk
- Incremental backend hardening

Example sprint flow:

- Sprint 1 → Orders module
- Sprint 2 → Inventory module
- Sprint 3 → Reports module

Each module evolves independently.

---

# 9. Mobile Readiness

Because Supabase is server-only:

Native mobile apps can consume:

`https://api.yourdomain.com/api/orders`

No architectural changes required.

Web and mobile share:

- Business logic
- Validation rules
- Database structure
- Security model

---

# 10. Change Safety Scenarios

If DB schema changes:
→ Update server repository only.

If pricing rules change:
→ Update server service (and optionally client domain).

If Supabase is replaced:
→ Update server repository only.

If frontend is rewritten:
→ Backend remains untouched.

If mobile app is added:
→ Reuse same API.

---

# 11. Source of Truth Summary

| Layer          | Source of Truth |
| -------------- | --------------- |
| Database       | Supabase        |
| Business Rules | Server Service  |
| Client State   | Pinia           |
| Transport      | Nitro API       |

---

# 12. Architectural Principles

- Separation of Concerns
- Single Responsibility
- Explicit Module Boundaries
- Server Authority
- Replaceable Infrastructure
- Mobile-First Backend Strategy
- Low Coupling, High Cohesion

---

# 13. Long-Term Extensibility

This architecture supports:

- JWT verification middleware
- Role-based access control (RBAC)
- API versioning (/api/v1)
- Background workers
- Microservice extraction
- Independent backend deployment
- CI/CD separation (Frontend & Backend)

---

# 14. Final Rule

Frontend is a consumer.
Backend is the authority.
Database is the truth.

Maintain strict boundaries.
Avoid cross-module leakage.
Keep business logic centralized.
