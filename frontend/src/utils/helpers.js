import { STORAGE_KEYS, VALIDATION_RULES, DATE_FORMATS } from './constants'

/**
 * Local Storage Utilities
 */
export const storage = {
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },
}

/**
 * Authentication Utilities
 */
export const auth = {
  setTokens: (accessToken, refreshToken) => {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, accessToken)
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  },

  getAccessToken: () => {
    return storage.get(STORAGE_KEYS.AUTH_TOKEN)
  },

  getRefreshToken: () => {
    return storage.get(STORAGE_KEYS.REFRESH_TOKEN)
  },

  clearTokens: () => {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN)
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN)
    storage.remove(STORAGE_KEYS.USER_DATA)
  },

  isAuthenticated: () => {
    const token = auth.getAccessToken()
    return token && !auth.isTokenExpired(token)
  },

  isTokenExpired: (token) => {
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  },

  getUserFromToken: (token) => {
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        id: payload.user_id,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions || [],
      }
    } catch (error) {
      return null
    }
  },
}

/**
 * Form Validation Utilities
 */
export const validation = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return {
      isValid: regex.test(email) && email.length <= VALIDATION_RULES.EMAIL.MAX_LENGTH,
      message: !regex.test(email) 
        ? 'Please enter a valid email address'
        : email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH
        ? 'Email is too long'
        : '',
    }
  },

  password: (password) => {
    const rules = VALIDATION_RULES.PASSWORD
    const checks = {
      minLength: password.length >= rules.MIN_LENGTH,
      maxLength: password.length <= rules.MAX_LENGTH,
      hasUppercase: rules.REQUIRE_UPPERCASE ? /[A-Z]/.test(password) : true,
      hasLowercase: rules.REQUIRE_LOWERCASE ? /[a-z]/.test(password) : true,
      hasNumbers: rules.REQUIRE_NUMBERS ? /\d/.test(password) : true,
      hasSpecialChars: rules.REQUIRE_SPECIAL_CHARS ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
    }

    const isValid = Object.values(checks).every(Boolean)
    const messages = []

    if (!checks.minLength) messages.push(`Password must be at least ${rules.MIN_LENGTH} characters long`)
    if (!checks.maxLength) messages.push(`Password must be no more than ${rules.MAX_LENGTH} characters long`)
    if (!checks.hasUppercase) messages.push('Password must contain at least one uppercase letter')
    if (!checks.hasLowercase) messages.push('Password must contain at least one lowercase letter')
    if (!checks.hasNumbers) messages.push('Password must contain at least one number')
    if (!checks.hasSpecialChars) messages.push('Password must contain at least one special character')

    return {
      isValid,
      message: messages.join('. '),
      checks,
    }
  },

  required: (value) => {
    const isValid = value !== null && value !== undefined && value.toString().trim() !== ''
    return {
      isValid,
      message: isValid ? '' : 'This field is required',
    }
  },

  minLength: (value, minLength) => {
    const isValid = value && value.length >= minLength
    return {
      isValid,
      message: isValid ? '' : `Must be at least ${minLength} characters long`,
    }
  },

  maxLength: (value, maxLength) => {
    const isValid = !value || value.length <= maxLength
    return {
      isValid,
      message: isValid ? '' : `Must be no more than ${maxLength} characters long`,
    }
  },

  phone: (phone) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const rules = VALIDATION_RULES.PHONE
    const isValid = cleanPhone.length >= rules.MIN_LENGTH && cleanPhone.length <= rules.MAX_LENGTH
    
    return {
      isValid,
      message: isValid ? '' : `Phone number must be between ${rules.MIN_LENGTH} and ${rules.MAX_LENGTH} digits`,
    }
  },
}

/**
 * Date Utilities
 */
export const dateUtils = {
  format: (date, format = DATE_FORMATS.DISPLAY) => {
    if (!date) return ''
    
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''

    // Simple format implementation - you might want to use a library like date-fns or dayjs
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')

    switch (format) {
      case DATE_FORMATS.DISPLAY:
        return `${day}/${month}/${year}`
      case DATE_FORMATS.DISPLAY_WITH_TIME:
        return `${day}/${month}/${year} ${hours}:${minutes}`
      case DATE_FORMATS.API:
        return `${year}-${month}-${day}`
      case DATE_FORMATS.API_WITH_TIME:
        return d.toISOString()
      default:
        return d.toString()
    }
  },

  parse: (dateString, format = DATE_FORMATS.DISPLAY) => {
    if (!dateString) return null

    try {
      if (format === DATE_FORMATS.API || format === DATE_FORMATS.API_WITH_TIME) {
        return new Date(dateString)
      }
      
      if (format === DATE_FORMATS.DISPLAY) {
        const [day, month, year] = dateString.split('/')
        return new Date(year, month - 1, day)
      }

      return new Date(dateString)
    } catch (error) {
      return null
    }
  },

  isToday: (date) => {
    const today = new Date()
    const d = new Date(date)
    return d.toDateString() === today.toDateString()
  },

  isYesterday: (date) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const d = new Date(date)
    return d.toDateString() === yesterday.toDateString()
  },

  isTomorrow: (date) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const d = new Date(date)
    return d.toDateString() === tomorrow.toDateString()
  },

  daysBetween: (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2 - d1)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  addDays: (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },

  timeAgo: (date) => {
    const now = new Date()
    const d = new Date(date)
    const diffMs = now - d
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return dateUtils.format(date)
  },
}

