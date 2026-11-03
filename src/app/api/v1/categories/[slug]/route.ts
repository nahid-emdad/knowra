import { NextRequest } from 'next/server';
import { INITIAL_CATEGORIES, INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
import { jsonSuccess, jsonError } from '@/lib/api/response';
import { enforceRateLimit } from '@/lib/api/rate-limiter';

interface RouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const rateLimitError = enforceRateLimit(request);
  if (rateLimitError) return rateLimitError;

  const { slug } = await params;
  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug || c.id === slug);

  if (!category) {
    return jsonError(
      'NOT_FOUND',
      `Category with slug or ID '${slug}' was not found.`,
      404
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  const items = INITIAL_KNOWLEDGE_ITEMS.filter((k) => k.category.slug === category.slug);
  const total = items.length;
  const skip = (page - 1) * limit;
  const paginated = items.slice(skip, skip + limit);

  return jsonSuccess(
    {
      category,
      items: paginated,
    },
    {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  );
}
