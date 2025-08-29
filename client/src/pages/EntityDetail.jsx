import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { 
  ArrowLeft, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Flag, 
  Edit3,
  Globe,
  MapPin,
  Calendar,
  User,
  Heart,
  Bookmark,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react'
import { getEntity, createReview, voteReview } from '../services/entityService'
import { useAuth } from '../context/AuthContext'
import ReviewForm from '../components/ReviewForm'
import ReviewCard from '../components/ReviewCard'
import RatingDistribution from '../components/RatingDistribution'

const EntityDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isHovering, setIsHovering] = useState(0)

  // Fetch entity data
  const { data: entity, isLoading, error } = useQuery(
    ['entity', id],
    () => getEntity(id),
    {
      staleTime: 5 * 60 * 1000,
    }
  )

  // Create review mutation
  const createReviewMutation = useMutation(createReview, {
    onSuccess: () => {
      toast.success('Review submitted successfully!')
      queryClient.invalidateQueries(['entity', id])
      setShowReviewForm(false)
      setSelectedRating(0)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit review')
    }
  })

  // Vote mutation
  const voteMutation = useMutation(voteReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(['entity', id])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to vote')
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading entity details...</p>
        </div>
      </div>
    )
  }

  if (error || !entity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Entity Not Found</h2>
          <p className="text-gray-600 mb-4">The entity you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const handleRate = (rating) => {
    if (!user) {
      toast.error('Please login to rate this entity')
      return
    }
    setSelectedRating(rating)
    setShowReviewForm(true)
  }

  const handleVote = (reviewId, voteType) => {
    if (!user) {
      toast.error('Please login to vote')
      return
    }
    voteMutation.mutate({ reviewId, voteType })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: entity.name,
        text: `Check out ${entity.name} on Revuo!`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-button"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{entity.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">{entity.category}</p>
              </div>
            </div>
            
                         <div className="flex items-center space-x-1 sm:space-x-2">
               <button
                 onClick={handleShare}
                 className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                 title="Share"
               >
                 <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               </button>
               <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-button">
                 <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               </button>
               <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-button">
                 <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               </button>
             </div>
          </div>
        </div>
      </div>

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
           {/* Main Content */}
           <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                         {/* Entity Card */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="p-4 sm:p-6 lg:p-8">
                 <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                   {/* Logo */}
                   <div className="flex-shrink-0 flex justify-center sm:justify-start">
                     {entity.logo ? (
                       <img
                         src={entity.logo}
                         alt={entity.name}
                         className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-sm"
                       />
                     ) : (
                       <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                         <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                           {entity.name.charAt(0).toUpperCase()}
                         </span>
                       </div>
                     )}
                   </div>

                                     {/* Entity Info */}
                   <div className="flex-1 min-w-0 text-center sm:text-left">
                     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                       <div className="flex-1">
                         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                           {entity.name}
                         </h1>
                         
                         {/* Rating */}
                         <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                           <div className="flex items-center justify-center sm:justify-start space-x-2">
                             <div className="flex items-center">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <Star
                                   key={star}
                                   className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                     star <= entity.averageRating
                                       ? 'text-yellow-400 fill-current'
                                       : 'text-gray-300'
                                   }`}
                                 />
                               ))}
                             </div>
                             <span className="text-xl sm:text-2xl font-bold text-gray-900">
                               {entity.averageRating.toFixed(1)}
                             </span>
                           </div>
                           <span className="text-sm sm:text-base text-gray-500 text-center sm:text-left">
                             ({entity.totalReviews} reviews)
                           </span>
                         </div>

                                                 {/* Description */}
                         {entity.description && (
                           <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                             {entity.description}
                           </p>
                         )}

                         {/* Tags */}
                         {entity.tags && entity.tags.length > 0 && (
                           <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                             {entity.tags.map((tag, index) => (
                               <span
                                 key={index}
                                 className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium"
                               >
                                 {tag}
                               </span>
                             ))}
                           </div>
                         )}

                         {/* Action Buttons */}
                         <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                           <button
                             onClick={() => handleRate(5)}
                             className="w-full sm:w-auto btn btn-primary btn-lg touch-button"
                           >
                             <Star className="w-5 h-5 mr-2" />
                             Rate Now
                           </button>
                           {entity.website && (
                             <a
                               href={entity.website}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="w-full sm:w-auto btn btn-outline btn-lg touch-button"
                             >
                               <ExternalLink className="w-5 h-5 mr-2" />
                               Visit Website
                             </a>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h2>
              <RatingDistribution entity={entity} />
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Reviews ({entity.totalReviews})
                  </h2>
                  <div className="flex items-center space-x-2">
                    <select className="input input-sm">
                      <option>Most Recent</option>
                      <option>Highest Rated</option>
                      <option>Lowest Rated</option>
                      <option>Most Helpful</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {entity.reviews && entity.reviews.length > 0 ? (
                  entity.reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      onVote={handleVote}
                      currentUser={user}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to review this entity!</p>
                    <button
                      onClick={() => handleRate(5)}
                      className="btn btn-primary"
                    >
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Posts ({entity.posts?.length || 0})
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {entity.posts && entity.posts.length > 0 ? (
                  entity.posts.map((post) => (
                    <div key={post._id} className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        {post.user?.avatar ? (
                          <img
                            src={post.user.avatar}
                            alt={post.user?.username || 'User'}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{post.user?.username || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-900 mb-3">{post.content}</p>
                      
                      {post.media && post.media.length > 0 && (
                        <div className="mb-3">
                          <img
                            src={post.media[0]}
                            alt="Post media"
                            className="w-full rounded-lg object-cover max-h-64"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>❤️ {post.likes?.length || 0}</span>
                        <span>💬 {post.comments?.length || 0}</span>
                        <span>👁️ {post.viewCount || 0}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to share something about this entity!</p>
                    <Link
                      to="/posts"
                      className="btn btn-primary"
                    >
                      Create Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Rate</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      onMouseEnter={() => setIsHovering(star)}
                      onMouseLeave={() => setIsHovering(0)}
                      className="p-1 transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (isHovering || selectedRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {selectedRating > 0 ? `You selected ${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Click to rate'}
                </p>
                {selectedRating > 0 && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn btn-primary w-full"
                  >
                    Write Review
                  </button>
                )}
              </div>
            </div>

            {/* Entity Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Category: {entity.category}</span>
                </div>
                {entity.subcategory && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Subcategory: {entity.subcategory}</span>
                  </div>
                )}
                {entity.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{entity.location}</span>
                  </div>
                )}
                {entity.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={entity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 truncate"
                    >
                      {entity.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Added {new Date(entity.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {entity.createdBy && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">By {entity.createdBy.username}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Entities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Entities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">N</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">Netflix</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">4.2 (1.2k)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">S</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">Spotify</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">4.5 (856)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          entity={entity}
          initialRating={selectedRating}
          onSubmit={(data) => createReviewMutation.mutate(data)}
          onClose={() => setShowReviewForm(false)}
          isLoading={createReviewMutation.isLoading}
        />
      )}
    </div>
  )
}

export default EntityDetail