import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { OPENAPI_SPEC } from '@/lib/api/openapi';
import { checkRateLimit } from '@/lib/api/rate-limiter';
import { jsonSuccess, jsonError } from '@/lib/api/response';
import { GET as getApiIndex } from '@/app/api/v1/route';
import { GET as getOpenApi } from '@/app/api/v1/openapi.json/route';
import { GET as getSources } from '@/app/api/v1/sources/route';
import { GET as getKnowledgeSlug } from '@/app/api/v1/knowledge/[slug]/route';
import { GET as searchKnowledge } from '@/app/api/v1/search/route';
import { GET as listKnowledge } from '@/app/api/v1/knowledge/route';
import { GET as listCategories } from '@/app/api/v1/categories/route';

describe('Task 6: Knowra Public Developer API & OpenAPI Documentation (PRD Module B)', () => {
  describe('OpenAPI 3.1.0 Specification Compliance', () => {
    it('provides valid OpenAPI 3.1.0 metadata and Apache 2.0 license', () => {
      expect(OPENAPI_SPEC.openapi).toBe('3.1.0');
      expect(OPENAPI_SPEC.info.title).toContain('Knowra Public Knowledge API');
      expect(OPENAPI_SPEC.info.license.name).toBe('Apache 2.0');
      expect(OPENAPI_SPEC.servers[0].url).toBe('/api/v1');
    });

    it('documents all required Module B endpoints in OpenAPI paths', () => {
      const paths = Object.keys(OPENAPI_SPEC.paths);
      expect(paths).toContain('/search');
      expect(paths).toContain('/knowledge');
      expect(paths).toContain('/knowledge/{slug}');
      expect(paths).toContain('/categories');
      expect(paths).toContain('/sources');
      expect(paths).toContain('/ai/summarize');
      expect(paths).toContain('/ai/translate');
      expect(paths).toContain('/ai/simplify');
    });

    it('exposes OpenAPI JSON route returning valid 200 payload', async () => {
      const res = await getOpenApi();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.openapi).toBe('3.1.0');
    });
  });

  describe('Rate Limiter & Header Emission', () => {
    it('sets correct rate limit allowances for anonymous and keyed clients', () => {
      // Anonymous request
      const reqAnon = new NextRequest('http://localhost:3000/api/v1/search', {
        headers: {
          'x-force-test-ratelimit': 'true',
          'x-forwarded-for': '192.168.1.100',
        },
      });
      const resAnon = checkRateLimit(reqAnon);
      expect(resAnon.limit).toBe(60);
      expect(resAnon.headers['X-RateLimit-Limit']).toBe('60');

      // Keyed request
      const reqKey = new NextRequest('http://localhost:3000/api/v1/search', {
        headers: {
          'x-force-test-ratelimit': 'true',
          'x-knowra-key': 'test-prod-key-001',
        },
      });
      const resKey = checkRateLimit(reqKey);
      expect(resKey.limit).toBe(120);
      expect(resKey.headers['X-RateLimit-Limit']).toBe('120');
    });

    it('decrements remaining allowance and tracks reset window', () => {
      const uniqueIp = '10.0.0.' + Math.floor(Math.random() * 200);
      const req = new NextRequest('http://localhost:3000/api/v1/knowledge', {
        headers: {
          'x-force-test-ratelimit': 'true',
          'x-forwarded-for': uniqueIp,
        },
      });

      const first = checkRateLimit(req);
      const second = checkRateLimit(req);
      expect(second.remaining).toBe(first.remaining - 1);
    });
  });

  describe('Standardized API Envelope Helpers', () => {
    it('creates standard success envelope with metadata and timestamp', async () => {
      const res = jsonSuccess({ greeting: 'hello' }, { page: 1, total: 1 });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data.greeting).toBe('hello');
      expect(data.meta.version).toBe('1.0.0');
      expect(data.meta.timestamp).toBeDefined();
    });

    it('creates standard error envelope with code and details', async () => {
      const res = jsonError('NOT_FOUND', 'Item missing', 404, { id: '123' });
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
      expect(data.error.details.id).toBe('123');
    });
  });

  describe('Public API Endpoints Execution', () => {
    it('GET /api/v1 returns API root index with documentation and endpoints', async () => {
      const res = await getApiIndex();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.name).toContain('Knowra Public Knowledge API');
      expect(json.data.endpoints.search).toBeDefined();
      expect(json.data.documentationUrl).toBe('/docs');
    });

    it('GET /api/v1/sources returns verified primary sources with metadata', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/sources');
      const res = await getSources(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0].publisher).toBeDefined();
      expect(json.data[0].sourceType).toBeDefined();
    });

    it('GET /api/v1/knowledge/[slug] returns complete article details', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/knowledge/photosynthesis-process');
      const res = await getKnowledgeSlug(req, {
        params: Promise.resolve({ slug: 'photosynthesis-process' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.title).toContain('Photosynthesis');
      expect(json.data.sources).toHaveLength(1);
      expect(json.data.status).toBe('REVIEWED');
    });

    it('GET /api/v1/knowledge/[slug] returns 404 for unknown article', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/knowledge/nonexistent-item');
      const res = await getKnowledgeSlug(req, {
        params: Promise.resolve({ slug: 'nonexistent-item' }),
      });
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('NOT_FOUND');
    });

    it('GET /api/v1/search supports multilingual querying and pagination meta', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/search?q=photosynthesis&limit=2');
      const res = await searchKnowledge(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.meta.query).toBe('photosynthesis');
      expect(json.meta.limit).toBe(2);
      expect(json.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/knowledge lists published articles with tag or category filtering', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/knowledge?category=science');
      const res = await listKnowledge(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.meta.total).toBeDefined();
    });

    it('GET /api/v1/categories returns structured taxonomy list', async () => {
      const req = new NextRequest('http://localhost:3000/api/v1/categories');
      const res = await listCategories(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(12);
    });
  });
});
