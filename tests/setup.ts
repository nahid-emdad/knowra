import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  (process.env as Record<string, string | undefined>).NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test_user:test_pass@localhost:5432/knowra_test?schema=public';
  process.env.AI_PROVIDER = 'mock';
});

afterAll(() => {
  // Global test teardown
});
