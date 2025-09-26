# homework/serializers.py
from datetime import time, datetime, date, timezone
from rest_framework import serializers
from django.contrib.auth import get_user_model
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
    Exercise, ExerciseReward,

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

class HomeworkListSerializer(serializers.ModelSerializer):
    """List view serializer for assignments"""
    teacher = BasicUserSerializer(read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    class_name = serializers.CharField(source='school_class.name', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    submissions_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Homework
        fields = [
            'id', 'title', 'title_arabic', 'homework_type', 'homework_format',
            'due_date', 'total_points', 'is_published', 'is_overdue', 'submissions_count',
            'teacher', 'subject_name', 'grade_name', 'class_name', 'created_at'
        ]

class HomeworkDetailSerializer(serializers.ModelSerializer):
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
    
    class Meta:
        model = Homework
        fields = '__all__'

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