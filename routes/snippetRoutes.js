// File: routes/snippetRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CodeSnippet = require('../models/CodeSnippet');

// @desc    Save a new code snippet
// @route   POST /api/snippets
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, code, language, framework } = req.body;
    
    if (!title || !code) {
      return res.status(400).json({
        success: false,
        error: 'Title and code are required'
      });
    }
    
    const snippet = await CodeSnippet.create({
      title,
      description,
      code,
      language,
      framework,
      user: req.user.id // Link snippet to the user who created it
    });
    
    res.status(201).json({
      success: true,
      data: snippet
    });
  } catch (error) {
    console.error('Error saving snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save snippet'
    });
  }
});

// @desc    Get all snippets
// @route   GET /api/snippets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const snippets = await CodeSnippet.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: snippets.length,
      data: snippets
    });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch snippets'
    });
  }
});

// @desc    Get snippet by ID
// @route   GET /api/snippets/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);
    
    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }
    
    // Check if the snippet belongs to the user
    if (snippet.user && snippet.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this snippet'
      });
    }
    
    res.json({
      success: true,
      data: snippet
    });
  } catch (error) {
    console.error('Error fetching snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch snippet'
    });
  }
});

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let snippet = await CodeSnippet.findById(req.params.id);
    
    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }
    
    // Check if the snippet belongs to the user
    if (snippet.user && snippet.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this snippet'
      });
    }
    
    snippet = await CodeSnippet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: snippet
    });
  } catch (error) {
    console.error('Error updating snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update snippet'
    });
  }
});

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const snippet = await CodeSnippet.findById(req.params.id);
    
    if (!snippet) {
      return res.status(404).json({
        success: false,
        error: 'Snippet not found'
      });
    }
    
    // Check if the snippet belongs to the user
    if (snippet.user && snippet.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this snippet'
      });
    }
    
    await snippet.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete snippet'
    });
  }
});

module.exports = router;