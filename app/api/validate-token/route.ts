import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { facilities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/utils/token';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Find facility by token hash
    const facility = await db
      .select()
      .from(facilities)
      .where(eq(facilities.isActive, true))
      .limit(1)
      .then(async (results) => {
        for (const f of results) {
          const isValid = await verifyToken(token, f.magicTokenHash);
          if (isValid) return f;
        }
        return null;
      });

    if (!facility) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      facility: {
        id: facility.id,
        name: facility.name,
        email: facility.email,
      },
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
