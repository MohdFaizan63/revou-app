const express = require('express');
const {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  claimEntity,
  getCategories,
  toggleBookmark,
  checkBookmark,
  instantSearch
} = require('../controllers/entityController');
const { protect, optionalAuth } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');
const { handleUpload } = require('../middleware/upload');


const router = express.Router();

// Simple validation middleware
const validateEntity = (req, res, next) => {
  const { name, description, category } = req.body;
  
  // Debug logging (remove in production)
  // console.log('Validation - req.body:', req.body);
  // console.log('Validation - name:', name);
  // console.log('Validation - description:', description);
  // console.log('Validation - category:', category);
  
  if (!name || (typeof name === 'string' && name.trim().length === 0)) {
    return res.status(400).json({ message: 'Entity name is required' });
  }
  
  if (typeof name === 'string' && name.length > 200) {
    return res.status(400).json({ message: 'Name cannot exceed 200 characters' });
  }
  
  if (!description || (typeof description === 'string' && description.trim().length === 0)) {
    return res.status(400).json({ message: 'Description is required' });
  }
  
  if (typeof description === 'string' && description.length > 1000) {
    return res.status(400).json({ message: 'Description cannot exceed 1000 characters' });
  }
  
  const validCategories = ['place', 'app', 'website', 'movie', 'product', 'service', 'restaurant', 'hospital', 'government'];
  if (!category || !validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  
  next();
};

// Public routes (no authentication required)
router.get('/', cacheMiddleware(2 * 60 * 1000), getEntities); // 2 minutes cache
router.get('/instant', cacheMiddleware(1 * 60 * 1000), instantSearch); // 1 minute cache
router.get('/categories', cacheMiddleware(10 * 60 * 1000), getCategories); // 10 minutes cache
router.get('/:id', cacheMiddleware(5 * 60 * 1000), getEntity); // 5 minutes cache

// Protected routes (authentication required)
router.post('/', protect, handleUpload, validateEntity, createEntity);
router.put('/:id', protect, validateEntity, updateEntity);
router.delete('/:id', protect, deleteEntity);
router.post('/:id/claim', protect, claimEntity);

// Bookmark routes
router.post('/:id/bookmark', protect, toggleBookmark);
router.get('/:id/bookmark', protect, checkBookmark);

module.exports = router;