/**
 * Users API Service
 * Handles user profile management, user operations, and profile updates
 */

import { apiMethods } from './api.js';

/**
 * Users Service Class
 */
class UsersService {
  /**
   * Get User Profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await apiMethods.get('users/profile/');
      return response;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  }

  /**
   * Update User Profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      const response = await apiMethods.put('users/profile/', profileData);
      return response;
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  }

  /**
   * Partially Update User Profile
   * @param {Object} profileData - Partial profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  async patchProfile(profileData) {
    try {
      const response = await apiMethods.patch('users/profile/', profileData);
      return response;
    } catch (error) {
      console.error('Patch profile failed:', error);
      throw error;
    }
  }

  /**
   * Get All Users (Admin/Staff only)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.page_size - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.role - Filter by role
   * @param {boolean} params.is_active - Filter by active status
   * @returns {Promise<Object>} Paginated users list
   */
  async getUsers(params = {}) {
    try {
      const response = await apiMethods.get('users/', { params });
      return response;
    } catch (error) {
      console.error('Get users failed:', error);
      throw error;
    }
  }

  /**
   * Get User by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const response = await apiMethods.get(`users/${userId}/`);
      return response;
    } catch (error) {
      console.error('Get user by ID failed:', error);
      throw error;
    }
  }

  /**
   * Create New User (Admin/Staff only)
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user data
   */
  async createUser(userData) {
    try {
      const response = await apiMethods.post('users/', userData);
      return response;
    } catch (error) {
      console.error('Create user failed:', error);
      throw error;
    }
  }

  /**
   * Update User (Admin/Staff only)
   * @param {number} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateUser(userId, userData) {
    try {
      const response = await apiMethods.put(`users/${userId}/`, userData);
      return response;
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  }

  /**
   * Partially Update User (Admin/Staff only)
   * @param {number} userId - User ID
   * @param {Object} userData - Partial user data to update
   * @returns {Promise<Object>} Updated user data
   */
  async patchUser(userId, userData) {
    try {
      const response = await apiMethods.patch(`users/${userId}/`, userData);
      return response;
    } catch (error) {
      console.error('Patch user failed:', error);
      throw error;
    }
  }

  /**
   * Delete User (Soft delete - Admin only)
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteUser(userId) {
    try {
      const response = await apiMethods.delete(`users/${userId}/`);
      return response;
    } catch (error) {
      console.error('Delete user failed:', error);
      throw error;
    }
  }

  /**
   * Restore Soft Deleted User (Admin only)
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Restore response
   */
  async restoreUser(userId) {
    try {
      const response = await apiMethods.post(`users/${userId}/restore/`);
      return response;
    } catch (error) {
      console.error('Restore user failed:', error);
      throw error;
    }
  }

  /**
   * Upload Profile Picture
   * @param {File} file - Image file
   * @returns {Promise<Object>} Updated user profile data
   */
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await apiMethods.patch('users/profile/', formData);
      return response;
    } catch (error) {
      console.error('Upload profile picture failed:', error);
      throw error;
    }
  }

  /**
   * Get Users by Role
   * @param {string} role - User role
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Users with specified role
   */
  async getUsersByRole(role, params = {}) {
    try {
      const response = await apiMethods.get('users/', {
        params: { ...params, role }
      });
      return response;
    } catch (error) {
      console.error('Get users by role failed:', error);
      throw error;
    }
  }

  /**
   * Get Teachers
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Teachers list
   */
  async getTeachers(params = {}) {
    return this.getUsersByRole('TEACHER', params);
  }

  /**
   * Get Students
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Students list
   */
  async getStudents(params = {}) {
    return this.getUsersByRole('STUDENT', params);
  }

  /**
   * Get Parents
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Parents list
   */
  async getParents(params = {}) {
    return this.getUsersByRole('PARENT', params);
  }

  /**
   * Get Staff Members
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Staff list
   */
  async getStaff(params = {}) {
    return this.getUsersByRole('STAFF', params);
  }

  /**
   * Get Admins
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Admins list
   */
  async getAdmins(params = {}) {
    return this.getUsersByRole('ADMIN', params);
  }

  /**
   * Get Drivers
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Drivers list
   */
  async getDrivers(params = {}) {
    return this.getUsersByRole('DRIVER', params);
  }

  /**
   * Search Users
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchUsers(query, filters = {}) {
    try {
      const response = await apiMethods.get('users/', {
        params: { ...filters, search: query }
      });
      return response;
    } catch (error) {
      console.error('Search users failed:', error);
      throw error;
    }
  }

  /**
   * Get User Statistics (Admin/Staff only)
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    try {
      const response = await apiMethods.get('users/stats/');
      return response;
    } catch (error) {
      console.error('Get user stats failed:', error);
      throw error;
    }
  }

  /**
   * Bulk Update Users (Admin/Staff only)
   * @param {Array} userIds - Array of user IDs
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Bulk update response
   */
  async bulkUpdateUsers(userIds, updateData) {
    try {
      const response = await apiMethods.patch('users/bulk_update/', {
        ids: userIds,
        data: updateData
      });
      return response;
    } catch (error) {
      console.error('Bulk update users failed:', error);
      throw error;
    }
  }

  /**
   * Activate/Deactivate User (Admin/Staff only)
   * @param {number} userId - User ID
   * @param {boolean} isActive - Active status
   * @returns {Promise<Object>} Update response
   */
  async setUserActiveStatus(userId, isActive) {
    try {
      const response = await apiMethods.patch(`users/${userId}/`, {
        is_active: isActive
      });
      return response;
    } catch (error) {
      console.error('Set user active status failed:', error);
      throw error;
    }
  }

  /**
   * Get User Activity Log (Admin/Staff only)
   * @param {number} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} User activity log
   */
  async getUserActivityLog(userId, params = {}) {
    try {
      const response = await apiMethods.get(`users/${userId}/activity/`, { params });
      return response;
    } catch (error) {
      console.error('Get user activity log failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const usersService = new UsersService();

export default usersService;