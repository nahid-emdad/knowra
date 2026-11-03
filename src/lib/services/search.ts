import { prisma } from '@/lib/db';
import {
  SearchEngine,
  SearchQueryOptions,
  SearchResponse,
  SearchResultItem,
  isBengaliQuery,
} from '@/lib/search/types';
import { VerificationStatus } from '@prisma/client';

export class SearchService implements SearchEngine {
  /**
   * Executes a multilingual search request.
   */
  async search(options: SearchQueryOptions): Promise<SearchResponse> {
    const startTime = performance.now();
    const query = options.query.trim();

    if (!query) {
      return {
        results: [],
        total: 0,
        page: 1,
        limit: options.limit ?? 20,
        totalPages: 0,
        detectedLanguage: 'en',
        executionTimeMs: 0,
      };
    }

    const hasBengali = isBengaliQuery(query);
    const hasLatin = /[a-zA-Z]/.test(query);
    const detectedLanguage: 'en' | 'bn' | 'mixed' =
      hasBengali && hasLatin ? 'mixed' : hasBengali ? 'bn' : 'en';

    const page = Math.max(options.page ?? 1, 1);
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    // Build Prisma query condition
    const where: Record<string, unknown> = {
      status: VerificationStatus.REVIEWED, // Only search reviewed/published articles
    };

    if (options.language && options.language !== 'all') {
      where.language = options.language;
    } else if (detectedLanguage === 'bn') {
      where.language = 'bn';
    }

    if (options.categorySlug) {
      where.category = { slug: options.categorySlug };
    }

    // Attempt database search with Prisma query
    // In PostgreSQL, this queries the title, summary, and content
    const items = await prisma.knowledgeItem.findMany({
      where: {
        ...where,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { sources: true } },
      },
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
    });

    const total = await prisma.knowledgeItem.count({
      where: {
        ...where,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    const results: SearchResultItem[] = items.map((item) => {
      // Calculate relevance score
      const titleLower = item.title.toLowerCase();
      const qLower = query.toLowerCase();
      let relevanceScore = 0;

      if (titleLower === qLower) {
        relevanceScore += 100; // Exact title match
      } else if (titleLower.startsWith(qLower)) {
        relevanceScore += 60; // Title prefix match
      } else if (titleLower.includes(qLower)) {
        relevanceScore += 40; // Title contains query
      } else if (item.summary.toLowerCase().includes(qLower)) {
        relevanceScore += 20; // Summary match
      } else {
        relevanceScore += 10; // Content match
      }

      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        category: item.category,
        language: item.language,
        verificationStatus: item.status,
        sourceCount: item._count.sources,
        lastUpdatedAt: item.updatedAt,
        relevanceScore,
      };
    });

    // Sort by relevance if requested
    if (!options.sortBy || options.sortBy === 'relevance') {
      results.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      detectedLanguage,
      executionTimeMs,
    };
  }

  /**
   * Evaluates search matching in-memory for testing, isolated pipelines, and mock adapters.
   */
  static searchInMemory(
    items: Array<{
      id: string;
      slug: string;
      title: string;
      summary: string;
      content: string;
      language: string;
      category: { name: string; slug: string };
      sourceCount: number;
      updatedAt: Date;
    }>,
    query: string,
    languageFilter?: string
  ): SearchResultItem[] {
    const qLower = query.trim().toLowerCase();
    if (!qLower) return [];

    const matched = items.filter((item) => {
      if (languageFilter && languageFilter !== 'all' && item.language !== languageFilter) {
        return false;
      }

      const inTitle = item.title.toLowerCase().includes(qLower);
      const inSummary = item.summary.toLowerCase().includes(qLower);
      const inContent = item.content.toLowerCase().includes(qLower);

      return inTitle || inSummary || inContent;
    });

    return matched
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        let relevanceScore = 0;

        if (titleLower === qLower) {
          relevanceScore += 100;
        } else if (titleLower.startsWith(qLower)) {
          relevanceScore += 60;
        } else if (titleLower.includes(qLower)) {
          relevanceScore += 40;
        } else if (item.summary.toLowerCase().includes(qLower)) {
          relevanceScore += 20;
        } else {
          relevanceScore += 10;
        }

        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          category: item.category,
          language: item.language,
          verificationStatus: VerificationStatus.REVIEWED,
          sourceCount: item.sourceCount,
          lastUpdatedAt: item.updatedAt,
          relevanceScore,
        };
      })
      .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
  }
}

export const defaultSearchService = new SearchService();
