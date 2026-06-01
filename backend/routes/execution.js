const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

// Mock executions database
let executions = [];

// Run code endpoint
router.post('/run', (req, res) => {
  const { code, language } = req.body;

  const execution = {
    id: Date.now().toString(),
    code,
    language,
    status: 'running',
    output: '',
    error: '',
    startTime: new Date()
  };

  executions.push(execution);

  // Simulate code execution
  setTimeout(() => {
    execution.status = 'completed';
    execution.output = 'Code executed successfully!';
    execution.endTime = new Date();
  }, 1000);

  res.status(201).json({ message: 'Execution started', executionId: execution.id });
});

// Get execution status
router.get('/:id', (req, res) => {
  const execution = executions.find(e => e.id === req.params.id);

  if (!execution) {
    return res.status(404).json({ message: 'Execution not found' });
  }

  res.json({ execution });
});

// Stop execution
router.post('/:id/stop', (req, res) => {
  const execution = executions.find(e => e.id === req.params.id);

  if (!execution) {
    return res.status(404).json({ message: 'Execution not found' });
  }

  execution.status = 'stopped';
  res.json({ message: 'Execution stopped', execution });
});

module.module.exports = router;