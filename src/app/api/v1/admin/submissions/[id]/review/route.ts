import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { reviewCreateSchema } from '@/lib/validations';
import { Role } from '@prisma/client';

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  // PRD Section 4.5 & 11: Server-side authorization check
  const auth = requireRole(request, Role.EDITOR);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const json = await request.json().catch(() => ({}));

  const validation = reviewCreateSchema.safeParse({
    submissionId: id,
    reviewerId: auth.session.userId,
    decision: json.decision,
    feedback: json.feedback,
  });

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid review payload',
          details: validation.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      submissionId: id,
      decision: validation.data.decision,
      reviewerId: auth.session.userId,
      reviewerName: auth.session.name,
      feedback: validation.data.feedback,
      reviewedAt: new Date().toISOString(),
      message: `Submission ${validation.data.decision.toLowerCase()} successfully recorded.`,
    },
  });
}
