const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const { spawn, exec } = require('child_process');
const pty = require('node-pty');
const httpProxy = require('http-proxy');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const DOMAIN = process.env.DOMAIN || 'localhost:5000';

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Storage directories
const projectsDir = path.join(__dirname, 'projects');
const uploadsDir = path.join(__dirname, 'uploads');
const deployDir = path.join(__dirname, 'deployments');

[projectsDir, uploadsDir, deployDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer configuration
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// Track active projects, terminals, and deployed apps
const activeProjects = new Map();
const activeTerminals = new Map();
const deployedApps = new Map();

// ==================== HOSTING & DEPLOYMENT ====================

// Get available port for new deployment
function getAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const testServer = http.createServer();
    testServer.listen(startPort, () => {
      testServer.close(() => resolve(startPort));
    });
    testServer.on('error', () => resolve(getAvailablePort(startPort + 1)));
  });
}

// Deploy application
async function deployApplication(projectId, projectPath) {
  try {
    const metadata = JSON.parse(fs.readFileSync(path.join(projectPath, 'metadata.json'), 'utf-8'));
    const port = await getAvailablePort();
    const deploymentId = `${projectId}-${Date.now()}`;
    const deployPath = path.join(deployDir, deploymentId);

    // Copy project to deployment directory
    require('child_process').execSync(`cp -r "${projectPath}" "${deployPath}"`);

    const appInfo = {
      projectId,
      deploymentId,
      port,
      path: deployPath,
      language: metadata.language,
      name: metadata.name,
      url: `${projectId}.${DOMAIN}`,
      status: 'starting',
      startedAt: new Date(),
      process: null
    };

    // Start application based on language
    const process = await startApplication(deployPath, metadata.language, port, io);
    appInfo.process = process;
    appInfo.status = 'running';

    deployedApps.set(deploymentId, appInfo);

    // Save deployment metadata
    fs.writeFileSync(
      path.join(deployPath, 'deployment.json'),
      JSON.stringify({ ...appInfo, process: null }, null, 2)
    );

    return { success: true, deploymentId, appInfo };
  } catch (error) {
    console.error('Deployment error:', error);
    return { success: false, error: error.message };
  }
}

// Start application process
function startApplication(projectPath, language, port, io) {
  return new Promise((resolve, reject) => {
    let processRef;

    try {
      // Install dependencies if needed
      if (language === 'javascript' || language === 'nodejs') {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          exec(`cd "${projectPath}" && npm install`, (err) => {
            if (err) console.error('npm install error:', err);
          });
        }
      }

      let command = '';
      const env = { ...process.env, PORT: port };

      switch (language) {
        case 'javascript':
        case 'nodejs':
          command = `node main.js`;
          break;
        case 'python':
          command = `python3 main.py`;
          break;
        case 'html':
          // Serve HTML with simple server
          command = `npx http-server . -p ${port}`;
          break;
        case 'java':
          command = `java main`;
          break;
        case 'ruby':
          command = `ruby main.rb`;
          break;
        case 'go':
          command = `go run main.go`;
          break;
        default:
          command = `node main.js`;
      }

      processRef = spawn('bash', ['-c', command], {
        cwd: projectPath,
        env,
        detached: true
      });

      processRef.stdout.on('data', (data) => {
        console.log(`[${language}] stdout:`, data.toString());
        io.emit('deployment-log', { message: data.toString() });
      });

      processRef.stderr.on('data', (data) => {
        console.log(`[${language}] stderr:`, data.toString());
        io.emit('deployment-log', { message: data.toString() });
      });

      // Wait for port to be ready
      setTimeout(() => resolve(processRef), 2000);
    } catch (error) {
      reject(error);
    }
  });
}

// Stop deployment
function stopDeployment(deploymentId) {
  if (deployedApps.has(deploymentId)) {
    const app = deployedApps.get(deploymentId);
    if (app.process) {
      try {
        process.kill(-app.process.pid);
      } catch (e) {
        console.error('Error killing process:', e);
      }
    }
    deployedApps.delete(deploymentId);
  }
}

// ==================== API ROUTES ====================

