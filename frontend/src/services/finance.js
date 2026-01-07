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

  // ==================== EMPLOYMENT CONTRACTS ====================
  async getContracts(params = {}) {
    const response = await api.get('/finance/contracts/', { params });
    return response.data;
  }

  async getContract(id) {
    const response = await api.get(`/finance/contracts/${id}/`);
    return response.data;
  }

  async createContract(data) {
    const response = await api.post('/finance/contracts/', data);
    return response.data;
  }

  async updateContract(id, data) {
    const response = await api.patch(`/finance/contracts/${id}/`, data);
    return response.data;
  }

  async deleteContract(id) {
    const response = await api.delete(`/finance/contracts/${id}/`);
    return response.data;
  }

  async calculateEstimatedSalary(id, data = {}) {
    const response = await api.post(`/finance/contracts/${id}/calculate_salary/`, data);
    return response.data;
  }

  // ==================== PAYROLL PERIODS ====================
  async getPayrollPeriods(params = {}) {
    const response = await api.get('/finance/payroll/periods/', { params });
    return response.data;
  }

  async getPayrollPeriod(id) {
    const response = await api.get(`/finance/payroll/periods/${id}/`);
    return response.data;
  }

  async createPayrollPeriod(data) {
    const response = await api.post('/finance/payroll/periods/', data);
    return response.data;
  }

  async updatePayrollPeriod(id, data) {
    const response = await api.patch(`/finance/payroll/periods/${id}/`, data);
    return response.data;
  }

  async generatePayrollEntries(id, data = {}) {
    const response = await api.post(`/finance/payroll/periods/${id}/generate/`, data);
    return response.data;
  }

  async approvePayrollPeriod(id) {
    const response = await api.post(`/finance/payroll/periods/${id}/approve/`);
    return response.data;
  }

  async processPayrollPayments(id) {
    const response = await api.post(`/finance/payroll/periods/${id}/process_payments/`);
    return response.data;
  }

  // ==================== PAYROLL ENTRIES ====================
  async getPayrollEntries(params = {}) {
    const response = await api.get('/finance/payroll/entries/', { params });
    return response.data;
  }

  async updatePayrollEntry(id, data) {
    const response = await api.patch(`/finance/payroll/entries/${id}/`, data);
    return response.data;
  }

  async markPayrollEntryPaid(id, data = {}) {
    const response = await api.post(`/finance/payroll/entries/${id}/mark_paid/`, data);
    return response.data;
  }

  // ==================== EXPENSE RECORDS ====================
  async getExpenses(params = {}) {
    const response = await api.get('/finance/expenses/', { params });
    return response.data;
  }

  async getExpense(id) {
    const response = await api.get(`/finance/expenses/${id}/`);
    return response.data;
  }

  async createExpense(data) {
    // Note: expenses often use multipart/form-data for attachments
    const isFormData = data instanceof FormData;
    const response = await api.post('/finance/expenses/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  }

  async updateExpense(id, data) {
    const isFormData = data instanceof FormData;
    const response = await api.patch(`/finance/expenses/${id}/`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  }

  async approveExpense(id) {
    const response = await api.post(`/finance/expenses/${id}/approve/`);
    return response.data;
  }

  async rejectExpense(id, data = {}) {
    const response = await api.post(`/finance/expenses/${id}/reject/`, data);
    return response.data;
  }

  async recordExpensePayment(id, data) {
    const response = await api.post(`/finance/expenses/${id}/record_payment/`, data);
    return response.data;
  }

  async batchApproveExpenses(data) {
    const response = await api.post('/finance/expenses/batch_approve/', data);
    return response.data;
  }

  // ==================== BUDGETS ====================
  async getBudgetCategories(params = {}) {
    const response = await api.get('/finance/budgets/categories/', { params });
    return response.data;
  }

  async getBudgets(params = {}) {
    const response = await api.get('/finance/budgets/allocations/', { params });
    return response.data;
  }

  async getBudget(id) {
    const response = await api.get(`/finance/budgets/allocations/${id}/`);
    return response.data;
  }

  async createBudget(data) {
    const response = await api.post('/finance/budgets/allocations/', data);
    return response.data;
  }

  async updateBudget(id, data) {
    const response = await api.patch(`/finance/budgets/allocations/${id}/`, data);
    return response.data;
  }

  async getBudgetUtilization(id) {
    const response = await api.get(`/finance/budgets/allocations/${id}/utilization/`);
    return response.data;
  }

  // ==================== REPORTS & ANALYTICS ====================
  async getDashboardData(params = {}) {
    const response = await api.get('/finance/reports/dashboard/', { params });
    return response.data;
  }

  async getCashFlow(params = {}) {
    const response = await api.get('/finance/reports/cash_flow/', { params });
    return response.data;
  }

  async getIncomeStatement(params = {}) {
    const response = await api.get('/finance/reports/income_statement/', { params });
    return response.data;
  }

  async getPayrollSummary(params = {}) {
    const response = await api.get('/finance/reports/payroll_summary/', { params });
    return response.data;
  }

  async getExpenseBreakdown(params = {}) {
    const response = await api.get('/finance/reports/expense_breakdown/', { params });
    return response.data;
  }

  async getBudgetTracking(params = {}) {
    const response = await api.get('/finance/reports/budget_tracking/', { params });
    return response.data;
  }

  async getFuelAnalytics(params = {}) {
    const response = await api.get('/finance/reports/fuel_analytics/', { params });
    return response.data;
  }

  async getFuelTracking(params = {}) {
    const response = await api.get('/finance/reports/fuel_tracking/', { params });
    return response.data;
  }

  async getVehicles() {
    const response = await api.get('/schools/vehicles/');
    return response.data;
  }

  async createFuelRefill(vehicleId, data) {
    const response = await api.post(`/schools/vehicles/${vehicleId}/gasoil-records/`, data);
    return response.data;
  }

  async getTransactions(params = {}) {
    const response = await api.get('/finance/transactions/', { params });
    return response.data;
  }
}

export const financeService = new FinanceService();
export default financeService;
