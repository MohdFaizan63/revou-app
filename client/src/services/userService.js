import { apiRequest } from './api'

// Get user profile
export const getUserProfile = async () => {
  const response = await apiRequest('/api/users/profile')
  return response.json()
}

// Update user profile
export const updateUserProfile = async (profileData) => {
  const response = await apiRequest('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  })
  return response.json()
}

// Upload avatar
export const uploadAvatar = async (avatarData) => {
  const formData = new FormData()
  
  if (avatarData.file) {
    formData.append('avatar', avatarData.file)
  } else if (avatarData.url) {
    formData.append('avatarUrl', avatarData.url)
  }
  
  const response = await fetch('/api/users/avatar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to upload avatar')
  }
  
  return response.json()
}

// Get user reviews
export const getUserReviews = async (params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/users/reviews?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response.json()
}

// Get user bookmarks
export const getUserBookmarks = async (params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/users/bookmarks?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response.json()
}

// Get user activity
export const getUserActivity = async (params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/users/activity?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response.json()
}

// Delete user account
export const deleteUserAccount = async () => {
  const response = await apiRequest('/api/users/account', {
    method: 'DELETE',
  })
  return response.json()
}