// Create new project from code paste
app.post('/api/projects/create', (req, res) => {
  const { name, language, code } = req.body;
  const projectId = uuidv4().substring(0, 8);
  const projectPath = path.join(projectsDir, projectId);

  try {
    fs.mkdirSync(projectPath, { recursive: true });
    
    const fileExtensions = {
      'javascript': 'js',
      'nodejs': 'js',
      'python': 'py',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'ruby': 'rb',
      'php': 'php',
      'go': 'go',
      'rust': 'rs',
      'html': 'html'
    };

    const ext = fileExtensions[language] || 'txt';
    const filename = `main.${ext}`;
    
    // Create main file
    let defaultCode = code || getDefaultCode(language);
    fs.writeFileSync(path.join(projectPath, filename), defaultCode);

    // Create metadata
    fs.writeFileSync(path.join(projectPath, 'metadata.json'), JSON.stringify({
      id: projectId,
      name,
      language,
      createdAt: new Date(),
      files: [filename],
      deployed: false,
      deploymentId: null
    }, null, 2));

    activeProjects.set(projectId, {
      path: projectPath,
      name,
      language,
      createdAt: new Date()
    });

    res.json({ 
      projectId, 
      message: 'Project created successfully',
      url: `https://${projectId}.${DOMAIN}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get default code for language
function getDefaultCode(language) {
  const defaults = {
    'javascript': `// Node.js Server\nconst http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Hello World! 🎉</h1>');
});

server.listen(port, () => {
  console.log('Server running on port', port);
});`,
    'python': `# Python Web Server\nfrom http.server import HTTPServer, SimpleHTTPRequestHandler
import os

port = int(os.environ.get('PORT', 3000))

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<h1>Hello World! 🎉</h1>')

server = HTTPServer(('0.0.0.0', port), MyHandler)
print(f'Server running on port {port}')
server.serve_forever()`,
    'html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      text-align: center;
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    h1 { color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 Hello World!</h1>
    <p>Your website is live and deployed!</p>
  </div>
</body>
</html>`,
    'ruby': `# Ruby Web Server\nrequire 'webrick'

port = ENV['PORT'].to_i || 3000
server = WEBrick::HTTPServer.new(:Port => port)

server.mount_proc '/' do |req, res|
  res['Content-Type'] = 'text/html'
  res.body = '<h1>Hello World! 🎉</h1>'
end

server.start`,
    'go': `package main

import (
    "fmt"
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "<h1>Hello World! 🎉</h1>")
    })

    fmt.Printf("Server running on port %s\\n", port)
    http.ListenAndServe(":" + port, nil)
}`
  };

  return defaults[language] || '// Your code here';
}

// Deploy project
app.post('/api/projects/:projectId/deploy', async (req, res) => {
  const { projectId } = req.params;
  const projectPath = path.join(projectsDir, projectId);

  if (!fs.existsSync(projectPath)) {
    return res.status(404).json({ error: 'Project not found' });
  }

  try {
    const result = await deployApplication(projectId, projectPath);
    if (result.success) {
      // Update metadata
      const metadata = JSON.parse(fs.readFileSync(path.join(projectPath, 'metadata.json'), 'utf-8'));
      metadata.deployed = true;
      metadata.deploymentId = result.deploymentId;
      metadata.deployedAt = new Date();
      metadata.liveUrl = result.appInfo.url;
      fs.writeFileSync(path.join(projectPath, 'metadata.json'), JSON.stringify(metadata, null, 2));

      res.json({
        success: true,
        deploymentId: result.deploymentId,
        liveUrl: result.appInfo.url,
        message: `App deployed and running at ${result.appInfo.url}`
      });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deployment status
app.get('/api/deployments/:deploymentId/status', (req, res) => {
  const { deploymentId } = req.params;
  if (deployedApps.has(deploymentId)) {
    const app = deployedApps.get(deploymentId);
    res.json({
      status: app.status,
      url: app.url,
      startedAt: app.startedAt,
      port: app.port
    });
  } else {
    res.status(404).json({ error: 'Deployment not found' });
  }
});

// Stop deployment
app.post('/api/deployments/:deploymentId/stop', (req, res) => {
  const { deploymentId } = req.params;
  stopDeployment(deploymentId);
  res.json({ message: 'Deployment stopped' });
});

// Upload files
app.post('/api/projects/upload', upload.single('file'), (req, res) => {
  const { projectId } = req.body;
  const projectPath = path.join(projectsDir, projectId);

  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
  }

  const uploadPath = path.join(uploadsDir, req.file.filename);
  const destPath = path.join(projectPath, req.file.originalname);

  fs.copyFileSync(uploadPath, destPath);
  fs.unlinkSync(uploadPath);

  res.json({ message: 'File uploaded', filename: req.file.originalname });
});

// Get project files
app.get('/api/projects/:projectId/files', (req, res) => {
  const { projectId } = req.params;
  const projectPath = path.join(projectsDir, projectId);

  if (!fs.existsSync(projectPath)) {
    return res.status(404).json({ error: 'Project not found' });
  }

  try {
    const files = fs.readdirSync(projectPath).filter(f => !f.startsWith('.') && f !== 'metadata.json' && f !== 'deployment.json');
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get file content
app.get('/api/projects/:projectId/file/:filename', (req, res) => {
  const { projectId, filename } = req.params;
  const filePath = path.join(projectsDir, projectId, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save file content
app.post('/api/projects/:projectId/file/:filename', (req, res) => {
  const { projectId, filename } = req.params;
  const { content } = req.body;
  const filePath = path.join(projectsDir, projectId, filename);

  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    res.json({ message: 'File saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = fs.readdirSync(projectsDir).map(id => {
      const metadataPath = path.join(projectsDir, id, 'metadata.json');
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        return { id, ...metadata };
      }
      return null;
    }).filter(Boolean);
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project details
app.get('/api/projects/:projectId', (req, res) => {
  const { projectId } = req.params;
  const metadataPath = path.join(projectsDir, projectId, 'metadata.json');

  if (!fs.existsSync(metadataPath)) {
    return res.status(404).json({ error: 'Project not found' });
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    res.json({ id: projectId, ...metadata });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all deployments
app.get('/api/deployments', (req, res) => {
  const deployments = Array.from(deployedApps.values()).map(app => ({
    deploymentId: app.deploymentId,
    projectId: app.projectId,
    name: app.name,
    language: app.language,
    status: app.status,
    url: app.url,
    startedAt: app.startedAt,
    port: app.port
  }));
  res.json({ deployments });
});

// ==================== REVERSE PROXY FOR DEPLOYED APPS ====================

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(502, { 'Content-Type': 'text/html' });
  res.end('<h1>502 Bad Gateway</h1><p>The application is temporarily unavailable.</p>');
});

// Handle subdomain routing for deployed apps
app.use((req, res, next) => {
  const host = req.get('host');
  const subdomain = host.split('.')[0];

  // Check if subdomain matches a deployed app
  for (const [deploymentId, app] of deployedApps.entries()) {
    if (app.projectId === subdomain && app.status === 'running') {
      return proxy.web(req, res, { target: `http://localhost:${app.port}` });
    }
  }

  next();
});

// ==================== SOCKET.IO ====================

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('start-terminal', ({ projectId, language }) => {
    const projectPath = path.join(projectsDir, projectId);
    
    let shell = '/bin/bash';
    let args = [];

    if (process.platform === 'win32') {
      shell = 'powershell.exe';
    }

    try {
      const ptyProcess = pty.spawn(shell, args, {
        name: 'xterm-color',
        cols: 120,
        rows: 30,
        cwd: projectPath
      });

      const terminalId = uuidv4();
      activeTerminals.set(terminalId, ptyProcess);
      socket.emit('terminal-ready', { terminalId });

      ptyProcess.onData(data => {
        socket.emit('terminal-output', { data: data.toString() });
      });

      socket.on('terminal-input', ({ data }) => {
        if (activeTerminals.has(terminalId)) {
          ptyProcess.write(data);
        }
      });

      socket.on('disconnect', () => {
        if (activeTerminals.has(terminalId)) {
          ptyProcess.kill();
          activeTerminals.delete(terminalId);
        }
      });
    } catch (error) {
      socket.emit('terminal-error', { error: error.message });
    }
  });
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`\n🚀 Code Hosting Platform running on port ${PORT}`);
  console.log(`📋 Dashboard: http://localhost:${PORT}`);
  console.log(`🌐 Domain: ${DOMAIN}\n`);
});

module.exports = server;
