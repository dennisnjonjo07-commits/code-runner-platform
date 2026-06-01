# 🚀 Code Hosting Platform

A complete full-stack **code hosting and deployment platform** - All-in-one solution like Replit, Vercel, Railway, and Render combined!

🏄 **Upload code → Deploy → Get live URL → Share with world**

## ✨ Key Features

### 🖥️ Integrated IDE
- Full-screen code editor in browser
- Multi-file project support
- Syntax highlighting ready
- Real-time file management
- Upload files or paste code

### 🚀 Live Deployment
- **One-click deployment** to get live URL
- Apps run **24/7** even when offline
- **Auto-scaling** on Railway
- **Subdomain routing** (projectname.yourplatform.com)
- Real-time deployment logs

### 🌍 Multi-Language Support
- **JavaScript/Node.js** - Full server support
- **Python** - Flask, HTTP servers
- **HTML/CSS/JS** - Static & dynamic sites
- **Java, Ruby, Go, C++** - Coming soon
- **Custom entry points** supported

### 📁 Project Management
- Create unlimited projects
- Organize by language
- View deployment status
- Live/Draft indicators
- Project sharing ready

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│   Code Hosting Platform Dashboard            │
│  (Browser-based IDE & Project Manager)       │
└──────────────────────┬──────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
   API Routes     Reverse Proxy    File Manager
   (/api/*)       (Subdomain)      (Upload/Edit)
       │               │               │
       └───────────────┼───────────────┘
                       ▼
   ┌───────────────────────────────────────────┐
   │   Project Management System               │
   │  - Storage (projects/)                    │
   │  - File Upload (multer)                   │
   │  - Metadata Tracking                      │
   └───────────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
   Deployment     Process Manager   WebSocket
   Engine         (Node PTY)        (Real-time)
       │               │               │
       └───────────────┼───────────────┘
                       ▼
   ┌───────────────────────────────────────────┐
   │   Running Applications                    │
   │  - Node.js servers on ports               │
   │  - Python servers                         │
   │  - Static file servers                    │
   └───────────────────────────────────────────┘
```

## 🚀 Quick Start

### Local Development

```bash
git clone <repo>
cd code-hosting-platform
npm install
npm run dev
```

Visit `http://localhost:5000`

### Deploy to Railway (Recommended)

**Easy 3-step setup:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "GitHub Repo"
   - Choose your repository
   - Select Dockerfile

3. **Configure Domain**
   - Railway generates a domain automatically
   - Set `DOMAIN` environment variable:
     ```
     DOMAIN=your-domain.railway.app
     ```

**That's it! Your platform is live! 🎉**

## 📖 Usage

### Create a Project
1. Click **"+ New Project"**
2. Enter name and select language
3. Optional: Paste code or use template
4. Click **"Create"**

### Upload Files
1. Select a project
2. Click **"📤 Upload Files"**
3. Select files from computer
4. Files are instantly added

### Deploy Live
1. Click **"🚀 Deploy Now"**
2. Get live URL instantly
3. Share with anyone!
4. Your app runs 24/7

### Edit & Update
1. Edit code in browser
2. Click **"💾 Save"**
3. Re-deploy for changes
4. Live updates appear immediately

## 🔧 API Reference

### Projects
```bash
# Create project
POST /api/projects/create
{
  "name": "My App",
  "language": "javascript",
  "code": "optional code"
}

# List projects
GET /api/projects

# Get project
GET /api/projects/:projectId

# Upload file
POST /api/projects/upload
FormData: {file, projectId}

# Get files
GET /api/projects/:projectId/files

# Get file content
GET /api/projects/:projectId/file/:filename

# Save file
POST /api/projects/:projectId/file/:filename
{"content": "..."}
```

### Deployment
```bash
# Deploy project
POST /api/projects/:projectId/deploy

# Get deployment status
GET /api/deployments/:deploymentId/status

# Stop deployment
POST /api/deployments/:deploymentId/stop

# List all deployments
GET /api/deployments
```

## 🌐 How Hosting Works

### Subdomain Routing
When you deploy a project with ID `myapp`:

```
Your Domain: myplatform.railway.app
                    ↓
        Subdomain: myapp.myplatform.railway.app
                    ↓
        Routed to: localhost:3XXX (allocated port)
                    ↓
        Your deployed app responds
```

### Auto Port Allocation
- Each deployment gets unique port
- Reverse proxy handles routing
- Multiple apps run simultaneously
- No port conflicts

### 24/7 Uptime
- Apps run as background processes
- Survive server restarts
- Auto-restart on crash (Railway)
- Logs captured in real-time

## 📁 Project Structure

```
.
├── server.js                # Main Express + WebSocket server
├── public/
│   ├── index.html          # Dashboard UI
│   ├── app.js              # Frontend application
│   └── styles.css          # Dashboard styling
├── projects/               # User projects storage
│   └── {projectId}/
│       ├── main.{ext}      # Main file
│       ├── metadata.json   # Project metadata
│       └── *.{files}       # Other project files
├── deployments/            # Deployed app copies
│   └── {deploymentId}/
│       └── {project copy}
├── uploads/                # Temp upload storage
├── package.json
├── Dockerfile
├── railway.json
└── README.md
```

## 🔐 Environment Variables

```env
PORT=5000                      # Server port
NODE_ENV=production            # Environment
DOMAIN=your-domain.app         # Public domain for subdomains
```

## 🚂 Railway Deployment

### Deploy with Railway CLI

```bash
# Install Railway CLI
curl -fsSL https://railway.app/install.sh | bash

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Monitor Deployment
```bash
# View logs
railway logs

# Check status
railway status

# View variables
railway variables
```

## 🔮 Future Enhancements

- [ ] User authentication & accounts
- [ ] Database integration (PostgreSQL)
- [ ] Environment variables per project
- [ ] Build scripts (npm, pip)
- [ ] Custom domains for apps
- [ ] Collaborative editing
- [ ] Git integration (GitHub sync)
- [ ] Docker support for projects
- [ ] Scheduled tasks & cron
- [ ] Monitoring & analytics
- [ ] API keys for automation
- [ ] Team/organization support

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report issues
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - Build amazing things!

## 🆘 Support

- **Issues**: GitHub Issues
- **Questions**: GitHub Discussions
- **Railway Support**: [railway.app](https://railway.app)

---

**Built with ❤️ for makers, creators, and developers**

Transform your ideas into live applications instantly! 🚀
