import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_KNOWLEDGE_ITEMS } from '@/lib/data/initial-data';

interface RouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { slug } = await params;
  const item = INITIAL_KNOWLEDGE_ITEMS.find((k) => k.slug === slug || k.id === slug);

  if (!item) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Knowledge item with slug or ID '${slug}' was not found.`,
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: item,
  });
}
