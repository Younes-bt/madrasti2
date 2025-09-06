# attendance/models.py

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from cloudinary.models import CloudinaryField
from datetime import time, datetime, date

# =====================================
# TIMETABLE/SCHEDULE MODELS
# =====================================

class SchoolTimetable(models.Model):
    """Main timetable for each class in an academic year"""
    school_class = models.ForeignKey('schools.SchoolClass', on_delete=models.CASCADE, related_name='timetables')
    academic_year = models.ForeignKey('schools.AcademicYear', on_delete=models.CASCADE, related_name='timetables')
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='created_timetables'
    )
    
    class Meta:
        unique_together = ['school_class', 'academic_year']
        ordering = ['school_class__grade__educational_level__order', 'school_class__grade__grade_number', 'school_class__section']
        verbose_name = "School Timetable"
        verbose_name_plural = "School Timetables"
    
    def __str__(self):
        return f"Timetable - {self.school_class.name} ({self.academic_year.year})"
    
    def save(self, *args, **kwargs):
        # Only one active timetable per class per academic year
        if self.is_active:
            SchoolTimetable.objects.filter(
                school_class=self.school_class,
                academic_year=self.academic_year,
                is_active=True
            ).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

class TimetableSession(models.Model):
    """Individual class sessions in the timetable"""
    DAYS_OF_WEEK = [
        (1, 'الإثنين - Lundi'),
        (2, 'الثلاثاء - Mardi'),
        (3, 'الأربعاء - Mercredi'),
        (4, 'الخميس - Jeudi'),
        (5, 'الجمعة - Vendredi'),
        (6, 'السبت - Samedi'),
    ]
    
    timetable = models.ForeignKey(SchoolTimetable, on_delete=models.CASCADE, related_name='sessions')
    subject = models.ForeignKey('schools.Subject', on_delete=models.CASCADE, related_name='timetable_sessions')
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='teaching_sessions',
        limit_choices_to={'role': 'TEACHER'}
    )
    
    # Schedule details
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField(help_text="Session start time (e.g., 08:30)")
    end_time = models.TimeField(help_text="Session end time (e.g., 09:25)")
    session_order = models.PositiveIntegerField(help_text="Period number (1st, 2nd, etc.)")
    
    # Optional room assignment
    room = models.ForeignKey('schools.Room', on_delete=models.SET_NULL, null=True, blank=True, related_name='scheduled_sessions')
    
    # Session settings
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, help_text="Session notes or special instructions")
    
    class Meta:
        unique_together = [
            ['timetable', 'day_of_week', 'session_order'],  # No overlapping sessions
            ['teacher', 'day_of_week', 'start_time', 'end_time']  # Teacher can't be in two places
        ]
        ordering = ['day_of_week', 'session_order', 'start_time']
        verbose_name = "Timetable Session"
        verbose_name_plural = "Timetable Sessions"
    
    def __str__(self):
        day_name = dict(self.DAYS_OF_WEEK)[self.day_of_week]
        return f"{self.timetable.school_class.name} - {self.subject.name} - {day_name} {self.start_time}"
    
    def clean(self):
        """Validate session times"""
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time")
        
        # Check for teacher schedule conflicts
        if self.teacher_id:
            overlapping = TimetableSession.objects.filter(
                teacher=self.teacher,
                day_of_week=self.day_of_week,
                start_time__lt=self.end_time,
                end_time__gt=self.start_time,
                is_active=True
            ).exclude(pk=self.pk)
            
            if overlapping.exists():
                raise ValidationError(f"Teacher {self.teacher.full_name} has a schedule conflict on {dict(self.DAYS_OF_WEEK)[self.day_of_week]}")

# =====================================
# ATTENDANCE MODELS
# =====================================

