const Review = require('../models/Review')
const Entity = require('../models/Entity')

// Create a new review
const createReview = async (req, res) => {
  try {
    const { entityId, rating, title, comment, tags } = req.body

    // Check if user already reviewed this entity
    const existingReview = await Review.findOne({
      entity: entityId,
      user: req.user._id
    })

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this entity' })
    }

    // Create the review
    const review = await Review.create({
      entity: entityId,
      user: req.user._id,
      rating,
      title,
      comment,
      tags: tags || []
    })

    // Populate user info
    await review.populate('user', 'username avatar')

    // Update entity rating
    await updateEntityRating(entityId)

    res.status(201).json(review)
  } catch (error) {
    console.error('Create review error:', error)
    res.status(500).json({ message: 'Server error creating review' })
  }
}

// Get reviews for an entity
const getEntityReviews = async (req, res) => {
  try {
    const { entityId } = req.params
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query

    const reviews = await Review.find({ entity: entityId })
      .populate('user', 'username avatar')
      .sort({ [sort]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await Review.countDocuments({ entity: entityId })

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReviews: count
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ message: 'Server error getting reviews' })
  }
}

// Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params
    const { rating, title, comment, tags } = req.body

    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' })
    }

    // Update the review
    review.rating = rating
    review.title = title
    review.comment = comment
    review.tags = tags || []
    review.updatedAt = Date.now()

    await review.save()
    await review.populate('user', 'username avatar')

    // Update entity rating
    await updateEntityRating(review.entity)

    res.json(review)
  } catch (error) {
    console.error('Update review error:', error)
    res.status(500).json({ message: 'Server error updating review' })
  }
}

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params

    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
    }

    const entityId = review.entity
    await review.remove()

    // Update entity rating
    await updateEntityRating(entityId)

    res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Delete review error:', error)
    res.status(500).json({ message: 'Server error deleting review' })
  }
}

// Vote on a review
const voteReview = async (req, res) => {
  try {
    const { id } = req.params
    const { voteType } = req.body

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' })
    }

    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if user is voting on their own review
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot vote on your own review' })
    }

    // Add or update vote
    await review.addVote(req.user._id, voteType)
    await review.populate('user', 'username avatar')

    res.json(review)
  } catch (error) {
    console.error('Vote review error:', error)
    res.status(500).json({ message: 'Server error voting on review' })
  }
}

// Remove vote from a review
const removeVote = async (req, res) => {
  try {
    const { id } = req.params

    const review = await Review.findById(id)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Remove vote
    await review.removeVote(req.user._id)
    await review.populate('user', 'username avatar')

    res.json(review)
  } catch (error) {
    console.error('Remove vote error:', error)
    res.status(500).json({ message: 'Server error removing vote' })
  }
}

// Helper function to update entity rating
const updateEntityRating = async (entityId) => {
  try {
    const { averageRating, totalReviews } = await Review.getAverageRating(entityId)
    
    await Entity.findByIdAndUpdate(entityId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews
    })
  } catch (error) {
    console.error('Update entity rating error:', error)
  }
}

module.exports = {
  createReview,
  getEntityReviews,
  updateReview,
  deleteReview,
  voteReview,
  removeVote
}