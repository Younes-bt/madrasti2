from rest_framework import serializers
from .models import FeeCategory, FeeStructure, Invoice, InvoiceItem, Payment
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
