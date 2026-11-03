import { NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/data/initial-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_CATEGORIES,
    meta: {
      total: INITIAL_CATEGORIES.length,
    },
  });
}