/**
 * String Utilities
 */
export const stringUtils = {
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  capitalizeWords: (str) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  truncate: (str, length = 100, suffix = '...') => {
    if (str.length <= length) return str
    return str.substring(0, length).trim() + suffix
  },

  slugify: (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  },

  removeHtml: (str) => {
    return str.replace(/<[^>]*>/g, '')
  },

  escapeHtml: (str) => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  },

  unescapeHtml: (str) => {
    const div = document.createElement('div')
    div.innerHTML = str
    return div.textContent || div.innerText || ''
  },

  generateId: (length = 8) => {
    return Math.random().toString(36).substring(2, length + 2)
  },
}

/**
 * Number Utilities
 */
export const numberUtils = {
  formatCurrency: (amount, currency = 'MAD') => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  },

  formatPercentage: (value, decimals = 1) => {
    return `${(value * 100).toFixed(decimals)}%`
  },

  formatNumber: (value, locale = 'fr-MA') => {
    return new Intl.NumberFormat(locale).format(value)
  },

  clamp: (value, min, max) => {
    return Math.min(Math.max(value, min), max)
  },

  randomBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  roundTo: (value, decimals = 2) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
  },
}

/**
 * Array Utilities
 */
export const arrayUtils = {
  unique: (array) => {
    return [...new Set(array)]
  },

  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key]
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  },

  sortBy: (array, key, direction = 'asc') => {
    return [...array].sort((a, b) => {
      const aVal = typeof key === 'function' ? key(a) : a[key]
      const bVal = typeof key === 'function' ? key(b) : b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  },

  shuffle: (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  chunk: (array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  },
}

/**
 * Object Utilities
 */
export const objectUtils = {
  pick: (object, keys) => {
    return keys.reduce((result, key) => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        result[key] = object[key]
      }
      return result
    }, {})
  },

  omit: (object, keys) => {
    const result = { ...object }
    keys.forEach(key => delete result[key])
    return result
  },

  deepClone: (object) => {
    if (object === null || typeof object !== 'object') return object
    if (object instanceof Date) return new Date(object.getTime())
    if (object instanceof Array) return object.map(item => objectUtils.deepClone(item))
    if (typeof object === 'object') {
      const cloned = {}
      Object.keys(object).forEach(key => {
        cloned[key] = objectUtils.deepClone(object[key])
      })
      return cloned
    }
    return object
  },

  isEmpty: (object) => {
    return Object.keys(object).length === 0
  },

  hasNestedProperty: (object, path) => {
    return path.split('.').reduce((obj, key) => obj && obj[key], object) !== undefined
  },

  getNestedProperty: (object, path, defaultValue = undefined) => {
    return path.split('.').reduce((obj, key) => obj && obj[key], object) || defaultValue
  },
}

/**
 * URL and Query Utilities
 */
export const urlUtils = {
  buildUrl: (baseUrl, path, params = {}) => {
    const url = new URL(path, baseUrl)
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key])
      }
    })
    return url.toString()
  },

  parseQuery: (queryString = window.location.search) => {
    const params = new URLSearchParams(queryString)
    const result = {}
    for (const [key, value] of params) {
      result[key] = value
    }
    return result
  },

  buildQuery: (params) => {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.append(key, params[key])
      }
    })
    return searchParams.toString()
  },
}

/**
 * File Utilities
 */
export const fileUtils = {
  getFileExtension: (filename) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
  },

  formatFileSize: (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  },

  isImageFile: (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
    const extension = fileUtils.getFileExtension(filename).toLowerCase()
    return imageExtensions.includes(extension)
  },

  isDocumentFile: (filename) => {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
    const extension = fileUtils.getFileExtension(filename).toLowerCase()
    return docExtensions.includes(extension)
  },

  createObjectURL: (file) => {
    return URL.createObjectURL(file)
  },

  revokeObjectURL: (url) => {
    URL.revokeObjectURL(url)
  },
}

/**
 * Debounce and Throttle Utilities
 */
export const performanceUtils = {
  debounce: (func, wait, immediate = false) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        timeout = null
        if (!immediate) func(...args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func(...args)
    }
  },

  throttle: (func, limit) => {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },
}

/**
 * Device Detection Utilities
 */
export const deviceUtils = {
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  isTablet: () => {
    return /iPad|Android|Silk|Kindle/i.test(navigator.userAgent) && window.innerWidth >= 768
  },

  isDesktop: () => {
    return !deviceUtils.isMobile() && !deviceUtils.isTablet()
  },

  getTouchSupport: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
  },

  getViewportSize: () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  },
}

/**
 * Error Handling Utilities
 */
export const errorUtils = {
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.response?.data?.message) return error.response.data.message
    if (error?.response?.data?.error) return error.response.data.error
    return 'An unexpected error occurred'
  },

  logError: (error, context = '') => {
    const errorMessage = errorUtils.getErrorMessage(error)
    const timestamp = new Date().toISOString()
    
    console.error(`[${timestamp}] ${context}: ${errorMessage}`, error)
    
    // You can extend this to send errors to a logging service
    // Example: sendToErrorReporting({ error, context, timestamp })
  },

  createErrorObject: (message, code, details = {}) => {
    return {
      error: message,
      error_code: code,
      timestamp: new Date().toISOString(),
      details,
    }
  },
}