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

## 📋 Prerequisites

- Node.js 14+
- npm or yarn
- Python 3 (for Python execution)
- Java (for Java execution)
- Ruby (for Ruby execution)
- Rust (for Rust execution)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/dennisnjonjo07-commits/code-runner-platform.git
cd code-runner-platform
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
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
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔐 Authentication

- Register a new account
- Secure login with JWT tokens
- Session management
- Logout functionality

## 💻 Supported Languages

| Language | File Extension | Status |
|----------|---|---|
| Python | .py | ✅ |
| JavaScript (Node.js) | .js | ✅ |
| Java | .java | ✅ |
| Ruby | .rb | ✅ |
| Rust | .rs | ✅ |
| HTML/CSS | .html, .css | ✅ |

## 🚀 Usage

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
- **Responsive Layout**: Works on desktop (mobile coming soon)
- **Real-Time Feedback**: Instant execution feedback
- **Intuitive Navigation**: Easy-to-use sidebar menu

## 🔒 Security Features

- JWT token-based authentication
- Bcrypt password hashing
- Input validation
- CORS protection
- Helmet.js for security headers
- Execution isolation
- Timeout protection (60 seconds max)

## 📈 Performance

- Optimized database queries
- Efficient file handling
- Real-time WebSocket communication
- Asynchronous code execution
- Memory-limited execution environments

## 🐛 Troubleshooting

### Code doesn't execute
- Ensure required language runtime is installed
- Check execution logs for errors
- Verify syntax is correct

### WebSocket connection fails
- Check if server is running
- Verify CORS settings
- Check browser console for errors

### File upload fails
- Check file size (max 50MB)
- Ensure file format is supported
- Verify disk space

## 📝 License

MIT License - See LICENSE file

## 👨‍💻 Author

dennisnjonjo07-commits

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please create an issue on GitHub.
