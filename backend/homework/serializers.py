# homework/serializers.py
import json
from datetime import time, datetime, date
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import (
    # Reward Models
    RewardSettings, RewardType, StudentWallet, RewardTransaction,
    # Badge Models
    Badge, StudentBadge,

    # Leaderboard Models
    Leaderboard, LeaderboardEntry, WeeklyLeaderboardSnapshot,

    # Textbook Models
    TextbookLibrary,

    # Exercise Models
    Exercise, ExerciseReward, ExerciseSubmission, ExerciseAnswer,

    # Homework Models (renamed from Assignment)
    Homework, HomeworkReward, Question, QuestionChoice, BookExercise,
    FillBlank, FillBlankOption, OrderingItem, MatchingPair,

    # Submission Models
    Submission, QuestionAnswer, AnswerFile, BookExerciseAnswer, BookExerciseFile,
    AnswerFillBlankSelection, AnswerOrderingSelection, AnswerMatchingSelection,

    # Progress Tracking Models
    LessonProgress
)

User = get_user_model()

# =====================================
# USER SERIALIZERS (BASIC)
# =====================================

class BasicUserSerializer(serializers.ModelSerializer):
    """Basic user info for nested relationships"""
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'role']

# =====================================
# REWARD SYSTEM SERIALIZERS
# =====================================

class RewardSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardSettings
        fields = '__all__'

class RewardTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardType
        fields = '__all__'

class StudentWalletSerializer(serializers.ModelSerializer):
    student = BasicUserSerializer(read_only=True)
    current_level_name = serializers.ReadOnlyField()
    
    class Meta:
        model = StudentWallet
        fields = '__all__'

class RewardTransactionSerializer(serializers.ModelSerializer):
    student = BasicUserSerializer(read_only=True)
    awarded_by = BasicUserSerializer(read_only=True)
    
    class Meta:
        model = RewardTransaction
        fields = '__all__'

# =====================================
# BADGE SYSTEM SERIALIZERS
# =====================================

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class StudentBadgeSerializer(serializers.ModelSerializer):
    student = BasicUserSerializer(read_only=True)
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = StudentBadge
        fields = '__all__'

# =====================================
# LEADERBOARD SERIALIZERS
# =====================================

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leaderboard
        fields = '__all__'

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    student = BasicUserSerializer(read_only=True)
    
    class Meta:
        model = LeaderboardEntry
        fields = '__all__'

class WeeklyLeaderboardSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyLeaderboardSnapshot
        fields = '__all__'

# =====================================
# TEXTBOOK SERIALIZERS
# =====================================

class TextbookLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = TextbookLibrary
        fields = '__all__'

# =====================================
# QUESTION & CHOICE SERIALIZERS
# =====================================

class QuestionChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionChoice
        fields = '__all__'

class FillBlankOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillBlankOption
        fields = '__all__'

class FillBlankSerializer(serializers.ModelSerializer):
    options = FillBlankOptionSerializer(many=True, read_only=True)

    class Meta:
        model = FillBlank
        fields = '__all__'

class OrderingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderingItem
        fields = '__all__'

class MatchingPairSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchingPair
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    choices = QuestionChoiceSerializer(many=True, read_only=True)
    blanks = FillBlankSerializer(many=True, read_only=True)
    ordering_items = OrderingItemSerializer(many=True, read_only=True)
    matching_pairs = MatchingPairSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure choices are always included and properly ordered
        if instance.choices.exists():
            choices = instance.choices.all().order_by('order')
            representation['choices'] = QuestionChoiceSerializer(choices, many=True).data
        else:
            representation['choices'] = []
        # Include blanks/options
        if instance.blanks.exists():
            representation['blanks'] = FillBlankSerializer(instance.blanks.all(), many=True).data
        else:
            representation['blanks'] = []
        # Include ordering items
        if instance.ordering_items.exists():
            representation['ordering_items'] = OrderingItemSerializer(instance.ordering_items.all(), many=True).data
        else:
            representation['ordering_items'] = []
        # Include matching pairs
        if instance.matching_pairs.exists():
            representation['matching_pairs'] = MatchingPairSerializer(instance.matching_pairs.all(), many=True).data
        else:
            representation['matching_pairs'] = []

        if instance.question_image:
            try:
                representation['question_image_url'] = instance.question_image.url
            except Exception:
                representation['question_image_url'] = None
        else:
            representation['question_image_url'] = None
        return representation

class QuestionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating questions with choices"""
    choices = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        write_only=True
    )
    blanks = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    ordering_items = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    matching_pairs = serializers.ListField(child=serializers.DictField(), required=False, write_only=True)
    question_image = serializers.ImageField(required=False, allow_null=True, allow_empty_file=False, use_url=True)
    remove_image = serializers.BooleanField(required=False, default=False, write_only=True)

    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def to_internal_value(self, data):
        mutable_data = data.copy() if hasattr(data, 'copy') else data
        parsed_json_fields = {}

        # Normalize JSON-like fields that might arrive as strings via multipart form data
        json_fields = ['choices', 'blanks', 'ordering_items', 'matching_pairs']
        for field in json_fields:
            raw_value = None
            if hasattr(mutable_data, 'get'):
                raw_value = mutable_data.get(field)
            elif isinstance(mutable_data, dict):
                raw_value = mutable_data.get(field)

            if hasattr(mutable_data, 'getlist'):
                raw_list = mutable_data.getlist(field)
                if raw_list and len(raw_list) == 1:
                    raw_value = raw_list[0]

            if isinstance(raw_value, str):
                try:
                    parsed_json_fields[field] = json.loads(raw_value)
                except (ValueError, TypeError):
                    continue

        # Handle empty string for question_image (when updating without changing image)
        if hasattr(mutable_data, '__contains__') and 'question_image' in mutable_data:
            image_value = mutable_data['question_image']
            if image_value in ['', 'null', None]:
                if hasattr(mutable_data, 'pop'):
                    mutable_data.pop('question_image')

        # Build a plain dictionary so complex objects (lists/dicts/files) survive validation
        if hasattr(mutable_data, 'getlist'):
            normalized_data = {}
            for key in mutable_data.keys():
                if key in parsed_json_fields:
                    normalized_data[key] = parsed_json_fields[key]
                    continue

                values = mutable_data.getlist(key)
                if len(values) == 0:
                    normalized_data[key] = None
                elif len(values) == 1:
                    normalized_data[key] = values[0]
                else:
                    normalized_data[key] = values
        elif isinstance(mutable_data, dict):
            normalized_data = {**mutable_data}
        else:
            normalized_data = mutable_data

        if isinstance(normalized_data, dict):
            for key, value in parsed_json_fields.items():
                normalized_data[key] = value

        return super().to_internal_value(normalized_data)

    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])
        blanks_data = validated_data.pop('blanks', [])
        ordering_items_data = validated_data.pop('ordering_items', [])
        matching_pairs_data = validated_data.pop('matching_pairs', [])

        # For standalone questions, set the author
        if not validated_data.get('homework') and not validated_data.get('exercise'):
            validated_data['author'] = self.context['request'].user

        remove_image = validated_data.pop('remove_image', False)

        question = Question.objects.create(**validated_data)

        if remove_image and question.question_image:
            question.question_image.delete(save=True)

        for choice_data in choices_data:
            choice_data.pop('question', None)
            QuestionChoice.objects.create(question=question, **choice_data)

        # Fill-in-the-blanks nested create
        for blank_data in blanks_data:
            options = blank_data.pop('options', [])
            blank_obj = FillBlank.objects.create(question=question, **blank_data)
            for opt in options:
                FillBlankOption.objects.create(blank=blank_obj, **opt)

        # Ordering items
        for item in ordering_items_data:
            OrderingItem.objects.create(question=question, **item)

        # Matching pairs
        for pair in matching_pairs_data:
            MatchingPair.objects.create(question=question, **pair)

        return question

    def update(self, instance, validated_data):
        choices_data = validated_data.pop('choices', None)
        blanks_data = validated_data.pop('blanks', None)
        ordering_items_data = validated_data.pop('ordering_items', None)
        matching_pairs_data = validated_data.pop('matching_pairs', None)
        remove_image_flag = validated_data.pop('remove_image', False)
        new_question_image = validated_data.pop('question_image', serializers.empty)

        # Remove homework and exercise from validated_data during update
        # These fields should not be changed after creation
        validated_data.pop('homework', None)
        validated_data.pop('exercise', None)
        validated_data.pop('author', None)

        request = self.context.get('request')
        if request:
            if not remove_image_flag:
                incoming_flag = request.data.get('remove_image')
                if isinstance(incoming_flag, str):
                    remove_image_flag = incoming_flag.lower() in ('true', '1', 'yes')
                else:
                    remove_image_flag = bool(incoming_flag)

        # Handle image removal
        if remove_image_flag:
            if instance.question_image:
                instance.question_image.delete(save=False)
            instance.question_image = None
            # Make sure we don't override this with a new image
            validated_data.pop('question_image', None)

        instance = super().update(instance, validated_data)

        if new_question_image is not serializers.empty:
            if new_question_image:
                instance.question_image = new_question_image
            else:
                instance.question_image = None
            instance.save(update_fields=['question_image'])

        if choices_data is not None:
            instance.choices.all().delete()
            for choice_data in choices_data:
                choice_data.pop('question', None)
                QuestionChoice.objects.create(question=instance, **choice_data)

        if blanks_data is not None:
            instance.blanks.all().delete()
            for blank_data in blanks_data:
                options = blank_data.pop('options', [])
                blank_obj = FillBlank.objects.create(question=instance, **blank_data)
                for opt in options:
                    FillBlankOption.objects.create(blank=blank_obj, **opt)

        if ordering_items_data is not None:
            instance.ordering_items.all().delete()
            for item in ordering_items_data:
                OrderingItem.objects.create(question=instance, **item)

        if matching_pairs_data is not None:
            instance.matching_pairs.all().delete()
            for pair in matching_pairs_data:
                MatchingPair.objects.create(question=instance, **pair)

        return instance

class BookExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookExercise
        fields = '__all__'

# =====================================
# EXERCISE SERIALIZERS
# =====================================

class ExerciseRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseReward
        exclude = ['id', 'exercise']

class ExerciseCreateSerializer(serializers.ModelSerializer):
    reward_config = ExerciseRewardSerializer(write_only=True)

    class Meta:
        model = Exercise
        fields = '__all__'
        read_only_fields = ['created_by']

    def create(self, validated_data):
        reward_data = validated_data.pop('reward_config')
        validated_data['created_by'] = self.context['request'].user
        exercise = Exercise.objects.create(**validated_data)
        ExerciseReward.objects.create(exercise=exercise, **reward_data)
        return exercise

    def update(self, instance, validated_data):
        reward_data = validated_data.pop('reward_config', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if reward_data is not None:
            reward_obj, _ = ExerciseReward.objects.get_or_create(exercise=instance)
            for attr, value in reward_data.items():
                setattr(reward_obj, attr, value)
            reward_obj.save()

        return instance

class ExerciseAnswerSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField(source='question.id', read_only=True)
    selected_choice_ids = serializers.SerializerMethodField()

    class Meta:
        model = ExerciseAnswer
        fields = ['id', 'question_id', 'text_answer', 'selected_choice_ids', 'is_correct', 'points_earned']

    def get_selected_choice_ids(self, obj):
        return list(obj.selected_choices.values_list('id', flat=True))

class ExerciseSubmissionSerializer(serializers.ModelSerializer):
    exercise_id = serializers.IntegerField(source='exercise.id', read_only=True)
    student = BasicUserSerializer(read_only=True)
    answers = ExerciseAnswerSerializer(source='exercise_answers', many=True, read_only=True)

    class Meta:
        model = ExerciseSubmission
        fields = [
            'id', 'exercise_id', 'student', 'status', 'attempt_number',
            'started_at', 'completed_at', 'time_taken', 'total_score',
            'percentage_score', 'auto_score', 'points_earned',
            'questions_answered', 'questions_correct', 'answers'
        ]

class ExerciseAnswerInputSerializer(serializers.Serializer):
    question = serializers.IntegerField()
    text_answer = serializers.CharField(required=False, allow_blank=True)
    selected_choice_ids = serializers.ListField(child=serializers.IntegerField(), required=False, allow_empty=True)

class ExerciseDetailSerializer(serializers.ModelSerializer):
    reward_config = ExerciseRewardSerializer(read_only=True)
    created_by = BasicUserSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    is_completed = serializers.SerializerMethodField()
    attempts_count = serializers.SerializerMethodField()
    best_score = serializers.SerializerMethodField()
    latest_submission_status = serializers.SerializerMethodField()
    last_attempt_score = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = '__all__'

    def _get_student_submission_stats(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not getattr(user, 'is_authenticated', False) or getattr(user, 'role', None) != 'STUDENT':
            return {}

        cache = self.context.setdefault('_exercise_submission_stats', {})
        if obj.id in cache:
            return cache[obj.id]

        submissions = ExerciseSubmission.objects.filter(
            student=user,
            exercise=obj
        ).order_by('-created_at')

        latest = submissions.first()
        completed = submissions.filter(status__in=['completed', 'auto_graded', 'reviewed']).order_by('-created_at').first()
        best = submissions.filter(total_score__isnull=False).order_by('-total_score', '-created_at').first()

        stats = {
            'attempts_count': submissions.count(),
            'latest_status': latest.status if latest else None,
            'last_score': latest.total_score if latest and latest.total_score is not None else None,
            'best_score': best.total_score if best else None,
            'is_completed': completed is not None,
        }
        cache[obj.id] = stats
        return stats

    def get_is_completed(self, obj):
        return self._get_student_submission_stats(obj).get('is_completed', False)

    def get_attempts_count(self, obj):
        return self._get_student_submission_stats(obj).get('attempts_count', 0)

    def get_best_score(self, obj):
        score = self._get_student_submission_stats(obj).get('best_score')
        return float(score) if score is not None else None

    def get_latest_submission_status(self, obj):
        return self._get_student_submission_stats(obj).get('latest_status')

    def get_last_attempt_score(self, obj):
        score = self._get_student_submission_stats(obj).get('last_score')
        return float(score) if score is not None else None

# =====================================
# HOMEWORK SERIALIZERS (renamed from ASSIGNMENT)
# =====================================

class HomeworkRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkReward
        fields = '__all__'

class StudentHomeworkSerializerMixin:
    """Shared helpers for exposing student-specific homework fields"""

    def _get_student_submission(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if not user or getattr(user, 'is_authenticated', False) is False:
            return None
        if getattr(user, 'role', None) != 'STUDENT':
            return None

        cache_key = '_student_submission_cache'
        if hasattr(obj, cache_key):
            return getattr(obj, cache_key)

        submission = obj.submissions.filter(student=user).order_by('-attempt_number', '-created_at').first()
        setattr(obj, cache_key, submission)
        return submission

    def _serialize_student_submission(self, submission):
        if not submission:
            return None

        graded_by = submission.graded_by
        answer_queryset = submission.answers.all().select_related('question').prefetch_related(
            'selected_choices',
            'blank_selections',
            'blank_selections__blank',
            'blank_selections__selected_option',
            'ordering_selections',
            'ordering_selections__item',
            'matching_selections',
            'matching_selections__left_pair',
            'matching_selections__selected_right_pair'
        )
        answers = QuestionAnswerSerializer(answer_queryset, many=True, context=self.context).data if answer_queryset.exists() else []

        return {
            'id': submission.id,
            'status': submission.status,
            'started_at': submission.started_at,
            'submitted_at': submission.submitted_at,
            'time_taken': submission.time_taken,
            'attempt_number': submission.attempt_number,
            'is_late': submission.is_late,
            'total_score': submission.total_score,
            'auto_score': submission.auto_score,
            'manual_score': submission.manual_score,
            'points_earned': submission.points_earned,
            'coins_earned': submission.coins_earned,
            'bonus_points': submission.bonus_points,
            'teacher_feedback': submission.teacher_feedback,
            'graded_at': submission.graded_at,
            'graded_by': BasicUserSerializer(graded_by, context=self.context).data if graded_by else None,
            'answers': answers,
        }

    def _get_due_datetime(self, obj):
        due_date = getattr(obj, 'due_date', None)
        if not due_date:
            return None
        if timezone.is_naive(due_date):
            try:
                due_date = timezone.make_aware(due_date, timezone.get_current_timezone())
            except Exception:
                due_date = timezone.make_aware(due_date)
        return due_date

    def _student_status_for(self, obj, submission):
        if submission:
            return submission.status

        if not obj.is_published:
            return 'draft'

        due_date = self._get_due_datetime(obj)
        if due_date and timezone.now() > due_date:
            return 'overdue'

        return 'pending'

    def _seconds_until_due(self, obj):
        due_date = self._get_due_datetime(obj)
        if not due_date:
            return None
        delta = due_date - timezone.now()
        return int(delta.total_seconds())

class HomeworkListSerializer(StudentHomeworkSerializerMixin, serializers.ModelSerializer):
    """List view serializer for assignments"""
    teacher = BasicUserSerializer(read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    class_name = serializers.CharField(source='school_class.name', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    submissions_count = serializers.ReadOnlyField()
    student_submission = serializers.SerializerMethodField()
    student_status = serializers.SerializerMethodField()
    time_until_due = serializers.SerializerMethodField()
    is_pending = serializers.SerializerMethodField()

    class Meta:
        model = Homework
        fields = [
            'id', 'title', 'title_arabic', 'homework_type', 'homework_format',
            'due_date', 'total_points', 'is_published', 'is_overdue', 'submissions_count',
            'teacher', 'subject_name', 'grade_name', 'class_name', 'created_at',
            'student_submission', 'student_status', 'time_until_due', 'is_pending'
        ]

    def get_student_submission(self, obj):
        submission = self._get_student_submission(obj)
        return self._serialize_student_submission(submission)

    def get_student_status(self, obj):
        submission = self._get_student_submission(obj)
        return self._student_status_for(obj, submission)

    def get_time_until_due(self, obj):
        return self._seconds_until_due(obj)

    def get_is_pending(self, obj):
        status = self.get_student_status(obj)
        return status in {'pending', 'in_progress', 'draft', 'overdue'} and status not in {'submitted', 'auto_graded', 'manually_graded', 'late'}

class HomeworkDetailSerializer(StudentHomeworkSerializerMixin, serializers.ModelSerializer):
    """Detail view serializer for assignments"""
    teacher = BasicUserSerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    book_exercises = BookExerciseSerializer(many=True, read_only=True)
    reward_config = HomeworkRewardSerializer(read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    class_name = serializers.CharField(source='school_class.name', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    submissions_count = serializers.ReadOnlyField()
    student_submission = serializers.SerializerMethodField()
    student_status = serializers.SerializerMethodField()
    time_until_due = serializers.SerializerMethodField()
    is_pending = serializers.SerializerMethodField()

    class Meta:
        model = Homework
        fields = '__all__'

    def get_student_submission(self, obj):
        submission = self._get_student_submission(obj)
        return self._serialize_student_submission(submission)

    def get_student_status(self, obj):
        submission = self._get_student_submission(obj)
        return self._student_status_for(obj, submission)

    def get_time_until_due(self, obj):
        return self._seconds_until_due(obj)

    def get_is_pending(self, obj):
        status = self.get_student_status(obj)
        return status in {'pending', 'in_progress', 'draft', 'overdue'} and status not in {'submitted', 'auto_graded', 'manually_graded', 'late'}

class HomeworkCreateSerializer(serializers.ModelSerializer):
    """Create/Update serializer for assignments"""
    class Meta:
        model = Homework
        fields = '__all__'
        read_only_fields = ['teacher', 'assigned_date']
    
    def create(self, validated_data):
        validated_data['teacher'] = self.context['request'].user
        return super().create(validated_data)

# =====================================
# ANSWER FILE SERIALIZERS
# =====================================

class AnswerFileSerializer(serializers.ModelSerializer):
    uploaded_by = BasicUserSerializer(read_only=True)
    
    class Meta:
        model = AnswerFile
        fields = '__all__'

class BookExerciseFileSerializer(serializers.ModelSerializer):
    uploaded_by = BasicUserSerializer(read_only=True)
    
    class Meta:
        model = BookExerciseFile
        fields = '__all__'

# =====================================
# ANSWER SERIALIZERS
# =====================================

class QuestionAnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    selected_choices = QuestionChoiceSerializer(many=True, read_only=True)
    files = AnswerFileSerializer(many=True, read_only=True)
    blank_selections = serializers.SerializerMethodField()
    ordering_selections = serializers.SerializerMethodField()
    matching_selections = serializers.SerializerMethodField()

    class Meta:
        model = QuestionAnswer
        fields = '__all__'

    def get_blank_selections(self, obj):
        selections = obj.blank_selections.all()
        return [
            {
                'id': selection.id,
                'blank': selection.blank_id,
                'selected_option': selection.selected_option_id,
                'is_correct': selection.is_correct
            }
            for selection in selections
        ]

    def get_ordering_selections(self, obj):
        selections = obj.ordering_selections.all()
        return [
            {
                'id': selection.id,
                'item': selection.item_id,
                'selected_position': selection.selected_position,
                'is_correct': selection.is_correct
            }
            for selection in selections
        ]

    def get_matching_selections(self, obj):
        selections = obj.matching_selections.all()
        return [
            {
                'id': selection.id,
                'left_pair': selection.left_pair_id,
                'selected_right_pair': selection.selected_right_pair_id,
                'is_correct': selection.is_correct
            }
            for selection in selections
        ]

class QuestionAnswerCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating question answers"""
    selected_choice_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )
    
    class Meta:
        model = QuestionAnswer
        fields = ['question', 'text_answer', 'selected_choice_ids']
    
    def create(self, validated_data):
        selected_choice_ids = validated_data.pop('selected_choice_ids', [])
        answer = QuestionAnswer.objects.create(**validated_data)
        
        if selected_choice_ids:
            choices = QuestionChoice.objects.filter(id__in=selected_choice_ids)
            answer.selected_choices.set(choices)
        
        return answer
    
    def update(self, instance, validated_data):
        selected_choice_ids = validated_data.pop('selected_choice_ids', None)
        
        # Update text answer
        instance.text_answer = validated_data.get('text_answer', instance.text_answer)
        instance.save()
        
        # Update selected choices
        if selected_choice_ids is not None:
            choices = QuestionChoice.objects.filter(id__in=selected_choice_ids)
            instance.selected_choices.set(choices)
        
        return instance

