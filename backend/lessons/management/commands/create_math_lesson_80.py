"""
Management Command for Creating Exercises for Lesson: Finite increments (ID 80)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Finite increments" - Lesson ID: 80'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 80
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
                'title': "Rolle's Theorem",
                'title_arabic': 'مبرهنة رول',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_multiple',
                        'text': "Which of these are conditions for Rolle's Theorem for a function f on [a, b]?",
                        'text_arabic': 'أي من هذه الشروط هي شروط مبرهنة رول للدالة f على [a, b]؟',
                        'points': 3.0,
                        'choices': [
                            {'text': 'f is continuous on [a, b]', 'text_arabic': 'f متصلة على [a, b]', 'is_correct': True},
                            {'text': 'f is differentiable on (a, b)', 'text_arabic': 'f قابلة للاشتقاق على (a, b)', 'is_correct': True},
                            {'text': 'f(a) = f(b)', 'text_arabic': 'f(a) = f(b)', 'is_correct': True},
                            {'text': 'f(a) > f(b)', 'text_arabic': 'f(a) > f(b)', 'is_correct': False},
                        ]
                    },
                ]
            },
            {
                'title': 'Mean Value Theorem',
                'title_arabic': 'مبرهنة القيمة المتوسطة',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'qcm_single',
                        'text': 'The Mean Value Theorem guarantees the existence of a point c in (a, b) such that f\'(c) is equal to:',
                        'text_arabic': 'تضمن مبرهنة القيمة المتوسطة وجود نقطة c في (a, b) بحيث تكون f\'(c) مساوية لـ:',
                        'points': 4.0,
                        'choices': [
                            {'text': '(f(b) - f(a)) / (b - a)', 'text_arabic': '(f(b) - f(a)) / (b - a)', 'is_correct': True},
                            {'text': '(f(b) + f(a)) / (b + a)', 'text_arabic': '(f(b) + f(a)) / (b + a)', 'is_correct': False},
                            {'text': 'f(b) - f(a)', 'text_arabic': 'f(b) - f(a)', 'is_correct': False},
                            {'text': '0', 'text_arabic': '0', 'is_correct': False},
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
