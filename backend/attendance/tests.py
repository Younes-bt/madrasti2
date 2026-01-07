# attendance/tests.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from datetime import date, time, datetime, timedelta
from django.utils import timezone

from .models import (
    SchoolTimetable, TimetableSession, AttendanceSession, AttendanceRecord,
    StudentAbsenceFlag, StudentParentRelation,
    AttendanceNotification
)
from users.models import StudentEnrollment
from schools.models import School, AcademicYear, EducationalLevel, Grade, SchoolClass, Subject, Room

User = get_user_model()

# =====================================
# MODEL TESTS
# =====================================

class SchoolTimetableModelTest(TestCase):
    """Test SchoolTimetable model"""
    
    def setUp(self):
        # Create test data
        self.school = School.objects.create(
            name="Test School", email="test@school.com", address="Test Address",
            city="Test City", region="Test Region"
        )
        self.academic_year = AcademicYear.objects.create(
            year="2024-2025", start_date=date(2024, 9, 1),
            end_date=date(2025, 6, 30), is_current=True
        )
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY", name="Primary", order=1
        )
        self.grade = Grade.objects.create(
            educational_level=self.educational_level, grade_number=1,
            name="1st Grade"
        )
        self.school_class = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="A"
        )
        self.admin = User.objects.create_user(
            email="admin@test.com", password="testpass", role="ADMIN"
        )
    
    def test_timetable_creation(self):
        """Test timetable creation"""
        timetable = SchoolTimetable.objects.create(
            school_class=self.school_class,
            academic_year=self.academic_year,
            created_by=self.admin
        )
        self.assertTrue(timetable.is_active)
        self.assertEqual(str(timetable), f"Timetable - {self.school_class.name} ({self.academic_year.year})")
    
    def test_only_one_active_timetable_per_class(self):
        """Test that only one timetable can be active per class per year"""
        # Create a second class for this test to avoid conflicts
        school_class2 = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="B"
        )
        
        timetable1 = SchoolTimetable.objects.create(
            school_class=school_class2,
            academic_year=self.academic_year,
            created_by=self.admin
        )
        timetable2 = SchoolTimetable.objects.create(
            school_class=school_class2,
            academic_year=self.academic_year,
            created_by=self.admin
        )
        
        # Refresh from database
        timetable1.refresh_from_db()
        
        self.assertFalse(timetable1.is_active)
        self.assertTrue(timetable2.is_active)

class TimetableSessionModelTest(TestCase):
    """Test TimetableSession model"""
    
    def setUp(self):
        # Create test data
        self.school = School.objects.create(
            name="Test School", email="test@school.com", address="Test Address",
            city="Test City", region="Test Region"
        )
        self.academic_year = AcademicYear.objects.create(
            year="2024-2025", start_date=date(2024, 9, 1),
            end_date=date(2025, 6, 30), is_current=True
        )
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY", name="Primary", order=1
        )
        self.grade = Grade.objects.create(
            educational_level=self.educational_level, grade_number=1,
            name="1st Grade"
        )
        self.school_class = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="A"
        )
        self.timetable = SchoolTimetable.objects.create(
            school_class=self.school_class,
            academic_year=self.academic_year
        )
        self.subject = Subject.objects.create(name="Mathematics", code="MATH")
        self.teacher = User.objects.create_user(
            email="teacher@test.com", password="testpass", role="TEACHER"
        )
        self.room = Room.objects.create(name="Room A", code="A101")
    
    def test_session_creation(self):
        """Test session creation"""
        session = TimetableSession.objects.create(
            timetable=self.timetable,
            subject=self.subject,
            teacher=self.teacher,
            day_of_week=1,  # Monday
            start_time=time(8, 30),
            end_time=time(9, 25),
            session_order=1,
            room=self.room
        )
        self.assertTrue(session.is_active)
        self.assertIn("Mathematics", str(session))
        self.assertIn("الإثنين", str(session))
    
    def test_session_validation(self):
        """Test session time validation"""
        from django.core.exceptions import ValidationError
        
        # Test invalid time (start >= end)
        session = TimetableSession(
            timetable=self.timetable,
            subject=self.subject,
            teacher=self.teacher,
            day_of_week=1,
            start_time=time(9, 30),
            end_time=time(8, 30),  # End before start
            session_order=1
        )
        
        with self.assertRaises(ValidationError):
            session.clean()

