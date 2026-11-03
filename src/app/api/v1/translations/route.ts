import { NextRequest } from 'next/server';
import { z } from 'zod';
import { TranslationService } from '@/lib/services/translation';
import { jsonSuccess, jsonError } from '@/lib/api/response';
import { enforceRateLimit } from '@/lib/api/rate-limiter';
import { VerificationStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  const rateLimitError = enforceRateLimit(request);
  if (rateLimitError) return rateLimitError;

  const { searchParams } = new URL(request.url);
  const originalItemId = searchParams.get('originalItemId') || undefined;
  const language = searchParams.get('language') || undefined;
  const statusParam = searchParams.get('status');

  let reviewStatus: VerificationStatus | undefined;
  if (statusParam && Object.values(VerificationStatus).includes(statusParam as VerificationStatus)) {
    reviewStatus = statusParam as VerificationStatus;
  }

  const translations = TranslationService.listTranslations({
    originalItemId,
    language,
    reviewStatus,
  });

  return jsonSuccess(translations, {
    total: translations.length,
  });
}

const translationSchema = z.object({
  originalItemId: z.string().min(1, 'Original article ID is required'),
  language: z.enum(['en', 'bn']),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  translatorName: z.string().min(2, 'Translator name is required'),
  translatorEmail: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  const rateLimitError = enforceRateLimit(request);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await request.json();
    const parsed = translationSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError('VALIDATION_ERROR', 'Invalid translation submission payload', 400, parsed.error.flatten());
    }

    const created = TranslationService.submitTranslation({
      originalItemId: parsed.data.originalItemId,
      language: parsed.data.language,
      title: parsed.data.title,
      summary: parsed.data.summary,
      content: parsed.data.content,
      translatorName: parsed.data.translatorName,
      translatorEmail: parsed.data.translatorEmail,
    });

    return jsonSuccess(created, undefined, 201);
  } catch (err: unknown) {
    return jsonError('TRANSLATION_SUBMISSION_FAILED', String(err), 400);
  }
}
