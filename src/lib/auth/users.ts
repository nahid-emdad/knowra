import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { verifyPassword, hashPassword } from './password';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
  createdAt: Date;
}

// In-memory user registry for testing/fallback with real bcrypt password hashes
// Default passwords for testing:
// admin@knowra.org -> "AdminSecret2026!"
// editor@knowra.org -> "EditorSecret2026!"
const SEED_USERS: AuthenticatedUser[] = [
  {
    id: 'usr_admin_001',
    name: 'Knowra System Administrator',
    email: 'admin@knowra.org',
    role: Role.ADMIN,
    // Pre-computed bcrypt hash of "AdminSecret2026!"
    passwordHash: bcrypt.hashSync('AdminSecret2026!', 10),
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    id: 'usr_editor_001',
    name: 'Bilingual Editorial Reviewer',
    email: 'editor@knowra.org',
    role: Role.EDITOR,
    // Pre-computed bcrypt hash of "EditorSecret2026!"
    passwordHash: bcrypt.hashSync('EditorSecret2026!', 10),
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
  {
    id: 'usr_regular_001',
    name: 'Standard Contributor',
    email: 'user@knowra.org',
    role: Role.USER,
    // Pre-computed bcrypt hash of "UserSecret2026!"
    passwordHash: bcrypt.hashSync('UserSecret2026!', 10),
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
];

let runtimeUserStore: AuthenticatedUser[] = [...SEED_USERS];

export async function findUserByEmail(email: string): Promise<AuthenticatedUser | null> {
  const normalized = email.trim().toLowerCase();
  const user = runtimeUserStore.find((u) => u.email.toLowerCase() === normalized);
  return user || null;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthenticatedUser | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    // Perform dummy verify to mitigate timing attacks against non-existent users
    await verifyPassword('dummy_password', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

/**
 * Secure one-time administrator bootstrap function (PRD & Audit requirement)
 * Allows creating or resetting initial administrator credentials via CLI or controlled env.
 */
export async function bootstrapAdmin(
  email: string,
  password: string,
  name = 'System Administrator'
): Promise<AuthenticatedUser> {
  if (password.length < 12) {
    throw new Error('Admin bootstrap password must be at least 12 characters.');
  }

  const hashedPassword = await hashPassword(password);
  const existing = await findUserByEmail(email);

  if (existing) {
    existing.passwordHash = hashedPassword;
    existing.role = Role.ADMIN;
    return existing;
  }

  const newUser: AuthenticatedUser = {
    id: `usr_${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    role: Role.ADMIN,
    passwordHash: hashedPassword,
    createdAt: new Date(),
  };

  runtimeUserStore.push(newUser);
  return newUser;
}
