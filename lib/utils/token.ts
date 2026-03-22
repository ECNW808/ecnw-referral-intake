import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a cryptographically secure random token
 * Returns a URL-safe base64 encoded string
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * Hash a token using bcrypt
 */
export async function hashToken(token: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(token, saltRounds);
}

/**
 * Verify a token against its hash
 */
export async function verifyToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Create a magic link URL
 */
export function createMagicLink(baseUrl: string, token: string): string {
  const url = new URL(`/referral/${token}`, baseUrl);
  return url.toString();
}

/**
 * Extract token from URL
 */
export function extractTokenFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/');
    const token = parts[parts.length - 1];
    return token || null;
  } catch {
    return null;
  }
}

/**
 * Generate a secure random string for CSRF tokens
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash CSRF token
 */
export async function hashCsrfToken(token: string): Promise<string> {
  return crypto.createHash('sha256').update(token).digest('hex');
}
