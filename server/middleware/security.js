const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting configurations
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      message: message || 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        message: message || 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limiters for different endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later.'
);

const entityLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20, // 20 requests
  'Too many entity operations, please try again later.'
);

const reviewLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 reviews
  'Too many review submissions, please try again later.'
);

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests, please try again later.'
);

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cloudinary.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim().replace(/[<>]/g, '');
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim().replace(/[<>]/g, '');
      }
    });
  }

  // Sanitize URL parameters
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = req.params[key].trim().replace(/[<>]/g, '');
      }
    });
  }

  next();
};

// Request size validation
const validateRequestSize = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      message: 'Request entity too large',
      maxSize: '10MB'
    });
  }

  next();
};

// Method validation
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const validateMethod = (req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      message: 'Method not allowed',
      allowedMethods
    });
  }
  next();
};

// API key validation (for external services)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Only validate for certain endpoints
  if (req.path.startsWith('/api/external') && !apiKey) {
    return res.status(401).json({
      message: 'API key required for external endpoints'
    });
  }
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

module.exports = {
  authLimiter,
  entityLimiter,
  reviewLimiter,
  generalLimiter,
  securityHeaders,
  sanitizeInput,
  validateRequestSize,
  validateMethod,
  validateApiKey,
  requestLogger
};
