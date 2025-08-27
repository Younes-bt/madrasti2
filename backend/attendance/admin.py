# attendance/admin.py

from django.contrib import admin
from .models import (
    SchoolTimetable, TimetableSession, AttendanceSession, AttendanceRecord,
    StudentAbsenceFlag, StudentParentRelation, StudentEnrollment,
    AttendanceNotification
)

@admin.register(SchoolTimetable)
class SchoolTimetableAdmin(admin.ModelAdmin):
    list_display = ['school_class', 'academic_year', 'is_active', 'created_at']
    list_filter = ['is_active', 'academic_year', 'created_at']
    search_fields = ['school_class__name', 'academic_year__year']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(TimetableSession)
class TimetableSessionAdmin(admin.ModelAdmin):
    list_display = ['timetable', 'subject', 'teacher', 'day_of_week', 'start_time', 'end_time', 'is_active']
    list_filter = ['day_of_week', 'is_active', 'subject', 'teacher']
    search_fields = ['timetable__school_class__name', 'subject__name', 'teacher__first_name', 'teacher__last_name']
    ordering = ['timetable', 'day_of_week', 'session_order']

@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ['timetable_session', 'date', 'teacher', 'status', 'total_students', 'present_count', 'absent_count']
    list_filter = ['status', 'date', 'teacher']
    search_fields = ['timetable_session__timetable__school_class__name', 'timetable_session__subject__name']
    readonly_fields = ['created_at', 'updated_at', 'total_students', 'present_count', 'absent_count', 'late_count']
    date_hierarchy = 'date'

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['student', 'attendance_session', 'status', 'marked_at', 'marked_by']
    list_filter = ['status', 'marked_at', 'attendance_session__date']
    search_fields = ['student__first_name', 'student__last_name', 'student__email']
    readonly_fields = ['marked_at', 'updated_at']
    date_hierarchy = 'attendance_session__date'

@admin.register(StudentAbsenceFlag)
class StudentAbsenceFlagAdmin(admin.ModelAdmin):
    list_display = ['student', 'attendance_record', 'is_cleared', 'created_at', 'cleared_by']
    list_filter = ['is_cleared', 'clearance_reason', 'created_at']
    search_fields = ['student__first_name', 'student__last_name']
    readonly_fields = ['created_at', 'cleared_at']
    actions = ['mark_as_cleared']
    
    def mark_as_cleared(self, request, queryset):
        updated = queryset.update(is_cleared=True)
        self.message_user(request, f'{updated} flags marked as cleared.')
    mark_as_cleared.short_description = 'Mark selected flags as cleared'

@admin.register(StudentParentRelation)
class StudentParentRelationAdmin(admin.ModelAdmin):
    list_display = ['student', 'parent', 'relationship_type', 'is_primary_contact', 'is_active']
    list_filter = ['relationship_type', 'is_primary_contact', 'is_active']
    search_fields = ['student__first_name', 'student__last_name', 'parent__first_name', 'parent__last_name']

@admin.register(StudentEnrollment)
class StudentEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'school_class', 'academic_year', 'enrollment_date', 'is_active']
    list_filter = ['is_active', 'academic_year', 'school_class']
    search_fields = ['student__first_name', 'student__last_name', 'school_class__name']
    date_hierarchy = 'enrollment_date'

@admin.register(AttendanceNotification)
class AttendanceNotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'student', 'notification_type', 'status', 'created_at', 'read_at']
    list_filter = ['notification_type', 'status', 'created_at']
    search_fields = ['recipient__first_name', 'recipient__last_name', 'student__first_name', 'student__last_name']
    readonly_fields = ['created_at', 'sent_at', 'delivered_at', 'read_at']
    date_hierarchy = 'created_at'
