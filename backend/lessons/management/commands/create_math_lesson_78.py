"""
Management Command for Creating Exercises for Lesson: Natural exponential functions (ID 78)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Natural exponential functions" - Lesson ID: 78'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 78
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
                'title': 'Properties of the Exponential Function',
                'title_arabic': 'خصائص الدالة الأسية الطبيعية',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'What is the value of exp(0)?',
                        'text_arabic': 'ما هي قيمة exp(0)؟',
                        'points': 2.0,
                        'choices': [
                            {'text': '1', 'text_arabic': '1', 'is_correct': True},
                            {'text': '0', 'text_arabic': '0', 'is_correct': False},
                            {'text': 'e', 'text_arabic': 'e', 'is_correct': False},
                            {'text': 'Not defined', 'text_arabic': 'غير معرفة', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'true_false',
                        'text': 'The function f(x) = exp(x) is always positive.',
                        'text_arabic': 'الدالة f(x) = exp(x) هي دائما موجبة.',
                        'points': 2.0,
                        'choices': [
                            {'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'qcm_single',
                        'text': 'What is the derivative of f(x) = exp(x)?',
                        'text_arabic': 'ما هي مشتقة الدالة f(x) = exp(x)؟',
                        'points': 2.0,
                        'choices': [
                            {'text': 'exp(x)', 'text_arabic': 'exp(x)', 'is_correct': True},
                            {'text': 'ln(x)', 'text_arabic': 'ln(x)', 'is_correct': False},
                            {'text': '1/x', 'text_arabic': '1/x', 'is_correct': False},
                            {'text': 'x*exp(x-1)', 'text_arabic': 'x*exp(x-1)', 'is_correct': False},
                        ]
                    },
                ]
            },
            {
                'title': 'Solving Exponential Equations',
                'title_arabic': 'حل المعادلات الأسية',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'open_short',
                        'text': 'Solve for x: exp(x) = 1',
                        'text_arabic': 'حل المعادلة: exp(x) = 1',
                        'points': 3.0,
                        'explanation': 'The answer is x=0, because exp(0) = 1.',
                        'explanation_arabic': 'الحل هو x=0، لأن exp(0) = 1.',
                    },
                    {
                        'type': 'open_short',
                        'text': 'Solve for x: exp(2x) = e^4',
                        'text_arabic': 'حل المعادلة: exp(2x) = e^4',
                        'points': 4.0,
                        'explanation': '2x = 4, so x = 2.',
                        'explanation_arabic': '2x = 4، إذن x = 2.',
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
