import api from './api'

export const labService = {
  async getTools(params = {}) {
    try {
      const response = await api.get('/lab/tools/', { params })
      return {
        success: true,
        data: response.data.results || response.data,
        total: response.data.count || response.data.length
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch lab tools'
      }
    }
  },

  async getToolById(toolId) {
    try {
      const response = await api.get(`/lab/tools/${toolId}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Failed to fetch tool' }
    }
  },

  async getRecentTools() {
    try {
      const response = await api.get('/lab/tools/recent/')
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch recent tools' }
    }
  },

  async startUsageSession(toolId, context = {}) {
    try {
      const response = await api.post('/lab/usage/start/', {
        tool_id: toolId,
        device_type: context.device_type || 'desktop'
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: 'Failed to start session' }
    }
  },

  async endUsageSession(sessionId, duration, interactionData = {}) {
    try {
      const response = await api.put(`/lab/usage/${sessionId}/end/`, {
        duration_seconds: duration,
        interaction_data: interactionData
      })
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: 'Failed to end session' }
    }
  },

  async getAssignments(params = {}) {
    try {
      const response = await api.get('/lab/assignments/', { params })
      return { success: true, data: response.data.results || response.data }
    } catch (error) {
      return { success: false, error: 'Failed to fetch assignments' }
    }
  },

  async createAssignment(assignmentData) {
    try {
      const response = await api.post('/lab/assignments/', assignmentData)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: 'Failed to create assignment' }
    }
  }
}

export default labService
