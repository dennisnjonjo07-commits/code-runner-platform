# 🚀 Deployment Guide - Railway

## Quick Deploy (3 Steps)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy to Railway"
git push origin deploy-railway
```

### Step 2: Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your repository: `dennisnjonjo13-alt/code-runner-platform`
5. Select branch: `deploy-railway`
6. Click **"Deploy"**

### Step 3: Configure Environment
1. Railway dashboard opens
2. Click **"Variables"** tab
3. Add these variables:
   ```
   PORT=5000
   NODE_ENV=production
   DOMAIN=your-project.railway.app
   ```
4. Click **"Deploy"** button

**Done! Your platform is live in ~5 minutes! 🎉**

## 📍 Your Live URL

After deployment, you'll get a URL like:
```
https://your-project.railway.app
```

Access your platform dashboard from there!

## ✅ Verify Deployment

1. Visit your Railway URL
2. You should see the Code Hosting Platform dashboard
3. Create a test project
4. Deploy it to get a live subdomain

## 📊 Monitor Your App

In Railway Dashboard:
- **Logs** tab: See real-time output
- **Metrics** tab: CPU, memory, bandwidth usage
- **Deployments** tab: Deployment history
- **Variables** tab: Environment variables

## 💾 File Storage

Your projects are stored in:
- `/projects/` - User project files
- `/deployments/` - Running app copies
- `/uploads/` - Temporary uploads

⚠️ **Note**: Railway uses ephemeral storage (resets on restart). For production, add a PostgreSQL database.

## 🔧 Troubleshooting

### App won't start
- Check logs in Railway dashboard
- Verify all dependencies in package.json
- Ensure PORT environment variable is set

### Domain not working
- DOMAIN variable must match your Railway URL
- Format: `project-name.railway.app`

### Files disappearing after restart
- Railway resets container storage on restart
- Solution: Add PostgreSQL for persistent storage

## 💰 Free Tier Usage

**Your free $5/month includes:**
- Node.js app: ~$0.10-0.50/day
- Storage: ~$0.05/day per GB
- Bandwidth: First 100GB free

**Estimate:**
- Small project: 5-10 days/month
- Medium project: 2-5 days/month
- Add payment for unlimited

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Community: https://railway.app/community
- GitHub Issues: Open an issue in your repo

## 🎯 Next Steps

1. ✅ Deploy to Railway
2. ✅ Create a test project
3. ✅ Deploy a test app
4. ✅ Share platform with users
5. ✅ Monitor usage
6. ✅ Upgrade if needed

---

**Your platform is production-ready! 🚀**
