import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Search, 
  Star, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  MapPin, 
  Film, 
  ShoppingBag, 
  Plus,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Zap,
  ChevronDown,
  Check,
  MessageCircle,
  Shield,
  Clock,
  Heart,
  ThumbsUp,
  Eye,
  Download,
  Play,
  BookOpen,
  Target,
  BarChart3,
  Lightbulb,
  Star as StarIcon,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { getEntities } from '../services/entityService'
import SearchBar from '../components/SearchBar'
import AddToRevuoModal from '../components/AddToRevuoModal'

const Categories = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModalData, setAddModalData] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('rating')
  const [isSearchFixed, setIsSearchFixed] = useState(false)

  // Handle scroll for search bar positioning
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsSearchFixed(scrollPosition > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch entities based on selected category and sort
  const { data: entitiesData, isLoading } = useQuery(
    ['entities', { category: selectedCategory, sort: sortBy }],
    () => getEntities({ 
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sort: sortBy,
      limit: 50
    }),
    {
      staleTime: 3 * 60 * 1000, // 3 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      placeholderData: { entities: [], pagination: { current: 1, pages: 1, total: 0, hasNext: false, hasPrev: false }, trending: [] }
    }
  )

  const handleAddToRevuo = (data) => {
    setAddModalData(data)
    setShowAddModal(true)
  }

  const handleAddAnything = () => {
    setAddModalData(null)
    setShowAddModal(true)
  }

  const categories = [
    { 
      id: 'all', 
      name: 'All Categories', 
      icon: Grid, 
      color: 'from-gray-500 to-gray-600', 
      count: '15K+',
      description: 'Explore everything on Revuo'
    },
    { 
      id: 'website', 
      name: 'Websites', 
      icon: Globe, 
      color: 'from-blue-500 to-blue-600', 
      count: '2.5k+',
      description: 'Web platforms and online services'
    },
    { 
      id: 'app', 
      name: 'Apps', 
      icon: Smartphone, 
      color: 'from-purple-500 to-purple-600', 
      count: '1.8k+',
      description: 'Mobile and desktop applications'
    },
    { 
      id: 'place', 
      name: 'Places', 
      icon: MapPin, 
      color: 'from-green-500 to-green-600', 
      count: '3.2k+',
      description: 'Restaurants, hotels, and venues'
    },
    { 
      id: 'movie', 
      name: 'Movies', 
      icon: Film, 
      color: 'from-red-500 to-red-600', 
      count: '1.1k+',
      description: 'Films, TV shows, and entertainment'
    },
    { 
      id: 'product', 
      name: 'Products', 
      icon: ShoppingBag, 
      color: 'from-orange-500 to-orange-600', 
      count: '4.1k+',
      description: 'Physical and digital products'
    },
    { 
      id: 'service', 
      name: 'Services', 
      icon: Award, 
      color: 'from-indigo-500 to-indigo-600', 
      count: '2.9k+',
      description: 'Professional and personal services'
    },
    { 
      id: 'restaurant', 
      name: 'Restaurants', 
      icon: Award, 
      color: 'from-pink-500 to-pink-600', 
      count: '1.5k+',
      description: 'Dining experiences and food services'
    }
  ]

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'reviews', label: 'Most Reviewed', icon: MessageCircle },
    { value: 'recent', label: 'Recently Added', icon: Clock },
    { value: 'name', label: 'Alphabetical', icon: BookOpen }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Fixed Search Bar - Only shows when scrolled */}
      {isSearchFixed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <SearchBar onAddToRevuo={handleAddToRevuo} />
          </div>
        </div>
      )}

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
            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Explore
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Categories
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover amazing entities across all categories. Find what you're looking for or add something new to the community.
              </p>
            </div>

            {/* Search Bar - Initial position below navigation */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar onAddToRevuo={handleAddToRevuo} />
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mb-12">
              <button
                onClick={handleAddAnything}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Entity</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Section */}
      <div className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                }`}
              >
                <category.icon className={`w-5 h-5 ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-500'
                }`} />
                <span>{category.name}</span>
                <span className={`text-sm ${
                  selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Results Count */}
            <div className="text-gray-600">
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  {entitiesData?.entities?.length || 0} entities found
                  {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entities Grid/List */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading entities...</span>
              </div>
            </div>
          ) : entitiesData?.entities?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No entities found</h3>
              <p className="text-gray-600 mb-6">
                {selectedCategory === 'all' 
                  ? "No entities have been added yet. Be the first to add something!"
                  : `No entities found in ${categories.find(c => c.id === selectedCategory)?.name}. Be the first to add one!`
                }
              </p>
              <button
                onClick={handleAddAnything}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Entity</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {entitiesData?.entities?.map((entity) => (
                <div
                  key={entity._id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-200 border border-gray-100 cursor-pointer ${
                    viewMode === 'list' ? 'flex items-center space-x-4 p-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        {entity.logo ? (
                          <img
                            src={entity.logo}
                            alt={entity.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-blue-600">
                              {entity.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {entity.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= entity.averageRating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {entity.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {entity.totalReviews} reviews
                          </p>
                        </div>
                      </div>
                      {entity.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {entity.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {entity.category}
                        </span>
                        <Link
                          to={`/entity/${entity._id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <>
                      {entity.logo ? (
                        <img
                          src={entity.logo}
                          alt={entity.name}
                          className="w-20 h-20 rounded-xl object-cover shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl font-bold text-blue-600">
                            {entity.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {entity.name}
                        </h3>
                        {entity.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {entity.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= entity.averageRating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {entity.averageRating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {entity.totalReviews} reviews
                          </span>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {entity.category}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/entity/${entity._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex-shrink-0"
                      >
                        View Details →
                      </Link>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add to Revuo Modal */}
      <AddToRevuoModal
        isOpen={showAddModal}
        initialData={addModalData}
        onClose={() => {
          setShowAddModal(false)
          setAddModalData(null)
        }}
      />
    </div>
  )
}

export default Categories