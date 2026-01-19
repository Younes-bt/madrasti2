
import os
import django
import sys
from collections import Counter

# Setup Django environment
sys.path.append(r'd:\OpiComTech\Projects\madrasti2\backend')
try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
    django.setup()
except ImportError:
     # Fallback if madrasti.settings not found (older structure?)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()

from users.models import StudentEnrollment, Profile, User

def audit_data():
    print("=== DATA AUDIT START ===")
    
    # Check DB Connection
    from django.db import connection
    print(f"DB Engine: {connection.settings_dict['ENGINE']}")
    print(f"DB Name: {connection.settings_dict['NAME']}")

    # 1. Profile Audit
    print("\n1. Profile Gender Distribution (ALL Profiles):")
    profiles = Profile.objects.all()
    gender_counts = Counter()
    for p in profiles:
        # Check for types and strip issues
        g = p.gender
        if g is None:
            g_key = "None (Null)"
        elif g == "":
            g_key = "Empty String"
        else:
            g_key = f"'{g}' (len={len(g)})"
        gender_counts[g_key] += 1
    
    for k, v in gender_counts.items():
        print(f"  {k}: {v}")

    # 2. Student Enrollment Audit
    print("\n2. Student Enrollments Gender Distribution:")
    enrollments = StudentEnrollment.objects.select_related('student', 'student__profile').all()
    print(f"  Total Enrollments: {enrollments.count()}")
    
    enrollment_genders = Counter()
    for e in enrollments:
        if not hasattr(e.student, 'profile'):
             enrollment_genders["NO PROFILE"] += 1
             continue
             
        g = e.student.profile.gender
        if g is None:
            g_key = "None (Null)"
        elif g == "":
            g_key = "Empty String"
        else:
            g_key = f"'{g}'"
        enrollment_genders[g_key] += 1

    for k, v in enrollment_genders.items():
        print(f"  {k}: {v}")
        
    print("=== DATA AUDIT END ===")

if __name__ == "__main__":
    audit_data()
