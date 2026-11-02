# Knowra Development Roadmap

This roadmap outlines the milestones and release phases defined in the Knowra Product Requirements Document.

---

## Phase 1 — Foundation (Current Milestone)
- [x] Initial repository structure and Git configuration.
- [x] Next.js 15, TypeScript 5, Tailwind CSS setup.
- [x] Complete PostgreSQL database schema (`prisma/schema.prisma`).
- [x] Decoupled `AIProvider` interface and mock implementation.
- [x] Search strategy architecture (Bengali Unicode detection and router).
- [x] Open-source governance files (`README.md`, `LICENSE`, `CONTRIBUTING.md`, etc.).
- [x] Docker Compose setup with `pg_trgm` extension.
- [x] Vitest unit testing setup and foundation test suite.

---

## Phase 2 — Core Knowledge Engine
- [ ] Database migrations execution on PostgreSQL.
- [ ] Knowledge CRUD service (`create`, `read`, `update`, `delete`, `archive`).
- [ ] Source management and link validation.
- [ ] Category hierarchy management (parent/child taxonomy).
- [ ] Translation management (English <-> Bengali linked entries).
- [ ] Revision tracking service (diff logging and editor attribution).

---

## Phase 3 — Web Platform (Module A)
- [ ] Direct viewable interactive prototypes with floating style switcher.
- [ ] Modern, accessible Homepage with centered search focus.
- [ ] Global Search page (`/search?q=...`) with category & language filtering.
- [ ] Knowledge Article reader (`/knowledge/[slug]`) with margin citations.
- [ ] Category explorer (`/categories/[slug]`).
- [ ] Bilingual switcher and responsive mobile navigation.

---

## Phase 4 — Admin & Moderation (Module C)
- [ ] Server-side authentication (Auth.js with `@auth/prisma-adapter`).
- [ ] Admin Dashboard (`/admin`) overview.
- [ ] Knowledge moderation & submission review pipeline.
- [ ] Source verification workflow.
- [ ] Revision history inspection and rollback capabilities.

---

## Phase 5 — Public API (Module B)
- [ ] REST API Route Handlers under `/api/v1`.
- [ ] Endpoints:
  - `GET /api/v1/search`
  - `GET /api/v1/knowledge`
  - `GET /api/v1/knowledge/:id`
  - `GET /api/v1/categories`
  - `GET /api/v1/categories/:slug`
  - `POST /api/v1/submissions`
- [ ] Input validation with Zod.
- [ ] Rate limiting and security headers.
- [ ] OpenAPI / Swagger documentation (`/api/v1/docs`).

---

## Phase 6 — AI Features (Optional & Decoupled)
- [ ] Google Gemini / OpenAI concrete adapters.
- [ ] Article summarization with non-AI fallback.
- [ ] Translation assistance with required human editorial review.
- [ ] Content simplification and automated tag suggestions.

---

## Phase 7 — Public Release & Ecosystem
- [ ] Security audit & OWASP vulnerability assessment.
- [ ] Performance testing & Lighthouse optimization (>95 scores).
- [ ] Accessibility review (WCAG 2.1 AA compliance).
- [ ] Production deployment to Vercel + managed PostgreSQL.
- [ ] Community onboarding and initial 100 reviewed knowledge items.
