import { NextResponse } from 'next/server';
import { INITIAL_KNOWLEDGE_ITEMS, INITIAL_CATEGORIES } from '@/lib/data/initial-data';

const START_TIME = Date.now();

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);

  return NextResponse.json(
    {
      status: 'healthy',
      service: 'knowra-knowledge-platform',
      version: '1.0.0',
      license: 'Apache-2.0',
      uptime: `${uptimeSeconds}s`,
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'production',
        multilingualEngine: {
          bengaliUnicodeSupport: true,
          englishStemming: true,
        },
        corpus: {
          knowledgeArticles: INITIAL_KNOWLEDGE_ITEMS.length,
          categories: INITIAL_CATEGORIES.length,
        },
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
