"""
Management Command for Creating Exercises for Lesson: Exponential functions (ID 87)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Exponential functions" - Lesson ID: 87'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 87
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
                'title': 'Properties of Exponential Functions',
                'title_arabic': 'خصائص الدوال الأسية',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'What is the value of 2^3?',
                        'text_arabic': 'ما هي قيمة 2^3؟',
                        'points': 2.0,
                        'choices': [
                            {'text': '8', 'text_arabic': '8', 'is_correct': True},
                            {'text': '6', 'text_arabic': '6', 'is_correct': False},
                            {'text': '9', 'text_arabic': '9', 'is_correct': False},
                            {'text': '5', 'text_arabic': '5', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'qcm_single',
                        'text': 'a^x * a^y is equal to:',
                        'text_arabic': 'a^x * a^y تساوي:',
                        'points': 2.0,
                        'choices': [
                            {'text': 'a^(x+y)', 'text_arabic': 'a^(x+y)', 'is_correct': True},
                            {'text': 'a^(x*y)', 'text_arabic': 'a^(x*y)', 'is_correct': False},
                            {'text': '(2a)^(x+y)', 'text_arabic': '(2a)^(x+y)', 'is_correct': False},
                            {'text': 'a^(x-y)', 'text_arabic': 'a^(x-y)', 'is_correct': False},
                        ]
                    },
                ]
            },
            {
                'title': 'Solving Equations',
                'title_arabic': 'حل المعادلات',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'open_short',
                        'text': 'Solve for x: 2^x = 16',
                        'text_arabic': 'حل المعادلة: 2^x = 16',
                        'points': 3.0,
                        'explanation': '16 is 2^4, so x = 4.',
                        'explanation_arabic': '16 يساوي 2^4، إذن x = 4.'
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