class BookExerciseAnswerSerializer(serializers.ModelSerializer):
    book_exercise = BookExerciseSerializer(read_only=True)
    files = BookExerciseFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = BookExerciseAnswer
        fields = '__all__'

# =====================================
# SUBMISSION SERIALIZERS
# =====================================

class SubmissionListSerializer(serializers.ModelSerializer):
    """List view for submissions"""
    student = BasicUserSerializer(read_only=True)
    assignment_title = serializers.CharField(source='homework.title', read_only=True)
    
    class Meta:
        model = Submission
        fields = [
            'id', 'status', 'submitted_at', 'is_late', 'total_score',
            'points_earned', 'coins_earned', 'attempt_number',
            'student', 'assignment_title'
        ]

class SubmissionDetailSerializer(serializers.ModelSerializer):
    """Detail view for submissions"""
    student = BasicUserSerializer(read_only=True)
    homework = HomeworkDetailSerializer(read_only=True)
    answers = QuestionAnswerSerializer(many=True, read_only=True)
    book_exercise_answers = BookExerciseAnswerSerializer(many=True, read_only=True)
    graded_by = BasicUserSerializer(read_only=True)
    
    class Meta:
        model = Submission
        fields = '__all__'

class SubmissionCreateSerializer(serializers.ModelSerializer):
    """Create/Update serializer for submissions"""
    class Meta:
        model = Submission
        fields = [
            'homework', 'status', 'started_at', 'submitted_at',
            'time_taken', 'attempt_number'
        ]
        read_only_fields = ['student']
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)