class AttendanceSessionModelTest(TestCase):
    """Test AttendanceSession model"""
    
    def setUp(self):
        # Create test data
        self.school = School.objects.create(
            name="Test School", email="test@school.com", address="Test Address",
            city="Test City", region="Test Region"
        )
        self.academic_year = AcademicYear.objects.create(
            year="2024-2025", start_date=date(2024, 9, 1),
            end_date=date(2025, 6, 30), is_current=True
        )
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY", name="Primary", order=1
        )
        self.grade = Grade.objects.create(
            educational_level=self.educational_level, grade_number=1,
            name="1st Grade"
        )
        self.school_class = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="A"
        )
        self.timetable = SchoolTimetable.objects.create(
            school_class=self.school_class,
            academic_year=self.academic_year
        )
        self.subject = Subject.objects.create(name="Mathematics", code="MATH")
        self.teacher = User.objects.create_user(
            email="teacher@test.com", password="testpass", role="TEACHER"
        )
        self.timetable_session = TimetableSession.objects.create(
            timetable=self.timetable,
            subject=self.subject,
            teacher=self.teacher,
            day_of_week=1,
            start_time=time(8, 30),
            end_time=time(9, 25),
            session_order=1
        )
        
        # Create students
        self.student1 = User.objects.create_user(
            email="student1@test.com", password="testpass", role="STUDENT",
            first_name="John", last_name="Doe"
        )
        self.student2 = User.objects.create_user(
            email="student2@test.com", password="testpass", role="STUDENT",
            first_name="Jane", last_name="Smith"
        )
        
        # Enroll students
        StudentEnrollment.objects.create(
            student=self.student1,
            school_class=self.school_class,
            academic_year=self.academic_year
        )
        StudentEnrollment.objects.create(
            student=self.student2,
            school_class=self.school_class,
            academic_year=self.academic_year
        )
    
    def test_attendance_session_creation(self):
        """Test attendance session creation"""
        session = AttendanceSession.objects.create(
            timetable_session=self.timetable_session,
            date=date.today(),
            teacher=self.teacher
        )
        self.assertEqual(session.status, 'not_started')
        self.assertIn("Mathematics", str(session))
    
    def test_start_session(self):
        """Test starting attendance session"""
        session = AttendanceSession.objects.create(
            timetable_session=self.timetable_session,
            date=date.today(),
            teacher=self.teacher
        )
        
        session.start_session()
        
        self.assertEqual(session.status, 'in_progress')
        self.assertIsNotNone(session.started_at)
        
        # Check that attendance records were created for all students
        records = AttendanceRecord.objects.filter(attendance_session=session)
        self.assertEqual(records.count(), 2)  # 2 students
        
        # Check default status is present
        for record in records:
            self.assertEqual(record.status, 'present')
    
    def test_complete_session(self):
        """Test completing attendance session"""
        session = AttendanceSession.objects.create(
            timetable_session=self.timetable_session,
            date=date.today(),
            teacher=self.teacher
        )
        
        session.start_session()
        
        # Mark one student as absent
        record = AttendanceRecord.objects.filter(
            attendance_session=session,
            student=self.student1
        ).first()
        record.status = 'absent'
        record.save()
        
        session.complete_session()
        
        self.assertEqual(session.status, 'completed')
        self.assertIsNotNone(session.completed_at)
        
        # Check that absence flag was created
        flags = StudentAbsenceFlag.objects.filter(student=self.student1)
        self.assertEqual(flags.count(), 1)
    
    def test_attendance_statistics(self):
        """Test attendance session statistics"""
        session = AttendanceSession.objects.create(
            timetable_session=self.timetable_session,
            date=date.today(),
            teacher=self.teacher
        )
        
        session.start_session()
        
        # Mark students with different statuses
        records = AttendanceRecord.objects.filter(attendance_session=session)
        records[0].status = 'present'
        records[0].save()
        records[1].status = 'absent'
        records[1].save()
        
        self.assertEqual(session.total_students, 2)
        self.assertEqual(session.present_count, 1)
        self.assertEqual(session.absent_count, 1)
        self.assertEqual(session.late_count, 0)

