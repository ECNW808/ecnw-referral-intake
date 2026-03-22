# ECNW Referral Intake Web App - Development TODO

## Phase 1: Project Setup ✓
- [x] Initialize Next.js project with TypeScript
- [x] Set up PostgreSQL database schema
- [x] Configure Tailwind CSS with ECNW branding colors
- [x] Create global styles and layout components
- [x] Set up environment variables
- [x] Create home page with branding

## Phase 2: Secure Magic-Link System ✓
- [x] Implement token generation and hashing (bcryptjs)
- [x] Create magic link validation API endpoint
- [x] Build token verification utility
- [x] Set up rate limiting middleware
- [x] Implement bot protection (honeypot + patterns)
- [x] Create input validation and sanitization

## Phase 3: Public Referral Form
- [ ] Build referral form component with validation
- [ ] Implement file upload handling
- [ ] Add bot protection (reCAPTCHA or honeypot)
- [ ] Implement rate limiting on form submission
- [ ] Create form submission API endpoint
- [ ] Add success/error notifications

## Phase 4: Security & Rate Limiting
- [ ] Implement rate limiting middleware
- [ ] Add CORS configuration
- [ ] Set up helmet security headers
- [ ] Add input validation and sanitization
- [ ] Implement CSRF protection
- [ ] Add bot detection

## Phase 5: Admin Portal
- [ ] Create admin login page
- [ ] Implement JWT authentication
- [ ] Build admin dashboard
- [ ] Create referral list view with filtering
- [ ] Build referral detail view
- [ ] Implement status management UI

## Phase 6: Referral Management Features
- [ ] Add internal notes functionality
- [ ] Implement attachment upload/download
- [ ] Create status change tracking
- [ ] Build bulk actions
- [ ] Add search and filtering
- [ ] Create CSV export functionality

## Phase 7: Email & Notifications
- [ ] Set up email service (Nodemailer)
- [ ] Create notification templates (no PHI)
- [ ] Implement new referral alerts
- [ ] Add status change notifications
- [ ] Create digest emails
- [ ] Test email delivery

## Phase 8: Audit Logging
- [ ] Create audit log schema
- [ ] Implement submission logging
- [ ] Add status change logging
- [ ] Log admin actions
- [ ] Create audit log viewer
- [ ] Export audit logs

## Phase 9: Testing & Security
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Perform security audit
- [ ] Test rate limiting
- [ ] Test file upload security
- [ ] Penetration testing

## Phase 10: Deployment
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline
- [ ] Deploy to managed host (Railway/Render/Vercel)
- [ ] Set up monitoring and logging
- [ ] Create deployment documentation

## Features Checklist

### Public Form
- [ ] Patient information fields
- [ ] Clinical information fields
- [ ] Discharge information fields
- [ ] Income/Payment information
- [ ] File upload (max 10MB)
- [ ] Form validation
- [ ] Accessibility (WCAG)
- [ ] Mobile responsive

### Admin Portal
- [ ] Secure login
- [ ] Referral dashboard
- [ ] Referral search/filter
- [ ] Status management
- [ ] Internal notes
- [ ] Attachment management
- [ ] CSV export
- [ ] Audit log viewer

### Security
- [ ] Magic link tokens (hashed)
- [ ] Rate limiting (5 requests/15 min)
- [ ] Bot protection
- [ ] HIPAA audit logs
- [ ] Email notifications (no PHI)
- [ ] File encryption
- [ ] Input sanitization
- [ ] CORS configuration

### Database
- [ ] Facilities table
- [ ] Admin users table
- [ ] Referrals table
- [ ] Attachments table
- [ ] Audit logs table
- [ ] Rate limit tracking table
- [ ] Indexes on key columns
- [ ] Foreign key constraints

## Known Issues
- None yet

## Notes
- All emails must NOT contain PHI (Protected Health Information)
- Emails should only contain: facility name, timestamp, link to admin portal
- Rate limit: 5 requests per 15 minutes per IP
- File uploads: max 10MB, allowed types: PDF, JPG, PNG, DOC, DOCX
- Admin portal: login required, email/password authentication
- Audit logs: track all submissions and status changes
