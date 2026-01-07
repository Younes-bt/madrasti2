from decimal import Decimal
from datetime import datetime, date, timedelta
from django.db.models import Sum
from attendance.models import AttendanceSession

def calculate_work_stats(employee, start_date, end_date):
    """
    Calculate total hours worked and lessons taught for an employee
    within a specific date range based on COMPLETED attendance sessions.
    
    Returns:
        dict: {'hours': Decimal, 'lessons': int}
    """
    # 1. Filter relevant attendance sessions
    sessions = AttendanceSession.objects.filter(
        teacher=employee,
        date__gte=start_date,
        date__lte=end_date,
        status='completed'  # Only count completed sessions
    ).select_related('timetable_session')

    total_lessons = sessions.count()
    total_seconds = 0

    for session in sessions:
        # Calculate duration of the session
        ts = session.timetable_session
        if ts.start_time and ts.end_time:
            # Simple subtraction for time objects
            # We convert to dummy datetime to subtract
            dummy_date = date(2000, 1, 1)
            start = datetime.combine(dummy_date, ts.start_time)
            end = datetime.combine(dummy_date, ts.end_time)
            
            duration = end - start
            total_seconds += duration.total_seconds()

    # Convert seconds to hours (Decimal)
    total_hours = Decimal(total_seconds) / Decimal(3600)
    
    # Round to 2 decimal places
    total_hours = round(total_hours, 2)

    return {
        'hours': total_hours,
        'lessons': total_lessons
    }
