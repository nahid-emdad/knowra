import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@prisma/client';

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: Role;
  expiresAt: Date;
}

// Built-in Demo Credentials for initial MVP development
export const DEMO_ADMIN: AuthSession = {
  userId: 'usr_admin',
  name: 'Knowra Editorial Board',
  email: 'admin@knowra.org',
  role: Role.ADMIN,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
};

export const DEMO_EDITOR: AuthSession = {
  userId: 'usr_editor',
  name: 'Bilingual Reviewer',
  email: 'editor@knowra.org',
  role: Role.EDITOR,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

const SESSION_COOKIE_NAME = 'knowra_session';

/**
 * Extracts and verifies server-side session from request cookies or headers.
 * PRD Section 4.5 & 11: Admin operations must be protected server-side.
 */
export function getAuthenticatedSession(request: NextRequest): AuthSession | null {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    if (token === 'admin_token' || token === 'demo_admin_secret') {
      return DEMO_ADMIN;
    }
    if (token === 'editor_token' || token === 'demo_editor_secret') {
      return DEMO_EDITOR;
    }
  }

  // 2. Check knowra_session cookie
  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookie) {
    if (cookie === 'admin_session') return DEMO_ADMIN;
    if (cookie === 'editor_session') return DEMO_EDITOR;
  }

  // 3. Check development admin secret header
  const adminSecret = request.headers.get('x-admin-key');
  if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
    return DEMO_ADMIN;
  }

  return null;
}

/**
 * Server-side authorization gate.
 * Rejects requests if user is unauthenticated or lacks the required role.
 */
export function requireRole(
  request: NextRequest,
  requiredRole: Role = Role.EDITOR
): { session: AuthSession } | { errorResponse: NextResponse } {
  const session = getAuthenticatedSession(request);

  if (!session) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required. Server-side session verification failed.',
          },
        },
        { status: 401 }
      ),
    };
  }

  const roleHierarchy: Record<Role, number> = {
    [Role.ADMIN]: 4,
    [Role.EDITOR]: 3,
    [Role.CONTRIBUTOR]: 2,
    [Role.USER]: 1,
  };

  if (roleHierarchy[session.role] < roleHierarchy[requiredRole]) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Insufficient permissions. Role '${requiredRole}' required, but user has '${session.role}'.`,
          },
        },
        { status: 403 }
      ),
    };
  }

  return { session };
}
