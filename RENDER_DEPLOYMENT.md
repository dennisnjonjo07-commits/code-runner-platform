# CodeRunner Platform - Render Deployment Guide

## 🚀 Deploy to Render in 3 Steps

### Step 1: Prepare Your Repository
- ✅ Code is already pushed to GitHub
- Repository: `https://github.com/dennisnjonjo07-commits/code-runner-platform`

### Step 2: Connect to Render

1. Go to [Render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Authorize Render with GitHub
5. Select the `code-runner-platform` repository
6. Render will auto-detect it's a Node.js project

### Step 3: Configure Settings

In Render Dashboard:

1. **Name**: `coderunner-platform` (or any name)
2. **Region**: Choose closest to you (e.g., US, EU)
3. **Branch**: `main`
4. **Runtime**: Node
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. **Instance Type**: Free (starter) or paid

### Step 4: Add Environment Variables

Click **"Environment"** and add:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your_super_secret_jwt_key_change_this
BCRYPT_ROUNDS=10
CORS_ORIGIN=https://your-render-service.onrender.com
```

**Important**: Render uses port 10000 by default

### 🎉 Done!

Render will:
- ✅ Clone from GitHub
- ✅ Run build command
- ✅ Start your app
- ✅ Give you a live URL like: `https://coderunner-xxxxx.onrender.com`

---

## 📋 Render Dashboard Features

- **Logs**: Real-time server logs
- **Metrics**: CPU, memory, bandwidth usage
- **Environment**: Manage secrets
- **Deployment History**: View all deployments
- **Custom Domain**: Add your own domain

---

## 🔄 Auto-Deploy from GitHub

**Already Enabled by Default!**

Every push to your GitHub repository automatically triggers a new deployment.

To disable:
1. Dashboard → **"Settings"**
2. Turn off **"Auto-deploy"**

---

## 💰 Cost

- **Free Plan**: 0.5GB RAM, 0.5 vCPU (may sleep after 15 min inactivity)
- **Starter Plan**: $7/month (always on)
- **Professional**: $12+/month

For 24/7 execution, use **Starter Plan or higher**

---

## ⚠️ Free Plan Limitations

- Service sleeps after 15 minutes of inactivity
- Cold start takes 30-50 seconds
- Not suitable for production 24/7 execution

**Solution**: Use Starter Plan ($7/month) for continuous operation

---

## 🐛 Troubleshooting

### Deployment fails?
- Check logs: Dashboard → **Logs** tab
- Verify package.json exists
- Check for build errors

### App doesn't start?
- Verify PORT is set (use 10000 on Render)
- Check environment variables
- Review error logs

### WebSocket not connecting?
- Enable WebSocket in Render (usually enabled by default)
- Verify CORS_ORIGIN is correct
- Check browser console for errors

### Service sleeps?
- Upgrade to Starter Plan ($7/month)
- Or accept cold starts on free plan

---

## 🔐 Security Checklist

- ✅ Use strong `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- ✅ Never commit secrets to GitHub
- ✅ Use Render's environment variables
- ✅ Enable HTTPS (automatic)
- ✅ Set `NODE_ENV=production`

---

## 📞 Support

- Render Docs: https://render.com/docs
- Email: support@render.com
- Discord Community: https://discord.gg/render

---

## 🚀 Quick Deploy Button

You can add a one-click deploy button to your README:

```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/dennisnjonjo07-commits/code-runner-platform)
```

To set this up, create `render.yaml` in your repo root.
