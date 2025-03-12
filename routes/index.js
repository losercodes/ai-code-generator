// File: routes/index.js
const express = require('express');
const codeRoutes = require('./codeRoutes');

const router = express.Router();

// API routes
router.use('/api', codeRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running',
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;