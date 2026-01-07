from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericRelation
from datetime import date
from decimal import Decimal
from schools.models import AcademicYear, Grade
from users.models import User

class FeeCategory(models.Model):
    class FeeType(models.TextChoices):
        RECURRING = 'RECURRING', 'Recurring (Monthly)'
        ONE_TIME = 'ONE_TIME', 'One Time (Yearly)'

    name = models.CharField(max_length=100)
    fee_type = models.CharField(max_length=20, choices=FeeType.choices, default=FeeType.RECURRING)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_fee_type_display()})"

class FeeStructure(models.Model):
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    category = models.ForeignKey(FeeCategory, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('academic_year', 'grade', 'category')

    def __str__(self):
        return f"{self.grade} - {self.category}: {self.amount}"

class Invoice(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        ISSUED = 'ISSUED', 'Issued'
        PARTIALLY_PAID = 'PARTIALLY_PAID', 'Partially Paid'
        PAID = 'PAID', 'Paid'
        OVERDUE = 'OVERDUE', 'Overdue'
        CANCELLED = 'CANCELLED', 'Cancelled'

    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'}, related_name='invoices')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    month = models.DateField(null=True, blank=True, help_text="For monthly invoices, set the first day of the month")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    issue_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"INV-{self.id} - {self.student.get_full_name()}"

    def update_status(self):
        if self.paid_amount >= self.total_amount:
            self.status = self.Status.PAID
        elif self.paid_amount > 0:
            self.status = self.Status.PARTIALLY_PAID
        else:
            # Could check for overdue here based on date
            if self.status == self.Status.PAID: # If it was paid but amount changed?
                 self.status = self.Status.ISSUED
        self.save()

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update invoice total
        total = sum(item.amount for item in self.invoice.items.all())
        self.invoice.total_amount = total
        self.invoice.update_status()

class Payment(models.Model):
    class Method(models.TextChoices):
        CASH = 'CASH', 'Cash'
        CHECK = 'CHECK', 'Check'
        TRANSFER = 'TRANSFER', 'Bank Transfer'
        OTHER = 'OTHER', 'Other'

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.CASH)
    transaction_id = models.CharField(max_length=100, blank=True)
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='recorded_payments')
    notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update invoice paid amount
        total_paid = sum(p.amount for p in self.invoice.payments.all())
        self.invoice.paid_amount = total_paid
        self.invoice.update_status()

    def __str__(self):
        return f"{self.amount} - {self.invoice}"


# ==================== NEW FINANCIAL MANAGEMENT MODELS ====================

class ContractType(models.TextChoices):
    FULL_TIME_MONTHLY = 'FULL_TIME_MONTHLY', 'Full-Time (Monthly Salary)'
    PART_TIME_MONTHLY = 'PART_TIME_MONTHLY', 'Part-Time (Monthly Salary)'
    HOURLY = 'HOURLY', 'Hourly Contract'
    PER_LESSON = 'PER_LESSON', 'Per Lesson/Session'
    FIXED_TERM = 'FIXED_TERM', 'Fixed Term Contract'
    INTERNSHIP = 'INTERNSHIP', 'Internship/Training'


class EmploymentContract(models.Model):
    """
    Defines employment contracts for teachers and staff.
    Links to User (TEACHER or STAFF roles) and defines payment structure.
    """
    # Basic Information
    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='employment_contracts',
        limit_choices_to={'role__in': ['TEACHER', 'STAFF', 'DRIVER']}
    )
    contract_type = models.CharField(
        max_length=30,
        choices=ContractType.choices,
        default=ContractType.FULL_TIME_MONTHLY
    )
    contract_number = models.CharField(max_length=50, unique=True, help_text="Internal contract reference")

    # Contract Period
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text="Leave blank for indefinite contracts")
    is_active = models.BooleanField(default=True)

    # Payment Terms
    base_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Base salary (monthly) or rate (hourly/per-lesson)"
    )
    currency = models.CharField(max_length=3, default='MAD')

    # For hourly/per-lesson contracts
    hours_per_week = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Expected weekly hours (for hourly contracts)"
    )
    lessons_per_week = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Expected weekly lessons (for per-lesson contracts)"
    )

    # Benefits & Allowances
    transportation_allowance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Monthly transportation allowance"
    )
    housing_allowance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Monthly housing allowance"
    )
    other_allowances = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Other monthly allowances"
    )

    # Deductions
    social_security_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Social security deduction percentage"
    )
    tax_exemption_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Amount exempt from income tax"
    )

    # Metadata
    notes = models.TextField(blank=True)
    attachments = GenericRelation('media.MediaRelation', related_query_name='contract')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_contracts'
    )

    class Meta:
        ordering = ['-start_date', 'employee__last_name']
        indexes = [
            models.Index(fields=['employee', 'is_active']),
            models.Index(fields=['start_date', 'end_date']),
        ]

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.get_contract_type_display()}"

    def calculate_gross_monthly_salary(self, hours_worked=None, lessons_taught=None):
        """
        Calculate gross monthly salary based on contract type.
        For hourly/per-lesson contracts, provide actual hours/lessons.
        """
        if self.contract_type in ['FULL_TIME_MONTHLY', 'PART_TIME_MONTHLY', 'FIXED_TERM']:
            base = self.base_amount
        elif self.contract_type == 'HOURLY':
            # Use provided hours or fallback to weekly average
            weekly_hours = self.hours_per_week or Decimal('0')
            hours = hours_worked or (weekly_hours * Decimal('4.33'))
            base = self.base_amount * Decimal(hours)
        elif self.contract_type == 'PER_LESSON':
            # Use provided lessons or fallback to weekly average
            weekly_lessons = self.lessons_per_week or 0
            lessons = lessons_taught or (Decimal(weekly_lessons) * Decimal('4.33'))
            base = self.base_amount * Decimal(lessons)
        else:
            base = self.base_amount

        # Add allowances
        total_gross = (
            base +
            (self.transportation_allowance or Decimal('0')) +
            (self.housing_allowance or Decimal('0')) +
            (self.other_allowances or Decimal('0'))
        )
        return total_gross

    def is_valid_for_date(self, check_date):
        """Check if contract is valid for a given date"""
        if check_date < self.start_date:
            return False
        if self.end_date and check_date > self.end_date:
            return False
        return self.is_active


class TransactionType(models.TextChoices):
    INCOME = 'INCOME', 'Income'
    EXPENSE = 'EXPENSE', 'Expense'


class IncomeCategory(models.TextChoices):
    STUDENT_FEES = 'STUDENT_FEES', 'Student Tuition & Fees'
    REGISTRATION = 'REGISTRATION', 'Registration Fees'
    DONATIONS = 'DONATIONS', 'Donations'
    GRANTS = 'GRANTS', 'Grants & Subsidies'
    OTHER_INCOME = 'OTHER_INCOME', 'Other Income'


class ExpenseCategory(models.TextChoices):
    # Payroll
    SALARY = 'SALARY', 'Salaries & Wages'
    BONUS = 'BONUS', 'Bonuses & Incentives'
    BENEFITS = 'BENEFITS', 'Employee Benefits'

    # Operations
    FUEL = 'FUEL', 'Fuel & Gasoil'
    UTILITIES = 'UTILITIES', 'Utilities (Water, Electricity, Internet)'
    SUPPLIES = 'SUPPLIES', 'Office & Educational Supplies'
    MAINTENANCE = 'MAINTENANCE', 'Maintenance & Repairs'
    TRANSPORTATION = 'TRANSPORTATION', 'Transportation Expenses'

    # Infrastructure
    RENT = 'RENT', 'Rent & Lease'
    EQUIPMENT = 'EQUIPMENT', 'Equipment Purchase'
    RENOVATION = 'RENOVATION', 'Renovation & Construction'

    # Administrative
    SOFTWARE = 'SOFTWARE', 'Software & Licenses'
    PROFESSIONAL_SERVICES = 'PROFESSIONAL_SERVICES', 'Professional Services'
    INSURANCE = 'INSURANCE', 'Insurance'
    TAXES = 'TAXES', 'Taxes & Fees'
    MARKETING = 'MARKETING', 'Marketing & Advertising'

    # Other
    OTHER_EXPENSE = 'OTHER_EXPENSE', 'Other Expenses'


