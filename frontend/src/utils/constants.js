// Application Constants
export const APP_CONFIG = {
  NAME: 'Madrasti 2.0',
  VERSION: '2.0.0',
  DESCRIPTION: 'Modern School Management System',
  AUTHOR: 'OpiComTech',
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: {
    DEVELOPMENT: 'http://localhost:8000/api/',
    STAGING: 'https://staging-api.madrasti.ma/api/',
    PRODUCTION: 'https://api.madrasti.ma/api/',
  },
  ENDPOINTS: {
    AUTH: {
      LOGIN: 'users/login/',
      REGISTER: 'users/register/',
      REFRESH: 'token/refresh/',
      VERIFY: 'token/verify/',
      LOGOUT: 'users/logout/',
      CHANGE_PASSWORD: 'users/change-password/',
      RESET_PASSWORD: 'users/password-reset/',
    },
    USERS: {
      PROFILE: 'users/profile/',
      LIST: 'users/',
    },
    SCHOOLS: {
      CONFIG: 'schools/config/',
      LEVELS: 'schools/levels/',
      GRADES: 'schools/grades/',
      CLASSES: 'schools/classes/',
      SUBJECTS: 'schools/subjects/',
      ROOMS: 'schools/rooms/',
    },
    LESSONS: {
      LIST: 'lessons/lessons/',
      RESOURCES: 'lessons/lessons/{id}/resources/',
      TAGS: 'lessons/tags/',
    },
    HOMEWORK: {
      ASSIGNMENTS: 'homework/assignments/',
      QUESTIONS: 'homework/questions/',
      SUBMISSIONS: 'homework/submissions/',
      BADGES: 'homework/badges/',
      LEADERBOARDS: 'homework/leaderboards/',
    },
    ATTENDANCE: {
      TIMETABLES: 'attendance/timetables/',
      SESSIONS: 'attendance/sessions/',
      RECORDS: 'attendance/records/',
      FLAGS: 'attendance/absence-flags/',
      NOTIFICATIONS: 'attendance/notifications/',
      REPORTS: 'attendance/reports/',
    },
  },
  TIMEOUT: 30000, // 30 seconds
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  STAFF: 'STAFF',
  DRIVER: 'DRIVER',
}

// Permissions
export const PERMISSIONS = {
  // User management
  CAN_LIST_ALL_USERS: 'can_list_all_users',
  CAN_CREATE_USERS: 'can_create_users',
  CAN_UPDATE_USERS: 'can_update_users',
  CAN_DELETE_USERS: 'can_delete_users',
  
  // School management
  CAN_MANAGE_SCHOOL_CONFIG: 'can_manage_school_config',
  CAN_VIEW_SCHOOL_STRUCTURE: 'can_view_school_structure',
  
  // Assignment management
  CAN_CREATE_ASSIGNMENTS: 'can_create_assignments',
  CAN_VIEW_ASSIGNMENTS: 'can_view_assignments',
  CAN_SUBMIT_ASSIGNMENTS: 'can_submit_assignments',
  CAN_GRADE_ASSIGNMENTS: 'can_grade_assignments',
  
  // Attendance management
  CAN_MARK_ATTENDANCE: 'can_mark_attendance',
  CAN_VIEW_ATTENDANCE: 'can_view_attendance',
  CAN_CLEAR_FLAGS: 'can_clear_flags',
}

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    SECONDARY: {
      500: '#10b981',
      600: '#059669',
    },
    ACCENT: {
      500: '#f59e0b',
    },
    SUCCESS: {
      500: '#22c55e',
    },
    WARNING: {
      500: '#eab308',
    },
    ERROR: {
      500: '#ef4444',
    },
  },
  BREAKPOINTS: {
    XS: '320px',
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
}

// Language Configuration
export const LANGUAGE_CONFIG = {
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'ar', 'fr'],
  RTL_LANGUAGES: ['ar'],
  LANGUAGE_NAMES: {
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
  },
  LANGUAGE_FLAGS: {
    en: '🇺🇸',
    ar: '🇲🇦',
    fr: '🇫🇷',
  },
}

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'madrasti_auth_token',
  REFRESH_TOKEN: 'madrasti_refresh_token',
  USER_DATA: 'madrasti_user_data',
  THEME: 'madrasti_theme',
  LANGUAGE: 'madrasti_language',
  SIDEBAR_COLLAPSED: 'madrasti_sidebar_collapsed',
}

