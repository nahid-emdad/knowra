import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from './response';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  headers: Record<string, string>;
}

export function checkRateLimit(
  req: NextRequest,
  options: { maxRequests?: number; windowMs?: number } = {}
): RateLimitResult {
  // In test environment, bypass rate limiting
  if (process.env.NODE_ENV === 'test' && !req.headers.get('x-force-test-ratelimit')) {
    return {
      allowed: true,
      limit: 1000,
      remaining: 999,
      reset: Math.floor((Date.now() + 60000) / 1000),
      headers: {
        'X-RateLimit-Limit': '1000',
        'X-RateLimit-Remaining': '999',
        'X-RateLimit-Reset': Math.floor((Date.now() + 60000) / 1000).toString(),
      },
    };
  }

  const apiKey = req.headers.get('x-knowra-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const clientKey = apiKey ? `key:${apiKey}` : `ip:${ip}`;
  
  // Authenticated API keys get 120 req/min, anonymous get 60 req/min
  const defaultLimit = apiKey ? 120 : 60;
  const maxRequests = options.maxRequests ?? defaultLimit;
  const windowMs = options.windowMs ?? 60 * 1000; // 1 minute

  const now = Date.now();
  let record = rateLimitStore.get(clientKey);

  if (!record || now > record.resetAt) {
    record = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(clientKey, record);
  } else {
    record.count += 1;
  }

  const remaining = Math.max(0, maxRequests - record.count);
  const resetSeconds = Math.ceil(record.resetAt / 1000);
  const allowed = record.count <= maxRequests;

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetSeconds.toString(),
  };

  return {
    allowed,
    limit: maxRequests,
    remaining,
    reset: resetSeconds,
    headers,
  };
}

export function enforceRateLimit(req: NextRequest) {
  const result = checkRateLimit(req);
  if (!result.allowed) {
    return jsonError(
      'RATE_LIMIT_EXCEEDED',
      `Rate limit exceeded. Maximum ${result.limit} requests per minute allowed.`,
      429,
      {
        limit: result.limit,
        resetInSeconds: Math.max(1, result.reset - Math.floor(Date.now() / 1000)),
      },
      {
        ...result.headers,
        'Retry-After': Math.max(1, result.reset - Math.floor(Date.now() / 1000)).toString(),
      }
    );
  }
  return null;
}
