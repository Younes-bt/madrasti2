from rest_framework import serializers
from .models import (
    FeeCategory, FeeStructure, Invoice, InvoiceItem, Payment,
    EmploymentContract, PayrollPeriod, PayrollEntry,
    ExpenseRecord, BudgetCategory, Budget, FinancialTransaction
)
from schools.models import AcademicYear, Grade
from users.serializers import UserBasicSerializer

class FeeCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeCategory
        fields = '__all__'

class FeeStructureSerializer(serializers.ModelSerializer):
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = FeeStructure
        fields = ['id', 'academic_year', 'grade', 'grade_name', 'category', 'category_name', 'amount']

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'amount']

class PaymentSerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.CharField(source='recorded_by.get_full_name', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'invoice', 'amount', 'date', 'method', 'transaction_id', 'recorded_by', 'recorded_by_name', 'notes']
        read_only_fields = ['recorded_by', 'date']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    remaining_amount = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['id', 'student', 'student_name', 'academic_year', 'month', 'total_amount', 'paid_amount', 'remaining_amount', 'status', 'issue_date', 'due_date', 'notes', 'items', 'payments']
        read_only_fields = ['total_amount', 'paid_amount', 'status', 'issue_date']

    def get_remaining_amount(self, obj):
        return obj.total_amount - obj.paid_amount

class InvoiceCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating an invoice manually"""
    class Meta:
        model = Invoice
        fields = ['student', 'academic_year', 'month', 'due_date', 'notes']

class BulkInvoiceGenerateSerializer(serializers.Serializer):
    grade_id = serializers.IntegerField()
    month = serializers.DateField()
    due_date = serializers.DateField()
    academic_year_id = serializers.IntegerField()


# ==================== PAYROLL SYSTEM SERIALIZERS ====================

class EmploymentContractSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    employee_email = serializers.CharField(source='employee.email', read_only=True)
    contract_type_display = serializers.CharField(source='get_contract_type_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    calculated_monthly_salary = serializers.SerializerMethodField()

    class Meta:
        model = EmploymentContract
        fields = [
            'id', 'employee', 'employee_name', 'employee_email',
            'contract_type', 'contract_type_display', 'contract_number',
            'start_date', 'end_date', 'is_active',
            'base_amount', 'currency', 'hours_per_week', 'lessons_per_week',
            'transportation_allowance', 'housing_allowance', 'other_allowances',
            'social_security_rate', 'tax_exemption_amount',
            'calculated_monthly_salary', 'notes',
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def get_calculated_monthly_salary(self, obj):
        """Calculate estimated monthly gross salary"""
        return float(obj.calculate_gross_monthly_salary())


class EmploymentContractCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating employment contracts"""
    class Meta:
        model = EmploymentContract
        fields = [
            'employee', 'contract_type', 'contract_number',
            'start_date', 'end_date', 'is_active',
            'base_amount', 'currency', 'hours_per_week', 'lessons_per_week',
            'transportation_allowance', 'housing_allowance', 'other_allowances',
            'social_security_rate', 'tax_exemption_amount', 'notes'
        ]


class PayrollEntrySerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    employee_email = serializers.CharField(source='employee.email', read_only=True)
    contract_number = serializers.CharField(source='contract.contract_number', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    payroll_period_start = serializers.DateField(source='payroll_period.period_start', read_only=True)
    payroll_period_end = serializers.DateField(source='payroll_period.period_end', read_only=True)

    class Meta:
        model = PayrollEntry
        fields = [
            'id', 'payroll_period', 'payroll_period_start', 'payroll_period_end',
            'employee', 'employee_name', 'employee_email',
            'contract', 'contract_number',
            'base_salary', 'transportation_allowance', 'housing_allowance',
            'other_allowances', 'overtime_pay', 'bonus',
            'hours_worked', 'lessons_taught',
            'gross_salary',
            'social_security', 'income_tax', 'advance_payment',
            'loan_deduction', 'other_deductions', 'total_deductions',
            'net_salary',
            'is_paid', 'payment_date', 'payment_method', 'payment_method_display',
            'payment_reference', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['gross_salary', 'total_deductions', 'net_salary', 'created_at', 'updated_at']


class PayrollEntryCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating payroll entries"""
    class Meta:
        model = PayrollEntry
        fields = [
            'payroll_period', 'employee', 'contract',
            'base_salary', 'transportation_allowance', 'housing_allowance',
            'other_allowances', 'overtime_pay', 'bonus',
            'hours_worked', 'lessons_taught',
            'social_security', 'income_tax', 'advance_payment',
            'loan_deduction', 'other_deductions',
            'is_paid', 'payment_date', 'payment_method', 'payment_reference', 'notes'
        ]


class PayrollPeriodSerializer(serializers.ModelSerializer):
    academic_year_display = serializers.CharField(source='academic_year.year', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    payroll_entries = PayrollEntrySerializer(many=True, read_only=True)

    class Meta:
        model = PayrollPeriod
        fields = [
            'id', 'academic_year', 'academic_year_display',
            'period_start', 'period_end', 'payment_date',
            'status', 'status_display',
            'total_gross', 'total_deductions', 'total_net', 'employee_count',
            'notes',
            'created_by', 'created_by_name',
            'approved_by', 'approved_by_name',
            'created_at', 'updated_at',
            'payroll_entries'
        ]
        read_only_fields = [
            'total_gross', 'total_deductions', 'total_net', 'employee_count',
            'created_by', 'approved_by', 'created_at', 'updated_at'
        ]


class PayrollPeriodCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payroll periods"""
    class Meta:
        model = PayrollPeriod
        fields = [
            'academic_year', 'period_start', 'period_end',
            'payment_date', 'status', 'notes'
        ]


class PayrollPeriodListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing payroll periods (without nested entries)"""
    academic_year_display = serializers.CharField(source='academic_year.year', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = PayrollPeriod
        fields = [
            'id', 'academic_year', 'academic_year_display',
            'period_start', 'period_end', 'payment_date',
            'status', 'status_display',
            'total_gross', 'total_deductions', 'total_net', 'employee_count',
            'created_by_name', 'created_at'
        ]


class GeneratePayrollSerializer(serializers.Serializer):
    """Serializer for bulk payroll generation"""
    include_employee_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="Optional: specific employee IDs to include"
    )
    exclude_employee_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="Optional: employee IDs to exclude"
    )


class CalculateSalarySerializer(serializers.Serializer):
    """Serializer for salary calculation preview"""
    hours_worked = serializers.DecimalField(
        max_digits=6,
        decimal_places=2,
        required=False,
        help_text="For hourly contracts"
    )
    lessons_taught = serializers.IntegerField(
        required=False,
        help_text="For per-lesson contracts"
    )


# ==================== EXPENSE & BUDGET SERIALIZERS ====================

class BudgetCategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    expense_category_display = serializers.CharField(source='get_expense_category_display', read_only=True)

    class Meta:
        model = BudgetCategory
        fields = [
            'id', 'name', 'name_arabic', 'name_french',
            'parent', 'parent_name',
            'expense_category', 'expense_category_display',
            'description', 'is_active', 'order'
        ]


class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    academic_year_display = serializers.CharField(source='academic_year.year', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    remaining_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    utilization_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Budget
        fields = [
            'id', 'academic_year', 'academic_year_display',
            'category', 'category_name',
            'allocated_amount', 'spent_amount', 'remaining_amount',
            'utilization_percentage', 'is_exceeded',
            'period_start', 'period_end',
            'alert_threshold', 'notes',
            'created_by', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['spent_amount', 'is_exceeded', 'created_by', 'created_at', 'updated_at']


class BudgetCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating budgets"""
    class Meta:
        model = Budget
        fields = [
            'academic_year', 'category', 'allocated_amount',
            'period_start', 'period_end', 'alert_threshold', 'notes'
        ]


class ExpenseRecordSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    academic_year_display = serializers.CharField(source='academic_year.year', read_only=True)
    budget_category_name = serializers.CharField(source='budget_category.name', read_only=True)
    requested_by_name = serializers.CharField(source='requested_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    remaining_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    attachment = serializers.SerializerMethodField()

    class Meta:
        model = ExpenseRecord
        fields = [
            'id', 'category', 'category_display', 'subcategory',
            'title', 'description', 'amount', 'expense_date',
            'academic_year', 'academic_year_display',
            'vendor_name', 'vendor_contact', 'invoice_number',
            'payment_status', 'payment_status_display',
            'paid_amount', 'remaining_amount',
            'payment_method', 'due_date',
            'budget_category', 'budget_category_name',
            'status', 'status_display',
            'requested_by', 'requested_by_name',
            'approved_by', 'approved_by_name',
            'notes', 'created_at', 'updated_at', 'attachment'
        ]
        read_only_fields = ['requested_by', 'approved_by', 'created_at', 'updated_at']

    def get_attachment(self, obj):
        relation = obj.attachments.first()
        if relation and relation.media_file and relation.media_file.file:
            return relation.media_file.file.url
        return None


class ExpenseRecordCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating expense records"""
    attachment = serializers.FileField(required=False, write_only=True)

    class Meta:
        model = ExpenseRecord
        fields = [
            'category', 'subcategory', 'title', 'description',
            'amount', 'expense_date', 'academic_year',
            'vendor_name', 'vendor_contact', 'invoice_number',
            'payment_status', 'paid_amount', 'payment_method', 'due_date',
            'budget_category', 'status', 'notes', 'attachment'
        ]

    def create(self, validated_data):
        validated_data.pop('attachment', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('attachment', None)
        return super().update(instance, validated_data)


class RecordExpensePaymentSerializer(serializers.Serializer):
    """Serializer for recording expense payments"""
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_method = serializers.ChoiceField(choices=Payment.Method.choices)
    payment_date = serializers.DateField(required=False)
    reference_number = serializers.CharField(max_length=100, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)


class BatchApproveExpensesSerializer(serializers.Serializer):
    """Serializer for batch expense approval"""
    expense_ids = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="List of expense record IDs to approve"
    )


# ==================== FINANCIAL TRANSACTION SERIALIZER (READ-ONLY) ====================

class FinancialTransactionSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for FinancialTransaction model.
    Transactions are created automatically via signals or API actions.
    """
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    income_category_display = serializers.CharField(source='get_income_category_display', read_only=True)
    expense_category_display = serializers.CharField(source='get_expense_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    academic_year_display = serializers.CharField(source='academic_year.year', read_only=True)
    recorded_by_name = serializers.CharField(source='recorded_by.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)

    # Related object information
    invoice_number = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()
    vehicle_info = serializers.SerializerMethodField()

    class Meta:
        model = FinancialTransaction
        fields = [
            'id', 'transaction_type', 'transaction_type_display',
            'income_category', 'income_category_display',
            'expense_category', 'expense_category_display',
            'amount', 'currency', 'transaction_date',
            'academic_year', 'academic_year_display',
            'invoice', 'invoice_number', 'student_name',
            'payroll_entry', 'employee_name',
            'gasoil_record', 'vehicle_info',
            'expense_record',
            'description', 'notes',
            'payment_method', 'payment_method_display',
            'reference_number',
            'status', 'status_display',
            'recorded_by', 'recorded_by_name',
            'approved_by', 'approved_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'transaction_type', 'transaction_type_display',
            'income_category', 'income_category_display',
            'expense_category', 'expense_category_display',
            'amount', 'currency', 'transaction_date',
            'academic_year', 'academic_year_display',
            'invoice', 'invoice_number', 'student_name',
            'payroll_entry', 'employee_name',
            'gasoil_record', 'vehicle_info',
            'expense_record',
            'description', 'notes',
            'payment_method', 'payment_method_display',
            'reference_number',
            'status', 'status_display',
            'recorded_by', 'recorded_by_name',
            'approved_by', 'approved_by_name',
            'created_at', 'updated_at'
        ]

    def get_invoice_number(self, obj):
        if obj.invoice:
            return obj.invoice.id
        return None

    def get_student_name(self, obj):
        if obj.invoice:
            return obj.invoice.student.get_full_name()
        return None

    def get_employee_name(self, obj):
        if obj.payroll_entry:
            return obj.payroll_entry.employee.get_full_name()
        return None

    def get_vehicle_info(self, obj):
        if obj.gasoil_record:
            return {
                'vehicle': str(obj.gasoil_record.vehicle),
                'liters': float(obj.gasoil_record.liters),
                'fuel_station': obj.gasoil_record.fuel_station
            }
        return None
