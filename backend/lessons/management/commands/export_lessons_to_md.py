import os
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from django.conf import settings

class Command(BaseCommand):
    help = 'Exports all lessons (name, grade, subject, track) to a markdown file.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='lessons_export.md',
            help='The name of the output markdown file. It will be saved in the project root.'
        )

    def handle(self, *args, **options):
        output_filename = options['output']
        self.stdout.write(f"Exporting lessons to {output_filename}...")

        lessons = Lesson.objects.select_related('grade__educational_level', 'subject').prefetch_related('tracks').order_by('grade__educational_level__order', 'grade__grade_number', 'subject__name', 'cycle', 'order')

        md_content = ["# All Lessons\n\n"]
        current_grade_name = None
        current_subject_name = None

        for lesson in lessons:
            if lesson.grade.name != current_grade_name:
                md_content.append(f"## Grade: {lesson.grade.name}\n\n")
                current_grade_name = lesson.grade.name
                current_subject_name = None

            if lesson.subject.name != current_subject_name:
                md_content.append(f"### Subject: {lesson.subject.name}\n\n")
                current_subject_name = lesson.subject.name
            
            track_names = ", ".join(track.name for track in lesson.tracks.all())
            if not track_names:
                track_names = "N/A"
            
            md_content.append(f"- **{lesson.title}**\n")
            md_content.append(f"  - Tracks: {track_names}\n")
        
        # The project root is four levels up from this file's location
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
        file_path = os.path.join(project_root, output_filename)

        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write("".join(md_content))
            self.stdout.write(self.style.SUCCESS(f"Successfully exported lessons to {file_path}"))
        except IOError as e:
            self.stdout.write(self.style.ERROR(f"Could not write to file {file_path}: {e}"))
