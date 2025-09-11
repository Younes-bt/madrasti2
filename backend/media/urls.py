from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import (
    MediaFileViewSet,
    MediaRelationViewSet,
    RoomMediaViewSet
)

# Create the main router
router = DefaultRouter()
router.register(r'files', MediaFileViewSet, basename='mediafile')
router.register(r'relations', MediaRelationViewSet, basename='mediarelation')

# Create nested router for room media
# This allows URLs like: /api/media/rooms/{room_id}/media/
rooms_router = routers.NestedDefaultRouter(router, r'files', lookup='file')
# Note: This will be integrated with schools app URLs for better organization

urlpatterns = [
    path('', include(router.urls)),
    # Additional custom endpoints can be added here
]