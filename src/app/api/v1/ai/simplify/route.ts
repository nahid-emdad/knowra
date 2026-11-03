import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider } from '@/lib/ai';

const simplifySchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  targetReadingLevel: z.enum(['elementary', 'high_school', 'general']).optional().default('general'),
  language: z.enum(['en', 'bn']).optional().default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = simplifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid simplification request payload',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const result = await provider.simplify({
      content: parsed.data.content,
      targetReadingLevel: parsed.data.targetReadingLevel,
      language: parsed.data.language,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...result,
          isAiGenerated: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/v1/ai/simplify] Internal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to simplify content',
        },
      },
      { status: 500 }
    );
  }
}
