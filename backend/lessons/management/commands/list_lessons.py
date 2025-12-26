from django.core.management.base import BaseCommand
from collections import defaultdict
from lessons.models import Lesson
from schools.models import Grade
import sys


class Command(BaseCommand):
    help = 'List all lessons grouped by grade and subject'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            help='Output file path (optional). If not provided, prints to console.',
        )

    def handle(self, *args, **options):
        # Fetch all lessons with related data
        lessons = Lesson.objects.select_related(
            'grade',
            'subject'
        ).prefetch_related(
            'tracks'
        ).order_by(
            'grade__educational_level__order',
            'grade__grade_number',
            'subject__name',
            'cycle',
            'order'
        )

        # Group lessons by grade and subject
        grouped_data = defaultdict(lambda: defaultdict(list))

        for lesson in lessons:
            grade_key = f"{lesson.grade.name}"
            subject_key = lesson.subject.name
            grouped_data[grade_key][subject_key].append(lesson)

        # Statistics
        total_lessons = 0
        total_subjects = 0
        total_grades = len(grouped_data)

        # Output
        output = []
        output.append("=" * 80)
        output.append("LESSONS LISTING - GROUPED BY GRADE AND SUBJECT")
        output.append("=" * 80)
        output.append("")

        # Iterate through grades
        for grade_name in sorted(grouped_data.keys()):
            subjects = grouped_data[grade_name]
            subjects_count = len(subjects)
            total_subjects += subjects_count

            # Grade header
            output.append(f"### {grade_name} ({subjects_count} subject{'s' if subjects_count != 1 else ''}):")
            output.append("-" * 80)

            # Iterate through subjects in this grade
            for subject_name in sorted(subjects.keys()):
                lessons_list = subjects[subject_name]
                lessons_count = len(lessons_list)
                total_lessons += lessons_count

                # Subject header
                output.append(f"\n## {subject_name} ({lessons_count} lesson{'s' if lessons_count != 1 else ''}):")
                output.append("")
                output.append("# Lessons:")
                output.append(f"{'ID':<6} | {'Title':<50} | {'Cycle':<10} | {'Tracks'}")
                output.append("-" * 80)

                # List lessons
                for lesson in lessons_list:
                    # Get tracks as a comma-separated list
                    tracks = lesson.tracks.all()
                    if tracks:
                        tracks_str = ", ".join([track.code for track in tracks])
                    else:
                        tracks_str = "All tracks"

                    # Cycle display
                    cycle_display = "1st" if lesson.cycle == 'first' else "2nd"

                    # Format lesson row
                    output.append(
                        f"{lesson.id:<6} | {lesson.title[:50]:<50} | {cycle_display:<10} | [{tracks_str}]"
                    )

                output.append("")

            output.append("")

        # Summary
        output.append("=" * 80)
        output.append("SUMMARY")
        output.append("=" * 80)
        output.append(f"Total lessons: {total_lessons}")
        output.append(f"Total subjects: {total_subjects}")
        output.append(f"Total grades: {total_grades}")
        output.append("=" * 80)

        # Output to file or console
        output_file = options.get('output')

        if output_file:
            # Write to file with UTF-8 encoding
            with open(output_file, 'w', encoding='utf-8') as f:
                for line in output:
                    f.write(line + '\n')
            self.stdout.write(self.style.SUCCESS(f'Output written to: {output_file}'))
        else:
            # Print to console with safe encoding handling
            for line in output:
                try:
                    self.stdout.write(line)
                except UnicodeEncodeError:
                    # Fallback to ASCII-compatible output if encoding fails
                    safe_line = line.encode('ascii', 'replace').decode('ascii')
                    self.stdout.write(safe_line)
