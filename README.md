# CodeRunner - Multi-Language Code Execution Platform

## 🚀 Features

- **Multi-Language Support**: Execute code in Python, JavaScript, Java, Ruby, Rust, and HTML/CSS
- **Multiple Input Methods**:
  - Direct code editor
  - File upload
  - ZIP file extraction
- **Real-Time Logging**: View execution logs and errors in real-time
- **User Authentication**: Secure login and registration system
- **Background Execution**: Projects run 24/7 even after logout
- **Full-Screen UI**: Smooth, responsive interface with zero lag
- **Project Management**: Create, save, and manage your code projects
- **Docker Support**: Easy deployment with Docker
- **Cloud Ready**: Deploy to Railway or Render with one click

## 🚀 Quick Deploy (Recommended)

### Option 1: Deploy to Railway (Easiest) ⭐
```bash
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select this repository
4. Railway auto-detects and deploys!
5. Your app is live in 2 minutes
```

📖 See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed guide

### Option 2: Deploy to Render
```bash
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Render auto-deploys on every push
```

📖 See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed guide

### Option 3: Docker (Local/VPS)
```bash
# Clone and start with Docker
git clone https://github.com/dennisnjonjo07-commits/code-runner-platform.git
cd code-runner-platform
chmod +x docker-run.sh
./docker-run.sh

# Access at http://localhost:5000
```

📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for all options

---

## 📋 Prerequisites (for Local Development)

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (optional, for containerized deployment)
- Python 3, Java, Ruby, Rust (optional, only if running locally)

## 🛠️ Local Installation

1. Clone the repository:
```bash
git clone https://github.com/dennisnjonjo07-commits/code-runner-platform.git
cd code-runner-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5000`

## 📁 Project Structure

```
code-runner-platform/
├── backend/
│   ├── server.js           # Express server entry point
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── projects.js     # Project CRUD routes
│   │   ├── execution.js    # Code execution routes
│   │   └── upload.js       # File upload routes
│   └── ...
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── styles.css      # All styles (full-screen, smooth animations)
│   └── js/
│       ├── app.js          # Main app logic
│       ├── auth.js         # Authentication logic
│       ├── editor.js       # Code editor logic
│       ├── execution.js    # Execution handler
│       └── api.js          # API client
├── Dockerfile              # Container definition
├── docker-compose.yml      # Docker services
├── package.json
├── deploy.sh               # Production deployment script
├── ecosystem.config.js     # PM2 configuration
├── .env.example
├── .gitignore
├── DEPLOYMENT.md           # Deployment guides
├── RAILWAY_DEPLOYMENT.md   # Railway specific guide
└── README.md
```

## 🔐 Authentication

- Register a new account
- Secure login with JWT tokens
- Session management
- Logout functionality
- Password hashing with bcrypt

## 💻 Supported Languages

| Language | File Extension | Status |
|----------|---|---|
| Python | .py | ✅ |
| JavaScript (Node.js) | .js | ✅ |
| Java | .java | ✅ |
| Ruby | .rb | ✅ |
| Rust | .rs | ✅ |
| HTML/CSS | .html, .css | ✅ |

## 🎯 Usage

### Create a New Project
1. Click "New Project" from the sidebar
2. Enter project name and select language
3. Choose input method:
   - **Upload File**: Upload a single code file
   - **Upload ZIP**: Extract and run zipped projects
   - **Code Editor**: Paste code directly
4. Click "Run Code" to execute

### View Execution Logs
- Real-time logs appear in the terminal panel
- See both stdout and stderr output
- View errors immediately
- Check execution status and duration

### Manage Projects
- View all projects in "My Projects"
- Click any project to edit and re-run
- Save projects for later use

## 🔌 WebSocket Events

### Client Events
- `subscribe_logs`: Subscribe to execution logs
- `run_code`: Execute code

### Server Events
- `log`: Real-time log message
- `execution_update`: Execution status update
- `error`: Execution error

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Execution
- `POST /api/execution/run` - Run code
- `GET /api/execution/:id` - Get execution status
- `POST /api/execution/:id/stop` - Stop execution

### Upload
- `POST /api/upload/file` - Upload single file
- `POST /api/upload/zip` - Upload and extract ZIP

## ⚙️ Configuration

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
EXEC_TIMEOUT=60000  # Execution timeout in milliseconds
MAX_MEMORY=512m     # Maximum memory per execution
CORS_ORIGIN=http://localhost:3000
```

## 🎨 UI Features

- **Full-Screen Design**: No split screens, maximized workspace
- **Smooth Animations**: CSS transitions for lag-free navigation
- **Dark Theme**: Eye-friendly interface
- **Responsive Layout**: Works on desktop and tablet
- **Real-Time Feedback**: Instant execution feedback
- **Intuitive Navigation**: Easy-to-use sidebar menu
- **Zero Lag**: Optimized performance

## 🔒 Security Features

- JWT token-based authentication
- Bcrypt password hashing
- Input validation
- CORS protection
- Helmet.js for security headers
- Execution isolation
- Timeout protection (60 seconds max)
- Rate limiting ready

## 📈 Performance

- Optimized database queries
- Efficient file handling
- Real-time WebSocket communication
- Asynchronous code execution
- Memory-limited execution environments
- Cluster mode support (PM2)

## 🐛 Troubleshooting

### Code doesn't execute
- Ensure required language runtime is installed
- Check execution logs for errors
- Verify syntax is correct
- Check timeout settings

### WebSocket connection fails
- Check if server is running
- Verify CORS settings
- Check browser console for errors
- Review firewall settings

### File upload fails
- Check file size (max 50MB)
- Ensure file format is supported
- Verify disk space
- Check upload directory permissions

### Deployment issues
- See [DEPLOYMENT.md](./DEPLOYMENT.md)
- Check platform-specific guides (Railway/Render)
- Review server logs

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - All deployment options
- [Railway Deployment](./RAILWAY_DEPLOYMENT.md) - Railway specific
- [Render Deployment](./RENDER_DEPLOYMENT.md) - Render specific
- [Docker Guide](./docker-compose.yml) - Local Docker setup

## 📝 License

MIT License - See LICENSE file

## 👨‍💻 Author

dennisnjonjo07-commits

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please create an issue on GitHub.

---

## ⚡ Quick Start Summary

**For Production (Railway/Render):**
1. Push code to GitHub ✅
2. Go to Railway.app or Render.com
3. Connect your repo
4. Done! Your app is live

**For Local Development:**
```bash
git clone <repo>
npm install
npm start
# Visit http://localhost:5000
```

**With Docker:**
```bash
./docker-run.sh
# Visit http://localhost:5000
```

Enjoy coding! 🚀
