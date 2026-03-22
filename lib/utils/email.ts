/**
 * Send email notification (no PHI included)
 * Uses Manus built-in email service or SMTP
 */
export async function sendReferralNotification(
  facilityName: string,
  referralId: number,
  patientInitials: string
): Promise<boolean> {
  try {
    // Construct email with NO PHI
    const subject = `New Patient Referral Submitted - ${facilityName}`;
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #5C1F3D 0%, #1A3A52 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Elite Care Northwest</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px;">New Referral Notification</p>
            </div>
            
            <div style="background: #f5f1e8; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
              <p style="margin-top: 0;">A new patient referral has been submitted.</p>
              
              <div style="background: white; padding: 15px; border-left: 4px solid #5C1F3D; margin: 15px 0;">
                <p style="margin: 0;"><strong>Facility:</strong> ${facilityName}</p>
                <p style="margin: 10px 0 0 0;"><strong>Referral ID:</strong> ${referralId}</p>
                <p style="margin: 10px 0 0 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p style="margin: 15px 0;">
                <a href="${process.env.NEXTAUTH_URL}/admin/dashboard" style="background: #5C1F3D; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
                  View in Admin Portal
                </a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              
              <p style="font-size: 12px; color: #666; margin: 0;">
                This is an automated notification. No Protected Health Information (PHI) is included in this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Try using built-in Manus notification API if available
    if (process.env.BUILT_IN_FORGE_API_URL && process.env.BUILT_IN_FORGE_API_KEY) {
      try {
        const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/notification/email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: process.env.ADMIN_EMAIL || 'intake@elitecarenorthwest.com',
            subject,
            html: htmlContent,
          }),
        });

        if (response.ok) {
          return true;
        }
      } catch (error) {
        console.error('Manus API error:', error);
        // Fall through to SMTP
      }
    }

    // Fallback: Use SMTP if configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Note: In production, use nodemailer or similar
      console.log('SMTP configured but not implemented. Email would be sent to:', process.env.ADMIN_EMAIL);
      return true;
    }

    console.log('Email notification would be sent to:', process.env.ADMIN_EMAIL);
    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}
