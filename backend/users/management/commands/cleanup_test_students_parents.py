from django.core.management.base import BaseCommand
from django.db import transaction
from users.models import User, Profile, StudentEnrollment
from django.utils import timezone


class Command(BaseCommand):
    help = 'Delete all students and parents (test data cleanup for development)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion of students and parents',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.WARNING(
                    'This will delete ALL students and parents from the database.\n'
                    'This action cannot be undone!\n'
                    'Run with --confirm flag to proceed.'
                )
            )
            return

        try:
            with transaction.atomic():
                # Count before deletion
                students_count = User.objects.filter(role='STUDENT').count()
                parents_count = User.objects.filter(role='PARENT').count()
                enrollments_count = StudentEnrollment.objects.count()

                self.stdout.write(f'Found {students_count} students')
                self.stdout.write(f'Found {parents_count} parents')
                self.stdout.write(f'Found {enrollments_count} enrollments')

                # Delete student enrollments first (though they should cascade)
                StudentEnrollment.objects.all().delete()
                self.stdout.write(self.style.SUCCESS('[OK] Deleted all student enrollments'))

                # Delete student profiles and users
                student_profiles_deleted = Profile.objects.filter(user__role='STUDENT').delete()
                students_deleted = User.objects.filter(role='STUDENT').delete()
                self.stdout.write(self.style.SUCCESS(f'[OK] Deleted {students_deleted[0]} student users'))

                # Delete parent profiles and users
                parent_profiles_deleted = Profile.objects.filter(user__role='PARENT').delete()
                parents_deleted = User.objects.filter(role='PARENT').delete()
                self.stdout.write(self.style.SUCCESS(f'[OK] Deleted {parents_deleted[0]} parent users'))

                # Summary
                self.stdout.write(
                    self.style.SUCCESS(
                        f'\n=== CLEANUP COMPLETED ===\n'
                        f'Students deleted: {students_deleted[0]}\n'
                        f'Parents deleted: {parents_deleted[0]}\n'
                        f'Enrollments deleted: {enrollments_count}\n'
                        f'Time: {timezone.now()}'
                    )
                )

                # Show remaining users
                remaining_users = User.objects.all().count()
                admins = User.objects.filter(role='ADMIN').count()
                teachers = User.objects.filter(role='TEACHER').count()
                staff = User.objects.filter(role='STAFF').count()

                self.stdout.write(
                    f'\n=== REMAINING USERS ===\n'
                    f'Total: {remaining_users}\n'
                    f'Admins: {admins}\n'
                    f'Teachers: {teachers}\n'
                    f'Staff: {staff}'
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error during cleanup: {str(e)}')
            )
            raise