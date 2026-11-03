import { jsonSuccess } from '@/lib/api/response';

export async function GET() {
  return jsonSuccess({
    name: 'Knowra Public Knowledge API',
    tagline: 'Knowledge Without Boundaries — Multilingual Knowledge Infrastructure',
    version: '1.0.0',
    license: 'Apache-2.0',
    documentationUrl: '/docs',
    openApiSpecUrl: '/api/v1/openapi.json',
    status: 'healthy',
    endpoints: {
      search: 'GET /api/v1/search?q={query}&language={en|bn}&category={slug}',
      knowledge: 'GET /api/v1/knowledge?page={page}&limit={limit}',
      knowledgeItem: 'GET /api/v1/knowledge/{slug}',
      categories: 'GET /api/v1/categories',
      categoryItem: 'GET /api/v1/categories/{slug}',
      sources: 'GET /api/v1/sources',
      submissions: 'POST /api/v1/submissions',
      aiSummarize: 'POST /api/v1/ai/summarize',
      aiTranslate: 'POST /api/v1/ai/translate',
      aiSimplify: 'POST /api/v1/ai/simplify',
      aiTags: 'POST /api/v1/ai/tags',
      aiRelated: 'POST /api/v1/ai/related',
    },
  });
}
