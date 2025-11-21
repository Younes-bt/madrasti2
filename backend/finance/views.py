from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from .models import FeeCategory, FeeStructure, Invoice, InvoiceItem, Payment
from .serializers import (
    FeeCategorySerializer, FeeStructureSerializer, InvoiceSerializer, 
    InvoiceCreateSerializer, PaymentSerializer, BulkInvoiceGenerateSerializer
)
from users.models import User
from schools.models import Grade, AcademicYear

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
            year, month = value.split('-')
            return queryset.filter(month__year=year, month__month=month)
        except ValueError:
            return queryset

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = InvoiceFilter
    search_fields = ['student__first_name', 'student__last_name', '=id'] # =id for exact match
    ordering_fields = ['issue_date', 'due_date', 'total_amount', 'status']

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.role == 'STAFF':
            return Invoice.objects.all().order_by('id')
        elif user.role == 'PARENT':
            # Return invoices for all children
            return Invoice.objects.filter(student__parent=user).order_by('id')
        elif user.role == 'STUDENT':
            return Invoice.objects.filter(student=user).order_by('id')
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
                    academic_year=academic_year
                )
                
                students = [e.student for e in enrollments]
                
                # Get fee structure for this grade
                fees = FeeStructure.objects.filter(grade=grade, academic_year=academic_year, category__fee_type='RECURRING')
                
                if not fees.exists():
                    return Response({"error": "No recurring fees defined for this grade"}, status=status.HTTP_400_BAD_REQUEST)

                created_count = 0
                with transaction.atomic():
                    for student in students:
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
                            InvoiceItem.objects.create(
                                invoice=invoice,
                                description=fee.category.name,
                                amount=fee.amount
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
