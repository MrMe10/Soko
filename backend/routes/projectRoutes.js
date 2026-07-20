const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET: /api/projects - Fetch all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
});

// POST: /api/projects - Create a new project
router.post('/', async (req, res) => {
  try {
    const { name, description, type } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const newProject = await Project.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      type: type || 'separate'
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
});

module.exports = router;
