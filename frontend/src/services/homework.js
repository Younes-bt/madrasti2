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

  formatHomeworkFromAPI(apiHomework) {
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
      total_points: apiHomework.total_points,
      is_published: apiHomework.is_published,
      submissions_count: apiHomework.submissions_count,
      is_overdue: apiHomework.is_overdue,
      questions: apiHomework.questions || [],
      book_exercises: apiHomework.book_exercises || [],
      time_limit: apiHomework.time_limit,
      allow_late_submissions: apiHomework.allow_late_submissions,
      late_penalty_percentage: apiHomework.late_penalty_percentage,
      created_at: apiHomework.created_at,
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
