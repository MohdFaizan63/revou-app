const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user can only bookmark an entity once
bookmarkSchema.index({ user: 1, entity: 1 }, { unique: true });

// Add bookmark to entity
bookmarkSchema.statics.addBookmark = async function(userId, entityId) {
  try {
    const bookmark = await this.create({ user: userId, entity: entityId });
    return bookmark;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Entity already bookmarked');
    }
    throw error;
  }
};

// Remove bookmark from entity
bookmarkSchema.statics.removeBookmark = async function(userId, entityId) {
  return await this.findOneAndDelete({ user: userId, entity: entityId });
};

// Check if user has bookmarked an entity
bookmarkSchema.statics.isBookmarked = async function(userId, entityId) {
  const bookmark = await this.findOne({ user: userId, entity: entityId });
  return !!bookmark;
};

module.exports = mongoose.model('Bookmark', bookmarkSchema);