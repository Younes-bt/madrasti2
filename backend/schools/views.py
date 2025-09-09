# schools/views.py

from rest_framework import viewsets, permissions
from .models import (
    School,
    AcademicYear,
    EducationalLevel,
    Grade,
    SchoolClass,
    Room,
    Subject
)
from .serializers import (
    SchoolSerializer,
    AcademicYearSerializer,
    EducationalLevelSerializer,
    GradeSerializer,
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

class AcademicYearViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint to view academic years."""
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        print(f"DEBUG: AcademicYear queryset count: {self.get_queryset().count()}")
        print(f"DEBUG: AcademicYear objects: {list(self.get_queryset().values())}")
        return super().list(request, *args, **kwargs)

class EducationalLevelViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint to view educational levels and their nested grades."""
    queryset = EducationalLevel.objects.prefetch_related('grades').all()
    serializer_class = EducationalLevelSerializer
    permission_classes = [permissions.IsAuthenticated]

class GradeViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint to view all grades."""
    queryset = Grade.objects.select_related('educational_level').all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]

class SchoolClassViewSet(viewsets.ModelViewSet):
    """API endpoint for managing classes."""
    queryset = SchoolClass.objects.select_related('grade', 'academic_year').all()
    serializer_class = SchoolClassSerializer
    # REMOVE this line: permission_classes = [permissions.IsAdminUser]

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
    # REMOVE this line: permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()