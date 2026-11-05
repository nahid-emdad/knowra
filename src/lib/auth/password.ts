import bcrypt from 'bcryptjs';

const SALT_ROUNDS = process.env.NODE_ENV === 'test' ? 6 : 12;

/**
 * Hashes a plaintext password using bcrypt with appropriate work factor.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash.
 * Constant-time comparison prevents timing attacks.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
