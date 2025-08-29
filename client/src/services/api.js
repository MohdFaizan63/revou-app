export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  }
}

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
    const response = await fetch(url, config)
    return handleApiError(response)
  } catch (error) {
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