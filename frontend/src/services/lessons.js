/**
 * Lessons API Service
 * Handles lesson management, resources, tags, and analytics
 */

import { apiMethods } from './api.js';

/**
 * Lessons Service Class
 */
class LessonsService {
  // ==================== LESSONS ====================

  /**
   * Get Lessons
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lessons list
   */
  async getLessons(params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', { params });
      return response;
    } catch (error) {
      console.error('Get lessons failed:', error);
      throw error;
    }
  }

  /**
   * Get Minimal Lessons for Dropdowns
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Minimal lessons list
   */
  async getMinimalLessons(params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/minimal/', { params });
      return response;
    } catch (error) {
      console.error('Get minimal lessons failed:', error);
      throw error;
    }
  }

  /**
   * Get Lesson by ID
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Object>} Lesson data
   */
  async getLessonById(lessonId) {
    try {
      const response = await apiMethods.get(`lessons/lessons/${lessonId}/`);
      return response;
    } catch (error) {
      console.error('Get lesson failed:', error);
      throw error;
    }
  }

  /**
   * Create Lesson
   * @param {Object} lessonData - Lesson data
   * @returns {Promise<Object>} Created lesson
   */
  async createLesson(lessonData) {
    try {
      const response = await apiMethods.post('lessons/lessons/', lessonData);
      return response;
    } catch (error) {
      console.error('Create lesson failed:', error);
      throw error;
    }
  }

  /**
   * Update Lesson
   * @param {number} lessonId - Lesson ID
   * @param {Object} lessonData - Lesson data
   * @returns {Promise<Object>} Updated lesson
   */
  async updateLesson(lessonId, lessonData) {
    try {
      const response = await apiMethods.put(`lessons/lessons/${lessonId}/`, lessonData);
      return response;
    } catch (error) {
      console.error('Update lesson failed:', error);
      throw error;
    }
  }

  /**
   * Partially Update Lesson
   * @param {number} lessonId - Lesson ID
   * @param {Object} lessonData - Partial lesson data
   * @returns {Promise<Object>} Updated lesson
   */
  async patchLesson(lessonId, lessonData) {
    try {
      const response = await apiMethods.patch(`lessons/lessons/${lessonId}/`, lessonData);
      return response;
    } catch (error) {
      console.error('Patch lesson failed:', error);
      throw error;
    }
  }

  /**
   * Delete Lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteLesson(lessonId) {
    try {
      const response = await apiMethods.delete(`lessons/lessons/${lessonId}/`);
      return response;
    } catch (error) {
      console.error('Delete lesson failed:', error);
      throw error;
    }
  }

  /**
   * Publish Lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Object>} Publish response
   */
  async publishLesson(lessonId) {
    try {
      const response = await apiMethods.post(`lessons/lessons/${lessonId}/publish/`);
      return response;
    } catch (error) {
      console.error('Publish lesson failed:', error);
      throw error;
    }
  }

  /**
   * Unpublish Lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Object>} Unpublish response
   */
  async unpublishLesson(lessonId) {
    try {
      const response = await apiMethods.post(`lessons/lessons/${lessonId}/unpublish/`);
      return response;
    } catch (error) {
      console.error('Unpublish lesson failed:', error);
      throw error;
    }
  }

  /**
   * Duplicate Lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Object>} Duplicated lesson
   */
  async duplicateLesson(lessonId) {
    try {
      const response = await apiMethods.post(`lessons/lessons/${lessonId}/duplicate/`);
      return response;
    } catch (error) {
      console.error('Duplicate lesson failed:', error);
      throw error;
    }
  }

  /**
   * Get Lesson Analytics
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Object>} Lesson analytics
   */
  async getLessonAnalytics(lessonId) {
    try {
      const response = await apiMethods.get(`lessons/lessons/${lessonId}/analytics/`);
      return response;
    } catch (error) {
      console.error('Get lesson analytics failed:', error);
      throw error;
    }
  }

  // ==================== LESSON RESOURCES ====================

  /**
   * Get Lesson Resources
   * @param {number} lessonId - Lesson ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lesson resources list
   */
  async getLessonResources(lessonId, params = {}) {
    try {
      const response = await apiMethods.get(`lessons/lessons/${lessonId}/resources/`, { params });
      return response;
    } catch (error) {
      console.error('Get lesson resources failed:', error);
      throw error;
    }
  }

  /**
   * Get Lesson Resource by ID
   * @param {number} lessonId - Lesson ID
   * @param {number} resourceId - Resource ID
   * @returns {Promise<Object>} Lesson resource data
   */
  async getLessonResourceById(lessonId, resourceId) {
    try {
      const response = await apiMethods.get(`lessons/lessons/${lessonId}/resources/${resourceId}/`);
      return response;
    } catch (error) {
      console.error('Get lesson resource failed:', error);
      throw error;
    }
  }

  /**
   * Create Lesson Resource
   * @param {number} lessonId - Lesson ID
   * @param {Object} resourceData - Resource data
   * @returns {Promise<Object>} Created lesson resource
   */
  async createLessonResource(lessonId, resourceData) {
    try {
      const response = await apiMethods.post(`lessons/lessons/${lessonId}/resources/`, resourceData);
      return response;
    } catch (error) {
      console.error('Create lesson resource failed:', error);
      throw error;
    }
  }

  /**
   * Update Lesson Resource
   * @param {number} lessonId - Lesson ID
   * @param {number} resourceId - Resource ID
   * @param {Object} resourceData - Resource data
   * @returns {Promise<Object>} Updated lesson resource
   */
  async updateLessonResource(lessonId, resourceId, resourceData) {
    try {
      const response = await apiMethods.put(`lessons/lessons/${lessonId}/resources/${resourceId}/`, resourceData);
      return response;
    } catch (error) {
      console.error('Update lesson resource failed:', error);
      throw error;
    }
  }

  /**
   * Partially Update Lesson Resource
   * @param {number} lessonId - Lesson ID
   * @param {number} resourceId - Resource ID
   * @param {Object} resourceData - Partial resource data
   * @returns {Promise<Object>} Updated lesson resource
   */
  async patchLessonResource(lessonId, resourceId, resourceData) {
    try {
      const response = await apiMethods.patch(`lessons/lessons/${lessonId}/resources/${resourceId}/`, resourceData);
      return response;
    } catch (error) {
      console.error('Patch lesson resource failed:', error);
      throw error;
    }
  }

  /**
   * Delete Lesson Resource
   * @param {number} lessonId - Lesson ID
   * @param {number} resourceId - Resource ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteLessonResource(lessonId, resourceId) {
    try {
      const response = await apiMethods.delete(`lessons/lessons/${lessonId}/resources/${resourceId}/`);
      return response;
    } catch (error) {
      console.error('Delete lesson resource failed:', error);
      throw error;
    }
  }

  /**
   * Upload Lesson Resource File
   * @param {number} lessonId - Lesson ID
   * @param {File} file - File to upload
   * @param {Object} resourceData - Additional resource data
   * @returns {Promise<Object>} Created resource with file
   */
  async uploadLessonResourceFile(lessonId, file, resourceData = {}) {
    try {
      // First, get upload signature
      const signatureResponse = await apiMethods.post('files/upload-signature/', {
        file_type: this.getFileType(file.type),
        context: 'lesson_resource',
        folder: 'lessons',
        max_size: this.getMaxFileSize(file.type)
      });

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signatureResponse.signature);
      formData.append('timestamp', signatureResponse.timestamp);
      formData.append('api_key', signatureResponse.api_key);
      formData.append('folder', signatureResponse.folder);

      const uploadResponse = await fetch(signatureResponse.upload_url, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadResult = await uploadResponse.json();

      // Create lesson resource with file data
      const resourceWithFile = {
        ...resourceData,
        resource_type: this.getResourceType(file.type),
        file: uploadResult.public_id,
        title: resourceData.title || file.name
      };

      return await this.createLessonResource(lessonId, resourceWithFile);
    } catch (error) {
      console.error('Upload lesson resource file failed:', error);
      throw error;
    }
  }

  // ==================== LESSON TAGS ====================

  /**
   * Get Lesson Tags
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lesson tags list
   */
  async getLessonTags(params = {}) {
    try {
      const response = await apiMethods.get('lessons/tags/', { params });
      return response;
    } catch (error) {
      console.error('Get lesson tags failed:', error);
      throw error;
    }
  }

  /**
   * Get Lesson Tag by ID
   * @param {number} tagId - Tag ID
   * @returns {Promise<Object>} Lesson tag data
   */
  async getLessonTagById(tagId) {
    try {
      const response = await apiMethods.get(`lessons/tags/${tagId}/`);
      return response;
    } catch (error) {
      console.error('Get lesson tag failed:', error);
      throw error;
    }
  }

  /**
   * Create Lesson Tag
   * @param {Object} tagData - Tag data
   * @returns {Promise<Object>} Created lesson tag
   */
  async createLessonTag(tagData) {
    try {
      const response = await apiMethods.post('lessons/tags/', tagData);
      return response;
    } catch (error) {
      console.error('Create lesson tag failed:', error);
      throw error;
    }
  }

  /**
   * Update Lesson Tag
   * @param {number} tagId - Tag ID
   * @param {Object} tagData - Tag data
   * @returns {Promise<Object>} Updated lesson tag
   */
  async updateLessonTag(tagId, tagData) {
    try {
      const response = await apiMethods.put(`lessons/tags/${tagId}/`, tagData);
      return response;
    } catch (error) {
      console.error('Update lesson tag failed:', error);
      throw error;
    }
  }

  /**
   * Delete Lesson Tag
   * @param {number} tagId - Tag ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteLessonTag(tagId) {
    try {
      const response = await apiMethods.delete(`lessons/tags/${tagId}/`);
      return response;
    } catch (error) {
      console.error('Delete lesson tag failed:', error);
      throw error;
    }
  }

  // ==================== HELPER ENDPOINTS ====================

  /**
   * Get Available Grades for Subject
   * @param {number} subjectId - Subject ID
   * @returns {Promise<Object>} Available grades
   */
  async getGradesForSubject(subjectId) {
    try {
      const response = await apiMethods.get(`lessons/subjects/${subjectId}/grades/`);
      return response;
    } catch (error) {
      console.error('Get grades for subject failed:', error);
      throw error;
    }
  }

  /**
   * Get Available Subjects for Grade
   * @param {number} gradeId - Grade ID
   * @returns {Promise<Object>} Available subjects
   */
  async getSubjectsForGrade(gradeId) {
    try {
      const response = await apiMethods.get(`lessons/grades/${gradeId}/subjects/`);
      return response;
    } catch (error) {
      console.error('Get subjects for grade failed:', error);
      throw error;
    }
  }

  // ==================== SEARCH AND FILTERING ====================

  /**
   * Search Lessons
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
   */
  async searchLessons(query, filters = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...filters, search: query }
      });
      return response;
    } catch (error) {
      console.error('Search lessons failed:', error);
      throw error;
    }
  }

  /**
   * Get Lessons by Subject
   * @param {number} subjectId - Subject ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lessons for subject
   */
  async getLessonsBySubject(subjectId, params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...params, subject: subjectId }
      });
      return response;
    } catch (error) {
      console.error('Get lessons by subject failed:', error);
      throw error;
    }
  }

  /**
   * Get Lessons by Grade
   * @param {number} gradeId - Grade ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lessons for grade
   */
  async getLessonsByGrade(gradeId, params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...params, grade: gradeId }
      });
      return response;
    } catch (error) {
      console.error('Get lessons by grade failed:', error);
      throw error;
    }
  }

  /**
   * Get Lessons by Cycle
   * @param {string} cycle - Cycle (first|second)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lessons for cycle
   */
  async getLessonsByCycle(cycle, params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...params, cycle }
      });
      return response;
    } catch (error) {
      console.error('Get lessons by cycle failed:', error);
      throw error;
    }
  }

  /**
   * Get Lessons by Difficulty
   * @param {string} difficulty - Difficulty level (easy|medium|hard)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lessons by difficulty
   */
  async getLessonsByDifficulty(difficulty, params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...params, difficulty_level: difficulty }
      });
      return response;
    } catch (error) {
      console.error('Get lessons by difficulty failed:', error);
      throw error;
    }
  }

  /**
   * Get Lessons by Tags
   * @param {Array|string} tags - Tags (comma-separated or array)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Lessons with tags
   */
  async getLessonsByTags(tags, params = {}) {
    try {
      const tagsParam = Array.isArray(tags) ? tags.join(',') : tags;
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...params, tags: tagsParam }
      });
      return response;
    } catch (error) {
      console.error('Get lessons by tags failed:', error);
      throw error;
    }
  }

  /**
   * Get Published Lessons
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Published lessons
   */
  async getPublishedLessons(params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...params, is_published: true }
      });
      return response;
    } catch (error) {
      console.error('Get published lessons failed:', error);
      throw error;
    }
  }

  /**
   * Get Teacher's Lessons
   * @param {number} teacherId - Teacher ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Teacher's lessons
   */
  async getTeacherLessons(teacherId, params = {}) {
    try {
      const response = await apiMethods.get('lessons/lessons/', {
        params: { ...params, created_by: teacherId }
      });
      return response;
    } catch (error) {
      console.error('Get teacher lessons failed:', error);
      throw error;
    }
  }

  // ==================== LESSON AVAILABILITY ====================

  /**
   * Get Lesson Availability for All Classes
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Array>} Availability records for all classes
   */
  async getLessonAvailability(lessonId) {
    try {
      const response = await apiMethods.get(`lessons/lessons/${lessonId}/availability/`);
      return response;
    } catch (error) {
      console.error('Get lesson availability failed:', error);
      throw error;
    }
  }

  /**
   * Publish/Unpublish Lesson for a Single Class
   * @param {number} lessonId - Lesson ID
   * @param {number} classId - Class ID
   * @param {boolean} isPublished - Whether to publish or unpublish
   * @returns {Promise<Object>} Updated availability record
   */
  async publishLessonForClass(lessonId, classId, isPublished = true) {
    try {
      const response = await apiMethods.post(`lessons/lessons/${lessonId}/publish_for_class/`, {
        class_id: classId,
        is_published: isPublished
      });
      return response;
    } catch (error) {
      console.error('Publish lesson for class failed:', error);
      throw error;
    }
  }

  /**
   * Bulk Publish/Unpublish Lesson for Multiple Classes
   * @param {number} lessonId - Lesson ID
   * @param {Array<number>} classIds - Array of class IDs
   * @param {boolean} isPublished - Whether to publish or unpublish
   * @returns {Promise<Object>} Bulk operation result
   */
  async bulkPublishLesson(lessonId, classIds, isPublished = true) {
    try {
      const response = await apiMethods.post(`lessons/lessons/${lessonId}/bulk_publish/`, {
        class_ids: classIds,
        is_published: isPublished
      });
      return response;
    } catch (error) {
      console.error('Bulk publish lesson failed:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get File Type for Upload
   * @param {string} mimeType - File MIME type
   * @returns {string} File type category
   */
  getFileType(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'document';
    if (mimeType.includes('document') || mimeType.includes('text')) return 'document';
    return 'document';
  }

  /**
   * Get Resource Type from MIME Type
   * @param {string} mimeType - File MIME type
   * @returns {string} Resource type
   */
  getResourceType(mimeType) {
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    if (mimeType.includes('presentation')) return 'PRESENTATION';
    if (mimeType.includes('document') || mimeType.includes('text')) return 'DOCUMENT';
    return 'DOCUMENT';
  }

  /**
   * Get Maximum File Size by Type
   * @param {string} mimeType - File MIME type
   * @returns {number} Maximum file size in bytes
   */
  getMaxFileSize(mimeType) {
    if (mimeType.startsWith('image/')) return 5242880; // 5MB
    if (mimeType.startsWith('video/')) return 52428800; // 50MB
    if (mimeType.startsWith('audio/')) return 20971520; // 20MB
    return 10485760; // 10MB for documents
  }
}

// Create and export singleton instance
const lessonsService = new LessonsService();

export default lessonsService;