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
  SuggestRelatedOptions,
  SuggestRelatedResult,
} from './types';
import { defaultAIProvider } from './mock';

/**
 * GeminiAIProvider
 * Production Google Gemini adapter using the Google Generative Language REST API.
 * Adheres strictly to PRD Section 6 (AI Safety, Source Preservation & Non-Hallucination).
 */
export class GeminiAIProvider implements AIProvider {
  public readonly name = 'gemini';
  private readonly apiKey: string | undefined;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(apiKey?: string, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || model;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  public get isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private async callGemini(prompt: string, maxTokens = 1000): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2, // Low temperature for high factual adherence
        maxOutputTokens: maxTokens,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error [${response.status}]: ${errText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response from Gemini model');
    }

    return candidateText.trim();
  }

  async summarize(options: SummarizeOptions): Promise<SummarizeResult> {
    try {
      if (!this.isAvailable) {
        return defaultAIProvider.summarize(options);
      }

      const prompt = `You are an objective, source-grounded scientific summarizer for Knowra, an open-source knowledge platform.
Strict Epistemic Rules (PRD Section 6.3):
1. Rely EXCLUSIVELY on the provided content. DO NOT fabricate, hallucinate, or assume outside facts.
2. DO NOT invent citations, URLs, or academic sources.
3. Keep the summary concise, objective, and maximum ${options.maxLength ?? 250} words.
4. Output in ${options.language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.

Content to summarize:
${options.content}

Summary:`;

      const summaryText = await this.callGemini(prompt, 600);

      return {
        summary: summaryText,
        provider: this.name,
        model: this.model,
        isAiGenerated: true,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.warn('[Knowra AI] Gemini summarize failed, falling back to Mock:', error);
      return defaultAIProvider.summarize(options);
    }
  }

  async translate(options: TranslateOptions): Promise<TranslateResult> {
    try {
      if (!this.isAvailable) {
        return defaultAIProvider.translate(options);
      }

      const isToBengali = options.targetLanguage === 'bn';
      const prompt = `You are a professional multilingual translator for Knowra knowledge platform.
Translate the following academic / educational knowledge item from ${options.sourceLanguage} to ${isToBengali ? 'Bengali (বাংলা - accurate standard terminology)' : 'English'}.
Strict Epistemic Rules:
1. Maintain factual accuracy, scientific formulas, and specialized terminology.
2. DO NOT change or invent any citations or sources.
3. Format output strictly as JSON with two fields: "translatedTitle" and "translatedContent".

Title: ${options.title}
Content:
${options.content}

Respond ONLY with valid JSON.`;

      const responseText = await this.callGemini(prompt, 2000);
      let translatedTitle = options.title;
      let translatedContent = options.content;

      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        translatedTitle = parsed.translatedTitle || options.title;
        translatedContent = parsed.translatedContent || responseText;
      } catch {
        translatedContent = responseText;
      }

      return {
        translatedTitle,
        translatedContent,
        targetLanguage: options.targetLanguage,
        provider: this.name,
        isAiGenerated: true,
        reviewRequired: true,
      };
    } catch (error) {
      console.warn('[Knowra AI] Gemini translate failed, falling back to Mock:', error);
      return defaultAIProvider.translate(options);
    }
  }

  async simplify(options: SimplifyOptions): Promise<SimplifyResult> {
    try {
      if (!this.isAvailable) {
        return defaultAIProvider.simplify(options);
      }

      const level = options.targetReadingLevel ?? 'general';
      const levelPrompt =
        level === 'elementary'
          ? 'for an 8-12 year old student using simple analogies and everyday vocabulary'
          : level === 'high_school'
          ? 'for a high school student with clear foundational explanations'
          : 'for general public readership without dense academic jargon';

      const prompt = `You are an educational educator for Knowra.
Explain and simplify the following text ${levelPrompt}.
Language: ${options.language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
Preserve absolute factual accuracy. DO NOT invent fake facts.

Text:
${options.content}

Simplified Explanation:`;

      const simplified = await this.callGemini(prompt, 1000);

      return {
        simplifiedContent: simplified,
        readingLevel: level,
        provider: this.name,
      };
    } catch (error) {
      console.warn('[Knowra AI] Gemini simplify failed, falling back to Mock:', error);
      return defaultAIProvider.simplify(options);
    }
  }

  async suggestTags(options: SuggestTagsOptions): Promise<SuggestTagsResult> {
    try {
      if (!this.isAvailable) {
        return defaultAIProvider.suggestTags(options);
      }

      const prompt = `Generate up to ${options.maxTags ?? 6} relevant topic tags for this knowledge article.
Language: ${options.language === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
Respond ONLY with a comma-separated list of tags, nothing else.

Title: ${options.title}
Content snippet: ${options.content.slice(0, 500)}`;

      const tagsText = await this.callGemini(prompt, 150);
      const tags = tagsText
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 1);

      return {
        tags: tags.length > 0 ? tags : ['knowledge', 'science'],
        provider: this.name,
      };
    } catch (error) {
      console.warn('[Knowra AI] Gemini suggestTags failed, falling back to Mock:', error);
      return defaultAIProvider.suggestTags(options);
    }
  }

  async suggestRelated(options: SuggestRelatedOptions): Promise<SuggestRelatedResult> {
    try {
      if (!this.isAvailable) {
        return defaultAIProvider.suggestRelated(options);
      }

      const isBn = options.language === 'bn';
      const prompt = `Suggest ${options.limit ?? 3} related multidisciplinary knowledge topics that a researcher or student studying "${options.title}" in category "${options.category}" should investigate.
Language: ${isBn ? 'Bengali (বাংলা)' : 'English'}.
Format strictly as JSON array of objects: [{"title": "...", "reason": "..."}].
Respond ONLY with valid JSON.`;

      const res = await this.callGemini(prompt, 500);
      const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        suggestedTopics: Array.isArray(parsed) ? parsed : [],
        provider: this.name,
      };
    } catch (error) {
      console.warn('[Knowra AI] Gemini suggestRelated failed, falling back to Mock:', error);
      return defaultAIProvider.suggestRelated(options);
    }
  }
}
