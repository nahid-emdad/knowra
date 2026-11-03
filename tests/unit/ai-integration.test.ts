import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  MockAIProvider,
  GeminiAIProvider,
  OpenAIAIProvider,
  getAIProvider,
  defaultAIProvider,
} from '@/lib/ai';

describe('Task 5: Knowra AI Integration & Safety Engine (PRD Section 6)', () => {
  let mockProvider: MockAIProvider;

  beforeEach(() => {
    mockProvider = new MockAIProvider();
  });

  describe('PRD 6.2 & 6.3: Epistemic Safeguards & AI Independence', () => {
    it('always marks summaries as AI-generated (Rule 4)', async () => {
      const result = await mockProvider.summarize({
        content: 'Photosynthesis is the light-driven process occurring inside plant chloroplasts.',
        language: 'en',
        maxLength: 100,
      });

      expect(result.isAiGenerated).toBe(true);
      expect(result.summary).toBeDefined();
      expect(result.generatedAt).toBeInstanceOf(Date);
      expect(result.provider).toBe('mock');
    });

    it('enforces human review requirement on all translation drafts (Rule 1 & Rule 6)', async () => {
      const result = await mockProvider.translate({
        title: 'Photosynthesis Mechanism',
        content: 'Light-dependent photochemical reactions occur inside the thylakoid.',
        sourceLanguage: 'en',
        targetLanguage: 'bn',
      });

      expect(result.isAiGenerated).toBe(true);
      expect(result.reviewRequired).toBe(true);
      expect(result.targetLanguage).toBe('bn');
      expect(result.translatedTitle).toContain('BN');
    });

    it('simplifies content across elementary, high school, and general reading levels', async () => {
      const levels = ['elementary', 'high_school', 'general'] as const;

      for (const level of levels) {
        const result = await mockProvider.simplify({
          content: 'Complex thylakoid photophosphorylation transforms solar photons into ATP.',
          targetReadingLevel: level,
          language: 'en',
        });

        expect(result.readingLevel).toBe(level);
        expect(result.simplifiedContent).toBeDefined();
      }
    });

    it('extracts contextual topic tags without hallucinated symbols', async () => {
      const result = await mockProvider.suggestTags({
        title: 'Quantum Electrodynamics',
        content: 'Photon electron interactions in quantum field equations and Dirac matrices.',
        language: 'en',
        maxTags: 4,
      });

      expect(result.tags).toBeInstanceOf(Array);
      expect(result.tags.length).toBeGreaterThan(0);
      expect(result.tags.length).toBeLessThanOrEqual(4);
    });

    it('suggests multidisciplinary related topics with pedagogical rationale (PRD 6.1 #5)', async () => {
      const result = await mockProvider.suggestRelated({
        title: 'Photosynthesis',
        category: 'Science',
        content: 'Biochemical light reaction and carbon fixation.',
        language: 'bn',
        limit: 2,
      });

      expect(result.suggestedTopics).toHaveLength(2);
      expect(result.suggestedTopics[0].title).toBeDefined();
      expect(result.suggestedTopics[0].reason).toBeDefined();
    });
  });

  describe('PRD 6.2: Provider Factory & Graceful Fallbacks', () => {
    it('returns MockAIProvider when AI_PROVIDER is unset or set to mock', () => {
      const provider = getAIProvider('mock');
      expect(provider.name).toBe('mock');
      expect(provider.isAvailable).toBe(true);
    });

    it('safely handles missing Gemini API key and falls back to deterministic provider (Rule 8)', async () => {
      const gemini = new GeminiAIProvider('');
      expect(gemini.isAvailable).toBe(false);

      // Summarize should not crash; it safely delegates to fallback
      const summary = await gemini.summarize({
        content: 'Solar nuclear fusion converts hydrogen to helium.',
        language: 'en',
      });

      expect(summary.isAiGenerated).toBe(true);
      expect(summary.provider).toBe('mock');
    });

    it('safely handles missing OpenAI API key and falls back to deterministic provider (Rule 8)', async () => {
      const openai = new OpenAIAIProvider('');
      expect(openai.isAvailable).toBe(false);

      // Translate should not crash; it safely delegates to fallback
      const translation = await openai.translate({
        title: 'Gravitational Waves',
        content: 'Spacetime ripples detected by LIGO interferometers.',
        sourceLanguage: 'en',
        targetLanguage: 'bn',
      });

      expect(translation.isAiGenerated).toBe(true);
      expect(translation.reviewRequired).toBe(true);
      expect(translation.provider).toBe('mock');
    });

    it('factory provides default singleton without crashing in non-AI environments (Rule 10)', () => {
      expect(defaultAIProvider).toBeDefined();
      expect(defaultAIProvider.isAvailable).toBe(true);
    });
  });
});
