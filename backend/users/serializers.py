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
    
    # Student enrollment fields (only used if role is STUDENT)
    school_class_id = serializers.IntegerField(required=False, allow_null=True)
    academic_year_id = serializers.IntegerField(required=False, allow_null=True)
    enrollment_date = serializers.DateField(required=False, allow_null=True)
    student_number = serializers.CharField(required=False, allow_blank=True)
    
    # Parent information fields (used to create parent account when creating student)
    parent_name = serializers.CharField(required=False, allow_blank=True)
    parent_first_name = serializers.CharField(required=False, allow_blank=True)
    parent_last_name = serializers.CharField(required=False, allow_blank=True)
    parent_phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'first_name', 'last_name', 'role',
            # Profile fields
            'ar_first_name', 'ar_last_name', 'phone', 'date_of_birth', 'address', 'bio', 
            'emergency_contact_name', 'emergency_contact_phone',
            'department', 'position', 'hire_date',
            # Student enrollment fields
            'school_class_id', 'academic_year_id', 'enrollment_date', 'student_number',
            # Parent information fields
            'parent_name', 'parent_first_name', 'parent_last_name', 'parent_phone'
        ]

    def _generate_unique_email(self, first_name, last_name, role):
        """Generate a unique email using initials + lastname approach with simple incremental numbers"""
        import re
        import logging
        logger = logging.getLogger(__name__)
        
        # Clean the last name
        clean_last_name = re.sub(r'[^a-z0-9]', '', last_name.lower().replace(' ', '')).strip()
        school_name = 'madrasti'  # This could be fetched from school config
        clean_school_name = re.sub(r'[^a-z0-9]', '', school_name.lower().replace(' ', '')).strip()
        
        # Get first letter of first name
        initial = first_name[0].lower() if first_name else 'u'  # 'u' for user if no first name
        
        # Determine email domain suffix based on role
        role_suffix_map = {
            'STUDENT': 'students',
            'PARENT': 'parents', 
            'TEACHER': 'teachers',
            'ADMIN': 'team',
            'STAFF': 'team'
        }
        domain_suffix = role_suffix_map.get(role, 'users')
        
        logger.error(f"EMAIL GENERATION: first_name={first_name}, last_name={last_name}, role={role}, initial={initial}, clean_last_name={clean_last_name}")
        
        # Try different email formats until we find a unique one
        unique_email = None
        counter = 0
        
        while not unique_email:
            if counter == 0:
                # First try: initial.lastname@school-suffix.com
                candidate_email = f"{initial}.{clean_last_name}@{clean_school_name}-{domain_suffix}.com"
            else:
                # Subsequent tries: initial.lastname{counter}@school-suffix.com
                candidate_email = f"{initial}.{clean_last_name}{counter}@{clean_school_name}-{domain_suffix}.com"
            
            logger.error(f"EMAIL GENERATION: Trying candidate_email={candidate_email}")
            
            # Check if this email already exists
            if not User.objects.filter(email=candidate_email).exists():
                unique_email = candidate_email
                logger.error(f"EMAIL GENERATION: Found unique email={unique_email}")
            else:
                logger.error(f"EMAIL GENERATION: Email {candidate_email} already exists, incrementing counter")
                counter += 1
                # Safety break to avoid infinite loop (very unlikely to reach)
                if counter > 1000:
                    unique_email = f"{initial}.{clean_last_name}{counter}@{clean_school_name}-{domain_suffix}.com"
                    logger.error(f"EMAIL GENERATION: Hit counter limit, using={unique_email}")
                    break
        
        return unique_email

    def create(self, validated_data):
        from datetime import date
        
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
        
        # Separate enrollment data
        enrollment_data = {}
        enrollment_fields = ['school_class_id', 'academic_year_id', 'enrollment_date', 'student_number']
        
        for field in enrollment_fields:
            if field in validated_data:
                enrollment_data[field] = validated_data.pop(field)
        
        # Separate parent data
        parent_data = {}
        parent_fields = ['parent_name', 'parent_first_name', 'parent_last_name', 'parent_phone']
        
        for field in parent_fields:
            if field in validated_data:
                parent_data[field] = validated_data.pop(field)
        
        # Student email is now pre-generated by the view.
        # We trust that it is valid and unique.
        user_email = validated_data.get('email')
        
        # Create user
        user = User.objects.create_user(
            email=user_email,
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', User.Role.STUDENT)
        )
        
        # Update the profile created by the signal with the profile data
        if profile_data:
            user.profile.__dict__.update(profile_data)
            user.profile.save()
        
        # Create student enrollment if this is a student and enrollment data is provided
        if (user.role == User.Role.STUDENT and 
            enrollment_data.get('school_class_id') and 
            enrollment_data.get('academic_year_id')):
            
            StudentEnrollment.objects.create(
                student=user,
                school_class_id=enrollment_data['school_class_id'],
                academic_year_id=enrollment_data['academic_year_id'],
                enrollment_date=enrollment_data.get('enrollment_date', date.today()),
                student_number=enrollment_data.get('student_number', ''),
                is_active=True
            )
        
        # Create parent account if this is a student and parent data is provided
        if (user.role == User.Role.STUDENT and 
            (parent_data.get('parent_name') or (parent_data.get('parent_first_name') and parent_data.get('parent_last_name')))):
            
            # Determine parent first and last name
            if parent_data.get('parent_first_name') and parent_data.get('parent_last_name'):
                # Use separate first and last name fields if provided
                parent_first_name = parent_data['parent_first_name']
                parent_last_name = parent_data['parent_last_name']
            elif parent_data.get('parent_name'):
                # Parse combined parent name into first and last name
                parent_name_parts = parent_data['parent_name'].strip().split()
                parent_first_name = parent_name_parts[0] if parent_name_parts else 'Parent'
                parent_last_name = ' '.join(parent_name_parts[1:]) if len(parent_name_parts) > 1 else f'of {user.first_name}'
            else:
                # Fallback names
                parent_first_name = 'Parent'
                parent_last_name = f'of {user.first_name}'
            
            # Check if parent already exists with same name and phone (to avoid duplicates)
            existing_parent = None
            if parent_data.get('parent_phone'):
                existing_parent = User.objects.filter(
                    role=User.Role.PARENT,
                    first_name=parent_first_name,
                    last_name=parent_last_name,
                    profile__phone=parent_data['parent_phone']
                ).first()
            
            if existing_parent:
                # Link student to existing parent
                user.parent = existing_parent
                user.save()
            else:
                # Generate unique parent email using the helper function
                parent_email = self._generate_unique_email(parent_first_name, parent_last_name, 'PARENT')
                
                # Create parent user account
                parent_user = User.objects.create_user(
                    email=parent_email,
                    password='defaultStrongPassword25',  # Same default password as student
                    first_name=parent_first_name,
                    last_name=parent_last_name,
                    role=User.Role.PARENT
                )
                
                # Update parent profile with phone if provided
                if parent_data.get('parent_phone'):
                    parent_user.profile.phone = parent_data['parent_phone']
                    parent_user.profile.save()
                
                # Link student to new parent
                user.parent = parent_user
                user.save()
        
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
        
        # Include parent information for students
        if instance.role == User.Role.STUDENT and instance.parent:
            parent = instance.parent
            try:
                parent_profile = parent.profile
                data.update({
                    'parent_name': f"{parent.first_name} {parent.last_name}".strip(),
                    'parent_email': parent.email,
                    'parent_phone': parent_profile.phone,
                })
            except Profile.DoesNotExist:
                data.update({
                    'parent_name': f"{parent.first_name} {parent.last_name}".strip(),
                    'parent_email': parent.email,
                    'parent_phone': None,
                })
        else:
            # Set empty parent fields for non-students or students without parents
            data.update({
                'parent_name': None,
                'parent_email': None,
                'parent_phone': None,
            })
        
        # Include academic information for students
        if instance.role == User.Role.STUDENT:
            # Get the current/active enrollment for this student
            current_enrollment = instance.student_enrollments.filter(is_active=True).first()
            if current_enrollment:
                data.update({
                    'grade': current_enrollment.school_class.grade.name,
                    'class_name': current_enrollment.school_class.name,
                    'enrollment_date': current_enrollment.enrollment_date,
                    'student_id': current_enrollment.student_number,
                    'academic_year': current_enrollment.academic_year.year,
                })
            else:
                # Set empty academic fields if no enrollment found
                data.update({
                    'grade': None,
                    'class_name': None,
                    'enrollment_date': None,
                    'student_id': None,
                    'academic_year': None,
                })
        else:
            # Set empty academic fields for non-students
            data.update({
                'grade': None,
                'class_name': None,
                'enrollment_date': None,
                'student_id': None,
                'academic_year': None,
            })
        
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
