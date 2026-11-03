import { SourceType, VerificationStatus } from '@prisma/client';

export interface StaticCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  itemCount: number;
}

export interface StaticSource {
  id: string;
  url: string;
  title: string;
  publisher: string;
  author: string;
  sourceType: SourceType;
  license?: string;
  language: string;
  supportingLocation?: string;
}

export interface StaticKnowledgeItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  language: 'en' | 'bn';
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  status: VerificationStatus;
  author: {
    id: string;
    name: string;
  };
  sources: Array<{
    source: StaticSource;
    supportingNote?: string;
  }>;
  translations: Array<{
    id: string;
    slug: string;
    title: string;
    language: string;
  }>;
  revisionNumber: number;
  aiSummary?: string;
  isAiGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt: Date;
}

export const INITIAL_CATEGORIES: StaticCategory[] = [
  { id: 'cat_science', name: 'Science', slug: 'science', description: 'Empirical knowledge, natural phenomena, physics, chemistry, and biology.', itemCount: 4 },
  { id: 'cat_technology', name: 'Technology', slug: 'technology', description: 'Applied science, computing, software engineering, and digital systems.', itemCount: 2 },
  { id: 'cat_education', name: 'Education', slug: 'education', description: 'Pedagogy, learning methodologies, educational systems, and research tools.', itemCount: 1 },
  { id: 'cat_history', name: 'History', slug: 'history', description: 'Chronicles, civilizations, historical movements, and human heritage.', itemCount: 2 },
  { id: 'cat_geography', name: 'Geography', slug: 'geography', description: 'Earth topography, cartography, climates, and geopolitical regions.', itemCount: 1 },
  { id: 'cat_health', name: 'Health Education', slug: 'health-education', description: 'Public health concepts, wellness, physiological sciences. Not individual medical advice.', itemCount: 1 },
  { id: 'cat_environment', name: 'Environment', slug: 'environment', description: 'Ecology, biodiversity, climate systems, and sustainability.', itemCount: 1 },
  { id: 'cat_math', name: 'Mathematics', slug: 'mathematics', description: 'Pure and applied mathematics, algebra, geometry, calculus, and logic.', itemCount: 1 },
  { id: 'cat_language', name: 'Language', slug: 'language', description: 'Linguistics, phonology, grammar, translation studies, and etymology.', itemCount: 1 },
  { id: 'cat_culture', name: 'Culture', slug: 'culture', description: 'Art, literature, anthropology, traditions, and societal knowledge.', itemCount: 1 },
  { id: 'cat_economics', name: 'Economics', slug: 'economics', description: 'Macroeconomics, microeconomics, commerce, trade, and economic theory.', itemCount: 1 },
  { id: 'cat_general', name: 'General Knowledge', slug: 'general-knowledge', description: 'Interdisciplinary facts, foundational references, and universal knowledge.', itemCount: 1 },
];

