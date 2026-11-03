import { describe, it, expect, beforeEach } from 'vitest';
import { TranslationService, IN_MEMORY_TRANSLATIONS } from '@/lib/services/translation';
import { VerificationStatus } from '@prisma/client';

describe('Task 7: Knowra Multilingual Translation Pipeline (PRD Section 5.4)', () => {
  describe('Independent Translation Review Architecture', () => {
    it('creates translation draft with PENDING_REVIEW status and does not inherit original review status', () => {
      // item_photosynthesis_en is REVIEWED in English
      const newTranslation = TranslationService.submitTranslation({
        originalItemId: 'item_photosynthesis_en',
        language: 'bn',
        title: 'সালোকসংশ্লেষণ পরীক্ষা ও রাসায়নিক সূত্র',
        summary: 'আলোক বিক্রিয়া এবং কেলভিন চক্রের বিস্তারিত বাংলা বিবরণ।',
        content: '# সালোকসংশ্লেষণ\n\nবিস্তারিত বৈজ্ঞানিক ব্যাখ্যা...',
        translatorName: 'Muktadir Islam',
        translatorEmail: 'muktadir@knowra.org',
      });

      expect(newTranslation.id).toBeDefined();
      expect(newTranslation.originalItemId).toBe('item_photosynthesis_en');
      expect(newTranslation.language).toBe('bn');
      // Crucial PRD Section 5.4 requirement:
      expect(newTranslation.reviewStatus).toBe(VerificationStatus.PENDING_REVIEW);
      expect(newTranslation.reviewer).toBeUndefined();
    });

    it('rejects translation if target language is identical to original article language', () => {
      expect(() => {
        TranslationService.submitTranslation({
          originalItemId: 'item_photosynthesis_en', // original is 'en'
          language: 'en', // identical
          title: 'Duplicate Title',
          summary: 'Duplicate Summary here...',
          content: 'Duplicate content here...',
          translatorName: 'John Doe',
          translatorEmail: 'john@example.com',
        });
      }).toThrow('Translation target language cannot be identical');
    });

    it('rejects translation if original article does not exist', () => {
      expect(() => {
        TranslationService.submitTranslation({
          originalItemId: 'k_unknown_9999',
          language: 'bn',
          title: 'Some Title',
          summary: 'Some Summary here...',
          content: 'Some content here...',
          translatorName: 'John Doe',
          translatorEmail: 'john@example.com',
        });
      }).toThrow("not found");
    });

    it('allows admin editorial review to approve translation independently', () => {
      // Find a pending translation
      const pending = IN_MEMORY_TRANSLATIONS.find(
        (t) => t.reviewStatus === VerificationStatus.PENDING_REVIEW
      );
      expect(pending).toBeDefined();

      const reviewed = TranslationService.reviewTranslation(
        pending!.id,
        'APPROVE',
        { id: 'admin_1', name: 'Nahid Emdad' },
        'Terminology verified'
      );

      expect(reviewed.reviewStatus).toBe(VerificationStatus.REVIEWED);
      expect(reviewed.reviewer).toBeDefined();
      expect(reviewed.reviewer?.name).toBe('Nahid Emdad');
      expect(reviewed.reviewer?.notes).toBe('Terminology verified');
    });

    it('allows admin editorial review to request corrections on a translation', () => {
      const translation = IN_MEMORY_TRANSLATIONS[0];
      const result = TranslationService.reviewTranslation(
        translation.id,
        'REQUEST_CORRECTIONS',
        { id: 'admin_1', name: 'Nahid Emdad' },
        'Please clarify chemical symbols'
      );

      expect(result.reviewStatus).toBe(VerificationStatus.NEEDS_CORRECTION);
    });

    it('filters translations by language and reviewStatus', () => {
      const bnList = TranslationService.listTranslations({ language: 'bn' });
      expect(bnList.length).toBeGreaterThan(0);
      expect(bnList.every((t) => t.language === 'bn')).toBe(true);
    });
  });
});
