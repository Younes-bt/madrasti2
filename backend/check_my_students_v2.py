import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import StudentEnrollment, User
from attendance.models import TimetableSession

User = get_user_model()

def check_teachers_via_timetable():
    print("Checking Teachers and their Students (via Timetable)...")
    
    # Get all teachers who have at least one timetable session
    teachers = User.objects.filter(role='TEACHER', teaching_sessions__isnull=False).distinct()
    
    if not teachers.exists():
        print("No teachers found with assigned timetable sessions.")
        return

    for teacher in teachers:
        print(f"\nTeacher: {teacher.full_name} (ID: {teacher.id})")
        
        # 1. Get classes via timetable sessions
        # TimetableSession -> SchoolTimetable -> SchoolClass
        class_ids = TimetableSession.objects.filter(
            teacher=teacher,
            is_active=True
        ).values_list('timetable__school_class_id', flat=True).distinct()
        
        print(f"  Classes found via Timetable: {len(class_ids)}")
        
        # 2. Get enrollments
        enrollments = StudentEnrollment.objects.filter(
            school_class_id__in=class_ids,
            is_active=True
        )
        print(f"  Active Enrollments found: {enrollments.count()}")
        
        # 3. Unique students
        student_ids = enrollments.values_list('student_id', flat=True).distinct()
        print(f"  Unique Students: {len(student_ids)}")

if __name__ == '__main__':
    check_teachers_via_timetable()
