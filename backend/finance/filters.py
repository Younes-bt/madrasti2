"""
Custom FilterSets for advanced filtering in the finance app.
"""
from django_filters import FilterSet, CharFilter, DateFilter, NumberFilter
from .models import FinancialTransaction, ExpenseRecord


class FinancialTransactionFilter(FilterSet):
    """
    Advanced filtering for FinancialTransaction model.
    Supports filtering by type, categories, date ranges, amount ranges, and more.
    """
    # Date range filters
    transaction_date_after = DateFilter(field_name='transaction_date', lookup_expr='gte')
    transaction_date_before = DateFilter(field_name='transaction_date', lookup_expr='lte')
    month = CharFilter(method='filter_by_month')

    # Amount range filters
    min_amount = NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = NumberFilter(field_name='amount', lookup_expr='lte')

    class Meta:
        model = FinancialTransaction
        fields = {
            'transaction_type': ['exact'],
            'income_category': ['exact'],
            'expense_category': ['exact'],
            'status': ['exact'],
            'academic_year': ['exact'],
            'payment_method': ['exact'],
        }

    def filter_by_month(self, queryset, name, value):
        """
        Filter by month in YYYY-MM format.
        Example: ?month=2024-09
        """
        try:
            from datetime import datetime
            year, month = value.split('-')
            year_int = int(year)
            month_int = int(month)

            # Create start and end dates for the month
            start_date = datetime(year_int, month_int, 1).date()
            if month_int == 12:
                end_date = datetime(year_int + 1, 1, 1).date()
            else:
                end_date = datetime(year_int, month_int + 1, 1).date()

            return queryset.filter(transaction_date__gte=start_date, transaction_date__lt=end_date)
        except (ValueError, AttributeError):
            return queryset


class ExpenseRecordFilter(FilterSet):
    """
    Advanced filtering for ExpenseRecord model.
    """
    # Date range filters
    expense_date_after = DateFilter(field_name='expense_date', lookup_expr='gte')
    expense_date_before = DateFilter(field_name='expense_date', lookup_expr='lte')
    due_date_after = DateFilter(field_name='due_date', lookup_expr='gte')
    due_date_before = DateFilter(field_name='due_date', lookup_expr='lte')

    # Amount range filters
    min_amount = NumberFilter(field_name='amount', lookup_expr='gte')
    max_amount = NumberFilter(field_name='amount', lookup_expr='lte')

    # Text search
    vendor_search = CharFilter(field_name='vendor_name', lookup_expr='icontains')

    class Meta:
        model = ExpenseRecord
        fields = {
            'category': ['exact'],
            'status': ['exact'],
            'payment_status': ['exact'],
            'academic_year': ['exact'],
            'budget_category': ['exact'],
            'requested_by': ['exact'],
            'approved_by': ['exact'],
        }
