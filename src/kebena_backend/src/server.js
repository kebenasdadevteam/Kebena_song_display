const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Import database
const db = require('./config/database');

// Create Express app
const app = express();

// ===========================================
// MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===========================================
// ROUTES
// ===========================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kebena Church API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/settings', settingsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Kebena Seventh-Day Adventist Church Song Display API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      songs: '/api/songs'
    },
    documentation: 'See README.md for API documentation'
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Determine error status
  const status = err.status || err.statusCode || 500;
  
  // Determine error message
  let message = 'Internal server error';
  if (process.env.NODE_ENV === 'development') {
    message = err.message || message;
  } else if (status !== 500) {
    message = err.message || message;
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🎵 KEBENA SEVENTH-DAY ADVENTIST CHURCH SONG DISPLAY API');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Endpoints:`);
  console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`   - Songs: http://localhost:${PORT}/api/songs`);
  console.log(`\n💾 Database: ${process.env.DB_NAME || 'kebena_church_db'}`);
  console.log(`🔒 CORS Origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('\n✅ Server is ready to accept requests');
  console.log('═══════════════════════════════════════════════════════════\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📴 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📴 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;