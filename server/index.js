const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Set default environment variables for development if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'revuo_development_secret_key_2024_change_in_production';
  console.log('⚠️ Using default JWT_SECRET for development');
}

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/revuo';
  console.log('⚠️ Using default local MongoDB connection for development');
  console.log('💡 Make sure MongoDB is running locally or set MONGODB_URI in .env file');
}

if (!process.env.PORT) {
  process.env.PORT = '5005';
}

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('💡 Please check your .env file and ensure all required variables are set');
  process.exit(1);
}

// Debug environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Environment check:');
  console.log(`   PORT: ${process.env.PORT || '5000 (default)'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development (default)'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Not set'}`);
}

const authRoutes = require('./routes/auth');
const entityRoutes = require('./routes/entities');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');
const postRoutes = require('./routes/posts');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  } : false,
}));

// Compression middleware
app.use(compression());

// Rate limiting - environment-specific
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Lower limit in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// CORS configuration - environment-specific
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const { getCacheStats } = require('./middleware/cacheMiddleware');
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: mongoose.connection.readyState === 1,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    },
    cache: getCacheStats(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    }
  });
});

// Simple test endpoint (only in development)
if (process.env.NODE_ENV === 'development') {
  app.get('/api/test', (req, res) => {
    res.json({ 
      message: 'API is working!',
      timestamp: new Date().toISOString()
    });
  });
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error (only in development or if it's a server error)
  if (process.env.NODE_ENV === 'development' || err.status >= 500) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  }
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error',
      error: err.message
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      message: 'Invalid ID format',
      error: 'The provided ID is not valid'
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Invalid token',
      error: 'Please log in again'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: 'Token expired',
      error: 'Please log in again'
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// MongoDB connection options for Atlas
const mongoOptions = {
  maxPoolSize: process.env.NODE_ENV === 'production' ? 20 : 10,
  minPoolSize: process.env.NODE_ENV === 'production' ? 5 : 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  // Performance optimizations
  maxIdleTimeMS: 30000,
  compressors: ['zlib'],
  // Connection pool optimizations
  maxConnecting: 10,
  bufferCommands: true,
 




  

  // Read preferences for better performance
  readPreference: 'primaryPreferred',
  // Write concerns
  writeConcern: {
    w: 'majority',
    j: true
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/revuo', mongoOptions)
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
    }
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 API URL: http://localhost:${PORT}/api`);
        console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
      } else {
        console.log(`🚀 Production server running on port ${PORT}`);
      }
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Make sure your MONGODB_URI is correct in your .env file');
    
    // Start server even if MongoDB fails (for testing)
    console.log('⚠️  Starting server without MongoDB connection for testing...');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (without database)`);
    });
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});