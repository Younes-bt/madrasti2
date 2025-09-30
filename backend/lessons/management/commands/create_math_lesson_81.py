"""
Management Command for Creating Exercises for Lesson: Numerical sequences (ID 81)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Numerical sequences" - Lesson ID: 81'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 81
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
                'title': 'Arithmetic Sequences',
                'title_arabic': 'المتتاليات الحسابية',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'For an arithmetic sequence, the difference between consecutive terms is...',
                        'text_arabic': 'في المتتالية الحسابية، الفرق بين حدود متتالية هو...',
                        'points': 2.0,
                        'choices': [
                            {'text': 'Constant', 'text_arabic': 'ثابت', 'is_correct': True},
                            {'text': 'Variable', 'text_arabic': 'متغير', 'is_correct': False},
                            {'text': 'Always positive', 'text_arabic': 'موجب دائما', 'is_correct': False},
                            {'text': 'A ratio', 'text_arabic': 'نسبة', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'open_short',
                        'text': 'An arithmetic sequence has u(0) = 5 and a common difference of 3. What is u(10)?',
                        'text_arabic': 'متتالية حسابية حدها الأول u(0) = 5 وأساسها 3. ما هي قيمة u(10)؟',
                        'points': 3.0,
                        'explanation': 'u(10) = u(0) + 10*d = 5 + 10*3 = 35.',
                        'explanation_arabic': 'u(10) = u(0) + 10*d = 5 + 10*3 = 35.'
                    },
                ]
            },
            {
                'title': 'Geometric Sequences',
                'title_arabic': 'المتتاليات الهندسية',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'For a geometric sequence, the ratio between consecutive terms is...',
                        'text_arabic': 'في المتتالية الهندسية، النسبة بين حدود متتالية هي...',
                        'points': 2.0,
                        'choices': [
                            {'text': 'Constant', 'text_arabic': 'ثابتة', 'is_correct': True},
                            {'text': 'Variable', 'text_arabic': 'متغيرة', 'is_correct': False},
                            {'text': 'Always an integer', 'text_arabic': 'دائما عدد صحيح', 'is_correct': False},
                            {'text': 'A difference', 'text_arabic': 'فرق', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'open_short',
                        'text': 'A geometric sequence has u(0) = 2 and a common ratio of 3. What is u(4)?',
                        'text_arabic': 'متتالية هندسية حدها الأول u(0) = 2 وأساسها 3. ما هي قيمة u(4)؟',
                        'points': 4.0,
                        'explanation': 'u(4) = u(0) * q^4 = 2 * 3^4 = 2 * 81 = 162.',
                        'explanation_arabic': 'u(4) = u(0) * q^4 = 2 * 3^4 = 2 * 81 = 162.'
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
