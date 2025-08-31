import { STORAGE_KEYS } from './constants'

/**
 * Enhanced Local Storage Utilities with error handling and type safety
 */

class Storage {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'sessionStorage' ? window.sessionStorage : window.localStorage
    this.prefix = 'madrasti_'
  }

  /**
   * Set item in storage with serialization
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} - Success status
   */
  set(key, value) {
    try {
      const prefixedKey = this.prefix + key
      const serializedValue = JSON.stringify({
        value,
        timestamp: Date.now(),
        type: typeof value,
      })
      this.storage.setItem(prefixedKey, serializedValue)
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.clearExpired()
        // Try again after clearing
        try {
          const prefixedKey = this.prefix + key
          const serializedValue = JSON.stringify({
            value,
            timestamp: Date.now(),
            type: typeof value,
          })
          this.storage.setItem(prefixedKey, serializedValue)
          return true
        } catch (retryError) {
          console.error('Storage retry error:', retryError)
          return false
        }
      }
      
      return false
    }
  }

  /**
   * Get item from storage with deserialization
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} - Retrieved value or default
   */
  get(key, defaultValue = null) {
    try {
      const prefixedKey = this.prefix + key
      const item = this.storage.getItem(prefixedKey)
      
      if (item === null) {
        return defaultValue
      }

      const parsed = JSON.parse(item)
      return parsed.value !== undefined ? parsed.value : defaultValue
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  }

  /**
   * Remove item from storage
   * @param {string} key - Storage key
   * @returns {boolean} - Success status
   */
  remove(key) {
    try {
      const prefixedKey = this.prefix + key
      this.storage.removeItem(prefixedKey)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  /**
   * Clear all items with app prefix
   * @returns {boolean} - Success status
   */
  clear() {
    try {
      const keys = Object.keys(this.storage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.storage.removeItem(key)
        }
      })
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }

  /**
   * Check if key exists in storage
   * @param {string} key - Storage key
   * @returns {boolean} - Existence status
   */
  has(key) {
    const prefixedKey = this.prefix + key
    return this.storage.getItem(prefixedKey) !== null
  }

  /**
   * Get all keys with app prefix
   * @returns {string[]} - Array of keys
   */
  keys() {
    try {
      const keys = Object.keys(this.storage)
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length))
    } catch (error) {
      console.error('Storage keys error:', error)
      return []
    }
  }

  /**
   * Get storage size in bytes
   * @returns {number} - Size in bytes
   */
  size() {
    try {
      let total = 0
      const keys = Object.keys(this.storage)
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          total += this.storage.getItem(key).length
        }
      })
      return total
    } catch (error) {
      console.error('Storage size error:', error)
      return 0
    }
  }

  /**
   * Set item with expiration time
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {number} expirationMinutes - Expiration in minutes
   * @returns {boolean} - Success status
   */
  setWithExpiration(key, value, expirationMinutes) {
    try {
      const prefixedKey = this.prefix + key
      const expirationTime = Date.now() + (expirationMinutes * 60 * 1000)
      const serializedValue = JSON.stringify({
        value,
        timestamp: Date.now(),
        expiration: expirationTime,
        type: typeof value,
      })
      this.storage.setItem(prefixedKey, serializedValue)
      return true
    } catch (error) {
      console.error('Storage set with expiration error:', error)
      return false
    }
  }

  /**
   * Get item if not expired
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if expired or doesn't exist
   * @returns {*} - Retrieved value or default
   */
  getWithExpiration(key, defaultValue = null) {
    try {
      const prefixedKey = this.prefix + key
      const item = this.storage.getItem(prefixedKey)
      
      if (item === null) {
        return defaultValue
      }

      const parsed = JSON.parse(item)
      
      // Check if item has expiration and is expired
      if (parsed.expiration && Date.now() > parsed.expiration) {
        this.remove(key)
        return defaultValue
      }

      return parsed.value !== undefined ? parsed.value : defaultValue
    } catch (error) {
      console.error('Storage get with expiration error:', error)
      return defaultValue
    }
  }

  /**
   * Clear all expired items
   * @returns {number} - Number of items cleared
   */
  clearExpired() {
    let clearedCount = 0
    
    try {
      const keys = Object.keys(this.storage)
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          try {
            const item = this.storage.getItem(key)
            const parsed = JSON.parse(item)
            
            if (parsed.expiration && Date.now() > parsed.expiration) {
              this.storage.removeItem(key)
              clearedCount++
            }
          } catch (parseError) {
            // Remove invalid items
            this.storage.removeItem(key)
            clearedCount++
          }
        }
      })
    } catch (error) {
      console.error('Storage clear expired error:', error)
    }
    
    return clearedCount
  }

  /**
   * Get storage information
   * @returns {object} - Storage statistics
   */
  getInfo() {
    try {
      const keys = this.keys()
      const sizeInBytes = this.size()
      
      return {
        itemCount: keys.length,
        sizeInBytes,
        sizeInKB: Math.round(sizeInBytes / 1024),
        keys,
        isAvailable: this.isAvailable(),
        storageType: this.storage === localStorage ? 'localStorage' : 'sessionStorage',
      }
    } catch (error) {
      console.error('Storage info error:', error)
      return {
        itemCount: 0,
        sizeInBytes: 0,
        sizeInKB: 0,
        keys: [],
        isAvailable: false,
        storageType: 'unknown',
      }
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean} - Availability status
   */
  isAvailable() {
    try {
      const testKey = this.prefix + 'test'
      this.storage.setItem(testKey, 'test')
      this.storage.removeItem(testKey)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Migrate data from old storage structure
   * @param {object} migrationMap - Key mapping for migration
   * @returns {number} - Number of items migrated
   */
  migrate(migrationMap) {
    let migratedCount = 0
    
    try {
      Object.entries(migrationMap).forEach(([oldKey, newKey]) => {
        const oldValue = this.storage.getItem(oldKey)
        if (oldValue !== null) {
          this.set(newKey, JSON.parse(oldValue))
          this.storage.removeItem(oldKey)
          migratedCount++
        }
      })
    } catch (error) {
      console.error('Storage migration error:', error)
    }
    
    return migratedCount
  }

  /**
   * Export storage data
   * @returns {object} - All storage data
   */
  export() {
    try {
      const data = {}
      const keys = this.keys()
      
      keys.forEach(key => {
        data[key] = this.get(key)
      })
      
      return {
        data,
        timestamp: Date.now(),
        version: '1.0',
      }
    } catch (error) {
      console.error('Storage export error:', error)
      return null
    }
  }

  /**
   * Import storage data
   * @param {object} exportedData - Data to import
   * @param {boolean} clearExisting - Whether to clear existing data
   * @returns {boolean} - Success status
   */
  import(exportedData, clearExisting = false) {
    try {
      if (clearExisting) {
        this.clear()
      }
      
      if (exportedData.data) {
        Object.entries(exportedData.data).forEach(([key, value]) => {
          this.set(key, value)
        })
      }
      
      return true
    } catch (error) {
      console.error('Storage import error:', error)
      return false
    }
  }
}

// Create instances for different storage types
export const localStorageUtil = new Storage('localStorage')
export const sessionStorageUtil = new Storage('sessionStorage')

/**
 * Specialized storage utilities for specific data types
 */

// Authentication storage
export const authStorage = {
  setTokens: (accessToken, refreshToken) => {
    localStorageUtil.set(STORAGE_KEYS.AUTH_TOKEN, accessToken)
    localStorageUtil.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },

  getAccessToken: () => {
    return localStorageUtil.get(STORAGE_KEYS.AUTH_TOKEN)
  },

  getRefreshToken: () => {
    return localStorageUtil.get(STORAGE_KEYS.REFRESH_TOKEN)
  },

  clearTokens: () => {
    localStorageUtil.remove(STORAGE_KEYS.AUTH_TOKEN)
    localStorageUtil.remove(STORAGE_KEYS.REFRESH_TOKEN)
    localStorageUtil.remove(STORAGE_KEYS.USER_DATA)
  },

  setUserData: (userData) => {
    localStorageUtil.set(STORAGE_KEYS.USER_DATA, userData)
  },

  getUserData: () => {
    return localStorageUtil.get(STORAGE_KEYS.USER_DATA)
  },

  // Additional methods for the auth system
  set: (key, value) => {
    return localStorageUtil.set(key, value)
  },

  get: (key, defaultValue = null) => {
    return localStorageUtil.get(key, defaultValue)
  },

  remove: (key) => {
    return localStorageUtil.remove(key)
  },
}

// Theme storage
export const themeStorage = {
  setTheme: (theme) => {
    localStorageUtil.set(STORAGE_KEYS.THEME, theme)
  },

  getTheme: () => {
    return localStorageUtil.get(STORAGE_KEYS.THEME, 'system')
  },
}

// Language storage
export const languageStorage = {
  setLanguage: (language) => {
    localStorageUtil.set(STORAGE_KEYS.LANGUAGE, language)
  },

  getLanguage: () => {
    return localStorageUtil.get(STORAGE_KEYS.LANGUAGE, 'en')
  },
}

// UI state storage
export const uiStorage = {
  setSidebarCollapsed: (collapsed) => {
    localStorageUtil.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed)
  },

  getSidebarCollapsed: () => {
    return localStorageUtil.get(STORAGE_KEYS.SIDEBAR_COLLAPSED, false)
  },
}

// Cache storage with automatic expiration
export const cacheStorage = {
  set: (key, value, expirationMinutes = 60) => {
    return localStorageUtil.setWithExpiration(`cache_${key}`, value, expirationMinutes)
  },

  get: (key, defaultValue = null) => {
    return localStorageUtil.getWithExpiration(`cache_${key}`, defaultValue)
  },

  remove: (key) => {
    return localStorageUtil.remove(`cache_${key}`)
  },

  clear: () => {
    const keys = localStorageUtil.keys()
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorageUtil.remove(key)
      }
    })
  },

  clearExpired: () => {
    return localStorageUtil.clearExpired()
  },
}

// Form draft storage for auto-save functionality
export const draftStorage = {
  saveDraft: (formId, formData) => {
    return sessionStorageUtil.setWithExpiration(`draft_${formId}`, formData, 60) // 1 hour
  },

  loadDraft: (formId) => {
    return sessionStorageUtil.getWithExpiration(`draft_${formId}`)
  },

  removeDraft: (formId) => {
    return sessionStorageUtil.remove(`draft_${formId}`)
  },

  clearDrafts: () => {
    const keys = sessionStorageUtil.keys()
    keys.forEach(key => {
      if (key.startsWith('draft_')) {
        sessionStorageUtil.remove(key)
      }
    })
  },
}

// Offline-specific storage utilities
export const offlineStorage = {
  // Store critical data that should be available offline
  setCriticalData: (key, value) => {
    return localStorageUtil.setWithExpiration(`critical_${key}`, value, 10080) // 1 week
  },

  getCriticalData: (key, defaultValue = null) => {
    return localStorageUtil.getWithExpiration(`critical_${key}`, defaultValue)
  },

  // Store user preferences that should persist offline
  setUserPreferences: (preferences) => {
    return localStorageUtil.set('user_preferences', preferences)
  },

  getUserPreferences: () => {
    return localStorageUtil.get('user_preferences', {})
  },

  // Store school structure data for offline access
  setSchoolStructure: (structure) => {
    return localStorageUtil.setWithExpiration('school_structure', structure, 1440) // 24 hours
  },

  getSchoolStructure: () => {
    return localStorageUtil.getWithExpiration('school_structure')
  },

  // Store assignment data for offline access  
  setOfflineAssignments: (assignments) => {
    return localStorageUtil.setWithExpiration('offline_assignments', assignments, 720) // 12 hours
  },

  getOfflineAssignments: () => {
    return localStorageUtil.getWithExpiration('offline_assignments', [])
  },

  // Store student progress data
  setStudentProgress: (studentId, progress) => {
    return localStorageUtil.setWithExpiration(`progress_${studentId}`, progress, 1440) // 24 hours
  },

  getStudentProgress: (studentId) => {
    return localStorageUtil.getWithExpiration(`progress_${studentId}`)
  },

  // Store pending operations to sync when online
  addPendingSync: (operation) => {
    const existing = localStorageUtil.get('pending_sync', [])
    const updated = [...existing, { ...operation, timestamp: Date.now(), id: Date.now() + Math.random() }]
    return localStorageUtil.set('pending_sync', updated)
  },

  getPendingSync: () => {
    return localStorageUtil.get('pending_sync', [])
  },

  removePendingSync: (operationId) => {
    const existing = localStorageUtil.get('pending_sync', [])
    const updated = existing.filter(op => op.id !== operationId)
    return localStorageUtil.set('pending_sync', updated)
  },

  clearPendingSync: () => {
    return localStorageUtil.remove('pending_sync')
  },

  // Store offline session data for attendance
  setOfflineSession: (sessionId, sessionData) => {
    return localStorageUtil.setWithExpiration(`session_${sessionId}`, sessionData, 1440) // 24 hours
  },

  getOfflineSession: (sessionId) => {
    return localStorageUtil.getWithExpiration(`session_${sessionId}`)
  },

  // Store offline attendance records
  setOfflineAttendance: (sessionId, attendanceData) => {
    return localStorageUtil.set(`attendance_${sessionId}`, attendanceData)
  },

  getOfflineAttendance: (sessionId) => {
    return localStorageUtil.get(`attendance_${sessionId}`)
  },

  // Network status tracking
  setOnlineStatus: (isOnline) => {
    sessionStorageUtil.set('is_online', isOnline)
    sessionStorageUtil.set('last_online', isOnline ? Date.now() : sessionStorageUtil.get('last_online'))
  },

  getOnlineStatus: () => {
    return sessionStorageUtil.get('is_online', navigator.onLine)
  },

  getLastOnlineTime: () => {
    return sessionStorageUtil.get('last_online', Date.now())
  },

  // Clear all offline data
  clearOfflineData: () => {
    const keys = localStorageUtil.keys()
    const offlineKeys = keys.filter(key => 
      key.startsWith('critical_') || 
      key.startsWith('progress_') ||
      key.startsWith('session_') ||
      key.startsWith('attendance_') ||
      key === 'school_structure' ||
      key === 'offline_assignments' ||
      key === 'pending_sync'
    )
    
    offlineKeys.forEach(key => localStorageUtil.remove(key))
    return offlineKeys.length
  }
}

// Enhanced storage utilities with offline support
export const enhancedStorage = {
  /**
   * Store data with offline fallback support
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {Object} options - Storage options
   */
  setStoredData: (key, value, options = {}) => {
    const {
      expiresIn = null, // expiration in seconds
      priority = 'normal', // 'critical', 'high', 'normal', 'low'
      syncWhenOnline = false // whether to sync with server when online
    } = options

    const storageData = {
      value,
      timestamp: Date.now(),
      priority,
      syncWhenOnline,
      ...(expiresIn && { expiresAt: Date.now() + (expiresIn * 1000) })
    }

    if (priority === 'critical') {
      return offlineStorage.setCriticalData(key, storageData)
    }

    if (expiresIn) {
      return localStorageUtil.setWithExpiration(key, storageData, Math.floor(expiresIn / 60))
    }

    return localStorageUtil.set(key, storageData)
  },

  /**
   * Get stored data with offline fallback
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value
   * @returns {*} Retrieved value
   */
  getStoredData: (key, defaultValue = null) => {
    // Try critical storage first
    let data = offlineStorage.getCriticalData(key)
    
    // Fall back to regular storage
    if (!data) {
      data = localStorageUtil.getWithExpiration(key) || localStorageUtil.get(key)
    }

    if (data && typeof data === 'object' && data.value !== undefined) {
      return data.value
    }

    return data || defaultValue
  },

  /**
   * Remove stored data
   * @param {string} key - Storage key
   */
  removeStoredData: (key) => {
    localStorageUtil.remove(key)
    localStorageUtil.remove(`critical_${key}`)
  },

  /**
   * Check if data exists in storage
   * @param {string} key - Storage key
   * @returns {boolean} Existence status
   */
  hasStoredData: (key) => {
    return localStorageUtil.has(key) || localStorageUtil.has(`critical_${key}`)
  },

  /**
   * Get storage statistics
   * @returns {Object} Storage statistics
   */
  getStorageStats: () => {
    const localInfo = localStorageUtil.getInfo()
    const sessionInfo = sessionStorageUtil.getInfo()
    const pendingSync = offlineStorage.getPendingSync()
    
    return {
      localStorage: localInfo,
      sessionStorage: sessionInfo,
      offlineData: {
        pendingSyncOperations: pendingSync.length,
        isOnline: offlineStorage.getOnlineStatus(),
        lastOnline: new Date(offlineStorage.getLastOnlineTime()),
      },
      totalSize: localInfo.sizeInKB + sessionInfo.sizeInKB
    }
  }
}

// Setup offline functionality
export const setupOfflineSupport = () => {
  // Track online/offline status
  const updateOnlineStatus = () => {
    offlineStorage.setOnlineStatus(navigator.onLine)
    
    // Dispatch custom events for app to handle
    window.dispatchEvent(new CustomEvent(navigator.onLine ? 'app-online' : 'app-offline', {
      detail: { 
        isOnline: navigator.onLine,
        timestamp: Date.now()
      }
    }))
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  // Initial status
  updateOnlineStatus()

  // Cleanup expired data periodically
  const cleanupInterval = setInterval(() => {
    try {
      localStorageUtil.clearExpired()
      cacheStorage.clearExpired()
    } catch (error) {
      console.error('Storage cleanup error:', error)
    }
  }, 1000 * 60 * 15) // Every 15 minutes

  // Return cleanup function
  return () => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
    clearInterval(cleanupInterval)
  }
}

// Export enhanced setStoredData and getStoredData for backward compatibility
export const setStoredData = enhancedStorage.setStoredData
export const getStoredData = enhancedStorage.getStoredData
export const removeStoredData = enhancedStorage.removeStoredData

// Export main storage instance as default
export default localStorageUtil