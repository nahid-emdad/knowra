import { NextResponse } from 'next/server';
import { OPENAPI_SPEC } from '@/lib/api/openapi';

export async function GET() {
  return NextResponse.json(OPENAPI_SPEC, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
