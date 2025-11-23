import api, { apiMethods } from './api'
import handleError from './errorHandler'

const reportsService = {
  async fetchStudentPerformance(params = {}) {
    try {
      const response = await api.get('/reports/student-performance/', { params })
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  },
  async fetchTeacherPerformance(params = {}) {
    try {
      const response = await api.get('/reports/teacher-performance/', { params })
      return response.data
    } catch (error) {
      handleError(error)
      throw error
    }
  }
}

export default reportsService
export { apiMethods }
