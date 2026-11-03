import { NextRequest } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/data/initial-data';
import { jsonSuccess } from '@/lib/api/response';
import { enforceRateLimit } from '@/lib/api/rate-limiter';

export async function GET(request: NextRequest) {
  const rateLimitError = enforceRateLimit(request);
  if (rateLimitError) return rateLimitError;

  return jsonSuccess(INITIAL_CATEGORIES, {
    total: INITIAL_CATEGORIES.length,
  });
}
