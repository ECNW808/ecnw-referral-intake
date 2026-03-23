import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db/client';
import { referrals, facilities, auditLogs } from '../../../../lib/db/schema';
import { verifyJWT } from '../../../../lib/utils/auth';
import { eq, desc, inArray } from 'drizzle-orm';

/**
 * Get all referrals (requires admin authentication)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const verified = verifyJWT(token);
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const facilityId = searchParams.get('facilityId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = db.select().from(referrals) as any;

    if (status) {
      query = query.where(eq(referrals.status, status));
    }

    if (facilityId) {
      query = query.where(eq(referrals.facilityId, parseInt(facilityId)));
    }

    // Get total count
    const countResult = await db.select().from(referrals);
    const total = countResult.length;

    // Get paginated results
    const results = await query
      .orderBy(desc(referrals.createdAt))
      .limit(limit)
      .offset(offset);

    // Get facility names
    const facilityIds = [...new Set(results.map((r: any) => r.facilityId))] as number[];
    const facilitiesData = facilityIds.length > 0 
      ? await db
          .select()
          .from(facilities)
          .where(inArray(facilities.id, facilityIds))
      : [];

    const facilitiesMap = new Map(facilitiesData.map((f: any) => [f.id, f.name]));

    // Format response
    const formattedResults = (results as any[]).map((r: any) => ({
      ...r,
      facilityName: facilitiesMap.get(r.facilityId) || 'Unknown',
    }));

    return NextResponse.json({
      success: true,
      data: formattedResults,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get referrals error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update referral status
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const verified = verifyJWT(token);
    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { referralId, status, internalNotes } = await request.json();

    if (!referralId || !status) {
      return NextResponse.json(
        { error: 'Referral ID and status required' },
        { status: 400 }
      );
    }

    // Update referral
    await db
      .update(referrals)
      .set({
        status,
        internalNotes: internalNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(referrals.id, referralId));

    // Log audit
    await db.insert(auditLogs).values({
      referralId,
      action: 'status_change',
      actor: 'admin',
      actorType: 'admin',
      details: {
        newStatus: status,
        notes: internalNotes,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Referral updated',
    });
  } catch (error) {
    console.error('Update referral error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
