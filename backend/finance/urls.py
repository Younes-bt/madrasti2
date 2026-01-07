from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FeeCategoryViewSet, FeeStructureViewSet, InvoiceViewSet, PaymentViewSet,
    EmploymentContractViewSet, PayrollPeriodViewSet, PayrollEntryViewSet,
    ExpenseRecordViewSet, BudgetCategoryViewSet, BudgetViewSet,
    FinancialTransactionViewSet, ReportsViewSet
)

router = DefaultRouter()
# Student fee management (existing)
router.register(r'fee-categories', FeeCategoryViewSet)
router.register(r'fee-structures', FeeStructureViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'payments', PaymentViewSet)

# Payroll management (new)
router.register(r'contracts', EmploymentContractViewSet, basename='contract')
router.register(r'payroll/periods', PayrollPeriodViewSet, basename='payroll-period')
router.register(r'payroll/entries', PayrollEntryViewSet, basename='payroll-entry')

# Expense & Budget management (new)
router.register(r'expenses', ExpenseRecordViewSet, basename='expense')
router.register(r'budgets/categories', BudgetCategoryViewSet, basename='budget-category')
router.register(r'budgets/allocations', BudgetViewSet, basename='budget')

# Financial Transactions & Reports (new)
router.register(r'transactions', FinancialTransactionViewSet, basename='transaction')
router.register(r'reports', ReportsViewSet, basename='reports')

urlpatterns = [
    path('', include(router.urls)),
]
