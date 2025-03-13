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
const dashboardRoutes = require('./routes/dashboardRoutes'); // Ensure this exists
const snippetRoutes = require('./routes/snippetRoutes'); // Ensure this exists
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for rate limiting to work properly on Render
app.set("trust proxy", 1);

// Rate limit configuration
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  keyGenerator: (req) => req.ip, // Ensures proper IP tracking
});
app.use(limiter);

// Apply middlewares
app.use(cors());
app.use(bodyParser.json());

// Setup security middleware
setupSecurityMiddleware(app);

// Apply routes
app.use('/', routes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/snippets', snippetRoutes);

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
  connectDB();
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
