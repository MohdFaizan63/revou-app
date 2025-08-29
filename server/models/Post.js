const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [1000, 'Post content cannot exceed 1000 characters']
  },
  media: [{
    type: String, // URL to image/video
    required: false
  }],
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: false // Optional - can be linked to an entity
  },
  entityName: {
    type: String,
    required: false // Fallback if entity doesn't exist
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: function(v) {
          return !v || (Array.isArray(v) && v.length === 2);
        },
        message: 'Coordinates must be an array of 2 numbers [longitude, latitude]'
      }
    },
    address: String,
    city: String,
    country: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ entity: 1, createdAt: -1 });
postSchema.index({ tags: 1, createdAt: -1 });
postSchema.index({ location: '2dsphere' }, { sparse: true }); // Sparse index for optional location
postSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Method to add like
postSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  if (!existingLike) {
    this.likes.push({ user: userId });
  }
  return this.save();
};

// Method to remove like
postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = function(userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Method to increment view count
postSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Ensure virtuals are serialized
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);