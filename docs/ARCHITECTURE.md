# Knowra Architecture & System Design

## 1. High-Level Architecture

Knowra is organized into three primary product modules running on a unified Next.js App Router and PostgreSQL backend:

```mermaid
flowchart TD
    subgraph ClientLayer["Clients & Consumers"]
        WebClient["Knowra Web (Next.js 15 App)"]
        MobileClient["Mobile / Progressive Web"]
        ExtAPI["External Devs & SDKs"]
    end

    subgraph ServiceLayer["Next.js App Router & Server Services"]
        AuthMiddleware["Server Auth Middleware (Auth.js)"]
        SearchService["Search Engine (English FTS + Bengali Trigrams)"]
        KnowledgeService["Knowledge Management Service"]
        ReviewService["Moderation & Review Pipeline"]
        AIService["AI Provider Abstraction (Optional)"]
    end

    subgraph DataLayer["Persistence & Storage"]
        PrismaORM["Prisma ORM (Singleton)"]
        PostgresDB[("PostgreSQL 16 DB\n(pg_trgm + GIN Indexes)")]
    end

    WebClient --> AuthMiddleware
    MobileClient --> AuthMiddleware
    ExtAPI --> AuthMiddleware

    AuthMiddleware --> KnowledgeService
    AuthMiddleware --> SearchService
    AuthMiddleware --> ReviewService

    KnowledgeService --> AIService
    KnowledgeService --> PrismaORM
    SearchService --> PrismaORM
    ReviewService --> PrismaORM

    PrismaORM --> PostgresDB
```

---

## 2. Module Breakdown

### Module A: Knowra Web
- **Discovery Platform:** Server Components render knowledge articles, categories, and language toggles.
- **Bilingual Interface:** Instant language switching between English (`en`) and Bengali (`bn`).
- **Reading Comfort:** Scholarly typography pairing Atkinson Hyperlegible and Crimson Pro, with Noto Sans Bengali.
- **Source Verification:** Margin citations and footnotes directly referencing verified sources.

### Module B: Knowra API (`/api/v1`)
- **Public Endpoints:** Read operations for knowledge items, categories, search, and sources.
- **Security:** Rate limited by IP; no private user records, moderation discussions, or draft items are exposed.
- **Standardized Response Envelope:**
  ```json
  {
    "success": true,
    "data": {},
    "meta": { "page": 1, "limit": 20, "total": 100 }
  }
  ```

### Module C: Knowra Community & Moderation
- **Submission Workflow:** Unauthenticated/registered users submit knowledge with proposed sources (`Submission` entity).
- **Admin Review:** Reviewers evaluate submissions, record decisions (`APPROVED`, `REJECTED`, `CHANGES_REQUESTED`), and write revision histories (`Revision` entity).
- **Server-Side Protection:** Admin routes and API mutations require verified `ADMIN` or `EDITOR` session tokens.

---

## 3. Database Entity Relationship Overview

```mermaid
erDiagram
    User ||--o{ KnowledgeItem : authors
    User ||--o{ Review : conducts
    User ||--o{ Revision : edits
    Category ||--o{ KnowledgeItem : contains
    Category ||--o{ Category : parent_of
    KnowledgeItem ||--o{ KnowledgeTag : has
    Tag ||--o{ KnowledgeTag : tags
    KnowledgeItem ||--o{ KnowledgeSource : references
    Source ||--o{ KnowledgeSource : provides
    KnowledgeItem ||--o{ Translation : translates_to
    KnowledgeItem ||--o{ Revision : tracks
    Submission ||--o{ Review : reviewed_by
```

---

## 4. Decoupled AI Provider Architecture

```mermaid
classDiagram
    class AIProvider {
        <<interface>>
        +name: string
        +isAvailable: boolean
        +summarize(options) Promise~SummarizeResult~
        +translate(options) Promise~TranslateResult~
        +simplify(options) Promise~SimplifyResult~
        +suggestTags(options) Promise~SuggestTagsResult~
    }
    class MockAIProvider {
        +name: "mock"
        +isAvailable: true
        +summarize()
        +translate()
        +simplify()
        +suggestTags()
    }
    class GeminiAIProvider {
        +name: "gemini"
        +isAvailable: boolean
    }
    class OpenAIAIProvider {
        +name: "openai"
        +isAvailable: boolean
    }

    AIProvider <|.. MockAIProvider
    AIProvider <|.. GeminiAIProvider
    AIProvider <|.. OpenAIAIProvider
```

AI operations strictly obey Section 6.3:
1. AI output is clearly marked (`isAiGenerated: true`).
2. AI-generated translations default to `reviewStatus: DRAFT` requiring human approval.
3. No hallucinated citations: AI operations cannot create `Source` records automatically.
