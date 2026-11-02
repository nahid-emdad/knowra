import { describe, it, expect } from 'vitest';
import { defaultAIProvider } from '@/lib/ai/mock';
import { isBengaliQuery } from '@/lib/search/types';

describe('TASK-001 Foundation Verification', () => {
  describe('AIProvider Abstraction & Fallback', () => {
    it('initializes default MockAIProvider without external API keys', () => {
      expect(defaultAIProvider.name).toBe('mock');
      expect(defaultAIProvider.isAvailable).toBe(true);
    });

    it('summarizes content deterministically and marks output as isAiGenerated', async () => {
      const sampleContent =
        'Knowra is an open-source knowledge platform designed to make reliable information accessible across languages.';
      const result = await defaultAIProvider.summarize({
        content: sampleContent,
        language: 'en',
        maxLength: 50,
      });

      expect(result.summary).toBeDefined();
      expect(result.isAiGenerated).toBe(true);
      expect(result.provider).toBe('mock');
      expect(result.generatedAt).toBeInstanceOf(Date);
    });

    it('translates content safely flagging reviewRequired=true', async () => {
      const result = await defaultAIProvider.translate({
        title: 'Photosynthesis',
        content: 'Photosynthesis is a process used by plants.',
        sourceLanguage: 'en',
        targetLanguage: 'bn',
      });

      expect(result.translatedTitle).toContain('[BN]');
      expect(result.reviewRequired).toBe(true);
      expect(result.isAiGenerated).toBe(true);
    });

    it('extracts unique suggested tags from content', async () => {
      const result = await defaultAIProvider.suggestTags({
        title: 'Quantum Computing and Physics',
        content: 'Quantum physics explores computing particles and quantum mechanics in physics.',
        language: 'en',
        maxTags: 3,
      });

      expect(result.tags.length).toBeLessThanOrEqual(3);
      expect(result.provider).toBe('mock');
    });
  });

  describe('Language Detection & Search Strategy Router', () => {
    it('detects Bengali script in search queries', () => {
      expect(isBengaliQuery('সালোকসংশ্লেষণ')).toBe(true);
      expect(isBengaliQuery('বাংলা ভাষা')).toBe(true);
      expect(isBengaliQuery('বিজ্ঞান ও প্রযুক্তি')).toBe(true);
    });

    it('identifies Latin/English script queries as non-Bengali', () => {
      expect(isBengaliQuery('photosynthesis')).toBe(false);
      expect(isBengaliQuery('quantum computing')).toBe(false);
      expect(isBengaliQuery('12345')).toBe(false);
    });

    it('detects mixed script queries containing Bengali characters', () => {
      expect(isBengaliQuery('Knowra জ্ঞান')).toBe(true);
      expect(isBengaliQuery('Science বিজ্ঞান')).toBe(true);
    });
  });
});
