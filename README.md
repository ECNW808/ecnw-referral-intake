# Elite Care Northwest - Referral Intake System

A secure, HIPAA-compliant patient referral intake web application built with Next.js and PostgreSQL.

## Features

- **Secure Magic-Link URLs**: Each facility receives a unique, non-guessable token-based URL
- **ECNW Branded Interface**: Professional design matching Elite Care Northwest branding
- **Patient Referral Form**: Comprehensive form with validation and file uploads
- **Rate Limiting**: Built-in protection against spam (5 requests per 15 minutes)
- **Bot Protection**: Honeypot fields and interaction timing checks
- **File Uploads**: Secure document uploads (PDF, JPG, PNG, DOC, DOCX - max 10MB)
- **HIPAA Compliant**: Audit logging, encrypted data, no PHI in notifications
- **Input Validation**: XSS prevention and data sanitization
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14+ with React 18+
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Security**: bcryptjs, DOMPurify, Zod validation

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

## Installation

### 1. Clone and Setup

```bash
git clone <repository-url>
cd ecnw-referral-intake
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb ecnw_referral
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local` and update with your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecnw_referral
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
ADMIN_EMAIL=intake@elitecarenorthwest.com
NODE_ENV=development
```

### 4. Database Migrations

Run Drizzle migrations:

```bash
npm run db:push
```

### 5. Seed Facilities (Optional)

Create a `scripts/seed.ts` file with facility data:

```typescript
import { db } from '@/lib/db/client';
import { facilities } from '@/lib/db/schema';
import { generateToken, hashToken } from '@/lib/utils/token';

async function seed() {
  const token = generateToken();
  const tokenHash = await hashToken(token);

  await db.insert(facilities).values({
    name: 'Swedish Medical Center - First Hill',
    email: 'discharge@swedish.org',
    phone: '206-744-8000',
    address: '747 Broadway',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98122',
    magicToken: token,
    magicTokenHash: tokenHash,
    isActive: true,
  });

  console.log('Facility seeded with magic link token:', token);
}

seed().catch(console.error);
```

Run: `npm run ts-node scripts/seed.ts`

### 6. Generate Magic Links

For each facility, generate a unique magic link:

```
http://localhost:3000/referral/{MAGIC_TOKEN}
```

Share these links securely with discharge coordinators at each facility.

## Development

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

## Deployment

### Option 1: Railway (Recommended)

1. **Create Railway Account**: https://railway.app
2. **Connect GitHub Repository**
3. **Add PostgreSQL Plugin**
4. **Set Environment Variables**:
   - `DATABASE_URL` (auto-generated from PostgreSQL plugin)
   - `NEXTAUTH_URL` (your Railway domain)
   - `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
   - `ADMIN_EMAIL`
   - `NODE_ENV=production`
5. **Deploy**: Railway auto-deploys on git push

### Option 2: Vercel

1. **Connect GitHub to Vercel**: https://vercel.com
2. **Import Project**
3. **Add PostgreSQL** (via Vercel Postgres or external)
4. **Set Environment Variables** in Vercel Dashboard
5. **Deploy**: Auto-deploys on git push

### Option 3: Render

1. **Create Render Account**: https://render.com
2. **Create PostgreSQL Database**
3. **Create Web Service** from GitHub
4. **Set Environment Variables**
5. **Deploy**

## API Endpoints

### Validate Magic Link Token

```
POST /api/validate-token
Content-Type: application/json

{
  "token": "your-magic-token"
}

Response:
{
  "valid": true,
  "facility": {
    "id": 1,
    "name": "Swedish Medical Center",
    "email": "discharge@swedish.org"
  }
}
```

### Submit Referral

```
POST /api/referrals/submit
Content-Type: multipart/form-data

Form Data:
- token: magic-token
- facilityId: 1
- formData: JSON string with patient info
- file_0: (optional) attachment file
- file_1: (optional) attachment file
```

## Security Features

### Rate Limiting
- 5 requests per 15-minute window per IP address
- Tracked in database for persistence

### Bot Protection
- Honeypot field (hidden from users)
- Submission timing validation (2+ seconds required)
- User agent analysis
- Spam pattern detection

