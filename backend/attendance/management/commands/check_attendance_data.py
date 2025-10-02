"""
Management command to check attendance data in the database
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from attendance.models import (
    SchoolTimetable, TimetableSession, AttendanceSession, AttendanceRecord
)
from schools.models import SchoolClass, Subject

User = get_user_model()


class Command(BaseCommand):
    help = 'Check attendance data in the database'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n=== Attendance Data Check ===\n'))

        # Check Classes
        classes = SchoolClass.objects.all()
        self.stdout.write(f'Classes: {classes.count()}')
        if classes.exists():
            for cls in classes[:5]:
                self.stdout.write(f'  - {cls.name}')

        # Check Subjects
        subjects = Subject.objects.all()
        self.stdout.write(f'\nSubjects: {subjects.count()}')
        if subjects.exists():
            for subj in subjects[:5]:
                self.stdout.write(f'  - {subj.name}')

        # Check Teachers
        teachers = User.objects.filter(role='TEACHER')
        self.stdout.write(f'\nTeachers: {teachers.count()}')
        if teachers.exists():
            for teacher in teachers[:5]:
                self.stdout.write(f'  - {teacher.get_full_name()} ({teacher.email})')

        # Check Students
        students = User.objects.filter(role='STUDENT')
        self.stdout.write(f'\nStudents: {students.count()}')
        if students.exists():
            for student in students[:5]:
                self.stdout.write(f'  - {student.get_full_name()} ({student.email})')

        # Check Timetables
        timetables = SchoolTimetable.objects.all()
        self.stdout.write(f'\nTimetables: {timetables.count()}')
        if timetables.exists():
            for tt in timetables[:3]:
                self.stdout.write(f'  - {tt.school_class.name} ({tt.academic_year})')

        # Check Timetable Sessions
        sessions = TimetableSession.objects.all()
        self.stdout.write(f'\nTimetable Sessions: {sessions.count()}')
        if sessions.exists():
            for sess in sessions[:3]:
                self.stdout.write(f'  - {sess.subject.name} - {sess.day_of_week} {sess.start_time}')

        # Check Attendance Sessions
        att_sessions = AttendanceSession.objects.all()
        self.stdout.write(f'\nAttendance Sessions: {att_sessions.count()}')
        if att_sessions.exists():
            for att_sess in att_sessions[:3]:
                self.stdout.write(f'  - {att_sess.timetable_session.subject.name} on {att_sess.date} - Status: {att_sess.status}')

        # Check Attendance Records
        records = AttendanceRecord.objects.all()
        self.stdout.write(f'\nAttendance Records: {records.count()}')
        if records.exists():
            for rec in records[:5]:
                self.stdout.write(f'  - {rec.student.get_full_name()} - {rec.status} - {rec.attendance_session.date}')

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Summary ==='))

        if records.count() == 0:
            self.stdout.write(self.style.WARNING('\n⚠️  No attendance records found!'))
            self.stdout.write(self.style.WARNING('To see data in the Attendance Reports page, you need to:'))
            self.stdout.write('  1. Create timetables for your classes')
            self.stdout.write('  2. Add timetable sessions (class schedule)')
            self.stdout.write('  3. Take attendance for those sessions')
            self.stdout.write('\nYou can do this through:')
            self.stdout.write('  - Admin panel: /admin/attendance/')
            self.stdout.write('  - Frontend: Teacher dashboard > Attendance')
        else:
            # Calculate stats
            from django.db.models import Count, Q

            stats = records.aggregate(
                total=Count('id'),
                present=Count('id', filter=Q(status='present')),
                absent=Count('id', filter=Q(status='absent')),
                late=Count('id', filter=Q(status='late')),
                excused=Count('id', filter=Q(status='excused'))
            )

            self.stdout.write(self.style.SUCCESS(f'\n✅ Attendance Statistics:'))
            self.stdout.write(f'  Total Records: {stats["total"]}')
            self.stdout.write(f'  Present: {stats["present"]} ({stats["present"]/stats["total"]*100:.1f}%)')
            self.stdout.write(f'  Absent: {stats["absent"]} ({stats["absent"]/stats["total"]*100:.1f}%)')
            self.stdout.write(f'  Late: {stats["late"]} ({stats["late"]/stats["total"]*100:.1f}%)')
            self.stdout.write(f'  Excused: {stats["excused"]} ({stats["excused"]/stats["total"]*100:.1f}%)')

        self.stdout.write(self.style.SUCCESS('\n=== Check Complete ===\n'))
