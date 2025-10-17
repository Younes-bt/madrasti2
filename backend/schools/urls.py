# schools/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    SchoolConfigViewSet,
    AcademicYearViewSet,
    EducationalLevelViewSet,
    GradeViewSet,
    TrackViewSet,
    SchoolClassViewSet,
    RoomViewSet,
    VehicleViewSet,
    VehicleMaintenanceRecordViewSet,
    GasoilRecordViewSet,
    SubjectViewSet
)
from media.views import RoomMediaViewSet, VehicleMediaViewSet, VehicleMaintenanceMediaViewSet, VehicleGasoilMediaViewSet

router = DefaultRouter()
# The 'basename' is only needed if the queryset in the view is not standard.
# For SchoolConfig, we have a custom get_object(), so basename is good practice.
router.register(r'config', SchoolConfigViewSet, basename='school-config')
router.register(r'academic-years', AcademicYearViewSet)
router.register(r'levels', EducationalLevelViewSet)
router.register(r'grades', GradeViewSet)
router.register(r'tracks', TrackViewSet)
router.register(r'classes', SchoolClassViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'subjects', SubjectViewSet)

# Create nested router for room media
rooms_router = routers.NestedDefaultRouter(router, r'rooms', lookup='room')
rooms_router.register(r'media', RoomMediaViewSet, basename='room-media')

# Nested routes for vehicle maintenance records
vehicles_router = routers.NestedDefaultRouter(router, r'vehicles', lookup='vehicle')
vehicles_router.register(r'maintenance-records', VehicleMaintenanceRecordViewSet, basename='vehicle-maintenance')
vehicles_router.register(r'gasoil-records', GasoilRecordViewSet, basename='vehicle-gasoil')
vehicles_router.register(r'media', VehicleMediaViewSet, basename='vehicle-media')

# Nested routes for maintenance record media
maintenance_router = routers.NestedDefaultRouter(vehicles_router, r'maintenance-records', lookup='maintenance_record')
maintenance_router.register(r'media', VehicleMaintenanceMediaViewSet, basename='vehicle-maintenance-media')

# Nested routes for gasoil record media
gasoil_router = routers.NestedDefaultRouter(vehicles_router, r'gasoil-records', lookup='gasoil_record')
gasoil_router.register(r'media', VehicleGasoilMediaViewSet, basename='vehicle-gasoil-media')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(rooms_router.urls)),
    path('', include(vehicles_router.urls)),
    path('', include(maintenance_router.urls)),
    path('', include(gasoil_router.urls)),
]
