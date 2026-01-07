/**
 * JWT Utility Functions
 * Handles JWT token decoding and validation
 */

/**
 * Decode JWT token payload without verification
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  if (!token || typeof token !== 'string') {
    return null
  }

  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.')
    
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (middle part)
    const payload = parts[1]
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    
    // Decode base64 and parse JSON
    const decoded = JSON.parse(atob(paddedPayload))
    
    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} True if expired, false if valid
 */
export const isJWTExpired = (token) => {
  const decoded = decodeJWT(token)
  
  if (!decoded || !decoded.exp) {
    return true
  }
  
  // JWT exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000)
  
  return decoded.exp < currentTime
}

/**
 * Extract user information from JWT token
 * @param {string} token - JWT access token
 * @returns {Object|null} User object or null if invalid
 */
export const extractUserFromJWT = (token) => {
  const decoded = decodeJWT(token)
  
  if (!decoded) {
    return null
  }
  
  // Extract user information from JWT payload
  return {
    id: decoded.user_id,
    email: decoded.email || '',
    full_name: decoded.full_name || '',
    first_name: decoded.first_name || '',
    last_name: decoded.last_name || '',
    role: decoded.role || 'STUDENT',
    position: decoded.position || null,
    permissions: decoded.permissions || [],
    exp: decoded.exp,
    iat: decoded.iat
  }
}

/**
 * Get user role from JWT token
 * @param {string} token - JWT access token
 * @returns {string|null} User role or null if invalid
 */
export const getRoleFromJWT = (token) => {
  const user = extractUserFromJWT(token)
  return user?.role || null
}