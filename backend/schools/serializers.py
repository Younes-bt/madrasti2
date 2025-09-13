from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import (
    School,
    EducationalLevel,
    Grade,
    SchoolClass,
    Room,
    Subject,
    SubjectGrade,
    AcademicYear
)

class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ('id', 'year', 'start_date', 'end_date', 'is_current')

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ('id', 'name', 'name_arabic', 'name_french', 'code')

class RoomSerializer(serializers.ModelSerializer):
    # Add image-related fields
    image_count = serializers.SerializerMethodField()
    featured_image = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = ('id', 'name', 'code', 'room_type', 'capacity', 'image_count', 'featured_image', 'content_type')
    
    def get_content_type(self, obj):
        """Get content type ID for the room object"""
        return ContentType.objects.get_for_model(obj).id

    def get_image_count(self, obj):
        """Get the number of gallery images associated with the room"""
        return obj.get_image_count()

    def get_featured_image(self, obj):
        """Get featured image URL if available"""
        featured_image = obj.get_featured_image()
        if featured_image:
            return {
                'id': str(featured_image.id),
                'url': featured_image.secure_url or featured_image.url,
                'alt_text': featured_image.alt_text,
                'title': featured_image.title
            }
        return None

class GradeSerializer(serializers.ModelSerializer):
    # Include educational level details
    educational_level_name = serializers.CharField(source='educational_level.name', read_only=True)
    educational_level_name_arabic = serializers.CharField(source='educational_level.name_arabic', read_only=True)
    educational_level_name_french = serializers.CharField(source='educational_level.name_french', read_only=True)
    educational_level_order = serializers.IntegerField(source='educational_level.order', read_only=True)
    
    # Add classes count for statistics
    classes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Grade
        fields = ('id', 'educational_level', 'educational_level_name', 'educational_level_name_arabic', 
                 'educational_level_name_french', 'educational_level_order', 'grade_number', 'name', 
                 'name_arabic', 'name_french', 'passing_grade', 'classes_count')
    
    def get_classes_count(self, obj):
        """Get the number of classes in this grade"""
        return obj.classes.count()

class EducationalLevelSerializer(serializers.ModelSerializer):
    # Nesting GradeSerializer to show grades under each level
    grades = GradeSerializer(many=True, read_only=True)
    grades_count = serializers.SerializerMethodField()

    class Meta:
        model = EducationalLevel
        fields = ('id', 'name', 'name_arabic', 'name_french', 'level', 'order', 'grades', 'grades_count')
    
    def get_grades_count(self, obj):
        """Get the number of grades in this level"""
        return obj.grades.count()

class SchoolClassSerializer(serializers.ModelSerializer):
    grade_id = serializers.IntegerField(source='grade.id', read_only=True)
    grade_name = serializers.StringRelatedField(source='grade')
    academic_year = serializers.StringRelatedField()

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'grade', 'grade_id', 'grade_name', 'academic_year', 'section')