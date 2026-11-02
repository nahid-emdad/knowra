# Changelog

All notable changes to Knowra will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-alpha] - 2026-11-03

### Added
- **TASK-001 Project Foundation:**
  - Initial repository layout, directory structure, and Apache-2.0 licensing.
  - Next.js 15, React 19, TypeScript 5, Tailwind CSS with design tokens.
  - Full Prisma ORM schema (`prisma/schema.prisma`) defining 11 entities:
    - `User`, `Category`, `Tag`, `KnowledgeItem`, `Translation`, `Source`, `KnowledgeSource`, `KnowledgeTag`, `Submission`, `Review`, `Revision`.
  - Decoupled `AIProvider` interface with zero-dependency `MockAIProvider` fallback.
  - Language-aware search architecture with Bengali Unicode detection and trigram strategy.
  - Docker Compose configuration for PostgreSQL 16 with `pg_trgm` and `unaccent` extensions.
  - Vitest test setup and foundation unit tests.
  - GitHub Actions CI workflow, issue templates, and PR template.
  - Complete project documentation: `ARCHITECTURE.md`, `ROADMAP.md`, `API.md`, and `BANGLA_SEARCH.md`.
