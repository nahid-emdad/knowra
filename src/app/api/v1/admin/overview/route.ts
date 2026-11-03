import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { INITIAL_KNOWLEDGE_ITEMS, INITIAL_CATEGORIES, INITIAL_SOURCES } from '@/lib/data/initial-data';
import { INITIAL_SUBMISSIONS, INITIAL_REVISIONS } from '@/lib/data/admin-state';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  // PRD 4.5 & 11: Server-side authorization check
  const auth = requireRole(request, Role.EDITOR);
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        totalArticles: INITIAL_KNOWLEDGE_ITEMS.length,
        pendingSubmissions: INITIAL_SUBMISSIONS.filter((s) => s.status === 'PENDING').length,
        totalSources: Object.keys(INITIAL_SOURCES).length,
        totalCategories: INITIAL_CATEGORIES.length,
        totalRevisions: INITIAL_REVISIONS.length,
      },
      currentSession: {
        user: auth.session.name,
        role: auth.session.role,
      },
    },
  });
}
