// tasks.js - Service for Daily Tasks and Projects

import { apiMethods } from './api.js';

class TasksService {
  // ==================== DAILY TASKS ====================

  /**
   * Get all daily tasks with optional filters
   * @param {Object} params - Query parameters (status, priority, assigned_to, search, page, etc.)
   */
  async getDailyTasks(params = {}) {
    try {
      const response = await apiMethods.get('tasks/daily-tasks/', { params });
      return response;
    } catch (error) {
      console.error('Get daily tasks failed:', error);
      throw error;
    }
  }

  /**
   * Get a single daily task by ID
   * @param {number} taskId
   */
  async getDailyTaskById(taskId) {
    try {
      const response = await apiMethods.get(`tasks/daily-tasks/${taskId}/`);
      return response;
    } catch (error) {
      console.error('Get daily task failed:', error);
      throw error;
    }
  }

  /**
   * Create a new daily task (admin only)
   * @param {Object} taskData
   */
  async createDailyTask(taskData) {
    try {
      const response = await apiMethods.post('tasks/daily-tasks/', taskData);
      return response;
    } catch (error) {
      console.error('Create daily task failed:', error);
      throw error;
    }
  }

  /**
   * Update a daily task (admin only)
   * @param {number} taskId
   * @param {Object} taskData
   */
  async updateDailyTask(taskId, taskData) {
    try {
      const response = await apiMethods.put(`tasks/daily-tasks/${taskId}/`, taskData);
      return response;
    } catch (error) {
      console.error('Update daily task failed:', error);
      throw error;
    }
  }

  /**
   * Partially update a daily task (admin only)
   * @param {number} taskId
   * @param {Object} taskData
   */
  async patchDailyTask(taskId, taskData) {
    try {
      const response = await apiMethods.patch(`tasks/daily-tasks/${taskId}/`, taskData);
      return response;
    } catch (error) {
      console.error('Patch daily task failed:', error);
      throw error;
    }
  }

  /**
   * Delete a daily task (admin only)
   * @param {number} taskId
   */
  async deleteDailyTask(taskId) {
    try {
      const response = await apiMethods.delete(`tasks/daily-tasks/${taskId}/`);
      return response;
    } catch (error) {
      console.error('Delete daily task failed:', error);
      throw error;
    }
  }

  /**
   * Get current user's tasks
   * @param {string} status - Optional status filter
   */
  async getMyTasks(status = null) {
    try {
      const params = status ? { status } : {};
      const response = await apiMethods.get('tasks/daily-tasks/my_tasks/', { params });
      return response;
    } catch (error) {
      console.error('Get my tasks failed:', error);
      throw error;
    }
  }

  /**
   * Start a task (mark as in progress)
   * @param {number} taskId
   */
  async startTask(taskId) {
    try {
      const response = await apiMethods.post(`tasks/daily-tasks/${taskId}/start_task/`);
      return response;
    } catch (error) {
      console.error('Start task failed:', error);
      throw error;
    }
  }

  /**
   * Mark task as done (with optional notes)
   * @param {number} taskId
   * @param {string} notes - Optional user notes
   */
  async markTaskDone(taskId, notes = '') {
    try {
      const response = await apiMethods.post(`tasks/daily-tasks/${taskId}/mark_done/`, {
        user_notes: notes
      });
      return response;
    } catch (error) {
      console.error('Mark task done failed:', error);
      throw error;
    }
  }

  /**
   * Rate a completed task (admin only)
   * @param {number} taskId
   * @param {number} rating - 1-5 stars
   * @param {string} feedback - Optional feedback
   */
  async rateTask(taskId, rating, feedback = '') {
    try {
      const response = await apiMethods.post(`tasks/daily-tasks/${taskId}/rate_task/`, {
        rating,
        rating_feedback: feedback
      });
      return response;
    } catch (error) {
      console.error('Rate task failed:', error);
      throw error;
    }
  }

  /**
   * Get task statistics
   */
  async getTaskStats() {
    try {
      const response = await apiMethods.get('tasks/daily-tasks/stats/');
      return response;
    } catch (error) {
      console.error('Get task stats failed:', error);
      throw error;
    }
  }

  // ==================== USER PROGRESS ====================

  /**
   * Get user progress (all users for admin, own for others)
   * @param {Object} params - Query parameters
   */
  async getUserProgress(params = {}) {
    try {
      const response = await apiMethods.get('tasks/task-progress/', { params });
      return response;
    } catch (error) {
      console.error('Get user progress failed:', error);
      throw error;
    }
  }

