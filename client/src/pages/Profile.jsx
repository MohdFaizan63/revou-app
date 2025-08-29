import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  User, 
  Mail, 
  Camera, 
  Edit, 
  Save, 
  X, 
  Star, 
  Heart, 
  Bookmark, 
  Settings, 
  Shield, 
  Award,
  Calendar,
  MapPin,
  Globe,
  Phone,
  Plus,
  Upload,
  Link as LinkIcon,
  Trash2,
  Eye,
  MessageCircle,
  ThumbsUp,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Star as StarIcon,
  Sparkles,
  Zap,
  Target,
  Users,
  Award as AwardIcon,
  LogOut
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadAvatar, 
  getUserReviews, 
  getUserBookmarks, 
  getUserActivity,
  deleteUserAccount
} from '../services/userService'

const Profile = () => {
  const { user, updateProfile, logout } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  // State management
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    phone: user?.phone || ''
  })

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery(
    ['user-profile', user?.id],
    getUserProfile,
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error) => {
        toast.error('Failed to load profile data')
      }
    }
  )

  // Fetch user reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery(
    ['user-reviews', user?.id],
    getUserReviews,
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error) => {
        toast.error('Failed to load reviews')
      }
    }
  )

  // Fetch user bookmarks
  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery(
    ['user-bookmarks', user?.id],
    getUserBookmarks,
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error) => {
        toast.error('Failed to load bookmarks')
      }
    }
  )

  // Fetch user activity
  const { data: activityData, isLoading: activityLoading } = useQuery(
    ['user-activity', user?.id],
    getUserActivity,
    {
      enabled: !!user?.id,
      staleTime: 5 * 60 * 1000,
      retry: 2,
      onError: (error) => {
        toast.error('Failed to load activity')
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(
    updateUserProfile,
    {
      onSuccess: (data) => {
        toast.success('Profile updated successfully!')
        updateProfile(data.user)
        setIsEditing(false)
        queryClient.invalidateQueries(['user-profile'])
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update profile')
      }
    }
  )

  // Upload photo mutation
  const uploadPhotoMutation = useMutation(
    uploadAvatar,
    {
      onSuccess: (data) => {
        toast.success('Profile photo updated successfully!')
        updateProfile(data.user)
        setShowPhotoModal(false)
        setProfilePhoto(null)
        setPhotoUrl('')
        queryClient.invalidateQueries(['user-profile'])
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to upload photo')
      }
    }
  )

  // Delete account mutation
  const deleteAccountMutation = useMutation(
    deleteUserAccount,
    {
      onSuccess: () => {
        toast.success('Account deleted successfully')
        logout()
        navigate('/')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete account')
      }
    }
  )

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setProfilePhoto(file)
      setPhotoUrl('')
    }
  }

  // Handle photo URL
  const handlePhotoUrlChange = (e) => {
    setPhotoUrl(e.target.value)
    setProfilePhoto(null)
  }

  // Handle photo submission
  const handlePhotoSubmit = async () => {
    if (!profilePhoto && !photoUrl) {
      toast.error('Please select a photo or enter a URL')
      return
    }

    setIsUploading(true)
    try {
      await uploadPhotoMutation.mutateAsync({
        file: profilePhoto,
        url: photoUrl
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!formData.username.trim()) {
      toast.error('Username is required')
      return
    }

    await updateProfileMutation.mutateAsync(formData)
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    await deleteAccountMutation.mutateAsync()
  }

  // Calculate user stats
  const userStats = {
    totalReviews: reviewsData?.reviews?.length || 0,
    totalBookmarks: bookmarksData?.bookmarks?.length || 0,
    averageRating: reviewsData?.reviews?.length > 0 
      ? (reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewsData.reviews.length).toFixed(1)
      : 0,
    totalLikes: reviewsData?.reviews?.reduce((sum, review) => sum + (review.upvotes || 0), 0) || 0
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load profile</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              My
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Profile
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Manage your profile, reviews, and preferences. Share your experiences with the community.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24">
              {/* Profile Photo */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 mx-auto mb-3 sm:mb-4">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: user?.avatar ? 'none' : 'flex' }}>
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg touch-button"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.username
                  }
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">@{user?.username}</p>
                
                {user?.bio && (
                  <p className="text-gray-700 text-sm mb-4">{user.bio}</p>
                )}

                {user?.location && (
                  <div className="flex items-center justify-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </div>
                )}

                {user?.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-blue-600 text-sm hover:text-blue-700 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Website
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">Reviews</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{userStats.totalReviews}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Bookmark className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Bookmarks</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{userStats.totalBookmarks}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Likes</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{userStats.totalLikes}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
                
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username *
                        </label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          disabled={!isEditing}
                          placeholder="City, Country"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          disabled={!isEditing}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 resize-none"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileUpdate}
                          disabled={updateProfileMutation.isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">My Reviews</h3>
                      <span className="text-sm text-gray-500">{userStats.totalReviews} reviews</span>
                    </div>
                    
                    {reviewsLoading ? (
                      <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading reviews...</p>
                      </div>
                    ) : reviewsData?.reviews?.length === 0 ? (
                      <div className="text-center py-12">
                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                        <p className="text-gray-600 mb-4">Start reviewing entities to see them here</p>
                        <Link
                          to="/"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Write Your First Review</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviewsData?.reviews?.map((review) => (
                          <div key={review._id} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-start space-x-4">
                              {review.entity?.logo ? (
                                <img
                                  src={review.entity.logo}
                                  alt={review.entity.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                  <span className="text-lg font-bold text-blue-600">
                                    {review.entity?.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Link
                                    to={`/entity/${review.entity?._id}`}
                                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                  >
                                    {review.entity?.name}
                                  </Link>
                                  <span className="text-sm text-gray-500">•</span>
                                  <div className="flex items-center space-x-1">
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
                                </div>
                                
                                {review.title && (
                                  <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                                )}
                                
                                {review.comment && (
                                  <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                                )}
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{review.upvotes || 0} likes</span>
                                  {review.tags?.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <div className="flex space-x-1">
                                        {review.tags.slice(0, 3).map((tag, index) => (
                                          <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bookmarks' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">My Bookmarks</h3>
                      <span className="text-sm text-gray-500">{userStats.totalBookmarks} bookmarks</span>
                    </div>
                    
                    {bookmarksLoading ? (
                      <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading bookmarks...</p>
                      </div>
                    ) : bookmarksData?.bookmarks?.length === 0 ? (
                      <div className="text-center py-12">
                        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h4>
                        <p className="text-gray-600 mb-4">Bookmark entities to see them here</p>
                        <Link
                          to="/categories"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Explore Categories</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bookmarksData?.bookmarks?.map((bookmark) => (
                          <div key={bookmark._id} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                              {bookmark.entity?.logo ? (
                                <img
                                  src={bookmark.entity.logo}
                                  alt={bookmark.entity.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                  <span className="text-lg font-bold text-blue-600">
                                    {bookmark.entity?.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/entity/${bookmark.entity?._id}`}
                                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                                >
                                  {bookmark.entity?.name}
                                </Link>
                                
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 ml-1">
                                      {bookmark.entity?.averageRating?.toFixed(1)}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    ({bookmark.entity?.totalReviews} reviews)
                                  </span>
                                </div>
                                
                                <span className="text-xs text-gray-500 capitalize">
                                  {bookmark.entity?.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
                    
                    {activityLoading ? (
                      <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading activity...</p>
                      </div>
                    ) : activityData?.activity?.length === 0 ? (
                      <div className="text-center py-12">
                        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h4>
                        <p className="text-gray-600 mb-4">Start reviewing and bookmarking to see your activity here</p>
                        <Link
                          to="/"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Start Exploring</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activityData?.activity?.map((item, index) => (
                          <div key={item._id || index} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Star className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-900">
                                  <span className="font-medium">You reviewed</span> {item.entity?.name || 'an entity'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Receive updates about your reviews and activity</p>
                          </div>
                          <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Privacy</h4>
                            <p className="text-sm text-gray-600">Control who can see your profile and reviews</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Manage
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Change Password</h4>
                            <p className="text-sm text-gray-600">Update your account password</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Change
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-red-900">Delete Account</h4>
                            <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                          </div>
                          <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Update Profile Photo</h2>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* File Upload */}
              <div>
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload from device</p>
                    <p className="text-xs text-gray-500">Max 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* URL Input */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Or import from URL</span>
                </div>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={handlePhotoUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Preview */}
              {(profilePhoto || photoUrl) && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mx-auto">
                    {profilePhoto ? (
                      <img
                        src={URL.createObjectURL(profilePhoto)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    )}
                    <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhotoSubmit}
                  disabled={isUploading || (!profilePhoto && !photoUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Update Photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-red-900">Delete Account</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
                <p className="text-gray-600 mb-4">
                  This action cannot be undone. All your data, reviews, and bookmarks will be permanently deleted.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleteAccountMutation.isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteAccountMutation.isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile