from django.core.management.base import BaseCommand
from django.db.models import Count, Q
from lessons.models import Lesson
from homework.models import Exercise
from schools.models import Subject, Grade
import json

class Command(BaseCommand):
    help = 'Monitor exercise generation progress across subjects and grades'

    def add_arguments(self, parser):
        parser.add_argument('--export-json', action='store_true', help='Export progress data as JSON')
        parser.add_argument('--detail', action='store_true', help='Show detailed breakdown by subject/grade')

    def handle(self, *args, **options):
        # Overall statistics
        total_lessons = Lesson.objects.count()
        lessons_with_exercises = Lesson.objects.filter(exercises__isnull=False).distinct().count()
        lessons_without_exercises = total_lessons - lessons_with_exercises

        progress_percentage = (lessons_with_exercises / total_lessons * 100) if total_lessons > 0 else 0

        self.stdout.write("=" * 60)
        self.stdout.write("EXERCISE GENERATION PROGRESS REPORT")
        self.stdout.write("=" * 60)
        self.stdout.write(f"Total Lessons: {total_lessons}")
        self.stdout.write(f"Lessons with Exercises: {lessons_with_exercises}")
        self.stdout.write(f"Lessons without Exercises: {lessons_without_exercises}")
        self.stdout.write(f"Progress: {progress_percentage:.1f}%")
        self.stdout.write("-" * 60)

        # Exercise statistics
        total_exercises = Exercise.objects.count()
        self.stdout.write(f"Total Exercises Generated: {total_exercises}")

        if total_exercises > 0:
            avg_exercises_per_lesson = total_exercises / lessons_with_exercises
            self.stdout.write(f"Average Exercises per Lesson: {avg_exercises_per_lesson:.1f}")

        if options['detail']:
            self.show_detailed_breakdown()

        if options['export_json']:
            self.export_json_report()

    def show_detailed_breakdown(self):
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("BREAKDOWN BY SUBJECT")
        self.stdout.write("=" * 60)

        # Subject breakdown
        subjects = Subject.objects.annotate(
            total_lessons=Count('lessons'),
            lessons_with_exercises=Count('lessons__exercises', distinct=True)
        ).order_by('-total_lessons')

        for subject in subjects:
            if subject.total_lessons > 0:
                progress = (subject.lessons_with_exercises / subject.total_lessons * 100)
                remaining = subject.total_lessons - subject.lessons_with_exercises
                self.stdout.write(
                    f"{subject.name:<30} | "
                    f"Total: {subject.total_lessons:>4} | "
                    f"Complete: {subject.lessons_with_exercises:>4} | "
                    f"Remaining: {remaining:>4} | "
                    f"Progress: {progress:>5.1f}%"
                )

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("BREAKDOWN BY GRADE")
        self.stdout.write("=" * 60)

        # Grade breakdown
        grades = Grade.objects.annotate(
            total_lessons=Count('lessons'),
            lessons_with_exercises=Count('lessons__exercises', distinct=True)
        ).order_by('order')

        for grade in grades:
            if grade.total_lessons > 0:
                progress = (grade.lessons_with_exercises / grade.total_lessons * 100)
                remaining = grade.total_lessons - grade.lessons_with_exercises
                self.stdout.write(
                    f"{grade.name:<30} | "
                    f"Total: {grade.total_lessons:>4} | "
                    f"Complete: {grade.lessons_with_exercises:>4} | "
                    f"Remaining: {remaining:>4} | "
                    f"Progress: {progress:>5.1f}%"
                )

    def export_json_report(self):
        # Collect data
        total_lessons = Lesson.objects.count()
        lessons_with_exercises = Lesson.objects.filter(exercises__isnull=False).distinct().count()

        subject_data = []
        subjects = Subject.objects.annotate(
            total_lessons=Count('lessons'),
            lessons_with_exercises=Count('lessons__exercises', distinct=True)
        )

        for subject in subjects:
            if subject.total_lessons > 0:
                subject_data.append({
                    'name': subject.name,
                    'total_lessons': subject.total_lessons,
                    'lessons_with_exercises': subject.lessons_with_exercises,
                    'progress_percentage': (subject.lessons_with_exercises / subject.total_lessons * 100)
                })

        grade_data = []
        grades = Grade.objects.annotate(
            total_lessons=Count('lessons'),
            lessons_with_exercises=Count('lessons__exercises', distinct=True)
        )

        for grade in grades:
            if grade.total_lessons > 0:
                grade_data.append({
                    'name': grade.name,
                    'total_lessons': grade.total_lessons,
                    'lessons_with_exercises': grade.lessons_with_exercises,
                    'progress_percentage': (grade.lessons_with_exercises / grade.total_lessons * 100)
                })

        report = {
            'timestamp': str(timezone.now()),
            'overall': {
                'total_lessons': total_lessons,
                'lessons_with_exercises': lessons_with_exercises,
                'progress_percentage': (lessons_with_exercises / total_lessons * 100)
            },
            'by_subject': subject_data,
            'by_grade': grade_data
        }

        with open('exercise_generation_progress.json', 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        self.stdout.write(f"\nReport exported to: exercise_generation_progress.json")