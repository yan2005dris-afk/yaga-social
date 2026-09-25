# Feature: HttpOnly Cookie for Refresh Token

## Objective
Migrate refresh token storage and transmission from `localStorage` to secure, HttpOnly, SameSite cookies to protect against XSS token theft, while configuring CORS with credentials in Quarkus backend.

## Scope & Constraints
- Backend: Quarkus 3.x, RESTEasy Reactive (`@CookieParam`, `NewCookie`, `Response.ResponseBuilder`).
- CORS: Explicit origin handling and `access-control-allow-credentials=true`.
- Frontend: React + TypeScript + Axios with `withCredentials: true`.
- Testing: All backend and frontend tests must pass.

## Tasks
- [x] Task 1: Backend CORS & Configuration updates in `application.properties` (`cors.origins`, `cors.access-control-allow-credentials`).
- [x] Task 2: Backend `AuthResource` and DTO updates to issue HttpOnly cookie on register, login, refresh, support logout (cookie clearing), and extract token from cookie.
- [x] Task 3: Backend tests updates and verification (`mvn test` - 20/20 passing).
- [x] Task 4: Frontend API client (`axios.ts`), auth services (`auth.ts`), and `AuthContext.tsx` refactor to use `withCredentials: true` and drop `localStorage` refresh token.
- [x] Task 5: Frontend tests execution and full build verification (`npm test` 5/5 passing, `npm run build` success).

## Verification Evidence
- Backend: `mvn test` executed and verified (20 tests passed, 0 failures).
- Frontend: `npm test` executed (5 tests passed), `npm run build` completed cleanly.
- Docker Compose: Configured `YAGA_SEED_ENABLED` and `CORS_ORIGINS` for development parity.

## Next Steps
Commit changes following Conventional Commits.
