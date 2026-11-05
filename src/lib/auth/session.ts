import crypto from 'crypto';
import { Role } from '@prisma/client';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  iat: number; // Issued at timestamp in seconds
  exp: number; // Expires at timestamp in seconds
}

export const SESSION_COOKIE_NAME = 'knowra_session';
export const DEFAULT_SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Retrieves the cryptographic secret used to sign session cookies.
 * In production, AUTH_SECRET or JWT_SECRET MUST be set in environment variables.
 */
function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: AUTH_SECRET must be defined in production environment.');
    }
    // Fallback secret for local development/testing only
    return 'knowra_dev_fallback_secret_must_override_in_production_32bytes!';
  }
  return secret;
}

/**
 * Base64URL encoder helper
 */
function toBase64Url(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64url');
}

/**
 * Base64URL decoder helper
 */
function fromBase64Url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf-8');
}

/**
 * Computes constant-time HMAC-SHA256 signature for session data.
 */
function computeSignature(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

/**
 * Signs a session payload into a tamper-proof session token.
 */
export function signSessionToken(
  user: { id: string; email: string; name: string; role: Role },
  durationSeconds: number = DEFAULT_SESSION_DURATION_SECONDS
): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + durationSeconds,
  };

  const secret = getAuthSecret();
  const serialized = JSON.stringify(payload);
  const encodedPayload = toBase64Url(serialized);
  const signature = computeSignature(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a session token's cryptographic integrity and expiration.
 * Uses timingSafeEqual to prevent timing attacks.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) return null;

  try {
    const secret = getAuthSecret();
    const expectedSignature = computeSignature(encodedPayload, secret);

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expectedBuf.length) {
      return null;
    }

    // Constant-time signature verification prevents timing side-channels
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payloadJson = fromBase64Url(encodedPayload);
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Validate expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    // Validate required fields
    if (!payload.userId || !payload.email || !payload.role) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
