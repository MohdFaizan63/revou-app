const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [255, 'Email cannot exceed 255 characters'],
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'resolved', 'spam'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    trim: true,
    maxlength: [2000, 'Admin response cannot exceed 2000 characters']
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
contactSchema.index({ status: 1, submittedAt: -1 })
contactSchema.index({ email: 1 })
contactSchema.index({ submittedAt: -1 })

// Virtual for formatted submission date
contactSchema.virtual('formattedSubmittedAt').get(function() {
  return this.submittedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Virtual for formatted response date
contactSchema.virtual('formattedRespondedAt').get(function() {
  if (!this.respondedAt) return null
  return this.respondedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Virtual for response time in hours
contactSchema.virtual('responseTimeHours').get(function() {
  if (!this.respondedAt || !this.submittedAt) return null
  const diffTime = Math.abs(this.respondedAt - this.submittedAt)
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  return diffHours
})

// Ensure virtual fields are serialized
contactSchema.set('toJSON', { virtuals: true })
contactSchema.set('toObject', { virtuals: true })

// Static method to get contact statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        responded: {
          $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] }
        },
        resolved: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        spam: {
          $sum: { $cond: [{ $eq: ['$status', 'spam'] }, 1, 0] }
        }
      }
    }
  ])

  return stats[0] || {
    total: 0,
    pending: 0,
    responded: 0,
    resolved: 0,
    spam: 0
  }
}

// Static method to get recent contacts
contactSchema.statics.getRecent = async function(days = 7) {
  const date = new Date()
  date.setDate(date.getDate() - days)

  return this.find({
    submittedAt: { $gte: date }
  }).sort({ submittedAt: -1 })
}

// Instance method to mark as responded
contactSchema.methods.markAsResponded = async function(adminResponse) {
  this.status = 'responded'
  this.adminResponse = adminResponse
  this.respondedAt = new Date()
  return this.save()
}

// Instance method to mark as resolved
contactSchema.methods.markAsResolved = async function() {
  this.status = 'resolved'
  return this.save()
}

// Instance method to mark as spam
contactSchema.methods.markAsSpam = async function() {
  this.status = 'spam'
  return this.save()
}

module.exports = mongoose.model('Contact', contactSchema)
