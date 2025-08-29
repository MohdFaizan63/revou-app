const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Simple validation middleware
const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || username.length < 3 || username.length > 30) {
    return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Please enter a valid email' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Please enter a valid email' });
  }
  
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  
  next();
};

const validateProfile = (req, res, next) => {
  const { username, bio } = req.body;
  
  if (username && (username.length < 3 || username.length > 30)) {
    return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
  }
  
  if (bio && bio.length > 500) {
    return res.status(400).json({ message: 'Bio cannot exceed 500 characters' });
  }
  
  next();
};

const validatePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword) {
    return res.status(400).json({ message: 'Current password is required' });
  }
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }
  
  next();
};

// Routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validateProfile, updateProfile);
router.put('/password', protect, validatePassword, changePassword);

module.exports = router;
