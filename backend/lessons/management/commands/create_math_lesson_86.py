"""
Management Command for Creating Exercises for Lesson: Logarithmic functions (ID 86)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Logarithmic functions" - Lesson ID: 86'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 86
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
                'title': 'Properties of Logarithms',
                'title_arabic': 'خصائص اللوغاريتمات',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'What is the value of ln(1)?',
                        'text_arabic': 'ما هي قيمة ln(1)؟',
                        'points': 2.0,
                        'choices': [
                            {'text': '0', 'text_arabic': '0', 'is_correct': True},
                            {'text': '1', 'text_arabic': '1', 'is_correct': False},
                            {'text': 'e', 'text_arabic': 'e', 'is_correct': False},
                            {'text': 'Not defined', 'text_arabic': 'غير معرفة', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'qcm_single',
                        'text': 'ln(a) + ln(b) is equal to:',
                        'text_arabic': 'ln(a) + ln(b) تساوي:',
                        'points': 2.0,
                        'choices': [
                            {'text': 'ln(a * b)', 'text_arabic': 'ln(a * b)', 'is_correct': True},
                            {'text': 'ln(a + b)', 'text_arabic': 'ln(a + b)', 'is_correct': False},
                            {'text': 'ln(a / b)', 'text_arabic': 'ln(a / b)', 'is_correct': False},
                            {'text': 'ln(a)^ln(b)', 'text_arabic': 'ln(a)^ln(b)', 'is_correct': False},
                        ]
                    },
                ]
            },
            {
                'title': 'Solving Logarithmic Equations',
                'title_arabic': 'حل المعادلات اللوغاريتمية',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'open_short',
                        'text': 'Solve for x: ln(x) = 1',
                        'text_arabic': 'حل المعادلة: ln(x) = 1',
                        'points': 3.0,
                        'explanation': 'The answer is x=e, because ln(e) = 1.',
                        'explanation_arabic': 'الحل هو x=e، لأن ln(e) = 1.'
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
