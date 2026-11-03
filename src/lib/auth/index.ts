import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { verifySessionToken, SESSION_COOKIE_NAME } from './session';

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: Role;
  expiresAt: Date;
}

/**
 * Extracts and cryptographically verifies server-side session from request cookies or headers.
 * PRD Section 4.5 & 11: Admin operations must be protected server-side.
 * Strictly verifies HMAC-SHA256 signature and expiration timestamp.
 */
export function getAuthenticatedSession(request: NextRequest): AuthSession | null {
  let token: string | undefined;

  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '').trim();
  }

  // 2. Check knowra_session cookie if no header token
  if (!token) {
    token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  // Verify cryptographic signature and expiration
  const verified = verifySessionToken(token);
  if (!verified) {
    return null;
  }

  return {
    userId: verified.userId,
    name: verified.name,
    email: verified.email,
    role: verified.role,
    expiresAt: new Date(verified.exp * 1000),
  };
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
            message: 'Authentication required. Server-side session verification failed or token is invalid.',
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

export * from './password';
export * from './session';
export * from './users';
