from django.contrib import admin
from django.utils.html import format_html
from .models import (
    FeeCategory, FeeStructure, Invoice, InvoiceItem, Payment,
    EmploymentContract, FinancialTransaction, PayrollPeriod, PayrollEntry,
    ExpenseRecord, BudgetCategory, Budget
)


# ==================== EXISTING MODELS ====================

@admin.register(FeeCategory)
class FeeCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'fee_type', 'description')
    list_filter = ('fee_type',)
    search_fields = ('name', 'description')


@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ('academic_year', 'grade', 'category', 'amount')
    list_filter = ('academic_year', 'grade', 'category')
    search_fields = ('grade__name', 'category__name')


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1
    fields = ('description', 'amount')


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    fields = ('amount', 'date', 'method', 'transaction_id', 'recorded_by')
    readonly_fields = ('date', 'recorded_by')


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_name', 'academic_year', 'month', 'total_amount', 'paid_amount', 'status_badge', 'due_date')
    list_filter = ('status', 'academic_year', 'issue_date', 'due_date')
    search_fields = ('student__first_name', 'student__last_name', 'student__email')
    readonly_fields = ('issue_date', 'total_amount', 'paid_amount')
    inlines = [InvoiceItemInline, PaymentInline]
    date_hierarchy = 'issue_date'

    def student_name(self, obj):
        return obj.student.get_full_name()
    student_name.short_description = 'Student'

    def status_badge(self, obj):
        colors = {
            'DRAFT': 'gray',
            'ISSUED': 'blue',
            'PARTIALLY_PAID': 'orange',
            'PAID': 'green',
            'OVERDUE': 'red',
            'CANCELLED': 'black',
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'invoice_id', 'amount', 'date', 'method', 'recorded_by')
    list_filter = ('method', 'date')
    search_fields = ('invoice__student__first_name', 'invoice__student__last_name', 'transaction_id')
    readonly_fields = ('date', 'recorded_by')
    date_hierarchy = 'date'

    def invoice_id(self, obj):
        return f"INV-{obj.invoice.id}"
    invoice_id.short_description = 'Invoice'


# ==================== NEW FINANCIAL MANAGEMENT MODELS ====================

@admin.register(EmploymentContract)
class EmploymentContractAdmin(admin.ModelAdmin):
    list_display = ('contract_number', 'employee_name', 'contract_type', 'base_amount', 'start_date', 'end_date', 'is_active_badge')
    list_filter = ('contract_type', 'is_active', 'start_date', 'created_at')
    search_fields = ('contract_number', 'employee__first_name', 'employee__last_name', 'employee__email')
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    date_hierarchy = 'start_date'
    fieldsets = (
        ('Basic Information', {
            'fields': ('employee', 'contract_type', 'contract_number', 'start_date', 'end_date', 'is_active')
        }),
        ('Payment Terms', {
            'fields': ('base_amount', 'currency', 'hours_per_week', 'lessons_per_week')
        }),
        ('Allowances', {
            'fields': ('transportation_allowance', 'housing_allowance', 'other_allowances')
        }),
        ('Deductions', {
            'fields': ('social_security_rate', 'tax_exemption_amount')
        }),
        ('Metadata', {
            'fields': ('notes', 'created_by', 'created_at', 'updated_at')
        }),
    )

    def employee_name(self, obj):
        return obj.employee.get_full_name()
    employee_name.short_description = 'Employee'

    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">✓ Active</span>')
        return format_html('<span style="color: red;">✗ Inactive</span>')
    is_active_badge.short_description = 'Status'

    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(FinancialTransaction)
class FinancialTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'transaction_type_badge', 'category_display', 'amount', 'transaction_date', 'academic_year', 'status_badge')
    list_filter = ('transaction_type', 'status', 'transaction_date', 'academic_year', 'expense_category', 'income_category')
    search_fields = ('description', 'reference_number')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'transaction_date'
    fieldsets = (
        ('Transaction Details', {
            'fields': ('transaction_type', 'income_category', 'expense_category', 'amount', 'currency', 'transaction_date', 'academic_year')
        }),
        ('Related Records', {
            'fields': ('invoice', 'payroll_entry', 'gasoil_record', 'expense_record')
        }),
        ('Description', {
            'fields': ('description', 'notes')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'reference_number', 'status')
        }),
        ('Approval', {
            'fields': ('recorded_by', 'approved_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

    def transaction_type_badge(self, obj):
        colors = {'INCOME': 'green', 'EXPENSE': 'red'}
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.transaction_type, 'gray'),
            obj.get_transaction_type_display()
        )
    transaction_type_badge.short_description = 'Type'

    def category_display(self, obj):
        if obj.transaction_type == 'INCOME':
            return obj.get_income_category_display() if obj.income_category else '-'
        return obj.get_expense_category_display() if obj.expense_category else '-'
    category_display.short_description = 'Category'

    def status_badge(self, obj):
        colors = {
            'PENDING': 'orange',
            'APPROVED': 'blue',
            'COMPLETED': 'green',
            'CANCELLED': 'red',
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'


class PayrollEntryInline(admin.TabularInline):
    model = PayrollEntry
    extra = 0
    fields = ('employee', 'gross_salary', 'total_deductions', 'net_salary', 'is_paid')
    readonly_fields = ('gross_salary', 'total_deductions', 'net_salary')
    can_delete = False


@admin.register(PayrollPeriod)
class PayrollPeriodAdmin(admin.ModelAdmin):
    list_display = ('id', 'period_display', 'academic_year', 'payment_date', 'employee_count', 'total_net', 'status_badge')
    list_filter = ('status', 'academic_year', 'period_start')
    search_fields = ('notes',)
    readonly_fields = ('total_gross', 'total_deductions', 'total_net', 'employee_count', 'created_at', 'updated_at')
    date_hierarchy = 'period_start'
    inlines = [PayrollEntryInline]
    fieldsets = (
        ('Period Information', {
            'fields': ('academic_year', 'period_start', 'period_end', 'payment_date', 'status')
        }),
        ('Summary', {
            'fields': ('employee_count', 'total_gross', 'total_deductions', 'total_net')
        }),
        ('Metadata', {
            'fields': ('notes', 'created_by', 'approved_by', 'created_at', 'updated_at')
        }),
    )

    def period_display(self, obj):
        return f"{obj.period_start} to {obj.period_end}"
    period_display.short_description = 'Period'

    def status_badge(self, obj):
        colors = {
            'DRAFT': 'gray',
            'PROCESSING': 'orange',
            'APPROVED': 'blue',
            'PAID': 'green',
            'CLOSED': 'black',
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(PayrollEntry)
class PayrollEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee_name', 'payroll_period', 'gross_salary', 'total_deductions', 'net_salary', 'is_paid_badge')
    list_filter = ('is_paid', 'payment_date', 'payroll_period__period_start')
    search_fields = ('employee__first_name', 'employee__last_name', 'employee__email', 'payment_reference')
    readonly_fields = ('gross_salary', 'total_deductions', 'net_salary', 'created_at', 'updated_at')
    date_hierarchy = 'payment_date'
    fieldsets = (
        ('Basic Information', {
            'fields': ('payroll_period', 'employee', 'contract')
        }),
        ('Earnings', {
            'fields': ('base_salary', 'transportation_allowance', 'housing_allowance', 'other_allowances', 'overtime_pay', 'bonus', 'gross_salary')
        }),
        ('Work Details (for variable contracts)', {
            'fields': ('hours_worked', 'lessons_taught')
        }),
        ('Deductions', {
            'fields': ('social_security', 'income_tax', 'advance_payment', 'loan_deduction', 'other_deductions', 'total_deductions')
        }),
        ('Net Payment', {
            'fields': ('net_salary',)
        }),
        ('Payment Status', {
            'fields': ('is_paid', 'payment_date', 'payment_method', 'payment_reference')
        }),
        ('Notes', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )

    def employee_name(self, obj):
        return obj.employee.get_full_name()
    employee_name.short_description = 'Employee'

    def is_paid_badge(self, obj):
        if obj.is_paid:
            return format_html('<span style="color: green;">✓ Paid</span>')
        return format_html('<span style="color: orange;">○ Unpaid</span>')
    is_paid_badge.short_description = 'Payment Status'


@admin.register(ExpenseRecord)
class ExpenseRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category_display', 'amount', 'expense_date', 'payment_status_badge', 'approval_status_badge')
    list_filter = ('category', 'status', 'payment_status', 'academic_year', 'expense_date')
    search_fields = ('title', 'description', 'vendor_name', 'invoice_number')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'expense_date'
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'subcategory', 'amount', 'expense_date', 'academic_year')
        }),
        ('Vendor Information', {
            'fields': ('vendor_name', 'vendor_contact', 'invoice_number')
        }),
        ('Payment Details', {
            'fields': ('payment_status', 'paid_amount', 'payment_method', 'due_date')
        }),
        ('Budget Tracking', {
            'fields': ('budget_category',)
        }),
        ('Approval Workflow', {
            'fields': ('status', 'requested_by', 'approved_by')
        }),
        ('Notes', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )

    def category_display(self, obj):
        return obj.get_category_display()
    category_display.short_description = 'Category'

    def payment_status_badge(self, obj):
        colors = {
            'PENDING': 'orange',
            'PARTIAL': 'blue',
            'PAID': 'green',
            'OVERDUE': 'red',
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.payment_status, 'gray'),
            obj.get_payment_status_display()
        )
    payment_status_badge.short_description = 'Payment Status'

    def approval_status_badge(self, obj):
        colors = {
            'DRAFT': 'gray',
            'SUBMITTED': 'orange',
            'APPROVED': 'green',
            'REJECTED': 'red',
            'COMPLETED': 'blue',
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    approval_status_badge.short_description = 'Approval Status'


@admin.register(BudgetCategory)
class BudgetCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'expense_category_display', 'order', 'is_active')
    list_filter = ('is_active', 'expense_category', 'parent')
    search_fields = ('name', 'name_arabic', 'name_french', 'description')
    list_editable = ('order', 'is_active')
    fieldsets = (
        ('Names', {
            'fields': ('name', 'name_arabic', 'name_french')
        }),
        ('Hierarchy', {
            'fields': ('parent', 'order')
        }),
        ('Mapping', {
            'fields': ('expense_category',)
        }),
        ('Additional', {
            'fields': ('description', 'is_active')
        }),
    )

    def expense_category_display(self, obj):
        return obj.get_expense_category_display() if obj.expense_category else '-'
    expense_category_display.short_description = 'Expense Category'


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'academic_year', 'allocated_amount', 'spent_amount', 'utilization_bar', 'is_exceeded_badge')
    list_filter = ('academic_year', 'is_exceeded', 'category')
    search_fields = ('category__name', 'notes')
    readonly_fields = ('spent_amount', 'is_exceeded', 'utilization_display', 'remaining_display', 'created_at', 'updated_at')
    fieldsets = (
        ('Budget Details', {
            'fields': ('academic_year', 'category', 'allocated_amount')
        }),
        ('Period', {
            'fields': ('period_start', 'period_end')
        }),
        ('Tracking', {
            'fields': ('spent_amount', 'utilization_display', 'remaining_display')
        }),
        ('Alerts', {
            'fields': ('alert_threshold', 'is_exceeded')
        }),
        ('Metadata', {
            'fields': ('notes', 'created_by', 'created_at', 'updated_at')
        }),
    )

    def utilization_bar(self, obj):
        percentage = min(obj.utilization_percentage, 100)
        color = 'green' if percentage < 80 else 'orange' if percentage < 100 else 'red'
        return format_html(
            '<div style="width: 100px; background-color: #f0f0f0; border-radius: 3px; overflow: hidden;">'
            '<div style="width: {}%; background-color: {}; color: white; text-align: center; padding: 2px;">{:.1f}%</div>'
            '</div>',
            percentage, color, percentage
        )
    utilization_bar.short_description = 'Utilization'

    def is_exceeded_badge(self, obj):
        if obj.is_exceeded:
            return format_html('<span style="color: red;">✗ Exceeded</span>')
        return format_html('<span style="color: green;">✓ Within Budget</span>')
    is_exceeded_badge.short_description = 'Status'

    def utilization_display(self, obj):
        return f"{obj.utilization_percentage:.2f}%"
    utilization_display.short_description = 'Utilization %'

    def remaining_display(self, obj):
        return f"{obj.remaining_amount:.2f} MAD"
    remaining_display.short_description = 'Remaining'

    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
