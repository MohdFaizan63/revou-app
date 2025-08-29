import React from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Flag, User } from 'lucide-react'

const ReviewCard = ({ review, onVote, currentUser }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
  }

  const handleVote = (voteType) => {
    if (!currentUser) {
      alert('Please login to vote')
      return
    }
    onVote(review._id, voteType)
  }

  const userHasVoted = (voteType) => {
    if (!currentUser || !review.votes) return false
    return review.votes.some(vote => 
      vote.user === currentUser._id && vote.type === voteType
    )
  }

  const getVoteCount = (voteType) => {
    if (!review.votes) return 0
    return review.votes.filter(vote => vote.type === voteType).length
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {review.user?.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user?.username || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-600" />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">
                {review.user?.username || 'Anonymous'}
              </h4>
              <span className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {review.rating.toFixed(1)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {review.title}
          </h3>

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {review.comment}
            </p>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {review.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tag === 'Pros' || tag === 'Great Service' || tag === 'Recommended'
                      ? 'bg-green-100 text-green-700'
                      : tag === 'Cons' || tag === 'Poor Experience' || tag === 'Not Recommended'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Vote Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote('upvote')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    userHasVoted('upvote')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {getVoteCount('upvote')}
                  </span>
                </button>
                <button
                  onClick={() => handleVote('downvote')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                    userHasVoted('downvote')
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {getVoteCount('downvote')}
                  </span>
                </button>
              </div>

              {/* Reply Button */}
              <button className="flex items-center space-x-1 px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Reply</span>
              </button>
            </div>

            {/* Helpful Badge */}
            {getVoteCount('upvote') > 5 && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard