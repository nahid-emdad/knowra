# Knowra

> **Knowledge Without Boundaries.**  
> An open source, reliable, multilingual knowledge infrastructure for everyone.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)

---

## 1. Overview

**Knowra** is an open-source knowledge platform designed to make reliable information accessible, understandable, searchable, and reusable across languages.

Unlike generic AI chat wrappers that hallucinate facts and invent citations, Knowra is a **structured knowledge infrastructure** where every published knowledge item is anchored to verified primary sources (academic papers, official documentation, government datasets, and educational institutions).

### Core Mission
Make reliable knowledge accessible to everyone, regardless of language, location, technical skills, or financial circumstances.

### Primary Principles
- **Open by Default:** Fully open-source under Apache-2.0.
- **Source Transparency:** Every published entry contains at least one verified source.
- **Multilingual Native:** First-class support for English (`en`) and Bengali (`bn`), extensible to Arabic and other languages.
- **AI-Assisted, Not AI-Dependent:** Core platform operates 100% without external AI credentials.
- **Human-Reviewed Publishing:** Community contributions undergo structured editorial review before publication.
- **Developer-Friendly:** Public, versioned REST APIs for third-party educational tools and researchers.

---

## 2. Product Modules

| Module | Description | Key Features |
|---|---|---|
| **Module A: Knowra Web** | Public knowledge discovery portal | Search, article reader, category explorer, bilingual viewer |
| **Module B: Knowra API** | Developer API (`/api/v1`) | Structured retrieval, search, source metadata, pagination |
| **Module C: Knowra Community** | Peer contribution & moderation | Community submissions, revision tracking, editorial reviews |

---

## 3. Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & CSS Variables
- **Database:** [PostgreSQL 16](https://www.postgresql.org/) with `pg_trgm` extension
- **ORM:** [Prisma ORM](https://www.prisma.io/)
- **Search Engine:** PostgreSQL Full-Text Search with language-aware trigram/simple routing for Bengali
- **Testing:** [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **Icons:** [Lucide React](https://lucide.dev/) (Strict prohibition of emoji UI icons)

---

## 4. Getting Started

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
   Edit `.env` to configure your PostgreSQL connection string.

4. **Initialize Database (Docker Option):**
   If you have Docker installed, start a preconfigured PostgreSQL container with `pg_trgm` extension:
   ```bash
   docker-compose up -d
   ```

5. **Generate Prisma Client & Run Migrations:**
   ```bash
   npm run prisma:generate
   # When database is connected:
   # npm run prisma:migrate
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Development & Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Type check
npm run typecheck

# Lint check
npm run lint

# Production build
npm run build
```

---

## 6. Project Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:
- [Architecture & Data Flow](./docs/ARCHITECTURE.md)
- [Development Roadmap](./docs/ROADMAP.md)
- [Public REST API Specification](./docs/API.md)
- [Bengali Full-Text Search Strategy](./docs/BANGLA_SEARCH.md)

---

## 7. Open Source Governance

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)

---

## 8. License

Knowra is licensed under the **Apache License, Version 2.0**. See [LICENSE](./LICENSE) for the full license text.
