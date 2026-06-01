const express = require('express');
const router = express.Router();

// Mock projects database
let projects = [];

// Get all projects
router.get('/', (req, res) => {
  res.json({ projects });
});

// Create project
router.post('/', (req, res) => {
  const { name, language, code } = req.body;

  const project = {
    id: Date.now().toString(),
    name,
    language,
    code,
    createdAt: new Date()
  };

  projects.push(project);
  res.status(201).json({ message: 'Project created', project });
});

// Get project by ID
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json({ project });
});

// Update project
router.put('/:id', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  Object.assign(project, req.body);
  res.json({ message: 'Project updated', project });
});

// Delete project
router.delete('/:id', (req, res) => {
  const index = projects.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  projects.splice(index, 1);
  res.json({ message: 'Project deleted' });
});

module.exports = router;