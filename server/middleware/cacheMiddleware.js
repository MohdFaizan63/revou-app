// Simple in-memory cache for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes default

// Cache middleware
const cacheMiddleware = (duration = CACHE_TTL) => {
  return (req, res, next) => {
    // Skip cache for authenticated requests or POST/PUT/DELETE requests
    if (req.headers.authorization || ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < duration) {
      // Add cache headers
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', `public, max-age=${Math.floor(duration / 1000)}`);
      return res.json(cachedResponse.data);
    }
    
    // Store original res.json method
    const originalJson = res.json;
    
    // Override res.json method to cache the response
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, {
          data,
          timestamp: Date.now()
        });
        
        // Clean up old cache entries (keep only last 100 entries)
        if (cache.size > 100) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
      }
      
      // Add cache headers
      res.set('X-Cache', 'MISS');
      res.set('Cache-Control', `public, max-age=${Math.floor(duration / 1000)}`);
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Clear cache function (useful for admin operations)
const clearCache = () => {
  cache.clear();
  console.log('Cache cleared');
};

// Get cache stats
const getCacheStats = () => {
  return {
    size: cache.size,
    entries: Array.from(cache.keys())
  };
};

module.exports = {
  cacheMiddleware,
  clearCache,
  getCacheStats
};