### Input Validation
- Zod schema validation for all forms
- XSS prevention with DOMPurify
- Email and phone validation
- File type and size validation

### HIPAA Compliance
- Audit logging of all submissions
- No PHI in email notifications
- Encrypted data in transit (HTTPS)
- Encrypted data at rest (database)
- IP address and user agent logging

## Database Schema

### Facilities Table
- `id`: Primary key
- `name`: Facility name
- `email`: Contact email
- `magicToken`: Plain token (for display only)
- `magicTokenHash`: Hashed token (for verification)
- `isActive`: Boolean flag

### Referrals Table
- `id`: Primary key
- `facilityId`: Foreign key to facilities
- `patientFirstName`, `patientLastName`: Patient info
- `dateOfBirth`, `gender`: Demographics
- `admissionDiagnosis`, `acuityLevel`: Clinical info
- `estimatedDischargeDate`, `hoursOfCareNeeded`: Discharge info
- `paymentMethod`: Cash or LTC Insurance
- `status`: New/Contacted/Scheduled/Closed/Not a fit
- `ipAddress`, `userAgent`: Request metadata
- `createdAt`, `updatedAt`: Timestamps

### Attachments Table
- `id`: Primary key
- `referralId`: Foreign key to referrals
- `fileName`, `fileSize`, `mimeType`: File metadata
- `s3Key`: S3 storage reference
- `uploadedBy`: 'facility' or 'admin'

### Audit Logs Table
- `id`: Primary key
- `referralId`: Foreign key to referrals
- `action`: 'submission', 'status_change', etc.
- `actor`: Email or system identifier
- `actorType`: 'facility', 'admin', or 'system'
- `details`: JSON with action details
- `ipAddress`: Request IP
- `createdAt`: Timestamp

## File Upload Handling

Currently, file metadata is stored in the database. To enable S3 storage:

1. **Install AWS SDK**:
   ```bash
   npm install @aws-sdk/client-s3
   ```

2. **Create `lib/utils/s3.ts`**:
   ```typescript
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

   const s3Client = new S3Client({ region: process.env.AWS_REGION });

   export async function uploadToS3(key: string, body: Buffer, contentType: string) {
     const command = new PutObjectCommand({
       Bucket: process.env.AWS_S3_BUCKET,
       Key: key,
       Body: body,
       ContentType: contentType,
     });
     return s3Client.send(command);
   }
   ```

3. **Update `/api/referrals/submit`** to call `uploadToS3()`

## Email Notifications

To enable email notifications to `intake@elitecarenorthwest.com`:

1. **Install Nodemailer**:
   ```bash
   npm install nodemailer
   ```

2. **Create `lib/utils/email.ts`**:
   ```typescript
   import nodemailer from 'nodemailer';

   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: parseInt(process.env.SMTP_PORT || '587'),
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });

   export async function sendNotification(referralId: number, facilityName: string) {
     await transporter.sendMail({
       from: process.env.SMTP_USER,
       to: process.env.ADMIN_EMAIL,
       subject: `New Referral Submission - ${facilityName}`,
       html: `
         <p>A new patient referral has been submitted.</p>
         <p><strong>Facility:</strong> ${facilityName}</p>
         <p><strong>Referral ID:</strong> ${referralId}</p>
         <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
         <p>Log in to the admin portal to view details.</p>
       `,
     });
   }
   ```

3. **Call in `/api/referrals/submit`**:
   ```typescript
   await sendNotification(referral.id, facility[0].name);
   ```

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database credentials

### Magic Link Not Working
- Verify token is URL-encoded
- Check facility `isActive` status
- Verify token hasn't expired (set expiration in code if needed)

### Rate Limiting Issues
- Check `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` env vars
- Clear rate limit table: `DELETE FROM rate_limit_tracking;`

### File Upload Failures
- Verify file size < 10MB
- Check allowed MIME types in `validation.ts`
- Ensure form has `enctype="multipart/form-data"`

## Support

For issues or questions:
- Email: intake@elitecarenorthwest.com
- Phone: (206) 321-7440

## License

MIT

## Changelog

### v1.0.0 (Initial Release)
- Secure magic-link referral system
- Patient intake form with validation
- File upload support
- Rate limiting and bot protection
- HIPAA-compliant audit logging
- Responsive design
