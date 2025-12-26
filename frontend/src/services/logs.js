import { apiMethods } from './api'

const basePath = 'activity-logs/'

const list = async (params = {}) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  const url = searchParams.toString() ? `${basePath}?${searchParams.toString()}` : basePath
  return apiMethods.get(url)
}

export default {
  list
}