// Route Paths
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  DASHBOARD: {
    STUDENT: '/dashboard/student',
    TEACHER: '/dashboard/teacher',
    PARENT: '/dashboard/parent',
    ADMIN: '/dashboard/admin',
    STAFF: '/dashboard/staff',
    DRIVER: '/dashboard/driver',
  },
  PROFILE: '/profile',
  ATTENDANCE: {
    LIST: '/attendance',
    SESSION: '/attendance/session/:id',
    REPORTS: '/attendance/reports',
    FLAGS: '/attendance/flags',
  },
  HOMEWORK: {
    LIST: '/homework',
    CREATE: '/homework/create',
    EDIT: '/homework/edit/:id',
    VIEW: '/homework/:id',
    SUBMIT: '/homework/submit/:id',
    GRADES: '/homework/grades',
    LEADERBOARD: '/homework/leaderboard',
  },
  LESSONS: {
    LIST: '/lessons',
    CREATE: '/lessons/create',
    EDIT: '/lessons/edit/:id',
    VIEW: '/lessons/:id',
  },
  ADMIN: {
    USERS: '/admin/users',
    SCHOOLS: '/admin/schools',
    SETTINGS: '/admin/settings',
    REPORTS: '/admin/reports',
  },
}

// Assignment Types
export const ASSIGNMENT_TYPES = {
  QCM: 'QCM',
  BOOK: 'BOOK',
  OPEN: 'OPEN',
  MIXED: 'MIXED',
}

// Question Types
export const QUESTION_TYPES = {
  QCM_SINGLE: 'QCM_SINGLE',
  QCM_MULTIPLE: 'QCM_MULTIPLE',
  TRUE_FALSE: 'TRUE_FALSE',
  FILL_BLANK: 'FILL_BLANK',
  OPEN_SHORT: 'OPEN_SHORT',
  OPEN_LONG: 'OPEN_LONG',
  MATCHING: 'MATCHING',
  ORDERING: 'ORDERING',
}

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EXCUSED: 'EXCUSED',
}

// Session Status
export const SESSION_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
}

// Notification Types
export const NOTIFICATION_TYPES = {
  ABSENCE_ALERT: 'ABSENCE_ALERT',
  LATE_ALERT: 'LATE_ALERT',
  FLAG_CREATED: 'FLAG_CREATED',
  FLAG_RESOLVED: 'FLAG_RESOLVED',
  CHRONIC_ABSENCE: 'CHRONIC_ABSENCE',
  ATTENDANCE_SUMMARY: 'ATTENDANCE_SUMMARY',
  GRADE_PUBLISHED: 'GRADE_PUBLISHED',
  ASSIGNMENT_DUE: 'ASSIGNMENT_DUE',
  BADGE_EARNED: 'BADGE_EARNED',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
}

// File Types and Limits
export const FILE_CONFIG = {
  IMAGES: {
    FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_DIMENSIONS: { width: 2048, height: 2048 },
  },
  DOCUMENTS: {
    FORMATS: ['pdf', 'doc', 'docx', 'txt'],
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
  },
  VIDEOS: {
    FORMATS: ['mp4', 'webm', 'mov'],
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_DURATION: 600, // 10 minutes in seconds
  },
  AUDIO: {
    FORMATS: ['mp3', 'wav', 'ogg'],
    MAX_SIZE: 20 * 1024 * 1024, // 20MB
    MAX_DURATION: 1800, // 30 minutes in seconds
  },
}

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
}

// Default Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  SIZES: [10, 20, 50, 100],
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss[Z]',
}

// Educational Levels
export const EDUCATIONAL_LEVELS = {
  PRIMARY: 'PRIMARY',
  MIDDLE: 'MIDDLE',
  HIGH: 'HIGH',
}

// Badge Rarities
export const BADGE_RARITIES = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
}

// WebSocket Events
export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  ATTENDANCE_ALERT: 'attendance_alert',
  GRADE_PUBLISHED: 'grade_published',
  BADGE_EARNED: 'badge_earned',
  SYSTEM_ALERT: 'system_alert',
  HEARTBEAT: 'heartbeat',
}

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
}