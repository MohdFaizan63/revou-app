import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Search, Star, Globe, ExternalLink, Plus, Eye, TrendingUp, Sparkles } from 'lucide-react'
import { instantSearch } from '../services/entityService'
import { searchExternal } from '../services/externalSearchService'
import WebPreviewCard from './WebPreviewCard'

const SearchBar = ({ onAddToRevuo }) => {
  const [query, setQuery] = useState('')
  const [webPreview, setWebPreview] = useState(null)
  const [isLoadingExternal, setIsLoadingExternal] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const searchTimeoutRef = useRef(null)
  const inputRef = useRef(null)

  // Debounce search query for better performance
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (query.length >= 1) {
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(query)
      }, 150) // 150ms debounce for instant feel
    } else {
      setDebouncedQuery('')
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  // Instant search with react-query
  const { data: instantResults, isLoading: instantLoading } = useQuery(
    ['instant-search', debouncedQuery],
    () => instantSearch(debouncedQuery, 6),
    {
      enabled: debouncedQuery.length >= 1,
      staleTime: 1 * 60 * 1000, // 1 minute cache for search results
      cacheTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
      placeholderData: { results: [] }
    }
  )

  // External search for web preview
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoadingExternal(true)
      searchExternal(debouncedQuery)
        .then(result => {
          setWebPreview(result)
        })
        .catch(error => {
          console.error('External search error:', error)
        })
        .finally(() => {
          setIsLoadingExternal(false)
        })
    } else {
      setWebPreview(null)
    }
  }, [debouncedQuery])

  // Show results when query is long enough
  useEffect(() => {
    setShowResults(query.length >= 1)
  }, [query])

  const handleAddToRevuo = (data) => {
    // Clean up the title
    const cleanTitle = data.title
      ?.replace(/ - Wikipedia$/, '')
      ?.replace(/ - Google Search$/, '')
      ?.replace(/ \| .*$/, '') || data.name || query

    // Determine category based on content
    let category = 'website'
    const title = (data.title || data.name || '').toLowerCase()
    if (title.includes('movie') || title.includes('film')) {
      category = 'movie'
    } else if (title.includes('app') || title.includes('mobile')) {
      category = 'app'
    } else if (title.includes('restaurant') || title.includes('cafe') || title.includes('hotel')) {
      category = 'place'
    } else if (title.includes('product') || title.includes('buy')) {
      category = 'product'
    }

    // Filter out Google search URLs for website field
    const website = data.url && !data.url.includes('google.com/search') ? data.url : ''

    onAddToRevuo({
      name: cleanTitle,
      description: data.description || `Information about ${cleanTitle}`,
      category,
      website,
      logoUrl: data.imageUrl || data.logo
    })
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleInputFocus = () => {
    if (query.length >= 1) {
      setShowResults(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => setShowResults(false), 200)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false)
      inputRef.current?.blur()
    }
  }

  const clearSearch = () => {
    setQuery('')
    setShowResults(false)
    inputRef.current?.focus()
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'app':
        return '📱'
      case 'website':
        return '🌐'
      case 'movie':
        return '🎬'
      case 'place':
      case 'restaurant':
        return '📍'
      case 'product':
        return '🛍️'
      case 'service':
        return '⚙️'
      default:
        return '📋'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'app':
        return 'bg-blue-100 text-blue-600'
      case 'website':
        return 'bg-purple-100 text-purple-600'
      case 'movie':
        return 'bg-red-100 text-red-600'
      case 'place':
      case 'restaurant':
        return 'bg-green-100 text-green-600'
      case 'product':
        return 'bg-yellow-100 text-yellow-600'
      case 'service':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search for anything - apps, restaurants, movies, products..."
          className="block w-full pl-12 pr-12 py-4 text-lg bg-white border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {(instantLoading || isLoadingExternal) && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Searching...</span>
              </div>
            </div>
          )}

          {/* Instant Results */}
          {instantResults?.results && instantResults.results.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Instant Results</span>
                  <span className="text-xs text-gray-500">({instantResults.count} found)</span>
                </div>
              </div>
              {instantResults.results.map((entity) => (
                <Link
                  key={entity._id}
                  to={`/entity/${entity._id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    {entity.logo ? (
                      <img
                        src={entity.logo}
                        alt={entity.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 ${getCategoryColor(entity.category)} rounded-xl flex items-center justify-center ${entity.logo ? 'hidden' : ''}`}>
                      <span className="text-lg">{getCategoryIcon(entity.category)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">{entity.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(entity.category)}`}>
                          {entity.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{entity.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {renderStars(entity.averageRating)}
                        <span className="text-sm text-gray-600">
                          {entity.averageRating.toFixed(1)} ({entity.totalReviews} reviews)
                        </span>
                        {entity.viewCount > 0 && (
                          <>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Eye className="w-3 h-3" />
                              <span>{entity.viewCount}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <Globe className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Web Preview */}
          {webPreview && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <ExternalLink className="w-4 h-4 text-green-500" />
                  <span>Web Preview</span>
                </div>
              </div>
              <WebPreviewCard
                data={webPreview}
                onAddToRevuo={handleAddToRevuo}
              />
            </div>
          )}

          {/* No Results */}
          {!instantLoading && !isLoadingExternal && (!instantResults?.results || instantResults.results.length === 0) && !webPreview && query.length >= 2 && (
            <div className="p-6 text-center">
              <div className="text-gray-500 mb-4">No results found for "{query}"</div>
              <button
                onClick={() => handleAddToRevuo({
                  name: query,
                  description: `Add information about ${query}`,
                  category: 'website'
                })}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Revuo</span>
              </button>
            </div>
          )}

          {/* Quick Actions */}
          {query.length >= 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quick actions:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToRevuo({
                      name: query,
                      description: `Add information about ${query}`,
                      category: 'website'
                    })}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Add "{query}"
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar