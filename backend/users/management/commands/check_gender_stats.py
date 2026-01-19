from django.core.management.base import BaseCommand
from users.models import User, StudentEnrollment
from django.db.models import Count

class Command(BaseCommand):
    help = 'Check gender statistics for students'

    def handle(self, *args, **kwargs):
        # Check all students
        students = User.objects.filter(role='STUDENT')
        total_students = students.count()
        
        self.stdout.write(f"\n=== STUDENT GENDER CHECK ===")
        self.stdout.write(f"Total students: {total_students}")
        
        # Check gender distribution
        males = students.filter(profile__gender='MALE').count()
        females = students.filter(profile__gender='FEMALE').count()
        null_gender = students.filter(profile__gender__isnull=True).count()
        
        self.stdout.write(f"MALE: {males}")
        self.stdout.write(f"FEMALE: {females}")
        self.stdout.write(f"NULL/None: {null_gender}")
        
        # Check what actual values exist
        gender_values = students.values('profile__gender').annotate(count=Count('id'))
        self.stdout.write(f"\n=== ACTUAL GENDER VALUES ===")
        for item in gender_values:
            self.stdout.write(f"Gender: {item['profile__gender']} -> Count: {item['count']}")
        
        # Check enrollments
        self.stdout.write(f"\n=== ENROLLMENT GENDER CHECK ===")
        enrollments = StudentEnrollment.objects.all()
        total_enrollments = enrollments.count()
        self.stdout.write(f"Total enrollments: {total_enrollments}")
        
        enrollment_gender = enrollments.values('student__profile__gender').annotate(count=Count('id'))
        for item in enrollment_gender:
            self.stdout.write(f"Gender: {item['student__profile__gender']} -> Count: {item['count']}")
        
        self.stdout.write(self.style.SUCCESS('\n✓ Check complete'))
