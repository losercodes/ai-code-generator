// File: server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import middlewares
const { errorHandler, notFound } = require('./middleware/errorHandler');
const setupSecurityMiddleware = require('./middleware/security');

// Import routes
const routes = require('./routes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply middlewares
app.use(cors());
app.use(bodyParser.json());

// Setup security middleware
setupSecurityMiddleware(app);

// Apply routes
app.use('/', routes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
  const connectDB = require('./config/db');
  connectDB();
  
  // Import MongoDB routes
  const snippetRoutes = require('./routes/snippetRoutes');
  app.use('/api/snippets', snippetRoutes);
}

// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// For testing purposes
module.exports = app;