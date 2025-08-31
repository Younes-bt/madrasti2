/**
 * React Query Configuration
 * Centralized caching strategy and query client setup
 */

import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { handleError, ERROR_TYPES } from '../services/errorHandler.js';

// Storage persister for offline caching
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'madrasti-queries',
  // Serialize/deserialize functions for complex data
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

// Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Garbage collection time: 10 minutes  
      gcTime: 10 * 60 * 1000,
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry auth errors
        if (error?.response?.status === 401) return false;
        // Don't retry validation errors
        if (error?.response?.status === 400) return false;
        // Don't retry not found errors
        if (error?.response?.status === 404) return false;
        // Retry network errors up to 3 times
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch configuration
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      // Error handling
      onError: (error) => {
        handleError(error, { context: 'react-query' });
      }
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Error handling
      onError: (error) => {
        handleError(error, { context: 'react-query-mutation' });
      }
    }
  }
});

// Persist query client for offline functionality
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  hydrateOptions: {
    // Don't hydrate failed queries
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      }
    }
  }
});

// Query keys factory for consistent cache keys
export const queryKeys = {
  // Authentication
  auth: {
    user: () => ['auth', 'user'],
    profile: () => ['auth', 'profile'],
    permissions: () => ['auth', 'permissions'],
  },

  // Users
  users: {
    all: () => ['users'],
    lists: () => [...queryKeys.users.all(), 'list'],
    list: (filters) => [...queryKeys.users.lists(), { filters }],
    details: () => [...queryKeys.users.all(), 'detail'],
    detail: (id) => [...queryKeys.users.details(), id],
    byRole: (role) => [...queryKeys.users.all(), 'role', role],
    search: (query) => [...queryKeys.users.all(), 'search', query],
  },

  // Schools
  schools: {
    all: () => ['schools'],
    config: () => [...queryKeys.schools.all(), 'config'],
    structure: () => [...queryKeys.schools.all(), 'structure'],
    academicYears: {
      all: () => [...queryKeys.schools.all(), 'academic-years'],
      current: () => [...queryKeys.schools.academicYears.all(), 'current'],
      detail: (id) => [...queryKeys.schools.academicYears.all(), id],
    },
    levels: {
      all: () => [...queryKeys.schools.all(), 'levels'],
      detail: (id) => [...queryKeys.schools.levels.all(), id],
    },
    grades: {
      all: () => [...queryKeys.schools.all(), 'grades'],
      detail: (id) => [...queryKeys.schools.grades.all(), id],
      byLevel: (levelId) => [...queryKeys.schools.grades.all(), 'level', levelId],
    },
    classes: {
      all: () => [...queryKeys.schools.all(), 'classes'],
      detail: (id) => [...queryKeys.schools.classes.all(), id],
      students: (id) => [...queryKeys.schools.classes.detail(id), 'students'],
      byGrade: (gradeId) => [...queryKeys.schools.classes.all(), 'grade', gradeId],
    },
    subjects: {
      all: () => [...queryKeys.schools.all(), 'subjects'],
      detail: (id) => [...queryKeys.schools.subjects.all(), id],
      byGrade: (gradeId) => [...queryKeys.schools.subjects.all(), 'grade', gradeId],
    },
    rooms: {
      all: () => [...queryKeys.schools.all(), 'rooms'],
      detail: (id) => [...queryKeys.schools.rooms.all(), id],
      available: () => [...queryKeys.schools.rooms.all(), 'available'],
    },
  },

  // Homework
  homework: {
    all: () => ['homework'],
    assignments: {
      all: () => [...queryKeys.homework.all(), 'assignments'],
      lists: () => [...queryKeys.homework.assignments.all(), 'list'],
      list: (filters) => [...queryKeys.homework.assignments.lists(), { filters }],
      detail: (id) => [...queryKeys.homework.assignments.all(), id],
      analytics: (id) => [...queryKeys.homework.assignments.detail(id), 'analytics'],
      submissions: (id) => [...queryKeys.homework.assignments.detail(id), 'submissions'],
      byTeacher: (teacherId) => [...queryKeys.homework.assignments.all(), 'teacher', teacherId],
      byStudent: (studentId) => [...queryKeys.homework.assignments.all(), 'student', studentId],
      byClass: (classId) => [...queryKeys.homework.assignments.all(), 'class', classId],
    },
    questions: {
      all: () => [...queryKeys.homework.all(), 'questions'],
      byAssignment: (assignmentId) => [...queryKeys.homework.questions.all(), 'assignment', assignmentId],
      detail: (id) => [...queryKeys.homework.questions.all(), id],
    },
    submissions: {
      all: () => [...queryKeys.homework.all(), 'submissions'],
      detail: (id) => [...queryKeys.homework.submissions.all(), id],
      byAssignment: (assignmentId) => [...queryKeys.homework.submissions.all(), 'assignment', assignmentId],
      byStudent: (studentId) => [...queryKeys.homework.submissions.all(), 'student', studentId],
    },
    gamification: {
      wallets: () => [...queryKeys.homework.all(), 'wallets'],
      wallet: (studentId) => [...queryKeys.homework.gamification.wallets(), studentId],
      transactions: () => [...queryKeys.homework.all(), 'transactions'],
      badges: () => [...queryKeys.homework.all(), 'badges'],
      leaderboards: () => [...queryKeys.homework.all(), 'leaderboards'],
      leaderboard: (type, filters) => [...queryKeys.homework.gamification.leaderboards(), type, { filters }],
    },
  },

  // Attendance
  attendance: {
    all: () => ['attendance'],
    timetables: {
      all: () => [...queryKeys.attendance.all(), 'timetables'],
      detail: (id) => [...queryKeys.attendance.timetables.all(), id],
      byClass: (classId) => [...queryKeys.attendance.timetables.all(), 'class', classId],
    },
    sessions: {
      all: () => [...queryKeys.attendance.all(), 'sessions'],
      detail: (id) => [...queryKeys.attendance.sessions.all(), id],
      today: () => [...queryKeys.attendance.sessions.all(), 'today'],
      weekly: () => [...queryKeys.attendance.sessions.all(), 'weekly'],
      students: (id) => [...queryKeys.attendance.sessions.detail(id), 'students'],
    },
    records: {
      all: () => [...queryKeys.attendance.all(), 'records'],
      bySession: (sessionId) => [...queryKeys.attendance.records.all(), 'session', sessionId],
      byStudent: (studentId) => [...queryKeys.attendance.records.all(), 'student', studentId],
    },
    flags: {
      all: () => [...queryKeys.attendance.all(), 'flags'],
      pending: () => [...queryKeys.attendance.flags.all(), 'pending'],
      byStudent: (studentId) => [...queryKeys.attendance.flags.all(), 'student', studentId],
      analytics: () => [...queryKeys.attendance.flags.all(), 'analytics'],
    },
    notifications: {
      all: () => [...queryKeys.attendance.all(), 'notifications'],
      unread: () => [...queryKeys.attendance.notifications.all(), 'unread'],
    },
    reports: {
      all: () => [...queryKeys.attendance.all(), 'reports'],
      classStats: (classId, period) => [...queryKeys.attendance.reports.all(), 'class-stats', classId, period],
      studentHistory: (studentId, period) => [...queryKeys.attendance.reports.all(), 'student-history', studentId, period],
      daily: (date) => [...queryKeys.attendance.reports.all(), 'daily', date],
      weekly: (week) => [...queryKeys.attendance.reports.all(), 'weekly', week],
      monthly: (month) => [...queryKeys.attendance.reports.all(), 'monthly', month],
    },
  },

  // Lessons
  lessons: {
    all: () => ['lessons'],
    lists: () => [...queryKeys.lessons.all(), 'list'],
    list: (filters) => [...queryKeys.lessons.lists(), { filters }],
    detail: (id) => [...queryKeys.lessons.all(), id],
    resources: (id) => [...queryKeys.lessons.detail(id), 'resources'],
    analytics: (id) => [...queryKeys.lessons.detail(id), 'analytics'],
    bySubject: (subjectId) => [...queryKeys.lessons.all(), 'subject', subjectId],
    byGrade: (gradeId) => [...queryKeys.lessons.all(), 'grade', gradeId],
    byTeacher: (teacherId) => [...queryKeys.lessons.all(), 'teacher', teacherId],
    tags: () => [...queryKeys.lessons.all(), 'tags'],
    search: (query) => [...queryKeys.lessons.all(), 'search', query],
  },
};

