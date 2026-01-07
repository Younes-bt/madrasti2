/**
 * Attendance API Service
 * Handles timetables, sessions, attendance records, absence flags, and notifications
 */

import { apiMethods } from './api.js';

/**
 * Attendance Service Class
 */
class AttendanceService {
  // ==================== TIMETABLES ====================

  /**
   * Get Timetables
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Timetables list
   */
  async getTimetables(params = {}) {
    try {
      const response = await apiMethods.get('attendance/timetables/', { params });
      return response;
    } catch (error) {
      console.error('Get timetables failed:', error);
      throw error;
    }
  }

  /**
   * Get Timetable by ID
   * @param {number} timetableId - Timetable ID
   * @returns {Promise<Object>} Timetable data
   */
  async getTimetableById(timetableId) {
    try {
      const response = await apiMethods.get(`attendance/timetables/${timetableId}/`);
      return response;
    } catch (error) {
      console.error('Get timetable failed:', error);
      throw error;
    }
  }

  /**
   * Create Timetable
   * @param {Object} timetableData - Timetable data
   * @returns {Promise<Object>} Created timetable
   */
  async createTimetable(timetableData) {
    try {
      const response = await apiMethods.post('attendance/timetables/', timetableData);
      return response;
    } catch (error) {
      console.error('Create timetable failed:', error);
      throw error;
    }
  }

  /**
   * Update Timetable
   * @param {number} timetableId - Timetable ID
   * @param {Object} timetableData - Timetable data
   * @returns {Promise<Object>} Updated timetable
   */
  async updateTimetable(timetableId, timetableData) {
    try {
      const response = await apiMethods.put(`attendance/timetables/${timetableId}/`, timetableData);
      return response;
    } catch (error) {
      console.error('Update timetable failed:', error);
      throw error;
    }
  }

  /**
   * Delete Timetable
   * @param {number} timetableId - Timetable ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteTimetable(timetableId) {
    try {
      const response = await apiMethods.delete(`attendance/timetables/${timetableId}/`);
      return response;
    } catch (error) {
      console.error('Delete timetable failed:', error);
      throw error;
    }
  }

  // ==================== TIMETABLE SESSIONS ====================

  /**
   * Get Timetable Sessions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Timetable sessions list
   */
  async getTimetableSessions(params = {}) {
    try {
      const response = await apiMethods.get('attendance/timetable-sessions/', { params });
      return response;
    } catch (error) {
      console.error('Get timetable sessions failed:', error);
      throw error;
    }
  }

  /**
   * Get Timetable Session by ID
   * @param {number} sessionId - Timetable session ID
   * @returns {Promise<Object>} Timetable session data
   */
  async getTimetableSessionById(sessionId) {
    try {
      const response = await apiMethods.get(`attendance/timetable-sessions/${sessionId}/`);
      return response;
    } catch (error) {
      console.error('Get timetable session failed:', error);
      throw error;
    }
  }

  /**
   * Create Timetable Session
   * @param {Object} sessionData - Timetable session data
   * @returns {Promise<Object>} Created timetable session
   */
  async createTimetableSession(sessionData) {
    try {
      const response = await apiMethods.post('attendance/timetable-sessions/', sessionData);
      return response;
    } catch (error) {
      console.error('Create timetable session failed:', error);
      throw error;
    }
  }

  /**
   * Update Timetable Session
   * @param {number} sessionId - Timetable session ID
   * @param {Object} sessionData - Timetable session data
   * @returns {Promise<Object>} Updated timetable session
   */
  async updateTimetableSession(sessionId, sessionData) {
    try {
      const response = await apiMethods.put(`attendance/timetable-sessions/${sessionId}/`, sessionData);
      return response;
    } catch (error) {
      console.error('Update timetable session failed:', error);
      throw error;
    }
  }

  /**
   * Delete Timetable Session
   * @param {number} sessionId - Timetable session ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteTimetableSession(sessionId) {
    try {
      const response = await apiMethods.delete(`attendance/timetable-sessions/${sessionId}/`);
      return response;
    } catch (error) {
      console.error('Delete timetable session failed:', error);
      throw error;
    }
  }

  /**
   * Get Today's Sessions for Teacher
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Today's sessions
   */
  async getTodaySessions(params = {}) {
    try {
      const response = await apiMethods.get('attendance/timetable-sessions/today_sessions/', { params });
      return response;
    } catch (error) {
      console.error('Get today sessions failed:', error);
      throw error;
    }
  }

