# Feature: Reusable MainLayout App Shell for Protected Routes

## Objective
Implement a reusable `MainLayout` (App Shell) component for all authenticated/protected routes in React Router (`App.tsx`), eliminating navbar/sidebar duplication and providing persistent, consistent navigation across Feed, Profile, Chat, Explore, and Notifications.

## Scope & Constraints
- Screaming/Atomic Architecture in `yaga-frontend/src/components/layout/MainLayout/`.
- CSS Modules + TypeScript strict typing (zero `any`, readonly models).
- Responsive layout supporting desktop (sticky sidebar + navbar + content area) and mobile viewports.
- Vitest unit tests with `@testing-library/react`.
- Conventional Commit (`feat(layout): ...`).

## Tasks
- [x] Task 1: Create `MainLayout` component (`MainLayout.tsx`, `MainLayout.module.css`, `MainLayout.types.ts`, `index.ts`, `MainLayout.test.tsx`).
- [x] Task 2: Update `yaga-frontend/src/components/layout/index.ts` to export `MainLayout`.
- [x] Task 3: Refactor `App.tsx` to wrap protected routes inside `MainLayout` with `<Outlet />`.
- [x] Task 4: Adapt `FeedPage.tsx`, `ProfilePage.tsx`, and `ChatPage.tsx` to work seamlessly inside `MainLayout`.
- [x] Task 5: Run full test suite (`pnpm test`), lint (`pnpm run lint`), and build verification (`pnpm run build`), then commit.

## Verification Evidence
- `pnpm run lint`: 0 errors, 0 warnings.
- `pnpm run build`: Successful compilation (`tsc -b && vite build` built in 549ms).
- `pnpm test`: **85/85 tests passing** across 30 test suites.

## Next Steps
Commit changes with Conventional Commit and push to remote.
