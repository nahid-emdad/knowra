import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateUser } from '@/lib/auth/users';
import { signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/api/rate-limiter';

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  // Stricter rate limit for login endpoint to prevent brute-force attacks (10 attempts/min)
  const rateLimit = checkRateLimit(request, { maxRequests: 10, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many login attempts. Please wait before trying again.',
        },
      },
      { status: 429, headers: rateLimit.headers }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid login request payload',
            details: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password provided.',
          },
        },
        { status: 401 }
      );
    }

    // Generate cryptographically signed HMAC-SHA256 session token
    const token = signSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );

    // Set secure, HttpOnly, SameSite session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('[API /api/v1/auth/login] Internal error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Authentication processing failed.',
        },
      },
      { status: 500 }
    );
  }
}
