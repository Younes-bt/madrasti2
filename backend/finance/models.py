from django.db import models
from django.conf import settings
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