export const INITIAL_SOURCES: Record<string, StaticSource> = {
  nature: {
    id: 'src_nature_01',
    url: 'https://www.nature.com/articles/nature08431',
    title: 'Structure and mechanism of the photosynthetic reaction center',
    publisher: 'Nature Publishing Group',
    author: 'Deisenhofer, J. & Michel, H.',
    sourceType: SourceType.RESEARCH_PAPER,
    license: 'Academic / Peer-Reviewed',
    language: 'en',
    supportingLocation: 'Vol 461, pp 123-130',
  },
  nasa: {
    id: 'src_nasa_01',
    url: 'https://science.nasa.gov/solar-system/',
    title: 'Our Solar System: Planetary Dynamics and Architecture',
    publisher: 'NASA Science Mission Directorate',
    author: 'NASA Solar System Exploration Division',
    sourceType: SourceType.GOVERNMENT,
    license: 'Public Domain / US Gov',
    language: 'en',
    supportingLocation: 'Planetary Science Archive',
  },
  banglapedia: {
    id: 'src_banglapedia_01',
    url: 'http://en.banglapedia.org/index.php/Photosynthesis',
    title: 'Photosynthesis in Botanical Sciences',
    publisher: 'Asiatic Society of Bangladesh',
    author: 'Dr. Md. Abdul Jalil',
    sourceType: SourceType.ACADEMIC,
    license: 'Educational Reference',
    language: 'bn',
    supportingLocation: 'National Encyclopedia of Bangladesh',
  },
  ieee: {
    id: 'src_ieee_01',
    url: 'https://quantum.ieee.org/resources',
    title: 'Quantum Information Science Principles and Qubit Architectures',
    publisher: 'IEEE Computer Society',
    author: 'IEEE Quantum Technical Community',
    sourceType: SourceType.OFFICIAL_DOCUMENTATION,
    license: 'IEEE Open Access',
    language: 'en',
    supportingLocation: 'Section 4: Superposition & Entanglement',
  },
  unesco: {
    id: 'src_unesco_01',
    url: 'https://www.unesco.org/en/days/mother-language',
    title: 'International Mother Language Day: Historical Origins and Bengali Legacy',
    publisher: 'UNESCO General Conference Archive',
    author: 'UNESCO Department of Cultural Preservation',
    sourceType: SourceType.EDUCATIONAL_INSTITUTION,
    license: 'CC-BY-SA 3.0 IGO',
    language: 'en',
    supportingLocation: 'Resolution 30C/62 (1999)',
  },
};

