import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || searchParams.get('lang');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let items = INITIAL_KNOWLEDGE_ITEMS;

  if (language && language !== 'all') {
    items = items.filter((i) => i.language === language);
  }
  if (category) {
    items = items.filter((i) => i.category.slug === category);
  }

  const total = items.length;
  const skip = (page - 1) * limit;
  const paginated = items.slice(skip, skip + limit);

  return NextResponse.json({
    success: true,
    data: paginated,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
