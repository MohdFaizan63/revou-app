const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/auth')
const { handleAvatarUpload } = require('../middleware/upload')
const {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getUserReviews,
  getUserBookmarks,
  getUserActivity,
  deleteUserAccount
} = require('../controllers/userController')

// All routes require authentication
router.use(protect)

// Get user profile
router.get('/profile', getUserProfile)

// Update user profile
router.put('/profile', updateUserProfile)

// Upload avatar (with file upload middleware)
router.post('/avatar', handleAvatarUpload, uploadAvatar)

// Get user reviews
router.get('/reviews', getUserReviews)

// Get user bookmarks
router.get('/bookmarks', getUserBookmarks)

// Get user activity
router.get('/activity', getUserActivity)

// Delete user account
router.delete('/account', deleteUserAccount)

module.exports = router