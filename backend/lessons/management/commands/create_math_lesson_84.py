"""
Management Command for Creating Exercises for Lesson: Algebraic structures (ID 84)
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from lessons.models import Lesson
from homework.models import Exercise, Question, QuestionChoice, ExerciseReward


class Command(BaseCommand):
    help = 'Create exercises for "Algebraic structures" - Lesson ID: 84'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            help='Delete existing exercises for this lesson before creating new ones',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        lesson_id = 84
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
                'title': 'Groups',
                'title_arabic': 'الزمر',
                'difficulty': 'beginner',
                'questions': [
                    {
                        'type': 'qcm_multiple',
                        'text': 'Which properties define a group (G, *)?',
                        'text_arabic': 'أي الخصائص تعرف الزمرة (G, *)؟',
                        'points': 4.0,
                        'choices': [
                            {'text': 'Associativity', 'text_arabic': 'التجميعية', 'is_correct': True},
                            {'text': 'Identity element', 'text_arabic': 'العنصر المحايد', 'is_correct': True},
                            {'text': 'Inverse element', 'text_arabic': 'العنصر المماثل', 'is_correct': True},
                            {'text': 'Commutativity', 'text_arabic': 'التبديلية', 'is_correct': False},
                        ],
                        'explanation': 'Commutativity is required for an Abelian group, but not a general group.',
                        'explanation_arabic': 'التبديلية مطلوبة للزمرة الأبيلية، ولكن ليس للزمرة العامة.'
                    },
                ]
            },
            {
                'title': 'Rings and Fields',
                'title_arabic': 'الحلقات والحقول',
                'difficulty': 'intermediate',
                'questions': [
                    {
                        'type': 'true_false',
                        'text': 'Every field is also a ring.',
                        'text_arabic': 'كل حقل هو أيضا حلقة.',
                        'points': 3.0,
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
