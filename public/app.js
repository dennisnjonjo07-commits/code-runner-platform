class CodeHostingApp {
  constructor() {
    this.currentProjectId = null;
    this.currentFile = null;
    this.socket = io();
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.loadProjects();
    this.setupSocketListeners();
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-container">
        <div class="header">
          <h1>🚀 Code Hosting Platform</h1>
          <div class="header-actions">
            <button class="btn btn-secondary btn-sm" onclick="window.app.showCreateProjectModal()">+ New Project</button>
          </div>
        </div>
        <div class="main-content">
          <div class="sidebar">
            <div class="sidebar-section">
              <div class="sidebar-title">Create</div>
              <button class="btn" onclick="window.app.showCreateProjectModal()">📝 Create Project</button>
              <button class="btn btn-secondary" onclick="window.app.showUploadModal()">📤 Upload Files</button>
            </div>
            <div class="sidebar-section">
              <div class="sidebar-title">Your Projects</div>
              <ul class="projects-list" id="projectsList"></ul>
            </div>
          </div>
          <div class="editor-panel">
            <div id="editorContent" class="editor-content">
              <div class="empty-state">
                <div class="empty-state-icon">🏄</div>
                <h2>Welcome to Code Hosting</h2>
                <p>Create a new project to get started.</p>
                <p style="color: #58a6ff; margin-top: 16px;">Your code runs live 24/7 on Railway</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Project Modal -->
      <div id="createModal" class="modal">
        <div class="modal-content">
          <div class="modal-title">🚀 Create New Project</div>
          <div class="form-group">
            <label>Project Name</label>
            <input type="text" id="projectName" placeholder="my-awesome-app">
          </div>
          <div class="form-group">
            <label>Language/Framework</label>
            <select id="projectLanguage">
              <option value="html">HTML/CSS/JS (Static)</option>
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python (Flask/HTTP)</option>
              <option value="java">Java</option>
              <option value="ruby">Ruby</option>
              <option value="go">Go</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <div class="form-group">
            <label>Code (Optional)</label>
            <textarea id="projectCode" placeholder="Paste your code here or leave blank for template..."></textarea>
          </div>
          <div class="modal-actions">
            <button class="btn btn-cancel" onclick="window.app.closeModal('createModal')">Cancel</button>
            <button class="btn btn-primary" onclick="window.app.createProject()">Create</button>
          </div>
        </div>
      </div>

      <!-- Upload Files Modal -->
      <div id="uploadModal" class="modal">
        <div class="modal-content">
          <div class="modal-title">📤 Upload Files</div>
          <div class="form-group">
            <label>Select Files</label>
            <input type="file" id="fileInput" multiple>
            <button class="btn btn-secondary" style="margin-top: 8px;" onclick="document.getElementById('fileInput').click()">Choose Files</button>
          </div>
          <div class="modal-actions">
            <button class="btn btn-cancel" onclick="window.app.closeModal('uploadModal')">Cancel</button>
            <button class="btn btn-primary" onclick="window.app.handleFileUpload()">Upload</button>
          </div>
        </div>
      </div>
    `;
  }

  async loadProjects() {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      const projectsList = document.getElementById('projectsList');
      
      if (!data.projects || data.projects.length === 0) {
        projectsList.innerHTML = '<li style="padding: 8px; color: #8b949e; font-size: 12px;">No projects yet</li>';
        return;
      }

      projectsList.innerHTML = data.projects.map(p => `
        <li class="project-item ${this.currentProjectId === p.id ? 'active' : ''}" onclick="window.app.selectProject('${p.id}')">
          <strong>${p.name}</strong>
          <small>${p.language}</small>
          ${p.deployed ? '<span class="badge">🟢 Live</span>' : '<span class="badge" style="background: #da3633;">⭕ Draft</span>'}
        </li>
      `).join('');
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  showCreateProjectModal() {
    document.getElementById('createModal').classList.add('active');
  }

  showUploadModal() {
    if (!this.currentProjectId) {
      alert('Please select a project first');
      return;
    }
    document.getElementById('uploadModal').classList.add('active');
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  async createProject() {
    const name = document.getElementById('projectName').value;
    const language = document.getElementById('projectLanguage').value;
    const code = document.getElementById('projectCode').value;

    if (!name) {
      alert('Please enter a project name');
      return;
    }

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, language, code })
      });
      const data = await response.json();
      
      this.closeModal('createModal');
      document.getElementById('projectName').value = '';
      document.getElementById('projectCode').value = '';
      
      alert(`✅ Project created!\n\nAfter deployment, it will be available at:\n${data.url}`);
      
      await this.loadProjects();
      this.selectProject(data.projectId);
    } catch (error) {
      alert('Error creating project: ' + error.message);
    }
  }

  async selectProject(projectId) {
    this.currentProjectId = projectId;
    await this.loadProjectFiles();
  }

  async loadProjectFiles() {
    try {
      const [filesRes, projectRes] = await Promise.all([
        fetch(`/api/projects/${this.currentProjectId}/files`),
        fetch(`/api/projects/${this.currentProjectId}`)
      ]);
      
      const filesData = await filesRes.json();
      const projectData = await projectRes.json();
      
      this.renderEditor(filesData.files, projectData);
      this.loadProjects();
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

  renderEditor(files, projectData) {
    const editorContent = document.getElementById('editorContent');
    this.currentFile = files[0];
    
    const deploymentUI = projectData.deployed ? `
      <div class="deployment-panel">
        <div class="deployment-header">
          <span style="font-weight: 600; color: #3fb950;">✓ Live & Deployed</span>
        </div>
        <div class="deployment-url">
          <a href="${projectData.liveUrl}" target="_blank">${projectData.liveUrl}</a>
          <span onclick="navigator.clipboard.writeText('${projectData.liveUrl}')" style="cursor: pointer; color: #58a6ff;">📋</span>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.app.stopDeployment()">⏹ Stop</button>
      </div>
    ` : `
      <div class="deployment-panel">
        <div style="margin-bottom: 12px;">
          <strong style="color: #c9d1d9;">Ready to Deploy?</strong>
          <p style="color: #8b949e; font-size: 12px; margin-top: 4px;">Your app will run live 24/7 on Railway</p>
        </div>
        <button class="btn" onclick="window.app.deployProject()" style="width: 100%;">🚀 Deploy Now</button>
      </div>
    `;

    editorContent.innerHTML = `
      <div class="code-editor">
        <div class="editor-tabs">
          ${files.map(f => `
            <button class="tab ${f === this.currentFile ? 'active' : ''}" onclick="window.app.switchFile('${f}')">
              ${f}
            </button>
          `).join('')}
        </div>
        <textarea class="editor" id="codeEditor" placeholder="Write your code here..."></textarea>
        <div class="editor-controls">
          <button class="btn btn-primary btn-sm" onclick="window.app.saveFile()">💾 Save</button>
          <button class="btn btn-secondary btn-sm" onclick="window.app.showUploadModal()">📤 Upload</button>
          <button class="btn btn-secondary btn-sm" onclick="window.app.runCode()">▶ Run Locally</button>
        </div>
      </div>
      <div class="output-panel">
        <div class="output-header">
          <span>Output & Logs</span>
          <div class="status">
            <span class="status-badge ${projectData.deployed ? 'running' : ''}"></span>
            ${projectData.deployed ? 'Running' : 'Stopped'}
          </div>
        </div>
        ${deploymentUI}
        <div class="terminal" id="terminal"></div>
      </div>
    `;

    this.loadFileContent(this.currentFile);
  }

  async loadFileContent(filename) {
    try {
      const response = await fetch(`/api/projects/${this.currentProjectId}/file/${filename}`);
      const data = await response.json();
      document.getElementById('codeEditor').value = data.content;
    } catch (error) {
      console.error('Error loading file:', error);
    }
  }

  switchFile(filename) {
    this.currentFile = filename;
    this.loadFileContent(filename);
  }

  async saveFile() {
    const content = document.getElementById('codeEditor').value;
    try {
      await fetch(`/api/projects/${this.currentProjectId}/file/${this.currentFile}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      alert('✅ File saved!');
    } catch (error) {
      alert('Error saving file: ' + error.message);
    }
  }

  async deployProject() {
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '<div class="loading"><div class="spinner"></div><br>🚀 Deploying...</div>';

    try {
      const response = await fetch(`/api/projects/${this.currentProjectId}/deploy`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        terminal.innerHTML = `
          <div class="terminal-line success">✅ Deployment successful!</div>
          <div class="terminal-line"></div>
          <div class="terminal-line">🌐 Live URL: <a href="${data.liveUrl}" target="_blank" style="color: #58a6ff;">${data.liveUrl}</a></div>
          <div class="terminal-line">⏱ Your app is now running 24/7</div>
          <div class="terminal-line">📍 Visit the URL to see your live application</div>
        `;
        await this.loadProjectFiles();
      } else {
        terminal.innerHTML = `<div class="terminal-line error">❌ Deployment failed: ${data.error}</div>`;
      }
    } catch (error) {
      const terminal = document.getElementById('terminal');
      if (terminal) {
        terminal.innerHTML = `<div class="terminal-line error">Error: ${error.message}</div>`;
      }
    }
  }

  async stopDeployment() {
    if (confirm('Stop deployment? The app will no longer be accessible.')) {
      try {
        // Find deployment ID
        const projectRes = await fetch(`/api/projects/${this.currentProjectId}`);
        const projectData = await projectRes.json();
        
        await fetch(`/api/deployments/${projectData.deploymentId}/stop`, { method: 'POST' });
        await this.loadProjectFiles();
        alert('✅ Deployment stopped');
      } catch (error) {
        alert('Error stopping deployment: ' + error.message);
      }
    }
  }

  runCode() {
    this.saveFile();
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '<div class="loading"><div class="spinner"></div> Running...</div>';
    this.socket.emit('start-terminal', { projectId: this.currentProjectId });
  }

  async handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    
    if (!files.length) {
      alert('Please select files');
      return;
    }

    for (let file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', this.currentProjectId);
      
      try {
        await fetch('/api/projects/upload', {
          method: 'POST',
          body: formData
        });
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    this.closeModal('uploadModal');
    fileInput.value = '';
    await this.loadProjectFiles();
  }

  setupSocketListeners() {
    this.socket.on('terminal-output', (msg) => {
      const terminal = document.getElementById('terminal');
      if (terminal) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = msg.data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;
      }
    });

    this.socket.on('terminal-error', (msg) => {
      const terminal = document.getElementById('terminal');
      if (terminal) {
        const line = document.createElement('div');
        line.className = 'terminal-line error';
        line.textContent = 'Error: ' + msg.error;
        terminal.appendChild(line);
      }
    });

    this.socket.on('deployment-log', (msg) => {
      const terminal = document.getElementById('terminal');
      if (terminal) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = msg.message;
        terminal.appendChild(line);
      }
    });
  }
}

window.app = new CodeHostingApp();
