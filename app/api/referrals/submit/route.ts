import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db/client';
import { referrals, attachments, auditLogs } from '../../../../lib/db/schema';
import { verifyToken } from '../../../../lib/utils/token';
import { checkRateLimit } from '../../../../lib/middleware/rateLimit';
import { facilities } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const { allowed } = await checkRateLimit(request);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const token = formData.get('token') as string;
    const facilityId = parseInt(formData.get('facilityId') as string);
    const formDataJson = JSON.parse(formData.get('formData') as string);

    // Validate token
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Get facility and verify token
    const facility = await db
      .select()
      .from(facilities)
      .where(eq(facilities.id, facilityId))
      .limit(1);

    if (!facility || facility.length === 0) {
      return NextResponse.json(
        { error: 'Facility not found' },
        { status: 404 }
      );
    }

    const isValidToken = await verifyToken(token, facility[0].magicTokenHash);
    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get client IP
    const clientIp = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create referral record
    const [referral] = await db
      .insert(referrals)
      .values({
        facilityId,
        patientFirstName: formDataJson.patientFirstName,
        patientLastName: formDataJson.patientLastName,
        dateOfBirth: formDataJson.dateOfBirth || null,
        gender: formDataJson.gender || null,
        patientPhone: formDataJson.patientPhone || null,
        patientEmail: formDataJson.patientEmail || null,
        admissionDiagnosis: formDataJson.admissionDiagnosis || null,
        acuityLevel: formDataJson.acuityLevel || null,
        specialNeeds: formDataJson.specialNeeds || null,
        estimatedDischargeDate: formDataJson.estimatedDischargeDate || null,
        estimatedDischargeTime: formDataJson.estimatedDischargeTime || null,
        hoursOfCareNeeded: formDataJson.hoursOfCareNeeded ? parseInt(formDataJson.hoursOfCareNeeded) : null,
        incomeVerified: formDataJson.incomeVerified || 'pending',
        monthlyIncome: formDataJson.monthlyIncome ? parseInt(formDataJson.monthlyIncome) : null,
        paymentMethod: formDataJson.paymentMethod || null,
        status: 'New',
        ipAddress: clientIp,
        userAgent,
      })
      .returning();

    // Handle file uploads
    let fileCount = 0;
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`file_${i}`) as File;
      if (!file) break;

      // TODO: Upload file to S3 and store reference
      // For now, just store file metadata
      await db.insert(attachments).values({
        referralId: referral.id,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        s3Key: `referrals/${referral.id}/${file.name}`,
        uploadedBy: 'facility',
      });

      fileCount++;
    }

    // Create audit log
    await db.insert(auditLogs).values({
      referralId: referral.id,
      action: 'submission',
      actor: facility[0].email,
      actorType: 'facility',
      details: {
        facilityName: facility[0].name,
        patientName: `${formDataJson.patientFirstName} ${formDataJson.patientLastName}`,
        filesAttached: fileCount,
      },
      ipAddress: clientIp,
    });

    // Send email notification (no PHI)
    const { sendReferralNotification } = await import('../../../../lib/utils/email');
    const patientInitials = `${formDataJson.patientFirstName[0]}${formDataJson.patientLastName[0]}`;
    await sendReferralNotification(facility[0].name, referral.id, patientInitials);

    return NextResponse.json({
      success: true,
      referralId: referral.id,
      message: 'Referral submitted successfully',
    });
  } catch (error) {
    console.error('Referral submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit referral' },
      { status: 500 }
    );
  }
}