class SubmissionGradeSerializer(serializers.ModelSerializer):
    """Serializer for grading submissions"""
    class Meta:
        model = Submission
        fields = [
            'total_score', 'manual_score', 'teacher_feedback',
            'status'
        ]
    
    def update(self, instance, validated_data):
        instance.graded_by = self.context['request'].user
        instance.graded_at = timezone.now()
        
        # If we're setting a manual score, update status
        if 'manual_score' in validated_data:
            instance.status = 'manually_graded'
        
        return super().update(instance, validated_data)

# =====================================
# STATISTICS SERIALIZERS
# =====================================

class HomeworkStatisticsSerializer(serializers.Serializer):
    """Statistics for an assignment"""
    total_students = serializers.IntegerField()
    submitted_count = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    late_count = serializers.IntegerField()
    average_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    completion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)

class StudentProgressSerializer(serializers.Serializer):
    """Student progress summary"""
    student = BasicUserSerializer()
    total_assignments = serializers.IntegerField()
    completed_assignments = serializers.IntegerField()
    pending_assignments = serializers.IntegerField()
    average_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    total_points_earned = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    badges_earned = serializers.IntegerField()
    current_rank = serializers.IntegerField(required=False)

# =====================================
# BULK OPERATIONS SERIALIZERS
# =====================================

