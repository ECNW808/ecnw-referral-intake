# ECNW Referral Intake - Railway Deployment Guide

## Quick Start (5 minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (ECNW808)
3. Create a new workspace

### Step 2: Create PostgreSQL Database
1. Click **New** → **Database** → **PostgreSQL**
2. Wait for database to provision (2-3 minutes)
3. Copy the `DATABASE_URL` from the PostgreSQL service settings

### Step 3: Deploy Application
1. Click **New** → **Docker Image**
2. Enter Docker image: `node:20-alpine`
3. Configure the service:
   - **Name**: `ecnw-referral-intake`
   - **Port**: `3000`

### Step 4: Add Source Code
1. Click **Deployments** → **Connect Repository**
2. Select `ECNW808/ecnw-referral-intake`
3. Set branch to `main`

### Step 5: Configure Environment Variables
In Railway project settings, add:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://your-domain.railway.app
ADMIN_EMAIL=admin@elitecarenorthwest.com
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=production
```

### Step 6: Set Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Click **Add Custom Domain**
3. Enter your domain (e.g., `referrals.elitecarenorthwest.com`)
4. Update DNS records at your domain provider

### Step 7: Deploy
1. Click **Deploy**
2. Wait for build to complete (5-10 minutes)
3. Once deployed, your app will be live!

## Database Setup

After deployment, run migrations:

```bash
# Via Railway CLI
railway run pnpm db:push

# Or manually in Railway shell
pnpm db:push
```

## Admin Setup

1. Access your deployed app
2. Go to `/admin/login`
3. Use the default admin credentials (update these immediately)
4. Generate facility magic links for each hospital

## Troubleshooting

**Build fails?**
- Check Node.js version (should be 20+)
- Verify all dependencies are in package.json
- Check build logs in Railway dashboard

**Database connection error?**
- Verify DATABASE_URL is correct
- Check database credentials
- Ensure PostgreSQL service is running

**App won't start?**
- Check environment variables are set
- Review application logs in Railway
- Verify port 3000 is exposed

## Support

For Railway-specific issues:
- https://docs.railway.app
- https://railway.app/support

For ECNW app issues:
- Check application logs
- Review database migrations
- Verify environment variables
