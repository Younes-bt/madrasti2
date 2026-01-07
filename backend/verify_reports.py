
import os
import django
import json
from django.db.models import Q

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'madrasti.settings')
django.setup()

from attendance.models import AttendanceRecord
from django.contrib.auth import get_user_model
from attendance.views import AttendanceReportsViewSet
from rest_framework.test import APIRequestFactory

User = get_user_model()

def verify_reporting():
    factory = APIRequestFactory()
    view = AttendanceReportsViewSet.as_view({'get': 'students_statistics'})
    
    # Get any user to authenticate (or just a dummy)
    user = User.objects.filter(is_superuser=True).first()
    if not user:
        user = User.objects.create_superuser('testadmin', 'admin@test.com', 'password123')
    
    # Check for "Nabil Tounsi"
    print("Testing student_statistics search for 'Nabil'...")
    request = factory.get('/api/attendance/reports/students_statistics/', {'search': 'Nabil'})
    from rest_framework.test import force_authenticate
    force_authenticate(request, user=user)
    response = view(request)
    
    if response.status_code == 200:
        data = response.data.get('statistics', [])
        print(f"Found {len(data)} students matching 'Nabil'.")
        for s in data:
            print(f"- {s['student_name']} (ID: {s['student_id']}) - Attendance: {s['attendance_percentage']}%")
            if "Nabil" in s['student_name'] or "Tounsi" in s['student_name']:
                print("  SUCCESS: Found Nabil Tounsi in reporting!")
    else:
        print(f"Error: {response.status_code} - {response.data}")

    # Check for "TCS-BIOF" class
    print("\nTesting class_statistics...")
    view_class = AttendanceReportsViewSet.as_view({'get': 'classes_statistics'})
    request = factory.get('/api/attendance/reports/classes_statistics/')
    force_authenticate(request, user=user)
    response = view_class(request)
    
    if response.status_code == 200:
        data = response.data.get('statistics', [])
        print(f"Found {len(data)} classes.")
        for c in data[:5]:  # Show first 5
            print(f"- {c['class_name']} - Attendance: {c['attendance_percentage']}%")
    else:
        print(f"Error: {response.status_code} - {response.data}")

if __name__ == "__main__":
    verify_reporting()
