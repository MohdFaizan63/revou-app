import { getApiUrl, getAuthHeaders } from '../utils/apiUtils'

export const handleApiError = async (response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred'
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`
    } catch (parseError) {
      // If we can't parse the error response, use status text
      errorMessage = response.statusText || `HTTP error! status: ${response.status}`
    }
    
    throw new Error(errorMessage)
  }
  return response
}

export const apiRequest = async (url, options = {}) => {
  // Use getApiUrl to handle the URL construction properly
  const fullUrl = url.startsWith('http') ? url : getApiUrl(url)
  
  console.log('🚀 API Request Debug:')
  console.log('  - Original URL:', url)
  console.log('  - Full URL:', fullUrl)
  console.log('  - Method:', options.method || 'GET')
  
  const config = {
    headers: getAuthHeaders(),
    ...options,
  }

  // Handle data parameter for JSON requests
  if (options.data && !options.body) {
    config.body = JSON.stringify(options.data)
    config.headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(fullUrl, config)
    console.log('  - Response Status:', response.status)
    return handleApiError(response)
  } catch (error) {
    console.error('  - Fetch Error:', error)
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.')
    }
    throw error
  }
}

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
  const data = await response.json()
  return data
}