class StudentAbsenceFlagModelTest(TestCase):
    """Test StudentAbsenceFlag model"""
    
    def setUp(self):
        # Create basic test data
        self.school = School.objects.create(
            name="Test School", email="test@school.com", address="Test Address",
            city="Test City", region="Test Region"
        )
        self.academic_year = AcademicYear.objects.create(
            year="2024-2025", start_date=date(2024, 9, 1),
            end_date=date(2025, 6, 30), is_current=True
        )
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY", name="Primary", order=1
        )
        self.grade = Grade.objects.create(
            educational_level=self.educational_level, grade_number=1,
            name="1st Grade"
        )
        self.school_class = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="A"
        )
        self.student = User.objects.create_user(
            email="student@test.com", password="testpass", role="STUDENT"
        )
        self.teacher = User.objects.create_user(
            email="teacher@test.com", password="testpass", role="TEACHER"
        )
        self.staff = User.objects.create_user(
            email="staff@test.com", password="testpass", role="STAFF"
        )
        
        # Create attendance record
        self.timetable = SchoolTimetable.objects.create(
            school_class=self.school_class,
            academic_year=self.academic_year
        )
        self.subject = Subject.objects.create(name="Mathematics", code="MATH")
        self.timetable_session = TimetableSession.objects.create(
            timetable=self.timetable,
            subject=self.subject,
            teacher=self.teacher,
            day_of_week=1,
            start_time=time(8, 30),
            end_time=time(9, 25),
            session_order=1
        )
        self.attendance_session = AttendanceSession.objects.create(
            timetable_session=self.timetable_session,
            date=date.today(),
            teacher=self.teacher
        )
        self.attendance_record = AttendanceRecord.objects.create(
            attendance_session=self.attendance_session,
            student=self.student,
            status='absent',
            marked_by=self.teacher
        )
    
    def test_flag_creation(self):
        """Test absence flag creation"""
        flag = StudentAbsenceFlag.objects.create(
            student=self.student,
            attendance_record=self.attendance_record
        )
        
        self.assertFalse(flag.is_cleared)
        self.assertIsNone(flag.cleared_at)
        self.assertIn("Pending", str(flag))
    
    def test_clear_flag(self):
        """Test clearing absence flag"""
        flag = StudentAbsenceFlag.objects.create(
            student=self.student,
            attendance_record=self.attendance_record
        )
        
        flag.clear_flag(
            cleared_by=self.staff,
            reason='medical',
            notes='Medical certificate provided'
        )
        
        self.assertTrue(flag.is_cleared)
        self.assertIsNotNone(flag.cleared_at)
        self.assertEqual(flag.clearance_reason, 'medical')
        self.assertEqual(flag.clearance_notes, 'Medical certificate provided')
        self.assertIn("Cleared", str(flag))
        
        # Check that attendance record was updated to excused
        self.attendance_record.refresh_from_db()
        self.assertEqual(self.attendance_record.status, 'excused')

# =====================================
# API TESTS
# =====================================

