# projects/serializers.py

from rest_framework import serializers
from .models import Project, ProjectTask, ProjectComment


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


class ProjectTaskMinimalSerializer(serializers.ModelSerializer):
    """Minimal task info for lists"""
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_blocked = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = ProjectTask
        fields = [
            'id', 'title', 'title_arabic', 'title_french', 'status', 'status_display',
            'priority', 'priority_display', 'assigned_to', 'assigned_to_name',
            'due_date', 'order', 'is_blocked', 'is_overdue', 'created_at'
        ]


class ProjectTaskSerializer(serializers.ModelSerializer):
    """Full task details"""
    assigned_to_details = UserMinimalSerializer(source='assigned_to', read_only=True)
    assigned_by_details = UserMinimalSerializer(source='assigned_by', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    is_blocked = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    depends_on_details = ProjectTaskMinimalSerializer(source='depends_on', many=True, read_only=True)

    class Meta:
        model = ProjectTask
        fields = '__all__'
        read_only_fields = ['assigned_by', 'created_at', 'updated_at', 'started_at', 'completed_at']


class ProjectTaskCreateUpdateSerializer(serializers.ModelSerializer):
    """For creating/updating project tasks"""
    class Meta:
        model = ProjectTask
        fields = [
            'title', 'title_arabic', 'title_french',
            'description', 'description_arabic', 'description_french',
            'assigned_to', 'status', 'priority', 'due_date', 'order', 'notes', 'depends_on'
        ]


class ProjectCommentSerializer(serializers.ModelSerializer):
    """Project comment serializer"""
    author_details = UserMinimalSerializer(source='author', read_only=True)
    comment_type_display = serializers.CharField(source='get_comment_type_display', read_only=True)

    class Meta:
        model = ProjectComment
        fields = '__all__'
        read_only_fields = ['author', 'created_at', 'updated_at']


class ProjectMinimalSerializer(serializers.ModelSerializer):
    """Minimal project info for lists"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    team_members_details = UserMinimalSerializer(source='team_members', many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    team_size = serializers.IntegerField(source='team_members.count', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'title_arabic', 'title_french', 'status', 'status_display',
            'start_date', 'due_date', 'progress_percentage', 'total_tasks', 'completed_tasks',
            'created_by', 'created_by_name', 'team_members_details', 'team_size', 'is_overdue', 'created_at'
        ]


class ProjectSerializer(serializers.ModelSerializer):
    """Full project details"""
    created_by_details = UserMinimalSerializer(source='created_by', read_only=True)
    team_members_details = UserMinimalSerializer(source='team_members', many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    tasks = ProjectTaskMinimalSerializer(source='project_tasks', many=True, read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['created_by', 'total_tasks', 'completed_tasks', 'progress_percentage',
                           'completed_at', 'created_at', 'updated_at']


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """For creating/updating projects"""
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'title_arabic', 'title_french',
            'description', 'description_arabic', 'description_french',
            'team_members', 'status', 'start_date', 'due_date'
        ]
        read_only_fields = ['id']

    def validate(self, data):
        """Ensure start date is before due date"""
        if data.get('start_date') and data.get('due_date'):
            if data['start_date'] > data['due_date']:
                raise serializers.ValidationError("Start date must be before due date.")
        return data
