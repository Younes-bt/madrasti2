"""
Diagnostic script to check why students can't see Mathematics lessons
Run: python manage.py shell < check_student_lessons.py
"""

from users.models import User, StudentEnrollment
from lessons.models import Lesson
from schools.models import Subject, Grade

print("\n" + "="*80)
print("STUDENT LESSONS DIAGNOSTIC")
print("="*80)

# Find a student user
student = User.objects.filter(role='STUDENT').first()
if not student:
    print("❌ No student users found!")
    exit()

print(f"\n✓ Student found: {student.email} (ID: {student.id})")

# Check enrollments
enrollments = StudentEnrollment.objects.filter(student=student, is_active=True)
print(f"\n📚 Active Enrollments: {enrollments.count()}")
for enrollment in enrollments:
    print(f"  - Class: {enrollment.school_class}")
    print(f"    Grade: {enrollment.school_class.grade} (ID: {enrollment.school_class.grade_id})")
    print(f"    Academic Year: {enrollment.academic_year}")
    print(f"    Is Current: {enrollment.academic_year.is_current if enrollment.academic_year else 'N/A'}")

# Get student's class and grade
enrollment = enrollments.first()
if not enrollment:
    print("\n❌ Student has no active enrollment!")
    exit()

student_grade = enrollment.school_class.grade
print(f"\n🎓 Student's Grade: {student_grade} (ID: {student_grade.id})")

# Check lessons for this grade
all_lessons = Lesson.objects.filter(grade=student_grade, is_active=True)
print(f"\n📖 Total active lessons for grade: {all_lessons.count()}")

# Group by subject
subjects_with_counts = {}
for lesson in all_lessons:
    subject_name = lesson.subject.name if lesson.subject else "No Subject"
    if subject_name not in subjects_with_counts:
        subjects_with_counts[subject_name] = 0
    subjects_with_counts[subject_name] += 1

print("\n📊 Lessons by Subject:")
for subject, count in subjects_with_counts.items():
    print(f"  - {subject}: {count} lessons")

# Check specifically for Mathematics
math_subject = Subject.objects.filter(name__icontains='Math').first()
if math_subject:
    print(f"\n🔢 Mathematics Subject: {math_subject.name} (ID: {math_subject.id})")
    math_lessons = Lesson.objects.filter(
        grade=student_grade,
        subject=math_subject,
        is_active=True
    )
    print(f"   Active Math lessons for this grade: {math_lessons.count()}")

    if math_lessons.count() > 0:
        print("   Sample Math lessons:")
        for lesson in math_lessons[:5]:
            print(f"     - {lesson.title} (ID: {lesson.id}, Active: {lesson.is_active})")
else:
    print("\n❌ Mathematics subject not found!")

# Check History & Geography
history_subject = Subject.objects.filter(name__icontains='History').first()
if history_subject:
    print(f"\n🌍 History & Geography Subject: {history_subject.name} (ID: {history_subject.id})")
    history_lessons = Lesson.objects.filter(
        grade=student_grade,
        subject=history_subject,
        is_active=True
    )
    print(f"   Active History lessons for this grade: {history_lessons.count()}")

print("\n" + "="*80)
print("DIAGNOSIS COMPLETE")
print("="*80 + "\n")
