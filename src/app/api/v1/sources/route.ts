import { NextRequest } from 'next/server';
import { INITIAL_SOURCES } from '@/lib/data/initial-data';
import { jsonSuccess } from '@/lib/api/response';
import { enforceRateLimit } from '@/lib/api/rate-limiter';

export async function GET(request: NextRequest) {
  const rateLimitError = enforceRateLimit(request);
  if (rateLimitError) return rateLimitError;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const q = searchParams.get('q')?.toLowerCase();

  let sources = Object.values(INITIAL_SOURCES);

  if (type) {
    sources = sources.filter((s) => s.sourceType.toLowerCase() === type.toLowerCase());
  }

  if (q) {
    sources = sources.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.publisher.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q)
    );
  }

  return jsonSuccess(sources, {
    total: sources.length,
  });
}