class AttendanceSession(models.Model):
    """A specific instance of attendance taking for a timetable session"""
    STATUS_CHOICES = [
        ('not_started', 'لم تبدأ - Not Started'),
        ('in_progress', 'جارية - In Progress'),
        ('completed', 'مكتملة - Completed'),
        ('cancelled', 'ملغية - Cancelled'),
    ]
    
    timetable_session = models.ForeignKey(TimetableSession, on_delete=models.CASCADE, related_name='attendance_sessions')
    date = models.DateField(help_text="Date when attendance was taken")
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='taken_attendance_sessions',
        limit_choices_to={'role': 'TEACHER'}
    )
    
    # Session status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    
    # Session metadata
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, help_text="General session notes")
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['timetable_session', 'date']
        ordering = ['-date', '-created_at']
        verbose_name = "Attendance Session"
        verbose_name_plural = "Attendance Sessions"
    
    def __str__(self):
        return f"Attendance - {self.timetable_session.timetable.school_class.name} - {self.timetable_session.subject.name} - {self.date}"
    
    def start_session(self):
        """Start taking attendance"""
        if self.status == 'not_started':
            self.status = 'in_progress'
            self.started_at = timezone.now()
            self.save()
            
            # Create attendance records for all students in the class
            from django.contrib.auth import get_user_model
            User = get_user_model()
            from users.models import StudentEnrollment
            enrollments = StudentEnrollment.objects.filter(
                school_class=self.timetable_session.timetable.school_class,
                academic_year=self.timetable_session.timetable.academic_year,
                is_active=True
            ).select_related('student')
            students = [enrollment.student for enrollment in enrollments]
            
            for student in students:
                AttendanceRecord.objects.get_or_create(
                    attendance_session=self,
                    student=student,
                    defaults={
                        'status': 'present',  # Default to present
                        'marked_by': self.teacher
                    }
                )
    
    def complete_session(self):
        """Complete attendance session"""
        if self.status == 'in_progress':
            self.status = 'completed'
            self.completed_at = timezone.now()
            self.save()
            
            # Create flags for absent students
            absent_records = self.attendance_records.filter(status='absent')
            for record in absent_records:
                StudentAbsenceFlag.objects.get_or_create(
                    student=record.student,
                    attendance_record=record
                )
    
    @property
    def total_students(self):
        """Total number of students in the class"""
        return self.attendance_records.count()
    
    @property
    def present_count(self):
        """Number of present students"""
        return self.attendance_records.filter(status='present').count()
    
    @property
    def absent_count(self):
        """Number of absent students"""
        return self.attendance_records.filter(status='absent').count()
    
    @property
    def late_count(self):
        """Number of late students"""
        return self.attendance_records.filter(status='late').count()

class AttendanceRecord(models.Model):
    """Individual student attendance record for a session"""
    ATTENDANCE_STATUS = [
        ('present', 'حاضر - Present'),
        ('absent', 'غائب - Absent'),
        ('late', 'متأخر - Late'),
        ('excused', 'غياب مبرر - Excused Absence'),
    ]
    
    attendance_session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name='attendance_records')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='attendance_records',
        limit_choices_to={'role': 'STUDENT'}
    )
    
    # Attendance details
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS, default='present')
    marked_at = models.DateTimeField(auto_now_add=True)
    marked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='marked_attendance_records'
    )
    
    # Additional details
    arrival_time = models.TimeField(null=True, blank=True, help_text="Actual arrival time for late students")
    notes = models.TextField(blank=True, help_text="Teacher notes for this student")
    
    # Tracking
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['attendance_session', 'student']
        ordering = ['student__last_name', 'student__first_name']
        verbose_name = "Attendance Record"
        verbose_name_plural = "Attendance Records"
    
    def __str__(self):
        return f"{self.student.full_name} - {self.get_status_display()} - {self.attendance_session.date}"

# =====================================
# STUDENT ABSENCE FLAG SYSTEM
# =====================================

