# tasks/serializers.py

from rest_framework import serializers
from .models import DailyTask, UserTaskProgress


class UserMinimalSerializer(serializers.Serializer):
    """Minimal user info for nested serialization"""
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)

    def to_representation(self, instance):
        return {
            'id': instance.id,
            'email': instance.email,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'full_name': instance.get_full_name(),
            'role': instance.role,
        }


class DailyTaskMinimalSerializer(serializers.ModelSerializer):
    """Minimal task info for lists"""
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    assigned_by_name = serializers.CharField(source='assigned_by.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = DailyTask
        fields = [
            'id', 'title', 'title_arabic', 'title_french', 'status', 'status_display',
            'priority', 'priority_display', 'due_date', 'assigned_to', 'assigned_to_name',
            'assigned_by', 'assigned_by_name', 'is_overdue', 'rating', 'created_at', 'updated_at'
        ]


class DailyTaskSerializer(serializers.ModelSerializer):
    """Full task details"""
    assigned_to_details = UserMinimalSerializer(source='assigned_to', read_only=True)
    assigned_by_details = UserMinimalSerializer(source='assigned_by', read_only=True)
    rated_by_details = UserMinimalSerializer(source='rated_by', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = DailyTask
        fields = '__all__'
        read_only_fields = ['assigned_by', 'created_at', 'updated_at', 'rated_by', 'rating',
                           'rating_feedback', 'reviewed_at', 'started_at', 'completed_at']


class DailyTaskCreateUpdateSerializer(serializers.ModelSerializer):
    """For creating/updating tasks"""
    class Meta:
        model = DailyTask
        fields = [
            'title', 'title_arabic', 'title_french',
            'description', 'description_arabic', 'description_french',
            'assigned_to', 'due_date', 'priority', 'admin_notes'
        ]

    def validate_due_date(self, value):
        """Ensure due date is in the future"""
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError("Due date must be in the future.")
        return value


class TaskRatingSerializer(serializers.Serializer):
    """For admin rating tasks"""
    rating = serializers.IntegerField(min_value=1, max_value=5)
    rating_feedback = serializers.CharField(allow_blank=True, required=False, default='')

    def validate_rating(self, value):
        """Ensure rating is between 1 and 5"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5 stars.")
        return value


class UserTaskProgressSerializer(serializers.ModelSerializer):
    """User performance metrics"""
    user_details = UserMinimalSerializer(source='user', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = UserTaskProgress
        fields = '__all__'
        read_only_fields = '__all__'


class TaskNotesSerializer(serializers.Serializer):
    """For adding notes when marking task as done"""
    user_notes = serializers.CharField(allow_blank=True, required=False, default='')
