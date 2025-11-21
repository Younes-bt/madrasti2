import api from './api'

// Exercises API Service
export const exerciseService = {
  // ===============================
  // EXERCISE MANAGEMENT
  // ===============================

  /**
   * Get all exercises with filtering
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response with exercises list
   */
  async getExercises(params = {}) {
    try {
      const response = await api.get('/homework/exercises/', { params })
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length,
        next: response.data.next,
        previous: response.data.previous
      }
    } catch (error) {
      console.error('Error fetching exercises:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch exercises'
      }
    }
  },

  /**
   * Get exercise by ID with full details
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise} API response with exercise details
   */
  async getExerciseById(exerciseId) {
    try {
      const response = await api.get(`/homework/exercises/${exerciseId}/`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching exercise:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch exercise'
      }
    }
  },

  /**
   * Create new exercise
   * @param {Object} exerciseData - Exercise data
   * @returns {Promise} API response with created exercise
   */
  async createExercise(exerciseData) {
    try {
      const response = await api.post('/homework/exercises/', exerciseData)
      return {
        success: true,
        data: response.data,
        message: 'Exercise created successfully'
      }
    } catch (error) {
      console.error('Error creating exercise:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  /**
   * Create a new question for an exercise
   * @param {Object} questionData - Question data
   * @returns {Promise} API response with created question
   */
  async createQuestion(questionData) {
    try {
      const formData = this._buildQuestionFormData(questionData)
      const response = await api.post('/homework/questions/', formData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error creating question:', error)
      return { success: false, error: this._extractErrorMessage(error) }
    }
  },

  /**
   * Update existing exercise
   * @param {number} exerciseId - Exercise ID
   * @param {Object} exerciseData - Updated exercise data
   * @returns {Promise} API response with updated exercise
   */
  async updateExercise(exerciseId, exerciseData) {
    try {
      const apiData = this._prepareExerciseForAPI(exerciseData)
      const response = await api.put(`/homework/exercises/${exerciseId}/`, apiData)
      return {
        success: true,
        data: response.data,
        message: 'Exercise updated successfully'
      }
    } catch (error) {
      console.error('Error updating exercise:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  /**
   * Delete exercise
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise} API response
   */
  async deleteExercise(exerciseId) {
    try {
      await api.delete(`/homework/exercises/${exerciseId}/`)
      return {
        success: true,
        message: 'Exercise deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting exercise:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to delete exercise'
      }
    }
  },

  /**
   * Duplicate exercise
   * @param {number} exerciseId - Exercise ID to duplicate
   * @param {Object} duplicateData - New exercise details
   * @returns {Promise} API response with duplicated exercise
   */
  async duplicateExercise(exerciseId, duplicateData) {
    try {
      const response = await api.post(`/homework/exercises/${exerciseId}/duplicate/`, duplicateData)
      return {
        success: true,
        data: response.data,
        message: 'Exercise duplicated successfully'
      }
    } catch (error) {
      console.error('Error duplicating exercise:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  /**
   * Publish exercise (make it available)
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise} API response
   */
  async publishExercise(exerciseId) {
    try {
      const response = await api.patch(`/homework/exercises/${exerciseId}/`, {
        is_published: true
      })
      return {
        success: true,
        data: response.data,
        message: 'Exercise published successfully'
      }
    } catch (error) {
      console.error('Error publishing exercise:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  // ===============================
  // EXERCISE SUBMISSIONS
  // ===============================

  /**
   * Get exercise submissions
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response with submissions list
   */
  async getExerciseSubmissions(params = {}) {
    try {
      const response = await api.get('/homework/exercise-submissions/', { params })
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length
      }
    } catch (error) {
      console.error('Error fetching exercise submissions:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch exercise submissions'
      }
    }
  },

  /**
   * Start exercise attempt for student
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise} API response
   */
  async startExercise(exerciseId) {
    try {
      const response = await api.post(`/homework/exercises/${exerciseId}/start/`)
      return {
        success: true,
        data: response.data,
        message: 'Exercise started successfully'
      }
    } catch (error) {
      console.error('Error starting exercise:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  /**
   * Submit exercise answers
   * @param {number} exerciseId - Exercise ID
   * @param {Object} submissionData - Submission data with answers
   * @returns {Promise} API response
   */
  async submitExercise(exerciseId, submissionData) {
    try {
      const response = await api.post(`/homework/exercises/${exerciseId}/submit/`, submissionData)
      return {
        success: true,
        data: response.data,
        message: 'Exercise submitted successfully'
      }
    } catch (error) {
      console.error('Error submitting exercise:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  // ===============================
  // EXERCISE ANALYTICS & STATISTICS
  // ===============================

  /**
   * Get exercise statistics
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise} API response with exercise statistics
   */
  async getExerciseStatistics(exerciseId) {
    try {
      const response = await api.get(`/homework/exercises/${exerciseId}/analytics/`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching exercise statistics:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch exercise statistics'
      }
    }
  },

  /**
   * Get exercise leaderboard
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise} API response with leaderboard data
   */
  async getExerciseLeaderboard(exerciseId) {
    try {
      const response = await api.get(`/homework/exercises/${exerciseId}/leaderboard/`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching exercise leaderboard:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch exercise leaderboard'
      }
    }
  },

  /**
   * Get exercises by lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise} API response with lesson exercises
   */
  async getExercisesByLesson(lessonId) {
    try {
      const response = await api.get('/homework/exercises/', {
        params: { lesson: lessonId }
      })
      return {
        success: true,
        data: response.data.results || response.data
      }
    } catch (error) {
      console.error('Error fetching lesson exercises:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch lesson exercises'
      }
    }
  },

  /**
   * Get exercise questions
   * @param {number} exerciseId - Exercise ID
   * @returns {Promise} API response with exercise questions
   */
  async getExerciseQuestions(exerciseId) {
    try {
      const response = await api.get('/homework/questions/', {
        params: { exercise: exerciseId }
      })
      return {
        success: true,
        data: response.data.results || response.data
      }
    } catch (error) {
      console.error('Error fetching exercise questions:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch exercise questions'
      }
    }
  },

  /**
   * Update exercise questions (bulk operation)
   * @param {number} exerciseId - Exercise ID
   * @param {Array} questions - Array of question objects
   * @returns {Promise} API response
   */
  async updateExerciseQuestions(exerciseId, questions) {
    try {
      const response = await api.put(`/homework/exercises/${exerciseId}/questions/`, {
        questions: questions
      })
      return {
        success: true,
        data: response.data,
        message: 'Questions updated successfully'
      }
    } catch (error) {
      console.error('Error updating exercise questions:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  /**
   * Update a single question
   * @param {number} questionId - Question ID
   * @param {Object} questionData - Question data
   * @returns {Promise} API response
   */
  async updateQuestion(questionId, questionData) {
    try {
      const formData = this._buildQuestionFormData(questionData)
      const response = await api.put(`/homework/questions/${questionId}/`, formData)
      return {
        success: true,
        data: response.data,
        message: 'Question updated successfully'
      }
    } catch (error) {
      console.error('Error updating question:', error)
      return {
        success: false,
        error: this._extractErrorMessage(error)
      }
    }
  },

  /**
   * Delete a question
   * @param {number} questionId - Question ID
   * @returns {Promise} API response
   */
  async deleteQuestion(questionId) {
    try {
      await api.delete(`/homework/questions/${questionId}/`)
      return {
        success: true,
        message: 'Question deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to delete question'
      }
    }
  },

  // ===============================
  // EXERCISE TYPES & METADATA
  // ===============================

  /**
   * Get available exercise difficulty levels
   * @returns {Array} Difficulty levels configuration
   */
  getDifficultyLevels() {
    return [
      {
        id: 'beginner',
        name: 'Beginner',
        nameKey: 'exercises.difficulty.beginner',
        description: 'Basic concepts and simple questions',
        icon: 'Star',
        color: 'bg-green-500',
        pointMultiplier: 1.0
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        nameKey: 'exercises.difficulty.intermediate',
        description: 'Moderate difficulty with mixed concepts',
        icon: 'TrendingUp',
        color: 'bg-yellow-500',
        pointMultiplier: 1.5
      },
      {
        id: 'advanced',
        name: 'Advanced',
        nameKey: 'exercises.difficulty.advanced',
        description: 'Complex problems requiring deep understanding',
        icon: 'Zap',
        color: 'bg-red-500',
        pointMultiplier: 2.0
      },
      {
        id: 'expert',
        name: 'Expert',
        nameKey: 'exercises.difficulty.expert',
        description: 'Challenging exercises for top performers',
        icon: 'Crown',
        color: 'bg-purple-500',
        pointMultiplier: 3.0
      }
    ]
  },

  /**
   * Get exercise reward types
   * @returns {Array} Reward types configuration
   */
  getRewardTypes() {
    return [
      {
        id: 'completion',
        name: 'Completion Points',
        description: 'Points for completing the exercise',
        basePoints: 10
      },
      {
        id: 'first_attempt',
        name: 'First Attempt Bonus',
        description: 'Extra points for getting it right first try',
        bonusMultiplier: 1.5
      },
      {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Bonus for 100% correct answers',
        bonusPoints: 50
      },
      {
        id: 'streak',
        name: 'Streak Bonus',
        description: 'Bonus for consecutive correct exercises',
        streakMultiplier: 0.1
      }
    ]
  },

  // ===============================
  // HELPER METHODS
  // ===============================

  /**
   * Prepare exercise data for API submission
   * @param {Object} exerciseData - Raw exercise data from form
   * @returns {Object} API-formatted exercise data
   * @private
   */
  _prepareExerciseForAPI(exerciseData) {
    // Ensure required fields are present
    if (!exerciseData.title?.trim()) {
      throw new Error('Exercise title is required')
    }

    if (!exerciseData.lesson) {
      throw new Error('Lesson is required')
    }

    const apiData = {
      title: exerciseData.title.trim(),
      title_arabic: exerciseData.title_arabic?.trim() || null,
      description: exerciseData.description?.trim() || '',
      instructions: exerciseData.instructions?.trim() || '',
      lesson: exerciseData.lesson,
      exercise_format: exerciseData.exercise_format || 'mixed',
      difficulty_level: exerciseData.difficulty_level || 'beginner',
      estimated_duration: exerciseData.estimated_duration ? parseInt(exerciseData.estimated_duration) : null,
      time_limit: exerciseData.time_limit ? parseInt(exerciseData.time_limit) : null,
      is_timed: exerciseData.is_timed || false,
      total_points: parseFloat(exerciseData.total_points) || 0,
      auto_grade: exerciseData.auto_grade !== false,
      randomize_questions: exerciseData.randomize_questions || false,
      show_results_immediately: exerciseData.show_results_immediately !== false,
      allow_multiple_attempts: exerciseData.allow_multiple_attempts !== false,
      max_attempts: exerciseData.max_attempts ? parseInt(exerciseData.max_attempts) : 0,
      is_active: exerciseData.is_active !== false,
      is_published: exerciseData.is_published !== false,
      available_from: exerciseData.available_from || null,
      available_until: exerciseData.available_until || null,
      reward_config: exerciseData.reward_config || {}
    }

    // Handle optional fields
    if (exerciseData.subject) {
      apiData.subject = exerciseData.subject
    }

    if (exerciseData.grade) {
      apiData.grade = exerciseData.grade
    }

    return apiData
  },

  /**
   * Extract error message from API response
   * @param {Object} error - Axios error object
   * @returns {string} Error message
   * @private
   */
  _extractErrorMessage(error) {
    if (error.response?.data) {
      if (error.response.data.detail) {
        return error.response.data.detail
      } else if (error.response.data.non_field_errors) {
        return error.response.data.non_field_errors.join(', ')
      } else {
        // Try to extract field-specific errors
        const fieldErrors = []
        Object.keys(error.response.data).forEach(field => {
          if (Array.isArray(error.response.data[field])) {
            fieldErrors.push(`${field}: ${error.response.data[field].join(', ')}`)
          }
        })
        if (fieldErrors.length > 0) {
          return fieldErrors.join('; ')
        }
      }
    }
    return 'Failed to process exercise'
  },

  /**
   * Format exercise data from API for frontend use
   * @param {Object} apiExercise - Exercise data from API
   * @returns {Object} Formatted exercise data
   */
  formatExerciseFromAPI(apiExercise) {
    return {
      id: apiExercise.id,
      title: apiExercise.title,
      title_arabic: apiExercise.title_arabic,
      description: apiExercise.description,
      instructions: apiExercise.instructions,
      lesson: {
        id: apiExercise.lesson,
        title: apiExercise.lesson_title
      },
      difficulty_level: apiExercise.difficulty_level,
      estimated_duration: apiExercise.estimated_duration,
      total_points: apiExercise.total_points,
      reward_points: apiExercise.reward_points,
      is_published: apiExercise.is_published,
      allow_multiple_attempts: apiExercise.allow_multiple_attempts,
      show_hints: apiExercise.show_hints,
      immediate_feedback: apiExercise.immediate_feedback,
      randomize_questions: apiExercise.randomize_questions,
      created_at: apiExercise.created_at,
      updated_at: apiExercise.updated_at,
      // Statistics (if available)
      completion_count: apiExercise.completion_count || 0,
      average_score: apiExercise.average_score || 0,
      questions: apiExercise.questions || [],
      // Student-specific data (if available)
      is_completed: apiExercise.is_completed || false,
      best_score: apiExercise.best_score || null,
      attempts_count: apiExercise.attempts_count || 0
    }
  },

  /**
   * Calculate exercise status based on completion and availability
   * @param {Object} exercise - Exercise object
   * @returns {string} Exercise status
   */
  calculateExerciseStatus(exercise) {
    if (!exercise.is_published) return 'draft'
    if (exercise.is_completed) return 'completed'
    if (exercise.attempts_count > 0) return 'in_progress'
    return 'available'
  },

  /**
   * Get exercise difficulty color and icon
   * @param {string} difficultyLevel - Difficulty level
   * @returns {Object} Color and icon configuration
   */
  getDifficultyConfig(difficultyLevel) {
    const levels = this.getDifficultyLevels()
    return levels.find(level => level.id === difficultyLevel) || levels[0]
  },

  _buildQuestionFormData(questionData = {}) {
    const formData = new FormData()
    Object.entries(questionData).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return
      }

      if (key === 'question_image') {
        if (value instanceof File) {
          formData.append(key, value)
        }
        return
      }

      if (['choices', 'blanks', 'ordering_items', 'matching_pairs'].includes(key)) {
        formData.append(key, JSON.stringify(value))
        return
      }

      if (typeof value === 'boolean') {
        formData.append(key, value ? 'true' : 'false')
        return
      }

      formData.append(key, value)
    })

    return formData
  }
}

export default exerciseService
