import { NextResponse } from 'next/server';
import { ApiSuccessResponse, ApiErrorResponse, ApiResponseMeta } from './types';

const API_VERSION = '1.0.0';

export function jsonSuccess<T>(
  data: T,
  meta?: Partial<ApiResponseMeta>,
  status = 200,
  headers?: Record<string, string>
) {
  const fullMeta: ApiResponseMeta = {
    timestamp: new Date().toISOString(),
    version: API_VERSION,
    ...meta,
  };

  const payload: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: fullMeta,
  };

  return NextResponse.json(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Knowra-Version': API_VERSION,
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
  });
}

export function jsonError(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
  headers?: Record<string, string>
) {
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Knowra-Version': API_VERSION,
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
  });
}
