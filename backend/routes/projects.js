const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const projects = new Map();

// Get all projects for user
router.get('/', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userProjects = Array.from(projects.values()).filter(p => p.token === token);
    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
router.post('/', (req, res) => {
  try {
    const { name, description, language } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!name || !language) {
      return res.status(400).json({ error: 'Name and language required' });
    }

    const projectId = uuidv4();
    const project = {
      id: projectId,
      name,
      description: description || '',
      language,
      token,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'stopped',
      executions: []
    };

    projects.set(projectId, project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get single project
router.get('/:id', (req, res) => {
  try {
    const project = projects.get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const project = projects.get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    Object.assign(project, req.body, { updatedAt: new Date() });
    projects.set(req.params.id, project);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const deleted = projects.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
