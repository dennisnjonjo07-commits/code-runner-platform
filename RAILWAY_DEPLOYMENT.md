# CodeRunner Platform - Railway Deployment Guide

## 🚀 Deploy to Railway in 3 Steps

### Step 1: Prepare Your Repository
- ✅ Code is already pushed to GitHub
- Repository: `https://github.com/dennisnjonjo07-commits/code-runner-platform`

### Step 2: Connect to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize Railway with GitHub
5. Select the `code-runner-platform` repository
6. Railway will auto-detect it's a Node.js project

### Step 3: Configure Environment Variables

In Railway Dashboard:

1. Go to **"Variables"** tab
2. Add these variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
BCRYPT_ROUNDS=10
CORS_ORIGIN=https://your-railway-app.up.railway.app
```

3. Click **"Deploy"**

### 🎉 Done!

Railway will:
- ✅ Auto-detect Node.js
- ✅ Install dependencies from package.json
- ✅ Run `npm start` automatically
- ✅ Give you a live URL like: `https://coderunner-xxxxx.up.railway.app`

---

## 📋 Railway Dashboard Features

- **Real-time Logs**: View server logs in real-time
- **Environment Variables**: Manage secrets securely
- **Auto-Deploy**: Redeploy on GitHub push (optional)
- **Custom Domain**: Add your own domain
- **Metrics**: Monitor CPU, memory, request count

---

## 🔄 Auto-Deploy from GitHub

1. In Railway Dashboard → **"Settings"**
2. Enable **"Deploy on GitHub push"**
3. Now every push to `main` auto-deploys!

---

## 💰 Cost

- **Free Plan**: $5/month credit (usually enough)
- **Pay-as-you-go**: After credits end
- Monitor usage in **"Billing"** tab

---

## 🐛 Troubleshooting

### App not starting?
- Check logs: Railway Dashboard → **Logs** tab
- Verify environment variables are set
- Check if PORT is set to 5000

### WebSocket not working?
- Enable WebSocket support in Railway settings
- Verify CORS_ORIGIN matches your Railway URL

### Code execution failing?
- Railway includes Python, Node.js, but not all languages
- For full language support, use Docker container

---

## 🔐 Security Checklist

- ✅ Change `JWT_SECRET` to a strong random string
- ✅ Don't commit `.env` file
- ✅ Use Railway's secret management
- ✅ Enable HTTPS (automatic on Railway)
- ✅ Set `NODE_ENV=production`

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Email Support: support@railway.app
