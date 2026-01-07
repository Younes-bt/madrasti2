from rest_framework import serializers
from .models import (
    LabToolCategory,
    LabTool,
    LabUsage,
    LabAssignment,
    LabAssignmentSubmission,
    LabActivity,
    LabToolAnalytics
)


class LabToolCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LabToolCategory
        fields = ['id', 'name', 'name_ar', 'name_fr', 'name_en', 'icon', 'color', 'order', 'is_active']
        read_only_fields = ['id']


class LabToolListSerializer(serializers.ModelSerializer):
    category = LabToolCategorySerializer(read_only=True)

    class Meta:
        model = LabTool
        fields = ['id', 'tool_id', 'name_ar', 'name_fr', 'name_en', 'description_ar', 'description_fr', 'description_en', 'category', 'icon', 'thumbnail', 'grade_levels', 'is_active', 'is_premium', 'is_new', 'total_uses']
        read_only_fields = ['id', 'total_uses']


class LabToolDetailSerializer(serializers.ModelSerializer):
    category = LabToolCategorySerializer(read_only=True)

    class Meta:
        model = LabTool
        fields = '__all__'
        read_only_fields = ['id', 'total_uses', 'unique_users', 'average_duration', 'created_at', 'updated_at']


class LabUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabUsage
        fields = '__all__'
        read_only_fields = ['id', 'started_at']


class LabAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabAssignment
        fields = '__all__'
        read_only_fields = ['id', 'assigned_date', 'created_at', 'updated_at']


class LabAssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabAssignmentSubmission
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class LabActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LabActivity
        fields = '__all__'
        read_only_fields = ['id', 'uses_count', 'created_at', 'updated_at']
