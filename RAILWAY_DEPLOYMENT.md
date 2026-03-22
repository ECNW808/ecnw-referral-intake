# Deploy ECNW Referral Intake to Railway

Railway is the easiest way to deploy this app. It handles PostgreSQL, Node.js, and auto-deploys on git push.

## Prerequisites

- GitHub account with the code repository
- Railway account (free to start): https://railway.app
- Custom domain (optional but recommended)

## Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: ECNW Referral Intake"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/ecnw-referral-intake.git
git branch -M main
git push -u origin main
```

## Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub and select `ecnw-referral-intake` repository
5. Click "Deploy"

Railway will automatically detect Next.js and create the project.

## Step 3: Add PostgreSQL Database

1. In Railway Dashboard, click "Add Service"
2. Select "PostgreSQL"
3. Railway will create a PostgreSQL instance and auto-set `DATABASE_URL`

## Step 4: Configure Environment Variables

In Railway Dashboard → Your Project → Variables:

```
NEXTAUTH_URL=https://your-domain.railway.app
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
ADMIN_EMAIL=admin@elitecarenorthwest.com
ADMIN_PASSWORD=<generate: openssl rand -base64 16>
NODE_ENV=production
```

Optional (for email notifications):
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-key
```

## Step 5: Run Database Migrations

1. In Railway Dashboard, click your project
2. Click "Connect" → "CLI"
3. Run migrations:

```bash
npm run db:push
```

## Step 6: Create Admin User

```bash
npm run ts-node scripts/create-admin.ts
```

Save the generated password in a secure location.

## Step 7: Set Custom Domain (Optional)

1. In Railway Dashboard → Your Project → Settings
2. Click "Add Custom Domain"
3. Enter your domain (e.g., `referrals.elitecarenorthwest.com`)
4. Update DNS records with Railway's CNAME
5. Wait for DNS propagation (5-30 minutes)

## Step 8: Verify Deployment

1. Visit your Railway URL or custom domain
2. Test the referral form
3. Login to admin: `/admin/login`
4. Check that referrals appear in dashboard

## Step 9: Set Up Facility Magic Links

```bash
# Generate magic links for all facilities
npm run ts-node scripts/setup-facilities.ts
```

Share the generated links with discharge coordinators.

## Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` is set in Railway Variables
- Verify PostgreSQL service is running
- Restart services: Railway Dashboard → Restart

### Admin Login Not Working
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
- Check admin user was created: `npm run ts-node scripts/create-admin.ts`
- Clear browser cookies and try again

### Referral Form Not Submitting
- Check browser console for errors
- Verify rate limiting not exceeded
- Check server logs: Railway Dashboard → Logs

### Custom Domain Not Working
- Verify DNS records are correct
- Wait for DNS propagation (can take up to 30 minutes)
- Check Railway domain settings

## Monitoring

### View Logs
Railway Dashboard → Your Project → Logs

### Monitor Performance
Railway Dashboard → Your Project → Metrics

### Database Backups
Railway automatically backs up PostgreSQL daily. Access backups in:
Railway Dashboard → PostgreSQL Service → Backups

## Auto-Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update referral form"
git push origin main

# Railway automatically deploys within 1-2 minutes
```

## Scaling

As traffic grows, Railway can automatically scale:

1. Railway Dashboard → Your Project → Settings
2. Enable "Auto-scaling" if needed
3. Adjust CPU/RAM limits

## Cost

- **Free tier**: Perfect for testing (limited resources)
- **Pay-as-you-go**: ~$5-20/month for production
  - PostgreSQL: ~$5-10/month
  - Node.js app: ~$5-10/month
  - Bandwidth: Included

## Security Checklist

- [ ] `NEXTAUTH_SECRET` set to strong random value
- [ ] `ADMIN_PASSWORD` set and saved securely
- [ ] `NODE_ENV=production`
- [ ] Custom domain configured with HTTPS
- [ ] Database backups enabled (automatic)
- [ ] Rate limiting configured
- [ ] Email notifications working

## Next Steps

1. ✓ Deploy to Railway
2. ✓ Set up PostgreSQL
3. ✓ Configure environment variables
4. ✓ Run migrations
5. ✓ Create admin user
6. ✓ Set custom domain
7. Generate facility magic links
8. Share links with discharge coordinators
9. Monitor submissions in admin dashboard

## Support

- Railway Docs: https://docs.railway.app
- Railway Support: https://railway.app/support
- Email: admin@elitecarenorthwest.com

## Rollback

If something goes wrong:

1. Railway Dashboard → Deployments
2. Select previous deployment
3. Click "Redeploy"

Your database is preserved during rollbacks.

---

**Deployment Time**: ~5 minutes
**Maintenance**: Automatic (Railway handles updates)
**Uptime SLA**: 99.9% (Railway infrastructure)
