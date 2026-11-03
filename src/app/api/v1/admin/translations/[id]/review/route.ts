import { NextRequest } from 'next/server';
import { z } from 'zod';
import { TranslationService } from '@/lib/services/translation';
import { jsonSuccess, jsonError } from '@/lib/api/response';

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
        id: 'usr_admin_01',
        name: 'Nahid Emdad (Admin Reviewer)',
      },
      parsed.data.notes
    );

    return jsonSuccess(updated);
  } catch (err: unknown) {
    return jsonError('TRANSLATION_REVIEW_FAILED', String(err), 400);
  }
}
