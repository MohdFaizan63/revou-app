import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Star, X, Plus, Search, BarChart3 } from 'lucide-react'
import { getEntities, getEntity } from '../services/entityService'

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedEntities, setSelectedEntities] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Get entity IDs from URL params
  useEffect(() => {
    const entityIds = searchParams.get('entities')?.split(',').filter(Boolean) || []
    setSelectedEntities(entityIds)
  }, [searchParams])

  // Update URL when selected entities change
  useEffect(() => {
    if (selectedEntities.length > 0) {
      setSearchParams({ entities: selectedEntities.join(',') })
    } else {
      setSearchParams({})
    }
  }, [selectedEntities, setSearchParams])

  // Fetch all entities for search
  const { data: allEntities, isLoading: entitiesLoading } = useQuery(
    ['entities-for-compare'],
    () => getEntities({ limit: 100, sort: 'averageRating', order: 'desc' }),
    {
      staleTime: 5 * 60 * 1000,
      enabled: showSearch
    }
  )

  // Fetch selected entities data
  const { data: entitiesData, isLoading: selectedLoading } = useQuery(
    ['compare-entities', selectedEntities],
    async () => {
      if (selectedEntities.length === 0) return []
      const promises = selectedEntities.map(id => getEntity(id))
      return Promise.all(promises)
    },
    {
      enabled: selectedEntities.length > 0,
      staleTime: 5 * 60 * 1000
    }
  )

  // Add entity to comparison
  const addEntity = (entityId) => {
    if (selectedEntities.length >= 4) {
      toast.error('You can compare up to 4 entities at once')
      return
    }
    if (selectedEntities.includes(entityId)) {
      toast.error('Entity already added to comparison')
      return
    }
    setSelectedEntities([...selectedEntities, entityId])
    setShowSearch(false)
    setSearchTerm('')
  }

  // Remove entity from comparison
  const removeEntity = (entityId) => {
    setSelectedEntities(selectedEntities.filter(id => id !== entityId))
  }

  // Clear all entities
  const clearAll = () => {
    setSelectedEntities([])
    toast.success('Comparison cleared')
  }

  // Filter entities for search
  const filteredEntities = allEntities?.entities?.filter(entity => 
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    )
  }

  if (selectedLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comparison data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Compare
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Entities
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Make informed decisions by comparing entities side by side. Analyze ratings, reviews, and features.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Entity</span>
              </button>

              {selectedEntities.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Entity Search */}
          {showSearch && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search entities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {entitiesLoading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading entities...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredEntities.map((entity) => (
                    <div
                      key={entity._id}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => addEntity(entity._id)}
                    >
                      <div className="flex items-start space-x-3">
                        {entity.logo ? (
                          <img
                            src={entity.logo}
                            alt={entity.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">
                              {entity.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{entity.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{entity.category}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {entity.averageRating?.toFixed(1)} ({entity.totalReviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Entities */}
        {selectedEntities.length > 0 && entitiesData && (
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Comparing {entitiesData.length} Entities
              </h2>
              
              {/* Entity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {entitiesData.map((entity) => (
                  <div key={entity._id} className="bg-gray-50 rounded-xl p-4 relative">
                    <button
                      onClick={() => removeEntity(entity._id)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="text-center">
                      {entity.logo ? (
                        <img
                          src={entity.logo}
                          alt={entity.name}
                          className="w-16 h-16 rounded-lg object-cover mx-auto mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold text-blue-600">
                            {entity.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-gray-900 mb-1">{entity.name}</h3>
                      <p className="text-sm text-gray-600 capitalize mb-2">{entity.category}</p>
                      
                      <div className="flex items-center justify-center mb-2">
                        {renderStars(entity.averageRating || 0)}
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {entity.totalReviews || 0} reviews
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Table */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {entitiesData.map((entity) => (
                  <div key={entity._id} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-center mb-4">
                      {entity.logo ? (
                        <img
                          src={entity.logo}
                          alt={entity.name}
                          className="w-16 h-16 rounded-lg object-cover mx-auto mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl font-bold text-blue-600">
                            {entity.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-gray-900 mb-1">{entity.name}</h3>
                      <p className="text-sm text-gray-600 capitalize mb-2">{entity.category}</p>
                      
                      <div className="flex items-center justify-center mb-2">
                        {renderStars(entity.averageRating || 0)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reviews:</span>
                        <span className="font-medium">{entity.totalReviews || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Views:</span>
                        <span className="font-medium">{entity.viewCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Features:</span>
                        <span className="font-medium">{entity.features?.length || 0}</span>
                      </div>
                      {entity.website && (
                        <div className="pt-2">
                          <a
                            href={entity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedEntities.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Comparing</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add entities to compare their features, ratings, and reviews side by side. Make informed decisions with detailed comparisons.
            </p>
            <button
              onClick={() => setShowSearch(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Entity</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Compare