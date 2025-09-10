from rest_framework import serializers
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
        fields = ('id', 'name', 'code')

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name', 'code', 'room_type', 'capacity')

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ('id', 'name', 'grade_number', 'educational_level')

class EducationalLevelSerializer(serializers.ModelSerializer):
    # Nesting GradeSerializer to show grades under each level
    grades = GradeSerializer(many=True, read_only=True)

    class Meta:
        model = EducationalLevel
        fields = ('id', 'name', 'level', 'order', 'grades')

class SchoolClassSerializer(serializers.ModelSerializer):
    grade_id = serializers.IntegerField(source='grade.id', read_only=True)
    grade_name = serializers.StringRelatedField(source='grade')
    academic_year = serializers.StringRelatedField()

    class Meta:
        model = SchoolClass
        fields = ('id', 'name', 'grade', 'grade_id', 'grade_name', 'academic_year', 'section')