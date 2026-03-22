# ECNW Referral Intake - Render.com Deployment Guide

## Complete Step-by-Step Instructions

### Prerequisites
- Render.com account (free tier available)
- The ECNW Referral Intake application code
- ~10 minutes of time

---

## Step 1: Prepare Your Application for Deployment

### 1.1 Create a ZIP file of your application
```bash
cd /home/ubuntu
zip -r ecnw-referral-intake.zip ecnw-referral-intake/
```

This creates a `ecnw-referral-intake.zip` file with all your code.

---

## Step 2: Set Up Render.com Account

### 2.1 Go to Render.com
- Visit: https://render.com
- Click "Get Started" or "Sign Up"
- Create account using email or GitHub

### 2.2 Create a New Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

---

## Step 3: Deploy Your Application

### 3.1 Upload Your Code
1. In the "Create a new Web Service" page:
   - Select **"Public Git Repository"** (or upload ZIP if available)
   - Paste repository URL or upload ZIP file
   - Click **"Create Web Service"**

### 3.2 Configure Service Settings

**Service Name:**
```
ecnw-referral-intake
```

**Environment:** 
```
Node
```

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Plan:**
- Select **"Free"** tier (sufficient for testing)
- Or **"Starter"** ($7/month) for production

---

## Step 4: Set Up PostgreSQL Database

### 4.1 Create PostgreSQL Database
1. In Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `ecnw-postgres`
   - **Database:** `ecnw_referral_db`
   - **User:** `ecnw_admin`
   - **Region:** Same as your web service
   - **Plan:** Free tier

### 4.2 Get Database Connection String
1. Once PostgreSQL is created, go to its page
2. Copy the **"External Database URL"**
3. It will look like:
   ```
   postgresql://user:password@host:5432/database
   ```

---

## Step 5: Configure Environment Variables

### 5.1 Add Environment Variables to Web Service
1. Go to your web service page
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add the following variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the PostgreSQL URL from Step 4.2 |
| `ADMIN_EMAIL` | `intake@elitecarenorthwest.com` |
| `JWT_SECRET` | Generate a random string (e.g., `your-random-secret-key-12345`) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### 5.2 Save Environment Variables
- Click **"Save"** after adding each variable
- Render will automatically redeploy with new variables

---

## Step 6: Deploy and Test

### 6.1 Monitor Deployment
1. Go to your web service page
2. Watch the **"Logs"** tab for deployment progress
3. Wait for "Build successful" message
4. Your application will be live at the provided URL

### 6.2 Get Your Live URL
1. Your service will have a URL like:
   ```
   https://ecnw-referral-intake.onrender.com
   ```
2. This is your public application URL

### 6.3 Test Your Application
1. Visit: `https://ecnw-referral-intake.onrender.com`
2. You should see the ECNW Referral Intake home page
3. Admin portal: `https://ecnw-referral-intake.onrender.com/admin/login`

---

## Step 7: Set Up Custom Domain (Optional)

### 7.1 Add Custom Domain
1. Go to your web service page
2. Click **"Settings"** tab
3. Scroll to **"Custom Domain"**
4. Enter your domain (e.g., `referrals.elitecarenorthwest.com`)
5. Follow DNS configuration instructions

### 7.2 Configure DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add CNAME record:
   - **Name:** `referrals`
   - **Value:** `ecnw-referral-intake.onrender.com`
3. Wait 24 hours for DNS propagation

---

## Step 8: Initialize Database and Create Admin Account

### 8.1 Run Database Migrations
1. In Render, go to your web service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run db:push
   ```

### 8.2 Create Admin User
1. In the Shell, run:
   ```bash
   npm run create-admin
   ```
2. Follow prompts to create admin account
3. Use email: `intake@elitecarenorthwest.com`

---

## Step 9: Generate Facility Magic Links

### 9.1 Access Admin Portal
1. Go to: `https://ecnw-referral-intake.onrender.com/admin/login`
2. Log in with your admin credentials
3. Create facility magic links for each hospital

### 9.2 Share Referral URLs
1. Each facility gets a unique URL like:
   ```
   https://ecnw-referral-intake.onrender.com/referral/[UNIQUE_TOKEN]
   ```
2. Share these URLs with discharge coordinators at each hospital

---

## Troubleshooting

### Application Won't Start
- Check **"Logs"** tab for error messages
- Verify all environment variables are set
- Ensure DATABASE_URL is correct

### Database Connection Error
- Verify PostgreSQL service is running
- Check DATABASE_URL format
- Ensure database name matches

### Port Already in Use
- Render automatically assigns ports
- No action needed

### Email Notifications Not Working
- Verify ADMIN_EMAIL is set correctly
- Check email service configuration
- Review application logs

---

## Support & Next Steps

1. **Monitor Logs:** Check logs regularly for errors
2. **Set Up Backups:** Configure database backups in Render
3. **Enable Auto-Deploys:** Set up GitHub integration for automatic deployments
4. **Custom Domain:** Set up your custom domain for professional appearance

---

## Important Notes

- **Free Tier Limitations:** Render free tier services spin down after 15 minutes of inactivity
- **Production Use:** Upgrade to Starter plan ($7/month) for production reliability
- **Database Backups:** Enable automatic backups in PostgreSQL settings
- **Email Service:** Configure SMTP for production email notifications

---

## Quick Reference

| Item | Value |
|------|-------|
| Application URL | `https://ecnw-referral-intake.onrender.com` |
| Admin Portal | `/admin/login` |
| Database | PostgreSQL (Render) |
| Email Notifications | `intake@elitecarenorthwest.com` |
| Environment | Production |

---

**Your ECNW Referral Intake system is ready to serve Seattle-area hospitals!**
