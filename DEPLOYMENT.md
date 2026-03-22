# ECNW Referral Intake - Deployment Guide

## Quick Start (5 minutes)

### 1. Deploy to Railway (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL
railway add

# Set environment variables
railway variables set DATABASE_URL postgresql://...
railway variables set NEXTAUTH_SECRET $(openssl rand -base64 32)
railway variables set ADMIN_EMAIL intake@elitecarenorthwest.com
railway variables set NODE_ENV production

# Deploy
railway up
```

### 2. Deploy to Vercel (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and set environment variables in Vercel dashboard
```

### 3. Manual Deployment (Any Server)

```bash
# Build
npm run build

# Set environment variables
export DATABASE_URL=postgresql://...
export NEXTAUTH_SECRET=your-secret
export ADMIN_EMAIL=intake@elitecarenorthwest.com
export NODE_ENV=production

# Start
npm run start
```

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/ecnw_referral

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key (generate: openssl rand -base64 32)

# Email
ADMIN_EMAIL=intake@elitecarenorthwest.com

# Optional: SMTP for email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: AWS S3 for file storage
AWS_REGION=us-west-2
AWS_S3_BUCKET=ecnw-referrals
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

## Domain Setup

### Custom Domain on Railway

1. Go to Railway Dashboard
2. Select Project → Settings
3. Add Custom Domain
4. Update DNS records (CNAME to Railway domain)

### Custom Domain on Vercel

1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add custom domain
4. Update DNS records

## Database Setup

### PostgreSQL on Railway

1. Railway automatically provides PostgreSQL
2. `DATABASE_URL` is auto-set as environment variable
3. No manual setup needed

### PostgreSQL on External Host

```bash
# Create database
createdb ecnw_referral

# Get connection string
postgresql://user:password@host:5432/ecnw_referral

# Run migrations
npm run db:push
```

## SSL/HTTPS

- **Railway**: Automatic SSL
- **Vercel**: Automatic SSL
- **Manual**: Use Let's Encrypt with Nginx/Apache

## Monitoring

### View Logs

**Railway:**
```bash
railway logs
```

**Vercel:**
```bash
vercel logs
```

**Manual:**
```bash
tail -f /var/log/app.log
```

### Database Backups

**Railway**: Automatic daily backups

**Manual PostgreSQL**:
```bash
# Backup
pg_dump ecnw_referral > backup.sql

# Restore
psql ecnw_referral < backup.sql
```

## Security Checklist

- [ ] Set `NEXTAUTH_SECRET` to a strong random value
- [ ] Use HTTPS/SSL (automatic on Railway/Vercel)
- [ ] Set `NODE_ENV=production`
- [ ] Enable database backups
- [ ] Monitor audit logs regularly
- [ ] Keep dependencies updated: `npm audit fix`
- [ ] Rotate magic link tokens periodically
- [ ] Use strong database password

## Facility Setup

### Generate Magic Links

1. Access production database
2. Insert facility records:

```sql
INSERT INTO facilities (name, email, phone, magic_token, magic_token_hash, is_active)
VALUES (
  'Swedish Medical Center - First Hill',
  'discharge@swedish.org',
  '206-744-8000',
  'token-here',
  'hashed-token-here',
  true
);
```

3. Share magic link with facility:
```
https://your-domain.com/referral/{MAGIC_TOKEN}
```

## Troubleshooting

### App won't start
- Check `DATABASE_URL` is set correctly
- Verify database is accessible
- Check logs: `railway logs` or `vercel logs`

### Database connection fails
- Verify PostgreSQL is running
- Check credentials in `DATABASE_URL`
- Test connection: `psql $DATABASE_URL`

### Magic links not working
- Verify token is URL-encoded
- Check facility record exists in database
- Verify `is_active = true`

### Rate limiting too strict
- Adjust `RATE_LIMIT_MAX_REQUESTS` env var
- Clear rate limit table if needed

## Performance Tips

1. **Enable caching**: Add `Cache-Control` headers
2. **Database indexes**: Already configured on key columns
3. **CDN**: Use Railway/Vercel built-in CDN
4. **Compression**: Enabled by default in Next.js

## Cost Estimates

- **Railway**: ~$5-20/month (PostgreSQL + App)
- **Vercel**: Free tier available, ~$20/month for production
- **Manual Server**: $5-50/month depending on provider

## Support

- Railway Support: https://railway.app/support
- Vercel Support: https://vercel.com/support
- PostgreSQL Docs: https://www.postgresql.org/docs/

## Next Steps

1. Deploy application
2. Set up PostgreSQL database
3. Generate facility magic links
4. Share links with discharge coordinators
5. Monitor submissions in database
6. (Optional) Add email notifications
7. (Optional) Add S3 file storage
