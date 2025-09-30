"""
Management Command for Creating Exercises for Lesson: Limit of a sequence (ID 79)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Limit of a sequence" - Lesson ID: 79'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 79
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
                'title': 'Understanding Sequence Limits',
                'title_arabic': 'فهم نهايات المتتاليات',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'A sequence that has a finite limit is called:',
                        'text_arabic': 'المتتالية التي لها نهاية منتهية تسمى:',
                        'points': 2.0,
                        'choices': [
                            {'text': 'Convergent', 'text_arabic': 'متقاربة', 'is_correct': True},
                            {'text': 'Divergent', 'text_arabic': 'متباعدة', 'is_correct': False},
                            {'text': 'Arithmetic', 'text_arabic': 'حسابية', 'is_correct': False},
                            {'text': 'Geometric', 'text_arabic': 'هندسية', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'true_false',
                        'text': 'Every bounded sequence is convergent.',
                        'text_arabic': 'كل متتالية محدودة هي متقاربة.',
                        'points': 2.0,
                        'choices': [
                            {'text': 'True', 'text_arabic': 'صحيح', 'is_correct': False},
                            {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': True},
                        ],
                        'explanation': 'False. A bounded sequence must also be monotonic to guarantee convergence.',
                        'explanation_arabic': 'خطأ. يجب أن تكون المتتالية المحدودة رتيبة أيضاً لضمان تقاربها.'
                    },
                ]
            },
            {
                'title': 'Calculating Limits',
                'title_arabic': 'حساب النهايات',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'What is the limit of the sequence u(n) = 1/n as n approaches +infinity?',
                        'text_arabic': 'ما هي نهاية المتتالية u(n) = 1/n عندما تؤول n إلى +infinity؟',
                        'points': 3.0,
                        'choices': [
                            {'text': '0', 'text_arabic': '0', 'is_correct': True},
                            {'text': '1', 'text_arabic': '1', 'is_correct': False},
                            {'text': '+infinity', 'text_arabic': '+infinity', 'is_correct': False},
                            {'text': 'Does not exist', 'text_arabic': 'غير موجودة', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'open_short',
                        'text': 'Find the limit of the sequence v(n) = (2n + 1) / (n + 5) as n approaches +infinity.',
                        'text_arabic': 'أوجد نهاية المتتالية v(n) = (2n + 1) / (n + 5) عندما تؤول n إلى +infinity.',
                        'points': 4.0,
                        'explanation': 'The limit is the ratio of the highest power terms, which is 2n/n = 2.',
                        'explanation_arabic': 'النهاية هي نسبة الحدود ذات الأس الأعلى، وهي 2n/n = 2.'
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
