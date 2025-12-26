# madrasti/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/schools/', include('schools.urls')),
    path('api/lessons/', include('lessons.urls')),
    path('api/homework/', include('homework.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/media/', include('media.urls')),
    path('api/finance/', include('finance.urls')),
    path('api/communication/', include('communication.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/activity-logs/', include('activity_log.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
