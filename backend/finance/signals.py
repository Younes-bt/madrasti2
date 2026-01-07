"""
Django signals for automatic FinancialTransaction creation.

These signals create unified financial transaction records whenever:
- Student fee payments are recorded
- Fuel (Gasoil) records are created
- Payroll entries are marked as paid
- Expenses are approved

This ensures all financial data flows into the FinancialTransaction model
which serves as the single source of truth for financial reporting.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payment, PayrollEntry, FinancialTransaction, TransactionType


@receiver(post_save, sender=Payment)
def create_payment_transaction(sender, instance, created, **kwargs):
    """
    Automatically create a FinancialTransaction when a student fee Payment is recorded.
    """
    if created:
        # Create an income transaction for the student fee payment
        FinancialTransaction.objects.create(
            transaction_type=TransactionType.INCOME,
            income_category='STUDENT_FEES',
            amount=instance.amount,
            transaction_date=instance.date,
            academic_year=instance.invoice.academic_year,
            invoice=instance.invoice,
            description=f"Student fee payment - Invoice #{instance.invoice.id}",
            payment_method=instance.method,
            reference_number=instance.transaction_id or '',
            status='COMPLETED',
            recorded_by=instance.recorded_by,
            notes=instance.notes
        )


@receiver(post_save, sender='schools.GasoilRecord')
def create_gasoil_transaction(sender, instance, created, **kwargs):
    """
    Automatically create a FinancialTransaction when a GasoilRecord (fuel) is created.
    Only creates transaction for CASH refills - voucher refills are already recorded as expenses.
    """
    if created and instance.payment_method == 'CASH':
        # Import here to avoid circular import
        from schools.models import AcademicYear

        # Try to find the academic year that contains this fuel record date
        academic_year = AcademicYear.objects.filter(
            start_date__lte=instance.refuel_date,
            end_date__gte=instance.refuel_date
        ).first()

        # Fallback to current academic year if no match
        if not academic_year:
            academic_year = AcademicYear.objects.filter(is_current=True).first()

        # Only create transaction if we have an academic year
        if academic_year:
            FinancialTransaction.objects.create(
                transaction_type=TransactionType.EXPENSE,
                expense_category='FUEL',
                amount=instance.amount,
                transaction_date=instance.refuel_date,
                academic_year=academic_year,
                gasoil_record=instance,
                description=f"Fuel refill for {instance.vehicle} - {instance.liters}L at {instance.fuel_station}" if instance.fuel_station else f"Fuel refill for {instance.vehicle} - {instance.liters}L",
                payment_method='CASH',
                reference_number=instance.receipt_number or '',
                status='COMPLETED',
                notes=instance.notes
            )



@receiver(post_save, sender=PayrollEntry)
def create_payroll_transaction(sender, instance, created, **kwargs):
    """
    Automatically create or update a FinancialTransaction when a PayrollEntry is marked as paid.
    Only creates the transaction when is_paid=True.
    """
    # Only create/update transaction if the entry is marked as paid
    if instance.is_paid:
        # Use update_or_create to handle both new payments and updates
        FinancialTransaction.objects.update_or_create(
            payroll_entry=instance,
            defaults={
                'transaction_type': TransactionType.EXPENSE,
                'expense_category': 'SALARY',
                'amount': instance.net_salary,
                'transaction_date': instance.payment_date or instance.payroll_period.payment_date,
                'academic_year': instance.payroll_period.academic_year,
                'description': f"Salary - {instance.employee.get_full_name()} - {instance.payroll_period.period_start} to {instance.payroll_period.period_end}",
                'payment_method': instance.payment_method,
                'reference_number': instance.payment_reference or '',
                'status': 'COMPLETED',
                'notes': instance.notes
            }
        )
    else:
        # If unmarked as paid, delete the transaction if it exists
        FinancialTransaction.objects.filter(payroll_entry=instance).delete()


# Note: ExpenseRecord transactions are NOT created via signals
# They should be created manually or via the API when expenses are approved,
# because expenses need more control over when they're recorded as transactions.
# This allows for draft expenses without creating financial transactions.