// Cache invalidation helpers
export const invalidateQueries = {
  // Invalidate all user-related queries
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all() }),
  
  // Invalidate school structure
  schoolStructure: () => queryClient.invalidateQueries({ queryKey: queryKeys.schools.all() }),
  
  // Invalidate homework data
  homework: () => queryClient.invalidateQueries({ queryKey: queryKeys.homework.all() }),
  
  // Invalidate attendance data  
  attendance: () => queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all() }),
  
  // Invalidate lessons data
  lessons: () => queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all() }),
  
  // Invalidate specific assignment and related data
  assignment: (assignmentId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.homework.assignments.detail(assignmentId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.homework.questions.byAssignment(assignmentId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.homework.submissions.byAssignment(assignmentId) });
  },
  
  // Invalidate attendance session and related data
  attendanceSession: (sessionId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.attendance.sessions.detail(sessionId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.attendance.records.bySession(sessionId) });
  },
  
  // Invalidate student-specific data
  student: (studentId) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.homework.submissions.byStudent(studentId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.attendance.records.byStudent(studentId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.homework.gamification.wallet(studentId) });
  },
  
  // Invalidate all queries (nuclear option)
  all: () => queryClient.invalidateQueries(),
};

// Prefetch helpers for common scenarios
export const prefetchQueries = {
  // Prefetch user profile after login
  userProfile: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.auth.profile(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
  
  // Prefetch school structure for dashboard
  schoolStructure: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.schools.structure(),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  },
  
  // Prefetch today's sessions for teacher
  todaySessions: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.attendance.sessions.today(),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  },
  
  // Prefetch student assignments
  studentAssignments: async (studentId) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.homework.assignments.byStudent(studentId),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },
};

