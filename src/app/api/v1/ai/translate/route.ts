import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider } from '@/lib/ai';

const translateSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  sourceLanguage: z.string().default('en'),
  targetLanguage: z.enum(['en', 'bn']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = translateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid translation request payload',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const result = await provider.translate({
      title: parsed.data.title,
      content: parsed.data.content,
      sourceLanguage: parsed.data.sourceLanguage,
      targetLanguage: parsed.data.targetLanguage,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/v1/ai/translate] Internal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate translation draft',
        },
      },
      { status: 500 }
    );
  }
}
