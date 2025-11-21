// Progress Tracking API Service
import { apiMethods } from './api';

const progressService = {
  // Get student's progress report
  getStudentProgressReport: async (studentId) => {
    try {
      const endpoint = studentId
        ? `homework/progress/report/${studentId}/`
        : 'homework/progress/report/';
      const response = await apiMethods.get(endpoint);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching student progress report:', error);
      throw error;
    }
  },

  // Get my progress (for current logged-in student)
  getMyProgress: async () => {
    try {
      const response = await apiMethods.get('homework/lesson-progress/my_progress/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching my progress:', error);
      throw error;
    }
  },

  // Get lesson progress list
  getLessonProgress: async (params = {}) => {
    try {
      const response = await apiMethods.get('homework/lesson-progress/', { params });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
      throw error;
    }
  },

  // Get detailed lesson progress
  getLessonProgressDetail: async (progressId) => {
    try {
      const response = await apiMethods.get(`homework/lesson-progress/${progressId}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching lesson progress detail:', error);
      throw error;
    }
  },

  // Get subject-wise progress summary
  getSubjectProgress: async (studentId, subjectId) => {
    try {
      const params = { student: studentId, lesson__subject: subjectId };
      const response = await apiMethods.get('homework/lesson-progress/', { params });
      return response.data || response;
    } catch (error) {
      console.error('Error fetching subject progress:', error);
      throw error;
    }
  }
};

export default progressService;