  /**
   * Get Weekly Schedule
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Weekly schedule
   */
  async getWeeklySchedule(params = {}) {
    try {
      const response = await apiMethods.get('attendance/timetable-sessions/weekly_schedule/', { params });
      return response;
    } catch (error) {
      console.error('Get weekly schedule failed:', error);
      throw error;
    }
  }

  /**
   * Get current student's weekly schedule
   * @returns {Promise<Object>} Sessions grouped for the student's class
   */
  async getMySchedule() {
    try {
      const response = await apiMethods.get('attendance/timetable-sessions/my_schedule/');
      return response;
    } catch (error) {
      console.error('Get my schedule failed:', error);
      throw error;
    }
  }

  /**
   * Get Teacher Classes
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Teacher's assigned classes
   */
  async getTeacherClasses(params = {}) {
    try {
      const response = await apiMethods.get('attendance/timetable-sessions/teacher_classes/', { params });
      return response;
    } catch (error) {
      console.error('Get teacher classes failed:', error);
      throw error;
    }
  }

  // ==================== ATTENDANCE SESSIONS ====================

  /**
   * Get Attendance Sessions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Attendance sessions list
   */
  async getAttendanceSessions(params = {}) {
    try {
      const response = await apiMethods.get('attendance/sessions/', { params });
      return response;
    } catch (error) {
      console.error('Get attendance sessions failed:', error);
      throw error;
    }
  }

  /**
   * Get Attendance Session by ID
   * @param {number} sessionId - Attendance session ID
   * @returns {Promise<Object>} Attendance session data
   */
  async getAttendanceSessionById(sessionId) {
    try {
      const response = await apiMethods.get(`attendance/sessions/${sessionId}/`);
      return response;
    } catch (error) {
      console.error('Get attendance session failed:', error);
      throw error;
    }
  }

  /**
   * Create Attendance Session
   * @param {Object} sessionData - Attendance session data
   * @returns {Promise<Object>} Created attendance session
   */
  async createAttendanceSession(sessionData) {
    try {
      const response = await apiMethods.post('attendance/sessions/', sessionData);
      return response;
    } catch (error) {
      console.error('Create attendance session failed:', error);
      throw error;
    }
  }

  /**
   * Update Attendance Session
   * @param {number} sessionId - Attendance session ID
   * @param {Object} sessionData - Attendance session data
   * @returns {Promise<Object>} Updated attendance session
   */
  async updateAttendanceSession(sessionId, sessionData) {
    try {
      const response = await apiMethods.put(`attendance/sessions/${sessionId}/`, sessionData);
      return response;
    } catch (error) {
      console.error('Update attendance session failed:', error);
      throw error;
    }
  }

  /**
   * Delete Attendance Session
   * @param {number} sessionId - Attendance session ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteAttendanceSession(sessionId) {
    try {
      const response = await apiMethods.delete(`attendance/sessions/${sessionId}/`);
      return response;
    } catch (error) {
      console.error('Delete attendance session failed:', error);
      throw error;
    }
  }

  /**
   * Start Attendance Session
   * @param {number} sessionId - Attendance session ID
   * @returns {Promise<Object>} Start session response
   */
  async startAttendanceSession(sessionId) {
    try {
      const response = await apiMethods.post(`attendance/sessions/${sessionId}/start/`);
      return response;
    } catch (error) {
      console.error('Start attendance session failed:', error);
      throw error;
    }
  }

  /**
   * Complete Attendance Session
   * @param {number} sessionId - Attendance session ID
   * @returns {Promise<Object>} Complete session response
   */
  async completeAttendanceSession(sessionId) {
    try {
      const response = await apiMethods.post(`attendance/sessions/${sessionId}/complete/`);
      return response;
    } catch (error) {
      console.error('Complete attendance session failed:', error);
      throw error;
    }
  }

  /**
   * Get Session Students
   * @param {number} sessionId - Attendance session ID
   * @returns {Promise<Object>} Session students with status
   */
  async getSessionStudents(sessionId) {
    try {
      const response = await apiMethods.get(`attendance/sessions/${sessionId}/students/`);
      return response;
    } catch (error) {
      console.error('Get session students failed:', error);
      throw error;
    }
  }

