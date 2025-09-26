from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import (
    School,
    EducationalLevel,
    Grade,
    Track,
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

class TrackSerializer(serializers.ModelSerializer):
    # Include grade details
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    grade_name_arabic = serializers.CharField(source='grade.name_arabic', read_only=True)
    grade_name_french = serializers.CharField(source='grade.name_french', read_only=True)
    educational_level_name = serializers.CharField(source='grade.educational_level.name', read_only=True)

    # Add classes count for statistics
    classes_count = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = ('id', 'grade', 'grade_name', 'grade_name_arabic', 'grade_name_french',
                 'educational_level_name', 'name', 'name_arabic', 'name_french', 'code',
                 'description', 'description_arabic', 'description_french', 'is_active',
                 'order', 'classes_count')

    def get_classes_count(self, obj):
        """Get the number of classes in this track"""
        return obj.classes.count()

class GradeSerializer(serializers.ModelSerializer):
    # Include educational level details
    educational_level_name = serializers.CharField(source='educational_level.name', read_only=True)
    educational_level_name_arabic = serializers.CharField(source='educational_level.name_arabic', read_only=True)
    educational_level_name_french = serializers.CharField(source='educational_level.name_french', read_only=True)
    educational_level_order = serializers.IntegerField(source='educational_level.order', read_only=True)

    # Add tracks and classes count for statistics
    tracks_count = serializers.SerializerMethodField()
    classes_count = serializers.SerializerMethodField()

    class Meta:
        model = Grade
        fields = ('id', 'educational_level', 'educational_level_name', 'educational_level_name_arabic',
                 'educational_level_name_french', 'educational_level_order', 'grade_number', 'code', 'name',
                 'name_arabic', 'name_french', 'passing_grade', 'tracks_count', 'classes_count')

    def get_tracks_count(self, obj):
        """Get the number of tracks in this grade"""
        return obj.tracks.count()

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
    track_id = serializers.IntegerField(source='track.id', read_only=True)
    track_name = serializers.CharField(source='track.name', read_only=True)
    track_code = serializers.CharField(source='track.code', read_only=True)
    academic_year = serializers.PrimaryKeyRelatedField(queryset=AcademicYear.objects.all())
    academic_year_name = serializers.StringRelatedField(source='academic_year', read_only=True)

    # Teacher information
    teachers = serializers.SerializerMethodField()
    teachers_count = serializers.SerializerMethodField()
    students_count = serializers.SerializerMethodField()

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'grade', 'grade_id', 'grade_name', 'track', 'track_id',
                 'track_name', 'track_code', 'academic_year', 'academic_year_name', 'section', 'teachers',
                 'teachers_count', 'students_count')

    def get_teachers(self, obj):
        """Get basic teacher information"""
        return [
            {
                'id': teacher.id,
                'name': teacher.full_name,
                'email': teacher.email,
                'subject': teacher.profile.school_subject.name if teacher.profile.school_subject else None
            }
            for teacher in obj.teachers.all()
        ]

    def get_teachers_count(self, obj):
        """Get the number of teachers assigned to this class"""
        return obj.teachers.count()

    def get_students_count(self, obj):
        """Get the number of students enrolled in this class"""
        return obj.student_enrollments.count()