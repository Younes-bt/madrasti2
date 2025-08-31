/**
 * Homework API Service
 * Handles assignments, questions, submissions, and gamification system
 */

import { apiMethods } from './api.js';

/**
 * Homework Service Class
 */
class HomeworkService {
  // ==================== ASSIGNMENTS ====================

  /**
   * Get Assignments
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Assignments list
   */
  async getAssignments(params = {}) {
    try {
      const response = await apiMethods.get('homework/assignments/', { params });
      return response;
    } catch (error) {
      console.error('Get assignments failed:', error);
      throw error;
    }
  }

  /**
   * Get Assignment by ID
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Assignment data
   */
  async getAssignmentById(assignmentId) {
    try {
      const response = await apiMethods.get(`homework/assignments/${assignmentId}/`);
      return response;
    } catch (error) {
      console.error('Get assignment failed:', error);
      throw error;
    }
  }

  /**
   * Create Assignment
   * @param {Object} assignmentData - Assignment data
   * @returns {Promise<Object>} Created assignment
   */
  async createAssignment(assignmentData) {
    try {
      const response = await apiMethods.post('homework/assignments/', assignmentData);
      return response;
    } catch (error) {
      console.error('Create assignment failed:', error);
      throw error;
    }
  }

  /**
   * Update Assignment
   * @param {number} assignmentId - Assignment ID
   * @param {Object} assignmentData - Assignment data
   * @returns {Promise<Object>} Updated assignment
   */
  async updateAssignment(assignmentId, assignmentData) {
    try {
      const response = await apiMethods.put(`homework/assignments/${assignmentId}/`, assignmentData);
      return response;
    } catch (error) {
      console.error('Update assignment failed:', error);
      throw error;
    }
  }

  /**
   * Partially Update Assignment
   * @param {number} assignmentId - Assignment ID
   * @param {Object} assignmentData - Partial assignment data
   * @returns {Promise<Object>} Updated assignment
   */
  async patchAssignment(assignmentId, assignmentData) {
    try {
      const response = await apiMethods.patch(`homework/assignments/${assignmentId}/`, assignmentData);
      return response;
    } catch (error) {
      console.error('Patch assignment failed:', error);
      throw error;
    }
  }

  /**
   * Delete Assignment
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteAssignment(assignmentId) {
    try {
      const response = await apiMethods.delete(`homework/assignments/${assignmentId}/`);
      return response;
    } catch (error) {
      console.error('Delete assignment failed:', error);
      throw error;
    }
  }

  /**
   * Publish Assignment
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Publish response
   */
  async publishAssignment(assignmentId) {
    try {
      const response = await apiMethods.post(`homework/assignments/${assignmentId}/publish/`);
      return response;
    } catch (error) {
      console.error('Publish assignment failed:', error);
      throw error;
    }
  }

  /**
   * Unpublish Assignment
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Unpublish response
   */
  async unpublishAssignment(assignmentId) {
    try {
      const response = await apiMethods.post(`homework/assignments/${assignmentId}/unpublish/`);
      return response;
    } catch (error) {
      console.error('Unpublish assignment failed:', error);
      throw error;
    }
  }

  /**
   * Duplicate Assignment
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Duplicated assignment
   */
  async duplicateAssignment(assignmentId) {
    try {
      const response = await apiMethods.post(`homework/assignments/${assignmentId}/duplicate/`);
      return response;
    } catch (error) {
      console.error('Duplicate assignment failed:', error);
      throw error;
    }
  }

  /**
   * Get Assignment Analytics
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Assignment analytics
   */
  async getAssignmentAnalytics(assignmentId) {
    try {
      const response = await apiMethods.get(`homework/assignments/${assignmentId}/analytics/`);
      return response;
    } catch (error) {
      console.error('Get assignment analytics failed:', error);
      throw error;
    }
  }

  /**
   * Get Assignment Submissions
   * @param {number} assignmentId - Assignment ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Assignment submissions
   */
  async getAssignmentSubmissions(assignmentId, params = {}) {
    try {
      const response = await apiMethods.get(`homework/assignments/${assignmentId}/submissions/`, { params });
      return response;
    } catch (error) {
      console.error('Get assignment submissions failed:', error);
      throw error;
    }
  }

  /**
   * Bulk Grade Submissions
   * @param {number} assignmentId - Assignment ID
   * @param {Object} gradingData - Bulk grading data
   * @returns {Promise<Object>} Bulk grading response
   */
  async bulkGradeSubmissions(assignmentId, gradingData) {
    try {
      const response = await apiMethods.post(`homework/assignments/${assignmentId}/bulk_grade/`, gradingData);
      return response;
    } catch (error) {
      console.error('Bulk grade submissions failed:', error);
      throw error;
    }
  }

  // ==================== QUESTIONS ====================

  /**
   * Get Questions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Questions list
   */
  async getQuestions(params = {}) {
    try {
      const response = await apiMethods.get('homework/questions/', { params });
      return response;
    } catch (error) {
      console.error('Get questions failed:', error);
      throw error;
    }
  }

