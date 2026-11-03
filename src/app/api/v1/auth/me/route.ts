import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = getAuthenticatedSession(request);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'No valid active session found.',
        },
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
        expiresAt: session.expiresAt.toISOString(),
      },
    },
  });
}
