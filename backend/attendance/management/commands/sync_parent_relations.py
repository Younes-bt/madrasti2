from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from attendance.models import StudentParentRelation

User = get_user_model()

class Command(BaseCommand):
    help = 'Synchronizes parent-child relationships from User.parent to StudentParentRelation'

    def handle(self, *args, **options):
        # Get all students who have a parent linked
        students = User.objects.filter(role=User.Role.STUDENT, parent__isnull=False)
        
        count = 0
        self.stdout.write(f"Found {students.count()} students with parent links.")
        
        for student in students:
            parent = student.parent
            relation, created = StudentParentRelation.objects.get_or_create(
                student=student,
                parent=parent,
                defaults={
                    'relationship_type': 'father', 
                    'is_primary_contact': True,
                    'notify_absence': True,
                    'notify_late': True,
                    'notify_flags': True
                }
            )
            if created:
                count += 1
                self.stdout.write(self.style.SUCCESS(f"Created relation: {parent.full_name} -> {student.full_name}"))
            else:
                self.stdout.write(f"Relation already exists: {parent.full_name} -> {student.full_name}")
                
        self.stdout.write(self.style.SUCCESS(f"Successfully synchronized {count} new parent-student relations."))
