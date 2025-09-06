# attendance/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router and register viewsets
router = DefaultRouter()

# Timetable Management Routes
router.register(r'timetables', views.SchoolTimetableViewSet, basename='timetables')
router.register(r'timetable-sessions', views.TimetableSessionViewSet, basename='timetable-sessions')

# Attendance Session Routes
router.register(r'sessions', views.AttendanceSessionViewSet, basename='attendance-sessions')
router.register(r'records', views.AttendanceRecordViewSet, basename='attendance-records')

# Student Management Routes (enrollments moved to users app)
router.register(r'parent-relations', views.StudentParentRelationViewSet, basename='parent-relations')

# Absence Flag Routes  
router.register(r'absence-flags', views.StudentAbsenceFlagViewSet, basename='absence-flags')

# Notification Routes
router.register(r'notifications', views.AttendanceNotificationViewSet, basename='attendance-notifications')

# Reports and Statistics Routes
router.register(r'reports', views.AttendanceReportsViewSet, basename='attendance-reports')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
]

# Custom URL patterns for specific endpoints
urlpatterns += [
    # These are handled by router actions, but documented here for reference:
    # GET /api/attendance/timetable-sessions/today_sessions/ - Get today's sessions for teacher
    # POST /api/attendance/sessions/{id}/start/ - Start attendance session
    # POST /api/attendance/sessions/{id}/complete/ - Complete attendance session
    # GET /api/attendance/sessions/{id}/students/ - Get students for session
    # POST /api/attendance/sessions/{id}/bulk_mark/ - Bulk mark attendance
    # GET /api/attendance/absence-flags/pending/ - Get pending flags
    # POST /api/attendance/absence-flags/{id}/clear/ - Clear absence flag
    # POST /api/attendance/notifications/{id}/mark_read/ - Mark notification as read
    # GET /api/attendance/reports/class_statistics/ - Get class attendance statistics
    # GET /api/attendance/reports/student_history/ - Get student attendance history
    # GET /api/attendance/reports/daily_report/ - Get daily attendance report
]