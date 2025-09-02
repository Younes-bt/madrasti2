/**
 * Main API configuration with Axios and JWT interceptors
 * Handles authentication, error handling, and request/response transformations
 */

import axios from 'axios';
import { authStorage } from '../utils/storage.js';

// API Configuration
const API_CONFIG = {
  baseURL: {
    development: '/api/',
    staging: 'https://staging-api.madrasti.ma/api/',
    production: 'https://api.madrasti.ma/api/'
  },
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000 // 1 second
};

// Get current environment base URL
const getBaseURL = () => {
  const env = import.meta.env.MODE || 'development';
  return API_CONFIG.baseURL[env] || API_CONFIG.baseURL.development;
};

// Create Axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Add JWT token if available
    const token = authStorage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Calculate response time
    const responseTime = new Date() - response.config.metadata.startTime;

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
        data: response.data,
        responseTime: `${responseTime}ms`
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.response?.status || 'Network'} ${originalRequest?.url}`, {
        error: error.response?.data || error.message,
        config: originalRequest
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = authStorage.get('refreshToken');
        if (refreshToken) {
          const refreshResponse = await refreshAccessToken(refreshToken);
          
          if (refreshResponse.access) {
            // Update token and retry original request
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.access}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // Refresh failed - redirect to login
      handleAuthenticationError();
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      error.isNetworkError = true;
      error.userMessage = 'Network error. Please check your internet connection.';
    }

    // Add user-friendly error messages
    error.userMessage = getUserFriendlyErrorMessage(error);
    
    return Promise.reject(error);
  }
);

// Token refresh function
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${getBaseURL()}token/refresh/`, {
      refresh: refreshToken
    });

    // Store new access token
    if (response.data.access) {
      authStorage.set('token', response.data.access);
    }

    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// Handle authentication errors
const handleAuthenticationError = () => {
  // Clear stored auth data
  authStorage.remove('token');
  authStorage.remove('refreshToken');
  authStorage.remove('user');

  // Trigger auth context update
  window.dispatchEvent(new CustomEvent('auth-error', { 
    detail: { message: 'Authentication failed. Please log in again.' }
  }));

  // Redirect to login if not already there
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
};

// Get user-friendly error messages
const getUserFriendlyErrorMessage = (error) => {
  const status = error.response?.status;
  const errorData = error.response?.data;

  switch (status) {
    case 400:
      return errorData?.error || 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'You don\'t have permission to perform this action.';
    case 404:
      return 'Requested resource not found.';
    case 422:
      return 'Validation failed. Please check your input.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      if (error.isNetworkError) {
        return 'Network error. Please check your internet connection.';
      }
      return errorData?.error || 'An unexpected error occurred.';
  }
};

// Generic API methods
export const apiMethods = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Health check function
export const checkAPIHealth = async () => {
  try {
    const response = await api.get('health/');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// File upload helper
export const uploadFile = async (file, uploadUrl, formData = {}) => {
  const data = new FormData();
  data.append('file', file);
  
  // Add additional form data
  Object.keys(formData).forEach(key => {
    data.append(key, formData[key]);
  });

  try {
    const response = await api.post(uploadUrl, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute for file uploads
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;