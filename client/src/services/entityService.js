import { apiRequest } from './api'
import { getApiUrl } from '../utils/apiUtils'

export const getEntities = async (params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/entities?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response.json()
}

// New instant search function for real-time results
export const instantSearch = async (query, limit = 8) => {
  if (!query || query.trim().length === 0) {
    return { results: [] }
  }
  
  const searchParams = new URLSearchParams({
    q: query.trim(),
    limit: limit.toString()
  })
  
  const url = `/api/entities/instant?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response.json()
}

export const getEntity = async (id) => {
  const response = await apiRequest(`/api/entities/${id}`)
  return response.json()
}

export const createEntity = async (entityData) => {
  // Check if entityData is FormData
  if (entityData instanceof FormData) {
    // For FormData, we need to send without Content-Type header
    const token = localStorage.getItem('token')
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
      // Don't set Content-Type for FormData - browser will set it with boundary
    }
    
    const response = await fetch(getApiUrl('/api/entities'), {
      method: 'POST',
      headers,
      body: entityData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create entity')
    }
    
    return response.json()
  } else {
    // For regular JSON data
    const response = await apiRequest('/api/entities', {
      method: 'POST',
      body: JSON.stringify(entityData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}

export const updateEntity = async (id, entityData) => {
  const response = await apiRequest(`/api/entities/${id}`, {
    method: 'PUT',
    data: entityData
  })
  return response.json()
}

export const deleteEntity = async (id) => {
  const response = await apiRequest(`/api/entities/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}

export const claimEntity = async (id) => {
  const response = await apiRequest(`/api/entities/${id}/claim`, {
    method: 'POST'
  })
  return response.json()
}

export const getCategories = async () => {
  const response = await apiRequest('/api/entities/categories')
  return response.json()
}

// Bookmark functions
export const toggleBookmark = async (id) => {
  const response = await apiRequest(`/api/entities/${id}/bookmark`, {
    method: 'POST'
  })
  return response.json()
}

export const checkBookmark = async (id) => {
  const response = await apiRequest(`/api/entities/${id}/bookmark`)
  return response.json()
}

// Note: Review functions have been moved to reviewService.js