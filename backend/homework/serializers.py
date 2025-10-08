# homework/serializers.py
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
    
    # Submission Models
    Submission, QuestionAnswer, AnswerFile, BookExerciseAnswer, BookExerciseFile
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

class QuestionSerializer(serializers.ModelSerializer):
    choices = QuestionChoiceSerializer(many=True, read_only=True)

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
        return representation

class QuestionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating questions with choices"""
    choices = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Question
        fields = '__all__'

    def create(self, validated_data):
        choices_data = validated_data.pop('choices', [])

        # For standalone questions, set the author
        if not validated_data.get('homework') and not validated_data.get('exercise'):
            validated_data['author'] = self.context['request'].user

        question = Question.objects.create(**validated_data)

        for choice_data in choices_data:
            # Remove the question field if it exists (shouldn't be needed)
            choice_data.pop('question', None)
            QuestionChoice.objects.create(question=question, **choice_data)

        return question

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

    class Meta:
        model = Exercise
        fields = '__all__'

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
    
    class Meta:
        model = QuestionAnswer
        fields = '__all__'

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