const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
  };
  const notFound = (req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
};

  
  module.exports = { errorHandler, notFound };
  
  // Add to server.js after routes are defined:
  /*
  const { errorHandler, notFound } = require('./middleware/errorHandler');
  const setupSecurityMiddleware = require('./middleware/security');
  
  // Setup security middleware
  setupSecurityMiddleware(app);
  

  app.use(notFound);
  app.use(errorHandler);
  */