  /**
   * Get Question by ID
   * @param {number} questionId - Question ID
   * @returns {Promise<Object>} Question data
   */
  async getQuestionById(questionId) {
    try {
      const response = await apiMethods.get(`homework/questions/${questionId}/`);
      return response;
    } catch (error) {
      console.error('Get question failed:', error);
      throw error;
    }
  }

  /**
   * Create Question
   * @param {Object} questionData - Question data
   * @returns {Promise<Object>} Created question
   */
  async createQuestion(questionData) {
    try {
      const response = await apiMethods.post('homework/questions/', questionData);
      return response;
    } catch (error) {
      console.error('Create question failed:', error);
      throw error;
    }
  }

  /**
   * Update Question
   * @param {number} questionId - Question ID
   * @param {Object} questionData - Question data
   * @returns {Promise<Object>} Updated question
   */
  async updateQuestion(questionId, questionData) {
    try {
      const response = await apiMethods.put(`homework/questions/${questionId}/`, questionData);
      return response;
    } catch (error) {
      console.error('Update question failed:', error);
      throw error;
    }
  }

  /**
   * Delete Question
   * @param {number} questionId - Question ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteQuestion(questionId) {
    try {
      const response = await apiMethods.delete(`homework/questions/${questionId}/`);
      return response;
    } catch (error) {
      console.error('Delete question failed:', error);
      throw error;
    }
  }

  /**
   * Bulk Create Questions
   * @param {Object} questionsData - Bulk questions data
   * @returns {Promise<Object>} Bulk creation response
   */
  async bulkCreateQuestions(questionsData) {
    try {
      const response = await apiMethods.post('homework/questions/bulk_create/', questionsData);
      return response;
    } catch (error) {
      console.error('Bulk create questions failed:', error);
      throw error;
    }
  }

  // ==================== SUBMISSIONS ====================

  /**
   * Get Submissions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Submissions list
   */
  async getSubmissions(params = {}) {
    try {
      const response = await apiMethods.get('homework/submissions/', { params });
      return response;
    } catch (error) {
      console.error('Get submissions failed:', error);
      throw error;
    }
  }

  /**
   * Get Submission by ID
   * @param {number} submissionId - Submission ID
   * @returns {Promise<Object>} Submission data
   */
  async getSubmissionById(submissionId) {
    try {
      const response = await apiMethods.get(`homework/submissions/${submissionId}/`);
      return response;
    } catch (error) {
      console.error('Get submission failed:', error);
      throw error;
    }
  }

  /**
   * Create Submission
   * @param {Object} submissionData - Submission data
   * @returns {Promise<Object>} Created submission
   */
  async createSubmission(submissionData) {
    try {
      const response = await apiMethods.post('homework/submissions/', submissionData);
      return response;
    } catch (error) {
      console.error('Create submission failed:', error);
      throw error;
    }
  }

  /**
   * Update Submission
   * @param {number} submissionId - Submission ID
   * @param {Object} submissionData - Submission data
   * @returns {Promise<Object>} Updated submission
   */
  async updateSubmission(submissionId, submissionData) {
    try {
      const response = await apiMethods.put(`homework/submissions/${submissionId}/`, submissionData);
      return response;
    } catch (error) {
      console.error('Update submission failed:', error);
      throw error;
    }
  }

  /**
   * Submit Assignment
   * @param {number} submissionId - Submission ID
   * @returns {Promise<Object>} Submit response with auto-grading
   */
  async submitAssignment(submissionId) {
    try {
      const response = await apiMethods.post(`homework/submissions/${submissionId}/submit/`);
      return response;
    } catch (error) {
      console.error('Submit assignment failed:', error);
      throw error;
    }
  }

  /**
   * Grade Submission
   * @param {number} submissionId - Submission ID
   * @param {Object} gradingData - Grading data
   * @returns {Promise<Object>} Grading response
   */
  async gradeSubmission(submissionId, gradingData) {
    try {
      const response = await apiMethods.patch(`homework/submissions/${submissionId}/`, gradingData);
      return response;
    } catch (error) {
      console.error('Grade submission failed:', error);
      throw error;
    }
  }

  // ==================== GAMIFICATION SYSTEM ====================

  /**
   * Get Student Wallets
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Student wallets list
   */
  async getStudentWallets(params = {}) {
    try {
      const response = await apiMethods.get('homework/student-wallets/', { params });
      return response;
    } catch (error) {
      console.error('Get student wallets failed:', error);
      throw error;
    }
  }

  /**
   * Get Student Wallet by ID
   * @param {number} walletId - Wallet ID
   * @returns {Promise<Object>} Student wallet data
   */
  async getStudentWalletById(walletId) {
    try {
      const response = await apiMethods.get(`homework/student-wallets/${walletId}/`);
      return response;
    } catch (error) {
      console.error('Get student wallet failed:', error);
      throw error;
    }
  }

  /**
   * Update Student Wallet
   * @param {number} walletId - Wallet ID
   * @param {Object} walletData - Wallet data
   * @returns {Promise<Object>} Updated wallet
   */
  async updateStudentWallet(walletId, walletData) {
    try {
      const response = await apiMethods.patch(`homework/student-wallets/${walletId}/`, walletData);
      return response;
    } catch (error) {
      console.error('Update student wallet failed:', error);
      throw error;
    }
  }