class AttendanceAPITestCase(APITestCase):
    """Base test case for attendance API tests"""
    
    def setUp(self):
        # Create test data
        self.school = School.objects.create(
            name="Test School", email="test@school.com", address="Test Address",
            city="Test City", region="Test Region"
        )
        self.academic_year = AcademicYear.objects.create(
            year="2024-2025", start_date=date(2024, 9, 1),
            end_date=date(2025, 6, 30), is_current=True
        )
        self.educational_level = EducationalLevel.objects.create(
            level="PRIMARY", name="Primary", order=1
        )
        self.grade = Grade.objects.create(
            educational_level=self.educational_level, grade_number=1,
            name="1st Grade"
        )
        self.school_class = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="A"
        )
        self.subject = Subject.objects.create(name="Mathematics", code="MATH")
        self.room = Room.objects.create(name="Room A", code="A101")
        
        # Create users
        self.admin = User.objects.create_user(
            email="admin@test.com", password="testpass", role="ADMIN",
            first_name="Admin", last_name="User"
        )
        self.teacher = User.objects.create_user(
            email="teacher@test.com", password="testpass", role="TEACHER",
            first_name="Teacher", last_name="User"
        )
        self.student = User.objects.create_user(
            email="student@test.com", password="testpass", role="STUDENT",
            first_name="Student", last_name="User"
        )
        self.parent = User.objects.create_user(
            email="parent@test.com", password="testpass", role="PARENT",
            first_name="Parent", last_name="User"
        )
        
        # Create timetable and session
        self.timetable = SchoolTimetable.objects.create(
            school_class=self.school_class,
            academic_year=self.academic_year,
            created_by=self.admin
        )
        self.timetable_session = TimetableSession.objects.create(
            timetable=self.timetable,
            subject=self.subject,
            teacher=self.teacher,
            day_of_week=1,
            start_time=time(8, 30),
            end_time=time(9, 25),
            session_order=1,
            room=self.room
        )
        
        # Enroll student
        StudentEnrollment.objects.create(
            student=self.student,
            school_class=self.school_class,
            academic_year=self.academic_year
        )
        
        # Create parent-student relationship
        StudentParentRelation.objects.create(
            student=self.student,
            parent=self.parent,
            relationship_type='father',
            is_primary_contact=True
        )

