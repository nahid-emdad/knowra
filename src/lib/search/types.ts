/**
 * Knowra Search Engine Type Definitions & Abstractions
 * Supports language-aware routing between English tsvector and Bengali Trigram/Simple strategies.
 */

export interface SearchQueryOptions {
  query: string;
  language?: string; // 'en' | 'bn' | 'all'
  categorySlug?: string;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'updated_at' | 'created_at';
}

export interface SearchResultItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: {
    name: string;
    slug: string;
  };
  language: string;
  verificationStatus: string;
  sourceCount: number;
  lastUpdatedAt: Date;
  relevanceScore?: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  detectedLanguage: 'en' | 'bn' | 'mixed';
  executionTimeMs: number;
}

export interface SearchEngine {
  search(options: SearchQueryOptions): Promise<SearchResponse>;
}

/**
 * Detects if a search query contains Bengali Unicode characters (\u0980-\u09FF)
 */
export function isBengaliQuery(query: string): boolean {
  const bengaliRegex = /[\u0980-\u09FF]/;
  return bengaliRegex.test(query);
}
