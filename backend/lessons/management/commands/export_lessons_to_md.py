from django.core.management.base import BaseCommand
from lessons.models import Lesson
import os

class Command(BaseCommand):
    help = 'Exports all lessons to a markdown file in backend/docs'

    def handle(self, *args, **options):
        lessons = Lesson.objects.all().order_by('id')
        total_lessons = lessons.count()
        
        output_lines = []
        output_lines.append(f'Total lessons : "{total_lessons}"\n')
        
        for lesson in lessons:
            # Get related data safely
            grade_name = lesson.grade.name if lesson.grade else "No Grade"
            subject_name = lesson.subject.name if lesson.subject else "No Subject"
            
            # Handle ManyToMany field for tracks
            tracks = list(lesson.tracks.all().values_list('name', flat=True))
            tracks_str = f"[{', '.join(tracks)}]"
            
            # Format: ID: X | grade | [tracks] | subject | title_arabic (title_french)
            line = f"ID: {lesson.id} | {grade_name} | {tracks_str} | {subject_name} | {lesson.title_arabic} ({lesson.title_french})"
            output_lines.append(line)
            
        # Define output path
        # Assuming the script is run from project root or we can use settings.BASE_DIR if needed
        # But user specified <backend\docs> relative to project likely.
        # Let's try to find the absolute path to backend/docs based on where we are.
        
        # We are in backend/lessons/management/commands/export_lessons_to_md.py
        # backend/docs is ../../../docs from here? No, backend/docs is sibling to backend/lessons?
        # Let's use a fixed relative path from the project root assuming the command is run via manage.py in backend/
        
        # Actually, let's just use the absolute path provided in the prompt context to be safe:
        # d:\OpiComTech\Projects\madrasti2\backend\docs
        
        output_path = os.path.join('backend', 'docs', 'ALL_LESSONS_TRACKER.md')
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(output_lines))
            
        self.stdout.write(self.style.SUCCESS(f'Successfully exported {total_lessons} lessons to {output_path}'))
