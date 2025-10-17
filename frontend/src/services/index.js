/**
 * Services Index
 * Central export point for all API services
 */

// Core API configuration
export { default as api, apiMethods, checkAPIHealth, uploadFile } from './api.js';

// Import all services first
import authServiceImport from './auth.js';
import usersServiceImport from './users.js';
import schoolsServiceImport from './schools.js';
import homeworkServiceImport from './homework.js';
import attendanceServiceImport from './attendance.js';
import lessonsServiceImport from './lessons.js';
import rewardsServiceImport from './rewards.js';
import errorHandlerImport from './errorHandler.js';

// Re-export services
export { default as authService } from './auth.js';
export {
  login,
  register,
  refreshToken,
  verifyToken,
  changePassword,
  requestPasswordReset,
  logout,
  isAuthenticated,
  isTokenValid,
  getUserData,
  getUserRole,
  getUserPermissions,
  hasPermission,
  hasRole,
  getAuthHeaders
} from './auth.js';

export { default as usersService } from './users.js';
export { default as schoolsService } from './schools.js';
export { default as homeworkService } from './homework.js';
export { default as attendanceService } from './attendance.js';
export { default as lessonsService } from './lessons.js';
export { default as rewardsService } from './rewards.js';

// Error handling
export { default as errorHandler } from './errorHandler.js';
export {
  ERROR_TYPES,
  ERROR_SEVERITY,
  handleError,
  getErrorLog,
  clearErrorLog,
  getErrorStats,
  handleValidationErrors,
  getUserFriendlyMessage
} from './errorHandler.js';

// Service collections for easy import
export const services = {
  auth: authServiceImport,
  users: usersServiceImport,
  schools: schoolsServiceImport,
  homework: homeworkServiceImport,
  attendance: attendanceServiceImport,
  lessons: lessonsServiceImport,
  rewards: rewardsServiceImport
};

// API endpoints summary for reference
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: 'users/login/',
  REGISTER: 'users/register/',
  TOKEN_REFRESH: 'token/refresh/',
  TOKEN_VERIFY: 'token/verify/',
  CHANGE_PASSWORD: 'users/change-password/',
  PASSWORD_RESET: 'users/password-reset/',

  // Users
  USERS: 'users/',
  USER_PROFILE: 'users/profile/',
  USER_STATS: 'users/stats/',

  // Schools
  SCHOOL_CONFIG: 'schools/config/',
  ACADEMIC_YEARS: 'schools/academic-years/',
  EDUCATIONAL_LEVELS: 'schools/levels/',
  GRADES: 'schools/grades/',
  CLASSES: 'schools/classes/',
  SUBJECTS: 'schools/subjects/',
  ROOMS: 'schools/rooms/',
  VEHICLES: 'schools/vehicles/',
  VEHICLE_MAINTENANCE: 'schools/vehicles/{vehicleId}/maintenance-records/',

  // Homework
  ASSIGNMENTS: 'homework/assignments/',
  QUESTIONS: 'homework/questions/',
  SUBMISSIONS: 'homework/submissions/',
  STUDENT_WALLETS: 'homework/student-wallets/',
  REWARD_TRANSACTIONS: 'homework/reward-transactions/',
  BADGES: 'homework/badges/',
  LEADERBOARDS: 'homework/leaderboards/',

  // Attendance
  TIMETABLES: 'attendance/timetables/',
  TIMETABLE_SESSIONS: 'attendance/timetable-sessions/',
  ATTENDANCE_SESSIONS: 'attendance/sessions/',
  ATTENDANCE_RECORDS: 'attendance/records/',
  STUDENT_ENROLLMENTS: 'attendance/enrollments/',
  ABSENCE_FLAGS: 'attendance/absence-flags/',
  ATTENDANCE_NOTIFICATIONS: 'attendance/notifications/',
  ATTENDANCE_REPORTS: 'attendance/reports/',

  // Lessons
  LESSONS: 'lessons/lessons/',
  LESSON_RESOURCES: 'lessons/lessons/{id}/resources/',
  LESSON_TAGS: 'lessons/tags/',

  // Files
  UPLOAD_SIGNATURE: 'files/upload-signature/',

  // Health
  HEALTH: 'health/'
};

