# Repository Guidelines

## Project Structure & Module Organization

This is a Nuxt 4 + TypeScript project. Main frontend code lives in `app/`:

- `app/pages/` route views (grouped with route groups like `(auth)` and `(landing)`).
- `app/layouts/` shared layout shells (`admin.vue`, `landing.vue`, etc.).
- `app/stores/` Pinia stores, and `app/composables/` reusable composition logic.

Backend Nitro handlers live in `server/`:

- `server/api/v1/**` API endpoints.
- `server/middleware/` server auth middleware.
- `server/utils/`, `server/repositories/`, and `server/types/` shared server concerns.

Shared types are in `shared/`, and architecture notes are in `docs/`.

## Build, Test, and Development Commands

- `npm run dev` starts local dev server at `http://localhost:3000`.
- `npm run build` creates a production build.
- `npm run preview` runs the built app locally for verification.
- `npm run generate` produces a static output when needed.
- `npm run lint` runs ESLint across the repository.
- `npm run lint:fix` auto-fixes lint issues where possible.

## Coding Style & Naming Conventions

- Use TypeScript and Vue SFCs consistently.
- Follow Prettier config (`.prettierrc`): tabs enabled, `printWidth` 100, trailing commas.
- Run lint before pushing; stylistic ESLint rules are mostly relaxed, so favor readability and consistency with nearby files.
- Naming:
  - Vue components: `PascalCase.vue` (example: `AppHero.vue`).
  - Composables: `useX.ts` (example: `useAuth.ts`).
  - Stores: `*.store.ts`.
  - API files: Nuxt/Nitro route-style filenames (example: `server/api/v1/users/[id].get.ts`).

## Testing Guidelines

Automated tests are not set up yet in this repository. For now:

- Treat `npm run lint` and `npm run preview` as minimum quality checks.
- Manually verify impacted pages and API endpoints before opening a PR.
- When adding tests, colocate by feature and use clear names like `feature-name.spec.ts`.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit-style prefixes (`feat:`, `refactor:`, `style:`, `docs:`, `chore:`). Keep using that format with concise scopes, for example:

- `feat(auth): add me endpoint guard`

For pull requests:

- Describe what changed and why.
- Link related issue(s) when available.
- Include screenshots for UI changes (admin/user/landing views).
- Confirm lint passes and list manual test steps performed.
