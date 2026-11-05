import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json(
    {
      success: true,
      message: 'Successfully logged out.',
    },
    { status: 200 }
  );

  // Invalidate cookie by setting maxAge to 0
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