  /**
   * Get Reward Transactions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Reward transactions list
   */
  async getRewardTransactions(params = {}) {
    try {
      const response = await apiMethods.get('homework/reward-transactions/', { params });
      return response;
    } catch (error) {
      console.error('Get reward transactions failed:', error);
      throw error;
    }
  }

  /**
   * Create Reward Transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  async createRewardTransaction(transactionData) {
    try {
      const response = await apiMethods.post('homework/reward-transactions/', transactionData);
      return response;
    } catch (error) {
      console.error('Create reward transaction failed:', error);
      throw error;
    }
  }

  /**
   * Get Badges
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Badges list
   */
  async getBadges(params = {}) {
    try {
      const response = await apiMethods.get('homework/badges/', { params });
      return response;
    } catch (error) {
      console.error('Get badges failed:', error);
      throw error;
    }
  }

  /**
   * Get Badge by ID
   * @param {number} badgeId - Badge ID
   * @returns {Promise<Object>} Badge data
   */
  async getBadgeById(badgeId) {
    try {
      const response = await apiMethods.get(`homework/badges/${badgeId}/`);
      return response;
    } catch (error) {
      console.error('Get badge failed:', error);
      throw error;
    }
  }

  /**
   * Create Badge
   * @param {Object} badgeData - Badge data
   * @returns {Promise<Object>} Created badge
   */
  async createBadge(badgeData) {
    try {
      const response = await apiMethods.post('homework/badges/', badgeData);
      return response;
    } catch (error) {
      console.error('Create badge failed:', error);
      throw error;
    }
  }

  /**
   * Get Leaderboards
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Leaderboards list
   */
  async getLeaderboards(params = {}) {
    try {
      const response = await apiMethods.get('homework/leaderboards/', { params });
      return response;
    } catch (error) {
      console.error('Get leaderboards failed:', error);
      throw error;
    }
  }

  /**
   * Get Leaderboard by ID
   * @param {number} leaderboardId - Leaderboard ID
   * @returns {Promise<Object>} Leaderboard data
   */
  async getLeaderboardById(leaderboardId) {
    try {
      const response = await apiMethods.get(`homework/leaderboards/${leaderboardId}/`);
      return response;
    } catch (error) {
      console.error('Get leaderboard failed:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get Student's Assignment Status
   * @param {number} studentId - Student ID
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Assignment status for student
   */
  async getStudentAssignmentStatus(studentId, assignmentId) {
    try {
      const response = await apiMethods.get('homework/submissions/', {
        params: { student: studentId, assignment: assignmentId }
      });
      return response.results?.[0] || null;
    } catch (error) {
      console.error('Get student assignment status failed:', error);
      throw error;
    }
  }

  /**
   * Get Teacher's Assignments
   * @param {number} teacherId - Teacher ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Teacher's assignments
   */
  async getTeacherAssignments(teacherId, params = {}) {
    try {
      const response = await apiMethods.get('homework/assignments/', {
        params: { ...params, created_by: teacherId }
      });
      return response;
    } catch (error) {
      console.error('Get teacher assignments failed:', error);
      throw error;
    }
  }

  /**
   * Get Student's Assignments
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Student's assignments
   */
  async getStudentAssignments(studentId, params = {}) {
    try {
      // Get assignments through student's classes
      const response = await apiMethods.get('homework/assignments/', {
        params: { ...params, student: studentId, is_published: true }
      });
      return response;
    } catch (error) {
      console.error('Get student assignments failed:', error);
      throw error;
    }
  }

  /**
   * Get Assignment Question Types Stats
   * @param {number} assignmentId - Assignment ID
   * @returns {Promise<Object>} Question types statistics
   */
  async getAssignmentQuestionStats(assignmentId) {
    try {
      const response = await apiMethods.get('homework/questions/', {
        params: { assignment: assignmentId }
      });
      
      const questions = response.results || [];
      const stats = questions.reduce((acc, question) => {
        acc[question.question_type] = (acc[question.question_type] || 0) + 1;
        return acc;
      }, {});

      return {
        total_questions: questions.length,
        question_types: stats,
        total_points: questions.reduce((sum, q) => sum + (q.points || 0), 0)
      };
    } catch (error) {
      console.error('Get assignment question stats failed:', error);
      throw error;
    }
  }

  /**
   * Get Student Performance Overview
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Student performance data
   */
  async getStudentPerformanceOverview(studentId, params = {}) {
    try {
      const [submissions, wallet, transactions] = await Promise.all([
        this.getSubmissions({ ...params, student: studentId }),
        this.getStudentWallets({ student: studentId }),
        this.getRewardTransactions({ ...params, student: studentId })
      ]);

      return {
        submissions: submissions,
        wallet: wallet.results?.[0] || null,
        recent_transactions: transactions.results?.slice(0, 10) || []
      };
    } catch (error) {
      console.error('Get student performance overview failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const homeworkService = new HomeworkService();

export default homeworkService;