import { apiRequest } from './api'
import { getApiUrl } from '../utils/apiUtils'

// Create a new review
export const createReview = async (reviewData) => {
  // Validate required fields
  if (!reviewData.entityId) {
    throw new Error('Entity ID is required')
  }
  if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error('Valid rating (1-5) is required')
  }
  if (!reviewData.title || reviewData.title.trim().length === 0) {
    throw new Error('Review title is required')
  }

  const response = await apiRequest('/api/reviews', {
    method: 'POST',
    data: reviewData
  })
  return response
}

// Get reviews for an entity
export const getEntityReviews = async (entityId, params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/reviews/entity/${entityId}?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response
}

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  const response = await apiRequest(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    data: reviewData
  })
  return response
}

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await apiRequest(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })
  return response
}

// Vote on a review
export const voteReview = async (reviewId, voteType) => {
  const response = await apiRequest(`/api/reviews/${reviewId}/vote`, {
    method: 'POST',
    data: { voteType }
  })
  return response
}

// Remove vote from a review
export const removeVote = async (reviewId) => {
  const response = await apiRequest(`/api/reviews/${reviewId}/vote`, {
    method: 'DELETE'
  })
  return response
}

// Get user's reviews
export const getUserReviews = async (params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/users/reviews?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response
}