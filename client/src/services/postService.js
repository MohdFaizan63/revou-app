import { apiRequest } from './api'

export const getPosts = async (params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/posts?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response.json()
}

export const getPost = async (id) => {
  const response = await apiRequest(`/api/posts/${id}`)
  return response.json()
}

export const createPost = async (postData) => {
  // Check if postData is FormData (for media uploads)
  if (postData instanceof FormData) {
    const token = localStorage.getItem('token')
    const headers = {
      'Authorization': token ? `Bearer ${token}` : '',
    }
    
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers,
      body: postData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create post')
    }
    
    return response.json()
  } else {
    // For regular JSON data
    const response = await apiRequest('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.json()
  }
}

export const updatePost = async (id, postData) => {
  const response = await apiRequest(`/api/posts/${id}`, {
    method: 'PUT',
    data: postData
  })
  return response.json()
}

export const deletePost = async (id) => {
  const response = await apiRequest(`/api/posts/${id}`, {
    method: 'DELETE'
  })
  return response.json()
}

export const toggleLike = async (id) => {
  const response = await apiRequest(`/api/posts/${id}/like`, {
    method: 'POST'
  })
  return response.json()
}

export const addComment = async (id, content) => {
  const response = await apiRequest(`/api/posts/${id}/comment`, {
    method: 'POST',
    data: { content }
  })
  return response.json()
}

export const getUserPosts = async (userId, params = {}) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  const url = `/api/posts/user/${userId}?${searchParams.toString()}`
  const response = await apiRequest(url)
  return response.json()
}