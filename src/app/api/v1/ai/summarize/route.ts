import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider } from '@/lib/ai';

const summarizeSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  language: z.enum(['en', 'bn']).optional().default('en'),
  maxLength: z.number().int().positive().max(1000).optional().default(250),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = summarizeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid summarization request payload',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const result = await provider.summarize({
      content: parsed.data.content,
      language: parsed.data.language,
      maxLength: parsed.data.maxLength,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/v1/ai/summarize] Internal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate summary',
        },
      },
      { status: 500 }
    );
  }
}
