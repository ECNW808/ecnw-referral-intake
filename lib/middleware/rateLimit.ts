import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { rateLimitTracking } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5');

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown';
  return ip;
}

/**
 * Check rate limit for an IP address
 */
export async function checkRateLimit(request: NextRequest): Promise<{ allowed: boolean; remaining: number }> {
  const ip = getClientIp(request);
  const now = new Date();

  try {
    // Get or create rate limit record
    const existing = await db
      .select()
      .from(rateLimitTracking)
      .where(eq(rateLimitTracking.ipAddress, ip))
      .limit(1);

    if (existing.length === 0) {
      // Create new record
      await db.insert(rateLimitTracking).values({
        ipAddress: ip,
        requestCount: 1,
        lastRequest: now,
        windowStart: now,
      });
      return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
    }

    const record = existing[0];
    const windowStart = record.windowStart ? new Date(record.windowStart as any) : now;
    const timeSinceWindowStart = now.getTime() - windowStart.getTime();

    // Reset window if expired
    if (timeSinceWindowStart > RATE_LIMIT_WINDOW_MS) {
      await db
        .update(rateLimitTracking)
        .set({
          requestCount: 1,
          lastRequest: now,
          windowStart: now,
        })
        .where(eq(rateLimitTracking.ipAddress, ip));
      return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
    }

    // Check if limit exceeded
    const requestCount = record.requestCount || 0;
    if (requestCount >= RATE_LIMIT_MAX_REQUESTS) {
      return { allowed: false, remaining: 0 };
    }

    // Increment request count
    await db
      .update(rateLimitTracking)
      .set({
        requestCount: requestCount + 1,
        lastRequest: now,
      })
      .where(eq(rateLimitTracking.ipAddress, ip));

    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - (requestCount + 1) };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request if database error (fail open)
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS };
  }
}

/**
 * Middleware to enforce rate limiting
 */
export async function rateLimitMiddleware(request: NextRequest) {
  const { allowed, remaining } = await checkRateLimit(request);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes in seconds
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  return response;
}
