import { describe, it, expect } from 'vitest';
import { INITIAL_KNOWLEDGE_ITEMS, INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { submissionCreateSchema } from '@/lib/validations';
import { VerificationStatus } from '@prisma/client';

describe('TASK-003: Web Platform & API Integrity Verification', () => {
  describe('Knowledge Base Sourcing Integrity (PRD 5.3)', () => {
    it('ensures every reviewed knowledge item has at least one verified primary source', () => {
      INITIAL_KNOWLEDGE_ITEMS.forEach((item) => {
        if (item.status === VerificationStatus.REVIEWED) {
          expect(item.sources.length).toBeGreaterThanOrEqual(1);
          item.sources.forEach(({ source }) => {
            expect(source.url).toMatch(/^https?:\/\//);
            expect(source.title).toBeDefined();
            expect(source.sourceType).toBeDefined();
          });
        }
      });
    });

    it('ensures all knowledge slugs are unique and clean', () => {
      const slugs = INITIAL_KNOWLEDGE_ITEMS.map((item) => item.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('verifies translation links are symmetrical or valid', () => {
      INITIAL_KNOWLEDGE_ITEMS.forEach((item) => {
        item.translations.forEach((t) => {
          const target = INITIAL_KNOWLEDGE_ITEMS.find((k) => k.id === t.id || k.slug === t.slug);
          expect(target).toBeDefined();
          expect(target?.language).toBe(t.language);
        });
      });
    });
  });

  describe('Core Categories Verification (PRD 4.4)', () => {
    it('contains all 12 initial categories defined in PRD Section 4.4', () => {
      const expectedSlugs = [
        'science',
        'technology',
        'education',
        'history',
        'geography',
        'health-education',
        'environment',
        'mathematics',
        'language',
        'culture',
        'economics',
        'general-knowledge',
      ];

      const actualSlugs = INITIAL_CATEGORIES.map((c) => c.slug);
      expectedSlugs.forEach((slug) => {
        expect(actualSlugs).toContain(slug);
      });
    });
  });

  describe('Submission Validation Envelope', () => {
    it('accepts valid community contribution', () => {
      const result = submissionCreateSchema.safeParse({
        title: 'Gravitational Waves Discovery',
        content: 'Gravitational waves are ripples in the fabric of spacetime caused by massive cosmic acceleration.',
        language: 'en',
        proposedSources: 'https://www.ligo.caltech.edu/news/ligo20160211',
        contributorName: 'Raiyan Chowdhury',
        contributorEmail: 'raiyan@example.edu',
      });
      expect(result.success).toBe(true);
    });

    it('rejects contribution without sources', () => {
      const result = submissionCreateSchema.safeParse({
        title: 'Gravitational Waves Discovery',
        content: 'Gravitational waves are ripples in spacetime...',
        language: 'en',
        proposedSources: '',
        contributorName: 'Anonymous',
      });
      expect(result.success).toBe(false);
    });
  });
});