class AttendanceSessionAPITest(AttendanceAPITestCase):
    """Test attendance session API endpoints"""
    
    def setUp(self):
        super().setUp()
        self.attendance_session = AttendanceSession.objects.create(
            timetable_session=self.timetable_session,
            date=date.today(),
            teacher=self.teacher
        )
    
    def test_start_attendance_session(self):
        """Test starting attendance session"""
        self.client.force_authenticate(user=self.teacher)
        url = f'/api/attendance/sessions/{self.attendance_session.id}/start/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.attendance_session.refresh_from_db()
        self.assertEqual(self.attendance_session.status, 'in_progress')
    
    def test_bulk_mark_attendance(self):
        """Test bulk marking attendance"""
        self.attendance_session.start_session()
        
        self.client.force_authenticate(user=self.teacher)
        url = f'/api/attendance/sessions/{self.attendance_session.id}/bulk_mark/'
        data = {
            'records': [
                {
                    'student_id': str(self.student.id),
                    'status': 'absent'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that record was updated
        record = AttendanceRecord.objects.get(
            attendance_session=self.attendance_session,
            student=self.student
        )
        self.assertEqual(record.status, 'absent')
    
    def test_complete_attendance_session(self):
        """Test completing attendance session"""
        self.attendance_session.start_session()
        
        # Mark student as absent
        record = AttendanceRecord.objects.get(
            attendance_session=self.attendance_session,
            student=self.student
        )
        record.status = 'absent'
        record.save()
        
        self.client.force_authenticate(user=self.teacher)
        url = f'/api/attendance/sessions/{self.attendance_session.id}/complete/'
        data = {'notes': 'Session completed'}
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.attendance_session.refresh_from_db()
        self.assertEqual(self.attendance_session.status, 'completed')
        
        # Check that absence flag was created
        flags = StudentAbsenceFlag.objects.filter(student=self.student)
        self.assertEqual(flags.count(), 1)
        
        # Check that notification was sent to parent
        notifications = AttendanceNotification.objects.filter(
            recipient=self.parent,
            student=self.student,
            notification_type='absence'
        )
        self.assertEqual(notifications.count(), 1)

class AbsenceFlagAPITest(AttendanceAPITestCase):
    """Test absence flag API endpoints"""
    
    def setUp(self):
        super().setUp()
        self.attendance_session = AttendanceSession.objects.create(
            timetable_session=self.timetable_session,
            date=date.today(),
            teacher=self.teacher
        )
        self.attendance_session.start_session()
        self.record = AttendanceRecord.objects.get(
            attendance_session=self.attendance_session,
            student=self.student
        )
        self.record.status = 'absent'
        self.record.save()
        
        self.flag = StudentAbsenceFlag.objects.create(
            student=self.student,
            attendance_record=self.record
        )
    
    def test_clear_absence_flag(self):
        """Test clearing absence flag"""
        self.client.force_authenticate(user=self.teacher)
        url = f'/api/attendance/absence-flags/{self.flag.id}/clear/'
        data = {
            'clearance_reason': 'medical',
            'clearance_notes': 'Medical certificate provided'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.flag.refresh_from_db()
        self.assertTrue(self.flag.is_cleared)
        
        # Check notification was sent to parent
        notifications = AttendanceNotification.objects.filter(
            recipient=self.parent,
            student=self.student,
            notification_type='flag_cleared'
        )
        self.assertEqual(notifications.count(), 1)

# =====================================
# INTEGRATION TESTS
# =====================================

class AttendanceWorkflowIntegrationTest(AttendanceAPITestCase):
    """Test complete attendance workflow"""
    
    def test_complete_attendance_workflow(self):
        """Test complete attendance workflow from start to finish"""
        # 1. Teacher creates attendance session
        self.client.force_authenticate(user=self.teacher)
        session_data = {
            'timetable_session': self.timetable_session.id,
            'date': date.today().isoformat()
        }
        url = '/api/attendance/sessions/'
        response = self.client.post(url, session_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        session_id = response.data['id']
        
        # 2. Teacher starts attendance session
        url = f'/api/attendance/sessions/{session_id}/start/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 3. Teacher gets student list
        url = f'/api/attendance/sessions/{session_id}/students/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        students = response.data['students']
        self.assertEqual(len(students), 1)
        
        # 4. Teacher marks attendance (student absent)
        url = f'/api/attendance/sessions/{session_id}/bulk_mark/'
        data = {
            'records': [
                {
                    'student_id': str(self.student.id),
                    'status': 'absent'
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 5. Teacher completes session
        url = f'/api/attendance/sessions/{session_id}/complete/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 6. Verify absence flag was created
        flags = StudentAbsenceFlag.objects.filter(student=self.student)
        self.assertEqual(flags.count(), 1)
        flag = flags.first()
        self.assertFalse(flag.is_cleared)
        
        # 7. Verify notification was sent to parent
        notifications = AttendanceNotification.objects.filter(
            recipient=self.parent,
            student=self.student,
            notification_type='absence'
        )
        self.assertEqual(notifications.count(), 1)
        
        # 8. Parent views notification
        self.client.force_authenticate(user=self.parent)
        url = '/api/attendance/notifications/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # 9. Staff clears absence flag
        staff = User.objects.create_user(
            email="staff@test.com", password="testpass", role="ADMIN"
        )
        self.client.force_authenticate(user=staff)
        url = f'/api/attendance/absence-flags/{flag.id}/clear/'
        data = {
            'clearance_reason': 'medical',
            'clearance_notes': 'Medical certificate provided'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 10. Verify flag clearance notification sent
        clearance_notifications = AttendanceNotification.objects.filter(
            recipient=self.parent,
            student=self.student,
            notification_type='flag_cleared'
        )
        self.assertEqual(clearance_notifications.count(), 1)
        
        # 11. Verify attendance record updated to excused
        record = AttendanceRecord.objects.get(
            attendance_session_id=session_id,
            student=self.student
        )
        self.assertEqual(record.status, 'excused')
        
        # 12. Generate attendance report
        self.client.force_authenticate(user=self.teacher)
        url = '/api/attendance/reports/class_statistics/'
        response = self.client.get(url, {'class_id': self.school_class.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        statistics = response.data['statistics'][0]
        self.assertEqual(statistics['total_sessions'], 1)
        self.assertEqual(statistics['excused_count'], 1)
        
        print("Complete attendance workflow test passed!")