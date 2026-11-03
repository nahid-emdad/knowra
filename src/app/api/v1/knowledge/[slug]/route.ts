import { NextRequest } from 'next/server';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';
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
  const item = INITIAL_KNOWLEDGE_ITEMS.find((k) => k.slug === slug || k.id === slug);

  if (!item) {
    return jsonError(
      'NOT_FOUND',
      `Knowledge item with slug or ID '${slug}' was not found.`,
      404
    );
  }

  return jsonSuccess(item);
}
