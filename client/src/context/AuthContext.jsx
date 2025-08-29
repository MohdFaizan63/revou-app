import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { getMe } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token')
  }

  // Set token in localStorage
  const setToken = (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch (error) {
      return true
    }
  }

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery(
    ['user'],
    getMe,
    {
      enabled: !!getToken() && !isTokenExpired(getToken()),
      retry: false,
      onError: (error) => {
        console.error('Auth error:', error)
        // Clear token if it's an auth error
        if (error.message.includes('Not authorized') || error.message.includes('token')) {
          setToken(null)
          setUser(null)
        }
      },
      onSuccess: (data) => {
        setUser(data)
      }
    }
  )

  useEffect(() => {
    const token = getToken()
    if (!token || isTokenExpired(token)) {
      setLoading(false)
      if (token) {
        setToken(null)
        setUser(null)
      }
    } else if (!isLoading) {
      setLoading(false)
    }
  }, [isLoading])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setToken(data.token)
      setUser(data)
      queryClient.invalidateQueries(['user'])
      
      toast.success('Login successful!')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setToken(data.token)
      setUser(data)
      queryClient.invalidateQueries(['user'])
      
      toast.success('Registration successful!')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  // Logout function
  const logout = () => {
    setToken(null)
    setUser(null)
    queryClient.clear()
    toast.success('Logged out successfully')
  }

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const token = getToken()
      if (!token || isTokenExpired(token)) {
        throw new Error('Session expired. Please login again.')
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed')
      }

      setUser(data)
      queryClient.invalidateQueries(['user'])
      
      toast.success('Profile updated successfully!')
      return data
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    getToken,
    isTokenExpired,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