  /**
   * Get current user's progress
   * @param {boolean} refresh - Force refresh calculation
   */
  async getMyProgress(refresh = false) {
    try {
      const params = refresh ? { refresh: true } : {};
      const response = await apiMethods.get('tasks/task-progress/my_progress/', { params });
      return response;
    } catch (error) {
      console.error('Get my progress failed:', error);
      throw error;
    }
  }

  /**
   * Get leaderboard (top 10 performers, admin only)
   */
  async getLeaderboard() {
    try {
      const response = await apiMethods.get('tasks/task-progress/leaderboard/');
      return response;
    } catch (error) {
      console.error('Get leaderboard failed:', error);
      throw error;
    }
  }

  /**
   * Refresh user progress metrics
   * @param {number} progressId
   */
  async refreshProgress(progressId) {
    try {
      const response = await apiMethods.post(`tasks/task-progress/${progressId}/refresh/`);
      return response;
    } catch (error) {
      console.error('Refresh progress failed:', error);
      throw error;
    }
  }

  // ==================== PROJECTS ====================

  /**
   * Get all projects with optional filters
   * @param {Object} params - Query parameters
   */
  async getProjects(params = {}) {
    try {
      const response = await apiMethods.get('projects/projects/', { params });
      return response;
    } catch (error) {
      console.error('Get projects failed:', error);
      throw error;
    }
  }

  /**
   * Get a single project by ID
   * @param {number} projectId
   */
  async getProjectById(projectId) {
    try {
      const response = await apiMethods.get(`projects/projects/${projectId}/`);
      return response;
    } catch (error) {
      console.error('Get project failed:', error);
      throw error;
    }
  }

  /**
   * Create a new project (admin only)
   * @param {Object} projectData
   */
  async createProject(projectData) {
    try {
      const response = await apiMethods.post('projects/projects/', projectData);
      return response;
    } catch (error) {
      console.error('Create project failed:', error);
      throw error;
    }
  }

  /**
   * Update a project
   * @param {number} projectId
   * @param {Object} projectData
   */
  async updateProject(projectId, projectData) {
    try {
      const response = await apiMethods.put(`projects/projects/${projectId}/`, projectData);
      return response;
    } catch (error) {
      console.error('Update project failed:', error);
      throw error;
    }
  }

  /**
   * Partially update a project
   * @param {number} projectId
   * @param {Object} projectData
   */
  async patchProject(projectId, projectData) {
    try {
      const response = await apiMethods.patch(`projects/projects/${projectId}/`, projectData);
      return response;
    } catch (error) {
      console.error('Patch project failed:', error);
      throw error;
    }
  }

  /**
   * Delete a project (admin only)
   * @param {number} projectId
   */
  async deleteProject(projectId) {
    try {
      const response = await apiMethods.delete(`projects/projects/${projectId}/`);
      return response;
    } catch (error) {
      console.error('Delete project failed:', error);
      throw error;
    }
  }

  /**
   * Get current user's projects
   * @param {string} status - Optional status filter
   */
  async getMyProjects(status = null) {
    try {
      const params = status ? { status } : {};
      const response = await apiMethods.get('projects/projects/my_projects/', { params });
      return response;
    } catch (error) {
      console.error('Get my projects failed:', error);
      throw error;
    }
  }

  /**
   * Add team member to project (admin only)
   * @param {number} projectId
   * @param {number} userId
   */
  async addProjectMember(projectId, userId) {
    try {
      const response = await apiMethods.post(`projects/projects/${projectId}/add_member/`, {
        user_id: userId
      });
      return response;
    } catch (error) {
      console.error('Add project member failed:', error);
      throw error;
    }
  }

  /**
   * Remove team member from project (admin only)
   * @param {number} projectId
   * @param {number} userId
   */
  async removeProjectMember(projectId, userId) {
    try {
      const response = await apiMethods.post(`projects/projects/${projectId}/remove_member/`, {
        user_id: userId
      });
      return response;
    } catch (error) {
      console.error('Remove project member failed:', error);
      throw error;
    }
  }

  /**
   * Get detailed project progress report
   * @param {number} projectId
   */
  async getProjectProgress(projectId) {
    try {
      const response = await apiMethods.get(`projects/projects/${projectId}/progress/`);
      return response;
    } catch (error) {
      console.error('Get project progress failed:', error);
      throw error;
    }
  }

  // ==================== PROJECT TASKS ====================