class FinancialTransaction(models.Model):
    """
    Unified transaction model for all financial operations.
    Single source of truth for both income and expenses.
    """
    # Transaction Type
    transaction_type = models.CharField(
        max_length=10,
        choices=TransactionType.choices
    )

    # Categorization
    income_category = models.CharField(
        max_length=30,
        choices=IncomeCategory.choices,
        null=True,
        blank=True,
        help_text="Required for income transactions"
    )
    expense_category = models.CharField(
        max_length=30,
        choices=ExpenseCategory.choices,
        null=True,
        blank=True,
        help_text="Required for expense transactions"
    )

    # Financial Details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='MAD')
    transaction_date = models.DateField()

    # References
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.PROTECT,
        related_name='financial_transactions'
    )

    # Link to related objects (polymorphic approach)
    # For student payments
    invoice = models.ForeignKey(
        'Invoice',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )

    # For payroll
    payroll_entry = models.ForeignKey(
        'PayrollEntry',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )

    # For vehicle fuel (links to existing GasoilRecord)
    gasoil_record = models.ForeignKey(
        'schools.GasoilRecord',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )

    # For general expenses
    expense_record = models.ForeignKey(
        'ExpenseRecord',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )

    # Description & Metadata
    description = models.CharField(max_length=255)
    notes = models.TextField(blank=True)

    # Payment Information
    payment_method = models.CharField(
        max_length=20,
        choices=Payment.Method.choices,
        default=Payment.Method.CASH
    )
    reference_number = models.CharField(
        max_length=100,
        blank=True,
        help_text="Check number, transaction ID, etc."
    )

    # Approval & Recording
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('APPROVED', 'Approved'),
            ('COMPLETED', 'Completed'),
            ('CANCELLED', 'Cancelled'),
        ],
        default='PENDING'
    )
    recorded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='recorded_transactions'
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_transactions'
    )

    # Attachments
    attachments = GenericRelation('media.MediaRelation', related_query_name='transaction')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-transaction_date', '-created_at']
        indexes = [
            models.Index(fields=['transaction_type', 'transaction_date']),
            models.Index(fields=['academic_year', 'transaction_type']),
            models.Index(fields=['expense_category', 'transaction_date']),
            models.Index(fields=['income_category', 'transaction_date']),
        ]

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.amount} {self.currency} - {self.transaction_date}"

    def clean(self):
        """Validate that category matches transaction type"""
        if self.transaction_type == TransactionType.INCOME and not self.income_category:
            raise ValidationError("Income category is required for income transactions")
        if self.transaction_type == TransactionType.EXPENSE and not self.expense_category:
            raise ValidationError("Expense category is required for expense transactions")
        if self.transaction_type == TransactionType.INCOME and self.expense_category:
            raise ValidationError("Expense category should not be set for income transactions")
        if self.transaction_type == TransactionType.EXPENSE and self.income_category:
            raise ValidationError("Income category should not be set for expense transactions")


class PayrollPeriod(models.Model):
    """
    Represents a payroll cycle (monthly, bi-weekly, etc.)
    """
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        related_name='payroll_periods'
    )
    period_start = models.DateField()
    period_end = models.DateField()
    payment_date = models.DateField(help_text="Scheduled payment date")

    status = models.CharField(
        max_length=20,
        choices=[
            ('DRAFT', 'Draft'),
            ('PROCESSING', 'Processing'),
            ('APPROVED', 'Approved'),
            ('PAID', 'Paid'),
            ('CLOSED', 'Closed'),
        ],
        default='DRAFT'
    )

    # Summary fields (calculated)
    total_gross = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_net = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    employee_count = models.PositiveIntegerField(default=0)

    # Metadata
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_payroll_periods'
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_payroll_periods'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-period_start']
        unique_together = ['academic_year', 'period_start', 'period_end']

    def __str__(self):
        return f"Payroll: {self.period_start} to {self.period_end}"

    def recalculate_totals(self):
        """Recalculate summary totals from all entries"""
        entries = self.payroll_entries.all()
        self.total_gross = sum(e.gross_salary for e in entries)
        self.total_deductions = sum(e.total_deductions for e in entries)
        self.total_net = sum(e.net_salary for e in entries)
        self.employee_count = entries.count()
        self.save(update_fields=['total_gross', 'total_deductions', 'total_net', 'employee_count'])


