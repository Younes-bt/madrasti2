# backend/users/serializers.py

from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'role', 'phone')

    def create(self, validated_data):
        # Use the create_user method to handle password hashing
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', User.Role.STUDENT),
            phone=validated_data.get('phone', '')
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing and updating the user profile.
    """
    full_name = serializers.ReadOnlyField()
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name', 'full_name', 'role', 
            'phone', 'date_of_birth', 'address', 'profile_picture', 
            'profile_picture_url', 'bio', 'emergency_contact_name', 
            'emergency_contact_phone', 'is_active', 'created_at', 'updated_at'
        )
        read_only_fields = ('role', 'email', 'is_active', 'created_at', 'updated_at')
    
    def get_profile_picture_url(self, obj):
        """Get the Cloudinary URL for the profile picture."""
        if obj.profile_picture:
            return obj.profile_picture.url
        return None


class UserBasicSerializer(serializers.ModelSerializer):
    """
    Basic user serializer for displaying minimal user info.
    Useful for lists where you don't need all profile details.
    """
    full_name = serializers.ReadOnlyField()
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'full_name', 'role', 'profile_picture_url')
    
    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url
        return None


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token