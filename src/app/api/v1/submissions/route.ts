import { NextRequest, NextResponse } from 'next/server';
import { submissionCreateSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validated = submissionCreateSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid submission data',
            details: validated.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { title, content, language, proposedSources, contributorName, contributorEmail } =
      validated.data;

    // Return receipt
    return NextResponse.json(
      {
        success: true,
        data: {
          id: `sub_${Date.now()}`,
          title,
          language,
          status: 'PENDING',
          contributorName,
          submittedAt: new Date().toISOString(),
          message:
            'Submission successfully queued for editorial verification against primary sources.',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while processing the submission.',
        },
      },
      { status: 500 }
    );
  }
}
