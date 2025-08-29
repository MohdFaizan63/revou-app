const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const reviewSchema = new mongoose.Schema({
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true
  }],
  votes: [voteSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Indexes for better performance
reviewSchema.index({ entity: 1, createdAt: -1 })
reviewSchema.index({ rating: 1 })
reviewSchema.index({ 'votes.user': 1, 'votes.type': 1 })

// Compound unique index for one review per user per entity
reviewSchema.index({ user: 1, entity: 1 }, { 
  unique: true,
  partialFilterExpression: { deletedAt: { $exists: false } }
})

// Update the updatedAt field on save
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Virtual for vote counts
reviewSchema.virtual('upvotes').get(function() {
  return this.votes.filter(vote => vote.type === 'upvote').length
})

reviewSchema.virtual('downvotes').get(function() {
  return this.votes.filter(vote => vote.type === 'downvote').length
})

// Ensure virtuals are serialized
reviewSchema.set('toJSON', { virtuals: true })
reviewSchema.set('toObject', { virtuals: true })

// Static method to get average rating for an entity
reviewSchema.statics.getAverageRating = async function(entityId) {
  const result = await this.aggregate([
    { $match: { entity: entityId } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ])
  
  return result.length > 0 ? { averageRating: result[0].avgRating, totalReviews: result[0].count } : { averageRating: 0, totalReviews: 0 }
}

// Instance method to add/update vote
reviewSchema.methods.addVote = function(userId, voteType) {
  // Remove existing vote from this user
  this.votes = this.votes.filter(vote => vote.user.toString() !== userId.toString())
  
  // Add new vote
  this.votes.push({ user: userId, type: voteType })
  
  return this.save()
}

// Instance method to remove vote
reviewSchema.methods.removeVote = function(userId) {
  this.votes = this.votes.filter(vote => vote.user.toString() !== userId.toString())
  return this.save()
}

module.exports = mongoose.model('Review', reviewSchema)