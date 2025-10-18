# schools/views.py

from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from media.models import MediaRelation
from .models import (
    School,
    AcademicYear,
    EducationalLevel,
    Grade,
    Track,
    SchoolClass,
    Room,
    Equipment,
    Vehicle,
    VehicleMaintenanceRecord,
    GasoilRecord,
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
    EquipmentSerializer,
    VehicleSerializer,
    VehicleMaintenanceRecordSerializer,
    GasoilRecordSerializer,
    SubjectSerializer
)
from users.models import Profile

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
    http_method_names = ['get', 'put', 'patch', 'head', 'options']
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @action(detail=False, methods=['get'], url_path='available-directors')
    def available_directors(self, request):
        """Return users whose profile position is Director for dropdown selection."""
        director_profiles = (
            Profile.objects.select_related('user')
            .filter(position=Profile.Position.DIRECTOR, user__is_active=True)
            .order_by('user__first_name', 'user__last_name')
        )
        data = [
            {
                'id': profile.user.id,
                'full_name': profile.full_name,
                'email': profile.user.email,
            }
            for profile in director_profiles
        ]
        return Response(data)

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

class EquipmentViewSet(viewsets.ModelViewSet):
    """API endpoint for managing room equipment."""
    serializer_class = EquipmentSerializer
    queryset = Equipment.objects.select_related('room').all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['room', 'room__room_type', 'is_active']
    search_fields = ['name', 'description', 'room__name']
    ordering_fields = ['name', 'quantity', 'updated_at', 'room__name']
    ordering = ['room__name', 'name']
    pagination_class = None

    def get_permissions(self):
        """Allow any authenticated user to list/view, but only admins to create/edit."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

class VehicleViewSet(viewsets.ModelViewSet):
    """API endpoint for managing school vehicles."""
    serializer_class = VehicleSerializer
    queryset = Vehicle.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['vehicle_type', 'is_active', 'driver', 'school']
    search_fields = ['name', 'model', 'plate_number']
    ordering_fields = ['vehicle_type', 'model', 'plate_number', 'last_service_date', 'last_oil_change_date']
    ordering = ['vehicle_type', 'plate_number']
    pagination_class = None

    def get_queryset(self):
        maintenance_attachments_qs = MediaRelation.objects.filter(
            relation_type='VEHICLE_MAINTENANCE_ATTACHMENT'
        ).select_related('media_file').order_by('order', 'created_at')
        gasoil_attachments_qs = MediaRelation.objects.filter(
            relation_type='VEHICLE_GASOIL_ATTACHMENT'
        ).select_related('media_file').order_by('order', 'created_at')
        maintenance_prefetch = Prefetch(
            'maintenance_records',
            queryset=VehicleMaintenanceRecord.objects.prefetch_related(
                Prefetch('attachments', queryset=maintenance_attachments_qs, to_attr='_prefetched_attachments')
            )
        )
        gasoil_prefetch = Prefetch(
            'gasoil_records',
            queryset=GasoilRecord.objects.prefetch_related(
                Prefetch('attachments', queryset=gasoil_attachments_qs, to_attr='_prefetched_attachments')
            )
        )
        return (
            Vehicle.objects.select_related('driver', 'school')
            .prefetch_related(maintenance_prefetch, gasoil_prefetch)
            .all()
        )

    def get_permissions(self):
        """Allow any authenticated user to view, but only admins/staff to modify."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

    def perform_create(self, serializer):
        """Ensure the vehicle is linked to a school if available."""
        school = serializer.validated_data.get('school') or School.objects.first()
        if school:
            serializer.save(school=school)
        else:
            serializer.save()

class VehicleMaintenanceRecordViewSet(viewsets.ModelViewSet):
    """Manage maintenance history for a specific vehicle."""
    serializer_class = VehicleMaintenanceRecordSerializer
    queryset = VehicleMaintenanceRecord.objects.none()
    filter_backends = [OrderingFilter]
    ordering_fields = ['service_date', 'created_at']
    ordering = ['-service_date']
    pagination_class = None

    def get_permissions(self):
        """Allow any authenticated user to view, but restrict modifications."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        vehicle_id = self.kwargs.get('vehicle_pk')
        attachments_qs = MediaRelation.objects.filter(
            relation_type='VEHICLE_MAINTENANCE_ATTACHMENT'
        ).select_related('media_file').order_by('order', 'created_at')
        queryset = VehicleMaintenanceRecord.objects.filter(vehicle_id=vehicle_id)
        if vehicle_id is None:
            return queryset
        return queryset.prefetch_related(
            Prefetch('attachments', queryset=attachments_qs, to_attr='_prefetched_attachments')
        )

    def perform_create(self, serializer):
        vehicle = get_object_or_404(Vehicle, pk=self.kwargs.get('vehicle_pk'))
        serializer.save(vehicle=vehicle)

class GasoilRecordViewSet(viewsets.ModelViewSet):
    """Manage fuel (gasoil) history for a specific vehicle."""
    serializer_class = GasoilRecordSerializer
    queryset = GasoilRecord.objects.none()
    filter_backends = [OrderingFilter]
    ordering_fields = ['refuel_date', 'created_at']
    ordering = ['-refuel_date']
    pagination_class = None

    def get_permissions(self):
        """Allow any authenticated user to view, but restrict modifications."""
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        vehicle_id = self.kwargs.get('vehicle_pk')
        attachments_qs = MediaRelation.objects.filter(
            relation_type='VEHICLE_GASOIL_ATTACHMENT'
        ).select_related('media_file').order_by('order', 'created_at')
        queryset = GasoilRecord.objects.filter(vehicle_id=vehicle_id)
        if vehicle_id is None:
            return queryset
        return queryset.prefetch_related(
            Prefetch('attachments', queryset=attachments_qs, to_attr='_prefetched_attachments')
        )

    def perform_create(self, serializer):
        vehicle = get_object_or_404(Vehicle, pk=self.kwargs.get('vehicle_pk'))
        serializer.save(vehicle=vehicle)


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
