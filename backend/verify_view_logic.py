
import os
import django
import sys
from django.db.models import Count

# Setup Django environment
sys.path.append(r'd:\OpiComTech\Projects\madrasti2\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from users.models import StudentEnrollment

def check_stat_view_logic():
    # Exact logic from views.py
    queryset = StudentEnrollment.objects.select_related(
        'student', 'school_class', 'academic_year', 'school_class__grade', 'school_class__grade__educational_level'
    ).all()
    
    # Total
    total_students = queryset.count()
    
    # Gender Stats
    gender_stats = queryset.values('student__profile__gender').annotate(count=Count('id'))
    
    print(f"Total: {total_students}")
    print("Gender Stats (Raw Queryset Result):")
    print(list(gender_stats))
    
    males = 0
    females = 0
    for item in gender_stats:
        gender = item.get('student__profile__gender')
        if gender == 'MALE':
            males = item['count']
        elif gender == 'FEMALE':
            females = item['count']
            
    print(f"Males: {males}")
    print(f"Females: {females}")

if __name__ == "__main__":
    check_stat_view_logic()
