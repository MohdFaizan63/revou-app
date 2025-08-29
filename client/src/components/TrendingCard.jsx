import { Link } from 'react-router-dom'
import { Star, TrendingUp } from 'lucide-react'

const TrendingCard = ({ entity }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-warning-400 fill-current'
            : i < rating
            ? 'text-warning-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Link
      to={`/entity/${entity._id}`}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      {/* Logo/Avatar */}
      {entity.logo ? (
        <img
          src={entity.logo}
          alt={entity.name}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-primary-600 font-semibold text-sm">
            {entity.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
          {entity.name}
        </h4>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex items-center">
            {renderStars(entity.averageRating)}
          </div>
          <span className="text-xs font-medium text-gray-900">
            {entity.averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">
            ({entity.totalReviews})
          </span>
        </div>
      </div>

      {/* Trending Indicator */}
      <div className="flex items-center text-xs text-gray-500">
        <TrendingUp className="w-3 h-3 mr-1" />
        <span>{entity.viewCount}</span>
      </div>
    </Link>
  )
}

export default TrendingCard
