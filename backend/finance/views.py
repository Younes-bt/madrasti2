from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Q, Sum, Count, Avg
from django.db.models.functions import TruncMonth, TruncQuarter
from datetime import date, datetime
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from .models import (
    FeeCategory, FeeStructure, Invoice, InvoiceItem, Payment,
    EmploymentContract, PayrollPeriod, PayrollEntry,
    ExpenseRecord, BudgetCategory, Budget, FinancialTransaction, TransactionType
)
from .serializers import (
    FeeCategorySerializer, FeeStructureSerializer, InvoiceSerializer,
    InvoiceCreateSerializer, PaymentSerializer, BulkInvoiceGenerateSerializer,
    EmploymentContractSerializer, EmploymentContractCreateSerializer,
    PayrollPeriodSerializer, PayrollPeriodCreateSerializer, PayrollPeriodListSerializer,
    PayrollEntrySerializer, PayrollEntryCreateSerializer,
    GeneratePayrollSerializer, CalculateSalarySerializer,
    ExpenseRecordSerializer, ExpenseRecordCreateSerializer,
    BudgetCategorySerializer, BudgetSerializer, BudgetCreateSerializer,
    RecordExpensePaymentSerializer, BatchApproveExpensesSerializer,
    RecordExpensePaymentSerializer, BatchApproveExpensesSerializer,
    FinancialTransactionSerializer
)
from .utils import calculate_work_stats
from .permissions import IsFinanceAdmin, CanViewPayroll, CanManageContracts, CanApproveExpenses
from .filters import FinancialTransactionFilter, ExpenseRecordFilter
from .pagination import CustomPageNumberPagination
from users.models import User
from schools.models import Grade, AcademicYear
from django.contrib.contenttypes.models import ContentType
from media.models import MediaFile, MediaRelation

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class FeeCategoryViewSet(viewsets.ModelViewSet):
    queryset = FeeCategory.objects.all()
    serializer_class = FeeCategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        grade_id = self.request.query_params.get('grade')
        if grade_id:
            queryset = queryset.filter(grade_id=grade_id)
        return queryset

class InvoiceFilter(FilterSet):
    month = CharFilter(method='filter_by_month')

    class Meta:
        model = Invoice
        fields = ['status', 'academic_year', 'student']

    def filter_by_month(self, queryset, name, value):
        try:
            # value is expected to be 'YYYY-MM'
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

            return queryset.filter(month__gte=start_date, month__lt=end_date)
        except (ValueError, AttributeError):
            return queryset

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = InvoiceFilter
    search_fields = ['student__first_name', 'student__last_name', '=id'] # =id for exact match
    ordering_fields = ['issue_date', 'due_date', 'total_amount', 'status']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.role == 'STAFF':
            return Invoice.objects.all().order_by('-id')
        elif user.role == 'PARENT':
            # Return invoices for all children
            return Invoice.objects.filter(student__parent=user).order_by('-id')
        elif user.role == 'STUDENT':
            return Invoice.objects.filter(student=user).order_by('-id')
        return Invoice.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return InvoiceCreateSerializer
        return InvoiceSerializer

    @action(detail=False, methods=['post'], permission_classes=[IsAdminOrReadOnly])
    def generate_bulk(self, request):
        serializer = BulkInvoiceGenerateSerializer(data=request.data)
        if serializer.is_valid():
            grade_id = serializer.validated_data['grade_id']
            month = serializer.validated_data['month']
            due_date = serializer.validated_data['due_date']
            academic_year_id = serializer.validated_data['academic_year_id']

            try:
                grade = Grade.objects.get(id=grade_id)
                academic_year = AcademicYear.objects.get(id=academic_year_id)
                
                # Get all students in this grade
                # Assuming StudentEnrollment links student to class, and class to grade
                # For now, let's assume we can filter Users by some means or through enrollments
                # This part depends on how students are linked to grades in your system.
                # Let's assume we look up enrollments.
                from users.models import StudentEnrollment
                enrollments = StudentEnrollment.objects.filter(
                    school_class__grade=grade, 
                    academic_year=academic_year,
                    is_active=True
                ).select_related('student')
                
                # Get fee structure for this grade
                fees = FeeStructure.objects.filter(grade=grade, academic_year=academic_year, category__fee_type='RECURRING').select_related('category')
                
                if not fees.exists():
                    return Response({"error": "No recurring fees defined for this grade"}, status=status.HTTP_400_BAD_REQUEST)

                created_count = 0
                with transaction.atomic():
                    for enrollment in enrollments:
                        student = enrollment.student
                        # Check if invoice already exists for this month
                        if Invoice.objects.filter(student=student, month=month).exists():
                            continue
                        
                        invoice = Invoice.objects.create(
                            student=student,
                            academic_year=academic_year,
                            month=month,
                            due_date=due_date,
                            status='ISSUED'
                        )
                        
                        for fee in fees:
                            # Check if this is a transport fee (case-insensitive check on name)
                            is_transport = 'transport' in fee.category.name.lower()
                            
                            # Only add transport fee if student uses transport
                            if is_transport and not enrollment.uses_transport:
                                continue

                            InvoiceItem.objects.create(
                                invoice=invoice,
                                description=fee.category.name,
                                amount=fee.amount
                            )
                        
                        # Apply invoice-wide discount if any
                        if enrollment.invoice_discount > 0:
                            InvoiceItem.objects.create(
                                invoice=invoice,
                                description="Discount",
                                amount=-enrollment.invoice_discount
                            )
                        
                        created_count += 1
                
                return Response({"message": f"Generated {created_count} invoices"}, status=status.HTTP_201_CREATED)


            except Grade.DoesNotExist:
                return Response({"error": "Grade not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)


# ==================== PAYROLL SYSTEM VIEWSETS ====================

class EmploymentContractViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing employment contracts.
    - ADMIN, ACCOUNTANT, HR: Full CRUD access
    - Employees: Read-only access to their own contracts
    """
    queryset = EmploymentContract.objects.all()
    serializer_class = EmploymentContractSerializer
    permission_classes = [permissions.IsAuthenticated, CanManageContracts]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['employee', 'contract_type', 'is_active']
    search_fields = ['contract_number', 'employee__first_name', 'employee__last_name', 'employee__email']
    ordering_fields = ['start_date', 'end_date', 'created_at']

    def get_queryset(self):
        """Filter queryset based on user role"""
        user = self.request.user
        queryset = super().get_queryset()

        # ADMIN, ACCOUNTANT, HR see all contracts
        if user.role == 'ADMIN':
            return queryset
        if hasattr(user, 'profile') and user.profile.position in ['ACCOUNTANT', 'HR_COORDINATOR']:
            return queryset

        # Regular employees see only their own contracts
        return queryset.filter(employee=user)

    def get_serializer_class(self):
        """Use different serializer for create/update"""
        if self.action in ['create', 'update', 'partial_update']:
            return EmploymentContractCreateSerializer
        return EmploymentContractSerializer

    def perform_create(self, serializer):
        """Set created_by when creating a contract"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def calculate_salary(self, request, pk=None):
        """
        Calculate estimated monthly salary for a contract.
        POST /api/finance/contracts/{id}/calculate-salary/
        Body: {"hours_worked": 160, "lessons_taught": 20} (optional, for variable contracts)
        """
        contract = self.get_object()
        serializer = CalculateSalarySerializer(data=request.data)

        if serializer.is_valid():
            hours_worked = serializer.validated_data.get('hours_worked')
            lessons_taught = serializer.validated_data.get('lessons_taught')

            gross_salary = contract.calculate_gross_monthly_salary(
                hours_worked=hours_worked,
                lessons_taught=lessons_taught
            )

            return Response({
                'contract_id': contract.id,
                'contract_type': contract.get_contract_type_display(),
                'base_amount': float(contract.base_amount),
                'hours_worked': float(hours_worked) if hours_worked else None,
                'lessons_taught': lessons_taught,
                'gross_monthly_salary': float(gross_salary),
                'allowances': {
                    'transportation': float(contract.transportation_allowance),
                    'housing': float(contract.housing_allowance),
                    'other': float(contract.other_allowances),
                }
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PayrollPeriodViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing payroll periods.
    - ADMIN, ACCOUNTANT, HR: Full CRUD access
    - Employees: Read-only access to periods they're included in
    """
    queryset = PayrollPeriod.objects.all()
    serializer_class = PayrollPeriodSerializer
    permission_classes = [permissions.IsAuthenticated, CanViewPayroll]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'academic_year']
    ordering_fields = ['period_start', 'period_end', 'payment_date']

    def get_queryset(self):
        """Filter queryset based on user role"""
        user = self.request.user
        queryset = super().get_queryset()

        # ADMIN, ACCOUNTANT, HR see all periods
        if user.role == 'ADMIN':
            return queryset
        if hasattr(user, 'profile') and user.profile.position in ['ACCOUNTANT', 'HR_COORDINATOR']:
            return queryset

        # Regular employees see only periods where they have entries
        return queryset.filter(payroll_entries__employee=user).distinct()

    def get_serializer_class(self):
        """Use different serializers based on action"""
        if self.action in ['create', 'update', 'partial_update']:
            return PayrollPeriodCreateSerializer
        if self.action == 'list':
            return PayrollPeriodListSerializer  # Lighter serializer without nested entries
        return PayrollPeriodSerializer

    def perform_create(self, serializer):
        """Set created_by when creating a period"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsFinanceAdmin])
    def generate(self, request, pk=None):
        """
        Auto-generate payroll entries from active contracts.
        POST /api/finance/payroll/periods/{id}/generate/
        Body: {"include_employee_ids": [1,2,3], "exclude_employee_ids": [4,5]} (both optional)
        """
        period = self.get_object()

        if period.status not in ['DRAFT', 'PROCESSING']:
            return Response(
                {"error": "Can only generate entries for DRAFT or PROCESSING periods"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = GeneratePayrollSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        include_ids = serializer.validated_data.get('include_employee_ids', [])
        exclude_ids = serializer.validated_data.get('exclude_employee_ids', [])

        # Get active contracts that are valid for this period
        contracts = EmploymentContract.objects.filter(
            is_active=True,
            start_date__lte=period.period_end
        ).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=period.period_start)
        )

        # Apply include/exclude filters
        if include_ids:
            contracts = contracts.filter(employee_id__in=include_ids)
        if exclude_ids:
            contracts = contracts.exclude(employee_id__in=exclude_ids)

        created_count = 0
        skipped_count = 0

        with transaction.atomic():
            for contract in contracts:
                # Skip if entry already exists
                if PayrollEntry.objects.filter(payroll_period=period, employee=contract.employee).exists():
                    skipped_count += 1
                    continue

                # Calculate variable stats if applicable
                hours_worked = None
                lessons_taught = None

                if contract.contract_type in ['HOURLY', 'PER_LESSON']:
                    stats = calculate_work_stats(contract.employee, period.period_start, period.period_end)
                    if contract.contract_type == 'HOURLY':
                        hours_worked = stats['hours']
                    elif contract.contract_type == 'PER_LESSON':
                        lessons_taught = stats['lessons']

                # Calculate base salary from contract (uses actual stats if provided)
                base_salary = contract.calculate_gross_monthly_salary(hours_worked=hours_worked, lessons_taught=lessons_taught)

                PayrollEntry.objects.create(
                    payroll_period=period,
                    employee=contract.employee,
                    contract=contract,
                    base_salary=contract.base_amount,
                    transportation_allowance=contract.transportation_allowance,
                    housing_allowance=contract.housing_allowance,
                    other_allowances=contract.other_allowances,
                    hours_worked=hours_worked,
                    lessons_taught=lessons_taught,
                    # Deductions can be set manually later
                    social_security=0,
                    income_tax=0,
                )
                created_count += 1

        return Response({
            'message': f'Generated {created_count} payroll entries, skipped {skipped_count} existing',
            'created_count': created_count,
            'skipped_count': skipped_count
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsFinanceAdmin])
    def approve(self, request, pk=None):
        """
        Approve a payroll period.
        POST /api/finance/payroll/periods/{id}/approve/
        """
        period = self.get_object()

        if period.status != 'PROCESSING':
            return Response(
                {"error": "Can only approve periods with PROCESSING status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        period.status = 'APPROVED'
        period.approved_by = request.user
        period.save()

        return Response({
            'message': 'Payroll period approved',
            'period_id': period.id,
            'status': period.status
        })

    @action(detail=True, methods=['post'], permission_classes=[IsFinanceAdmin])
    def process_payments(self, request, pk=None):
        """
        Mark all entries in the period as paid.
        POST /api/finance/payroll/periods/{id}/process-payments/
        """
        period = self.get_object()

        if period.status != 'APPROVED':
            return Response(
                {"error": "Can only process payments for APPROVED periods"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark all entries as paid
        updated_count = period.payroll_entries.filter(is_paid=False).update(
            is_paid=True,
            payment_date=date.today()
        )

        # Update period status
        period.status = 'PAID'
        period.save()

        return Response({
            'message': f'Marked {updated_count} entries as paid',
            'updated_count': updated_count,
            'period_status': period.status
        })


class PayrollEntryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing individual payroll entries.
    - ADMIN, ACCOUNTANT, HR: Full CRUD access
    - Employees: Read-only access to their own entries
    """
    queryset = PayrollEntry.objects.all()
    serializer_class = PayrollEntrySerializer
    permission_classes = [permissions.IsAuthenticated, CanViewPayroll]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['payroll_period', 'employee', 'is_paid']
    search_fields = ['employee__first_name', 'employee__last_name', 'employee__email', 'payment_reference']
    ordering_fields = ['payment_date', 'net_salary', 'gross_salary']

    def get_queryset(self):
        """Filter queryset based on user role"""
        user = self.request.user
        queryset = super().get_queryset()

        # ADMIN, ACCOUNTANT, HR see all entries
        if user.role == 'ADMIN':
            return queryset
        if hasattr(user, 'profile') and user.profile.position in ['ACCOUNTANT', 'HR_COORDINATOR']:
            return queryset

        # Regular employees see only their own entries
        return queryset.filter(employee=user)

    def get_serializer_class(self):
        """Use different serializer for create/update"""
        if self.action in ['create', 'update', 'partial_update']:
            return PayrollEntryCreateSerializer
        return PayrollEntrySerializer

    @action(detail=True, methods=['post'], permission_classes=[IsFinanceAdmin])
    def mark_paid(self, request, pk=None):
        """
        Mark a single payroll entry as paid.
        POST /api/finance/payroll/entries/{id}/mark-paid/
        Body: {"payment_reference": "TXN123"} (optional)
        """
        entry = self.get_object()

        if entry.is_paid:
            return Response(
                {"error": "Entry is already marked as paid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_reference = request.data.get('payment_reference', '')

        entry.is_paid = True
        entry.payment_date = date.today()
        if payment_reference:
            entry.payment_reference = payment_reference
        entry.save()

        return Response({
            'message': 'Payroll entry marked as paid',
            'entry_id': entry.id,
            'employee': entry.employee.get_full_name(),
            'net_salary': float(entry.net_salary),
            'payment_date': entry.payment_date
        })


# ==================== EXPENSE & BUDGET VIEWSETS ====================

class ExpenseRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing expense records.
    - ADMIN, ACCOUNTANT: Full CRUD access and approval
    - Other staff: Can submit expenses (create), view own expenses
    """
    queryset = ExpenseRecord.objects.all()
    serializer_class = ExpenseRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'payment_status', 'academic_year', 'budget_category']
    search_fields = ['title', 'description', 'vendor_name', 'invoice_number']
    ordering_fields = ['expense_date', 'amount', 'created_at']

    def get_queryset(self):
        """Filter based on user role"""
        user = self.request.user
        queryset = super().get_queryset()

        # ADMIN and ACCOUNTANT see all expenses
        if user.role == 'ADMIN':
            return queryset
        if hasattr(user, 'profile') and user.profile.position == 'ACCOUNTANT':
            return queryset

        # Other users see only expenses they requested
        return queryset.filter(requested_by=user)

    def get_serializer_class(self):
        """Use different serializer for create/update"""
        if self.action in ['create', 'update', 'partial_update']:
            return ExpenseRecordCreateSerializer
        return ExpenseRecordSerializer

    def perform_create(self, serializer):
        """Set requested_by and handle attachment when creating an expense"""
        attachment = self.request.FILES.get('attachment')
        expense = serializer.save(requested_by=self.request.user)
        
        if attachment:
            # Create MediaFile
            media = MediaFile.objects.create(
                file=attachment,
                title=f"Receipt for {expense.title}",
                media_type='DOCUMENT',
                uploaded_by=self.request.user
            )
            # Create Relation
            MediaRelation.objects.create(
                media_file=media,
                content_type=ContentType.objects.get_for_model(expense),
                object_id=expense.id,
                relation_type='OTHER'
            )

    @action(detail=True, methods=['post'], permission_classes=[CanApproveExpenses])
    def approve(self, request, pk=None):
        """
        Approve an expense.
        POST /api/finance/expenses/{id}/approve/
        """
        expense = self.get_object()

        if expense.status not in ['SUBMITTED', 'DRAFT']:
            return Response(
                {"error": "Can only approve SUBMITTED or DRAFT expenses"},
                status=status.HTTP_400_BAD_REQUEST
            )

        expense.status = 'APPROVED'
        expense.approved_by = request.user
        expense.save()

        # Update related budget if linked
        if expense.budget_category:
            budgets = Budget.objects.filter(
                category=expense.budget_category,
                academic_year=expense.academic_year
            )
            for budget in budgets:
                budget.update_spent_amount()

        return Response({
            'message': 'Expense approved',
            'expense_id': expense.id,
            'status': expense.status
        })

    @action(detail=True, methods=['post'], permission_classes=[CanApproveExpenses])
    def reject(self, request, pk=None):
        """
        Reject an expense.
        POST /api/finance/expenses/{id}/reject/
        Body: {"notes": "Reason for rejection"} (optional)
        """
        expense = self.get_object()

        if expense.status not in ['SUBMITTED', 'DRAFT']:
            return Response(
                {"error": "Can only reject SUBMITTED or DRAFT expenses"},
                status=status.HTTP_400_BAD_REQUEST
            )

        expense.status = 'REJECTED'
        if 'notes' in request.data:
            expense.notes = request.data['notes']
        expense.save()

        return Response({
            'message': 'Expense rejected',
            'expense_id': expense.id,
            'status': expense.status
        })

    @action(detail=True, methods=['post'], permission_classes=[CanApproveExpenses])
    def record_payment(self, request, pk=None):
        """
        Record a payment for an expense.
        POST /api/finance/expenses/{id}/record-payment/
        Body: {"amount": 1000, "payment_method": "TRANSFER", "reference_number": "TXN123"}
        """
        expense = self.get_object()
        serializer = RecordExpensePaymentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        amount = serializer.validated_data['amount']
        payment_method = serializer.validated_data['payment_method']
        payment_date = serializer.validated_data.get('payment_date', date.today())
        reference_number = serializer.validated_data.get('reference_number', '')
        notes = serializer.validated_data.get('notes', '')

        # Update expense payment info
        expense.paid_amount += amount
        expense.payment_method = payment_method
        if reference_number:
            expense.invoice_number = reference_number
        if notes:
            expense.notes = f"{expense.notes}\n{notes}" if expense.notes else notes

        expense.update_payment_status()

        # Create a FinancialTransaction record for this payment
        FinancialTransaction.objects.create(
            transaction_type=TransactionType.EXPENSE,
            expense_category=expense.category,
            amount=amount,
            transaction_date=payment_date,
            academic_year=expense.academic_year,
            expense_record=expense,
            description=f"Expense Payment: {expense.title} - {expense.vendor_name}" if expense.vendor_name else f"Expense Payment: {expense.title}",
            payment_method=payment_method,
            reference_number=reference_number,
            status='COMPLETED',
            recorded_by=request.user,
            notes=notes
        )

        return Response({
            'message': 'Payment recorded',
            'expense_id': expense.id,
            'paid_amount': float(expense.paid_amount),
            'remaining_amount': float(expense.remaining_amount),
            'payment_status': expense.payment_status
        })

    @action(detail=False, methods=['post'], permission_classes=[CanApproveExpenses])
    def batch_approve(self, request):
        """
        Batch approve multiple expenses.
        POST /api/finance/expenses/batch-approve/
        Body: {"expense_ids": [1, 2, 3, 4, 5]}
        """
        serializer = BatchApproveExpensesSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        expense_ids = serializer.validated_data['expense_ids']
        expenses = ExpenseRecord.objects.filter(id__in=expense_ids, status__in=['SUBMITTED', 'DRAFT'])

        approved_count = 0
        with transaction.atomic():
            for expense in expenses:
                expense.status = 'APPROVED'
                expense.approved_by = request.user
                expense.save()

                # Update budgets
                if expense.budget_category:
                    budgets = Budget.objects.filter(
                        category=expense.budget_category,
                        academic_year=expense.academic_year
                    )
                    for budget in budgets:
                        budget.update_spent_amount()

                approved_count += 1

        return Response({
            'message': f'Approved {approved_count} expenses',
            'approved_count': approved_count
        })


class BudgetCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing budget categories.
    - ADMIN, ACCOUNTANT: Full CRUD access
    - Others: Read-only access
    """
    queryset = BudgetCategory.objects.all()
    serializer_class = BudgetCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'parent', 'expense_category']
    search_fields = ['name', 'name_arabic', 'name_french', 'description']
    ordering_fields = ['order', 'name']

    def get_permissions(self):
        """Allow read for all, write only for ADMIN/ACCOUNTANT"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFinanceAdmin()]
        return [permissions.IsAuthenticated()]


class BudgetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing budgets.
    - ADMIN, ACCOUNTANT: Full CRUD access
    - Others: Read-only access
    """
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['academic_year', 'category', 'is_exceeded']
    ordering_fields = ['allocated_amount', 'spent_amount', 'utilization_percentage']

    def get_permissions(self):
        """Allow read for all, write only for ADMIN/ACCOUNTANT"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFinanceAdmin()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        """Use different serializer for create/update"""
        if self.action in ['create', 'update', 'partial_update']:
            return BudgetCreateSerializer
        return BudgetSerializer

    def perform_create(self, serializer):
        """Set created_by when creating a budget"""
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def utilization(self, request, pk=None):
        """
        Get detailed budget utilization.
        GET /api/finance/budgets/{id}/utilization/
        """
        budget = self.get_object()

        # Get related expenses
        expenses = ExpenseRecord.objects.filter(
            budget_category=budget.category,
            academic_year=budget.academic_year,
            status='APPROVED'
        )

        expense_breakdown = []
        for expense in expenses:
            expense_breakdown.append({
                'id': expense.id,
                'title': expense.title,
                'amount': float(expense.amount),
                'expense_date': expense.expense_date,
                'category': expense.get_category_display()
            })

        return Response({
            'budget_id': budget.id,
            'category': budget.category.name,
            'allocated_amount': float(budget.allocated_amount),
            'spent_amount': float(budget.spent_amount),
            'remaining_amount': float(budget.remaining_amount),
            'utilization_percentage': float(budget.utilization_percentage),
            'is_exceeded': budget.is_exceeded,
            'alert_threshold': float(budget.alert_threshold),
            'threshold_reached': budget.check_threshold(),
            'expense_count': len(expense_breakdown),
            'expenses': expense_breakdown
        })

    @action(detail=True, methods=['get'])
    def alerts(self, request, pk=None):
        """
        Check if budget has exceeded alert threshold.
        GET /api/finance/budgets/{id}/alerts/
        """
        budget = self.get_object()

        alert_triggered = budget.check_threshold()

        return Response({
            'budget_id': budget.id,
            'category': budget.category.name,
            'alert_triggered': alert_triggered,
            'alert_threshold': float(budget.alert_threshold),
            'utilization_percentage': float(budget.utilization_percentage),
            'is_exceeded': budget.is_exceeded,
            'allocated_amount': float(budget.allocated_amount),
            'spent_amount': float(budget.spent_amount),
            'remaining_amount': float(budget.remaining_amount)
        })


# ==================== FINANCIAL TRANSACTIONS & REPORTS ====================

class FinancialTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet for FinancialTransaction model.
    Transactions are created automatically via signals or API actions.
    - ADMIN, ACCOUNTANT: See all transactions
    - Others: Limited access based on related objects
    """
    queryset = FinancialTransaction.objects.all()
    serializer_class = FinancialTransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsFinanceAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = FinancialTransactionFilter
    search_fields = ['description', 'reference_number', 'notes']
    ordering_fields = ['transaction_date', 'amount', 'created_at']
    ordering = ['-transaction_date', '-created_at']

    def get_queryset(self):
        """Optimize queries with select_related and prefetch_related"""
        return super().get_queryset().select_related(
            'academic_year', 'invoice', 'payroll_entry', 'gasoil_record',
            'expense_record', 'recorded_by', 'approved_by'
        )


class ReportsViewSet(viewsets.ViewSet):
    """
    ViewSet for financial reports and analytics.
    All endpoints are read-only and require ADMIN or ACCOUNTANT permissions.
    """
    permission_classes = [permissions.IsAuthenticated, IsFinanceAdmin]

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        GET /api/finance/reports/dashboard/
        Query params: ?academic_year_id=1&month=2024-09

        Returns summary dashboard data including:
        - Total income, expenses, net balance
        - Income breakdown by category
        - Expense breakdown by category
        - Budget alerts
        - Recent transactions
        """
        academic_year_id = request.query_params.get('academic_year_id')
        month = request.query_params.get('month')  # YYYY-MM format

        # Base queryset - only show completed transactions in dashboard
        transactions = FinancialTransaction.objects.filter(status='COMPLETED')

        if academic_year_id:
            transactions = transactions.filter(academic_year_id=academic_year_id)

        if month:
            try:
                year, month_num = month.split('-')
                year_int = int(year)
                month_int = int(month_num)
                start_date = datetime(year_int, month_int, 1).date()
                if month_int == 12:
                    end_date = datetime(year_int + 1, 1, 1).date()
                else:
                    end_date = datetime(year_int, month_int + 1, 1).date()
                transactions = transactions.filter(
                    transaction_date__gte=start_date,
                    transaction_date__lt=end_date
                )
            except (ValueError, AttributeError):
                pass

        # Calculate totals
        income_total = transactions.filter(
            transaction_type='INCOME'
        ).aggregate(total=Sum('amount'))['total'] or 0

        expense_total = transactions.filter(
            transaction_type='EXPENSE'
        ).aggregate(total=Sum('amount'))['total'] or 0

        net_balance = income_total - expense_total

        # Income breakdown
        income_breakdown = transactions.filter(
            transaction_type='INCOME'
        ).values('income_category').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        # Expense breakdown
        expense_breakdown = transactions.filter(
            transaction_type='EXPENSE'
        ).values('expense_category').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('-total')

        # Budget alerts
        budgets_at_risk = Budget.objects.filter(is_exceeded=True)
        if academic_year_id:
            budgets_at_risk = budgets_at_risk.filter(academic_year_id=academic_year_id)

        budget_alerts = []
        for budget in budgets_at_risk[:10]:
            budget_alerts.append({
                'category': budget.category.name,
                'allocated': float(budget.allocated_amount),
                'spent': float(budget.spent_amount),
                'utilization': float(budget.utilization_percentage)
            })

        # Recent transactions - explicitly freshest first
        recent_transactions = transactions.order_by('-transaction_date', '-id')[:15]
        recent_data = []
        for txn in recent_transactions:
            recent_data.append({
                'id': txn.id,
                'type': txn.transaction_type,
                'category': txn.income_category if txn.transaction_type == 'INCOME' else txn.expense_category,
                'category_display': txn.get_income_category_display() if txn.transaction_type == 'INCOME' else txn.get_expense_category_display(),
                'amount': float(txn.amount),
                'date': txn.transaction_date,
                'description': txn.description
            })

        return Response({
            'summary': {
                'total_income': float(income_total),
                'total_expenses': float(expense_total),
                'net_balance': float(net_balance),
                'transaction_count': transactions.count()
            },
            'income_breakdown': [
                {
                    'category': item['income_category'],
                    'total': float(item['total']),
                    'count': item['count']
                } for item in income_breakdown
            ],
            'expense_breakdown': [
                {
                    'category': item['expense_category'],
                    'total': float(item['total']),
                    'count': item['count']
                } for item in expense_breakdown
            ],
            'budget_alerts': budget_alerts,
            'recent_transactions': recent_data
        })

    @action(detail=False, methods=['get'])
    def cash_flow(self, request):
        """
        GET /api/finance/reports/cash-flow/
        Query params: ?academic_year_id=1&period=month (month or quarter)

        Returns cash flow analysis by period
        """
        academic_year_id = request.query_params.get('academic_year_id')
        period = request.query_params.get('period', 'month')  # month or quarter

        transactions = FinancialTransaction.objects.filter(status='COMPLETED')
        if academic_year_id:
            transactions = transactions.filter(academic_year_id=academic_year_id)

        # Group by period
        if period == 'quarter':
            trunc_func = TruncQuarter
        else:
            trunc_func = TruncMonth

        cash_flow_data = transactions.annotate(
            period=trunc_func('transaction_date')
        ).values('period', 'transaction_type').annotate(
            total=Sum('amount')
        ).order_by('period', 'transaction_type')

        # Organize data by period
        periods = {}
        for item in cash_flow_data:
            period_key = item['period'].strftime('%Y-%m' if period == 'month' else '%Y-Q%q')
            if period_key not in periods:
                periods[period_key] = {'income': 0, 'expense': 0}

            if item['transaction_type'] == 'INCOME':
                periods[period_key]['income'] = float(item['total'])
            else:
                periods[period_key]['expense'] = float(item['total'])

        # Calculate net for each period
        result = []
        for period_key, values in periods.items():
            result.append({
                'period': period_key,
                'income': values['income'],
                'expense': values['expense'],
                'net': values['income'] - values['expense']
            })

        return Response({'cash_flow': result})

    @action(detail=False, methods=['get'])
    def income_statement(self, request):
        """
        GET /api/finance/reports/income-statement/
        Query params: ?academic_year_id=1&start_date=2024-01-01&end_date=2024-12-31

        Returns detailed income statement (income vs expenses)
        """
        academic_year_id = request.query_params.get('academic_year_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        transactions = FinancialTransaction.objects.filter(status='COMPLETED')

        if academic_year_id:
            transactions = transactions.filter(academic_year_id=academic_year_id)
        if start_date:
            transactions = transactions.filter(transaction_date__gte=start_date)
        if end_date:
            transactions = transactions.filter(transaction_date__lte=end_date)

        # Income categories
        income_categories = transactions.filter(
            transaction_type='INCOME'
        ).values('income_category').annotate(
            total=Sum('amount'),
            count=Count('id')
        )

        income_data = [
            {
                'category': item['income_category'],
                'total': float(item['total']),
                'count': item['count']
            } for item in income_categories
        ]

        total_income = sum(item['total'] for item in income_data)

        # Expense categories
        expense_categories = transactions.filter(
            transaction_type='EXPENSE'
        ).values('expense_category').annotate(
            total=Sum('amount'),
            count=Count('id')
        )

        expense_data = [
            {
                'category': item['expense_category'],
                'total': float(item['total']),
                'count': item['count']
            } for item in expense_categories
        ]

        total_expenses = sum(item['total'] for item in expense_data)

        return Response({
            'income': {
                'categories': income_data,
                'total': total_income
            },
            'expenses': {
                'categories': expense_data,
                'total': total_expenses
            },
            'net_income': total_income - total_expenses
        })

    @action(detail=False, methods=['get'])
    def payroll_summary(self, request):
        """
        GET /api/finance/reports/payroll-summary/
        Query params: ?academic_year_id=1&period_id=5

        Returns payroll analytics and summaries
        """
        academic_year_id = request.query_params.get('academic_year_id')
        period_id = request.query_params.get('period_id')

        entries = PayrollEntry.objects.all()

        if period_id:
            entries = entries.filter(payroll_period_id=period_id)
        elif academic_year_id:
            entries = entries.filter(payroll_period__academic_year_id=academic_year_id)

        # Summary statistics
        summary = entries.aggregate(
            total_gross=Sum('gross_salary'),
            total_deductions=Sum('total_deductions'),
            total_net=Sum('net_salary'),
            employee_count=Count('employee', distinct=True),
            avg_gross=Avg('gross_salary'),
            avg_net=Avg('net_salary')
        )

        # Payroll by contract type
        by_contract_type = entries.values('contract__contract_type').annotate(
            employee_count=Count('id'),
            total_gross=Sum('gross_salary'),
            total_net=Sum('net_salary')
        )

        # Payroll by period
        by_period = entries.values('payroll_period__period_start').annotate(
            employee_count=Count('id'),
            total_gross=Sum('gross_salary'),
            total_net=Sum('net_salary')
        ).order_by('-payroll_period__period_start')

        return Response({
            'summary': {
                'total_gross': float(summary['total_gross'] or 0),
                'total_deductions': float(summary['total_deductions'] or 0),
                'total_net': float(summary['total_net'] or 0),
                'employee_count': summary['employee_count'],
                'avg_gross': float(summary['avg_gross'] or 0),
                'avg_net': float(summary['avg_net'] or 0)
            },
            'by_contract_type': [
                {
                    'contract_type': item['contract__contract_type'],
                    'employee_count': item['employee_count'],
                    'total_gross': float(item['total_gross']),
                    'total_net': float(item['total_net'])
                } for item in by_contract_type
            ],
            'by_period': [
                {
                    'period_start': item['payroll_period__period_start'],
                    'employee_count': item['employee_count'],
                    'total_gross': float(item['total_gross']),
                    'total_net': float(item['total_net'])
                } for item in by_period
            ]
        })

    @action(detail=False, methods=['get'])
    def expense_breakdown(self, request):
        """
        GET /api/finance/reports/expense-breakdown/
        Query params: ?academic_year_id=1&category=SALARY&start_date=2024-01-01&end_date=2024-12-31

        Returns detailed expense breakdown with trends
        """
        academic_year_id = request.query_params.get('academic_year_id')
        category = request.query_params.get('category')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        expenses = ExpenseRecord.objects.filter(status='APPROVED')

        if academic_year_id:
            expenses = expenses.filter(academic_year_id=academic_year_id)
        if category:
            expenses = expenses.filter(category=category)
        if start_date:
            expenses = expenses.filter(expense_date__gte=start_date)
        if end_date:
            expenses = expenses.filter(expense_date__lte=end_date)

        # Summary
        summary = expenses.aggregate(
            total_amount=Sum('amount'),
            total_paid=Sum('paid_amount'),
            expense_count=Count('id')
        )

        # By category
        by_category = expenses.values('category').annotate(
            total=Sum('amount'),
            count=Count('id'),
            paid=Sum('paid_amount')
        ).order_by('-total')

        # By payment status
        by_payment_status = expenses.values('payment_status').annotate(
            total=Sum('amount'),
            count=Count('id')
        )

        # Monthly trend
        monthly_trend = expenses.annotate(
            month=TruncMonth('expense_date')
        ).values('month').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('month')

        return Response({
            'summary': {
                'total_amount': float(summary['total_amount'] or 0),
                'total_paid': float(summary['total_paid'] or 0),
                'total_pending': float((summary['total_amount'] or 0) - (summary['total_paid'] or 0)),
                'expense_count': summary['expense_count']
            },
            'by_category': [
                {
                    'category': item['category'],
                    'total': float(item['total']),
                    'paid': float(item['paid'] or 0),
                    'count': item['count']
                } for item in by_category
            ],
            'by_payment_status': [
                {
                    'status': item['payment_status'],
                    'total': float(item['total']),
                    'count': item['count']
                } for item in by_payment_status
            ],
            'monthly_trend': [
                {
                    'month': item['month'].strftime('%Y-%m'),
                    'total': float(item['total']),
                    'count': item['count']
                } for item in monthly_trend
            ]
        })

    @action(detail=False, methods=['get'])
    def budget_tracking(self, request):
        """
        GET /api/finance/reports/budget-tracking/
        Query params: ?academic_year_id=1

        Returns budget vs actual spending analysis
        """
        academic_year_id = request.query_params.get('academic_year_id')

        budgets = Budget.objects.all()
        if academic_year_id:
            budgets = budgets.filter(academic_year_id=academic_year_id)

        budget_data = []
        for budget in budgets:
            budget_data.append({
                'id': budget.id,
                'category': budget.category.name,
                'allocated': float(budget.allocated_amount),
                'spent': float(budget.spent_amount),
                'remaining': float(budget.remaining_amount),
                'utilization_percentage': float(budget.utilization_percentage),
                'is_exceeded': budget.is_exceeded,
                'alert_threshold': float(budget.alert_threshold),
                'threshold_reached': budget.check_threshold()
            })

        # Summary statistics
        total_allocated = sum(item['allocated'] for item in budget_data)
        total_spent = sum(item['spent'] for item in budget_data)
        total_remaining = sum(item['remaining'] for item in budget_data)

        return Response({
            'summary': {
                'total_allocated': total_allocated,
                'total_spent': total_spent,
                'total_remaining': total_remaining,
                'overall_utilization': (total_spent / total_allocated * 100) if total_allocated > 0 else 0,
                'budgets_exceeded': sum(1 for item in budget_data if item['is_exceeded'])
            },
            'budgets': budget_data
        })

    @action(detail=False, methods=['get'])
    def fuel_tracking(self, request):
        """
        GET /api/finance/reports/fuel-tracking/
        Query params: ?academic_year_id=1&month=2026-01

        Returns comprehensive fuel tracking including voucher purchases and refill history
        """
        academic_year_id = request.query_params.get('academic_year_id')
        month = request.query_params.get('month')  # YYYY-MM format

        # Get voucher purchases (ExpenseRecords with category FUEL)
        voucher_purchases = ExpenseRecord.objects.filter(
            category='FUEL',
            status='APPROVED'
        )

        # Get all refill records from GasoilRecord (both CASH and VOUCHER)
        from schools.models import GasoilRecord, Vehicle
        refills = GasoilRecord.objects.select_related('vehicle').all()

        if academic_year_id:
            voucher_purchases = voucher_purchases.filter(academic_year_id=academic_year_id)
            # Filter refills by academic year date range
            try:
                from schools.models import AcademicYear
                academic_year = AcademicYear.objects.get(id=academic_year_id)
                refills = refills.filter(
                    refuel_date__gte=academic_year.start_date,
                    refuel_date__lte=academic_year.end_date
                )
            except:
                pass

        if month:
            try:
                year, month_num = month.split('-')
                year_int = int(year)
                month_int = int(month_num)
                from datetime import datetime
                start_date = datetime(year_int, month_int, 1).date()
                if month_int == 12:
                    end_date = datetime(year_int + 1, 1, 1).date()
                else:
                    end_date = datetime(year_int, month_int + 1, 1).date()
                
                voucher_purchases = voucher_purchases.filter(
                    expense_date__gte=start_date,
                    expense_date__lt=end_date
                )
                refills = refills.filter(
                    refuel_date__gte=start_date,
                    refuel_date__lt=end_date
                )
            except (ValueError, AttributeError):
                pass

        # Calculate voucher purchases by month
        monthly_purchases = voucher_purchases.annotate(
            month=TruncMonth('expense_date')
        ).values('month').annotate(
            total_purchased=Sum('amount'),
            purchase_count=Count('id')
        ).order_by('month')

        monthly_purchases_data = [
            {
                'month': item['month'].strftime('%Y-%m'),
                'total_purchased': float(item['total_purchased']),
                'purchase_count': item['purchase_count']
            } for item in monthly_purchases
        ]

        # Calculate refills data
        refills_data = []
        for refill in refills.order_by('-refuel_date'):
            refills_data.append({
                'id': refill.id,
                'vehicle': str(refill.vehicle),
                'vehicle_id': refill.vehicle.id,
                'date': refill.refuel_date,
                'liters': float(refill.liters),
                'amount': float(refill.amount),
                'payment_method': refill.payment_method,
                'fuel_station': refill.fuel_station,
                'receipt_number': refill.receipt_number
            })

        # Calculate summary
        total_vouchers_purchased = voucher_purchases.aggregate(total=Sum('amount'))['total'] or 0
        total_voucher_refills = refills.filter(payment_method='VOUCHER').aggregate(total=Sum('amount'))['total'] or 0
        total_cash_refills = refills.filter(payment_method='CASH').aggregate(total=Sum('amount'))['total'] or 0
        total_liters = refills.aggregate(total=Sum('liters'))['total'] or 0

        # By vehicle summary
        vehicles = Vehicle.objects.all()
        by_vehicle = []
        for vehicle in vehicles:
            vehicle_refills = refills.filter(vehicle=vehicle)
            if vehicle_refills.exists():
                vehicle_summary = vehicle_refills.aggregate(
                    total_amount=Sum('amount'),
                    total_liters=Sum('liters'),
                    refuel_count=Count('id')
                )
                by_vehicle.append({
                    'vehicle_id': vehicle.id,
                    'vehicle': str(vehicle),
                    'total_amount': float(vehicle_summary['total_amount'] or 0),
                    'total_liters': float(vehicle_summary['total_liters'] or 0),
                    'refuel_count': vehicle_summary['refuel_count']
                })

        return Response({
            'monthly_purchases': monthly_purchases_data,
            'refills': refills_data,
            'by_vehicle': by_vehicle,
            'summary': {
                'total_vouchers_purchased': float(total_vouchers_purchased),
                'total_voucher_refills': float(total_voucher_refills),
                'total_cash_refills': float(total_cash_refills),
                'total_refills': float(total_voucher_refills + total_cash_refills),
                'voucher_balance': float(total_vouchers_purchased - total_voucher_refills),
                'total_liters': float(total_liters),
                'refill_count': refills.count(),
                'avg_price_per_liter': float((total_voucher_refills + total_cash_refills) / total_liters) if total_liters > 0 else 0
            }
        })

    @action(detail=False, methods=['get'])
    def fuel_analytics(self, request):
        """
        GET /api/finance/reports/fuel-analytics/
        Query params: ?academic_year_id=1&start_date=2024-01-01&end_date=2024-12-31

        Returns fuel consumption trends and analytics (DEPRECATED - use fuel-tracking instead)
        """
        academic_year_id = request.query_params.get('academic_year_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Get fuel transactions
        fuel_transactions = FinancialTransaction.objects.filter(
            expense_category='FUEL',
            status='COMPLETED',
            gasoil_record__isnull=False
        )

        if academic_year_id:
            fuel_transactions = fuel_transactions.filter(academic_year_id=academic_year_id)
        if start_date:
            fuel_transactions = fuel_transactions.filter(transaction_date__gte=start_date)
        if end_date:
            fuel_transactions = fuel_transactions.filter(transaction_date__lte=end_date)

        # Summary
        summary = fuel_transactions.aggregate(
            total_amount=Sum('amount'),
            total_liters=Sum('gasoil_record__liters'),
            refuel_count=Count('id'),
            avg_amount=Avg('amount'),
            avg_liters=Avg('gasoil_record__liters')
        )

        # By vehicle
        from schools.models import Vehicle
        vehicles = Vehicle.objects.all()
        by_vehicle = []
        for vehicle in vehicles:
            vehicle_txns = fuel_transactions.filter(gasoil_record__vehicle=vehicle)
            if vehicle_txns.exists():
                vehicle_summary = vehicle_txns.aggregate(
                    total_amount=Sum('amount'),
                    total_liters=Sum('gasoil_record__liters'),
                    refuel_count=Count('id')
                )
                by_vehicle.append({
                    'vehicle': str(vehicle),
                    'total_amount': float(vehicle_summary['total_amount'] or 0),
                    'total_liters': float(vehicle_summary['total_liters'] or 0),
                    'refuel_count': vehicle_summary['refuel_count']
                })

        # Monthly trend
        monthly_trend = fuel_transactions.annotate(
            month=TruncMonth('transaction_date')
        ).values('month').annotate(
            total_amount=Sum('amount'),
            total_liters=Sum('gasoil_record__liters'),
            refuel_count=Count('id')
        ).order_by('month')

        return Response({
            'summary': {
                'total_amount': float(summary['total_amount'] or 0),
                'total_liters': float(summary['total_liters'] or 0),
                'refuel_count': summary['refuel_count'],
                'avg_amount_per_refuel': float(summary['avg_amount'] or 0),
                'avg_liters_per_refuel': float(summary['avg_liters'] or 0),
                'avg_price_per_liter': float((summary['total_amount'] or 0) / (summary['total_liters'] or 1))
            },
            'by_vehicle': by_vehicle,
            'monthly_trend': [
                {
                    'month': item['month'].strftime('%Y-%m'),
                    'total_amount': float(item['total_amount']),
                    'total_liters': float(item['total_liters']),
                    'refuel_count': item['refuel_count']
                } for item in monthly_trend
            ]
        })

