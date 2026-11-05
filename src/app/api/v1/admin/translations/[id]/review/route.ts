import { NextRequest } from 'next/server';
import { z } from 'zod';
import { TranslationService } from '@/lib/services/translation';
import { jsonSuccess, jsonError } from '@/lib/api/response';
import { requireRole } from '@/lib/auth';
import { Role } from '@prisma/client';

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

const reviewSchema = z.object({
  action: z.enum(['APPROVE', 'REQUEST_CORRECTIONS', 'REJECT']),
  notes: z.string().optional(),
});

export async function PUT(request: NextRequest, { params }: RouteProps) {
  // PRD Section 4.5 & K-AUDIT-001: Enforce server-side role check
  const auth = requireRole(request, Role.EDITOR);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError('VALIDATION_ERROR', 'Invalid review payload', 400, parsed.error.flatten());
    }

    const updated = TranslationService.reviewTranslation(
      id,
      parsed.data.action,
      {
        id: auth.session.userId,
        name: auth.session.name,
      },
      parsed.data.notes
    );

    return jsonSuccess(updated);
  } catch (err: unknown) {
    return jsonError('TRANSLATION_REVIEW_FAILED', String(err), 400);
  }
}
