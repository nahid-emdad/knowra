import { PrismaClient, Role, VerificationStatus, SourceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Knowra database seeding...');

  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecret2026!';
  const editorPassword = process.env.INITIAL_EDITOR_PASSWORD || 'EditorSecret2026!';

  const adminHash = bcrypt.hashSync(adminPassword, 10);
  const editorHash = bcrypt.hashSync(editorPassword, 10);

  // 1. Create Default Users (Admin & Editor) with verified bcrypt password hashes
  const admin = await prisma.user.upsert({
    where: { email: 'admin@knowra.org' },
    update: { passwordHash: adminHash },
    create: {
      name: 'Knowra Editorial Board',
      email: 'admin@knowra.org',
      role: Role.ADMIN,
      passwordHash: adminHash,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@knowra.org' },
    update: { passwordHash: editorHash },
    create: {
      name: 'Bilingual Reviewer',
      email: 'editor@knowra.org',
      role: Role.EDITOR,
      passwordHash: editorHash,
    },
  });

  console.log('✅ Users seeded: admin@knowra.org, editor@knowra.org');

  // 2. Seed 12 Core Initial Categories from PRD 4.4
  const categoriesData = [
    { name: 'Science', slug: 'science', description: 'Empirical knowledge, natural phenomena, physics, chemistry, and biology.' },
    { name: 'Technology', slug: 'technology', description: 'Applied science, computing, software engineering, and digital systems.' },
    { name: 'Education', slug: 'education', description: 'Pedagogy, learning methodologies, educational systems, and research tools.' },
    { name: 'History', slug: 'history', description: 'Chronicles, civilizations, historical movements, and human heritage.' },
    { name: 'Geography', slug: 'geography', description: 'Earth topography, cartography, climates, and geopolitical regions.' },
    { name: 'Health Education', slug: 'health-education', description: 'Public health concepts, wellness, physiological sciences. Not individual medical advice.' },
    { name: 'Environment', slug: 'environment', description: 'Ecology, biodiversity, climate systems, and sustainability.' },
    { name: 'Mathematics', slug: 'mathematics', description: 'Pure and applied mathematics, algebra, geometry, calculus, and logic.' },
    { name: 'Language', slug: 'language', description: 'Linguistics, phonology, grammar, translation studies, and etymology.' },
    { name: 'Culture', slug: 'culture', description: 'Art, literature, anthropology, traditions, and societal knowledge.' },
    { name: 'Economics', slug: 'economics', description: 'Macroeconomics, microeconomics, commerce, trade, and economic theory.' },
    { name: 'General Knowledge', slug: 'general-knowledge', description: 'Interdisciplinary facts, foundational references, and universal knowledge.' },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { description: cat.description },
      create: cat,
    });
    categories[cat.slug] = record.id;
  }
  console.log(`✅ ${categoriesData.length} core categories seeded.`);

  // 3. Seed Verified Primary Sources from PRD 5.3
  const sourceNasa = await prisma.source.upsert({
    where: { url: 'https://science.nasa.gov/solar-system/' },
    update: {},
    create: {
      url: 'https://science.nasa.gov/solar-system/',
      title: 'Our Solar System: In Depth Overview',
      publisher: 'NASA Science Mission Directorate',
      author: 'NASA Solar System Exploration Team',
      sourceType: SourceType.GOVERNMENT,
      language: 'en',
    },
  });

  const sourceNature = await prisma.source.upsert({
    where: { url: 'https://www.nature.com/articles/nature08431' },
    update: {},
    create: {
      url: 'https://www.nature.com/articles/nature08431',
      title: 'Structure and mechanism of the photosynthetic reaction center',
      publisher: 'Nature Publishing Group',
      author: 'Deisenhofer, J. & Michel, H.',
      sourceType: SourceType.RESEARCH_PAPER,
      language: 'en',
    },
  });

  const sourceBanglapedia = await prisma.source.upsert({
    where: { url: 'http://en.banglapedia.org/index.php/Photosynthesis' },
    update: {},
    create: {
      url: 'http://en.banglapedia.org/index.php/Photosynthesis',
      title: 'Photosynthesis in Plant Biology',
      publisher: 'Asiatic Society of Bangladesh',
      author: 'Dr. Md. Abdul Jalil',
      sourceType: SourceType.ACADEMIC,
      language: 'bn',
    },
  });

  console.log('✅ Verified primary sources seeded.');

  // 4. Seed Exemplary Bilingual Knowledge Items (Photosynthesis)
  // English Original Article
  const itemPhotosynthesisEn = await prisma.knowledgeItem.upsert({
    where: { slug: 'photosynthesis-process' },
    update: {},
    create: {
      slug: 'photosynthesis-process',
      title: 'Photosynthesis: The Biological Engine of Life',
      summary: 'Photosynthesis is the photochemical process by which autotrophic organisms convert solar light energy into stable biochemical energy in the form of glucose.',
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
      categoryId: categories['science'],
      status: VerificationStatus.REVIEWED,
      authorId: admin.id,
      revisionNumber: 1,
      lastReviewedAt: new Date(),
    },
  });

  // Link source to English article
  await prisma.knowledgeSource.upsert({
    where: {
      knowledgeItemId_sourceId: {
        knowledgeItemId: itemPhotosynthesisEn.id,
        sourceId: sourceNature.id,
      },
    },
    update: {},
    create: {
      knowledgeItemId: itemPhotosynthesisEn.id,
      sourceId: sourceNature.id,
      supportingNote: 'Primary crystallographic and biochemical mechanistic reference for photosynthesis.',
    },
  });

  // Bengali Translated Knowledge Item
  const itemPhotosynthesisBn = await prisma.knowledgeItem.upsert({
    where: { slug: 'saloksongshleshan-prokriya' },
    update: {},
    create: {
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
      categoryId: categories['science'],
      status: VerificationStatus.REVIEWED,
      authorId: editor.id,
      revisionNumber: 1,
      lastReviewedAt: new Date(),
    },
  });

  // Link source to Bengali article
  await prisma.knowledgeSource.upsert({
    where: {
      knowledgeItemId_sourceId: {
        knowledgeItemId: itemPhotosynthesisBn.id,
        sourceId: sourceBanglapedia.id,
      },
    },
    update: {},
    create: {
      knowledgeItemId: itemPhotosynthesisBn.id,
      sourceId: sourceBanglapedia.id,
      supportingNote: 'উদ্ভিদবিজ্ঞানের নির্ভরযোগ্য বাংলা রেফারেন্স ও পারিভাষিক ব্যাখ্যা।',
    },
  });

  // Link Translation record between English and Bengali
  await prisma.translation.upsert({
    where: {
      originalItemId_language: {
        originalItemId: itemPhotosynthesisEn.id,
        language: 'bn',
      },
    },
    update: {},
    create: {
      knowledgeItemId: itemPhotosynthesisBn.id,
      originalItemId: itemPhotosynthesisEn.id,
      language: 'bn',
      title: itemPhotosynthesisBn.title,
      summary: itemPhotosynthesisBn.summary,
      content: itemPhotosynthesisBn.content,
      reviewStatus: VerificationStatus.REVIEWED,
    },
  });

  console.log('✅ Exemplary bilingual knowledge items (Photosynthesis / সালোকসংশ্লেষণ) seeded.');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
