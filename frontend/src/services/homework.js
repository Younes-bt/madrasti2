import { apiMethods } from './api.js';

// ===============================
// HOMEWORK SERVICE
// ===============================

class HomeworkService {
  // ===============================
  // HOMEWORK MANAGEMENT
  // ===============================

  async getHomeworks(params = {}) {
    try {
      const response = await apiMethods.get('homework/homework/', { params });
      return {
        success: true,
        data: response.results || response,
        total: response.count || response.length,
        next: response.next,
        previous: response.previous
      };
    } catch (error) {
      console.error('Error fetching homework:', error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to fetch homework') };
    }
  }

  async getHomeworkById(homeworkId) {
    try {
      const response = await apiMethods.get(`homework/homework/${homeworkId}/`);
      return response;
    } catch (error) {
      console.error(`Error fetching homework ${homeworkId}:`, error);
      throw error;
    }
  }

  async createHomework(homeworkData) {
    try {
      const response = await apiMethods.post('homework/homework/', homeworkData);
      return response;
    } catch (error) {
      console.error('Error creating homework:', error);
      throw error;
    }
  }

  async updateHomework(homeworkId, homeworkData) {
    try {
      const response = await apiMethods.put(`homework/homework/${homeworkId}/`, homeworkData);
      return response;
    } catch (error) {
      console.error(`Error updating homework ${homeworkId}:`, error);
      throw error;
    }
  }

  async deleteHomework(homeworkId) {
    try {
      await apiMethods.delete(`homework/homework/${homeworkId}/`);
      return { success: true, message: 'Homework deleted successfully' };
    } catch (error) {
      console.error(`Error deleting homework ${homeworkId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to delete homework') };
    }
  }

  async duplicateHomework(homeworkId, duplicateData) {
    try {
      const response = await apiMethods.post(`homework/homework/${homeworkId}/duplicate/`, duplicateData);
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error duplicating homework ${homeworkId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to duplicate homework') };
    }
  }

  async publishHomework(homeworkId) {
    try {
      const response = await apiMethods.patch(`homework/homework/${homeworkId}/`, { is_published: true });
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error publishing homework ${homeworkId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to publish homework') };
    }
  }

  async getStudentSubmissions(params = {}) {
    try {
      const response = await apiMethods.get('homework/submissions/', { params });
      return {
        success: true,
        data: response.results || response,
        total: response.count || response.length,
        next: response.next,
        previous: response.previous
      };
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to fetch submissions') };
    }
  }

  async startHomework(homeworkId) {
    try {
      const response = await apiMethods.post(`homework/submissions/${homeworkId}/start/`, {});
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error starting homework ${homeworkId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to start homework') };
    }
  }

  async submitHomework(submissionId, payload = {}) {
    try {
      const response = await apiMethods.post(`homework/submissions/${submissionId}/submit/`, payload);
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error submitting homework ${submissionId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to submit homework') };
    }
  }

  // ===============================
  // QUESTIONS & BOOK EXERCISES
  // ===============================

  async createQuestion(questionData) {
    try {
      const response = await apiMethods.post('homework/questions/', questionData);
      return response;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async createBookExercise(exerciseData) {
    try {
      const response = await apiMethods.post('homework/book-exercises/', exerciseData);
      return response;
    } catch (error) {
      console.error('Error creating book exercise:', error);
      throw error;
    }
  }

  // ===============================
  // GRADING & SUBMISSIONS
  // ===============================

  async getSubmissionById(submissionId) {
    try {
      const response = await apiMethods.get(`homework/submissions/${submissionId}/`);
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error fetching submission ${submissionId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to fetch submission') };
    }
  }

  async gradeSubmission(submissionId, gradeData) {
    try {
      const response = await apiMethods.post(`homework/submissions/${submissionId}/grade/`, gradeData);
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error grading submission ${submissionId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to grade submission') };
    }
  }

  async updateQuestionAnswer(submissionId, answerId, feedback) {
    try {
      const response = await apiMethods.patch(`homework/question-answers/${answerId}/`, {
        teacher_feedback: feedback
      });
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error updating question answer ${answerId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to update answer feedback') };
    }
  }

  // ===============================
  // STATISTICS & HELPERS
  // ===============================

  async getHomeworkStatistics(homeworkId) {
    try {
      const response = await apiMethods.get(`homework/homework/${homeworkId}/statistics/`);
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error fetching stats for homework ${homeworkId}:`, error);
      return { success: false, error: this._extractErrorMessage(error, 'Failed to fetch statistics') };
    }
  }

  _toNumber(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  formatStudentSubmission(submission) {
    if (!submission) {
      return null;
    }

    return {
      id: submission.id,
      status: submission.status,
      started_at: submission.started_at,
      submitted_at: submission.submitted_at,
      time_taken: submission.time_taken,
      attempt_number: submission.attempt_number,
      is_late: Boolean(submission.is_late),
      total_score: this._toNumber(submission.total_score),
      auto_score: this._toNumber(submission.auto_score),
      manual_score: this._toNumber(submission.manual_score),
      points_earned: this._toNumber(submission.points_earned),
      coins_earned: this._toNumber(submission.coins_earned),
      bonus_points: this._toNumber(submission.bonus_points),
      teacher_feedback: submission.teacher_feedback,
      graded_at: submission.graded_at,
      graded_by: submission.graded_by || null,
    };
  }

  _normalizeStudentStatus(status, { isOverdue = false } = {}) {
    if (!status) {
      return isOverdue ? 'overdue' : 'pending';
    }

    const value = status.toLowerCase();
    if (['submitted', 'auto_graded', 'manually_graded'].includes(value)) {
      return 'completed';
    }
    if (value === 'late') {
      return 'late';
    }
    if (value === 'draft') {
      return 'draft';
    }
    if (value === 'overdue') {
      return 'overdue';
    }
    if (value === 'in_progress') {
      return 'in_progress';
    }
    return 'pending';
  }

  formatHomeworkFromAPI(apiHomework) {
    if (!apiHomework) {
      return null;
    }

    const studentSubmission = this.formatStudentSubmission(apiHomework.student_submission);
    const studentStatus = apiHomework.student_status || studentSubmission?.status || null;
    const normalizedStatus = this._normalizeStudentStatus(studentStatus, { isOverdue: Boolean(apiHomework.is_overdue) });
    const dueDate = apiHomework.due_date ? new Date(apiHomework.due_date) : null;

    return {
      id: apiHomework.id,
      title: apiHomework.title,
      description: apiHomework.description,
      instructions: apiHomework.instructions,
      type: apiHomework.homework_type,
      format: apiHomework.homework_format,
      subject: { id: apiHomework.subject, name: apiHomework.subject_name },
      grade: { id: apiHomework.grade, name: apiHomework.grade_name },
      class: { id: apiHomework.school_class, name: apiHomework.class_name },
      teacher: apiHomework.teacher,
      due_date: apiHomework.due_date,
      dueDate: dueDate,
      dueDateISO: dueDate ? dueDate.toISOString() : null,
      total_points: this._toNumber(apiHomework.total_points),
      estimated_duration: this._toNumber(apiHomework.estimated_duration),
      is_published: apiHomework.is_published,
      submissions_count: this._toNumber(apiHomework.submissions_count) ?? 0,
      is_overdue: Boolean(apiHomework.is_overdue),
      questions: apiHomework.questions || [],
      book_exercises: apiHomework.book_exercises || [],
      time_limit: this._toNumber(apiHomework.time_limit),
      allow_late_submissions: Boolean(apiHomework.allow_late_submissions),
      late_penalty_percentage: this._toNumber(apiHomework.late_penalty_percentage),
      created_at: apiHomework.created_at,
      student_submission: studentSubmission,
      student_status: studentStatus,
      studentStatusNormalized: normalizedStatus,
      time_until_due: typeof apiHomework.time_until_due === 'number' ? apiHomework.time_until_due : null,
      is_pending: apiHomework.is_pending ?? ['pending', 'in_progress', 'draft', 'overdue'].includes(normalizedStatus),
    };
  }

  calculateHomeworkStatus(homework) {
    if (!homework.is_published) return 'draft';
    const now = new Date();
    const dueDate = new Date(homework.due_date);
    if (now > dueDate) return 'completed'; // Or 'expired'
    return 'active';
  }

  _extractErrorMessage(error, defaultMessage = 'An error occurred') {
    if (error.response?.data) {
      const apiError = error.response.data;
      if (typeof apiError === 'string') return apiError;
      if (apiError.detail) return apiError.detail;
      if (apiError.non_field_errors) return apiError.non_field_errors[0];
      const firstError = Object.values(apiError)[0];
      if (firstError) return Array.isArray(firstError) ? firstError[0] : firstError;
    }
    return defaultMessage;
  }

  // ===============================
  // EXAM-SPECIFIC METHODS
  // ===============================

  async getExams(params = {}) {
    const examParams = {
      ...params,
      homework_type__in: 'quiz,exam'
    };
    return this.getHomeworks(examParams);
  }

  formatExamFromAPI(homework) {
    const baseHomework = this.formatHomeworkFromAPI(homework);

    let examType = homework.homework_type;
    if (homework.homework_type === 'quiz' && homework.time_limit <= 20) {
      examType = 'quiz';
    } else if (homework.homework_type === 'quiz' && homework.time_limit > 20) {
      examType = 'test';
    } else if (homework.homework_type === 'exam' && homework.title.toLowerCase().includes('final')) {
      examType = 'final';
    } else if (homework.homework_type === 'exam') {
      examType = 'exam';
    }

    return {
      ...baseHomework,
      type: examType,
      scheduledDate: homework.due_date,
      timeLimit: homework.time_limit || 0,
      totalQuestions: homework.questions?.length || 0,
      totalPoints: homework.total_points,
      attempts: homework.max_attempts || 1,
      status: this.calculateHomeworkStatus(homework),
    };
  }
}

const homeworkService = new HomeworkService();
export default homeworkService;
