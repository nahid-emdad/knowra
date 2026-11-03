import { AIProvider } from './types';
import { defaultAIProvider, MockAIProvider } from './mock';
import { GeminiAIProvider } from './gemini';
import { OpenAIAIProvider } from './openai';

/**
 * Provider Factory
 * Dynamically resolves the active AI provider based on environment variables.
 * Fallback to MockAIProvider is always safe, offline-capable, and deterministic.
 */
export function getAIProvider(providerName?: string): AIProvider {
  const chosen = (providerName || process.env.AI_PROVIDER || 'mock').toLowerCase();

  switch (chosen) {
    case 'gemini': {
      const gemini = new GeminiAIProvider();
      if (!gemini.isAvailable) {
        console.info('[Knowra AI Factory] Gemini API key not found. Using fallback mock provider.');
        return defaultAIProvider;
      }
      return gemini;
    }

    case 'openai': {
      const openai = new OpenAIAIProvider();
      if (!openai.isAvailable) {
        console.info('[Knowra AI Factory] OpenAI API key not found. Using fallback mock provider.');
        return defaultAIProvider;
      }
      return openai;
    }

    case 'mock':
    default:
      return defaultAIProvider;
  }
}

/**
 * Singleton active provider instance for server components and API routes.
 */
export const activeAIProvider = getAIProvider();
