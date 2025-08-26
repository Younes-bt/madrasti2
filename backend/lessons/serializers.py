# lessons/serializers.py

from rest_framework import serializers
from .models import Lesson, LessonResource, LessonTag, LessonTagging
from schools.serializers import SubjectSerializer, GradeSerializer

class LessonResourceSerializer(serializers.ModelSerializer):
    file_url = serializers.ReadOnlyField()
    uploaded_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = LessonResource
        fields = [
            'id', 'title', 'description', 'resource_type', 'file', 'external_url',
            'file_url', 'file_size', 'file_format', 'is_visible_to_students',
            'is_downloadable', 'order', 'uploaded_at', 'uploaded_by', 'uploaded_by_name'
        ]
        read_only_fields = ['file_size', 'file_format', 'uploaded_at', 'uploaded_by']
    
    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.full_name if obj.uploaded_by else None

class LessonTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonTag
        fields = ['id', 'name', 'name_arabic', 'color']

class LessonSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    resources = LessonResourceSerializer(many=True, read_only=True)
    tags = serializers.SerializerMethodField()
    cycle_display = serializers.CharField(source='get_cycle_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'subject', 'subject_name', 'grade', 'grade_name', 'title', 
            'title_arabic', 'title_french', 'description', 'content', 'cycle', 
            'cycle_display', 'order', 'objectives', 'prerequisites', 
            'difficulty_level', 'difficulty_display', 'is_active', 'created_at', 
            'updated_at', 'created_by', 'created_by_name', 'resources', 'tags'
        ]
        read_only_fields = ['created_at', 'updated_at', 'created_by']
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name if obj.created_by else None
    
    def get_tags(self, obj):
        taggings = LessonTagging.objects.filter(lesson=obj)
        tags = [tagging.tag for tagging in taggings]
        return LessonTagSerializer(tags, many=True).data

class LessonMinimalSerializer(serializers.ModelSerializer):
    """Minimal lesson info for dropdowns and references"""
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    cycle_display = serializers.CharField(source='get_cycle_display', read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'subject', 'subject_name', 'grade', 'grade_name', 
            'cycle', 'cycle_display', 'order', 'difficulty_level', 'is_active'
        ]

class LessonCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating lessons without nested data"""
    
    class Meta:
        model = Lesson
        fields = [
            'subject', 'grade', 'title', 'title_arabic', 'title_french', 
            'description', 'content', 'cycle', 'order', 'objectives', 
            'prerequisites', 'difficulty_level', 'is_active'
        ]
    
    def validate(self, data):
        # Check for unique constraint on subject, grade, cycle, and order
        if 'subject' in data and 'grade' in data and 'cycle' in data and 'order' in data:
            lesson = self.instance
            queryset = Lesson.objects.filter(
                subject=data['subject'],
                grade=data['grade'],
                cycle=data['cycle'],
                order=data['order']
            )
            
            # If updating, exclude the current instance
            if lesson:
                queryset = queryset.exclude(pk=lesson.pk)
            
            if queryset.exists():
                raise serializers.ValidationError(
                    "A lesson with this subject, grade, cycle, and order already exists."
                )
        
        return data