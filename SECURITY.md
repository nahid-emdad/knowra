# Security Policy

Knowra prioritizes the security, data privacy, and integrity of the knowledge infrastructure.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

---

## Reporting a Vulnerability

If you discover a security vulnerability in Knowra, please do **NOT** open a public issue.

Please report the vulnerability responsibly via private email:
- **Email:** `security@knowra.org` (or directly via GitHub Private Vulnerability Reporting on this repository).

### Please include in your report:
1. Description of the vulnerability and its potential impact.
2. Step-by-step reproduction steps or Proof of Concept (PoC).
3. The affected component, route, or dependency.
4. Any proposed remediations.

### Response Timeline
- **Acknowledgement:** Within 48 hours.
- **Assessment & Triage:** Within 5 business days.
- **Fix & Public Advisory:** Coordinated release once a patch is tested and verified.

---

## Core Security Requirements in Knowra

- **Server-Side Authorization:** Admin operations are strictly verified server-side via session tokens; UI route hiding is never relied upon as an authorization boundary.
- **SQL Injection Prevention:** All database operations use Prisma parameterized queries; raw SQL queries are audited and parameterized.
- **XSS Prevention:** Content sanitization on all rendered markdown or external input using React's default escaping and DOMPurify.
- **Secrets Management:** No API keys, database credentials, or auth secrets are committed to Git. `.env.example` contains placeholders only.
- **Rate Limiting:** Public read and submission endpoints enforce IP-based rate limiting to prevent abuse.