  /**
   * Bulk Mark Attendance
   * @param {number} sessionId - Attendance session ID
   * @param {Object} attendanceData - Bulk attendance data
   * @returns {Promise<Object>} Bulk marking response
   */
  async bulkMarkAttendance(sessionId, attendanceData) {
    try {
      const response = await apiMethods.post(`attendance/sessions/${sessionId}/bulk_mark/`, attendanceData);
      return response;
    } catch (error) {
      console.error('Bulk mark attendance failed:', error);
      throw error;
    }
  }

  /**
   * Reset Attendance Session
   * @param {number} sessionId - Attendance session ID
   * @returns {Promise<Object>} Reset session response
   */
  async resetAttendanceSession(sessionId) {
    try {
      const response = await apiMethods.post(`attendance/sessions/${sessionId}/reset/`);
      return response;
    } catch (error) {
      console.error('Reset attendance session failed:', error);
      throw error;
    }
  }

  // ==================== ATTENDANCE RECORDS ====================

  /**
   * Get Attendance Records
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Attendance records list
   */
  async getAttendanceRecords(params = {}) {
    try {
      const response = await apiMethods.get('attendance/records/', { params });
      return response;
    } catch (error) {
      console.error('Get attendance records failed:', error);
      throw error;
    }
  }

  /**
   * Get Attendance Summary/Statistics
   * @param {Object} params - Query parameters (date range, class, subject, etc.)
   * @returns {Promise<Object>} Aggregated attendance stats
   */
  async getAttendanceSummary(params = {}) {
    try {
      const response = await apiMethods.get('attendance/records/summary/', { params });
      return response;
    } catch (error) {
      console.error('Get attendance summary failed:', error);
      throw error;
    }
  }

  /**
   * Get Attendance Record by ID
   * @param {number} recordId - Attendance record ID
   * @returns {Promise<Object>} Attendance record data
   */
  async getAttendanceRecordById(recordId) {
    try {
      const response = await apiMethods.get(`attendance/records/${recordId}/`);
      return response;
    } catch (error) {
      console.error('Get attendance record failed:', error);
      throw error;
    }
  }

  /**
   * Create Attendance Record
   * @param {Object} recordData - Attendance record data
   * @returns {Promise<Object>} Created attendance record
   */
  async createAttendanceRecord(recordData) {
    try {
      const response = await apiMethods.post('attendance/records/', recordData);
      return response;
    } catch (error) {
      console.error('Create attendance record failed:', error);
      throw error;
    }
  }

  /**
   * Update Attendance Record
   * @param {number} recordId - Attendance record ID
   * @param {Object} recordData - Attendance record data
   * @returns {Promise<Object>} Updated attendance record
   */
  async updateAttendanceRecord(recordId, recordData) {
    try {
      const response = await apiMethods.put(`attendance/records/${recordId}/`, recordData);
      return response;
    } catch (error) {
      console.error('Update attendance record failed:', error);
      throw error;
    }
  }

  // ==================== STUDENT ENROLLMENTS ====================

  /**
   * Get Student Enrollments
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Student enrollments list
   */
  async getStudentEnrollments(params = {}) {
    try {
      const response = await apiMethods.get('attendance/enrollments/', { params });
      return response;
    } catch (error) {
      console.error('Get student enrollments failed:', error);
      throw error;
    }
  }

  /**
   * Get Student Enrollment by ID
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Object>} Student enrollment data
   */
  async getStudentEnrollmentById(enrollmentId) {
    try {
      const response = await apiMethods.get(`attendance/enrollments/${enrollmentId}/`);
      return response;
    } catch (error) {
      console.error('Get student enrollment failed:', error);
      throw error;
    }
  }

  /**
   * Create Student Enrollment
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise<Object>} Created enrollment
   */
  async createStudentEnrollment(enrollmentData) {
    try {
      const response = await apiMethods.post('attendance/enrollments/', enrollmentData);
      return response;
    } catch (error) {
      console.error('Create student enrollment failed:', error);
      throw error;
    }
  }

  /**
   * Delete Student Enrollment
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteStudentEnrollment(enrollmentId) {
    try {
      const response = await apiMethods.delete(`attendance/enrollments/${enrollmentId}/`);
      return response;
    } catch (error) {
      console.error('Delete student enrollment failed:', error);
      throw error;
    }
  }

  // ==================== ABSENCE FLAGS ====================

  /**
   * Get Absence Flags
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Absence flags list
   */
  async getAbsenceFlags(params = {}) {
    try {
      const response = await apiMethods.get('attendance/absence-flags/', { params });
      return response;
    } catch (error) {
      console.error('Get absence flags failed:', error);
      throw error;
    }
  }

