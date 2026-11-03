import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAIProvider } from '@/lib/ai';

const relatedSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(2, 'Category is required'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  language: z.enum(['en', 'bn']).optional().default('en'),
  limit: z.number().int().positive().max(10).optional().default(3),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = relatedSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid related topic suggestion request payload',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const result = await provider.suggestRelated({
      title: parsed.data.title,
      category: parsed.data.category,
      content: parsed.data.content,
      language: parsed.data.language,
      limit: parsed.data.limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API /api/v1/ai/related] Internal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to suggest related topics',
        },
      },
      { status: 500 }
    );
  }
}