class PayrollEntry(models.Model):
    """
    Individual payroll entry for an employee in a specific period.
    """
    payroll_period = models.ForeignKey(
        PayrollPeriod,
        on_delete=models.CASCADE,
        related_name='payroll_entries'
    )
    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payroll_entries',
        limit_choices_to={'role__in': ['TEACHER', 'STAFF', 'DRIVER']}
    )
    contract = models.ForeignKey(
        EmploymentContract,
        on_delete=models.PROTECT,
        related_name='payroll_entries'
    )

    # Earnings
    base_salary = models.DecimalField(max_digits=10, decimal_places=2)
    transportation_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    housing_allowance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_allowances = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    overtime_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # For hourly/per-lesson contracts
    hours_worked = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Actual hours worked (for hourly contracts)"
    )
    lessons_taught = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Actual lessons taught (for per-lesson contracts)"
    )

    # Calculated gross
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)

    # Deductions
    social_security = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    income_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    advance_payment = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text="Salary advances to deduct"
    )
    loan_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2)

    # Net payment
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)

    # Payment status
    is_paid = models.BooleanField(default=False)
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(
        max_length=20,
        choices=Payment.Method.choices,
        default=Payment.Method.TRANSFER
    )
    payment_reference = models.CharField(max_length=100, blank=True)

    # Metadata
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['employee__last_name', 'employee__first_name']
        unique_together = ['payroll_period', 'employee']
        indexes = [
            models.Index(fields=['payroll_period', 'employee']),
            models.Index(fields=['is_paid', 'payment_date']),
        ]

    def __str__(self):
        return f"{self.employee.get_full_name()} - {self.payroll_period}"

    def calculate_gross(self):
        """Calculate gross salary from contract and actual work"""
        self.gross_salary = (
            self.base_salary +
            self.transportation_allowance +
            self.housing_allowance +
            self.other_allowances +
            self.overtime_pay +
            self.bonus
        )
        return self.gross_salary

    def calculate_deductions(self):
        """Calculate total deductions"""
        self.total_deductions = (
            self.social_security +
            self.income_tax +
            self.advance_payment +
            self.loan_deduction +
            self.other_deductions
        )
        return self.total_deductions

    def calculate_net(self):
        """Calculate net salary"""
        self.calculate_gross()
        self.calculate_deductions()
        self.net_salary = self.gross_salary - self.total_deductions
        return self.net_salary

    def save(self, *args, **kwargs):
        self.calculate_net()
        super().save(*args, **kwargs)
        # Update payroll period totals
        self.payroll_period.recalculate_totals()


