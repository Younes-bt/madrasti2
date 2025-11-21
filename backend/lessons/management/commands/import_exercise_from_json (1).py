"""
Django management command to import exercises from JSON file
Place this file in: backend/homework/management/commands/import_exercise_from_json.py

Usage:
    python manage.py import_exercise_from_json path/to/exercise.json
    python manage.py import_exercise_from_json path/to/exercise.json --delete-existing
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from lessons.models import Lesson
from schools.models import Grade, Subject
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward
import json
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Import exercise from JSON file with lesson info included'

    def add_arguments(self, parser):
        parser.add_argument(
            'json_file',
            type=str,
            help='Path to JSON file containing exercise data'
        )
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises with the same title for this lesson',
        )

    def handle(self, *args, **options):
        json_file = options['json_file']

        # Check if file exists
        if not os.path.exists(json_file):
            self.stdout.write(self.style.ERROR(f'❌ File not found: {json_file}'))
            return

        # Load JSON data
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f'❌ Invalid JSON file: {e}'))
            return

        # Validate required fields
        if 'lesson_info' not in data:
            self.stdout.write(self.style.ERROR('❌ Missing "lesson_info" in JSON file'))
            return
        if 'exercise' not in data:
            self.stdout.write(self.style.ERROR('❌ Missing "exercise" in JSON file'))
            return
        if 'questions' not in data:
            self.stdout.write(self.style.ERROR('❌ Missing "questions" in JSON file'))
            return

        # Get admin user (creator)
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR('❌ No superuser found. Please create one first.'))
            return

        # Find the lesson
        lesson = self._find_lesson(data['lesson_info'])
        if not lesson:
            return

        self.stdout.write(self.style.SUCCESS(f'✅ Found lesson: {lesson.title} (ID: {lesson.id})'))

        # Create the exercise
        with transaction.atomic():
            exercise = self._create_exercise(
                lesson=lesson,
                exercise_data=data['exercise'],
                admin_user=admin_user,
                delete_existing=options['delete_existing']
            )

            if not exercise:
                return

            # Create questions
            questions_created = self._create_questions(exercise, data['questions'])

            self.stdout.write(self.style.SUCCESS(
                f'\n✅ SUCCESS! Created exercise "{exercise.title}" with {questions_created} questions'
            ))
            self.stdout.write(f'   Lesson: {lesson.title}')
            self.stdout.write(f'   Exercise ID: {exercise.id}')
            self.stdout.write(f'   Total Points: {exercise.total_points}')

    def _find_lesson(self, lesson_info):
        """Find lesson by ID or by title/grade/subject"""
        
        # Option 1: Try to find by lesson_id
        if 'lesson_id' in lesson_info and lesson_info['lesson_id']:
            try:
                lesson = Lesson.objects.get(id=lesson_info['lesson_id'])
                return lesson
            except Lesson.DoesNotExist:
                self.stdout.write(self.style.WARNING(
                    f'⚠️  Lesson ID {lesson_info["lesson_id"]} not found. Trying other methods...'
                ))

        # Option 2: Find by title + grade + subject
        if all(k in lesson_info for k in ['lesson_title', 'grade_name', 'subject_name']):
            try:
                # Find grade
                grade = Grade.objects.filter(name__icontains=lesson_info['grade_name']).first()
                if not grade:
                    self.stdout.write(self.style.ERROR(f'❌ Grade not found: {lesson_info["grade_name"]}'))
                    return None

                # Find subject
                subject = Subject.objects.filter(name__icontains=lesson_info['subject_name']).first()
                if not subject:
                    self.stdout.write(self.style.ERROR(f'❌ Subject not found: {lesson_info["subject_name"]}'))
                    return None

                # Find lesson
                lesson = Lesson.objects.filter(
                    title__icontains=lesson_info['lesson_title'],
                    grade=grade,
                    subject=subject
                ).first()

                if not lesson:
                    self.stdout.write(self.style.ERROR(
                        f'❌ Lesson not found: {lesson_info["lesson_title"]} '
                        f'({lesson_info["grade_name"]}, {lesson_info["subject_name"]})'
                    ))
                    return None

                return lesson

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'❌ Error finding lesson: {str(e)}'))
                return None

        self.stdout.write(self.style.ERROR(
            '❌ Please provide either "lesson_id" OR all of: '
            '"lesson_title", "grade_name", "subject_name"'
        ))
        return None

    def _create_exercise(self, lesson, exercise_data, admin_user, delete_existing):
        """Create exercise from data"""
        
        # Delete existing if requested
        if delete_existing:
            existing = Exercise.objects.filter(
                lesson=lesson,
                title=exercise_data['title']
            )
            count = existing.count()
            if count > 0:
                existing.delete()
                self.stdout.write(self.style.WARNING(f'⚠️  Deleted {count} existing exercise(s)'))

        try:
            exercise = Exercise.objects.create(
                lesson=lesson,
                created_by=admin_user,
                title=exercise_data.get('title', 'Untitled Exercise'),
                title_arabic=exercise_data.get('title_arabic', ''),
                description=exercise_data.get('description', ''),
                instructions=exercise_data.get('instructions', ''),
                exercise_format=exercise_data.get('exercise_format', 'mixed'),
                difficulty_level=exercise_data.get('difficulty_level', 'intermediate'),
                estimated_duration=exercise_data.get('estimated_duration'),
                time_limit=exercise_data.get('time_limit'),
                is_timed=exercise_data.get('is_timed', False),
                total_points=exercise_data.get('total_points', 10.0),
                auto_grade=exercise_data.get('auto_grade', True),
                randomize_questions=exercise_data.get('randomize_questions', False),
                show_results_immediately=exercise_data.get('show_results_immediately', True),
                allow_multiple_attempts=exercise_data.get('allow_multiple_attempts', True),
                max_attempts=exercise_data.get('max_attempts', 0),
                is_active=exercise_data.get('is_active', True),
                is_published=exercise_data.get('is_published', True)
            )

            # Create default reward config
            ExerciseReward.objects.create(exercise=exercise)

            return exercise

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error creating exercise: {str(e)}'))
            return None

    def _create_questions(self, exercise, questions_data):
        """Create questions and choices from data"""
        
        questions_created = 0

        for q_data in questions_data:
            # Skip metadata comments
            if '_comment' in q_data:
                continue

            try:
                # Create question
                question = Question.objects.create(
                    exercise=exercise,
                    question_type=q_data.get('question_type', 'qcm_single'),
                    question_text=q_data.get('question_text', ''),
                    question_text_arabic=q_data.get('question_text_arabic', ''),
                    explanation=q_data.get('explanation', ''),
                    explanation_arabic=q_data.get('explanation_arabic', ''),
                    points=q_data.get('points', 1.0),
                    order=q_data.get('order', 0),
                    is_required=q_data.get('is_required', True)
                )

                # Create choices (for QCM, true/false questions)
                if 'choices' in q_data and q_data['choices']:
                    for choice_data in q_data['choices']:
                        QuestionChoice.objects.create(
                            question=question,
                            choice_text=choice_data.get('choice_text', ''),
                            choice_text_arabic=choice_data.get('choice_text_arabic', ''),
                            is_correct=choice_data.get('is_correct', False),
                            order=choice_data.get('order', 0)
                        )

                questions_created += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'⚠️  Error creating question {q_data.get("order", "?")}: {str(e)}'
                ))
                continue

        return questions_created
