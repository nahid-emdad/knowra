/**
 * Knowra OpenAPI 3.1.0 Specification Definition
 * PRD Module B: Developer API Specifications
 */

export const OPENAPI_SPEC = {
  openapi: '3.1.0',
  info: {
    title: 'Knowra Public Knowledge API',
    version: '1.0.0',
    description:
      'Open-source, source-backed multilingual knowledge infrastructure API. Query structured knowledge items, categories, and primary source citations across English and Bengali without vendor lock-in.',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
    contact: {
      name: 'Knowra Core Engineering',
      url: 'https://github.com/nahid-emdad/knowra',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Default Production API v1',
    },
  ],
  tags: [
    { name: 'Knowledge', description: 'Retrieve and search peer-reviewed knowledge entries' },
    { name: 'Search', description: 'Multilingual full-text and trigram search engine' },
    { name: 'Categories', description: 'Academic discipline and category taxonomies' },
    { name: 'Sources', description: 'Verified primary source registry and citations' },
    { name: 'Community', description: 'Submit drafts and suggestions for editorial review' },
    { name: 'AI Services', description: 'Decoupled AI summarization, translation & simplification' },
  ],
  paths: {
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Search verified knowledge items',
        description:
          'Performs multilingual search with support for Bengali Unicode script and English tokenization. Works 100% without external AI dependencies.',
        parameters: [
          {
            name: 'q',
            in: 'query',
            description: 'Search query string (e.g. "Photosynthesis" or "সালোকসংশ্লেষণ")',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'language',
            in: 'query',
            description: 'Language filter (en, bn, or all)',
            required: false,
            schema: { type: 'string', enum: ['en', 'bn', 'all'], default: 'all' },
          },
          {
            name: 'category',
            in: 'query',
            description: 'Filter by category slug (e.g. "science", "technology")',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'sort',
            in: 'query',
            description: 'Sort order for results',
            required: false,
            schema: { type: 'string', enum: ['relevance', 'recent', 'title'], default: 'relevance' },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Pagination page number',
            required: false,
            schema: { type: 'integer', default: 1, minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Results per page (max 100)',
            required: false,
            schema: { type: 'integer', default: 20, maximum: 100 },
          },
        ],
        responses: {
          '200': {
            description: 'Successful search results array with pagination metadata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/KnowledgeItemSummary' },
                    },
                    meta: { $ref: '#/components/schemas/SearchMeta' },
                  },
                },
              },
            },
          },
          '429': { $ref: '#/components/responses/RateLimitExceeded' },
        },
      },
    },
    '/knowledge': {
      get: {
        tags: ['Knowledge'],
        summary: 'List verified knowledge entries',
        description: 'Returns a paginated list of published knowledge entries.',
        parameters: [
          {
            name: 'language',
            in: 'query',
            schema: { type: 'string', enum: ['en', 'bn', 'all'] },
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 20 },
          },
        ],
        responses: {
          '200': {
            description: 'Paginated knowledge entries list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/KnowledgeItem' },
                    },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/knowledge/{slug}': {
      get: {
        tags: ['Knowledge'],
        summary: 'Retrieve single knowledge article by slug or ID',
        description:
          'Retrieves canonical article content, primary verified citations, revision number, translations, and AI executive summaries.',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Unique article slug (e.g. "photosynthesis-process") or ID',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Knowledge entry record with sources and metadata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/KnowledgeItemDetail' },
                  },
                },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List structured knowledge categories',
        description: 'Returns all knowledge domains with item counts and descriptions.',
        responses: {
          '200': {
            description: 'Array of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/categories/{slug}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category details and articles',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Category record with related knowledge entries',
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/sources': {
      get: {
        tags: ['Sources'],
        summary: 'List verified primary sources registry',
        description:
          'Returns authoritative sources (Nature, NASA, Banglapedia, UNESCO) cited across the knowledge base.',
        responses: {
          '200': {
            description: 'Verified sources registry',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Source' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/submissions': {
      post: {
        tags: ['Community'],
        summary: 'Submit knowledge article or correction for editorial review',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SubmissionInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Submission queued successfully with PENDING_REVIEW status',
          },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/ai/summarize': {
      post: {
        tags: ['AI Services'],
        summary: 'Generate source-grounded executive summary',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string' },
                  language: { type: 'string', enum: ['en', 'bn'], default: 'en' },
                  maxLength: { type: 'integer', default: 250 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'AI-generated summary marked with isAiGenerated: true',
          },
        },
      },
    },
    '/ai/translate': {
      post: {
        tags: ['AI Services'],
        summary: 'Generate translation draft between English and Bengali',
        description: 'Output is marked with reviewRequired: true per PRD Section 6.3.',
        responses: {
          '200': { description: 'Translation draft' },
        },
      },
    },
    '/ai/simplify': {
      post: {
        tags: ['AI Services'],
        summary: 'Simplify content for elementary, high school, or general levels',
        responses: {
          '200': { description: 'Simplified pedagogical explanation' },
        },
      },
    },
    '/ai/tags': {
      post: {
        tags: ['AI Services'],
        summary: 'Suggest relevant topic tags from text',
        responses: {
          '200': { description: 'List of suggested topic tags' },
        },
      },
    },
    '/ai/related': {
      post: {
        tags: ['AI Services'],
        summary: 'Suggest related multidisciplinary knowledge topics',
        responses: {
          '200': { description: 'Multidisciplinary related topic suggestions' },
        },
      },
    },
  },
  components: {
    schemas: {
      KnowledgeItemSummary: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          language: { type: 'string', enum: ['en', 'bn'] },
          category: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              slug: { type: 'string' },
            },
          },
          sourceCount: { type: 'integer' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      KnowledgeItem: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          content: { type: 'string' },
          language: { type: 'string' },
          category: { type: 'object' },
          tags: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['DRAFT', 'PENDING_REVIEW', 'REVIEWED', 'NEEDS_CORRECTION', 'ARCHIVED'] },
          revisionNumber: { type: 'integer' },
          updatedAt: { type: 'string' },
        },
      },
      KnowledgeItemDetail: {
        allOf: [
          { $ref: '#/components/schemas/KnowledgeItem' },
          {
            type: 'object',
            properties: {
              sources: {
                type: 'array',
                items: { $ref: '#/components/schemas/Source' },
              },
              translations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    slug: { type: 'string' },
                    language: { type: 'string' },
                    title: { type: 'string' },
                  },
                },
              },
              author: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
              aiSummary: { type: 'string', nullable: true },
            },
          },
        ],
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          itemCount: { type: 'integer' },
        },
      },
      Source: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          title: { type: 'string' },
          publisher: { type: 'string' },
          author: { type: 'string', nullable: true },
          sourceType: {
            type: 'string',
            enum: ['GOVERNMENT', 'ACADEMIC', 'RESEARCH_PAPER', 'EDUCATIONAL_INSTITUTION', 'OFFICIAL_DOCUMENTATION', 'BOOK', 'REPUTABLE_PUBLICATION'],
          },
          publicationDate: { type: 'string', nullable: true },
          accessDate: { type: 'string' },
          license: { type: 'string' },
        },
      },
      SubmissionInput: {
        type: 'object',
        required: ['title', 'summary', 'content', 'language', 'categorySlug', 'sourceUrl', 'sourceTitle', 'sourcePublisher'],
        properties: {
          title: { type: 'string', minLength: 3 },
          summary: { type: 'string', minLength: 10 },
          content: { type: 'string', minLength: 20 },
          language: { type: 'string', enum: ['en', 'bn'] },
          categorySlug: { type: 'string' },
          sourceUrl: { type: 'string', format: 'uri' },
          sourceTitle: { type: 'string' },
          sourcePublisher: { type: 'string' },
          supportingNote: { type: 'string' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
          timestamp: { type: 'string', format: 'date-time' },
          version: { type: 'string' },
        },
      },
      SearchMeta: {
        allOf: [
          { $ref: '#/components/schemas/PaginationMeta' },
          {
            type: 'object',
            properties: {
              query: { type: 'string' },
              detectedLanguage: { type: 'string' },
              sort: { type: 'string' },
            },
          },
        ],
      },
    },
    responses: {
      RateLimitExceeded: {
        description: 'Rate limit exceeded (HTTP 429)',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'RATE_LIMIT_EXCEEDED' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      NotFound: {
        description: 'Resource not found (HTTP 404)',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', example: 'NOT_FOUND' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Invalid input parameters or body payload (HTTP 400)',
      },
    },
  },
};
