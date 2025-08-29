import { Link } from 'react-router-dom'
import { Star, MapPin, ExternalLink, BarChart3 } from 'lucide-react'
import { toast } from 'react-hot-toast'

const EntityCard = ({ entity }) => {
  const handleCompareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Get current compare entities from URL
    const urlParams = new URLSearchParams(window.location.search)
    const currentEntities = urlParams.get('entities')?.split(',').filter(Boolean) || []
    
    if (currentEntities.includes(entity._id)) {
      toast.error('Entity already in comparison')
      return
    }
    
    if (currentEntities.length >= 4) {
      toast.error('You can compare up to 4 entities at once')
      return
    }
    
    // Add entity to comparison
    const newEntities = [...currentEntities, entity._id]
    const newUrl = `/compare?entities=${newEntities.join(',')}`
    window.location.href = newUrl
  }
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-warning-400 fill-current'
            : i < rating
            ? 'text-warning-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getCategoryIcon = (category) => {
    const icons = {
      place: '🏢',
      app: '📱',
      website: '🌐',
      movie: '🎬',
      product: '📦',
      service: '🔧',
      restaurant: '🍽️',
      hospital: '🏥',
      government: '🏛️',
    }
    return icons[category] || '📋'
  }

  return (
    <Link
      to={`/entity/${entity._id}`}
      className="card hover:shadow-medium transition-all duration-200 group"
    >
      <div className="card-content">
        {/* Header */}
        <div className="flex items-start space-x-3 mb-4">
          {/* Logo/Avatar */}
          {entity.logo ? (
            <img
              src={entity.logo}
              alt={entity.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{getCategoryIcon(entity.category)}</span>
            </div>
          )}

          {/* Title and Category */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
              {entity.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500 capitalize">
                {entity.category}
              </span>
              {entity.subcategory && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {entity.subcategory}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {entity.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(entity.averageRating)}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {entity.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({entity.totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* Location or Website */}
        <div className="flex items-center justify-between">
          {entity.location?.city ? (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{entity.location.city}</span>
              {entity.location.state && (
                <span>, {entity.location.state}</span>
              )}
            </div>
          ) : entity.website ? (
            <div className="flex items-center text-sm text-gray-500">
              <ExternalLink className="w-4 h-4 mr-1" />
              <span className="truncate">Website</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {entity.category}
            </div>
          )}

          {/* View Count */}
          <div className="text-sm text-gray-500">
            {entity.viewCount} views
          </div>
        </div>

        {/* Compare Button */}
        <div className="flex justify-end mt-3">
          <button
            onClick={handleCompareClick}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <BarChart3 className="w-3 h-3" />
            <span>Compare</span>
          </button>
        </div>
        </div>

        {/* Tags */}
        {entity.tags && entity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {entity.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
              >
                {tag}
              </span>
            ))}
            {entity.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                +{entity.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default EntityCard
