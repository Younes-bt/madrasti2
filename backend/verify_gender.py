
import os
import django
import sys

# Setup Django environment
sys.path.append(r'd:\OpiComTech\Projects\madrasti2\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from users.models import StudentEnrollment, Profile
from django.db.models import Count

def check_stats():
    # Helper to get base queryset similar to the view
    queryset = StudentEnrollment.objects.select_related('student', 'student__profile').all()
    
    total = queryset.count()
    
    # Check Gender breakdown
    gender_stats = queryset.values('student__profile__gender').annotate(count=Count('id'))
    
    print(f"Total Enrollments: {total}")
    print("-" * 30)
    print("Gender Breakdown:")
    
    males = 0
    females = 0
    unknown = 0
    
    for item in gender_stats:
        g = item['student__profile__gender']
        count = item['count']
        print(f"Gender '{g}': {count}")
        
        if g == 'MALE':
            males = count
        elif g == 'FEMALE':
            females = count
        else:
            unknown += count
            
    print("-" * 30)
    print(f"Calculated Males: {males}")
    print(f"Calculated Females: {females}")
    print(f"Calculated Unknown: {unknown}")
    print(f"Sum (M+F+U): {males + females + unknown}")
    
    # List some students with unknown gender
    if unknown > 0:
        print("\nFirst 5 students with Unknown gender:")
        missing_gender = queryset.filter(student__profile__gender__isnull=True)[:5]
        for enrollment in missing_gender:
            print(f"- {enrollment.student.full_name} (ID: {enrollment.student.id})")

if __name__ == "__main__":
    check_stats()
