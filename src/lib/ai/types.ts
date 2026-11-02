/**
 * Knowra AI Provider Architecture Specification
 * Based on PRD Section 6 (AI Integration & Safety Rules)
 * 
 * Strict Principle:
 * AI is an enhancement, not the foundation of trust.
 * Core platform operations MUST function 100% without an active AI provider.
 */

export interface SummarizeOptions {
  content: string;
  language: string;
  maxLength?: number;
}

export interface SummarizeResult {
  summary: string;
  provider: string;
  model: string;
  isAiGenerated: true;
  generatedAt: Date;
}

export interface TranslateOptions {
  content: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslateResult {
  translatedTitle: string;
  translatedContent: string;
  targetLanguage: string;
  provider: string;
  isAiGenerated: true;
  reviewRequired: true;
}

export interface SimplifyOptions {
  content: string;
  targetReadingLevel?: 'elementary' | 'high_school' | 'general';
  language: string;
}

export interface SimplifyResult {
  simplifiedContent: string;
  readingLevel: string;
  provider: string;
}

export interface SuggestTagsOptions {
  title: string;
  content: string;
  language: string;
  maxTags?: number;
}

export interface SuggestTagsResult {
  tags: string[];
  provider: string;
}

export interface AIProvider {
  readonly name: string;
  readonly isAvailable: boolean;

  summarize(options: SummarizeOptions): Promise<SummarizeResult>;
  translate(options: TranslateOptions): Promise<TranslateResult>;
  simplify(options: SimplifyOptions): Promise<SimplifyResult>;
  suggestTags(options: SuggestTagsOptions): Promise<SuggestTagsResult>;
}
