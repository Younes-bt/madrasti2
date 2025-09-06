# backend/users/views.py

from rest_framework import generics, status, viewsets, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import User, StudentEnrollment
from .serializers import UserRegisterSerializer, UserProfileSerializer, MyTokenObtainPairSerializer, StudentEnrollmentSerializer, StudentEnrollmentCreateSerializer, UserBasicSerializer, UserUpdateSerializer

# The RegisterView and ProfileView remain the same
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


# Add this NEW LoginView
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Please provide both email and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use Django's built-in authentication
        user = authenticate(request, email=email, password=password)

        if user:
            # If authentication is successful, use our serializer to get tokens
            serializer = MyTokenObtainPairSerializer.get_token(user)
            refresh = str(serializer)
            access = str(serializer.access_token)

            return Response(
                {
                    "refresh": refresh,
                    "access": access,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Invalid Credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )


# =====================================
# PERMISSION CLASSES
# =====================================

class IsTeacherOrAdmin(permissions.BasePermission):
    """Permission for teachers and admins"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['TEACHER', 'ADMIN']


class IsAdminOrReadOnly(permissions.BasePermission):
    """Permission for admins to modify, others to read only"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'ADMIN'


# =====================================
# USER VIEWSET
# =====================================

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for listing, retrieving, and updating users"""
    queryset = User.objects.select_related('profile').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'profile__phone']
    ordering_fields = ['first_name', 'last_name', 'email', 'created_at']
    ordering = ['last_name', 'first_name']
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        elif self.action == 'retrieve':
            return UserUpdateSerializer  # Use same serializer for retrieve to get profile data
        return UserBasicSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Additional filtering by role
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role.upper())
        
        return queryset


# =====================================
# STUDENT ENROLLMENT VIEWSET
# =====================================

class StudentEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet for student enrollments"""
    queryset = StudentEnrollment.objects.all()
    permission_classes = [IsTeacherOrAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StudentEnrollmentCreateSerializer
        return StudentEnrollmentSerializer
    
    def get_queryset(self):
        queryset = StudentEnrollment.objects.select_related(
            'student', 'school_class', 'academic_year'
        )
        
        # Filter by class
        class_id = self.request.query_params.get('class_id')
        if class_id:
            queryset = queryset.filter(school_class_id=class_id)
        
        # Filter by student
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter by academic year
        academic_year_id = self.request.query_params.get('academic_year_id')
        if academic_year_id:
            queryset = queryset.filter(academic_year_id=academic_year_id)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset