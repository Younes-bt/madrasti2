from django.urls import path

from .views import StudentPerformanceReportView, TeacherPerformanceReportView

urlpatterns = [
    path("student-performance/", StudentPerformanceReportView.as_view(), name="student-performance-report"),
    path("teacher-performance/", TeacherPerformanceReportView.as_view(), name="teacher-performance-report"),
]
