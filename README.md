# Knowra

> **Knowledge Without Boundaries.**  
> An open source, reliable, multilingual knowledge infrastructure for everyone.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/Tests-74%20Passing-brightgreen)](https://vitest.dev/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1.0-emerald)](https://knowra.org/api/v1/openapi.json)

---

## 1. Overview

**Knowra** is an open-source knowledge platform designed to make reliable information accessible, understandable, searchable, and reusable across languages.

Unlike generic AI chat wrappers that hallucinate facts and invent citations, Knowra is a **structured knowledge infrastructure** where every published knowledge item is anchored to verified primary sources (academic journals, official documentation, government datasets, and educational institutions).

### Core Mission
Make reliable knowledge accessible to everyone, regardless of language, location, technical skills, or financial circumstances.

### Primary Principles
- **Open by Default:** Fully open-source under Apache-2.0.
- **Source Transparency:** Every published entry contains at least one verified primary source (PRD Section 5.3). Zero fabricated citations.
- **Multilingual Native:** First-class support for English (`en`) and Bengali (`bn`), with independent translation review tracking (PRD Section 5.4).
- **AI-Assisted, Not AI-Dependent:** Core platform operates 100% without external AI credentials (PRD Section 6.3).
- **Human-Reviewed Publishing:** Community contributions and translations undergo structured editorial review before publication.
- **Developer-Friendly:** Public, versioned REST APIs (`/api/v1`) with rate limiting and OpenAPI 3.1.0 specification.
- **Interactive Spatial Graph:** Direction 3 Spatial Knowledge Constellation (`/constellation`) mapping knowledge as interactive nodes with live scientific dossiers.

---

## 2. Product Modules

| Module | Description | Key Features |
|---|---|---|
| **Module A: Knowra Web** | Public knowledge discovery portal | Search, article reader, category explorer, bilingual viewer, 3D constellation |
| **Module B: Knowra API** | Public developer API (`/api/v1`) | OpenAPI 3.1.0, rate limiting, search, knowledge retrieval, interactive playground (`/docs`) |
| **Module C: Knowra Community** | Peer contribution & moderation | Community submissions, revision tracking, editorial reviews, translation console |
| **AI Services Engine** | Decoupled AI enhancement | Multi-tier simplification (Elementary/High School/Standard), AI translation drafts, topic tags |

---

## 3. Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & CSS Variables (Refined subtle borders, no generic AI gradients)
- **Database:** [PostgreSQL 16](https://www.postgresql.org/) with `pg_trgm` extension
- **ORM:** [Prisma ORM 6](https://www.prisma.io/)
- **Search Engine:** PostgreSQL Full-Text Search with language-aware trigram/simple routing for Bengali
- **AI Engine:** Decoupled REST adapters for Google Gemini, OpenAI, and deterministic offline Mock fallback
- **Testing:** [Vitest 3](https://vitest.dev/) (74 passing unit & integration tests)
- **Icons:** [Lucide React](https://lucide.dev/) (Strict prohibition of raw emoji UI icons)

---

## 4. Key Pages & Routes

- `/` — Homepage featuring instant search, domain categories, and Spatial Constellation spotlight.
- `/constellation` — **Spatial Knowledge Constellation**: Interactive multi-node 3D graph and live scientific dossier drawer with formulas ($6CO_2 + 6H_2O \longrightarrow C_6H_{12}O_6 + 6O_2$) and citations.
- `/search?q=...` — Multilingual search with Bengali Unicode inflection support and category filters.
- `/knowledge/[slug]` — Canonical article reader with verified citation cards and interactive AI reading level simplification.
- `/categories/[slug]` — Discipline explorer (Science, Technology, History, Mathematics, etc.).
- `/contribute` — Public community submission workflow.
- `/docs` / `/developers` — Interactive Developer Documentation portal with live request testing console, cURL/JS/Python snippets, and OpenAPI 3.1 schema.
- `/admin` — Editorial console (Overview, Submissions Queue, Translation Queue, Knowledge Management, Sources Registry).
- `/api/health` — System observability and uptime status endpoint.
- `/api/v1/openapi.json` — Machine-readable OpenAPI 3.1.0 specification.

---

## 5. Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL 16 (or Docker)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nahid-emdad/knowra.git
   cd knowra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to configure your database connection string and optional AI keys:
   ```env
   DATABASE_URL="postgresql://knowra_user:knowra_secret@localhost:5432/knowra_db?schema=public"
   AI_PROVIDER="mock" # or "gemini" / "openai"
   GEMINI_API_KEY=""
   OPENAI_API_KEY=""
   ```

4. **Initialize Database:**
   ```bash
   npm run prisma:generate
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Testing & Quality Verification

```bash
# Run all 74 unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# TypeScript type check (0 errors required)
npm run typecheck

# Production build verification (51 routes)
npm run build
```

---

## 7. Open Source Governance

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

---

## 8. License

Knowra is licensed under the **Apache License, Version 2.0**. See [LICENSE](./LICENSE) for the full license text.