  /**
   * Get Absence Flag by ID
   * @param {number} flagId - Absence flag ID
   * @returns {Promise<Object>} Absence flag data
   */
  async getAbsenceFlagById(flagId) {
    try {
      const response = await apiMethods.get(`attendance/absence-flags/${flagId}/`);
      return response;
    } catch (error) {
      console.error('Get absence flag failed:', error);
      throw error;
    }
  }

  /**
   * Create Absence Flag
   * @param {Object} flagData - Absence flag data
   * @returns {Promise<Object>} Created absence flag
   */
  async createAbsenceFlag(flagData) {
    try {
      const response = await apiMethods.post('attendance/absence-flags/', flagData);
      return response;
    } catch (error) {
      console.error('Create absence flag failed:', error);
      throw error;
    }
  }

  /**
   * Update Absence Flag
   * @param {number} flagId - Absence flag ID
   * @param {Object} flagData - Absence flag data
   * @returns {Promise<Object>} Updated absence flag
   */
  async updateAbsenceFlag(flagId, flagData) {
    try {
      const response = await apiMethods.put(`attendance/absence-flags/${flagId}/`, flagData);
      return response;
    } catch (error) {
      console.error('Update absence flag failed:', error);
      throw error;
    }
  }

  /**
   * Delete Absence Flag
   * @param {number} flagId - Absence flag ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteAbsenceFlag(flagId) {
    try {
      const response = await apiMethods.delete(`attendance/absence-flags/${flagId}/`);
      return response;
    } catch (error) {
      console.error('Delete absence flag failed:', error);
      throw error;
    }
  }

  /**
   * Get Pending Absence Flags
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Pending absence flags
   */
  async getPendingAbsenceFlags(params = {}) {
    try {
      const response = await apiMethods.get('attendance/absence-flags/pending/', { params });
      return response;
    } catch (error) {
      console.error('Get pending absence flags failed:', error);
      throw error;
    }
  }

  /**
   * Clear Absence Flag
   * @param {number} flagId - Absence flag ID
   * @param {Object} clearanceData - Clearance data (clearance_reason, clearance_notes, clearance_document)
   * @returns {Promise<Object>} Clearance response
   */
  async clearAbsenceFlag(flagId, clearanceData) {
    try {
      const response = await apiMethods.post(`attendance/absence-flags/${flagId}/clear/`, clearanceData);
      return response;
    } catch (error) {
      console.error('Clear absence flag failed:', error);
      throw error;
    }
  }

  /**
   * Resolve Absence Flag
   * @param {number} flagId - Absence flag ID
   * @param {Object} resolutionData - Resolution data
   * @returns {Promise<Object>} Resolution response
   */
  async resolveAbsenceFlag(flagId, resolutionData) {
    try {
      const response = await apiMethods.post(`attendance/absence-flags/${flagId}/resolve/`, resolutionData);
      return response;
    } catch (error) {
      console.error('Resolve absence flag failed:', error);
      throw error;
    }
  }

  /**
   * Dismiss Absence Flag
   * @param {number} flagId - Absence flag ID
   * @param {Object} dismissalData - Dismissal data
   * @returns {Promise<Object>} Dismissal response
   */
  async dismissAbsenceFlag(flagId, dismissalData = {}) {
    try {
      const response = await apiMethods.post(`attendance/absence-flags/${flagId}/dismiss/`, dismissalData);
      return response;
    } catch (error) {
      console.error('Dismiss absence flag failed:', error);
      throw error;
    }
  }

