# Feature: Authentication Module (Backend + Frontend)

## Objective
Implement complete end-to-end authentication for YAGA Social according to HU01, HU02, and ADR-001:
- Screaming Architecture backend in Quarkus (Domain, Application, Infrastructure).
- BCrypt password hashing + SmallRye JWT (Access Token 15m + Refresh Token 7d).
- Endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me`.
- React frontend: Auth page matching `01-auth.html` mockup, `AuthContext`, Axios interceptors for automatic token refresh, and protected routes.

## Scope & Constraints
- Screaming Architecture (Domain -> Application -> Infrastructure).
- Conventional commits (`feat(auth): ...`).
- Pass backend Spotless, JUnit, JaCoCo and frontend ESLint, Prettier, Vitest, TypeScript.
- No secrets hardcoded in source.

## Checklist & Tasks
- [x] Task 1: Backend Domain Models and Exceptions (`com.yaga.auth.domain.model`, `com.yaga.auth.domain.exception`)
- [x] Task 2: Backend Application Ports and DTOs (`com.yaga.auth.application.port`, `com.yaga.auth.application.dto`)
- [x] Task 3: Backend Infrastructure Adapters (BCrypt, SmallRye JWT, Neo4j Repository)
- [x] Task 4: Backend Application AuthService and Web Resource (`AuthResource`, `AuthExceptionMappers`)
- [x] Task 5: Backend Unit and Integration Tests (`AuthServiceTest`, `AuthResourceTest`, `BCryptPasswordHasherAdapterTest`) - 17/17 tests passing
- [x] Task 6: Frontend Auth API client and Token Refresh Interceptor (`src/api/auth.ts`, `src/api/axios.ts`)
- [x] Task 7: Frontend Auth Context & State Management (`src/context/AuthContext.tsx`, `src/hooks/useAuth.ts`)
- [x] Task 8: Frontend Auth Page Component & Mockup Integration (`src/pages/AuthPage.tsx`, Lucide icons, glassmorphism)
- [x] Task 9: Frontend Protected Routing & Integration Tests (`App.tsx`, `AuthPage.test.tsx`, `App.test.tsx`)
- [x] Task 10: Full Validation & CI verification (Spotless 0 issues, Maven 17 tests passed, JaCoCo reported, ESLint 0 errors, Prettier formatted, Vitest 5 tests passed, Vite build succeeded)
