"""
Management Command for Creating Exercises for Lesson: Internal composition laws (ID 85)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Internal composition laws" - Lesson ID: 85'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 85
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
                'title': 'Properties of Laws',
                'title_arabic': 'خصائص القوانين',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'A law * is commutative if for all a, b:',
                        'text_arabic': 'يكون القانون * تبديلياً إذا كان لكل a, b:',
                        'points': 2.0,
                        'choices': [
                            {'text': 'a * b = b * a', 'text_arabic': 'a * b = b * a', 'is_correct': True},
                            {'text': 'a * (b * c) = (a * b) * c', 'text_arabic': 'a * (b * c) = (a * b) * c', 'is_correct': False},
                            {'text': 'a * e = a', 'text_arabic': 'a * e = a', 'is_correct': False},
                            {'text': 'a * a_inv = e', 'text_arabic': 'a * a_inv = e', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'true_false',
                        'text': 'Addition (+) in the set of integers Z is associative.',
                        'text_arabic': 'الجمع (+) في مجموعة الأعداد الصحيحة Z هو تجميعي.',
                        'points': 2.0,
                        'choices': [
                            {'text': 'True', 'text_arabic': 'صحيح', 'is_correct': True},
                            {'text': 'False', 'text_arabic': 'خطأ', 'is_correct': False},
                        ]
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
