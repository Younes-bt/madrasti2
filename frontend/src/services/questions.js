import api from './api'

// Question Bank API Service
export const questionService = {
  // ===============================
  // QUESTION MANAGEMENT
  // ===============================

  /**
   * Get all questions with filtering
   * @param {Object} params - Filter parameters
   * @returns {Promise} API response with questions list
   */
  async getQuestions(params = {}) {
    try {
      const response = await api.get('/api/homework/questions/', { params })
      return {
        success: true,
        data: response.data,
        total: response.data.count || response.data.length
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch questions'
      }
    }
  },

  /**
   * Get questions for a specific homework
   * @param {number} homeworkId - Homework ID
   * @returns {Promise} API response with homework questions
   */
  async getQuestionsByHomework(homeworkId) {
    try {
      const response = await api.get('/api/homework/questions/', {
        params: { homework: homeworkId }
      })
      return {
        success: true,
        data: response.data.results || response.data
      }
    } catch (error) {
      console.error('Error fetching homework questions:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch homework questions'
      }
    }
  },

  /**
   * Get question bank with statistics by subject/type
   * @param {Object} filters - Filter options
   * @returns {Promise} API response with question bank data
   */
  async getQuestionBank(filters = {}) {
    try {
      const params = {
        page_size: 100, // Get more questions for question bank
        ...filters
      }

      const response = await api.get('/api/homework/questions/', { params })

      // Group questions by type for statistics
      const questions = response.data.results || response.data
      const questionsByType = {}
      const questionsBySubject = {}
      const questionsByDifficulty = {}

      questions.forEach(question => {
        // By type
        if (!questionsByType[question.question_type]) {
          questionsByType[question.question_type] = []
        }
        questionsByType[question.question_type].push(question)

        // By subject (from homework)
        const subject = question.homework?.subject?.name || 'Unknown'
        if (!questionsBySubject[subject]) {
          questionsBySubject[subject] = []
        }
        questionsBySubject[subject].push(question)

        // By difficulty (calculate based on usage/accuracy)
        const difficulty = this._calculateDifficulty(question)
        if (!questionsByDifficulty[difficulty]) {
          questionsByDifficulty[difficulty] = []
        }
        questionsByDifficulty[difficulty].push(question)
      })

      return {
        success: true,
        data: {
          questions,
          statistics: {
            total: questions.length,
            byType: Object.keys(questionsByType).map(type => ({
              type,
              count: questionsByType[type].length,
              questions: questionsByType[type]
            })),
            bySubject: Object.keys(questionsBySubject).map(subject => ({
              subject,
              count: questionsBySubject[subject].length,
              questions: questionsBySubject[subject]
            })),
            byDifficulty: Object.keys(questionsByDifficulty).map(difficulty => ({
              difficulty,
              count: questionsByDifficulty[difficulty].length,
              questions: questionsByDifficulty[difficulty]
            }))
          }
        }
      }
    } catch (error) {
      console.error('Error fetching question bank:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch question bank'
      }
    }
  },

  /**
   * Get a single question by ID with full details
   * @param {number} questionId - Question ID
   * @returns {Promise} API response with question details
   */
  async getQuestion(questionId) {
    try {
      const response = await api.get(`/api/homework/questions/${questionId}/`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching question:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch question'
      }
    }
  },

  /**
   * Create a new question
   * @param {Object} questionData - Question data
   * @returns {Promise} API response with created question
   */
  async createQuestion(questionData) {
    try {
      // Prepare question data for API
      const apiData = this._prepareQuestionForAPI(questionData)

      const response = await api.post('/api/homework/questions/', apiData)
      return {
        success: true,
        data: response.data,
        message: 'Question created successfully'
      }
    } catch (error) {
      console.error('Error creating question:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Sent data:', apiData)

      let errorMessage = 'Failed to create question'

      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ')
        } else {
          // Try to extract field-specific errors
          const fieldErrors = []
          Object.keys(error.response.data).forEach(field => {
            if (Array.isArray(error.response.data[field])) {
              fieldErrors.push(`${field}: ${error.response.data[field].join(', ')}`)
            }
          })
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('; ')
          }
        }
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  },

  /**
   * Update an existing question
   * @param {number} questionId - Question ID
   * @param {Object} questionData - Updated question data
   * @returns {Promise} API response with updated question
   */
  async updateQuestion(questionId, questionData) {
    try {
      const apiData = this._prepareQuestionForAPI(questionData)

      const response = await api.put(`/api/homework/questions/${questionId}/`, apiData)
      return {
        success: true,
        data: response.data,
        message: 'Question updated successfully'
      }
    } catch (error) {
      console.error('Error updating question:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to update question'
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
      await api.delete(`/api/homework/questions/${questionId}/`)
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

  /**
   * Bulk create multiple questions
   * @param {Array} questionsData - Array of question data objects
   * @returns {Promise} API response with created questions
   */
  async bulkCreateQuestions(questionsData) {
    try {
      const preparedQuestions = questionsData.map(q => this._prepareQuestionForAPI(q))

      const response = await api.post('/api/homework/questions/bulk_create/', {
        questions: preparedQuestions
      })

      return {
        success: true,
        data: response.data,
        message: `${questionsData.length} questions created successfully`
      }
    } catch (error) {
      console.error('Error bulk creating questions:', error)
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to create questions'
      }
    }
  },

  // ===============================
  // QUESTION TYPES & METADATA
  // ===============================

  /**
   * Get available question types with metadata
   * @returns {Array} Question types configuration
   */
  getQuestionTypes() {
    return [
      {
        id: 'qcm_single',
        name: 'QCM Single Choice',
        nameKey: 'questionTypes.qcmSingle',
        description: 'Multiple choice with one correct answer',
        category: 'choice',
        requiresChoices: true,
        allowsMultipleCorrect: false,
        icon: 'CheckSquare',
        color: 'bg-blue-500'
      },
      {
        id: 'qcm_multiple',
        name: 'QCM Multiple Choice',
        nameKey: 'questionTypes.qcmMultiple',
        description: 'Multiple choice with multiple correct answers',
        category: 'choice',
        requiresChoices: true,
        allowsMultipleCorrect: true,
        icon: 'CheckSquare',
        color: 'bg-green-500'
      },
      {
        id: 'open_short',
        name: 'Short Answer',
        nameKey: 'questionTypes.openShort',
        description: 'Brief text response (1-2 sentences)',
        category: 'text',
        requiresChoices: false,
        allowsMultipleAnswers: true,
        icon: 'FileText',
        color: 'bg-orange-500'
      },
      {
        id: 'open_long',
        name: 'Long Answer',
        nameKey: 'questionTypes.openLong',
        description: 'Detailed text response (essay format)',
        category: 'text',
        requiresChoices: false,
        requiresManualGrading: true,
        icon: 'FileText',
        color: 'bg-purple-500'
      },
      {
        id: 'true_false',
        name: 'True/False',
        nameKey: 'questionTypes.trueFalse',
        description: 'Binary choice question',
        category: 'choice',
        requiresChoices: true,
        fixedChoices: ['True', 'False'],
        icon: 'ToggleLeft',
        color: 'bg-cyan-500'
      },
      {
        id: 'fill_blank',
        name: 'Fill in the Blank',
        nameKey: 'questionTypes.fillBlank',
        description: 'Complete missing words or phrases',
        category: 'completion',
        requiresChoices: false,
        allowsMultipleAnswers: true,
        icon: 'Type',
        color: 'bg-pink-500'
      },
      {
        id: 'matching',
        name: 'Matching',
        nameKey: 'questionTypes.matching',
        description: 'Match items from two lists',
        category: 'interactive',
        requiresChoices: false,
        requiresCustomData: true,
        icon: 'Link',
        color: 'bg-indigo-500'
      },
      {
        id: 'ordering',
        name: 'Ordering',
        nameKey: 'questionTypes.ordering',
        description: 'Arrange items in correct sequence',
        category: 'interactive',
        requiresChoices: false,
        requiresCustomData: true,
        icon: 'ArrowUpDown',
        color: 'bg-yellow-500'
      }
    ]
  },

  /**
   * Get subjects from existing questions
   * @returns {Promise} List of subjects
   */
  async getSubjects() {
    try {
      // This would typically come from a subjects API
      // For now, extract from questions or use predefined list
      return {
        success: true,
        data: [
          { id: 1, name: 'Mathematics', name_arabic: 'الرياضيات' },
          { id: 2, name: 'Biology', name_arabic: 'علوم الحياة' },
          { id: 3, name: 'Chemistry', name_arabic: 'الكيمياء' },
          { id: 4, name: 'Physics', name_arabic: 'الفيزياء' },
          { id: 5, name: 'Geography', name_arabic: 'الجغرافيا' },
          { id: 6, name: 'History', name_arabic: 'التاريخ' },
          { id: 7, name: 'Literature', name_arabic: 'الأدب' }
        ]
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      return {
        success: false,
        error: 'Failed to fetch subjects'
      }
    }
  },

  // ===============================
  // HELPER METHODS
  // ===============================

  /**
   * Prepare question data for API submission
   * @param {Object} questionData - Raw question data from form
   * @returns {Object} API-formatted question data
   * @private
   */
  _prepareQuestionForAPI(questionData) {
    if (!questionData.question || questionData.question.trim() === '') {
      throw new Error('Question text is required')
    }

    if (!questionData.type) {
      throw new Error('Question type is required')
    }

    const apiData = {
      question_type: questionData.type,
      question_text: questionData.question.trim(),
      question_text_arabic: questionData.questionArabic?.trim() || '',
      explanation: questionData.explanation?.trim() || '',
      explanation_arabic: questionData.explanationArabic?.trim() || '',
      points: parseFloat(questionData.points) || 1.0,
      order: questionData.order || 0,
      is_required: questionData.isRequired !== false,
    }

    // Add homework if provided (for homework-specific questions)
    if (questionData.homeworkId) {
      apiData.homework = questionData.homeworkId
    }

    // Add subject and grade for standalone questions
    if (questionData.subject) {
      apiData.subject = questionData.subject
    }
    if (questionData.grade) {
      apiData.grade = questionData.grade
    }

    // Handle question image if provided
    if (questionData.questionImage) {
      apiData.question_image = questionData.questionImage
    }

    // Handle different question types
    switch (questionData.type) {
      case 'qcm_single':
      case 'qcm_multiple':
        apiData.choices = this._prepareChoicesForAPI(questionData.options || [])
        break

      case 'true_false':
        // Create True/False choices
        apiData.choices = [
          {
            choice_text: 'True',
            choice_text_arabic: 'صحيح',
            is_correct: questionData.correctAnswers?.[0] === 'True',
            order: 0
          },
          {
            choice_text: 'False',
            choice_text_arabic: 'خطأ',
            is_correct: questionData.correctAnswers?.[0] === 'False',
            order: 1
          }
        ]
        break

      case 'open_short':
      case 'open_long':
        // Store expected answers in explanation field for reference
        if (questionData.correctAnswers && questionData.correctAnswers.length > 0) {
          const expectedAnswers = questionData.correctAnswers.join('; ')
          apiData.explanation = `Expected answers: ${expectedAnswers}\n${apiData.explanation}`.trim()
        }
        break

      case 'fill_blank':
        // Store blanks and answers in JSON format in explanation
        if (questionData.blanks) {
          apiData.explanation = JSON.stringify({
            blanks: questionData.blanks,
            original_explanation: apiData.explanation
          })
        }
        break

      case 'matching':
        // Store matching pairs in explanation
        if (questionData.leftColumn && questionData.rightColumn) {
          apiData.explanation = JSON.stringify({
            leftColumn: questionData.leftColumn,
            rightColumn: questionData.rightColumn,
            original_explanation: apiData.explanation
          })
        }
        break

      case 'ordering':
        // Store correct order in explanation
        if (questionData.items) {
          apiData.explanation = JSON.stringify({
            items: questionData.items,
            original_explanation: apiData.explanation
          })
        }
        break
    }

    return apiData
  },

  /**
   * Prepare choices data for API
   * @param {Array} choices - Raw choices array
   * @returns {Array} API-formatted choices
   * @private
   */
  _prepareChoicesForAPI(choices) {
    return choices.map((choice, index) => ({
      choice_text: choice.text || choice.choice_text || '',
      choice_text_arabic: choice.textArabic || choice.choice_text_arabic || '',
      is_correct: choice.isCorrect || choice.is_correct || false,
      order: choice.order !== undefined ? choice.order : index
    }))
  },

  /**
   * Calculate question difficulty based on usage stats
   * @param {Object} question - Question object
   * @returns {string} Difficulty level
   * @private
   */
  _calculateDifficulty(question) {
    // This would be calculated based on student performance
    // For now, return a default or random value
    const difficulties = ['easy', 'medium', 'hard']
    return difficulties[Math.floor(Math.random() * difficulties.length)]
  },

  /**
   * Format question data from API for frontend use
   * @param {Object} apiQuestion - Question data from API
   * @returns {Object} Formatted question data
   */
  formatQuestionFromAPI(apiQuestion) {
    const question = {
      id: apiQuestion.id,
      type: apiQuestion.question_type,
      question: apiQuestion.question_text,
      questionArabic: apiQuestion.question_text_arabic,
      explanation: apiQuestion.explanation,
      explanationArabic: apiQuestion.explanation_arabic,
      points: apiQuestion.points,
      order: apiQuestion.order,
      isRequired: apiQuestion.is_required,
      homeworkId: apiQuestion.homework,
      createdAt: apiQuestion.created_at,
      updatedAt: apiQuestion.updated_at
    }

    // Handle question image
    if (apiQuestion.question_image) {
      question.questionImage = apiQuestion.question_image
    }

    // Handle different question types
    switch (apiQuestion.question_type) {
      case 'qcm_single':
      case 'qcm_multiple':
        question.options = apiQuestion.choices?.map(choice => ({
          text: choice.choice_text,
          textArabic: choice.choice_text_arabic,
          isCorrect: choice.is_correct,
          order: choice.order
        })) || []
        question.correctAnswers = apiQuestion.choices
          ?.filter(choice => choice.is_correct)
          ?.map(choice => choice.choice_text) || []
        break

      case 'true_false':
        question.correctAnswers = apiQuestion.choices
          ?.filter(choice => choice.is_correct)
          ?.map(choice => choice.choice_text) || []
        break

      case 'open_short':
      case 'open_long':
        // Extract answers from explanation if stored there
        if (question.explanation?.startsWith('Expected answers:')) {
          const lines = question.explanation.split('\n')
          const answersLine = lines[0].replace('Expected answers:', '').trim()
          question.correctAnswers = answersLine.split(';').map(a => a.trim())
          question.explanation = lines.slice(1).join('\n').trim()
        } else {
          question.correctAnswers = []
        }
        break

      case 'fill_blank':
        try {
          const data = JSON.parse(question.explanation || '{}')
          question.blanks = data.blanks || []
          question.explanation = data.original_explanation || ''
        } catch {
          question.blanks = []
        }
        break

      case 'matching':
        try {
          const data = JSON.parse(question.explanation || '{}')
          question.leftColumn = data.leftColumn || []
          question.rightColumn = data.rightColumn || []
          question.explanation = data.original_explanation || ''
        } catch {
          question.leftColumn = []
          question.rightColumn = []
        }
        break

      case 'ordering':
        try {
          const data = JSON.parse(question.explanation || '{}')
          question.items = data.items || []
          question.explanation = data.original_explanation || ''
        } catch {
          question.items = []
        }
        break
    }

    return question
  }
}

export default questionService