  /**
   * Get Absence Flags Analytics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Absence flags analytics
   */
  async getAbsenceFlagsAnalytics(params = {}) {
    try {
      const response = await apiMethods.get('attendance/absence-flags/analytics/', { params });
      return response;
    } catch (error) {
      console.error('Get absence flags analytics failed:', error);
      throw error;
    }
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Get Attendance Notifications
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Attendance notifications list
   */
  async getAttendanceNotifications(params = {}) {
    try {
      const response = await apiMethods.get('attendance/notifications/', { params });
      return response;
    } catch (error) {
      console.error('Get attendance notifications failed:', error);
      throw error;
    }
  }

  /**
   * Create Attendance Notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createAttendanceNotification(notificationData) {
    try {
      const response = await apiMethods.post('attendance/notifications/', notificationData);
      return response;
    } catch (error) {
      console.error('Create attendance notification failed:', error);
      throw error;
    }
  }

  /**
   * Mark Notification as Read
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>} Mark read response
   */
  async markNotificationAsRead(notificationId) {
    try {
      const response = await apiMethods.post(`attendance/notifications/${notificationId}/mark_read/`);
      return response;
    } catch (error) {
      console.error('Mark notification as read failed:', error);
      throw error;
    }
  }

  /**
   * Get Unread Notifications
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Unread notifications
   */
  async getUnreadNotifications(params = {}) {
    try {
      const response = await apiMethods.get('attendance/notifications/unread/', { params });
      return response;
    } catch (error) {
      console.error('Get unread notifications failed:', error);
      throw error;
    }
  }

  /**
   * Bulk Mark Notifications as Read
   * @param {Array} notificationIds - Array of notification IDs
   * @returns {Promise<Object>} Bulk mark read response
   */
  async bulkMarkNotificationsAsRead(notificationIds) {
    try {
      const response = await apiMethods.post('attendance/notifications/bulk_read/', {
        notification_ids: notificationIds
      });
      return response;
    } catch (error) {
      console.error('Bulk mark notifications as read failed:', error);
      throw error;
    }
  }

  // ==================== REPORTING ====================

  /**
   * Get Attendance Reports
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Attendance reports list
   */
  async getAttendanceReports(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/', { params });
      return response;
    } catch (error) {
      console.error('Get attendance reports failed:', error);
      throw error;
    }
  }

  /**
   * Get Class Statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Class attendance statistics
   */
  async getClassStatistics(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/class_statistics/', { params });
      return response;
    } catch (error) {
      console.error('Get class statistics failed:', error);
      throw error;
    }
  }

  /**
   * Get Student Attendance Statistics
   * @param {number} studentId - Student ID
   * @param {Object} params - Query parameters (start_date, end_date, subject_id)
   * @returns {Promise<Object>} Student attendance statistics
   */
  async getStudentStatistics(studentId, params = {}) {
    try {
      const response = await apiMethods.get(`attendance/records/student-statistics/${studentId}/`, { params });
      return response;
    } catch (error) {
      console.error('Get student statistics failed:', error);
      throw error;
    }
  }

  /**
   * Get Student History
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Student attendance history
   */
  async getStudentHistory(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/student_history/', { params });
      return response;
    } catch (error) {
      console.error('Get student history failed:', error);
      throw error;
    }
  }

  /**
   * Get Daily Report
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Daily attendance report
   */
  async getDailyReport(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/daily_report/', { params });
      return response;
    } catch (error) {
      console.error('Get daily report failed:', error);
      throw error;
    }
  }

  /**
   * Get Students Statistics (Aggregated)
   * @param {Object} params - Query parameters (grade_id, class_id, track_id, start_date, end_date, search)
   * @returns {Promise<Object>} Aggregated student stats
   */
  async getStudentsStatistics(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/students_statistics/', { params });
      return response;
    } catch (error) {
      console.error('Get students statistics failed:', error);
      throw error;
    }
  }

  /**
   * Get Classes Statistics (Aggregated)
   * @param {Object} params - Query parameters (grade_id, track_id, start_date, end_date)
   * @returns {Promise<Object>} Aggregated class stats
   */
  async getClassesStatistics(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/classes_statistics/', { params });
      return response;
    } catch (error) {
      console.error('Get classes statistics failed:', error);
      throw error;
    }
  }

  /**
   * Get Weekly Summary
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Weekly attendance summary
   */
  async getWeeklySummary(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/weekly_summary/', { params });
      return response;
    } catch (error) {
      console.error('Get weekly summary failed:', error);
      throw error;
    }
  }

  /**
   * Get Monthly Analysis
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Monthly attendance analysis
   */
  async getMonthlyAnalysis(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/monthly_analysis/', { params });
      return response;
    } catch (error) {
      console.error('Get monthly analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get Flag Statistics
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Absence flag statistics
   */
  async getFlagStatistics(params = {}) {
    try {
      const response = await apiMethods.get('attendance/reports/flag_statistics/', { params });
      return response;
    } catch (error) {
      console.error('Get flag statistics failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const attendanceService = new AttendanceService();

export default attendanceService;
