// File: routes/codeRoutes.js
const express = require('express');
const { 
  generateCode, 
  getModels, 
  getLanguagesAndFrameworks 
} = require('../controllers/codeController');

const router = express.Router();

// Code generation routes
router.route('/generate-code').post(generateCode);
router.route('/models').get(getModels);
router.route('/languages-frameworks').get(getLanguagesAndFrameworks);

module.exports = router;
    