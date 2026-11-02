# Contributing to Knowra

Thank you for your interest in contributing to Knowra! As an open-source multilingual knowledge platform, community contributions are essential to making reliable knowledge universally accessible.

By contributing, you agree that your contributions will be licensed under the [Apache License, Version 2.0](./LICENSE).

---

## 1. Code of Conduct

All contributors and participants are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating.

---

## 2. Ways to Contribute

1. **Knowledge Contributions:** Submitting verified knowledge entries, validating citations, translating articles between English and Bengali.
2. **Code Contributions:** Fixing bugs, enhancing search quality, improving accessibility, building developer APIs.
3. **Documentation:** Improving developer guides, API references, architecture documentation, or translation guidelines.
4. **Issue Reporting:** Reporting bugs, edge cases, accessibility flaws, or suggesting architectural enhancements.

---

## 3. Development Workflow

### Step 1: Branching Convention
- `feat/feature-name` for new features or enhancements
- `fix/bug-description` for bug fixes
- `docs/topic-name` for documentation updates
- `test/test-description` for test additions

### Step 2: Coding Standards
- **TypeScript:** Strict type checking (`noImplicitAny: true`, strict null checks). No `any` without an explicit reason.
- **Components:** Server Components by default in Next.js App Router; use `'use client'` only when state or browser event listeners are strictly necessary.
- **Styling:** Tailwind CSS with semantic CSS variables. Follow the UI/UX rules:
  - Subtle borders (`border-border` / `border-white/10` / `border-zinc-200`).
  - No generic purple AI gradients.
  - No emoji as UI icons (use [Lucide React](https://lucide.dev/)).
  - High accessible contrast (minimum 4.5:1 ratio).
- **Prisma & Database:** Always use migrations (`prisma migrate dev`). Never bypass relations or commit raw schema edits without a migration file.

### Step 3: Testing & Verification
Before submitting a pull request, verify that:
```bash
npm run typecheck    # Zero TypeScript errors
npm run lint         # Zero ESLint warnings/errors
npm run test         # All unit tests pass
```

---

## 4. Pull Request Guidelines

1. Link your PR to an existing issue (`Fixes #123`).
2. Include a concise summary of changes and why they are necessary.
3. Provide screenshots or video recordings for UI changes.
4. Ensure PR branches are rebased on the latest `main`.

---

## 5. Security Vulnerabilities

Please do NOT report security vulnerabilities via public GitHub issues. See our [Security Policy](./SECURITY.md) for instructions on confidential disclosure.
