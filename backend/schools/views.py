# schools/views.py

from rest_framework import viewsets, permissions, filters
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    School,
    AcademicYear,
    EducationalLevel,
    Grade,
    Track,
    SchoolClass,
    Room,
    Subject
)
from .serializers import (
    SchoolSerializer,
    AcademicYearSerializer,
    EducationalLevelSerializer,
    GradeSerializer,
    TrackSerializer,
    SchoolClassSerializer,
    RoomSerializer,
    SubjectSerializer
)

# We use ReadOnlyModelViewSet for data that should be managed via admin but viewable by clients.
# We use ModelViewSet for data that should be fully manageable via the API.

class SchoolConfigViewSet(viewsets.ModelViewSet):
    """
    API endpoint for the school configuration.
    Allows GET (retrieve) and PUT (update). No POST (create) or DELETE.
    """
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAdminUser] # Only admins can change config
    http_method_names = ['get', 'put', 'head', 'options']

    def get_object(self):
        # This view should always return the single School object
        return School.objects.first()

class AcademicYearViewSet(viewsets.ModelViewSet):
    """API endpoint for managing academic years."""
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer
    
    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()
    
    def list(self, request, *args, **kwargs):
        print(f"DEBUG: AcademicYear queryset count: {self.get_queryset().count()}")
        print(f"DEBUG: AcademicYear objects: {list(self.get_queryset().values())}")
        return super().list(request, *args, **kwargs)

class EducationalLevelViewSet(viewsets.ModelViewSet):
    """API endpoint for managing educational levels."""
    queryset = EducationalLevel.objects.prefetch_related('grades').all()
    serializer_class = EducationalLevelSerializer
    pagination_class = None  # Disable pagination to return all levels

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class GradeViewSet(viewsets.ModelViewSet):
    """API endpoint for managing grades."""
    queryset = Grade.objects.select_related('educational_level').all()
    serializer_class = GradeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['educational_level']
    search_fields = ['name']
    ordering_fields = ['name', 'educational_level__name']
    ordering = ['educational_level__name', 'name']
    pagination_class = None  # Disable pagination to return all grades

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class TrackViewSet(viewsets.ModelViewSet):
    """API endpoint for managing tracks."""
    queryset = Track.objects.select_related('grade', 'grade__educational_level').all()
    serializer_class = TrackSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['grade', 'is_active']
    search_fields = ['name', 'name_arabic', 'code']
    ordering_fields = ['order', 'name']
    pagination_class = None

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class SchoolClassViewSet(viewsets.ModelViewSet):
    """API endpoint for managing classes."""
    queryset = SchoolClass.objects.select_related('grade', 'track', 'academic_year').all()
    serializer_class = SchoolClassSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['grade', 'academic_year', 'track']
    search_fields = ['name']
    ordering_fields = ['name', 'grade__name']
    ordering = ['grade__name', 'name']
    pagination_class = None  # Disable pagination to return all classes

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class RoomViewSet(viewsets.ModelViewSet):
    """API endpoint for managing rooms."""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    # REMOVE this line: permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()


class SubjectViewSet(viewsets.ModelViewSet):
    """API endpoint for managing subjects."""
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    pagination_class = None
    # REMOVE this line: permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()