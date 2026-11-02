# Knowra Public API Specification (v1)

**Base URL:** `https://knowra.org/api/v1` (or `http://localhost:3000/api/v1` in development)  
**Protocol:** HTTPS  
**Format:** JSON (`Content-Type: application/json`)

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested knowledge item does not exist.",
    "details": null
  }
}
```

---

## Endpoints

### 1. Global Search
Search published knowledge items across titles, summaries, and contents.

- **Route:** `GET /api/v1/search`
- **Query Parameters:**
  - `q` (string, required): Search query term (e.g. `solar`, `সালোকসংশ্লেষণ`)
  - `language` (string, optional): Language filter (`en`, `bn`, or `all`). Default: auto-detected.
  - `category` (string, optional): Category slug filter (e.g. `science`)
  - `page` (integer, optional): Page number (default: `1`)
  - `limit` (integer, optional): Results per page (default: `20`, max: `100`)
  - `sort` (string, optional): `relevance` (default) | `updated_at` | `created_at`

---

### 2. List Knowledge Items
Retrieve paginated published knowledge items.

- **Route:** `GET /api/v1/knowledge`
- **Query Parameters:**
  - `language` (string, optional): `en` | `bn`
  - `category` (string, optional): Category slug
  - `page` (integer, optional): Default `1`
  - `limit` (integer, optional): Default `20`

---

### 3. Get Knowledge Item
Retrieve a single knowledge item by ID or slug with verified sources and translations.

- **Route:** `GET /api/v1/knowledge/:id` (or `/api/v1/knowledge/slug/:slug`)
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "clt9x48...",
    "slug": "photosynthesis-process",
    "title": "Photosynthesis",
    "summary": "The biological process by which green plants transform light energy into chemical energy.",
    "content": "Full article markdown content...",
    "language": "en",
    "category": { "name": "Science", "slug": "science" },
    "tags": ["biology", "botany", "energy"],
    "status": "REVIEWED",
    "sources": [
      {
        "title": "Plant Physiology, 6th Edition",
        "url": "https://academic.example.edu/paper/123",
        "publisher": "Oxford University Press",
        "sourceType": "ACADEMIC"
      }
    ],
    "translations": [
      { "language": "bn", "slug": "saloksongshleshan", "title": "সালোকসংশ্লেষণ" }
    ],
    "lastReviewedAt": "2026-10-15T08:00:00.000Z"
  }
}
```

---

### 4. List Categories
Retrieve all knowledge categories with hierarchical parent-child relationships.

- **Route:** `GET /api/v1/categories`

---

### 5. Get Category
Retrieve details and knowledge items under a specific category.

- **Route:** `GET /api/v1/categories/:slug`

---

### 6. Submit Knowledge (Community Contribution)
Submit a proposed knowledge item or correction. Subject to rate limiting and editorial review.

- **Route:** `POST /api/v1/submissions`
- **Payload:**
```json
{
  "title": "Quantum Entanglement",
  "content": "Detailed explanation of quantum entanglement...",
  "language": "en",
  "contributorName": "Ada Lovelace",
  "contributorEmail": "ada@example.org",
  "proposedSources": "https://journals.aps.org/pr/abstract/10.1103/PhysRev.47.777"
}
```
- **Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "sub_987654",
    "status": "PENDING",
    "submittedAt": "2026-11-03T02:00:00.000Z"
  }
}
```
