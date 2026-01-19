import api from './client';

/**
 * Schools API Service for Mobile
 */
class SchoolsService {
    /**
     * Get Class by ID
     * @param {number} classId - Class ID
     * @returns {Promise<Object>} Class data with teachers
     */
    async getClassById(classId: number) {
        try {
            const response = await api.get(`schools/classes/${classId}/`);
            return response.data;
        } catch (error) {
            console.error('Get class by ID failed:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const schoolsService = new SchoolsService();

export default schoolsService;
