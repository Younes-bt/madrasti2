"""
Management Command for Creating Exercises for Lesson: Arithmetic in Z (ID 82)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Arithmetic in Z" - Lesson ID: 82'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 82
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
                'title': 'Divisibility and GCD',
                'title_arabic': 'القاسمية والقاسم المشترك الأكبر',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'Which of the following numbers is a divisor of 24?',
                        'text_arabic': 'أي من الأعداد التالية هو قاسم للعدد 24؟',
                        'points': 2.0,
                        'choices': [
                            {'text': '8', 'text_arabic': '8', 'is_correct': True},
                            {'text': '5', 'text_arabic': '5', 'is_correct': False},
                            {'text': '7', 'text_arabic': '7', 'is_correct': False},
                            {'text': '10', 'text_arabic': '10', 'is_correct': False},
                        ]
                    },
                    {
                        'type': 'open_short',
                        'text': 'What is the Greatest Common Divisor (GCD) of 12 and 18?',
                        'text_arabic': 'ما هو القاسم المشترك الأكبر للعددين 12 و 18؟',
                        'points': 3.0,
                        'explanation': 'Divisors of 12 are {1,2,3,4,6,12}. Divisors of 18 are {1,2,3,6,9,18}. The GCD is 6.',
                        'explanation_arabic': 'قواسم 12 هي {1,2,3,4,6,12}. قواسم 18 هي {1,2,3,6,9,18}. القاسم المشترك الأكبر هو 6.'
                    },
                ]
            },
            {
                'title': 'Modular Arithmetic',
                'title_arabic': 'حسابيات البواقي',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'What is 17 mod 5?',
                        'text_arabic': 'ما هو باقي قسمة 17 على 5؟',
                        'points': 3.0,
                        'choices': [
                            {'text': '2', 'text_arabic': '2', 'is_correct': True},
                            {'text': '1', 'text_arabic': '1', 'is_correct': False},
                            {'text': '3', 'text_arabic': '3', 'is_correct': False},
                            {'text': '4', 'text_arabic': '4', 'is_correct': False},
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
