import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/lib/services/search';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const language = searchParams.get('language') || searchParams.get('lang') || 'all';
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

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

  let filtered = corpus;
  if (category) {
    filtered = filtered.filter((c) => c.category.slug === category);
  }

  const results = SearchService.searchInMemory(filtered, q, language);
  const total = results.length;
  const skip = (page - 1) * limit;
  const paginatedResults = results.slice(skip, skip + limit);

  return NextResponse.json({
    success: true,
    data: paginatedResults,
    meta: {
      query: q,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      detectedLanguage: language,
    },
  });
}
