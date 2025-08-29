const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getUserPosts
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');
const { handleUpload } = require('../middleware/upload');

const router = express.Router();

// Simple validation middleware
const validatePost = (req, res, next) => {
  const { content } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Post content is required' });
  }
  
  if (content.length > 1000) {
    return res.status(400).json({ message: 'Post content cannot exceed 1000 characters' });
  }
  
  next();
};

const validateComment = (req, res, next) => {
  const { content } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Comment content is required' });
  }
  
  if (content.length > 500) {
    return res.status(400).json({ message: 'Comment cannot exceed 500 characters' });
  }
  
  next();
};

// Public routes
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPost);
router.get('/user/:userId', optionalAuth, getUserPosts);

// Protected routes
router.post('/', protect, handleUpload.array('media', 10), validatePost, createPost);
router.put('/:id', protect, validatePost, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, validateComment, addComment);

module.exports = router;