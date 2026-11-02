import {
  AIProvider,
  SummarizeOptions,
  SummarizeResult,
  TranslateOptions,
  TranslateResult,
  SimplifyOptions,
  SimplifyResult,
  SuggestTagsOptions,
  SuggestTagsResult,
} from './types';

/**
 * MockAIProvider
 * Default provider when no external AI API key is configured.
 * Returns deterministic, safe fallbacks without external network calls.
 */
export class MockAIProvider implements AIProvider {
  public readonly name = 'mock';
  public readonly isAvailable = true;

  async summarize(options: SummarizeOptions): Promise<SummarizeResult> {
    const preview = options.content
      .replace(/<[^>]*>?/gm, '')
      .slice(0, options.maxLength ?? 180)
      .trim();

    return {
      summary: `${preview}... [Automated extraction placeholder]`,
      provider: this.name,
      model: 'deterministic-extractor-v1',
      isAiGenerated: true,
      generatedAt: new Date(),
    };
  }

  async translate(options: TranslateOptions): Promise<TranslateResult> {
    return {
      translatedTitle: `[${options.targetLanguage.toUpperCase()}] ${options.title}`,
      translatedContent: options.content,
      targetLanguage: options.targetLanguage,
      provider: this.name,
      isAiGenerated: true,
      reviewRequired: true,
    };
  }

  async simplify(options: SimplifyOptions): Promise<SimplifyResult> {
    return {
      simplifiedContent: options.content,
      readingLevel: options.targetReadingLevel ?? 'general',
      provider: this.name,
    };
  }

  async suggestTags(options: SuggestTagsOptions): Promise<SuggestTagsResult> {
    const words = `${options.title} ${options.content}`
      .toLowerCase()
      .replace(/[^\w\s\u0980-\u09FF]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4);

    const uniqueTags = Array.from(new Set(words)).slice(0, options.maxTags ?? 5);

    return {
      tags: uniqueTags,
      provider: this.name,
    };
  }
}

export const defaultAIProvider = new MockAIProvider();