  /**
   * Get tasks for a specific project
   * @param {number} projectId
   * @param {Object} params - Query parameters
   */
  async getProjectTasks(projectId, params = {}) {
    try {
      const response = await apiMethods.get(`projects/projects/${projectId}/tasks/`, { params });
      return response;
    } catch (error) {
      console.error('Get project tasks failed:', error);
      throw error;
    }
  }

  /**
   * Create a new task in a project
   * @param {number} projectId
   * @param {Object} taskData
   */
  async createProjectTask(projectId, taskData) {
    try {
      const response = await apiMethods.post(`projects/projects/${projectId}/tasks/`, taskData);
      return response;
    } catch (error) {
      console.error('Create project task failed:', error);
      throw error;
    }
  }

  /**
   * Get a single project task
   * @param {number} projectId
   * @param {number} taskId
   */
  async getProjectTask(projectId, taskId) {
    try {
      const response = await apiMethods.get(`projects/projects/${projectId}/tasks/${taskId}/`);
      return response;
    } catch (error) {
      console.error('Get project task failed:', error);
      throw error;
    }
  }

  /**
   * Update a project task
   * @param {number} projectId
   * @param {number} taskId
   * @param {Object} taskData
   */
  async updateProjectTask(projectId, taskId, taskData) {
    try {
      const response = await apiMethods.put(`projects/projects/${projectId}/tasks/${taskId}/`, taskData);
      return response;
    } catch (error) {
      console.error('Update project task failed:', error);
      throw error;
    }
  }

  /**
   * Partially update a project task
   * @param {number} projectId
   * @param {number} taskId
   * @param {Object} taskData
   */
  async patchProjectTask(projectId, taskId, taskData) {
    try {
      const response = await apiMethods.patch(`projects/projects/${projectId}/tasks/${taskId}/`, taskData);
      return response;
    } catch (error) {
      console.error('Patch project task failed:', error);
      throw error;
    }
  }

  /**
   * Delete a project task
   * @param {number} projectId
   * @param {number} taskId
   */
  async deleteProjectTask(projectId, taskId) {
    try {
      const response = await apiMethods.delete(`projects/projects/${projectId}/tasks/${taskId}/`);
      return response;
    } catch (error) {
      console.error('Delete project task failed:', error);
      throw error;
    }
  }

  /**
   * Get current user's tasks across all projects
   * @param {string} status - Optional status filter
   */
  async getMyProjectTasks(status = null) {
    try {
      const params = status ? { status } : {};
      const response = await apiMethods.get('projects/tasks/my_tasks/', { params });
      return response;
    } catch (error) {
      console.error('Get my project tasks failed:', error);
      throw error;
    }
  }

  /**
   * Quick status update for a project task
   * @param {number} projectId
   * @param {number} taskId
   * @param {string} status
   */
  async updateProjectTaskStatus(projectId, taskId, status) {
    try {
      const response = await apiMethods.post(`projects/projects/${projectId}/tasks/${taskId}/update_status/`, {
        status
      });
      return response;
    } catch (error) {
      console.error('Update project task status failed:', error);
      throw error;
    }
  }

  // ==================== PROJECT COMMENTS ====================

  /**
   * Get comments for a project
   * @param {number} projectId
   */
  async getProjectComments(projectId) {
    try {
      const response = await apiMethods.get(`projects/projects/${projectId}/comments/`);
      return response;
    } catch (error) {
      console.error('Get project comments failed:', error);
      throw error;
    }
  }

  /**
   * Add a comment to a project
   * @param {number} projectId
   * @param {Object} commentData
   */
  async addProjectComment(projectId, commentData) {
    try {
      const response = await apiMethods.post(`projects/projects/${projectId}/comments/`, commentData);
      return response;
    } catch (error) {
      console.error('Add project comment failed:', error);
      throw error;
    }
  }

  /**
   * Get comments for a project task
   * @param {number} projectId
   * @param {number} taskId
   */
  async getProjectTaskComments(projectId, taskId) {
    try {
      const response = await apiMethods.get(`projects/projects/${projectId}/tasks/${taskId}/comments/`);
      return response;
    } catch (error) {
      console.error('Get project task comments failed:', error);
      throw error;
    }
  }

  /**
   * Add a comment to a project task
   * @param {number} projectId
   * @param {number} taskId
   * @param {Object} commentData
   */
  async addProjectTaskComment(projectId, taskId, commentData) {
    try {
      const response = await apiMethods.post(`projects/projects/${projectId}/tasks/${taskId}/comments/`, commentData);
      return response;
    } catch (error) {
      console.error('Add project task comment failed:', error);
      throw error;
    }
  }
}

export default new TasksService();
