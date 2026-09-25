# Feature: Containerization and Docker/Podman Compatibility Improvements

## Objective
Optimize containerization across backend and frontend for security (non-root execution), performance (build context caching and `.dockerignore`), health checks, and dual Docker/Podman ecosystem compatibility (standard `Containerfile` + `Dockerfile`).

## Scope & Constraints
- Backend: Multi-stage build, unprivileged user (UID 10001 / quarkus), healthcheck support via `quarkus-smallrye-health`, complete `.dockerignore`.
- Frontend: Multi-stage build with `pnpm`, unprivileged Nginx (`nginxinc/nginx-unprivileged:alpine`), port alignment (8080 unprivileged internally), `/healthz` endpoint, complete `.dockerignore`.
- Orchestration: Update `compose.yaml` with non-root ports (3000:8080), healthchecks (`service_healthy` conditions), and SELinux volume relabeling (`:Z`).
- Compatibility: Provide both `Containerfile` and `Dockerfile` across backend and frontend.

## Tasks
- [x] Task 1: Add comprehensive `.dockerignore` files for `yaga-frontend` and `yaga-backend`.
- [x] Task 2: Backend container hardening with non-root user (UID 10001), `Containerfile`, and `quarkus-smallrye-health` integration.
- [x] Task 3: Frontend container hardening with unprivileged Nginx (UID 101), `Containerfile`, `/healthz` endpoint, and non-root port 8080.
- [x] Task 4: Update `compose.yaml` with healthchecks, non-root ports, and `depends_on` conditions.
- [x] Task 5: Verify builds, tests, and commit changes using Conventional Commits.

## Verification Evidence
- Backend tests: `mvn test` passed (20 tests passed, 0 failures).
- Frontend tests: `pnpm test` passed (5 tests passed), `pnpm run build` completed successfully.
- Files created/updated:
  - `yaga-frontend/.dockerignore`
  - `yaga-backend/.dockerignore`
  - `yaga-frontend/Dockerfile` & `yaga-frontend/Containerfile`
  - `yaga-backend/Dockerfile` & `yaga-backend/Containerfile`
  - `yaga-frontend/nginx.conf`
  - `yaga-backend/pom.xml`
  - `compose.yaml`

## Next Steps
Commit work units using Conventional Commits and push to remote.
