import api from './client';

/**
 * Users API Service for Mobile
 */
class UsersService {
    /**
     * Get User Profile
     * @returns {Promise<Object>} User profile data
     */
    async getProfile() {
        try {
            const response = await api.get('users/profile/');
            return response.data;
        } catch (error) {
            console.error('Get profile failed:', error);
            throw error;
        }
    }

    /**
     * Get Children for a Parent
     * @param {number} parentId - Parent User ID
     * @returns {Promise<Object>} Object containing parent and children data
     */
    async getUserChildren(parentId: number) {
        try {
            const response = await api.get(`users/users/${parentId}/children/`);
            return response.data;
        } catch (error) {
            console.error('Get user children failed:', error);
            throw error;
        }
    }

    /**
     * Get User by ID
     * @param {number} userId - User ID
     * @returns {Promise<Object>} User data
     */
    async getUserById(userId: number) {
        try {
            const response = await api.get(`users/users/${userId}/`);
            return response.data;
        } catch (error) {
            console.error('Get user by ID failed:', error);
            throw error;
        }
    }

    /**
     * Update User Profile
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<Object>} Updated profile data
     */
    async updateProfile(profileData: any) {
        try {
            const response = await api.put('users/profile/', profileData);
            return response.data;
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
    async patchProfile(profileData: any) {
        try {
            const response = await api.patch('users/profile/', profileData);
            return response.data;
        } catch (error) {
            console.error('Patch profile failed:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const usersService = new UsersService();

export default usersService;