class ExpenseRecord(models.Model):
    """
    Tracks non-payroll expenses (operations, infrastructure, administrative).
    This model will be linked to FinancialTransaction for unified reporting.
    """
    # Categorization
    category = models.CharField(
        max_length=30,
        choices=ExpenseCategory.choices
    )
    subcategory = models.CharField(
        max_length=100,
        blank=True,
        help_text="Custom subcategory for detailed tracking"
    )

    # Basic Information
    title = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    expense_date = models.DateField()
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.PROTECT,
        related_name='expense_records'
    )

    # Vendor/Supplier Information
    vendor_name = models.CharField(max_length=200, blank=True)
    vendor_contact = models.CharField(max_length=100, blank=True)
    invoice_number = models.CharField(max_length=100, blank=True)

    # Payment Details
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('PARTIAL', 'Partially Paid'),
            ('PAID', 'Paid'),
            ('OVERDUE', 'Overdue'),
        ],
        default='PENDING'
    )
    paid_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_method = models.CharField(
        max_length=20,
        choices=Payment.Method.choices,
        null=True,
        blank=True
    )
    due_date = models.DateField(null=True, blank=True)

    # Budget Tracking
    budget_category = models.ForeignKey(
        'BudgetCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='expense_records'
    )

    # Approval Workflow
    status = models.CharField(
        max_length=20,
        choices=[
            ('DRAFT', 'Draft'),
            ('SUBMITTED', 'Submitted'),
            ('APPROVED', 'Approved'),
            ('REJECTED', 'Rejected'),
            ('COMPLETED', 'Completed'),
        ],
        default='DRAFT'
    )

    # Users
    requested_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='requested_expenses'
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_expenses'
    )

    # Attachments (receipts, invoices, etc.)
    attachments = GenericRelation('media.MediaRelation', related_query_name='expense')

    # Metadata
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-expense_date', '-created_at']
        indexes = [
            models.Index(fields=['category', 'expense_date']),
            models.Index(fields=['academic_year', 'category']),
            models.Index(fields=['payment_status', 'due_date']),
        ]

    def __str__(self):
        return f"{self.title} - {self.amount} MAD"

    @property
    def remaining_amount(self):
        return self.amount - self.paid_amount

    def update_payment_status(self):
        """Update payment status based on paid amount"""
        if self.paid_amount >= self.amount:
            self.payment_status = 'PAID'
        elif self.paid_amount > 0:
            self.payment_status = 'PARTIAL'
        elif self.due_date and self.due_date < date.today():
            self.payment_status = 'OVERDUE'
        else:
            self.payment_status = 'PENDING'
        self.save()


class BudgetCategory(models.Model):
    """
    Hierarchical budget categories for planning and tracking.
    """
    name = models.CharField(max_length=100)
    name_arabic = models.CharField(max_length=100, blank=True)
    name_french = models.CharField(max_length=100, blank=True)

    # Hierarchy support
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories'
    )

    # Mapping to expense categories
    expense_category = models.CharField(
        max_length=30,
        choices=ExpenseCategory.choices,
        null=True,
        blank=True
    )

    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Budget Categories'

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


class Budget(models.Model):
    """
    Annual or periodic budget allocations.
    """
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        related_name='budgets'
    )
    category = models.ForeignKey(
        BudgetCategory,
        on_delete=models.CASCADE,
        related_name='budgets'
    )

    # Budget allocation
    allocated_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Total budget allocated for this category"
    )

    # Period (optional - for monthly/quarterly budgets)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)

    # Tracking
    spent_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Automatically calculated from expenses"
    )

    # Alerts
    alert_threshold = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=80.00,
        help_text="Alert when spending reaches this percentage (0-100)"
    )
    is_exceeded = models.BooleanField(default=False)

    # Metadata
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_budgets'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['academic_year', 'category']
        unique_together = ['academic_year', 'category', 'period_start']

    def __str__(self):
        return f"{self.category.name} - {self.academic_year.year}: {self.allocated_amount} MAD"

    @property
    def remaining_amount(self):
        return self.allocated_amount - self.spent_amount

    @property
    def utilization_percentage(self):
        if self.allocated_amount == 0:
            return 0
        return (self.spent_amount / self.allocated_amount) * 100

    def check_threshold(self):
        """Check if spending has exceeded alert threshold"""
        if self.utilization_percentage >= float(self.alert_threshold):
            return True
        return False

    def update_spent_amount(self):
        """Recalculate spent amount from related expenses"""
        from django.db.models import Sum
        total = ExpenseRecord.objects.filter(
            budget_category=self.category,
            academic_year=self.academic_year,
            status='APPROVED'
        ).aggregate(total=Sum('amount'))['total'] or 0

        self.spent_amount = total
        self.is_exceeded = self.spent_amount > self.allocated_amount
        self.save(update_fields=['spent_amount', 'is_exceeded'])
