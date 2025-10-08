
import { apiMethods } from './api.js'

const DEFAULT_HISTORY_LIMIT = 100
const DEFAULT_WALLET_LIMIT = 100

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) {
    return {
      results: response,
      count: response.length,
      next: null,
      previous: null
    }
  }

  return {
    results: response?.results ?? [],
    count: response?.count ?? response?.results?.length ?? 0,
    next: response?.next ?? null,
    previous: response?.previous ?? null
  }
}

const buildError = (error, fallbackMessage) => {
  if (!error.userMessage) {
    error.userMessage = fallbackMessage
  }
  return error
}

class RewardsService {
  async getMyWallet() {
    try {
      return await apiMethods.get('homework/student-wallets/my_wallet/')
    } catch (error) {
      throw buildError(error, 'Unable to load wallet information.')
    }
  }

  async getWallets(params = {}) {
    const query = {
      page_size: DEFAULT_WALLET_LIMIT,
      ordering: '-updated_at',
      ...params
    }

    try {
      const response = await apiMethods.get('homework/student-wallets/', { params: query })
      return normalizeListResponse(response)
    } catch (error) {
      throw buildError(error, 'Unable to load student wallets.')
    }
  }

  async getWalletByStudent(studentId, params = {}) {
    if (!studentId) {
      return null
    }

    const query = {
      student: studentId,
      ...params
    }

    const list = await this.getWallets(query)
    const numericId = Number(studentId)
    return list.results.find((wallet) => Number(wallet?.student?.id) === numericId) ?? null
  }

  async getTransactions(params = {}) {
    const query = {
      ordering: '-created_at',
      page_size: DEFAULT_HISTORY_LIMIT,
      ...params
    }

    try {
      const response = await apiMethods.get('homework/reward-transactions/', { params: query })
      return normalizeListResponse(response)
    } catch (error) {
      throw buildError(error, 'Unable to load reward history.')
    }
  }

  async getTransactionsByStudent(studentId, params = {}) {
    if (!studentId) {
      return { results: [], count: 0, next: null, previous: null }
    }

    const query = {
      student: studentId,
      ...params
    }

    const list = await this.getTransactions(query)
    const numericId = Number(studentId)
    const filtered = list.results.filter((transaction) => Number(transaction?.student?.id) === numericId)

    return {
      ...list,
      results: filtered,
      count: filtered.length
    }
  }
}

const rewardsService = new RewardsService()
export default rewardsService
