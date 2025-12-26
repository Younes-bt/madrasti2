import random
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model

from schools.models import SchoolClass, Subject
from homework.models import Homework, Submission


class Command(BaseCommand):
    help = "Seed realistic homework and submissions to exercise reporting features."

    def add_arguments(self, parser):
        parser.add_argument("--homework-per-class", type=int, default=5, help="Homework to create per class")
        parser.add_argument("--submissions-per-homework", type=int, default=10, help="Max submissions per homework")
        parser.add_argument("--dry-run", action="store_true", help="Show what would be created without writing")

    def handle(self, *args, **options):
        homework_per_class = options["homework_per_class"]
        submissions_per_homework = options["submissions_per_homework"]
        dry_run = options["dry_run"]

        User = get_user_model()
        teachers = User.objects.filter(role="TEACHER").prefetch_related("teaching_classes")
        if not teachers.exists():
            self.stdout.write(self.style.WARNING("No teachers found. Aborting."))
            return

        total_hw_created = 0
        total_sub_created = 0

        for teacher in teachers:
            classes = teacher.teaching_classes.all()
            if not classes:
                continue

            for school_class in classes:
                # Link subject via timetable sessions to find matching subjects for this class
                subject_ids = Subject.objects.filter(
                    timetable_sessions__timetable__school_class=school_class
                ).values_list("id", flat=True).distinct()
                subjects = Subject.objects.filter(id__in=subject_ids) if subject_ids else Subject.objects.none()
                if not subjects.exists():
                    continue

                for _ in range(homework_per_class):
                    subject = random.choice(list(subjects))
                    now = timezone.now()
                    due_date = now + timedelta(days=random.randint(-10, 10))
                    homework = Homework(
                        subject=subject,
                        grade=school_class.grade,
                        school_class=school_class,
                        teacher=teacher,
                        title=f"Auto HW {subject.name} {now.strftime('%Y-%m-%d %H:%M:%S')}",
                        description="Seeded homework for reporting tests",
                        instructions="Complete all questions",
                        homework_type="homework",
                        due_date=due_date,
                        estimated_duration=30,
                        total_points=100,
                        is_published=True,
                    )
                    if dry_run:
                        self.stdout.write(f"[DRY RUN] Would create homework: {homework.title}")
                    else:
                        homework.save()
                    total_hw_created += 1

                    # Students enrolled in class
                    students = User.objects.filter(
                        student_enrollments__school_class=school_class
                    ).distinct()
                    if not students.exists():
                        continue

                    # Limit submissions per homework
                    chosen_students = random.sample(
                        list(students),
                        k=min(submissions_per_homework, students.count())
                    )
                    for student in chosen_students:
                        status = random.choice(["submitted", "submitted", "submitted", "late", "draft"])
                        total_score = random.randint(40, 100) if status in ["submitted", "late"] else None
                        submitted_at = None
                        if status in ["submitted", "late"]:
                            # Place submission before/after due date
                            submitted_at = due_date + timedelta(days=random.randint(-2, 2))
                        sub = Submission(
                            homework=homework,
                            student=student,
                            status=status,
                            total_score=total_score,
                            submitted_at=submitted_at,
                            is_late=status == "late",
                        )
                        if dry_run:
                            self.stdout.write(f"[DRY RUN] Would create submission for {student.email} on {homework.title}")
                        else:
                            sub.save()
                        total_sub_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeding complete. Homework created: {total_hw_created}, Submissions created: {total_sub_created}."
                + (" (dry run)" if dry_run else "")
            )
        )