class BulkQuestionCreateSerializer(serializers.Serializer):
    """Serializer for creating multiple questions at once"""
    questions = QuestionCreateSerializer(many=True)
    
    def create(self, validated_data):
        questions_data = validated_data['questions']
        questions = []
        
        for question_data in questions_data:
            choices_data = question_data.pop('choices', [])
            question = Question.objects.create(**question_data)
            
            for choice_data in choices_data:
                QuestionChoice.objects.create(question=question, **choice_data)
            
            questions.append(question)
        
        return questions

class HomeworkDuplicateSerializer(serializers.Serializer):
    """Serializer for duplicating assignments"""
    new_title = serializers.CharField(max_length=200)
    new_due_date = serializers.DateTimeField()
    school_class_id = serializers.IntegerField()

    def validate_school_class_id(self, value):
        from schools.models import SchoolClass
        try:
            school_class = SchoolClass.objects.get(id=value)
            return value
        except SchoolClass.DoesNotExist:
            raise serializers.ValidationError("School class not found")

# =====================================
# LESSON PROGRESS SERIALIZERS
# =====================================

class LessonProgressSerializer(serializers.ModelSerializer):
    """Serializer for student lesson progress"""
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    lesson_title_arabic = serializers.CharField(source='lesson.title_arabic', read_only=True)
    lesson_title_french = serializers.CharField(source='lesson.title_french', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    next_exercise_id = serializers.SerializerMethodField()

    class Meta:
        model = LessonProgress
        fields = [
            'id', 'student', 'student_name', 'lesson', 'lesson_title', 'lesson_title_arabic',
            'lesson_title_french', 'status', 'status_display', 'exercises_completed',
            'exercises_total', 'completion_percentage', 'average_score',
            'total_points_earned', 'total_points_possible', 'total_questions_answered',
            'total_questions_correct', 'accuracy_percentage', 'total_time_spent',
            'first_viewed_at', 'started_at', 'completed_at', 'last_accessed',
            'created_at', 'updated_at', 'next_exercise_id'
        ]
        read_only_fields = ['created_at', 'updated_at', 'last_accessed']

    def get_next_exercise_id(self, obj):
        next_ex = obj.next_exercise
        return next_ex.id if next_ex else None


class LessonProgressDetailSerializer(LessonProgressSerializer):
    """Detailed lesson progress with nested lesson info"""
    from lessons.serializers import LessonMinimalSerializer
    lesson_details = LessonMinimalSerializer(source='lesson', read_only=True)

    class Meta(LessonProgressSerializer.Meta):
        fields = LessonProgressSerializer.Meta.fields + ['lesson_details']


class SubjectProgressSerializer(serializers.Serializer):
    """Aggregated progress for a subject"""
    subject_id = serializers.IntegerField()
    subject_name = serializers.CharField()
    subject_name_arabic = serializers.CharField()
    subject_name_french = serializers.CharField()
    grade_id = serializers.IntegerField()
    grade_name = serializers.CharField()

    # Lesson statistics
    total_lessons = serializers.IntegerField()
    lessons_not_started = serializers.IntegerField()
    lessons_in_progress = serializers.IntegerField()
    lessons_completed = serializers.IntegerField()
    lessons_completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Exercise statistics
    total_exercises = serializers.IntegerField()
    exercises_completed = serializers.IntegerField()
    exercises_completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Score statistics
    average_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    total_points_earned = serializers.DecimalField(max_digits=8, decimal_places=2)
    total_points_possible = serializers.DecimalField(max_digits=8, decimal_places=2)

    # Accuracy statistics
    total_questions_answered = serializers.IntegerField()
    total_questions_correct = serializers.IntegerField()
    accuracy_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Time statistics
    total_time_spent = serializers.IntegerField()  # in minutes


class StudentProgressReportSerializer(serializers.Serializer):
    """Complete progress report for a student"""
    student_id = serializers.IntegerField()
    student_name = serializers.CharField()
    student_email = serializers.EmailField()

    # Overall statistics
    total_subjects = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    total_exercises = serializers.IntegerField()

    # Completion statistics
    lessons_completed = serializers.IntegerField()
    lessons_in_progress = serializers.IntegerField()
    lessons_not_started = serializers.IntegerField()
    overall_completion_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Performance statistics
    overall_average_score = serializers.DecimalField(max_digits=5, decimal_places=2)
    overall_accuracy_percentage = serializers.DecimalField(max_digits=5, decimal_places=2)
    total_time_spent = serializers.IntegerField()  # in minutes

    # Reward statistics
    total_points_earned = serializers.IntegerField()
    total_coins_earned = serializers.IntegerField()
    badges_earned = serializers.IntegerField()

    # Subject-wise progress (optional, can be included)
    subjects_progress = SubjectProgressSerializer(many=True, required=False)
