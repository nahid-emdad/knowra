# Security Policy

Knowra prioritizes the security, cryptographic integrity, and data privacy of our open-source knowledge infrastructure.

---

## Supported Versions

| Version | Supported          | Security Status |
| ------- | ------------------ | --------------- |
| 1.0.x   | :white_check_mark: | Active (Current GA) |
| < 1.0   | :x:                | Deprecated (Pre-audit alpha) |

---

## Reporting a Vulnerability

If you discover a security vulnerability in Knowra, please do **NOT** open a public issue.

Please report vulnerabilities responsibly via:
- **GitHub Private Vulnerability Reporting:** Navigate to the repository's [Security Tab](https://github.com/nahid-emdad/knowra/security) and click "Report a vulnerability".
- **Security Contact:** The Knowra Core Security Team via GitHub security advisory.

### Please include in your report:
1. Detailed description of the vulnerability and its potential impact.
2. Step-by-step reproduction steps or Proof of Concept (PoC).
3. The affected component, file path, route, or dependency.
4. Any proposed remediation patches.

### Response Timeline
- **Acknowledgement:** Within 24-48 hours.
- **Assessment & Triage:** Within 5 business days.
- **Fix & Public Advisory:** Coordinated release once a patch is tested and verified.

---

## Core Security Standards in Knowra

- **Server-Side Authentication & Session Integrity:** Admin and editor operations are strictly verified server-side via cryptographically signed HMAC-SHA256 session tokens with expiration tracking.
- **Cookie Security:** Session cookies are issued with `HttpOnly`, `SameSite=Lax`, and `Secure` (in production) flags, strictly preventing client-side script access and XSS theft.
- **Password Security:** All user credentials are protected using bcrypt (work factor 12) with unique salts. Passwords are never stored in plaintext.
- **Role-Based Access Control (RBAC):** Hierarchical role enforcement (`ADMIN` > `EDITOR` > `CONTRIBUTOR` > `USER`) applied at every protected API route, Server Action, and page layout.
- **SQL Injection Prevention:** All database operations utilize Prisma ORM parameterized queries; raw SQL queries are audited and parameterized.
- **SSRF & Remote Image Protection:** Next.js image optimization is restricted to explicit, trusted hostnames (`images.unsplash.com`, `upload.wikimedia.org`, `raw.githubusercontent.com`).
- **HTTP Security Headers:** Production responses include strict transport security (`HSTS`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and restrictive `Permissions-Policy`.
- **Epistemic Source Integrity:** Every published knowledge entry must bind to at least one verified primary source; arbitrary URLs are rejected without academic/institutional metadata.
