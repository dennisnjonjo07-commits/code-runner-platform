# Deployment Instructions

## 🚀 Quick Start - 3 Options

Choose your preferred deployment platform:

### Option 1: **Railway** ⭐ Recommended (Easiest)
- **Cost**: $5/month free credit
- **Setup Time**: 3 minutes
- **Always On**: ✅ Yes
- **Full Language Support**: ✅ Python, Node.js, Java, Ruby, Rust

👉 See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

---

### Option 2: **Render** (Also Great)
- **Cost**: Free tier available (with 15 min sleep), Starter $7/month
- **Setup Time**: 3 minutes  
- **Always On**: ✅ Yes (on paid plans)
- **Full Language Support**: ✅ Python, Node.js, Java, Ruby, Rust

👉 See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

---

### Option 3: **Docker Locally** (For Testing)
- **Cost**: Free (use your machine)
- **Setup Time**: 5 minutes
- **For**: Development and testing

👉 See instructions below

---

## 🐳 Option 3: Run with Docker Locally

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start

```bash
# Clone repository
git clone https://github.com/dennisnjonjo07-commits/code-runner-platform.git
cd code-runner-platform

# Make scripts executable
chmod +x docker-run.sh docker-stop.sh

# Start the app
./docker-run.sh

# Access at http://localhost:5000

# Stop the app
./docker-stop.sh
```

### Or use docker-compose directly

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📋 Comparison Table

| Feature | Railway | Render | Docker Local |
|---------|---------|--------|---------------|
| Setup Time | 3 min | 3 min | 5 min |
| Cost | $5/mo credit | Free tier | Free (your machine) |
| Always On | ✅ Yes | ⚠️ Paid only | Your choice |
| Language Support | ✅ All | ✅ All | ✅ All |
| Auto-Deploy | ✅ Yes | ✅ Yes | Manual |
| Easy Deploy | ✅ Yes | ✅ Yes | ✅ Yes |
| Best For | Production | Testing/Small | Local Dev |

---

## 🎯 My Recommendation

### For Production (24/7):
**→ Use Railway**
- $5/month free credit covers most usage
- Excellent uptime
- Simple dashboard
- Auto-deploy from GitHub

### For Testing/Learning:
**→ Use Render Free Tier**
- Free to try
- Easy setup
- Just accept occasional sleep

### For Local Development:
**→ Use Docker**
- Test before deploying
- Full control
- No external dependencies

---

## 🔒 Environment Variables Setup

You'll need to set these in your deployment platform:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secret_key_here  # Generate: openssl rand -base64 32
BCRYPT_ROUNDS=10
```

**How to generate JWT_SECRET:**
```bash
opensssl rand -base64 32
```

---

## 📊 Project Structure for Deployment

```
.
├── Dockerfile           # Container definition
├── docker-compose.yml   # Docker services
├── package.json         # Node.js dependencies
├── backend/
│   ├── server.js        # Main app file
│   └── routes/          # API routes
├── frontend/            # Static files
│   ├── index.html
│   ├── css/
│   └── js/
└── uploads/             # User uploads (volume)
```

---

## 🚀 After Deployment

1. **Test the platform**:
   - Create an account
   - Write and run code
   - Test all languages

2. **Monitor performance**:
   - Check logs regularly
   - Monitor CPU/Memory usage
   - Track error rates

3. **Update as needed**:
   - Push changes to GitHub
   - Auto-deploy will trigger
   - Test changes immediately

---

## 🆘 Troubleshooting

### App won't start
1. Check deployment logs
2. Verify PORT environment variable
3. Check package.json for dependencies
4. Ensure Node.js version compatibility

### WebSocket not working
1. Verify WebSocket support enabled
2. Check CORS_ORIGIN variable
3. Review browser console errors
4. Check firewall/proxy settings

### Code execution failing
1. Check if language is installed on server
2. Review execution logs
3. Test with simple code first
4. Check memory/timeout limits

---

## 📚 Documentation Links

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Docker Docs**: https://docs.docker.com
- **Node.js Docs**: https://nodejs.org/docs

---

## ✅ Next Steps

1. ✅ Choose deployment platform (Railway recommended)
2. ✅ Follow the specific deployment guide
3. ✅ Set up environment variables
4. ✅ Deploy and test
5. ✅ Share your live URL!

---

**Happy Deploying! 🎉**