// HTTP status codes reference
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// Common query parameters
export const QUERY_PARAMS = {
  // Pagination
  PAGE: 'page',
  PAGE_SIZE: 'page_size',
  
  // Filtering
  SEARCH: 'search',
  ORDERING: 'ordering',
  IS_ACTIVE: 'is_active',
  IS_PUBLISHED: 'is_published',
  
  // Date filtering
  CREATED_AT_GTE: 'created_at__gte',
  CREATED_AT_LTE: 'created_at__lte',
  DATE_GTE: 'date__gte',
  DATE_LTE: 'date__lte',
  
  // Relations
  DETAILED: 'detailed',
  WITH_RELATIONS: 'with_relations'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER', 
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  STAFF: 'STAFF',
  DRIVER: 'DRIVER'
};

// Assignment types
export const ASSIGNMENT_TYPES = {
  QCM: 'QCM',
  BOOK: 'BOOK',
  OPEN: 'OPEN',
  MIXED: 'MIXED'
};

// Question types
export const QUESTION_TYPES = {
  QCM_SINGLE: 'QCM_SINGLE',
  QCM_MULTIPLE: 'QCM_MULTIPLE',
  TRUE_FALSE: 'TRUE_FALSE',
  FILL_BLANK: 'FILL_BLANK',
  OPEN_SHORT: 'OPEN_SHORT',
  OPEN_LONG: 'OPEN_LONG',
  MATCHING: 'MATCHING',
  ORDERING: 'ORDERING'
};

// Attendance statuses
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED'
};

// Educational levels
export const EDUCATIONAL_LEVELS = {
  PRIMARY: 'PRIMARY',
  MIDDLE: 'MIDDLE',
  HIGH: 'HIGH'
};

// Resource types
export const RESOURCE_TYPES = {
  PDF: 'PDF',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  DOCUMENT: 'DOCUMENT',
  PRESENTATION: 'PRESENTATION',
  LINK: 'LINK',
  TEXT: 'TEXT'
};

// Badge rarities
export const BADGE_RARITIES = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY'
};

// Lesson difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Lesson cycles
export const LESSON_CYCLES = {
  FIRST: 'first',
  SECOND: 'second'
};

// Room types
export const ROOM_TYPES = {
  CLASSROOM: 'CLASSROOM',
  LAB: 'LAB',
  LIBRARY: 'LIBRARY',
  GYM: 'GYM',
  COMPUTER: 'COMPUTER',
  ART: 'ART',
  MUSIC: 'MUSIC',
  OTHER: 'OTHER'
};

// Session statuses
export const SESSION_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

// Flag types
export const FLAG_TYPES = {
  ABSENCE: 'ABSENCE',
  CHRONIC_ABSENCE: 'CHRONIC_ABSENCE',
  LATE_PATTERN: 'LATE_PATTERN'
};

// Flag priorities
export const FLAG_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// Flag statuses
export const FLAG_STATUS = {
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED'
};

// Transaction types
export const TRANSACTION_TYPES = {
  EARNED: 'EARNED',
  SPENT: 'SPENT',
  BONUS: 'BONUS',
  PENALTY: 'PENALTY'
};

// Notification types
export const NOTIFICATION_TYPES = {
  ABSENCE_ALERT: 'ABSENCE_ALERT',
  LATE_ALERT: 'LATE_ALERT',
  FLAG_CREATED: 'FLAG_CREATED',
  FLAG_RESOLVED: 'FLAG_RESOLVED',
  CHRONIC_ABSENCE: 'CHRONIC_ABSENCE',
  ATTENDANCE_SUMMARY: 'ATTENDANCE_SUMMARY',
  EXCUSE_REQUIRED: 'EXCUSE_REQUIRED'
};

// Leaderboard types
export const LEADERBOARD_TYPES = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  SEMESTER: 'SEMESTER',
  CLASS: 'CLASS',
  GRADE: 'GRADE',
  SUBJECT: 'SUBJECT'
};

// Submission statuses
export const SUBMISSION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED'
};

// Enrollment statuses
export const ENROLLMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TRANSFERRED: 'TRANSFERRED',
  GRADUATED: 'GRADUATED'
};

export default {
  services,
  API_ENDPOINTS,
  HTTP_STATUS,
  QUERY_PARAMS,
  USER_ROLES,
  ASSIGNMENT_TYPES,
  QUESTION_TYPES,
  ATTENDANCE_STATUS,
  EDUCATIONAL_LEVELS,
  RESOURCE_TYPES,
  BADGE_RARITIES,
  DIFFICULTY_LEVELS,
  LESSON_CYCLES,
  ROOM_TYPES,
  SESSION_STATUS,
  FLAG_TYPES,
  FLAG_PRIORITIES,
  FLAG_STATUS,
  TRANSACTION_TYPES,
  NOTIFICATION_TYPES,
  LEADERBOARD_TYPES,
  SUBMISSION_STATUS,
  ENROLLMENT_STATUS
};
