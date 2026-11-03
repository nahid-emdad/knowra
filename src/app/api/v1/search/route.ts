import { NextRequest } from 'next/server';
import { SearchService } from '@/lib/services/search';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import { jsonSuccess } from '@/lib/api/response';
import { enforceRateLimit } from '@/lib/api/rate-limiter';

export async function GET(request: NextRequest) {
  const rateLimitError = enforceRateLimit(request);
  if (rateLimitError) return rateLimitError;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const language = searchParams.get('language') || searchParams.get('lang') || 'all';
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'relevance';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

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

  let results = SearchService.searchInMemory(filtered, q, language);

  if (sort === 'recent') {
    results.sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
  } else if (sort === 'title') {
    results.sort((a, b) => a.title.localeCompare(b.title));
  }

  const total = results.length;
  const skip = (page - 1) * limit;
  const paginatedResults = results.slice(skip, skip + limit);

  return jsonSuccess(paginatedResults, {
    query: q,
    detectedLanguage: language,
    sort,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
