const express = require('express')
const router = express.Router()
const {
  createReview,
  getEntityReviews,
  updateReview,
  deleteReview,
  voteReview,
  removeVote
} = require('../controllers/reviewController')
const { protect } = require('../middleware/auth')

// Public routes
router.get('/entity/:entityId', getEntityReviews)

// Protected routes
router.post('/', protect, createReview)
router.put('/:id', protect, updateReview)
router.delete('/:id', protect, deleteReview)
router.post('/:id/vote', protect, voteReview)
router.delete('/:id/vote', protect, removeVote)

module.exports = router