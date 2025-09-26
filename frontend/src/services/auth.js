/**
 * Authentication API Service
 * Handles login, registration, password management, and user authentication
 */

import { apiMethods } from './api.js';
import { authStorage } from '../utils/storage.js';

/**
 * Authentication Service Class
 */
class AuthService {
  /**
   * User Login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with tokens and user data
   */
  async login(credentials) {
    try {
      const response = await apiMethods.post('users/login/', credentials);
      
      if (response.access && response.refresh) {
        // Store tokens securely using authStorage
        authStorage.set('token', response.access);
        authStorage.set('refreshToken', response.refresh);
        
        // Store user data
        if (response.user) {
          authStorage.set('user', response.user);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * User Registration
   * @param {Object} userData - Registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.password_confirm - Password confirmation
   * @param {string} userData.first_name - First name
   * @param {string} userData.last_name - Last name
   * @param {string} userData.role - User role
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      const response = await apiMethods.post('users/register/', userData);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Refresh Access Token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New access token
   */
  async refreshToken(refreshToken = null) {
    try {
      const token = refreshToken || this.getRefreshToken();
      if (!token) {
        throw new Error('No refresh token available');
      }

      const response = await apiMethods.post('token/refresh/', {
        refresh: token
      });

      if (response.access) {
        authStorage.set('token', response.access);
        // Handle refresh token rotation
        if (response.refresh) {
          authStorage.set('refreshToken', response.refresh);
        }
      }

      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout(); // Clear invalid tokens
      throw error;
    }
  }

  /**
   * Verify Token
   * @param {string} token - Token to verify
   * @returns {Promise<Object>} Verification response
   */
  async verifyToken(token = null) {
    try {
      const accessToken = token || this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await apiMethods.post('token/verify/', {
        token: accessToken
      });

      return response;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  }

  /**
   * Change Password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.new_password - New password
   * @param {string} passwordData.new_password_confirm - New password confirmation
   * @returns {Promise<Object>} Password change response
   */
  async changePassword(passwordData) {
    try {
      const response = await apiMethods.post('users/change-password/', passwordData);
      return response;
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }

  /**
   * Request Password Reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Password reset response
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiMethods.post('users/password-reset/', { email });
      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Send Heartbeat
   * Updates user's last seen timestamp and online status
   * @returns {Promise<Object>} Heartbeat response
   */
  async sendHeartbeat() {
    try {
      const response = await apiMethods.post('users/heartbeat/');
      return response;
    } catch (error) {
      console.error('Heartbeat failed:', error);
      throw error;
    }
  }

  /**
   * User Logout
   * Calls backend logout endpoint and clears all stored authentication data
   */
  async logout() {
    try {
      // Call backend logout endpoint to mark user as offline
      try {
        await apiMethods.post('users/logout/');
      } catch (error) {
        // Log but don't throw - we still want to clear local storage
        console.error('Backend logout failed:', error);
      }

      // Clear stored tokens and user data using authStorage
      authStorage.remove('token');
      authStorage.remove('refreshToken');
      authStorage.remove('user');

      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth-logout'));

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  /**
   * Get Access Token
   * @returns {string|null} Access token or null
   */
  getAccessToken() {
    return authStorage.get('token');
  }

  /**
   * Get Refresh Token
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken() {
    return authStorage.get('refreshToken');
  }

  /**
   * Get Stored User Data
   * @returns {Object|null} User data or null
   */
  getUserData() {
    return authStorage.get('user');
  }

  /**
   * Check if User is Authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return !!(accessToken || refreshToken);
  }

  /**
   * Check if Access Token is Valid
   * @returns {boolean} Token validity
   */
  isTokenValid() {
    const token = this.getAccessToken();
    return !!token;
  }

  /**
   * Get User Role
   * @returns {string|null} User role or null
   */
  getUserRole() {
    const userData = this.getUserData();
    return userData?.role || null;
  }

  /**
   * Get User Permissions
   * @returns {Array} Array of user permissions
   */
  getUserPermissions() {
    const userData = this.getUserData();
    return userData?.permissions || [];
  }

  /**
   * Check if User Has Permission
   * @param {string} permission - Permission to check
   * @returns {boolean} Permission status
   */
  hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }

  /**
   * Check if User Has Role
   * @param {string|Array} roles - Role(s) to check
   * @returns {boolean} Role status
   */
  hasRole(roles) {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return userRole === roles;
  }

  /**
   * Get Auth Headers for API requests
   * @returns {Object} Authorization headers
   */
  getAuthHeaders() {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Create and export singleton instance
const authService = new AuthService();

// Export individual methods for convenience
export const {
  login,
  register,
  refreshToken,
  verifyToken,
  changePassword,
  requestPasswordReset,
  sendHeartbeat,
  logout,
  isAuthenticated,
  isTokenValid,
  getUserData,
  getUserRole,
  getUserPermissions,
  hasPermission,
  hasRole,
  getAuthHeaders
} = authService;

export default authService;