// Cache utilities
export const cacheUtils = {
  // Get cached data without triggering fetch
  getCached: (queryKey) => queryClient.getQueryData(queryKey),
  
  // Set data in cache manually
  setCache: (queryKey, data) => queryClient.setQueryData(queryKey, data),
  
  // Remove specific query from cache
  removeQuery: (queryKey) => queryClient.removeQueries({ queryKey }),
  
  // Clear all cached data
  clearCache: () => queryClient.clear(),
  
  // Get cache statistics
  getCacheStats: () => ({
    queryCount: queryClient.getQueryCache().getAll().length,
    mutationCount: queryClient.getMutationCache().getAll().length,
  }),
  
  // Manually garbage collect
  garbageCollect: () => queryClient.getQueryCache().clear(),
};

// Setup function to configure React Query for the app
export const setupReactQuery = () => {
  // Handle network status for offline support
  window.addEventListener('online', () => {
    queryClient.resumePausedMutations();
    queryClient.invalidateQueries();
  });
  
  window.addEventListener('offline', () => {
    queryClient.getQueryCache().getAll().forEach(query => {
      query.setData(query.state.data, { updatedAt: Date.now() });
    });
  });
  
  // Setup automatic cache cleanup on app focus
  window.addEventListener('focus', () => {
    // Cleanup stale queries when app regains focus
    queryClient.refetchQueries({ type: 'active', stale: true });
  });
  
  // Setup error handling for authentication errors
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'queryUpdated' && event.query.state.error) {
      const error = event.query.state.error;
      if (error?.response?.status === 401) {
        // Clear all queries on auth error
        queryClient.clear();
        // Dispatch custom auth error event
        window.dispatchEvent(new CustomEvent('auth-error', {
          detail: { message: 'Authentication expired' }
        }));
      }
    }
  });
};

export default queryClient;