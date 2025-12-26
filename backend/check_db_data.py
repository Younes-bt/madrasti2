import os
import django
import sys

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings') # <--- Change 'config' to your project name if different
django.setup()

from schools.models import Grade, Subject, Track

def main():
    print("="*60)
    print("DATABASE STRUCTURE REPORT")
    print("="*60)

    # 1. GRADES
    print(f"\n[ GRADES ]")
    print(f"{'ID':<5} | {'Name (Default)':<30} | {'Arabic':<30} | {'French':<30}")
    print("-" * 100)
    for g in Grade.objects.all().order_by('id'):
        print(f"{g.id:<5} | {g.name:<30} | {g.name_arabic:<30} | {g.name_french:<30}")

    # 2. TRACKS
    print(f"\n[ TRACKS ]")
    print(f"{'ID':<5} | {'Code':<10} | {'Name':<30} | {'Grade':<20}")
    print("-" * 100)
    for t in Track.objects.all().order_by('grade', 'id'):
        print(f"{t.id:<5} | {t.code:<10} | {t.name:<30} | {t.grade.name:<20}")

    # 3. SUBJECTS
    print(f"\n[ SUBJECTS ]")
    print(f"{'ID':<5} | {'Code':<10} | {'Name':<30} | {'Arabic':<30} | {'French':<30}")
    print("-" * 100)
    for s in Subject.objects.all().order_by('id'):
        print(f"{s.id:<5} | {s.code:<10} | {s.name:<30} | {s.name_arabic:<30} | {s.name_french:<30}")

if __name__ == "__main__":
    main()