import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { GET as getHealth } from '@/app/api/health/route';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import { VerificationStatus, Role } from '@prisma/client';
import { SearchService } from '@/lib/services/search';
import { signSessionToken } from '@/lib/auth/session';

describe('Task 8: Production Hardening, Security & Final Verification (PRD 11, 12, 13)', () => {
  describe('Server-Side Admin Route Protection (PRD Section 4.5)', () => {
    it('redirects unauthenticated users attempting to access /admin to /admin/login', () => {
      const req = new NextRequest('http://localhost:3000/admin/knowledge');
      const response = middleware(req);

      expect(response.status).toBe(307); // Next.js redirect
      expect(response.headers.get('location')).toContain('/admin/login');
      expect(response.headers.get('location')).toContain('redirect=%2Fadmin%2Fknowledge');
    });

    it('allows unauthenticated users to access /admin/login freely', () => {
      const req = new NextRequest('http://localhost:3000/admin/login');
      const response = middleware(req);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('allows authenticated users possessing valid signed knowra_session cookie to access /admin', () => {
      const validToken = signSessionToken({
        id: 'usr_admin',
        name: 'Admin',
        email: 'admin@knowra.org',
        role: Role.ADMIN,
      });

      const req = new NextRequest('http://localhost:3000/admin/submissions', {
        headers: {
          cookie: `knowra_session=${validToken}`,
        },
      });
      const response = middleware(req);

      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();
    });

    it('handles CORS preflight OPTIONS requests for API routes with status 204', () => {
      const req = new NextRequest('http://localhost:3000/api/v1/search', {
        method: 'OPTIONS',
      });
      const response = middleware(req);

      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });

  describe('Health Check & Observability (PRD Section 11)', () => {
    it('returns healthy status, uptime, version, and corpus counts', async () => {
      const res = await getHealth();
      expect(res.status).toBe(200);
      const json = await res.json();

      expect(json.status).toBe('healthy');
      expect(json.version).toBe('1.0.0');
      expect(json.service).toBe('knowra-knowledge-platform');
      expect(json.system.corpus.knowledgeArticles).toBeGreaterThan(0);
      expect(json.system.corpus.categories).toBe(12);
    });
  });

  describe('Epistemic Truth Verification (PRD Section 5.3)', () => {
    it('guarantees that 100% of reviewed published articles contain at least one verifiable primary source', () => {
      const reviewedArticles = INITIAL_KNOWLEDGE_ITEMS.filter(
        (a) => a.status === VerificationStatus.REVIEWED
      );

      expect(reviewedArticles.length).toBeGreaterThan(0);

      for (const article of reviewedArticles) {
        expect(article.sources).toBeDefined();
        expect(article.sources.length).toBeGreaterThanOrEqual(1);

        for (const s of article.sources) {
          expect(s.source.url).toMatch(/^https?:\/\//);
          expect(s.source.publisher.length).toBeGreaterThan(0);
          expect(s.source.sourceType).toBeDefined();
        }
      }
    });
  });

  describe('Decoupled Non-AI Independence (PRD Section 6.3 #10)', () => {
    it('operates core search and knowledge discovery without external AI keys or network', () => {
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

      // Search works without AI
      const results = SearchService.searchInMemory(corpus, 'solar', 'en');
      expect(results.length).toBeGreaterThan(0);

      // Bengali search works without AI
      const bnResults = SearchService.searchInMemory(corpus, 'সালোকসংশ্লেষণ', 'bn');
      expect(bnResults.length).toBeGreaterThan(0);
    });
  });
});
