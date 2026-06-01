# Complete Railway Deployment Guide

## 🚀 Deploy CodeRunner to Railway - Step by Step

This guide will walk you through deploying your CodeRunner Platform to Railway without any errors.

---

## ✅ Prerequisites (Before You Start)

- [ ] GitHub account (already have it ✅)
- [ ] Railway account (free) - https://railway.app
- [ ] Your generated variables ready:
  - `NODE_ENV=production`
  - `JWT_SECRET=7mK9pL2qR5sT8uV1wX4yZ3aB6cD9eF2gH5jI8kL1mN4oP7qR0s`

---

## 📋 Step 1: Create Railway Account

1. Go to **https://railway.app**
2. Click **"Get Started"** button (top right)
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. Click **"Authorize"** on the popup
6. You'll be redirected to Railway Dashboard

✅ **Status:** Railway account created

---

## 🔗 Step 2: Create New Project

1. In Railway Dashboard, click **"New Project"** button (bottom left or top area)
2. A menu will appear with options
3. Click **"Deploy from GitHub"**

✅ **Status:** Ready to connect GitHub repo

---

## 🔐 Step 3: Authorize GitHub Integration

1. A popup will appear: **"Authorize railway-app on GitHub"**
2. Click **"Authorize railway-app"** button
3. You may need to enter your GitHub password to confirm
4. This gives Railway permission to access your repositories

✅ **Status:** GitHub authorization complete

---

## 📚 Step 4: Select Your Repository

1. After authorization, you'll see a list of your GitHub repositories
2. Look for **"code-runner-platform"** in the list
3. Click on it to select it
4. Railway will automatically start importing your repository

> **If you don't see the repo:**
> - Click **"Configure the GitHub App"** 
> - Select **"code-runner-platform"** from the list
> - Click **"Save"**
> - Go back and try again

✅ **Status:** Repository selected

---

## 🔍 Step 5: Wait for Detection

1. Railway will automatically detect your project type
2. You should see: **"Node.js"** detected
3. Wait for the detection to complete (usually 10-15 seconds)
4. A configuration panel will appear

> **What if detection fails?**
> - Manually select **"Node.js"** from the dropdown
> - Continue to next step

✅ **Status:** Project type detected

---

## ⚙️ Step 6: Configure Service (First Time)

You might see a configuration dialog. Here's what to do:

1. **Service Name:** `coderunner` (or any name you like)
2. **Region:** Select closest to you:
   - **US:** `us-west` or `us-east`
   - **EU:** `eu-west`
   - **Default:** `us-west` is fine
3. Click **"Create"** or **"Deploy"** button

> If no dialog appears, continue to next step

✅ **Status:** Service created

---

## 🌐 Step 7: View Your Project in Dashboard

1. You should now be in your Railway project dashboard
2. On the left sidebar, you should see **"coderunner"** (your service name)
3. The main panel shows your project details
4. You should see a tab bar with options like: **Deployments**, **Variables**, **Settings**, etc.

✅ **Status:** In Railway dashboard

---

## 📝 Step 8: Add Environment Variables

### **Finding the Variables Section:**

1. Look at the top of your project panel
2. Find and click the **"Variables"** tab
   - Tabs usually show: `Deployments` | `Variables` | `Settings` | `Logs`
3. You should see an empty list with a message like "No variables yet"

### **Adding NODE_ENV Variable:**

1. Click **"+ Add Variable"** button (usually on the right)
2. A new row will appear with empty fields
3. **Left field (Key):** Type `NODE_ENV`
4. **Right field (Value):** Type `production`
5. Press **Enter** or click the checkmark ✓
6. The variable should now appear in the list

### **Adding JWT_SECRET Variable:**

1. Click **"+ Add Variable"** button again
2. A new empty row appears
3. **Left field (Key):** Type `JWT_SECRET`
4. **Right field (Value):** Paste: `7mK9pL2qR5sT8uV1wX4yZ3aB6cD9eF2gH5jI8kL1mN4oP7qR0s`
5. Press **Enter** or click the checkmark ✓
6. The variable should now appear in the list

### **Your Variables Should Look Like:**
```
NODE_ENV          = production
JWT_SECRET        = 7mK9pL2qR5sT8uV1wX4yZ3aB6cD9eF2gH5jI8kL1mN4oP7qR0s
```

✅ **Status:** Variables added

---

## 🚀 Step 9: Deploy

### **Option A: Auto-Deploy (Recommended)**

1. Go to **"Settings"** tab
2. Look for **"Auto Deploy"** option
3. Toggle it **ON** (switch should be green/blue)
4. Select **"main"** branch if prompted
5. Save changes
6. Your app will auto-deploy now and on every GitHub push

