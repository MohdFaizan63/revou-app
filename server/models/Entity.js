const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Entity name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['place', 'app', 'website', 'movie', 'product', 'service', 'restaurant', 'hospital', 'government']
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  logo: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contact: {
    phone: String,
    email: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  ratingDistribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  claimedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes for search and performance
entitySchema.index({ name: 'text', description: 'text', tags: 'text' });
entitySchema.index({ category: 1, averageRating: -1 });
entitySchema.index({ 'location.city': 1, 'location.state': 1, 'location.country': 1 });
entitySchema.index({ createdAt: -1 });
entitySchema.index({ viewCount: -1 });

// NEW: Comprehensive performance indexes
// Compound indexes for common query patterns
entitySchema.index({ isActive: 1, category: 1, averageRating: -1 });
entitySchema.index({ isActive: 1, viewCount: -1, averageRating: -1 });
entitySchema.index({ isActive: 1, createdAt: -1 });
entitySchema.index({ isActive: 1, name: 1 });
entitySchema.index({ isActive: 1, 'location.city': 1, averageRating: -1 });

// Indexes for instant search optimization
entitySchema.index({ isActive: 1, name: 1, viewCount: -1 });
entitySchema.index({ isActive: 1, category: 1, viewCount: -1 });
entitySchema.index({ isActive: 1, tags: 1, viewCount: -1 });

// Indexes for trending queries
entitySchema.index({ isActive: 1, viewCount: -1, averageRating: -1, createdAt: -1 });

// Indexes for location-based queries
entitySchema.index({ isActive: 1, 'location.city': 1, viewCount: -1 });
entitySchema.index({ isActive: 1, 'location.state': 1, averageRating: -1 });

// Indexes for rating-based queries
entitySchema.index({ isActive: 1, averageRating: -1, totalReviews: -1 });
entitySchema.index({ isActive: 1, averageRating: { $gte: 4 }, viewCount: -1 });

// Indexes for search with filters
entitySchema.index({ isActive: 1, category: 1, averageRating: { $gte: 3 }, viewCount: -1 });
entitySchema.index({ isActive: 1, name: 1, category: 1, averageRating: -1 });

// Virtual for rating percentage
entitySchema.virtual('ratingPercentage').get(function() {
  if (this.totalReviews === 0) return 0;
  return Math.round((this.averageRating / 5) * 100);
});

// Method to update average rating
entitySchema.methods.updateAverageRating = function() {
  const total = Object.values(this.ratingDistribution).reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    this.averageRating = 0;
  } else {
    const weightedSum = Object.entries(this.ratingDistribution)
      .reduce((sum, [rating, count]) => sum + (parseInt(rating) * count), 0);
    this.averageRating = Math.round((weightedSum / total) * 10) / 10;
  }
  this.totalReviews = total;
  return this.save();
};

// Method to increment view count
entitySchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Pre-save middleware to ensure rating distribution is valid
entitySchema.pre('save', function(next) {
  if (this.isModified('ratingDistribution')) {
    this.updateAverageRating();
  }
  next();
});

module.exports = mongoose.model('Entity', entitySchema);