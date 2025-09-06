# backend/users/serializers.py

from rest_framework import serializers
from .models import User, Profile, StudentEnrollment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information.
    """
    full_name = serializers.ReadOnlyField()
    ar_full_name = serializers.ReadOnlyField()
    profile_picture_url = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    
    class Meta:
        model = Profile
        fields = [
            'ar_first_name', 'ar_last_name', 'phone', 'date_of_birth', 'address', 
            'profile_picture', 'profile_picture_url', 'bio', 'emergency_contact_name', 
            'emergency_contact_phone', 'linkedin_url', 'twitter_url', 'department', 
            'position', 'hire_date', 'salary', 'full_name', 'ar_full_name', 'age', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at')


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with profile creation.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    # Profile fields for registration
    ar_first_name = serializers.CharField(required=False, allow_blank=True)
    ar_last_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_name = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_phone = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    position = serializers.CharField(required=False, allow_blank=True)
    hire_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name', 'role',
            # Profile fields
            'ar_first_name', 'ar_last_name', 'phone', 'date_of_birth', 'address', 'bio', 
            'emergency_contact_name', 'emergency_contact_phone',
            'department', 'position', 'hire_date'
        ]

    def create(self, validated_data):
        # Separate profile data from user data
        profile_data = {}
        profile_fields = [
            'ar_first_name', 'ar_last_name', 'phone', 'date_of_birth', 'address', 'bio',
            'emergency_contact_name', 'emergency_contact_phone',
            'department', 'position', 'hire_date'
        ]
        
        for field in profile_fields:
            if field in validated_data:
                profile_data[field] = validated_data.pop(field)
        
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', User.Role.STUDENT)
        )
        
        # Update the profile created by the signal with the profile data
        if profile_data:
            user.profile.__dict__.update(profile_data)
            user.profile.save()
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing and updating the user profile.
    Includes nested profile information.
    """
    profile = ProfileSerializer(read_only=True)
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 
            'is_active', 'created_at', 'updated_at', 'profile'
        )
        read_only_fields = ('role', 'email', 'is_active', 'created_at', 'updated_at')


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user and profile information.
    """
    # Profile fields for updating
    ar_first_name = serializers.CharField(required=False, allow_blank=True)
    ar_last_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False, allow_null=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_name = serializers.CharField(required=False, allow_blank=True)
    emergency_contact_phone = serializers.CharField(required=False, allow_blank=True)
    linkedin_url = serializers.URLField(required=False, allow_blank=True)
    twitter_url = serializers.URLField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    position = serializers.CharField(required=False, allow_blank=True)
    hire_date = serializers.DateField(required=False, allow_null=True)
    salary = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'is_active',
            'created_at', 'updated_at',
            # Profile fields
            'ar_first_name', 'ar_last_name', 'phone', 'date_of_birth', 'address', 
            'profile_picture', 'profile_picture_url', 'bio', 
            'emergency_contact_name', 'emergency_contact_phone',
            'linkedin_url', 'twitter_url', 'department', 'position', 
            'hire_date', 'salary'
        ]
        read_only_fields = ('id', 'email', 'role', 'is_active', 'created_at', 'updated_at', 'profile_picture_url')

    def get_profile_picture_url(self, obj):
        try:
            if obj.profile.profile_picture:
                return obj.profile.profile_picture.url
        except Profile.DoesNotExist:
            pass
        return None

    def update(self, instance, validated_data):
        # Separate profile data from user data
        profile_data = {}
        profile_fields = [
            'ar_first_name', 'ar_last_name', 'phone', 'date_of_birth', 'address',
            'profile_picture', 'bio', 'emergency_contact_name', 'emergency_contact_phone',
            'linkedin_url', 'twitter_url', 'department', 'position', 'hire_date', 'salary'
        ]
        
        for field in profile_fields:
            if field in validated_data:
                profile_data[field] = validated_data.pop(field)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update profile fields
        if profile_data:
            try:
                profile = instance.profile
                for attr, value in profile_data.items():
                    setattr(profile, attr, value)
                profile.save()
            except Profile.DoesNotExist:
                Profile.objects.create(user=instance, **profile_data)
        
        return instance

    def to_representation(self, instance):
        # Include profile data in the response
        data = super().to_representation(instance)
        try:
            profile = instance.profile
            data.update({
                'ar_first_name': profile.ar_first_name,
                'ar_last_name': profile.ar_last_name,
                'phone': profile.phone,
                'date_of_birth': profile.date_of_birth,
                'address': profile.address,
                'profile_picture_url': profile.profile_picture.url if profile.profile_picture else None,
                'bio': profile.bio,
                'emergency_contact_name': profile.emergency_contact_name,
                'emergency_contact_phone': profile.emergency_contact_phone,
                'linkedin_url': profile.linkedin_url,
                'twitter_url': profile.twitter_url,
                'department': profile.department,
                'position': profile.position,
                'hire_date': profile.hire_date,
                'salary': profile.salary,
            })
        except Profile.DoesNotExist:
            pass
        return data


class UserBasicSerializer(serializers.ModelSerializer):
    """
    Basic user serializer for displaying minimal user info.
    Useful for lists where you don't need all profile details.
    """
    full_name = serializers.ReadOnlyField()
    profile_picture_url = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'profile_picture_url', 'phone', 'position')
    
    def get_profile_picture_url(self, obj):
        try:
            if obj.profile.profile_picture:
                return obj.profile.profile_picture.url
        except Profile.DoesNotExist:
            pass
        return None
    
    def get_phone(self, obj):
        try:
            return obj.profile.phone
        except Profile.DoesNotExist:
            return None
    
    def get_position(self, obj):
        try:
            return obj.profile.position
        except Profile.DoesNotExist:
            return None


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token


# =====================================
# STUDENT ENROLLMENT SERIALIZERS
# =====================================

class StudentEnrollmentSerializer(serializers.ModelSerializer):
    """Student enrollment"""
    student = UserBasicSerializer(read_only=True)
    school_class_name = serializers.CharField(source='school_class.name', read_only=True)
    academic_year_name = serializers.CharField(source='academic_year.year', read_only=True)
    
    class Meta:
        model = StudentEnrollment
        fields = [
            'id', 'student', 'school_class', 'school_class_name',
            'academic_year', 'academic_year_name', 'enrollment_date',
            'is_active', 'student_number', 'created_at'
        ]


class StudentEnrollmentCreateSerializer(serializers.ModelSerializer):
    """Create student enrollment"""
    
    class Meta:
        model = StudentEnrollment
        fields = [
            'student', 'school_class', 'academic_year', 'enrollment_date',
            'student_number'
        ]