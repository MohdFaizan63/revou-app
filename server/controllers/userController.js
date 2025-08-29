const User = require('../models/User')
const Review = require('../models/Review')
const Entity = require('../models/Entity')
const Bookmark = require('../models/Bookmark')
const cloudinary = require('cloudinary').v2

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Error getting user profile:', error)
    
    // Check if database is connected
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(503).json({ message: 'Database not connected. Please try again later.' })
    }
    
    res.status(500).json({ message: 'Server error' })
  }
}

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, firstName, lastName, bio, location, website, phone } = req.body

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } })
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' })
      }
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } })
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
        email,
        firstName,
        lastName,
        bio,
        location,
        website,
        phone
      },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user profile:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: 'Server error' })
  }
}

// Upload user avatar
const uploadAvatar = async (req, res) => {
  try {
    let avatarUrl = ''

    if (req.file) {
      // Convert buffer to base64 for Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64')
      const dataURI = `data:${req.file.mimetype};base64,${b64}`
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'revuo/avatars',
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto'
      })
      avatarUrl = result.secure_url
    } else if (req.body.avatarUrl) {
      // Use provided URL
      avatarUrl = req.body.avatarUrl
    } else {
      return res.status(400).json({ message: 'No image provided' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password')

    res.json({ user: updatedUser })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    res.status(500).json({ message: 'Error uploading avatar' })
  }
}

// Get user reviews
const getUserReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reviews = await Review.find({ user: req.user._id })
      .populate('entity', 'name logo category averageRating totalReviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Review.countDocuments({ user: req.user._id })

    res.json({
      reviews,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    })
  } catch (error) {
    console.error('Error getting user reviews:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get user bookmarks (entities the user has bookmarked)
const getUserBookmarks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('entity', 'name logo category averageRating totalReviews')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Bookmark.countDocuments({ user: req.user._id })

    res.json({
      bookmarks,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    })
  } catch (error) {
    console.error('Error getting user bookmarks:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get user activity
const getUserActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20

    const reviews = await Review.find({ user: req.user._id })
      .populate('entity', 'name logo category')
      .sort({ createdAt: -1 })
      .limit(limit)

    const activity = reviews.map(review => ({
      type: 'review',
      entity: review.entity,
      rating: review.rating,
      createdAt: review.createdAt,
      _id: review._id
    }))

    res.json({ activity })
  } catch (error) {
    console.error('Error getting user activity:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    // Delete all user's reviews
    await Review.deleteMany({ user: req.user._id })

    // Delete user
    await User.findByIdAndDelete(req.user._id)

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting user account:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getUserReviews,
  getUserBookmarks,
  getUserActivity,
  deleteUserAccount
}