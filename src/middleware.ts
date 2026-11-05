import { NextResponse, type NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { Role } from '@prisma/client';

/**
 * Knowra Cryptographic Security Middleware
 * Enforces PRD Section 4.5 & K-AUDIT-001:
 * Cryptographically verifies session token signature and expiration server-side.
 * Rejects forged, expired, or non-privileged cookies before reaching protected admin routes.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    // Cryptographic token verification (HMAC-SHA256 signature + expiration check)
    const verified = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null;

    // Check if session is valid and user has at least EDITOR role
    if (!verified || (verified.role !== Role.ADMIN && verified.role !== Role.EDITOR)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);

      const response = NextResponse.redirect(loginUrl);
      // Clean up invalid or forged cookie
      if (sessionCookie) {
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }
  }

  // Handle CORS preflight requests for API
  if (request.method === 'OPTIONS' && pathname.startsWith('/api')) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Knowra-Key',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