### **Option B: Manual Deploy (First Time)**

1. Go to **"Deployments"** tab
2. Look for a **"Deploy"** or **"Redeploy"** button
3. Click it
4. Wait for deployment to complete (2-3 minutes)
5. You should see a green checkmark ✓

✅ **Status:** Deployment started

---

## ⏳ Step 10: Wait for Deployment

1. You'll see a deployment log with messages like:
   ```
   Building application...
   Installing dependencies...
   Starting server...
   ```

2. Wait until you see: **"Deployment Successful"** ✅

3. Or in the top right, you should see a green status indicator

> **Deployment takes 2-5 minutes**
> Be patient, don't refresh or close the page

✅ **Status:** Deployment in progress

---

## 🎉 Step 11: Get Your Live URL

1. Once deployment is complete, look at the top of your project panel
2. You should see a URL like: `https://coderunner-xxxxx.up.railway.app`
3. This is your live app URL! 🎉
4. Click on it to open your app in a new tab

> **Can't find the URL?**
> - Check the **"Deployments"** tab
> - Look for the latest deployment with a green checkmark
> - The URL should be shown there

✅ **Status:** App deployed and live!

---

## ✨ Step 12: Test Your App

1. Your app should open in a browser
2. You should see the CodeRunner login page
3. Create a new account:
   - **Username:** testuser
   - **Email:** test@example.com
   - **Password:** TestPassword123 (at least 8 characters)
4. Click **"Sign Up"**
5. You should see: **"Account created! Please login."**
6. Click the Login link
7. Enter your email and password
8. Click **"Login"**
9. You should be logged in! ✅

### **Test Code Execution:**

1. Click **"New Project"** from sidebar
2. Enter project name: `HelloWorld`
3. Select language: `Python`
4. In the code editor, paste:
   ```python
   print("Hello from CodeRunner!")
   print("Deployment successful!")
   ```
5. Click **"Run Code"**
6. You should see output in the terminal panel at the bottom ✅

✅ **Status:** App working perfectly!

---

## 🎊 Success! You're Done!

Your CodeRunner Platform is now live on Railway! 🚀

### **Your Deployment Details:**
- **Platform:** Railway
- **URL:** `https://coderunner-xxxxx.up.railway.app`
- **Auto-Deploy:** Enabled (pushes to GitHub auto-deploy)
- **Status:** Active 24/7

---

## 📊 Monitor Your App

### **View Logs:**
1. Go to **"Logs"** tab
2. See real-time application logs
3. Check for any errors

### **View Metrics:**
1. Go to **"Metrics"** tab
2. Monitor CPU, Memory, Network usage
3. Make sure everything is running smoothly

### **Update Your App:**
1. Make changes in your code locally
2. Push to GitHub: `git push origin main`
3. Railway automatically redeploys
4. Your changes go live in 2-3 minutes

---

## ⚠️ Troubleshooting

### **Problem: Deployment Failed**
**Solution:**
1. Go to **Logs** tab
2. Look for error messages
3. Common errors:
   - Missing `package.json` ← Check GitHub has the file
   - Wrong Node version ← Use Node 18+
   - Port issues ← We handle PORT automatically

### **Problem: App Won't Start**
**Solution:**
1. Check Variables are correct:
   - `NODE_ENV=production` ✓
   - `JWT_SECRET=7mK9pL2qR5sT8uV1wX4yZ3aB6cD9eF2gH5jI8kL1mN4oP7qR0s` ✓
2. Redeploy with new variables
3. Wait 5 minutes

### **Problem: Can't Login**
**Solution:**
1. Make sure JWT_SECRET is correct
2. Try creating a new account instead
3. Check Logs for authentication errors

### **Problem: WebSocket Not Connecting (Logs Don't Show)**
**Solution:**
1. Railway WebSocket is enabled by default
2. Just refresh the page
3. Try a simple code execution again

---

## 🔗 Helpful Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://docs.railway.app
- **Your Project Logs:** Check in Railway dashboard → Logs tab
- **GitHub Repo:** https://github.com/dennisnjonjo07-commits/code-runner-platform

---

## ✅ Checklist - Everything Done?

- [ ] Created Railway account
- [ ] Authorized GitHub
- [ ] Selected code-runner-platform repo
- [ ] Added `NODE_ENV=production` variable
- [ ] Added `JWT_SECRET` variable
- [ ] Deployed successfully
- [ ] Got live URL
- [ ] Tested login
- [ ] Tested code execution
- [ ] App is live 24/7 ✨

---

**Congratulations! Your CodeRunner Platform is now live!** 🎉

Need help? Check the troubleshooting section above or review your Railway Logs tab.
