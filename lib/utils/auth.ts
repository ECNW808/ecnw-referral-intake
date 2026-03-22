import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Hash password for admin login
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateJWT(adminId: number, expiresIn: number = 86400): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      adminId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', process.env.NEXTAUTH_SECRET || 'secret')
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify JWT token
 */
export function verifyJWT(token: string): { adminId: number } | null {
  try {
    const [header, payload, signature] = token.split('.');

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.NEXTAUTH_SECRET || 'secret')
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode and verify payload
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());

    // Check expiration
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return { adminId: decoded.adminId };
  } catch (error) {
    return null;
  }
}

/**
 * Generate random password
 */
export function generatePassword(length: number = 16): string {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}
