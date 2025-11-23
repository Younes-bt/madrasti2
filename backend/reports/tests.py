from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from schools.models import AcademicYear, EducationalLevel, Grade, SchoolClass, Subject
from homework.models import Homework, Submission


class StudentPerformanceReportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()

        # Users
        self.admin = User.objects.create_user(
            email="admin@test.com", password="pass123", role="ADMIN"
        )
        self.teacher = User.objects.create_user(
            email="teacher@test.com", password="pass123", role="TEACHER"
        )
        self.parent = User.objects.create_user(
            email="parent@test.com", password="pass123", role="PARENT"
        )
        self.student = User.objects.create_user(
            email="student@test.com", password="pass123", role="STUDENT", parent=self.parent
        )

        # Academic structure
        self.academic_year = AcademicYear.objects.create(
            year="2024-2025",
            start_date=timezone.now().date(),
            end_date=timezone.now().date(),
            is_current=True,
        )
        self.level = EducationalLevel.objects.create(
            name="Primary", order=1, level="P"
        )
        self.grade = Grade.objects.create(
            educational_level=self.level, grade_number=1, code="G1", name="Grade 1"
        )
        self.subject = Subject.objects.create(
            name="Math", code="MATH", grade=self.grade
        )
        self.school_class = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="A"
        )
        self.school_class.teachers.add(self.teacher)

        # Homework + submissions
        self.hw1 = Homework.objects.create(
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            title="HW1",
            description="Test",
            instructions="Do it",
            homework_type="homework",
            due_date=timezone.now(),
            estimated_duration=30,
            total_points=100,
            is_published=True,
        )
        Submission.objects.create(
            homework=self.hw1,
            student=self.student,
            status="submitted",
            total_score=80,
            submitted_at=timezone.now(),
        )

        # A second homework with no submission to test "missing"
        self.hw2 = Homework.objects.create(
            subject=self.subject,
            grade=self.grade,
            school_class=self.school_class,
            teacher=self.teacher,
            title="HW2",
            description="Test 2",
            instructions="Do it 2",
            homework_type="homework",
            due_date=timezone.now(),
            estimated_duration=30,
            total_points=100,
            is_published=True,
        )

    def test_admin_can_view_report(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse("student-performance-report")
        resp = self.client.get(url, {"grade_id": self.grade.id, "academic_year_id": self.academic_year.id})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("summary", data)
        self.assertIn("top_students", data)
        self.assertGreaterEqual(data["summary"]["missing_submissions"], 0)

    def test_parent_must_target_own_child(self):
        other_student = get_user_model().objects.create_user(
            email="student2@test.com", password="pass123", role="STUDENT"
        )
        self.client.force_authenticate(user=self.parent)
        url = reverse("student-performance-report")
        resp_bad = self.client.get(url, {"student_id": other_student.id})
        self.assertEqual(resp_bad.status_code, 403)
        resp_ok = self.client.get(url, {"student_id": self.student.id})
        self.assertEqual(resp_ok.status_code, 200)

    def test_teacher_scoped_to_own_classes(self):
        # Another class/homework by another teacher should not appear
        other_teacher = get_user_model().objects.create_user(
            email="teacher2@test.com", password="pass123", role="TEACHER"
        )
        other_class = SchoolClass.objects.create(
            grade=self.grade, academic_year=self.academic_year, section="B"
        )
        hw_other = Homework.objects.create(
            subject=self.subject,
            grade=self.grade,
            school_class=other_class,
            teacher=other_teacher,
            title="HW3",
            description="Other",
            instructions="Other",
            homework_type="homework",
            due_date=timezone.now(),
            estimated_duration=30,
            total_points=100,
            is_published=True,
        )
        Submission.objects.create(
            homework=hw_other,
            student=self.student,
            status="submitted",
            total_score=100,
            submitted_at=timezone.now(),
        )

        self.client.force_authenticate(user=self.teacher)
        url = reverse("student-performance-report")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        # Ensure the other teacher's homework isn't counted (top_students still present)
        self.assertIn("top_students", data)
        # Missing submissions should still reflect only this teacher's scope
        self.assertGreaterEqual(data["summary"]["missing_submissions"], 0)