class StudentAbsenceFlag(models.Model):
    """Badge system for tracking student absences that need attention"""
    CLEARANCE_REASONS = [
        ('medical', 'شهادة طبية - Medical Certificate'),
        ('family', 'حالة طارئة عائلية - Family Emergency'),
        ('parent_permission', 'إذن من الولي - Parent Permission'),
        ('school_activity', 'نشاط مدرسي - School Activity'),
        ('other', 'أخرى - Other (see notes)')
    ]
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='absence_flags',
        limit_choices_to={'role': 'STUDENT'}
    )
    attendance_record = models.ForeignKey(AttendanceRecord, on_delete=models.CASCADE, related_name='flags')
    
    # Flag status
    is_cleared = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Clearance information
    cleared_at = models.DateTimeField(null=True, blank=True)
    cleared_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='cleared_flags'
    )
    clearance_reason = models.CharField(max_length=20, choices=CLEARANCE_REASONS, null=True, blank=True)
    clearance_notes = models.TextField(blank=True)
    clearance_document = CloudinaryField(
        'document', 
        null=True, 
        blank=True,
        folder='absence_documents',
        resource_type='auto'
    )
    
    class Meta:
        unique_together = ['student', 'attendance_record']
        ordering = ['-created_at']
        verbose_name = "Student Absence Flag"
        verbose_name_plural = "Student Absence Flags"
    
    def __str__(self):
        status = "Cleared" if self.is_cleared else "Pending"
        return f"Flag - {self.student.full_name} - {self.attendance_record.attendance_session.date} - {status}"
    
    def clear_flag(self, cleared_by, reason, notes="", document=None):
        """Clear the absence flag"""
        self.is_cleared = True
        self.cleared_at = timezone.now()
        self.cleared_by = cleared_by
        self.clearance_reason = reason
        self.clearance_notes = notes
        if document:
            self.clearance_document = document
        self.save()
        
        # Update the original attendance record to excused if appropriate
        if reason in ['medical', 'parent_permission', 'school_activity']:
            self.attendance_record.status = 'excused'
            self.attendance_record.save()

# =====================================
# PARENT-STUDENT RELATIONSHIP MODEL
# =====================================

class StudentParentRelation(models.Model):
    """Relationship between students and parents for notifications"""
    RELATIONSHIP_TYPES = [
        ('father', 'والد - Father'),
        ('mother', 'والدة - Mother'),
        ('guardian', 'ولي أمر - Guardian'),
        ('other', 'أخرى - Other')
    ]
    
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='parent_relations',
        limit_choices_to={'role': 'STUDENT'}
    )
    parent = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='children_relations',
        limit_choices_to={'role': 'PARENT'}
    )
    
    relationship_type = models.CharField(max_length=10, choices=RELATIONSHIP_TYPES, default='father')
    is_primary_contact = models.BooleanField(default=False, help_text="Primary contact for notifications")
    is_active = models.BooleanField(default=True)
    
    # Contact preferences
    notify_absence = models.BooleanField(default=True)
    notify_late = models.BooleanField(default=True)
    notify_flags = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'parent']
        verbose_name = "Student-Parent Relation"
        verbose_name_plural = "Student-Parent Relations"
    
    def __str__(self):
        return f"{self.parent.full_name} - {self.student.full_name} ({self.get_relationship_type_display()})"

# StudentEnrollment has been moved to the users app

# =====================================
# NOTIFICATION MODEL FOR ATTENDANCE
# =====================================

class AttendanceNotification(models.Model):
    """Notifications sent to parents about attendance"""
    NOTIFICATION_TYPES = [
        ('absence', 'إخطار غياب - Absence Alert'),
        ('late', 'إخطار تأخير - Late Alert'),
        ('flag_created', 'علامة غياب - Flag Created'),
        ('flag_cleared', 'تم حل العلامة - Flag Cleared'),
        ('chronic_absence', 'غياب مزمن - Chronic Absence Alert')
    ]
    
    DELIVERY_STATUS = [
        ('pending', 'في الانتظار - Pending'),
        ('sent', 'تم الإرسال - Sent'),
        ('delivered', 'تم التسليم - Delivered'),
        ('failed', 'فشل - Failed')
    ]
    
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='received_attendance_notifications'
    )
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='attendance_notifications',
        limit_choices_to={'role': 'STUDENT'}
    )
    
    # Notification details
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Related objects
    attendance_record = models.ForeignKey(AttendanceRecord, on_delete=models.CASCADE, null=True, blank=True)
    absence_flag = models.ForeignKey(StudentAbsenceFlag, on_delete=models.CASCADE, null=True, blank=True)
    
    # Delivery status
    status = models.CharField(max_length=10, choices=DELIVERY_STATUS, default='pending')
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Attendance Notification"
        verbose_name_plural = "Attendance Notifications"
    
    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.recipient.full_name} - {self.student.full_name}"
    
    def mark_as_sent(self):
        """Mark notification as sent"""
        self.status = 'sent'
        self.sent_at = timezone.now()
        self.save()
    
    def mark_as_delivered(self):
        """Mark notification as delivered"""
        self.status = 'delivered'
        self.delivered_at = timezone.now()
        self.save()
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.read_at = timezone.now()
        self.save()
