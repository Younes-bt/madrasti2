# attendance/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from .models import (
    SchoolTimetable, TimetableSession, AttendanceSession, AttendanceRecord,
    StudentAbsenceFlag, StudentParentRelation, AttendanceNotification
)
from users.models import StudentEnrollment

User = get_user_model()

# =====================================
# BASIC SERIALIZERS
# =====================================

class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user information for attendance"""
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'role']
        read_only_fields = ['id', 'email', 'full_name', 'role']

# =====================================
# TIMETABLE SERIALIZERS
# =====================================

class TimetableSessionListSerializer(serializers.ModelSerializer):
    """List view for timetable sessions"""
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_name_arabic = serializers.CharField(source='subject.name_arabic', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    # Add timetable and class information
    timetable_id = serializers.IntegerField(source='timetable.id', read_only=True)
    school_class_id = serializers.IntegerField(source='timetable.school_class.id', read_only=True)
    class_name = serializers.CharField(source='timetable.school_class.name', read_only=True)
    class_section = serializers.CharField(source='timetable.school_class.section', read_only=True)
    academic_year = serializers.CharField(source='timetable.academic_year.year', read_only=True)

    # Add grade information for homework creation
    grade_id = serializers.IntegerField(source='timetable.school_class.grade.id', read_only=True)
    grade_name = serializers.CharField(source='timetable.school_class.grade.name', read_only=True)
    grade_number = serializers.IntegerField(source='timetable.school_class.grade.grade_number', read_only=True)
    educational_level_id = serializers.IntegerField(source='timetable.school_class.grade.educational_level.id', read_only=True)
    educational_level_name = serializers.CharField(source='timetable.school_class.grade.educational_level.name', read_only=True)
    educational_level_code = serializers.CharField(source='timetable.school_class.grade.educational_level.level', read_only=True)

    class Meta:
        model = TimetableSession
        fields = [
            'id', 'timetable', 'timetable_id', 'school_class_id', 'day_of_week', 'day_name', 'start_time', 'end_time',
            'session_order', 'subject', 'subject_name', 'subject_name_arabic',
            'teacher', 'teacher_name', 'room', 'room_name', 'is_active', 'notes',
            'class_name', 'class_section', 'academic_year',
            'grade_id', 'grade_name', 'grade_number', 'educational_level_id', 'educational_level_name', 'educational_level_code'
        ]

class TimetableSessionDetailSerializer(serializers.ModelSerializer):
    """Detailed view for timetable sessions"""
    teacher = UserBasicSerializer(read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_name_arabic = serializers.CharField(source='subject.name_arabic', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = TimetableSession
        fields = [
            'id', 'timetable', 'day_of_week', 'day_name', 'start_time', 'end_time',
            'session_order', 'subject', 'subject_name', 'subject_name_arabic',
            'teacher', 'room', 'room_name', 'is_active', 'notes'
        ]

class SchoolTimetableSerializer(serializers.ModelSerializer):
    """School timetable with sessions"""
    sessions = TimetableSessionListSerializer(many=True, read_only=True)
    school_class_name = serializers.CharField(source='school_class.name', read_only=True)
    academic_year_name = serializers.CharField(source='academic_year.year', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    
    class Meta:
        model = SchoolTimetable
        fields = [
            'id', 'school_class', 'school_class_name', 'academic_year', 
            'academic_year_name', 'is_active', 'sessions', 'created_by_name',
            'created_at', 'updated_at'
        ]

class SchoolTimetableCreateSerializer(serializers.ModelSerializer):
    """Create timetable"""
    
    class Meta:
        model = SchoolTimetable
        fields = ['id', 'school_class', 'academic_year', 'is_active']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class TimetableSessionCreateSerializer(serializers.ModelSerializer):
    """Create timetable session"""
    
    class Meta:
        model = TimetableSession
        fields = [
            'timetable', 'subject', 'teacher', 'day_of_week', 'start_time',
            'end_time', 'session_order', 'room', 'is_active', 'notes'
        ]
    
    def validate(self, attrs):
        """Validate session data"""
        if attrs['start_time'] >= attrs['end_time']:
            raise serializers.ValidationError("Start time must be before end time")
        return attrs

# =====================================
# ATTENDANCE RECORD SERIALIZERS
# =====================================

class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Individual attendance record"""
    student = UserBasicSerializer(read_only=True)
    marked_by_name = serializers.CharField(source='marked_by.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'student', 'status', 'status_display', 'marked_at', 
            'marked_by_name', 'arrival_time', 'notes', 'updated_at'
        ]

