import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from django.contrib.auth import get_user_model
from schools.models import SchoolClass
from users.models import StudentEnrollment, User

User = get_user_model()

def check_teachers():
    print("Checking Teachers and their Students...")
    
    # Get all teachers who have at least one class assigned
    teachers = User.objects.filter(role='TEACHER', teaching_classes__isnull=False).distinct()
    
    if not teachers.exists():
        print("No teachers found with assigned classes.")
        return

    for teacher in teachers:
        print(f"\nTeacher: {teacher.full_name} (ID: {teacher.id})")
        
        # 1. Get classes
        classes = SchoolClass.objects.filter(teachers=teacher)
        print(f"  Classes assigned: {classes.count()}")
        print(f"  Class Names: {', '.join([c.name for c in classes])}")

        # 2. Get enrollments
        enrollments = StudentEnrollment.objects.filter(
            school_class__in=classes,
            is_active=True
        )
        print(f"  Active Enrollments found: {enrollments.count()}")
        
        # 3. Unique students
        student_ids = enrollments.values_list('student_id', flat=True).distinct()
        print(f"  Unique Students: {len(student_ids)}")

        if len(student_ids) == 0:
            # Check if there are ANY enrollments (even inactive)
            all_enrollments = StudentEnrollment.objects.filter(school_class__in=classes)
            print(f"  Total Enrollments (including inactive): {all_enrollments.count()}")

if __name__ == '__main__':
    check_teachers()
