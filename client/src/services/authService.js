import { getAuthHeaders } from './api'

export const getMe = async () => {
  const response = await fetch('/api/auth/me', {
    headers: getAuthHeaders(),
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }
  
  return response.json()
}

export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch('/api/auth/password', {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to change password')
  }
  
  return response.json()
}
