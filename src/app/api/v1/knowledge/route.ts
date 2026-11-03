import { NextRequest } from 'next/server';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import { jsonSuccess } from '@/lib/api/response';
import { enforceRateLimit } from '@/lib/api/rate-limiter';

export async function GET(request: NextRequest) {
  const rateLimitError = enforceRateLimit(request);
  if (rateLimitError) return rateLimitError;

  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || searchParams.get('lang');
  const category = searchParams.get('category');
  const tag = searchParams.get('tag')?.toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  let items = INITIAL_KNOWLEDGE_ITEMS;

  if (language && language !== 'all') {
    items = items.filter((i) => i.language === language);
  }
  if (category) {
    items = items.filter((i) => i.category.slug === category);
  }
  if (tag) {
    items = items.filter((i) => i.tags.some((t) => t.toLowerCase() === tag));
  }

  const total = items.length;
  const skip = (page - 1) * limit;
  const paginated = items.slice(skip, skip + limit);

  return jsonSuccess(paginated, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
