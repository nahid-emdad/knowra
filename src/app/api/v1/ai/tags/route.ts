import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider } from '@/lib/ai';

const tagsSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  language: z.enum(['en', 'bn']).optional().default('en'),
  maxTags: z.number().int().positive().max(20).optional().default(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = tagsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid tag suggestion request payload',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const result = await provider.suggestTags({
      title: parsed.data.title,
      content: parsed.data.content,
      language: parsed.data.language,
      maxTags: parsed.data.maxTags,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/v1/ai/tags] Internal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to suggest tags',
        },
      },
      { status: 500 }
    );
  }
}
