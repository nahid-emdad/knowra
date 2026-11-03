# Changelog

All notable changes to Knowra will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-03 — Production MVP Release

### Added
- **Task 1: Foundation (Architecture, DB & Types):**
  - Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS with semantic design tokens.
  - Complete Prisma schema with 11 entities: `User`, `Category`, `Tag`, `KnowledgeItem`, `Translation`, `Source`, `KnowledgeSource`, `KnowledgeTag`, `Submission`, `Review`, `Revision`.
  - Comprehensive seed dataset with verified peer-reviewed sources (Nature, NASA, Banglapedia, IEEE, UNESCO).

- **Task 2: Core Knowledge Engine:**
  - PostgreSQL full-text search with bilingual routing: English `tsvector` + Bengali `pg_trgm` / simple tokenization.
  - Strict Epistemic Rule: Published articles require at least one verified primary source (PRD Section 5.3).

- **Task 3: Web Platform & Design Direction Finalization:**
  - Responsive homepage with centered search focus and category explorer.
  - Article reader with peer-reviewed citation cards and revision badges.
  - Direction 3: Spatial Knowledge Constellation (`/constellation`) with interactive SVG graph and Node Dossier.

- **Task 4: Admin & Moderation Platform:**
  - Server-protected editorial console (`/admin`).
  - Community submissions queue with approval/revision/rejection workflow.
  - Revision history and immutable audit trail.

- **Task 5: AI Integration & Provider Adapters:**
  - Decoupled `AIProvider` architecture with Google Gemini REST and OpenAI REST adapters.
  - Deterministic offline `MockAIProvider` fallback ensuring 100% non-AI independence.
  - Multi-tier reading level simplification (`elementary` / `high_school` / `general`).
  - AI Safety rules compliance (`isAiGenerated: true`, `reviewRequired: true`).

- **Task 6: Public Developer API & OpenAPI Documentation (Module B):**
  - OpenAPI 3.1.0 machine-readable schema (`/api/v1/openapi.json`).
  - Public REST API endpoints: `/search`, `/knowledge`, `/categories`, `/sources`, `/submissions`, and `/ai/*`.
  - Token bucket / sliding window rate limiter (60 req/min anonymous, 120 req/min with API key).
  - Interactive Developer Portal & Sandbox at `/docs` with live request testing and multi-language code snippets (cURL, JavaScript, Python).

- **Task 7: Multilingual Translation Pipeline (PRD Section 5.4):**
  - Independent translation review tracking (translated articles do not auto-inherit reviewed status).
  - Dedicated Translation Review Console (`/admin/translations`) with side-by-side original/draft comparer.
  - Translation REST endpoints (`/api/v1/translations`).

- **Task 8: Production Polish & Security Hardening:**
  - Security HTTP headers (`Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy`).
  - Next.js server-side protection middleware guarding `/admin/*`.
  - System observability health check endpoint (`/api/health`).
  - 74 comprehensive unit and integration tests passing with 100% green status.
  - Next.js production build verified with 51 static and dynamic routes.

---

## [0.1.0-alpha] - 2026-11-03

### Added
- Initial project scaffold and foundational configuration.
