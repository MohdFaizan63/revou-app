import React, { useState } from 'react'
import { X, Star, ThumbsUp, ThumbsDown } from 'lucide-react'

const ReviewForm = ({ entity, initialRating = 0, onSubmit, onClose, isLoading }) => {
  const [rating, setRating] = useState(initialRating)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [tags, setTags] = useState([])
  const [isHovering, setIsHovering] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }
    
    onSubmit({
      entityId: entity._id,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      tags
    })
  }

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const predefinedTags = ['Pros', 'Cons', 'Great Service', 'Poor Experience', 'Recommended', 'Not Recommended']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
            <p className="text-sm text-gray-500">Share your experience with {entity.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Rating *
            </label>
            <div className="flex items-center justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setIsHovering(star)}
                  onMouseLeave={() => setIsHovering(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (isHovering || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full"
              placeholder="Summarize your experience..."
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="input w-full resize-none"
              placeholder="Share your detailed experience with this entity..."
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {/* Predefined Tags */}
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={tags.includes(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      tags.includes(tag)
                        ? 'bg-primary-100 text-primary-700 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Custom Tag Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add custom tag..."
                  className="input flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(e.target.value.trim())
                      e.target.value = ''
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.target.previousSibling
                    addTag(input.value.trim())
                    input.value = ''
                  }}
                  className="btn btn-outline"
                >
                  Add
                </button>
              </div>

              {/* Selected Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || rating === 0 || !title.trim()}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewForm