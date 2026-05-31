const express = require('express');
const { spawnSync, spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const executions = new Map();
const activeProcesses = new Map();

// Execute code
router.post('/run', (req, res) => {
  try {
    const { projectId, language, code } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code required' });
    }

    const executionId = uuidv4();
    const execution = {
      id: executionId,
      projectId,
      language,
      status: 'running',
      startTime: new Date(),
      logs: [],
      errors: [],
      output: ''
    };

    executions.set(executionId, execution);

    // Execute asynchronously
    runCode(executionId, language, code, req.app.io, token);

    res.status(202).json({
      message: 'Code execution started',
      executionId,
      status: 'running'
    });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

// Get execution status
router.get('/:executionId', (req, res) => {
  try {
    const execution = executions.get(req.params.executionId);
    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }
    res.json(execution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch execution' });
  }
});

// Stop execution
router.post('/:executionId/stop', (req, res) => {
  try {
    const process = activeProcesses.get(req.params.executionId);
    const execution = executions.get(req.params.executionId);

    if (process) {
      process.kill();
      activeProcesses.delete(req.params.executionId);
    }

    if (execution) {
      execution.status = 'stopped';
      execution.endTime = new Date();
    }

    res.json({ message: 'Execution stopped' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop execution' });
  }
});

function runCode(executionId, language, code, io, token) {
  const execution = executions.get(executionId);
  const uploadDir = path.join(__dirname, '../../uploads', executionId);

  // Create execution directory
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let process;
  let timeout;

  try {
    const maxTimeout = 60000; // 60 seconds
    timeout = setTimeout(() => {
      if (process) process.kill();
      execution.status = 'timeout';
      execution.errors.push('Execution timeout: exceeded 60 seconds');
      execution.endTime = new Date();
      io.to(`execution:${executionId}`).emit('execution_update', execution);
    }, maxTimeout);

    switch (language) {
      case 'python':
        executePython(executionId, code, uploadDir, execution, io, token, process, timeout);
        break;
      case 'javascript':
        executeNode(executionId, code, uploadDir, execution, io, token, process, timeout);
        break;
      case 'java':
        executeJava(executionId, code, uploadDir, execution, io, token, process, timeout);
        break;
      case 'ruby':
        executeRuby(executionId, code, uploadDir, execution, io, token, process, timeout);
        break;
      case 'rust':
        executeRust(executionId, code, uploadDir, execution, io, token, process, timeout);
        break;
      case 'html':
        executeHTML(executionId, code, uploadDir, execution, io, token);
        break;
      default:
        execution.status = 'error';
        execution.errors.push(`Unsupported language: ${language}`);
        execution.endTime = new Date();
        io.to(`execution:${executionId}`).emit('execution_update', execution);
    }
  } catch (error) {
    clearTimeout(timeout);
    execution.status = 'error';
    execution.errors.push(error.message);
    execution.endTime = new Date();
    io.to(`execution:${executionId}`).emit('execution_update', execution);
  }
}

function executePython(executionId, code, uploadDir, execution, io, token, proc, timeout) {
  const scriptPath = path.join(uploadDir, 'script.py');
  fs.writeFileSync(scriptPath, code);

  const process = spawn('python3', [scriptPath]);
  activeProcesses.set(executionId, process);

  process.stdout.on('data', (data) => {
    execution.output += data.toString();
    execution.logs.push({ type: 'stdout', message: data.toString() });
    io.to(`execution:${executionId}`).emit('log', { type: 'stdout', message: data.toString() });
  });

  process.stderr.on('data', (data) => {
    execution.errors.push(data.toString());
    execution.logs.push({ type: 'stderr', message: data.toString() });
    io.to(`execution:${executionId}`).emit('log', { type: 'stderr', message: data.toString() });
  });

  process.on('close', (code) => {
    clearTimeout(timeout);
    execution.status = code === 0 ? 'completed' : 'error';
    execution.exitCode = code;
    execution.endTime = new Date();
    activeProcesses.delete(executionId);
    io.to(`execution:${executionId}`).emit('execution_update', execution);
  });
}

function executeNode(executionId, code, uploadDir, execution, io, token, proc, timeout) {
  const scriptPath = path.join(uploadDir, 'script.js');
  fs.writeFileSync(scriptPath, code);

  const process = spawn('node', [scriptPath]);
  activeProcesses.set(executionId, process);

  process.stdout.on('data', (data) => {
    execution.output += data.toString();
    execution.logs.push({ type: 'stdout', message: data.toString() });
    io.to(`execution:${executionId}`).emit('log', { type: 'stdout', message: data.toString() });
  });

  process.stderr.on('data', (data) => {
    execution.errors.push(data.toString());
    execution.logs.push({ type: 'stderr', message: data.toString() });
    io.to(`execution:${executionId}`).emit('log', { type: 'stderr', message: data.toString() });
  });

  process.on('close', (code) => {
    clearTimeout(timeout);
    execution.status = code === 0 ? 'completed' : 'error';
    execution.exitCode = code;
    execution.endTime = new Date();
    activeProcesses.delete(executionId);
    io.to(`execution:${executionId}`).emit('execution_update', execution);
  });
}

function executeJava(executionId, code, uploadDir, execution, io, token, proc, timeout) {
  execution.logs.push({ type: 'info', message: 'Java execution requires compilation' });
  io.to(`execution:${executionId}`).emit('log', { type: 'info', message: 'Java execution setup' });
  
  const scriptPath = path.join(uploadDir, 'Main.java');
  fs.writeFileSync(scriptPath, code);

  // Compile
  const compile = spawn('javac', [scriptPath]);
  let compiled = true;

  compile.stderr.on('data', (data) => {
    compiled = false;
    execution.errors.push(data.toString());
    io.to(`execution:${executionId}`).emit('log', { type: 'stderr', message: data.toString() });
  });

  compile.on('close', () => {
    if (compiled) {
      // Run
      const process = spawn('java', ['-cp', uploadDir, 'Main']);
      activeProcesses.set(executionId, process);

      process.stdout.on('data', (data) => {
        execution.output += data.toString();
        io.to(`execution:${executionId}`).emit('log', { type: 'stdout', message: data.toString() });
      });

      process.stderr.on('data', (data) => {
        execution.errors.push(data.toString());
        io.to(`execution:${executionId}`).emit('log', { type: 'stderr', message: data.toString() });
      });

      process.on('close', (code) => {
        clearTimeout(timeout);
        execution.status = code === 0 ? 'completed' : 'error';
        execution.exitCode = code;
        execution.endTime = new Date();
        activeProcesses.delete(executionId);
        io.to(`execution:${executionId}`).emit('execution_update', execution);
      });
    } else {
      clearTimeout(timeout);
      execution.status = 'error';
      execution.endTime = new Date();
      io.to(`execution:${executionId}`).emit('execution_update', execution);
    }
  });
}

function executeRuby(executionId, code, uploadDir, execution, io, token, proc, timeout) {
  const scriptPath = path.join(uploadDir, 'script.rb');
  fs.writeFileSync(scriptPath, code);

  const process = spawn('ruby', [scriptPath]);
  activeProcesses.set(executionId, process);

  process.stdout.on('data', (data) => {
    execution.output += data.toString();
    io.to(`execution:${executionId}`).emit('log', { type: 'stdout', message: data.toString() });
  });

  process.stderr.on('data', (data) => {
    execution.errors.push(data.toString());
    io.to(`execution:${executionId}`).emit('log', { type: 'stderr', message: data.toString() });
  });

  process.on('close', (code) => {
    clearTimeout(timeout);
    execution.status = code === 0 ? 'completed' : 'error';
    execution.exitCode = code;
    execution.endTime = new Date();
    activeProcesses.delete(executionId);
    io.to(`execution:${executionId}`).emit('execution_update', execution);
  });
}

function executeRust(executionId, code, uploadDir, execution, io, token, proc, timeout) {
  execution.logs.push({ type: 'info', message: 'Rust execution requires compilation' });
  const scriptPath = path.join(uploadDir, 'main.rs');
  fs.writeFileSync(scriptPath, code);

  const compile = spawn('rustc', [scriptPath, '-o', path.join(uploadDir, 'main')]);
  let compiled = true;

  compile.stderr.on('data', (data) => {
    compiled = false;
    execution.errors.push(data.toString());
    io.to(`execution:${executionId}`).emit('log', { type: 'stderr', message: data.toString() });
  });

  compile.on('close', () => {
    if (compiled) {
      const process = spawn(path.join(uploadDir, 'main'));
      activeProcesses.set(executionId, process);

      process.stdout.on('data', (data) => {
        execution.output += data.toString();
        io.to(`execution:${executionId}`).emit('log', { type: 'stdout', message: data.toString() });
      });

      process.stderr.on('data', (data) => {
        execution.errors.push(data.toString());
        io.to(`execution:${executionId}`).emit('log', { type: 'stderr', message: data.toString() });
      });

      process.on('close', (code) => {
        clearTimeout(timeout);
        execution.status = code === 0 ? 'completed' : 'error';
        execution.exitCode = code;
        execution.endTime = new Date();
        activeProcesses.delete(executionId);
        io.to(`execution:${executionId}`).emit('execution_update', execution);
      });
    } else {
      clearTimeout(timeout);
      execution.status = 'error';
      execution.endTime = new Date();
      io.to(`execution:${executionId}`).emit('execution_update', execution);
    }
  });
}

function executeHTML(executionId, code, uploadDir, execution, io, token) {
  const htmlPath = path.join(uploadDir, 'index.html');
  fs.writeFileSync(htmlPath, code);
  execution.status = 'completed';
  execution.output = `HTML file created at: /uploads/${executionId}/index.html`;
  execution.endTime = new Date();
  io.to(`execution:${executionId}`).emit('log', { type: 'stdout', message: `HTML file ready at /uploads/${executionId}/index.html` });
  io.to(`execution:${executionId}`).emit('execution_update', execution);
}

module.exports = router;
