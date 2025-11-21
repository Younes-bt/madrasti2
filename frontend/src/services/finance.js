import api from './api';

class FinanceService {
  // ==================== FEE CATEGORIES ====================
  async getFeeCategories() {
    const response = await api.get('/finance/fee-categories/');
    return response.data;
  }

  async createFeeCategory(data) {
    const response = await api.post('/finance/fee-categories/', data);
    return response.data;
  }

  async updateFeeCategory(id, data) {
    const response = await api.patch(`/finance/fee-categories/${id}/`, data);
    return response.data;
  }

  async deleteFeeCategory(id) {
    const response = await api.delete(`/finance/fee-categories/${id}/`);
    return response.data;
  }

  // ==================== FEE STRUCTURES ====================
  async getFeeStructures(params = {}) {
    const response = await api.get('/finance/fee-structures/', { params });
    return response.data;
  }

  async createFeeStructure(data) {
    const response = await api.post('/finance/fee-structures/', data);
    return response.data;
  }

  async updateFeeStructure(id, data) {
    const response = await api.patch(`/finance/fee-structures/${id}/`, data);
    return response.data;
  }

  async deleteFeeStructure(id) {
    const response = await api.delete(`/finance/fee-structures/${id}/`);
    return response.data;
  }

  // ==================== INVOICES ====================
  async getInvoices(params = {}) {
    const response = await api.get('/finance/invoices/', { params });
    return response.data;
  }

  async getInvoice(id) {
    const response = await api.get(`/finance/invoices/${id}/`);
    return response.data;
  }

  async createInvoice(data) {
    const response = await api.post('/finance/invoices/', data);
    return response.data;
  }

  async generateBulkInvoices(data) {
    const response = await api.post('/finance/invoices/generate_bulk/', data);
    return response.data;
  }

  // ==================== PAYMENTS ====================
  async getPayments(params = {}) {
    const response = await api.get('/finance/payments/', { params });
    return response.data;
  }

  async createPayment(data) {
    const response = await api.post('/finance/payments/', data);
    return response.data;
  }
}

export const financeService = new FinanceService();
export default financeService;