class AttendanceRecordUpdateSerializer(serializers.ModelSerializer):
    """Update attendance record"""
    
    class Meta:
        model = AttendanceRecord
        fields = ['status', 'arrival_time', 'notes']
    
    def update(self, instance, validated_data):
        validated_data['marked_by'] = self.context['request'].user
        return super().update(instance, validated_data)

class BulkAttendanceUpdateSerializer(serializers.Serializer):
    """Bulk update attendance records"""
    records = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        )
    )
    
    def validate_records(self, value):
        """Validate bulk records format"""
        for record in value:
            if 'student_id' not in record or 'status' not in record:
                raise serializers.ValidationError("Each record must have student_id and status")
            
            if record['status'] not in ['present', 'absent', 'late', 'excused']:
                raise serializers.ValidationError("Invalid status value")
        
        return value

# =====================================
# ATTENDANCE SESSION SERIALIZERS
# =====================================

class AttendanceSessionListSerializer(serializers.ModelSerializer):
    """List view for attendance sessions"""
    class_name = serializers.CharField(source='timetable_session.timetable.school_class.name', read_only=True)
    subject_name = serializers.CharField(source='timetable_session.subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Statistics
    total_students = serializers.ReadOnlyField()
    present_count = serializers.ReadOnlyField()
    absent_count = serializers.ReadOnlyField()
    late_count = serializers.ReadOnlyField()
    
    class Meta:
        model = AttendanceSession
        fields = [
            'id', 'date', 'status', 'status_display', 'class_name', 'subject_name',
            'teacher_name', 'started_at', 'completed_at', 'total_students',
            'present_count', 'absent_count', 'late_count', 'created_at'
        ]

class AttendanceSessionDetailSerializer(serializers.ModelSerializer):
    """Detailed view for attendance session"""
    timetable_session = TimetableSessionDetailSerializer(read_only=True)
    teacher = UserBasicSerializer(read_only=True)
    attendance_records = AttendanceRecordSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Statistics
    total_students = serializers.ReadOnlyField()
    present_count = serializers.ReadOnlyField()
    absent_count = serializers.ReadOnlyField()
    late_count = serializers.ReadOnlyField()
    
    class Meta:
        model = AttendanceSession
        fields = [
            'id', 'timetable_session', 'date', 'teacher', 'status', 'status_display',
            'started_at', 'completed_at', 'notes', 'attendance_records',
            'total_students', 'present_count', 'absent_count', 'late_count',
            'created_at', 'updated_at'
        ]

class AttendanceSessionCreateSerializer(serializers.ModelSerializer):
    """Create attendance session"""
    
    class Meta:
        model = AttendanceSession
        fields = ['timetable_session', 'date', 'notes']
    
    def create(self, validated_data):
        validated_data['teacher'] = self.context['request'].user
        return super().create(validated_data)

class StartAttendanceSerializer(serializers.Serializer):
    """Serializer to start attendance session"""
    pass

class CompleteAttendanceSerializer(serializers.Serializer):
    """Serializer to complete attendance session"""
    notes = serializers.CharField(required=False, allow_blank=True)

# =====================================
# ABSENCE FLAG SERIALIZERS
# =====================================

class StudentAbsenceFlagSerializer(serializers.ModelSerializer):
    """Student absence flag"""
    student = UserBasicSerializer(read_only=True)
    cleared_by = UserBasicSerializer(read_only=True)
    clearance_reason_display = serializers.CharField(source='get_clearance_reason_display', read_only=True)
    
    # Attendance details
    attendance_date = serializers.DateField(source='attendance_record.attendance_session.date', read_only=True)
    subject_name = serializers.CharField(source='attendance_record.attendance_session.timetable_session.subject.name', read_only=True)
    class_name = serializers.CharField(source='attendance_record.attendance_session.timetable_session.timetable.school_class.name', read_only=True)
    
    class Meta:
        model = StudentAbsenceFlag
        fields = [
            'id', 'student', 'attendance_date', 'subject_name', 'class_name',
            'is_cleared', 'created_at', 'cleared_at', 'cleared_by',
            'clearance_reason', 'clearance_reason_display', 'clearance_notes',
            'clearance_document'
        ]

class ClearAbsenceFlagSerializer(serializers.Serializer):
    """Serializer to clear absence flag"""
    clearance_reason = serializers.ChoiceField(choices=StudentAbsenceFlag.CLEARANCE_REASONS)
    clearance_notes = serializers.CharField(required=False, allow_blank=True)
    clearance_document = serializers.ImageField(required=False)

# =====================================
# STUDENT-PARENT RELATIONSHIP SERIALIZERS
# =====================================

class StudentParentRelationSerializer(serializers.ModelSerializer):
    """Student-parent relationship"""
    student = UserBasicSerializer(read_only=True)
    parent = UserBasicSerializer(read_only=True)
    relationship_display = serializers.CharField(source='get_relationship_type_display', read_only=True)
    
    class Meta:
        model = StudentParentRelation
        fields = [
            'id', 'student', 'parent', 'relationship_type', 'relationship_display',
            'is_primary_contact', 'is_active', 'notify_absence', 'notify_late',
            'notify_flags', 'created_at'
        ]

class StudentParentRelationCreateSerializer(serializers.ModelSerializer):
    """Create student-parent relationship"""
    
    class Meta:
        model = StudentParentRelation
        fields = [
            'student', 'parent', 'relationship_type', 'is_primary_contact',
            'notify_absence', 'notify_late', 'notify_flags'
        ]

# =====================================
# STUDENT ENROLLMENT SERIALIZERS
# =====================================

# StudentEnrollment serializers moved to users.serializers

# =====================================
# NOTIFICATION SERIALIZERS
# =====================================

class AttendanceNotificationSerializer(serializers.ModelSerializer):
    """Attendance notification"""
    recipient = UserBasicSerializer(read_only=True)
    student = UserBasicSerializer(read_only=True)
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AttendanceNotification
        fields = [
            'id', 'recipient', 'student', 'notification_type', 'notification_type_display',
            'title', 'message', 'status', 'status_display', 'sent_at',
            'delivered_at', 'read_at', 'created_at'
        ]

# =====================================
# STATISTICS AND REPORTING SERIALIZERS
# =====================================

class AttendanceStatisticsSerializer(serializers.Serializer):
    """Attendance statistics"""
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    total_sessions = serializers.IntegerField()
    present_count = serializers.IntegerField()
    absent_count = serializers.IntegerField()
    late_count = serializers.IntegerField()
    excused_count = serializers.IntegerField()
    attendance_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    
class ClassAttendanceReportSerializer(serializers.Serializer):
    """Class attendance report"""
    date = serializers.DateField()
    total_students = serializers.IntegerField()
    present_count = serializers.IntegerField()
    absent_count = serializers.IntegerField()
    late_count = serializers.IntegerField()
    attendance_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)

