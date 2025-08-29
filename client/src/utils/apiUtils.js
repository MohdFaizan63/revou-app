// client/src/utils/apiUtils.js

// Get the base API URL
export const getApiBaseUrl = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return '';
};

// Construct full API URLs
export const getApiUrl = (endpoint) => {
  const base = getApiBaseUrl();
  return `${base}${endpoint}`;
};

// Get authorization headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch the current user's data
export const getMe = async () => {
  const response = await fetch(getApiUrl('/api/auth/me'), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
};

// Change the user's password
export const changePassword = async (currentPassword, newPassword) => {
  const response = await fetch(getApiUrl('/api/auth/password'), {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to change password');
  }

  return response.json();
};
