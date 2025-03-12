// File: middleware/security.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// Apply security middleware
const setupSecurityMiddleware = (app) => {
  // Set security headers
  app.use(helmet());
  
  // Apply rate limiting to API routes
  app.use('/api', apiLimiter);
  
  // Disable X-Powered-By header
  app.disable('x-powered-by');
};

module.exports = setupSecurityMiddleware;