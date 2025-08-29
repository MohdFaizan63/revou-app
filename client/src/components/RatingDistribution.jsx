import React from 'react'
import { Star } from 'lucide-react'

const RatingDistribution = ({ entity }) => {
  // Calculate rating distribution
  const getRatingCount = (rating) => {
    if (!entity.reviews) return 0
    return entity.reviews.filter(review => review.rating === rating).length
  }

  const getPercentage = (rating) => {
    if (!entity.totalReviews) return 0
    return (getRatingCount(rating) / entity.totalReviews) * 100
  }

  const ratings = [5, 4, 3, 2, 1]

  return (
    <div className="space-y-3">
      {ratings.map((rating) => {
        const count = getRatingCount(rating)
        const percentage = getPercentage(rating)
        
        return (
          <div key={rating} className="flex items-center space-x-3">
            {/* Star Rating */}
            <div className="flex items-center space-x-1 w-16">
              <span className="text-sm font-medium text-gray-700">{rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Count */}
            <div className="w-12 text-right">
              <span className="text-sm text-gray-600">{count}</span>
            </div>
          </div>
        )
      })}

      {/* Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {entity.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Average</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {entity.totalReviews}
            </div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {getPercentage(5).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-500">5 Stars</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingDistribution