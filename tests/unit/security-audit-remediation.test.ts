import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import {
  signSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth/session';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { authenticateUser } from '@/lib/auth/users';
import { requireRole } from '@/lib/auth';
import { Role } from '@prisma/client';
import { POST as loginRoute } from '@/app/api/v1/auth/login/route';
import { POST as logoutRoute } from '@/app/api/v1/auth/logout/route';
import { GET as adminOverviewRoute } from '@/app/api/v1/admin/overview/route';
import { POST as reviewSubmissionRoute } from '@/app/api/v1/admin/submissions/[id]/review/route';
import { PUT as reviewTranslationRoute } from '@/app/api/v1/admin/translations/[id]/review/route';
import { POST as publicSubmissionRoute } from '@/app/api/v1/submissions/route';
import { SearchService } from '@/lib/services/search';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';

describe('K-AUDIT-001: Security Remediation & Regression Verification', () => {
  // Scenario A
  describe('Scenario A: Unauthenticated user cannot access admin functionality', () => {
    it('redirects unauthenticated request from /admin to /admin/login', () => {
      const req = new NextRequest('http://localhost:3000/admin/knowledge');
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/admin/login');
    });

    it('rejects unauthenticated GET /api/v1/admin/overview with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/admin/overview');
      const res = await adminOverviewRoute(req);

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('UNAUTHORIZED');
    });

    it('rejects unauthenticated review submission with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/admin/submissions/sub_1/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'APPROVED' }),
      });
      const res = await reviewSubmissionRoute(req, {
        params: Promise.resolve({ id: 'sub_1' }),
      });

      expect(res.status).toBe(401);
    });

    it('rejects unauthenticated review translation with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/admin/translations/tr_1/review', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      });
      const res = await reviewTranslationRoute(req, {
        params: Promise.resolve({ id: 'tr_1' }),
      });

      expect(res.status).toBe(401);
    });
  });

  // Scenario B
  describe('Scenario B: Forged or legacy static cookie cannot grant admin access', () => {
    it('rejects old legacy plain-string "admin_session" cookie in middleware', () => {
      const req = new NextRequest('http://localhost:3000/admin', {
        headers: {
          cookie: `${SESSION_COOKIE_NAME}=admin_session`,
        },
      });
      const res = middleware(req);

      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/admin/login');
    });

    it('rejects tampered cryptographic token where payload was modified', () => {
      const validToken = signSessionToken({
        id: 'usr_editor',
        email: 'editor@knowra.org',
        name: 'Editor',
        role: Role.EDITOR,
      });

      const [payload, signature] = validToken.split('.');
      // Tamper with payload
      const tamperedPayload = Buffer.from(
        JSON.stringify({
          userId: 'usr_editor',
          email: 'editor@knowra.org',
          name: 'Editor',
          role: Role.ADMIN, // Attempt privilege escalation
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      ).toString('base64url');

      const forgedToken = `${tamperedPayload}.${signature}`;
      const verified = verifySessionToken(forgedToken);

      expect(verified).toBeNull();
    });

    it('rejects arbitrary random strings as tokens', () => {
      expect(verifySessionToken('random-malicious-cookie-value')).toBeNull();
      expect(verifySessionToken('')).toBeNull();
      expect(verifySessionToken('a.b.c.d')).toBeNull();
    });
  });

  // Scenario C
  describe('Scenario C: Password hashing and rejection of incorrect passwords', () => {
    it('hashes passwords using bcrypt with non-empty salt and correct format', async () => {
      const hash = await hashPassword('SecurePassphrase2026!');
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/); // Standard bcrypt format
    });

    it('verifies correct password and rejects incorrect password', async () => {
      const password = 'CorrectSecret2026!';
      const hash = await hashPassword(password);

      expect(await verifyPassword(password, hash)).toBe(true);
      expect(await verifyPassword('WrongSecret2026!', hash)).toBe(false);
      expect(await verifyPassword('', hash)).toBe(false);
    });

    it('rejects login API request with incorrect password with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@knowra.org',
          password: 'IncorrectPasswordAttempt',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  // Scenario D & E
  describe('Scenario D & E: Role-Based Authorization Enforcement (RBAC)', () => {
    it('denies a regular USER from performing ADMIN or EDITOR operations', () => {
      const userToken = signSessionToken({
        id: 'usr_regular_001',
        email: 'user@knowra.org',
        name: 'Regular User',
        role: Role.USER,
      });

      const req = new NextRequest('http://localhost:3000/api/v1/admin/overview', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const authCheck = requireRole(req, Role.EDITOR);
      expect('errorResponse' in authCheck).toBe(true);
      if ('errorResponse' in authCheck) {
        expect(authCheck.errorResponse.status).toBe(403);
      }
    });

    it('denies an EDITOR from performing ADMIN-only operations', () => {
      const editorToken = signSessionToken({
        id: 'usr_editor_001',
        email: 'editor@knowra.org',
        name: 'Editor',
        role: Role.EDITOR,
      });

      const req = new NextRequest('http://localhost:3000/api/v1/admin/system', {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      });

      const authCheck = requireRole(req, Role.ADMIN);
      expect('errorResponse' in authCheck).toBe(true);
      if ('errorResponse' in authCheck) {
        expect(authCheck.errorResponse.status).toBe(403);
      }
    });

    it('allows an EDITOR to perform EDITOR operations', () => {
      const editorToken = signSessionToken({
        id: 'usr_editor_001',
        email: 'editor@knowra.org',
        name: 'Editor',
        role: Role.EDITOR,
      });

      const req = new NextRequest('http://localhost:3000/api/v1/admin/submissions', {
        headers: {
          Authorization: `Bearer ${editorToken}`,
        },
      });

      const authCheck = requireRole(req, Role.EDITOR);
      expect('session' in authCheck).toBe(true);
      if ('session' in authCheck) {
        expect(authCheck.session.role).toBe(Role.EDITOR);
      }
    });

    it('allows an ADMIN to perform EDITOR and ADMIN operations', () => {
      const adminToken = signSessionToken({
        id: 'usr_admin_001',
        email: 'admin@knowra.org',
        name: 'Admin',
        role: Role.ADMIN,
      });

      const req = new NextRequest('http://localhost:3000/api/v1/admin/overview', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const authCheck = requireRole(req, Role.EDITOR);
      expect('session' in authCheck).toBe(true);
      if ('session' in authCheck) {
        expect(authCheck.session.role).toBe(Role.ADMIN);
      }
    });
  });

  // Scenario F
  describe('Scenario F: Privileged API operations reject unauthenticated requests', () => {
    it('verifies that requireRole returns 401 when no token is supplied', () => {
      const req = new NextRequest('http://localhost:3000/api/v1/admin/overview');
      const auth = requireRole(req, Role.EDITOR);

      expect('errorResponse' in auth).toBe(true);
      if ('errorResponse' in auth) {
        expect(auth.errorResponse.status).toBe(401);
      }
    });
  });

  // Scenario G
  describe('Scenario G: Public submissions cannot create privileged accounts', () => {
    it('processes public submission as community proposal without creating users or roles', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Gravitational Wave Detection and Interferometry',
          content: 'Detailed physics explanation of LIGO and Virgo gravitational strain detection in interferometers.',
          language: 'en',
          proposedSources: 'https://www.ligo.caltech.edu/page/what-is-ligo',
          contributorName: 'Dr. Jane Public',
          contributorEmail: 'jane.public@university.edu',
        }),
      });

      const res = await publicSubmissionRoute(req);
      expect(res.status).toBe(201);
      const json = await res.json();

      expect(json.success).toBe(true);
      expect(json.data.status).toBe('PENDING');
      // Submission has no role or account privilege
      expect(json.data.role).toBeUndefined();
    });
  });

  // Scenario H
  describe('Scenario H: Session expiration and invalidation', () => {
    it('rejects an expired session token', () => {
      const expiredToken = signSessionToken(
        {
          id: 'usr_admin',
          email: 'admin@knowra.org',
          name: 'Admin',
          role: Role.ADMIN,
        },
        -3600 // Expired 1 hour ago
      );

      const verified = verifySessionToken(expiredToken);
      expect(verified).toBeNull();
    });

    it('invalidates session cookie upon logout', async () => {
      const res = await logoutRoute();
      expect(res.status).toBe(200);

      // Verify Set-Cookie header clears the cookie
      const cookieHeader = res.headers.get('set-cookie');
      expect(cookieHeader).toBeDefined();
      expect(cookieHeader).toContain(`${SESSION_COOKIE_NAME}=`);
      expect(cookieHeader).toContain('Max-Age=0');
      expect(cookieHeader).toContain('HttpOnly');
    });
  });

  // Scenario I
  describe('Scenario I: Core knowledge browsing and search work without AI credentials', () => {
    it('executes in-memory knowledge search without external AI network dependencies', () => {
      const corpus = INITIAL_KNOWLEDGE_ITEMS.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        content: item.content,
        language: item.language,
        category: item.category,
        sourceCount: item.sources.length,
        updatedAt: item.updatedAt,
      }));

      const results = SearchService.searchInMemory(corpus, 'photosynthesis', 'en');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toContain('Photosynthesis');
    });
  });

  // Scenario J
  describe('Scenario J: Legitimate login with correct credentials succeeds', () => {
    it('authenticates admin@knowra.org with AdminSecret2026!, sets HttpOnly cookie and returns user profile', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@knowra.org',
          password: 'AdminSecret2026!',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.user.email).toBe('admin@knowra.org');
      expect(json.data.user.role).toBe(Role.ADMIN);
      expect(json.data.user.passwordHash).toBeUndefined(); // Never leak password hash

      const cookieHeader = res.headers.get('set-cookie');
      expect(cookieHeader).toBeDefined();
      expect(cookieHeader).toContain(SESSION_COOKIE_NAME);
      expect(cookieHeader).toContain('HttpOnly');
      expect(cookieHeader).toContain('SameSite=lax');
    });

    it('authenticates editor@knowra.org with EditorSecret2026!, sets HttpOnly cookie and returns EDITOR role', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'editor@knowra.org',
          password: 'EditorSecret2026!',
        }),
      });

      const res = await loginRoute(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.user.email).toBe('editor@knowra.org');
      expect(json.data.user.role).toBe(Role.EDITOR);
    });
  });
});
