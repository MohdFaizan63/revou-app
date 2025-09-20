// External API service for fetching Wikipedia information
import { getApiUrl } from '../utils/apiUtils'

// Wikipedia API configuration
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary'

// Fetch information from Wikipedia
export const fetchWikipediaInfo = async (query) => {
  try {
    const response = await fetch(`${WIKIPEDIA_API_URL}/${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      title: data.title || query,
      description: data.extract || 'No description available',
      thumbnail: data.thumbnail?.source || null,
      url: data.content_urls?.desktop?.page || null,
      type: data.type || 'unknown'
    }
  } catch (error) {
    console.error('Wikipedia API error:', error)
    return {
      title: query,
      description: 'Information not available',
      thumbnail: null,
      url: null,
      type: 'unknown'
    }
  }
}

// Simplified service - Wikipedia only

// Main search function - Wikipedia only
export const performSmartSearch = async (query) => {
  try {
    console.log('🔍 Performing smart search for:', query)
    
    // Only fetch Wikipedia data
    const wikipediaData = await fetchWikipediaInfo(query)
    
    const result = {
      query,
      timestamp: new Date().toISOString(),
      wikipedia: wikipediaData,
      success: true
    }
    
    console.log('✅ Smart search completed:', result)
    return result
    
  } catch (error) {
    console.error('❌ Smart search failed:', error)
    return {
      query,
      timestamp: new Date().toISOString(),
      wikipedia: null,
      success: false,
      error: error.message
    }
  }
}

// Search suggestions based on popular queries
export const getSearchSuggestions = async (query) => {
  try {
    // This would typically come from your backend or a suggestions API
  const suggestions = [
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
      'New York', 'London', 'Paris', 'Tokyo', 'Sydney',
      'Restaurants', 'Hotels', 'Shopping', 'Tourism', 'Food'
  ]
  
  return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }
}