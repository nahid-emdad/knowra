import { VerificationStatus } from '@prisma/client';
import { INITIAL_KNOWLEDGE_ITEMS, StaticKnowledgeItem } from '@/lib/data/initial-data';

export interface TranslationRecord {
  id: string;
  originalItemId: string;
  originalTitle: string;
  originalLanguage: string;
  originalContent: string;
  translatedItemId?: string;
  language: 'en' | 'bn';
  title: string;
  summary: string;
  content: string;
  reviewStatus: VerificationStatus;
  translator: {
    id: string;
    name: string;
    email: string;
  };
  reviewer?: {
    id: string;
    name: string;
    reviewedAt: Date;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// In-memory persistent translation store (initialized with seed translations)
export const IN_MEMORY_TRANSLATIONS: TranslationRecord[] = [
  {
    id: 'tr_photo_bn',
    originalItemId: 'item_photosynthesis_en',
    originalTitle: 'Photosynthesis: The Biological Engine of Life',
    originalLanguage: 'en',
    originalContent:
      'Photosynthesis is a photochemical process occurring in the chloroplasts of green plants and cyanobacteria...',
    translatedItemId: 'item_photosynthesis_bn',
    language: 'bn',
    title: 'সালোকসংশ্লেষণ: পৃথিবীর জৈবরাসায়নিক চালিকাশক্তি',
    summary:
      'সালোকসংশ্লেষণ হলো এমন একটি জটিল জৈবরাসায়নিক প্রক্রিয়া যার মাধ্যমে সবুজ উদ্ভিদ ও সায়ানোব্যাকটেরিয়া আলোক শক্তিকে রাসায়নিক শক্তিতে রূপান্তর করে।',
    content:
      '# সালোকসংশ্লেষণ প্রক্রিয়া\n\nসালোকসংশ্লেষণ হলো এমন একটি জটিল জৈবরাসায়নিক প্রক্রিয়া...',
    reviewStatus: VerificationStatus.REVIEWED,
    translator: {
      id: 'usr_edu_01',
      name: 'Dr. Tanvir Rahman',
      email: 'tanvir@knowra.org',
    },
    reviewer: {
      id: 'usr_admin_01',
      name: 'Nahid Emdad',
      reviewedAt: new Date('2026-03-01T12:00:00Z'),
      notes: 'Accurate Bengali biochemical terminology and verified citations.',
    },
    createdAt: new Date('2026-02-15T09:00:00Z'),
    updatedAt: new Date('2026-03-01T12:00:00Z'),
  },
  {
    id: 'tr_solar_bn',
    originalItemId: 'item_solar_system_en',
    originalTitle: 'The Solar System: Architecture and Planetary Dynamics',
    originalLanguage: 'en',
    originalContent:
      'The Solar System consists of our gravitationally bound planetary system dominated by the Sun...',
    translatedItemId: 'item_solar_system_bn',
    language: 'bn',
    title: 'সৌরজগৎ: গঠনবিন্যাস ও গ্রহমণ্ডলীর মহাকর্ষীয় গতিবিদ্যা',
    summary:
      'সৌরজগৎ হলো সূর্য এবং এর মহাকর্ষীয় বল দ্বারা আবদ্ধ মহাজাগতিক বস্তুসমূহের সুবিন্যস্ত পরিবার।',
    content:
      '# সৌরজগতের স্থাপত্য ও গ্রহমণ্ডলী\n\nসৌরজগৎ হলো সূর্য এবং এর মহাকর্ষীয় বল দ্বারা আবদ্ধ...',
    reviewStatus: VerificationStatus.REVIEWED,
    translator: {
      id: 'usr_edu_01',
      name: 'Dr. Tanvir Rahman',
      email: 'tanvir@knowra.org',
    },
    reviewer: {
      id: 'usr_admin_01',
      name: 'Nahid Emdad',
      reviewedAt: new Date('2026-03-05T14:30:00Z'),
      notes: 'Matches NASA planetary data perfectly.',
    },
    createdAt: new Date('2026-02-20T10:00:00Z'),
    updatedAt: new Date('2026-03-05T14:30:00Z'),
  },
  {
    id: 'tr_quantum_draft_bn',
    originalItemId: 'item_quantum_en',
    originalTitle: 'Quantum Mechanics: Fundamentals of Wave-Particle Duality',
    originalLanguage: 'en',
    originalContent:
      'Quantum superposition is a fundamental principle of quantum mechanics stating that any linear combination of states is also a valid state...',
    language: 'bn',
    title: 'কোয়ান্টাম সুপারপজিশন ও এনট্যাঙ্গেলমেন্টের মূলনীতি (খসড়া)',
    summary:
      'কোয়ান্টাম সুপারপজিশন হলো কোয়ান্টাম বলবিদ্যার মৌলিক নীতি যাতে কণা একই সাথে একাধিক কোয়ান্টাম অবস্থায় বিদ্যমান থাকতে পারে।',
    content:
      '# কোয়ান্টাম সুপারপজিশন\n\nকোয়ান্টাম বলবিদ্যায় সুপারপজিশন হলো একটি মৌলিক নীতি...',
    // PRD 5.4: Translation review is tracked independently; original is REVIEWED, translation is PENDING_REVIEW
    reviewStatus: VerificationStatus.PENDING_REVIEW,
    translator: {
      id: 'usr_comm_02',
      name: 'Shakil Ahmed',
      email: 'shakil@bangla-science.org',
    },
    createdAt: new Date('2026-11-01T15:00:00Z'),
    updatedAt: new Date('2026-11-01T15:00:00Z'),
  },
];

export class TranslationService {
  /**
   * Retrieves all translation records with optional filtering
   */
  static listTranslations(options: {
    originalItemId?: string;
    language?: string;
    reviewStatus?: VerificationStatus;
  }) {
    let list = [...IN_MEMORY_TRANSLATIONS];

    if (options.originalItemId) {
      list = list.filter((t) => t.originalItemId === options.originalItemId);
    }
    if (options.language) {
      list = list.filter((t) => t.language === options.language);
    }
    if (options.reviewStatus) {
      list = list.filter((t) => t.reviewStatus === options.reviewStatus);
    }

    return list;
  }

  /**
   * Retrieves single translation record by ID
   */
  static getTranslationById(id: string) {
    return IN_MEMORY_TRANSLATIONS.find((t) => t.id === id) || null;
  }

  /**
   * Submits a new translation draft for an existing knowledge item
   * PRD 5.4 Strict Rule: Every new translation MUST start in DRAFT or PENDING_REVIEW status,
   * never automatically inheriting the original article's reviewed status.
   */
  static submitTranslation(input: {
    originalItemId: string;
    language: 'en' | 'bn';
    title: string;
    summary: string;
    content: string;
    translatorName: string;
    translatorEmail: string;
  }): TranslationRecord {
    const original = INITIAL_KNOWLEDGE_ITEMS.find(
      (k) => k.id === input.originalItemId || k.slug === input.originalItemId
    );
    if (!original) {
      throw new Error(`Original knowledge item '${input.originalItemId}' not found.`);
    }

    if (original.language === input.language) {
      throw new Error(`Translation target language cannot be identical to original article language (${original.language}).`);
    }

    const newRecord: TranslationRecord = {
      id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      originalItemId: original.id,
      originalTitle: original.title,
      originalLanguage: original.language,
      originalContent: original.content,
      language: input.language,
      title: input.title,
      summary: input.summary,
      content: input.content,
      reviewStatus: VerificationStatus.PENDING_REVIEW, // Independent review required
      translator: {
        id: `usr_${Date.now()}`,
        name: input.translatorName,
        email: input.translatorEmail,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    IN_MEMORY_TRANSLATIONS.unshift(newRecord);
    return newRecord;
  }

  /**
   * Editorial review of a translation draft
   */
  static reviewTranslation(
    id: string,
    action: 'APPROVE' | 'REQUEST_CORRECTIONS' | 'REJECT',
    reviewer: { id: string; name: string },
    notes?: string
  ): TranslationRecord {
    const translation = this.getTranslationById(id);
    if (!translation) {
      throw new Error(`Translation record '${id}' not found.`);
    }

    switch (action) {
      case 'APPROVE':
        translation.reviewStatus = VerificationStatus.REVIEWED;
        break;
      case 'REQUEST_CORRECTIONS':
        translation.reviewStatus = VerificationStatus.NEEDS_CORRECTION;
        break;
      case 'REJECT':
        translation.reviewStatus = VerificationStatus.ARCHIVED;
        break;
    }

    translation.reviewer = {
      id: reviewer.id,
      name: reviewer.name,
      reviewedAt: new Date(),
      notes,
    };
    translation.updatedAt = new Date();

    return translation;
  }
}