class StudentAttendanceHistorySerializer(serializers.Serializer):
    """Student attendance history"""
    date = serializers.DateField()
    subject_name = serializers.CharField()
    status = serializers.CharField()
    status_display = serializers.CharField()
    marked_at = serializers.DateTimeField()
    teacher_name = serializers.CharField()
    notes = serializers.CharField()

# =====================================
# TODAY'S SESSIONS SERIALIZER
# =====================================

class TodaySessionsSerializer(serializers.ModelSerializer):
    """Today's sessions for teacher"""
    class_name = serializers.CharField(source='timetable.school_class.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_name_arabic = serializers.CharField(source='subject.name_arabic', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    # Check if attendance session exists for today
    has_attendance_session = serializers.SerializerMethodField()
    attendance_session_id = serializers.SerializerMethodField()
    attendance_status = serializers.SerializerMethodField()
    
    class Meta:
        model = TimetableSession
        fields = [
            'id', 'class_name', 'subject', 'subject_name', 'subject_name_arabic',
            'day_of_week', 'day_name', 'start_time', 'end_time', 'session_order',
            'room_name', 'has_attendance_session', 'attendance_session_id',
            'attendance_status'
        ]
    
    def get_has_attendance_session(self, obj):
        """Check if attendance session exists for today"""
        from datetime import date
        return obj.attendance_sessions.filter(date=date.today()).exists()
    
    def get_attendance_session_id(self, obj):
        """Get attendance session ID for today"""
        from datetime import date
        session = obj.attendance_sessions.filter(date=date.today()).first()
        return session.id if session else None
    
    def get_attendance_status(self, obj):
        """Get attendance session status for today"""
        from datetime import date
        session = obj.attendance_sessions.filter(date=date.today()).first()
        return session.status if session else None