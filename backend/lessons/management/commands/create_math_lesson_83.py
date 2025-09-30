"""
Management Command for Creating Exercises for Lesson: Complex numbers (ID 83)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Complex numbers" - Lesson ID: 83'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 83
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Lesson with ID {lesson_id} not found.'))
            return

        if options['delete_existing']:
            Exercise.objects.filter(lesson=lesson).delete()
            self.stdout.write(self.style.WARNING(f'Deleted existing exercises for lesson ID: {lesson.id}'))

        exercises_data = [
            {
                'title': 'Basic Operations',
                'title_arabic': 'العمليات الأساسية',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'What is i^2?',
                        'text_arabic': 'ما هي قيمة i^2؟',
                        'points': 2.0,
                        'choices': [
                            {'text': '-1', 'text_arabic': '-1', 'is_correct': True},
                            {'text': '1', 'text_arabic': '1', 'is_correct': False},
                            {'text': 'i', 'text_arabic': 'i', 'is_correct': False},
                            {'text': '-i', 'text_arabic': '-i', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'open_short',
                        'text': 'Calculate (2 + 3i) + (4 - i).',
                        'text_arabic': 'احسب (2 + 3i) + (4 - i).',
                        'points': 3.0,
                        'explanation': 'Real parts: 2+4=6. Imaginary parts: 3i-i=2i. Result: 6 + 2i.',
                        'explanation_arabic': 'الأجزاء الحقيقية: 2+4=6. الأجزاء التخيلية: 3i-i=2i. النتيجة: 6 + 2i.'
                    },
                ]
            },
            {
                'title': 'Polar Form',
                'title_arabic': 'الشكل المثلثي',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'What is the modulus of the complex number z = 3 + 4i?',
                        'text_arabic': 'ما هو معيار العدد العقدي z = 3 + 4i؟',
                        'points': 3.0,
                        'choices': [
                            {'text': '5', 'text_arabic': '5', 'is_correct': True},
                            {'text': '7', 'text_arabic': '7', 'is_correct': False},
                            {'text': '25', 'text_arabic': '25', 'is_correct': False},
                            {'text': 'sqrt(7)', 'text_arabic': 'sqrt(7)', 'is_correct': False},
                        ],
                        'explanation': '|z| = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5.',
                        'explanation_arabic': '|z| = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5.'
                    },
                ]
            },
        ]

        self.create_exercises(lesson, exercises_data)
        self.stdout.write(self.style.SUCCESS(f'Successfully created exercises for lesson ID: {lesson_id}'))

    def create_exercises(self, lesson, exercises_data):
        for i, ex_data in enumerate(exercises_data, 1):
            exercise = Exercise.objects.create(
                lesson=lesson, created_by_id=1, title=ex_data['title'], title_arabic=ex_data['title_arabic'],
                difficulty_level=ex_data['difficulty'], order=i, is_active=True, is_published=True
            )
            for j, q_data in enumerate(ex_data['questions'], 1):
                question = Question.objects.create(
                    exercise=exercise, question_type=q_data['type'], question_text=q_data['text'],
                    question_text_arabic=q_data.get('text_arabic', ''), points=q_data['points'], order=j
                )
                if 'choices' in q_data:
                    for k, choice_data in enumerate(q_data['choices'], 1):
                        QuestionChoice.objects.create(
                            question=question, choice_text=choice_data['text'],
                            choice_text_arabic=choice_data.get('text_arabic', ''),
                            is_correct=choice_data['is_correct'], order=k
                        )
            self.create_exercise_rewards(exercise, ex_data['difficulty'])

    def create_exercise_rewards(self, exercise, difficulty):
        rewards = {'beginner': 5, 'intermediate': 10, 'advanced': 15}
        ExerciseReward.objects.create(
            exercise=exercise, completion_points=rewards.get(difficulty, 10),
            perfect_score_bonus=rewards.get(difficulty, 10)
        )
