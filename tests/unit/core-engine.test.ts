import { describe, it, expect } from 'vitest';
import {
  slugify,
  knowledgeItemCreateSchema,
  sourceCreateSchema,
  translationCreateSchema,
  submissionCreateSchema,
} from '@/lib/validations';
import { SourceService } from '@/lib/services/source';
import { SearchService } from '@/lib/services/search';
import { VerificationStatus, SourceType } from '@prisma/client';

describe('TASK-002: Core Knowledge Engine Verification', () => {
  describe('Slugify Utility (English & Unicode Bengali)', () => {
    it('generates URL-friendly slugs for English titles', () => {
      expect(slugify('Photosynthesis and Terrestrial Life')).toBe('photosynthesis-and-terrestrial-life');
      expect(slugify('  Quantum   Computing:   101!  ')).toBe('quantum-computing-101');
    });

    it('preserves Bengali Unicode script in slugs', () => {
      expect(slugify('সালোকসংশ্লেষণ ও উদ্ভিদের পুষ্টি')).toBe('সালোকসংশ্লেষণ-ও-উদ্ভিদের-পুষ্টি');
      expect(slugify('আমাদের সৌরজগৎ: একটি পরিচিতি')).toBe('আমাদের-সৌরজগৎ-একটি-পরিচিতি');
    });

    it('collapses multiple hyphens and trims boundary hyphens', () => {
      expect(slugify('---hello---world---')).toBe('hello-world');
      expect(slugify('Space --- Exploration --- 2026')).toBe('space-exploration-2026');
    });
  });

  describe('Source Validation & Strict Citation Rules (PRD 5.3)', () => {
    it('validates safe and legitimate source URLs', () => {
      expect(SourceService.validateUrl('https://science.nasa.gov')).toBe(true);
      expect(SourceService.validateUrl('http://academic.example.edu/paper/42')).toBe(true);
      expect(SourceService.validateUrl('doi:10.1038/nature08431')).toBe(true);
    });

    it('rejects unsafe or malformed URLs', () => {
      expect(SourceService.validateUrl('javascript:alert(1)')).toBe(false);
      expect(SourceService.validateUrl('not-a-valid-url')).toBe(false);
      expect(SourceService.validateUrl('')).toBe(false);
    });

    it('validates valid source schema creation input', () => {
      const valid = sourceCreateSchema.safeParse({
        url: 'https://nature.com/articles/sample-paper',
        title: 'Photosynthetic Reaction Centers',
        publisher: 'Nature Publishing Group',
        sourceType: SourceType.RESEARCH_PAPER,
        language: 'en',
      });
      expect(valid.success).toBe(true);
    });

    it('rejects source with invalid URL', () => {
      const invalid = sourceCreateSchema.safeParse({
        url: 'invalid-url',
        title: 'Photosynthetic Reaction Centers',
        sourceType: SourceType.RESEARCH_PAPER,
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('Knowledge Item Validation & Sourcing Enforcement (PRD 5.3)', () => {
    it('allows creating DRAFT knowledge items without sources', () => {
      const draft = knowledgeItemCreateSchema.safeParse({
        title: 'Draft Article on Thermodynamics',
        summary: 'A short preliminary summary of laws of thermodynamics.',
        content: 'Thermodynamics is the branch of physics that deals with heat and work.',
        language: 'en',
        categoryId: 'cat_physics',
        authorId: 'usr_admin',
        status: VerificationStatus.DRAFT,
        sources: [],
      });
      expect(draft.success).toBe(true);
    });

    it('STRICT RULE: Rejects REVIEWED knowledge item if sources array is empty', () => {
      const reviewedWithoutSource = knowledgeItemCreateSchema.safeParse({
        title: 'Reviewed Article on Thermodynamics',
        summary: 'A complete verified summary of laws of thermodynamics.',
        content: 'Thermodynamics is the branch of physics that deals with heat, work, and temperature.',
        language: 'en',
        categoryId: 'cat_physics',
        authorId: 'usr_admin',
        status: VerificationStatus.REVIEWED,
        sources: [], // Empty sources for reviewed item!
      });

      expect(reviewedWithoutSource.success).toBe(false);
      if (!reviewedWithoutSource.success) {
        const sourceIssue = reviewedWithoutSource.error.issues.find((i) => i.path.includes('sources'));
        expect(sourceIssue).toBeDefined();
        expect(sourceIssue?.message).toContain('must contain at least one usable source reference');
      }
    });

    it('accepts REVIEWED knowledge item when at least one source is present', () => {
      const reviewedWithSource = knowledgeItemCreateSchema.safeParse({
        title: 'Reviewed Article on Thermodynamics',
        summary: 'A complete verified summary of laws of thermodynamics.',
        content: 'Thermodynamics is the branch of physics that deals with heat, work, and temperature.',
        language: 'en',
        categoryId: 'cat_physics',
        authorId: 'usr_admin',
        status: VerificationStatus.REVIEWED,
        sources: [{ sourceId: 'src_nasa_123', supportingNote: 'Primary reference' }],
      });
      expect(reviewedWithSource.success).toBe(true);
    });
  });

  describe('Translation System & Independent Review Status (PRD 5.4)', () => {
    it('strictly defaults translated item reviewStatus to DRAFT', () => {
      const parsed = translationCreateSchema.safeParse({
        knowledgeItemId: 'item_bn_1',
        originalItemId: 'item_en_1',
        language: 'bn',
        title: 'সালোকসংশ্লেষণ',
        summary: 'সালোকসংশ্লেষণ হলো উদ্ভিদের খাদ্য তৈরির জৈবরাসায়নিক প্রক্রিয়া।',
        content: 'সালোকসংশ্লেষণের বিস্তারিত বিবরণ ও বৈজ্ঞানিক বিক্রিয়া...',
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.reviewStatus).toBe(VerificationStatus.DRAFT);
      }
    });
  });

  describe('Community Submissions Validation (PRD Module C)', () => {
    it('validates community submission with proposed sources', () => {
      const submission = submissionCreateSchema.safeParse({
        title: 'Introduction to Black Holes',
        content: 'Black holes are regions of spacetime where gravity is so strong that nothing can escape.',
        language: 'en',
        proposedSources: 'https://science.nasa.gov/astrophysics/focus-areas/black-holes/',
        contributorName: 'Stephen Hawking',
        contributorEmail: 'stephen@example.edu',
      });
      expect(submission.success).toBe(true);
    });

    it('rejects submission with missing proposed sources', () => {
      const invalid = submissionCreateSchema.safeParse({
        title: 'Introduction to Black Holes',
        content: 'Black holes are regions of spacetime where gravity is so strong that nothing can escape.',
        language: 'en',
        proposedSources: '', // Missing source
        contributorName: 'Anonymous',
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('Search Engine In-Memory Matching & Relevance Ranking (PRD Section 9)', () => {
    const mockCorpus = [
      {
        id: '1',
        slug: 'photosynthesis-process',
        title: 'Photosynthesis: Biological Engine',
        summary: 'Process by which green plants produce glucose.',
        content: 'Chloroplasts absorb photons to photolyse water and fix carbon dioxide.',
        language: 'en',
        category: { name: 'Science', slug: 'science' },
        sourceCount: 2,
        updatedAt: new Date('2026-10-01'),
      },
      {
        id: '2',
        slug: 'solar-energy-technologies',
        title: 'Solar Energy Technologies',
        summary: 'Harnessing solar radiation through photovoltaic cells.',
        content: 'Solar panels convert photons into electric current.',
        language: 'en',
        category: { name: 'Technology', slug: 'technology' },
        sourceCount: 1,
        updatedAt: new Date('2026-10-05'),
      },
      {
        id: '3',
        slug: 'saloksongshleshan-prokriya',
        title: 'সালোকসংশ্লেষণ: উদ্ভিদের খাদ্য উৎপাদন',
        summary: 'সবুজ উদ্ভিদ সূর্যালোকের সাহায্যে শর্করা তৈরি করে।',
        content: 'ক্লোরোপ্লাস্টে সংঘটিত আলোক ও অন্ধকার দশার মাধ্যমে এই জৈবরাসায়নিক বিক্রিয়া সম্পন্ন হয়।',
        language: 'bn',
        category: { name: 'Science', slug: 'science' },
        sourceCount: 1,
        updatedAt: new Date('2026-10-10'),
      },
      {
        id: '4',
        slug: 'shourojogot-porichiti',
        title: 'সৌরজগতের গঠন ও গ্রহসমূহ',
        summary: 'সূর্য ও একে কেন্দ্র করে আবর্তিত আটটি গ্রহের পরিচিতি।',
        content: 'বুধ, শুক্র, পৃথিবী, মঙ্গল, বৃহস্পতি, শনি, ইউরেনাস ও নেপচুন সৌরজগতের প্রধান গ্রহ।',
        language: 'bn',
        category: { name: 'Science', slug: 'science' },
        sourceCount: 1,
        updatedAt: new Date('2026-10-12'),
      },
    ];

    it('matches exact and prefix titles with highest relevance score in English', () => {
      const results = SearchService.searchInMemory(mockCorpus, 'Photosynthesis', 'en');
      expect(results.length).toBe(1);
      expect(results[0].slug).toBe('photosynthesis-process');
      expect(results[0].relevanceScore).toBeGreaterThanOrEqual(60);
    });

    it('matches Bengali queries accurately against Bengali corpus', () => {
      const results = SearchService.searchInMemory(mockCorpus, 'সালোকসংশ্লেষণ', 'bn');
      expect(results.length).toBe(1);
      expect(results[0].slug).toBe('saloksongshleshan-prokriya');
      expect(results[0].title).toContain('সালোকসংশ্লেষণ');
      expect(results[0].language).toBe('bn');
    });

    it('matches content terms across articles', () => {
      const results = SearchService.searchInMemory(mockCorpus, 'photons');
      expect(results.length).toBe(2); // In both Photosynthesis and Solar Energy Technologies
    });

    it('filters strictly by language parameter', () => {
      const englishResults = SearchService.searchInMemory(mockCorpus, 'solar', 'en');
      expect(englishResults.length).toBe(1);
      expect(englishResults[0].language).toBe('en');

      const bengaliResults = SearchService.searchInMemory(mockCorpus, 'গ্রহ', 'bn');
      expect(bengaliResults.length).toBe(1);
      expect(bengaliResults[0].slug).toBe('shourojogot-porichiti');
    });
  });
});
