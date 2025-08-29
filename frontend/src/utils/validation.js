import { VALIDATION_RULES, FILE_CONFIG } from './constants'

/**
 * Comprehensive validation utilities for forms and data
 */

/**
 * Basic validation functions
 */
export const validators = {
  /**
   * Check if value is required (not empty)
   */
  required: (value, message = 'This field is required') => {
    const isValid = value !== null && value !== undefined && value.toString().trim() !== ''
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate email format
   */
  email: (value, message = 'Please enter a valid email address') => {
    if (!value) return { isValid: true, message: '' }
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = regex.test(value) && value.length <= VALIDATION_RULES.EMAIL.MAX_LENGTH
    
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate password strength
   */
  password: (value, options = {}) => {
    const rules = { ...VALIDATION_RULES.PASSWORD, ...options }
    
    if (!value) return { isValid: false, message: 'Password is required' }

    const checks = {
      minLength: value.length >= rules.MIN_LENGTH,
      maxLength: value.length <= rules.MAX_LENGTH,
      hasUppercase: rules.REQUIRE_UPPERCASE ? /[A-Z]/.test(value) : true,
      hasLowercase: rules.REQUIRE_LOWERCASE ? /[a-z]/.test(value) : true,
      hasNumbers: rules.REQUIRE_NUMBERS ? /\d/.test(value) : true,
      hasSpecialChars: rules.REQUIRE_SPECIAL_CHARS ? /[!@#$%^&*(),.?":{}|<>]/.test(value) : true,
    }

    const isValid = Object.values(checks).every(Boolean)
    const messages = []

    if (!checks.minLength) messages.push(`At least ${rules.MIN_LENGTH} characters`)
    if (!checks.maxLength) messages.push(`No more than ${rules.MAX_LENGTH} characters`)
    if (!checks.hasUppercase) messages.push('One uppercase letter')
    if (!checks.hasLowercase) messages.push('One lowercase letter')
    if (!checks.hasNumbers) messages.push('One number')
    if (!checks.hasSpecialChars) messages.push('One special character')

    return {
      isValid,
      message: messages.length > 0 ? `Password must contain: ${messages.join(', ')}` : '',
      checks,
    }
  },

  /**
   * Validate password confirmation
   */
  confirmPassword: (value, originalPassword, message = 'Passwords do not match') => {
    const isValid = value === originalPassword
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate minimum length
   */
  minLength: (value, minLength, message = '') => {
    if (!value) return { isValid: true, message: '' }
    
    const isValid = value.length >= minLength
    const defaultMessage = `Must be at least ${minLength} characters long`
    
    return {
      isValid,
      message: isValid ? '' : (message || defaultMessage),
    }
  },

  /**
   * Validate maximum length
   */
  maxLength: (value, maxLength, message = '') => {
    if (!value) return { isValid: true, message: '' }
    
    const isValid = value.length <= maxLength
    const defaultMessage = `Must be no more than ${maxLength} characters long`
    
    return {
      isValid,
      message: isValid ? '' : (message || defaultMessage),
    }
  },

  /**
   * Validate phone number
   */
  phone: (value, message = 'Please enter a valid phone number') => {
    if (!value) return { isValid: true, message: '' }
    
    const cleanPhone = value.replace(/\D/g, '')
    const rules = VALIDATION_RULES.PHONE
    const isValid = cleanPhone.length >= rules.MIN_LENGTH && cleanPhone.length <= rules.MAX_LENGTH
    
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate number range
   */
  numberRange: (value, min, max, message = '') => {
    if (!value && value !== 0) return { isValid: true, message: '' }
    
    const num = Number(value)
    const isValid = !isNaN(num) && num >= min && num <= max
    const defaultMessage = `Must be between ${min} and ${max}`
    
    return {
      isValid,
      message: isValid ? '' : (message || defaultMessage),
    }
  },

  /**
   * Validate minimum number
   */
  min: (value, min, message = '') => {
    if (!value && value !== 0) return { isValid: true, message: '' }
    
    const num = Number(value)
    const isValid = !isNaN(num) && num >= min
    const defaultMessage = `Must be at least ${min}`
    
    return {
      isValid,
      message: isValid ? '' : (message || defaultMessage),
    }
  },

  /**
   * Validate maximum number
   */
  max: (value, max, message = '') => {
    if (!value && value !== 0) return { isValid: true, message: '' }
    
    const num = Number(value)
    const isValid = !isNaN(num) && num <= max
    const defaultMessage = `Must be no more than ${max}`
    
    return {
      isValid,
      message: isValid ? '' : (message || defaultMessage),
    }
  },

  /**
   * Validate URL format
   */
  url: (value, message = 'Please enter a valid URL') => {
    if (!value) return { isValid: true, message: '' }
    
    try {
      new URL(value)
      return { isValid: true, message: '' }
    } catch {
      return { isValid: false, message }
    }
  },

  /**
   * Validate date format and range
   */
  date: (value, options = {}) => {
    if (!value) return { isValid: true, message: '' }
    
    const date = new Date(value)
    const isValidDate = !isNaN(date.getTime())
    
    if (!isValidDate) {
      return { isValid: false, message: 'Please enter a valid date' }
    }

    const today = new Date()
    const { minDate, maxDate, allowPast = true, allowFuture = true } = options

    if (!allowPast && date < today) {
      return { isValid: false, message: 'Date cannot be in the past' }
    }

    if (!allowFuture && date > today) {
      return { isValid: false, message: 'Date cannot be in the future' }
    }

    if (minDate && date < new Date(minDate)) {
      return { isValid: false, message: `Date must be after ${minDate}` }
    }

    if (maxDate && date > new Date(maxDate)) {
      return { isValid: false, message: `Date must be before ${maxDate}` }
    }

    return { isValid: true, message: '' }
  },

  /**
   * Validate time format
   */
  time: (value, message = 'Please enter a valid time (HH:MM)') => {
    if (!value) return { isValid: true, message: '' }
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    const isValid = timeRegex.test(value)
    
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate against regex pattern
   */
  pattern: (value, regex, message = 'Invalid format') => {
    if (!value) return { isValid: true, message: '' }
    
    const isValid = regex.test(value)
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate file type and size
   */
  file: (file, options = {}) => {
    if (!file) return { isValid: true, message: '' }

    const {
      allowedTypes = [],
      maxSize = Infinity,
      minSize = 0,
      maxWidth = Infinity,
      maxHeight = Infinity,
    } = options

    // Check file type
    if (allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        return {
          isValid: false,
          message: `File type must be one of: ${allowedTypes.join(', ')}`,
        }
      }
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: `File size must be less than ${formatFileSize(maxSize)}`,
      }
    }

    if (file.size < minSize) {
      return {
        isValid: false,
        message: `File size must be at least ${formatFileSize(minSize)}`,
      }
    }

    // For images, check dimensions (this would need to be handled asynchronously)
    if (file.type.startsWith('image/') && (maxWidth < Infinity || maxHeight < Infinity)) {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          if (img.width > maxWidth || img.height > maxHeight) {
            resolve({
              isValid: false,
              message: `Image dimensions must be no larger than ${maxWidth}x${maxHeight}px`,
            })
          } else {
            resolve({ isValid: true, message: '' })
          }
        }
        img.onerror = () => {
          resolve({ isValid: false, message: 'Invalid image file' })
        }
        img.src = URL.createObjectURL(file)
      })
    }

    return { isValid: true, message: '' }
  },

  /**
   * Custom validator function
   */
  custom: (value, validatorFn, message = 'Invalid value') => {
    try {
      const isValid = validatorFn(value)
      return {
        isValid,
        message: isValid ? '' : message,
      }
    } catch (error) {
      return {
        isValid: false,
        message: 'Validation error',
      }
    }
  },
}

/**
 * Composite validation functions
 */
export const compositeValidators = {
  /**
   * Validate full name (first and last name)
   */
  fullName: (value, message = 'Please enter a valid full name') => {
    if (!value) return { isValid: false, message: 'Name is required' }
    
    const nameParts = value.trim().split(' ').filter(part => part.length > 0)
    const isValid = nameParts.length >= 2 && nameParts.every(part => part.length >= 2)
    
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate Moroccan phone number
   */
  moroccanPhone: (value, message = 'Please enter a valid Moroccan phone number') => {
    if (!value) return { isValid: true, message: '' }
    
    const cleanPhone = value.replace(/\D/g, '')
    const moroccanRegex = /^(?:\+212|00212|0)?[5-7][0-9]{8}$/
    const isValid = moroccanRegex.test(cleanPhone)
    
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate academic year format (e.g., "2024-2025")
   */
  academicYear: (value, message = 'Please enter a valid academic year (e.g., 2024-2025)') => {
    if (!value) return { isValid: true, message: '' }
    
    const academicYearRegex = /^\d{4}-\d{4}$/
    const isValid = academicYearRegex.test(value)
    
    if (isValid) {
      const [startYear, endYear] = value.split('-').map(Number)
      const yearDifference = endYear - startYear
      
      if (yearDifference !== 1) {
        return {
          isValid: false,
          message: 'Academic year must be consecutive (e.g., 2024-2025)',
        }
      }
    }
    
    return {
      isValid,
      message: isValid ? '' : message,
    }
  },

  /**
   * Validate grade number based on educational level
   */
  gradeNumber: (value, educationalLevel, message = 'Invalid grade number for this level') => {
    if (!value && value !== 0) return { isValid: true, message: '' }
    
    const gradeRanges = {
      PRIMARY: [1, 6],
      MIDDLE: [7, 9], 
      HIGH: [10, 12],
    }
    
    const [min, max] = gradeRanges[educationalLevel] || [1, 12]
    const grade = Number(value)
    const isValid = !isNaN(grade) && grade >= min && grade <= max
    
    return {
      isValid,
      message: isValid ? '' : `Grade must be between ${min} and ${max} for ${educationalLevel} level`,
    }
  },
}

/**
 * Form validation utility
 */
export class FormValidator {
  constructor(rules = {}) {
    this.rules = rules
    this.errors = {}
  }

  /**
   * Add validation rule for a field
   */
  addRule(fieldName, validationRules) {
    this.rules[fieldName] = validationRules
  }

  /**
   * Validate a single field
   */
  validateField(fieldName, value) {
    const fieldRules = this.rules[fieldName] || []
    let fieldErrors = []

    for (const rule of fieldRules) {
      const result = rule.validator(value, ...(rule.params || []))
      
      // Handle async validation
      if (result instanceof Promise) {
        return result.then(asyncResult => {
          if (!asyncResult.isValid) {
            fieldErrors.push(asyncResult.message)
          }
          this.errors[fieldName] = fieldErrors
          return { isValid: fieldErrors.length === 0, errors: fieldErrors }
        })
      }
      
      if (!result.isValid) {
        fieldErrors.push(result.message)
        if (rule.stopOnFirst) break
      }
    }

    this.errors[fieldName] = fieldErrors
    return { isValid: fieldErrors.length === 0, errors: fieldErrors }
  }

  /**
   * Validate all fields in form data
   */
  validate(formData) {
    const results = {}
    let isFormValid = true

    for (const fieldName in this.rules) {
      const fieldResult = this.validateField(fieldName, formData[fieldName])
      
      // Handle async validation
      if (fieldResult instanceof Promise) {
        return fieldResult.then(asyncResult => {
          results[fieldName] = asyncResult
          if (!asyncResult.isValid) isFormValid = false
          
          return {
            isValid: isFormValid,
            errors: this.errors,
            results,
          }
        })
      }
      
      results[fieldName] = fieldResult
      if (!fieldResult.isValid) {
        isFormValid = false
      }
    }

    return {
      isValid: isFormValid,
      errors: this.errors,
      results,
    }
  }

  /**
   * Get error for specific field
   */
  getFieldError(fieldName) {
    return this.errors[fieldName] || []
  }

  /**
   * Check if field has errors
   */
  hasFieldError(fieldName) {
    return (this.errors[fieldName] || []).length > 0
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = {}
  }

  /**
   * Clear errors for specific field
   */
  clearFieldError(fieldName) {
    delete this.errors[fieldName]
  }
}

/**
 * Predefined validation rule sets
 */
export const validationRules = {
  // User registration rules
  userRegistration: {
    email: [
      { validator: validators.required },
      { validator: validators.email },
    ],
    password: [
      { validator: validators.required },
      { validator: validators.password },
    ],
    confirmPassword: [
      { validator: validators.required },
      // Note: confirmPassword validation requires access to original password
    ],
    firstName: [
      { validator: validators.required },
      { validator: validators.minLength, params: [2] },
      { validator: validators.maxLength, params: [50] },
    ],
    lastName: [
      { validator: validators.required },
      { validator: validators.minLength, params: [2] },
      { validator: validators.maxLength, params: [50] },
    ],
    phone: [
      { validator: compositeValidators.moroccanPhone },
    ],
    dateOfBirth: [
      { validator: validators.date, params: [{ allowFuture: false }] },
    ],
  },

  // Assignment creation rules
  assignmentCreation: {
    title: [
      { validator: validators.required },
      { validator: validators.minLength, params: [3] },
      { validator: validators.maxLength, params: [200] },
    ],
    description: [
      { validator: validators.maxLength, params: [1000] },
    ],
    dueDate: [
      { validator: validators.required },
      { validator: validators.date, params: [{ allowPast: false }] },
    ],
    timeLimit: [
      { validator: validators.numberRange, params: [5, 300] },
    ],
    passingScore: [
      { validator: validators.numberRange, params: [0, 100] },
    ],
  },

  // School configuration rules
  schoolConfig: {
    name: [
      { validator: validators.required },
      { validator: validators.minLength, params: [3] },
      { validator: validators.maxLength, params: [200] },
    ],
    email: [
      { validator: validators.required },
      { validator: validators.email },
    ],
    phone: [
      { validator: validators.required },
      { validator: compositeValidators.moroccanPhone },
    ],
    address: [
      { validator: validators.required },
      { validator: validators.minLength, params: [10] },
    ],
  },
}

/**
 * File validation helpers
 */
export const fileValidation = {
  validateImage: (file) => {
    return validators.file(file, {
      allowedTypes: FILE_CONFIG.IMAGES.FORMATS,
      maxSize: FILE_CONFIG.IMAGES.MAX_SIZE,
    })
  },

  validateDocument: (file) => {
    return validators.file(file, {
      allowedTypes: FILE_CONFIG.DOCUMENTS.FORMATS,
      maxSize: FILE_CONFIG.DOCUMENTS.MAX_SIZE,
    })
  },

  validateVideo: (file) => {
    return validators.file(file, {
      allowedTypes: FILE_CONFIG.VIDEOS.FORMATS,
      maxSize: FILE_CONFIG.VIDEOS.MAX_SIZE,
    })
  },

  validateAudio: (file) => {
    return validators.file(file, {
      allowedTypes: FILE_CONFIG.AUDIO.FORMATS,
      maxSize: FILE_CONFIG.AUDIO.MAX_SIZE,
    })
  },
}

/**
 * Utility functions
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Export convenience functions
export const validateForm = (formData, rules) => {
  const validator = new FormValidator(rules)
  return validator.validate(formData)
}

export const validateField = (value, rules) => {
  for (const rule of rules) {
    const result = rule.validator(value, ...(rule.params || []))
    if (!result.isValid) {
      return result
    }
  }
  return { isValid: true, message: '' }
}