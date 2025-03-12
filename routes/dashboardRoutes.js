// File: routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Protected dashboard route
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Welcome to your dashboard',
      user: req.user
    }
  });
});

module.exports = router;