export const INITIAL_KNOWLEDGE_ITEMS: StaticKnowledgeItem[] = [
  {
    id: 'item_photosynthesis_en',
    slug: 'photosynthesis-process',
    title: 'Photosynthesis: The Biological Engine of Life',
    summary: 'Photosynthesis is the photochemical process by which autotrophic green plants and algae convert solar light energy into stable biochemical energy in the form of glucose.',
    content: `# Photosynthesis: The Fundamental Engine of Earth's Biosphere

Photosynthesis is a physico-chemical process by which photosynthetic organisms (green plants, algae, and cyanobacteria) capture electromagnetic radiation from sunlight and convert it into chemical free energy.

## The Biochemical Reaction

The overall balanced chemical equation for oxygenic photosynthesis is:

$$6CO_2 + 6H_2O + \\text{photons} \\rightarrow C_6H_{12}O_6 + 6O_2$$

## Stages of Photosynthesis

1. **Light-Dependent Reactions:** Occur in the thylakoid membranes of chloroplasts, generating ATP and NADPH while photolysing water into molecular oxygen.
2. **Light-Independent Reactions (Calvin Cycle):** Occur in the chloroplast stroma, utilizing ATP and NADPH to fix atmospheric carbon dioxide into carbohydrates.

## Ecological Significance

Photosynthesis produces virtually all molecular oxygen in Earth's atmosphere and serves as the primary trophic base for terrestrial and aquatic ecosystems.`,
    language: 'en',
    category: { id: 'cat_science', name: 'Science', slug: 'science' },
    tags: ['biology', 'botany', 'energy', 'chloroplast', 'biochemistry'],
    status: VerificationStatus.REVIEWED,
    author: { id: 'usr_admin', name: 'Knowra Editorial Board' },
    sources: [
      {
        source: INITIAL_SOURCES.nature,
        supportingNote: 'Primary crystallographic and biochemical mechanistic reference for photosynthesis.',
      },
    ],
    translations: [
      {
        id: 'item_photosynthesis_bn',
        slug: 'saloksongshleshan-prokriya',
        title: 'সালোকসংশ্লেষণ: পৃথিবীর প্রাণধারণের মূল জৈবরাসায়নিক প্রক্রিয়া',
        language: 'bn',
      },
    ],
    revisionNumber: 1,
    aiSummary: 'Autotrophic organisms harness sunlight, water, and atmospheric carbon dioxide to synthesize glucose and release molecular oxygen.',
    isAiGenerated: false,
    createdAt: new Date('2026-10-15T08:00:00Z'),
    updatedAt: new Date('2026-10-20T14:30:00Z'),
    lastReviewedAt: new Date('2026-10-20T14:30:00Z'),
  },
  {
    id: 'item_photosynthesis_bn',
    slug: 'saloksongshleshan-prokriya',
    title: 'সালোকসংশ্লেষণ: পৃথিবীর প্রাণধারণের মূল জৈবরাসায়নিক প্রক্রিয়া',
    summary: 'সালোকসংশ্লেষণ হলো একটি জৈবরাসায়নিক প্রক্রিয়া যার মাধ্যমে সবুজ উদ্ভিদ সূর্যালোকের শক্তিকে ব্যবহার করে পানি ও কার্বন ডাই-অক্সাইড থেকে গ্লুকোজ ও অক্সিজেন তৈরি করে।',
    content: `# সালোকসংশ্লেষণ: পৃথিবীর প্রাণধারণের মূল ভিত্তি

সালোকসংশ্লেষণ (Photosynthesis) হলো সবুজ উদ্ভিদের পাতায় সংঘটিত একটি অত্যন্ত গুরুত্বপূর্ণ জৈবরাসায়নিক প্রক্রিয়া। এই প্রক্রিয়ায় সূর্যালোকের উপস্থিতিতে পানি ও কার্বন ডাই-অক্সাইড রাসায়নিক বিক্রিয়ার মাধ্যমে শর্করা জাতীয় খাদ্য তৈরি করে।

## সামগ্রিক রাসায়নিক সমীকরণ

সালোকসংশ্লেষণের সামগ্রিক রাসায়নিক সমীকরণটি নিচে দেওয়া হলো:

$$6CO_2 + 12H_2O + \\text{সূর্যালোক} \\xrightarrow{\\text{ক্লোরোফিল}} C_6H_{12}O_6 + 6H_2O + 6O_2$$

## সালোকসংশ্লেষণের দুটি প্রধান পর্যায়

১. **আলোক-নির্ভর পর্যায় (Light Reaction):** এটি ক্লোরোপ্লাস্টের থাইলাকয়েড পর্দায় ঘটে। এখানে সৌরশক্তি এটিপি (ATP) ও এনএডিপিএইচ (NADPH)-এ রূপান্তরিত হয় এবং পানি বিশ্লিষ্ট হয়ে মুক্ত অক্সিজেন নির্গত হয়।
২. **আলোক-নিরপেক্ষ পর্যায় (Calvin Cycle):** এটি ক্লোরোপ্লাস্টের স্ট্রোমাতে সম্পন্ন হয়। বায়ুমণ্ডলের কার্বন ডাই-অক্সাইড বিজারিত হয়ে কার্বোহাইড্রেটে রূপান্তরিত হয়।

## পরিবেশগত গুরুত্ব

পৃথিবীর বায়ুমণ্ডলের যাবতীয় মুক্ত অক্সিজেনের প্রধান উৎস সালোকসংশ্লেষণ, যা সমস্ত জীবজগতের শ্বাসক্রিয়া ও বাস্তুতন্ত্রকে সচল রাখে।`,
    language: 'bn',
    category: { id: 'cat_science', name: 'Science', slug: 'science' },
    tags: ['উদ্ভিদবিজ্ঞান', 'জীববিজ্ঞান', 'সালোকসংশ্লেষণ', 'ক্লোরোপ্লাস্ট'],
    status: VerificationStatus.REVIEWED,
    author: { id: 'usr_editor', name: 'Bilingual Reviewer' },
    sources: [
      {
        source: INITIAL_SOURCES.banglapedia,
        supportingNote: 'উদ্ভিদবিজ্ঞানের নির্ভরযোগ্য বাংলা রেফারেন্স ও পারিভাষিক ব্যাখ্যা।',
      },
      {
        source: INITIAL_SOURCES.nature,
        supportingNote: 'জৈবরাসায়নিক বিক্রিয়ার আন্তর্জাতিক প্রামাণ্য গবেষণা।',
      },
    ],
    translations: [
      {
        id: 'item_photosynthesis_en',
        slug: 'photosynthesis-process',
        title: 'Photosynthesis: The Biological Engine of Life',
        language: 'en',
      },
    ],
    revisionNumber: 1,
    aiSummary: 'সূর্যালোক, পানি ও কার্বন ডাই-অক্সাইডের সমন্বয়ে শর্করা উৎপাদন ও অক্সিজেন নির্গমনের প্রাকৃতিক প্রক্রিয়া।',
    isAiGenerated: false,
    createdAt: new Date('2026-10-16T09:00:00Z'),
    updatedAt: new Date('2026-10-21T11:15:00Z'),
    lastReviewedAt: new Date('2026-10-21T11:15:00Z'),
  },
  {
    id: 'item_solar_system_en',
    slug: 'solar-system-planetary-dynamics',
    title: 'Our Solar System: Planetary Dynamics and Architecture',
    summary: 'The gravitationally bound planetary system of the Sun, comprising eight major planets, dwarf planets, and interplanetary debris originating 4.6 billion years ago.',
    content: `# The Solar System: Gravitational Mechanics and Planetary Order

The Solar System comprises the Sun and the planetary objects bound to it by gravitational attraction. Formed approximately 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud.

## Planetary Classification

The eight planets are categorized into two primary astronomical classes:

1. **Terrestrial Planets (Inner):** Mercury, Venus, Earth, and Mars. Characterized by dense, silicate rock surfaces and metallic iron-nickel cores.
2. **Jovian Planets (Outer):**
   - **Gas Giants:** Jupiter and Saturn, composed primarily of hydrogen and helium.
   - **Ice Giants:** Uranus and Neptune, possessing mantles rich in water, ammonia, and methane ices.

## Heliopause and Boundaries

The solar wind creates a vast magnetized bubble known as the **heliosphere**, terminating at the **heliopause** where interstellar space begins.`,
    language: 'en',
    category: { id: 'cat_science', name: 'Science', slug: 'science' },
    tags: ['astronomy', 'planets', 'solar-system', 'gravitation', 'space'],
    status: VerificationStatus.REVIEWED,
    author: { id: 'usr_admin', name: 'Knowra Editorial Board' },
    sources: [
      {
        source: INITIAL_SOURCES.nasa,
        supportingNote: 'NASA planetary mission datasets and orbital trajectory records.',
      },
    ],
    translations: [
      {
        id: 'item_solar_system_bn',
        slug: 'shourojogot-porichiti',
        title: 'আমাদের সৌরজগৎ: গঠন ও গ্রহমণ্ডলী',
        language: 'bn',
      },
    ],
    revisionNumber: 1,
    isAiGenerated: false,
    createdAt: new Date('2026-10-18T10:00:00Z'),
    updatedAt: new Date('2026-10-22T16:00:00Z'),
    lastReviewedAt: new Date('2026-10-22T16:00:00Z'),
  },
  {
    id: 'item_solar_system_bn',
    slug: 'shourojogot-porichiti',
    title: 'আমাদের সৌরজগৎ: গঠন ও গ্রহমণ্ডলী',
    summary: 'সূর্য ও একে কেন্দ্র করে আবর্তিত আটটি প্রধান গ্রহ, বামন গ্রহ ও কোটি কোটি গ্রহাণু নিয়ে গঠিত আমাদের এই মহাজাগতিক পরিবার।',
    content: `# সৌরজগৎ: মহাজাগতিক গঠন ও গ্রহমণ্ডল

সৌরজগৎ হলো সূর্য এবং একে কেন্দ্র করে মহাকর্ষ বলের প্রভাবে ঘূর্ণায়মান মহাজাগতিক বস্তুপুঞ্জ নিয়ে গঠিত একটি পরিবার। প্রায় ৪.৬ বিলিয়ন বছর পূর্বে একটি বিশাল আণবিক মেঘের মহাকর্ষীয় সংকোচনের ফলে সৌরজগতের উৎপত্তি ঘটে।

## গ্রহের শ্রেণিবিভাগ

সৌরজগতের আটটি গ্রহকে প্রধানত দুটি শ্রেণিতে ভাগ করা হয়:

১. **অভ্যন্তরীণ বা পাথুরে গ্রহ (Terrestrial Planets):** বুধ, শুক্র, পৃথিবী ও মঙ্গল। এগুলোর পৃষ্ঠতল কঠিন শিলা ও ধাতু দ্বারা গঠিত।
২. **বহিঃস্থ গ্রহ (Jovian Planets):**
   - **গ্যাসীয় দানব (Gas Giants):** বৃহস্পতি ও শনি, যা প্রধানত হাইড্রোজেন ও হিলিয়াম গ্যাস দ্বারা গঠিত।
   - **বরফ দানব (Ice Giants):** ইউরেনাস ও নেপচুন, যার আবরণে পানি, অ্যামোনিয়া ও মিথেন বরফ বিদ্যমান।

## প্রধান তথ্যসারণী

- **কেন্দ্রীয় নক্ষত্র:** সূর্য (G-টাইপ প্রধান ধারার নক্ষত্র)
- **মোট প্রধান গ্রহ:** ৮টি
- **পরিচিত বামন গ্রহ:** প্লুটো, সেরেস, এরিস, হাউমেয়া, মাকেমাকে।`,
    language: 'bn',
    category: { id: 'cat_science', name: 'Science', slug: 'science' },
    tags: ['জ্যোতির্বিজ্ঞান', 'সৌরজগৎ', 'গ্রহ', 'মহাকাশ'],
    status: VerificationStatus.REVIEWED,
    author: { id: 'usr_editor', name: 'Bilingual Reviewer' },
    sources: [
      {
        source: INITIAL_SOURCES.nasa,
        supportingNote: 'নাসা সোলার সিস্টেম এক্সপ্লোরেশন ডেটাবেজ।',
      },
    ],
    translations: [
      {
        id: 'item_solar_system_en',
        slug: 'solar-system-planetary-dynamics',
        title: 'Our Solar System: Planetary Dynamics and Architecture',
        language: 'en',
      },
    ],
    revisionNumber: 1,
    isAiGenerated: false,
    createdAt: new Date('2026-10-18T10:00:00Z'),
    updatedAt: new Date('2026-10-22T16:00:00Z'),
    lastReviewedAt: new Date('2026-10-22T16:00:00Z'),
  },
  {
    id: 'item_quantum_en',
    slug: 'quantum-computing-fundamentals',
    title: 'Quantum Computing Fundamentals: Principles and Qubit Architectures',
    summary: 'Harnessing quantum mechanical phenomena such as superposition and entanglement to solve computational problems intractable on classical Turing architectures.',
    content: `# Quantum Computing: Foundations of Non-Classical Computation

Quantum computing represents a fundamental paradigm shift from classical information processing. While classical computers encode information into binary digits (bits) taking values of either 0 or 1, quantum computers process quantum bits (**qubits**).

## Foundational Quantum Principles

1. **Quantum Superposition:** A qubit can exist in a linear combination of states $|0\\rangle$ and $|1\\rangle$:
   $$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle, \\quad |\\alpha|^2 + |\\beta|^2 = 1$$
2. **Quantum Entanglement:** Correlation between multiple qubits where the quantum state of each particle cannot be described independently of the state of the others.
3. **Quantum Interference:** Amplification of correct computational paths while cancelling erroneous amplitudes via phase interference.

## Practical Applications

- **Cryptographic Cryptanalysis:** Shor's algorithm for polynomial-time integer factorization.
- **Quantum Chemistry Simulation:** Exact modeling of molecular catalysts for nitrogen fixation and clean energy batteries.`,
    language: 'en',
    category: { id: 'cat_technology', name: 'Technology', slug: 'technology' },
    tags: ['computing', 'quantum', 'physics', 'algorithms', 'qubit'],
    status: VerificationStatus.REVIEWED,
    author: { id: 'usr_admin', name: 'Knowra Editorial Board' },
    sources: [
      {
        source: INITIAL_SOURCES.ieee,
        supportingNote: 'IEEE Quantum Standards and Qubit Benchmarks Reference.',
      },
    ],
    translations: [],
    revisionNumber: 2,
    isAiGenerated: false,
    createdAt: new Date('2026-10-25T12:00:00Z'),
    updatedAt: new Date('2026-10-28T15:20:00Z'),
    lastReviewedAt: new Date('2026-10-28T15:20:00Z'),
  },
  {
    id: 'item_bhasha_andolon_bn',
    slug: 'bengali-language-movement-1952',
    title: '১৯৫২ সালের মহান ভাষা আন্দোলন: প্রেক্ষাপট ও আত্মত্যাগ',
    summary: 'রাষ্ট্রভাষা হিসেবে বাংলার মর্যাদার দাবিতে ঐতিহাসিক আত্মত্যাগ, যার স্মরণে পরবর্তীতে ইউনেস্কো কর্তৃক ২১শে ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস ঘোষণা করা হয়।',
    content: `# ১৯৫২ সালের মহান ভাষা আন্দোলন: ইতিহাসের অনন্য অধ্যায়

১৯৫২ সালের ভাষা আন্দোলন বাঙালি জাতীয়তাবাদের উন্মেষ ও আত্মনিয়ন্ত্রণাধিকার অর্জনের ইতিহাসের অন্যতম গৌরবোজ্জ্বল অধ্যায়। তৎকালীন পাকিস্তান সরকারের একতরফাভাবে উর্দুকে একমাত্র রাষ্ট্রভাষা ঘোষণার প্রতিবাদে ছাত্র ও সর্বস্তরের জনগণ গর্জে ওঠে।

## আন্দোলনের কালক্রম

- **১৯৪৮ সালের সূচণা:** তৎকালীন গভর্নর জেনারেল মোহাম্মদ আলী জিন্নাহ ঘোষণা করেন "Urdu, and only Urdu shall be the state language of Pakistan"। এর তাৎক্ষণিক প্রতিবাদ জানায় ঢাকা বিশ্ববিদ্যালয়ের ছাত্র সমাজ।
- **২১শে ফেব্রুয়ারি ১৯৫২:** ১৪৪ ধারা ভঙ্গ করে ঢাকা বিশ্ববিদ্যালয়ের প্রাঙ্গণ থেকে ঐতিহাসিক মিছিল বের হয়। পুলিশের গুলিতে সালাম, বরকত, রফিক, জব্বার, শফিউরসহ বহু ভাষা সৈনিক শহীদ হন।

## ইউনেস্কো ও আন্তর্জাতিক স্বীকৃতি

১৯৯৯ সালের ১৭ নভেম্বর প্যারিসে অনুষ্ঠিত ইউনেস্কোর ৩০তম সাধারণ অধিবেশনে ২১শে ফেব্রুয়ারিকে **আন্তর্জাতিক মাতৃভাষা দিবস (International Mother Language Day)** হিসেবে স্বীকৃতি প্রদান করা হয়। আজ বিশ্বজুড়ে ভাষা বৈচিত্র্য ও মাতৃভাষা সংরক্ষণের প্রতীক হিসেবে এই দিনটি পালিত হয়।`,
    language: 'bn',
    category: { id: 'cat_history', name: 'History', slug: 'history' },
    tags: ['ইতিহাস', 'ভাষা-আন্দোলন', 'একুশে-ফেব্রুয়ারি', 'মাতৃভাষা'],
    status: VerificationStatus.REVIEWED,
    author: { id: 'usr_editor', name: 'Bilingual Reviewer' },
    sources: [
      {
        source: INITIAL_SOURCES.unesco,
        supportingNote: 'ইউনেস্কো আন্তর্জাতিক মাতৃভাষা দিবস সংরক্ষণালয় ও সনদ।',
      },
      {
        source: INITIAL_SOURCES.banglapedia,
        supportingNote: 'বাংলাপিডিয়া ভাষা আন্দোলন ইতিহাস নথি।',
      },
    ],
    translations: [],
    revisionNumber: 1,
    isAiGenerated: false,
    createdAt: new Date('2026-10-10T09:00:00Z'),
    updatedAt: new Date('2026-10-12T11:00:00Z'),
    lastReviewedAt: new Date('2026-10-12T11:00:00Z'),
  },
];
