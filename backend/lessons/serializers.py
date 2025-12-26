# lessons/serializers.py

from rest_framework import serializers
from .models import Lesson, LessonResource, LessonTag, LessonTagging, LessonAvailability, SubjectCategory
from schools.serializers import SubjectSerializer, GradeSerializer, SchoolClassSerializer

class SubjectCategorySerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source='subject', read_only=True)

    class Meta:
        model = SubjectCategory
        fields = ['id', 'subject', 'subject_details', 'ar_name', 'fr_name', 'en_name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class LessonResourceSerializer(serializers.ModelSerializer):
    file_url = serializers.ReadOnlyField()
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LessonResource
        fields = [
            'id', 'title', 'description', 'resource_type', 'file', 'external_url',
            'file_url', 'file_size', 'file_format', 'markdown_content', 'blocks_content',
            'content_version', 'is_visible_to_students', 'is_downloadable', 'order',
            'uploaded_at', 'uploaded_by', 'uploaded_by_name'
        ]
        read_only_fields = ['file_size', 'file_format', 'uploaded_at', 'uploaded_by']

    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.full_name if obj.uploaded_by else None

    def validate_blocks_content(self, value):
        """Validate the structure of blocks_content JSON"""
        if value is None:
            return value

        # Validate that it's a dictionary with required keys
        if not isinstance(value, dict):
            raise serializers.ValidationError("blocks_content must be a JSON object")

        # Check for blocks array
        if 'blocks' not in value:
            raise serializers.ValidationError("blocks_content must contain a 'blocks' array")

        blocks = value.get('blocks', [])
        if not isinstance(blocks, list):
            raise serializers.ValidationError("'blocks' must be an array")

        # Validate each block
        VALID_BLOCK_TYPES = [
            'heading', 'paragraph', 'quote', 'callout', 'list',
            'code', 'math', 'image', 'video', 'audio', 'table',
            'divider', 'spacer', 'toggle', 'columns', 'embed'
        ]

        for idx, block in enumerate(blocks):
            if not isinstance(block, dict):
                raise serializers.ValidationError(f"Block at index {idx} must be an object")

            # Required fields
            required_fields = ['id', 'type', 'content']
            for field in required_fields:
                if field not in block:
                    raise serializers.ValidationError(
                        f"Block at index {idx} is missing required field: {field}"
                    )

            # Validate block type
            if block['type'] not in VALID_BLOCK_TYPES:
                raise serializers.ValidationError(
                    f"Block at index {idx} has invalid type: {block['type']}"
                )

            # Validate content is a dictionary
            if not isinstance(block['content'], dict):
                raise serializers.ValidationError(
                    f"Block at index {idx} content must be an object"
                )

        return value

    def validate(self, data):
        """Cross-field validation"""
        # If resource_type is 'blocks', blocks_content should be provided
        resource_type = data.get('resource_type', self.instance.resource_type if self.instance else None)
        blocks_content = data.get('blocks_content')

        if resource_type == 'blocks' and not blocks_content:
            raise serializers.ValidationError({
                'blocks_content': 'blocks_content is required when resource_type is "blocks"'
            })

        return data

class LessonTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonTag
        fields = ['id', 'name', 'name_arabic', 'color']

from schools.serializers import SubjectSerializer, GradeSerializer, TrackSerializer

class LessonSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    tracks = TrackSerializer(many=True, read_only=True)
    # Add nested serializers for full multilingual support
    subject_details = SubjectSerializer(source='subject', read_only=True)
    grade_details = GradeSerializer(source='grade', read_only=True)
    
    # Category details
    category_details = SubjectCategorySerializer(source='category', read_only=True)
    
    created_by_name = serializers.SerializerMethodField()
    resources = LessonResourceSerializer(many=True, read_only=True)
    tags = serializers.SerializerMethodField()
    cycle_display = serializers.CharField(source='get_cycle_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)
    exercise_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'subject', 'subject_name', 'subject_details', 
            'grade', 'grade_name', 'grade_details', 
            'category', 'category_details', 'unit',
            'tracks', 'title',
            'title_arabic', 'title_french', 'description', 'cycle',
            'cycle_display', 'order', 'objectives', 'prerequisites',
            'difficulty_level', 'difficulty_display', 'is_active', 'created_at',
            'updated_at', 'created_by', 'created_by_name', 'resources', 'tags',
            'exercise_count'
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
    subject_name_arabic = serializers.CharField(source='subject.name_arabic', read_only=True)
    subject_name_french = serializers.CharField(source='subject.name_french', read_only=True)
    grade_name = serializers.CharField(source='grade.name', read_only=True)
    grade_name_arabic = serializers.CharField(source='grade.name_arabic', read_only=True)
    grade_name_french = serializers.CharField(source='grade.name_french', read_only=True)
    tracks = TrackSerializer(many=True, read_only=True)
    cycle_display = serializers.CharField(source='get_cycle_display', read_only=True)

    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'title_arabic', 'title_french', 'subject', 'subject_name',
            'subject_name_arabic', 'subject_name_french', 'grade', 'grade_name',
            'grade_name_arabic', 'grade_name_french', 'tracks', 'category', 'unit', 'cycle', 'cycle_display',
            'order', 'difficulty_level', 'is_active'
        ]

from schools.models import Track

class LessonCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating lessons without nested data"""
    tracks = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Track.objects.all(),
        required=False
    )

    class Meta:
        model = Lesson
        fields = [
            'subject', 'grade', 'tracks', 'category', 'unit', 'title', 'title_arabic', 'title_french',
            'description', 'cycle', 'order', 'objectives',
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

# =====================================
# LESSON AVAILABILITY SERIALIZERS
# =====================================

class LessonAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for lesson availability per class"""
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    lesson_title_arabic = serializers.CharField(source='lesson.title_arabic', read_only=True)
    lesson_title_french = serializers.CharField(source='lesson.title_french', read_only=True)
    class_name = serializers.CharField(source='school_class.name', read_only=True)
    published_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LessonAvailability
        fields = [
            'id', 'lesson', 'lesson_title', 'lesson_title_arabic', 'lesson_title_french',
            'school_class', 'class_name', 'is_published', 'published_at',
            'published_by', 'published_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['published_at', 'published_by', 'created_at', 'updated_at']

    def get_published_by_name(self, obj):
        return obj.published_by.get_full_name() if obj.published_by else None


class LessonAvailabilityDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with nested lesson and class info"""
    lesson = LessonMinimalSerializer(read_only=True)
    school_class = SchoolClassSerializer(read_only=True)
    published_by_name = serializers.SerializerMethodField()

    class Meta:
        model = LessonAvailability
        fields = [
            'id', 'lesson', 'school_class', 'is_published',
            'published_at', 'published_by', 'published_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['published_at', 'published_by', 'created_at', 'updated_at']

    def get_published_by_name(self, obj):
        return obj.published_by.get_full_name() if obj.published_by else None


class BulkPublishSerializer(serializers.Serializer):
    """Serializer for bulk publishing lessons to multiple classes"""
    lesson_id = serializers.IntegerField()
    class_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )
    is_published = serializers.BooleanField(default=True)

    def validate_lesson_id(self, value):
        try:
            Lesson.objects.get(id=value)
        except Lesson.DoesNotExist:
            raise serializers.ValidationError("Lesson not found")
        return value

    def validate_class_ids(self, value):
        from schools.models import SchoolClass
        valid_ids = SchoolClass.objects.filter(id__in=value).values_list('id', flat=True)
        invalid_ids = set(value) - set(valid_ids)
        if invalid_ids:
            raise serializers.ValidationError(f"Invalid class IDs: {invalid_ids}")
        return value


class LessonWithAvailabilitySerializer(LessonSerializer):
    """Lesson serializer that includes availability info for student's class"""
    is_available = serializers.SerializerMethodField()
    is_published_for_student = serializers.SerializerMethodField()

    class Meta(LessonSerializer.Meta):
        fields = LessonSerializer.Meta.fields + ['is_available', 'is_published_for_student']

    def get_is_available(self, obj):
        """Check if lesson is available for the current user's class"""
        request = self.context.get('request')
        if not request or not hasattr(request, 'user'):
            return False

        user = request.user
        if user.role != 'STUDENT':
            return True  # Teachers/admin can see all

        # Get student's class via active enrollment
        from users.models import StudentEnrollment
        enrollment = (
            StudentEnrollment.objects
            .select_related('school_class', 'academic_year')
            .filter(student=user, is_active=True, academic_year__is_current=True)
            .first()
        )
        if not enrollment:
            enrollment = (
                StudentEnrollment.objects
                .select_related('school_class')
                .filter(student=user, is_active=True)
                .order_by('-created_at')
                .first()
            )
        if not enrollment or not enrollment.school_class:
            return False

        student_class = enrollment.school_class

        # Check if lesson is published for this class
        availability = LessonAvailability.objects.filter(
            lesson=obj,
            school_class=student_class
        ).first()

        return availability.is_published if availability else False

    def get_is_published_for_student(self, obj):
        """Alias for is_available"""
        return self.get_is_available(obj)
