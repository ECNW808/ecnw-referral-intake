import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db/client';
import { adminUsers } from '../../../../lib/db/schema';
import { verifyPassword, generateJWT } from '../../../../lib/utils/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (!admin || admin.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const adminUser = admin[0];

    // Check if active
    if (!adminUser.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, adminUser.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, adminUser.id));

    // Generate JWT
    const token = generateJWT(adminUser.id);

    // Set secure cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
      },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
