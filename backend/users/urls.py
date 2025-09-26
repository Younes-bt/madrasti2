# backend/users/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, ProfileView, LoginView, LogoutView, HeartbeatView, CleanupInactiveUsersView,
    ChangePasswordView, UserViewSet, StudentEnrollmentViewSet,
    StudentBulkImportView, BulkImportStatusView, BulkImportProgressView
)

# Create router for viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'enrollments', StudentEnrollmentViewSet, basename='student-enrollments')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user_register'),
    path('profile/', ProfileView.as_view(), name='user_profile'),
    path('login/', LoginView.as_view(), name='user_login'),
    path('logout/', LogoutView.as_view(), name='user_logout'),
    path('heartbeat/', HeartbeatView.as_view(), name='user_heartbeat'),
    path('cleanup-inactive/', CleanupInactiveUsersView.as_view(), name='cleanup_inactive_users'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    # Bulk import endpoints
    path('bulk-import/students/', StudentBulkImportView.as_view(), name='bulk_import_students'),
    path('bulk-import/status/', BulkImportStatusView.as_view(), name='bulk_import_status'),
    path('bulk-import/progress/<uuid:job_id>/', BulkImportProgressView.as_view(), name='bulk_import_progress'),

    path('', include(router.urls)),  # Include enrollment endpoints
]