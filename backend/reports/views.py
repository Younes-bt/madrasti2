from datetime import datetime, timedelta

from django.db.models import (
    Avg,
    Case,
    Count,
    DecimalField,
    ExpressionWrapper,
    F,
    IntegerField,
    Q,
    StdDev,
    Value,
    When,
)
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from homework.models import Homework, Submission
from schools.models import SchoolClass
from users.models import StudentEnrollment


def _parse_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _date_range_bounds(date_range, start_param=None, end_param=None):
    """Translate a date_range string + optional custom bounds into concrete datetimes."""
    now = timezone.now()
    if date_range == "today":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif date_range == "this_week":
        start = now - timedelta(days=now.weekday())
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif date_range == "this_month":
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif date_range == "this_term":
        # Treat as 3-month window until real terms are wired
        start = now - timedelta(days=90)
        end = now
    elif date_range == "this_year":
        start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now
    elif date_range == "custom" and start_param and end_param:
        try:
            start = datetime.fromisoformat(start_param)
            end = datetime.fromisoformat(end_param)
        except ValueError:
            start, end = None, None
    else:
        start, end = None, None
    return start, end


def _score_pct_expression():
    return Case(
        When(
            homework__total_points__gt=0,
            total_score__isnull=False,
            then=ExpressionWrapper(
                F("total_score") * 100.0 / F("homework__total_points"),
                output_field=DecimalField(max_digits=6, decimal_places=2),
            ),
        ),
        default=Value(0),
        output_field=DecimalField(max_digits=6, decimal_places=2),
    )


def _role_scoped_homework(user, base_queryset):
    role = getattr(user, "role", "").upper()

    if role in {"ADMIN", "STAFF"}:
        return base_queryset

    if role == "TEACHER":
        return base_queryset.filter(Q(teacher=user) | Q(school_class__teachers=user)).distinct()

    if role == "STUDENT":
        return base_queryset.filter(submissions__student=user).distinct()

    if role == "PARENT":
        # Parent scope is limited to explicit student_id filtering (enforced upstream)
        return base_queryset.none()

    return base_queryset.none()


def _role_scoped_submissions(user, base_queryset, student_id=None):
    role = getattr(user, "role", "").upper()

    if role in {"ADMIN", "STAFF"}:
        return base_queryset

    if role == "TEACHER":
        return base_queryset.filter(
            Q(homework__teacher=user) | Q(homework__school_class__teachers=user)
        )

    if role == "STUDENT":
        return base_queryset.filter(student=user)

    if role == "PARENT" and student_id:
        return base_queryset.filter(student_id=student_id)

    return base_queryset.none()


class StudentPerformanceReportView(APIView):
    """
    Cohort-level student performance reports based on Homework + Submission + LessonProgress.
    Filters: date_range, academic_year, grade, class, subject, teacher, student.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        params = self._parse_filters(request)

        # Parent validation: must supply student_id and it must be their child
        if getattr(request.user, "role", "").upper() == "PARENT":
            if not params["student_id"]:
                return Response({"detail": "student_id is required for parents"}, status=400)
            User = get_user_model()
            try:
                child = User.objects.get(id=params["student_id"], role="STUDENT")
            except User.DoesNotExist:
                return Response({"detail": "Student not found"}, status=404)
            if child.parent_id != request.user.id:
                return Response({"detail": "Not authorized for this student"}, status=403)

        # Base homework scope
        homework_qs = Homework.objects.filter(is_published=True).select_related(
            "grade", "school_class", "subject", "teacher"
        )
        homework_qs = _role_scoped_homework(request.user, homework_qs)

        if params["academic_year_id"]:
            homework_qs = homework_qs.filter(school_class__academic_year_id=params["academic_year_id"])
        if params["grade_id"]:
            homework_qs = homework_qs.filter(grade_id=params["grade_id"])
        if params["class_id"]:
            homework_qs = homework_qs.filter(school_class_id=params["class_id"])
        if params["subject_id"]:
            homework_qs = homework_qs.filter(subject_id=params["subject_id"])
        if params["teacher_id"]:
            homework_qs = homework_qs.filter(teacher_id=params["teacher_id"])

        # Submissions scoped to role/student
        submissions_qs = Submission.objects.filter(homework__in=homework_qs).select_related(
            "homework", "student", "homework__school_class", "homework__subject"
        )
        submissions_qs = _role_scoped_submissions(request.user, submissions_qs, params["student_id"])

        # Date filters on submissions
        if params["date_start"] and params["date_end"]:
            submissions_qs = submissions_qs.filter(
                submitted_at__date__gte=params["date_start"].date(),
                submitted_at__date__lte=params["date_end"].date(),
            )

        submissions_prev = Submission.objects.none()
        if params.get("prev_date_start") and params.get("prev_date_end"):
            submissions_prev = Submission.objects.filter(homework__in=homework_qs).select_related(
                "homework", "student", "homework__school_class", "homework__subject"
            )
            submissions_prev = _role_scoped_submissions(request.user, submissions_prev, params["student_id"])
            submissions_prev = submissions_prev.filter(
                submitted_at__date__gte=params["prev_date_start"].date(),
                submitted_at__date__lte=params["prev_date_end"].date(),
            )

        scored_submissions = submissions_qs.filter(total_score__isnull=False).annotate(
            score_pct=_score_pct_expression()
        )
        scored_prev = submissions_prev.filter(total_score__isnull=False).annotate(
            score_pct=_score_pct_expression()
        )

        data = self._build_payload(homework_qs, submissions_qs, scored_submissions, scored_prev, params)
        return Response(data)

    def _parse_filters(self, request):
        date_range = request.GET.get("date_range")
        start_raw = request.GET.get("start_date")
        end_raw = request.GET.get("end_date")
        date_start, date_end = _date_range_bounds(date_range, start_raw, end_raw)
        prev_start = prev_end = None
        if date_start and date_end:
            window = date_end - date_start
            if window.total_seconds() > 0:
                prev_end = date_start
                prev_start = date_start - window

        return {
            "date_range": date_range,
            "date_start": date_start,
            "date_end": date_end,
            "prev_date_start": prev_start,
            "prev_date_end": prev_end,
            "academic_year_id": _parse_int(request.GET.get("academic_year_id")),
            "grade_id": _parse_int(request.GET.get("grade_id")),
            "class_id": _parse_int(request.GET.get("class_id")),
            "subject_id": _parse_int(request.GET.get("subject_id")),
            "teacher_id": _parse_int(request.GET.get("teacher_id")),
            "student_id": _parse_int(request.GET.get("student_id")),
            "page": request.GET.get("page"),
            "page_size": request.GET.get("page_size"),
            "ordering": request.GET.get("ordering"),
        }

    def _build_payload(self, homework_qs, submissions_qs, scored_submissions, scored_prev, params):
        assigned_count = homework_qs.count()
        submitted_homeworks = submissions_qs.filter(
            status__in=["submitted", "auto_graded", "manually_graded", "late"]
        ).values("homework_id").distinct().count()
        missing_submissions = max(0, assigned_count - submitted_homeworks)
        completion_rate = (submitted_homeworks / assigned_count * 100) if assigned_count else 0

        pass_flag = Case(When(score_pct__gte=50, then=1), default=0, output_field=DecimalField())
        on_time_flag = Case(When(is_late=False, then=1), default=0, output_field=DecimalField())

        avg_score = scored_submissions.aggregate(avg=Avg("score_pct"))["avg"] or 0
        prev_avg_score = scored_prev.aggregate(avg=Avg("score_pct"))["avg"] if scored_prev.exists() else None
        trend_delta = None
        if prev_avg_score is not None:
            trend_delta = round(float(avg_score or 0) - float(prev_avg_score or 0), 2)
        pass_rate = (
            scored_submissions.aggregate(rate=Avg(pass_flag))["rate"] * 100 if scored_submissions.exists() else 0
        )
        accuracy_pct = 0

        grade_distribution = self._grade_distribution(scored_submissions)
        top_students, at_risk_students, pagination = self._student_leaderboards(
            scored_submissions, scored_prev, assigned_count, pass_flag, params
        )
        subject_breakdown = self._subject_breakdown(scored_submissions, pass_flag, on_time_flag)
        class_breakdown = self._class_breakdown(scored_submissions, pass_flag)
        recent_assessments = self._recent_assessments(homework_qs, submissions_qs)

        return {
            "summary": {
                "average_score": round(float(avg_score), 2) if avg_score is not None else 0,
                "pass_rate": round(float(pass_rate or 0), 2),
                "completion_rate": round(float(completion_rate), 2),
                "missing_submissions": missing_submissions,
                "accuracy": round(float(accuracy_pct or 0), 2),
                "trend_delta": trend_delta,
            },
            "grade_distribution": grade_distribution,
            "top_students": top_students,
            "at_risk_students": at_risk_students,
            "subjects": subject_breakdown,
            "classes": class_breakdown,
            "recent_assessments": recent_assessments,
            "filters_applied": {k: v for k, v in params.items() if v},
            "pagination": pagination,
        }

    def _grade_distribution(self, scored_submissions):
        buckets = [
            {"label": "<60", "min": 0, "max": 59.99},
            {"label": "60-69", "min": 60, "max": 69.99},
            {"label": "70-79", "min": 70, "max": 79.99},
            {"label": "80-89", "min": 80, "max": 89.99},
            {"label": "90-100", "min": 90, "max": 100},
        ]
        total = scored_submissions.count() or 1
        results = []
        for bucket in buckets:
            count = scored_submissions.filter(score_pct__gte=bucket["min"], score_pct__lte=bucket["max"]).count()
            results.append(
                {
                    "label": bucket["label"],
                    "count": count,
                    "percentage": round(count / total * 100, 2),
                }
            )
        return results

    def _student_leaderboards(self, scored_submissions, scored_prev, assigned_count, pass_flag, params):
        per_student = (
            scored_submissions.values(
                "student_id",
                "student__first_name",
                "student__last_name",
                "homework__school_class__name",
                "homework__subject__name",
            )
            .annotate(
                avg_score=Avg("score_pct"),
                pass_rate=Avg(pass_flag) * 100,
                submitted=Count("homework", distinct=True),
                late_count=Count("id", filter=Q(is_late=True)),
            )
        )

        prev_map = {}
        if scored_prev.exists():
            prev_rows = (
                scored_prev.values("student_id")
                .annotate(prev_avg=Avg("score_pct"))
            )
            prev_map = {row["student_id"]: float(row["prev_avg"] or 0) for row in prev_rows}

        students = []
        at_risk = []

        for row in per_student:
            missing = max(0, assigned_count - row["submitted"])
            name = f"{row.get('student__first_name', '')} {row.get('student__last_name', '')}".strip() or "Student"
            current_avg = round(float(row["avg_score"] or 0), 2)
            improvement = None
            if row["student_id"] in prev_map:
                improvement = round(current_avg - prev_map[row["student_id"]], 2)
            accuracy = None

            students.append({
                "student_id": row["student_id"],
                "name": name,
                "average_score": current_avg,
                "pass_rate": round(float(row["pass_rate"] or 0), 2),
                "missing_submissions": missing,
                "late_count": row["late_count"],
                "subject": row.get("homework__subject__name") or "",
                "class_name": row.get("homework__school_class__name") or "",
                "improvement": improvement,
                "accuracy": accuracy,
            })

        ordering = params.get("ordering") or "-average_score"
        reverse = ordering.startswith("-")
        key = ordering.lstrip("-")
        if key not in {"average_score", "pass_rate", "missing_submissions", "improvement"}:
            key = "average_score"
            reverse = True
        students.sort(key=lambda x: (x.get(key) is None, x.get(key, 0)), reverse=reverse)

        for item in students:
            if item["average_score"] < 60 or item["missing_submissions"] > 2 or item["pass_rate"] < 50:
                at_risk.append(item)

        try:
            page = max(1, int(params.get("page") or 1))
            page_size = min(100, max(1, int(params.get("page_size") or 50)))
        except (TypeError, ValueError):
            page, page_size = 1, 50

        start = (page - 1) * page_size
        end = start + page_size
        paged_students = students[start:end]

        return paged_students, at_risk[:page_size], {
            "page": page,
            "page_size": page_size,
            "total_students": len(students),
        }

    def _subject_breakdown(self, scored_submissions, pass_flag, on_time_flag):
        breakdown = (
            scored_submissions.values("homework__subject_id", "homework__subject__name")
            .annotate(
                avg_score=Avg("score_pct"),
                pass_rate=Avg(pass_flag) * 100,
                on_time_rate=Avg(on_time_flag) * 100,
                submission_count=Count("id"),
            )
            .order_by("-avg_score")
        )
        return [
            {
                "subject_id": row["homework__subject_id"],
                "subject_name": row["homework__subject__name"],
                "average_score": round(float(row["avg_score"] or 0), 2),
                "pass_rate": round(float(row["pass_rate"] or 0), 2),
                "on_time_rate": round(float(row["on_time_rate"] or 0), 2),
                "submission_count": row["submission_count"],
            }
            for row in breakdown
        ]

    def _class_breakdown(self, scored_submissions, pass_flag):
        breakdown = (
            scored_submissions.values("homework__school_class_id", "homework__school_class__name")
            .annotate(
                avg_score=Avg("score_pct"),
                pass_rate=Avg(pass_flag) * 100,
                submission_count=Count("id"),
            )
            .order_by("homework__school_class__name")
        )
        return [
            {
                "class_id": row["homework__school_class_id"],
                "class_name": row["homework__school_class__name"],
                "average_score": round(float(row["avg_score"] or 0), 2),
                "pass_rate": round(float(row["pass_rate"] or 0), 2),
                "submission_count": row["submission_count"],
            }
            for row in breakdown
        ]

    def _recent_assessments(self, homework_qs, submissions_qs, limit=6):
        recent_homework = (
            homework_qs.select_related("subject", "school_class")
            .order_by("-due_date")[:limit]
        )

        homework_ids = [hw.id for hw in recent_homework]
        score_map = (
            submissions_qs.filter(homework_id__in=homework_ids, total_score__isnull=False)
            .annotate(score_pct=_score_pct_expression())
            .values("homework_id")
            .annotate(
                avg_score=Avg("score_pct"),
                submitted=Count("id", filter=Q(status__in=["submitted", "auto_graded", "manually_graded", "late"])),
                std_dev=StdDev("score_pct"),
            )
        )
        score_lookup = {row["homework_id"]: row for row in score_map}

        enroll_counts = (
            StudentEnrollment.objects.filter(school_class_id__in=[hw.school_class_id for hw in recent_homework])
            .values("school_class_id")
            .annotate(total=Count("id"))
        )
        enroll_lookup = {row["school_class_id"]: row["total"] for row in enroll_counts}

        results = []
        for hw in recent_homework:
            stats = score_lookup.get(hw.id, {})
            total_students = enroll_lookup.get(hw.school_class_id, 0) or 1
            submitted = stats.get("submitted", 0) or 0
            completion_rate = submitted / total_students * 100 if total_students else 0
            results.append(
                {
                    "homework_id": hw.id,
                    "title": hw.title,
                    "subject": hw.subject.name if hw.subject else "",
                    "class_name": hw.school_class.name if hw.school_class else "",
                    "average_score": round(float(stats.get("avg_score") or 0), 2),
                    "completion_rate": round(float(completion_rate), 2),
                    "std_dev": round(float(stats.get("std_dev") or 0), 2) if stats.get("std_dev") else 0,
                    "due_date": hw.due_date,
                }
            )
        return results

class TeacherPerformanceReportView(APIView):
    """
    Teacher performance overview: aggregates student outcomes for each teacher in scope.
    Filters: date_range, academic_year, grade, class, subject, teacher.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        params = self._parse_filters(request)

        homework_qs = Homework.objects.filter(is_published=True).select_related(
            "grade", "school_class", "subject", "teacher"
        )
        role = getattr(request.user, "role", "").upper()
        if role == "TEACHER":
            homework_qs = homework_qs.filter(Q(teacher=request.user) | Q(school_class__teachers=request.user)).distinct()
        if role == "STUDENT" or role == "PARENT":
            return Response({"detail": "Not authorized"}, status=403)

        if params["academic_year_id"]:
            homework_qs = homework_qs.filter(school_class__academic_year_id=params["academic_year_id"])
        if params["grade_id"]:
            homework_qs = homework_qs.filter(grade_id=params["grade_id"])
        if params["class_id"]:
            homework_qs = homework_qs.filter(school_class_id=params["class_id"])
        if params["subject_id"]:
            homework_qs = homework_qs.filter(subject_id=params["subject_id"])
        if params["teacher_id"]:
            homework_qs = homework_qs.filter(teacher_id=params["teacher_id"])

        submissions_qs = Submission.objects.filter(homework__in=homework_qs).select_related(
            "homework", "homework__teacher"
        )
        if params["date_start"] and params["date_end"]:
            submissions_qs = submissions_qs.filter(
                submitted_at__date__gte=params["date_start"].date(),
                submitted_at__date__lte=params["date_end"].date(),
            )

        scored = submissions_qs.filter(total_score__isnull=False).annotate(score_pct=_score_pct_expression())
        pass_flag = Case(When(score_pct__gte=50, then=1), default=0, output_field=DecimalField())
        on_time_flag = Case(When(is_late=False, then=1), default=0, output_field=DecimalField())

        aggregates = (
            scored.values("homework__teacher_id", "homework__teacher__first_name", "homework__teacher__last_name")
            .annotate(
                average_score=Avg("score_pct"),
                pass_rate=Avg(pass_flag) * 100,
                on_time_rate=Avg(on_time_flag) * 100,
                assignments=Count("homework", distinct=True),
                classes=Count("homework__school_class", distinct=True),
                submissions=Count("id"),
                students=Count("student", distinct=True),
            )
            .order_by("-average_score")
        )

        teachers = []
        for row in aggregates:
            homework_for_teacher = homework_qs.filter(teacher_id=row["homework__teacher_id"])
            assigned_count = homework_for_teacher.count()
            submitted_count = submissions_qs.filter(homework__teacher_id=row["homework__teacher_id"]).values(
                "homework_id"
            ).distinct().count()
            completion_rate = (submitted_count / assigned_count * 100) if assigned_count else 0
            name = f"{row.get('homework__teacher__first_name','')} {row.get('homework__teacher__last_name','')}".strip() or "Teacher"

            teachers.append({
                "teacher_id": row["homework__teacher_id"],
                "name": name,
                "average_score": round(float(row["average_score"] or 0), 2),
                "pass_rate": round(float(row["pass_rate"] or 0), 2),
                "completion_rate": round(float(completion_rate or 0), 2),
                "on_time_rate": round(float(row["on_time_rate"] or 0), 2),
                "assignments": row["assignments"],
                "classes": row["classes"],
                "students": row["students"],
            })

        return Response({"teachers": teachers, "filters_applied": {k: v for k, v in params.items() if v}})

    def _parse_filters(self, request):
        date_range = request.GET.get("date_range")
        start_raw = request.GET.get("start_date")
        end_raw = request.GET.get("end_date")
        date_start, date_end = _date_range_bounds(date_range, start_raw, end_raw)

        return {
            "date_range": date_range,
            "date_start": date_start,
            "date_end": date_end,
            "academic_year_id": _parse_int(request.GET.get("academic_year_id")),
            "grade_id": _parse_int(request.GET.get("grade_id")),
            "class_id": _parse_int(request.GET.get("class_id")),
            "subject_id": _parse_int(request.GET.get("subject_id")),
            "teacher_id": _parse_int(request.GET.get("teacher_id")),
        }
    def _parse_filters(self, request):
        date_range = request.GET.get("date_range")
        start_raw = request.GET.get("start_date")
        end_raw = request.GET.get("end_date")
        date_start, date_end = _date_range_bounds(date_range, start_raw, end_raw)
        prev_start = prev_end = None
        if date_start and date_end:
            window = date_end - date_start
            if window.total_seconds() > 0:
                prev_end = date_start
                prev_start = date_start - window

        return {
            "date_range": date_range,
            "date_start": date_start,
            "date_end": date_end,
            "prev_date_start": prev_start,
            "prev_date_end": prev_end,
            "academic_year_id": _parse_int(request.GET.get("academic_year_id")),
            "grade_id": _parse_int(request.GET.get("grade_id")),
            "class_id": _parse_int(request.GET.get("class_id")),
            "subject_id": _parse_int(request.GET.get("subject_id")),
            "teacher_id": _parse_int(request.GET.get("teacher_id")),
            "student_id": _parse_int(request.GET.get("student_id")),
            "page": request.GET.get("page"),
            "page_size": request.GET.get("page_size"),
            "ordering": request.GET.get("ordering"),
        }

    def _build_payload(self, homework_qs, submissions_qs, scored_submissions, scored_prev, params):
        assigned_count = homework_qs.count()
        submitted_homeworks = submissions_qs.filter(
            status__in=["submitted", "auto_graded", "manually_graded", "late"]
        ).values("homework_id").distinct().count()
        missing_submissions = max(0, assigned_count - submitted_homeworks)
        completion_rate = (submitted_homeworks / assigned_count * 100) if assigned_count else 0

        pass_flag = Case(When(score_pct__gte=50, then=1), default=0, output_field=DecimalField())
        on_time_flag = Case(When(is_late=False, then=1), default=0, output_field=DecimalField())

        avg_score = scored_submissions.aggregate(avg=Avg("score_pct"))["avg"] or 0
        prev_avg_score = scored_prev.aggregate(avg=Avg("score_pct"))["avg"] if scored_prev.exists() else None
        trend_delta = None
        if prev_avg_score is not None:
            trend_delta = round(float(avg_score or 0) - float(prev_avg_score or 0), 2)
        pass_rate = (
            scored_submissions.aggregate(rate=Avg(pass_flag))["rate"] * 100 if scored_submissions.exists() else 0
        )
        accuracy_pct = 0  # Submission model lacks question counts in this view context

        grade_distribution = self._grade_distribution(scored_submissions)
        top_students, at_risk_students, pagination = self._student_leaderboards(
            scored_submissions, scored_prev, assigned_count, pass_flag, params
        )
        subject_breakdown = self._subject_breakdown(scored_submissions, pass_flag, on_time_flag)
        class_breakdown = self._class_breakdown(scored_submissions, pass_flag)
        recent_assessments = self._recent_assessments(homework_qs, submissions_qs)

        return {
            "summary": {
                "average_score": round(float(avg_score), 2) if avg_score is not None else 0,
                "pass_rate": round(float(pass_rate or 0), 2),
                "completion_rate": round(float(completion_rate), 2),
                "missing_submissions": missing_submissions,
                "accuracy": round(float(accuracy_pct or 0), 2),
                "trend_delta": trend_delta,
            },
            "grade_distribution": grade_distribution,
            "top_students": top_students,
            "at_risk_students": at_risk_students,
            "subjects": subject_breakdown,
            "classes": class_breakdown,
            "recent_assessments": recent_assessments,
            "filters_applied": {k: v for k, v in params.items() if v},
            "pagination": pagination,
        }

    def _grade_distribution(self, scored_submissions):
        buckets = [
            {"label": "<60", "min": 0, "max": 59.99},
            {"label": "60-69", "min": 60, "max": 69.99},
            {"label": "70-79", "min": 70, "max": 79.99},
            {"label": "80-89", "min": 80, "max": 89.99},
            {"label": "90-100", "min": 90, "max": 100},
        ]
        total = scored_submissions.count() or 1
        results = []
        for bucket in buckets:
            count = scored_submissions.filter(score_pct__gte=bucket["min"], score_pct__lte=bucket["max"]).count()
            results.append(
                {
                    "label": bucket["label"],
                    "count": count,
                    "percentage": round(count / total * 100, 2),
                }
            )
        return results

    def _student_leaderboards(self, scored_submissions, scored_prev, assigned_count, pass_flag, params):
        per_student = (
            scored_submissions.values(
                "student_id",
                "student__first_name",
                "student__last_name",
                "homework__school_class__name",
                "homework__subject__name",
            )
            .annotate(
                avg_score=Avg("score_pct"),
                pass_rate=Avg(pass_flag) * 100,
                submitted=Count("homework", distinct=True),
                late_count=Count("id", filter=Q(is_late=True)),
            )
        )

        prev_map = {}
        if scored_prev.exists():
            prev_rows = (
                scored_prev.values("student_id")
                .annotate(prev_avg=Avg("score_pct"))
            )
            prev_map = {row["student_id"]: float(row["prev_avg"] or 0) for row in prev_rows}

        students = []
        at_risk = []

        for row in per_student:
            missing = max(0, assigned_count - row["submitted"])
            name = f"{row.get('student__first_name', '')} {row.get('student__last_name', '')}".strip() or "Student"
            current_avg = round(float(row["avg_score"] or 0), 2)
            improvement = None
            if row["student_id"] in prev_map:
                improvement = round(current_avg - prev_map[row["student_id"]], 2)
            accuracy = None

            students.append({
                "student_id": row["student_id"],
                "name": name,
                "average_score": current_avg,
                "pass_rate": round(float(row["pass_rate"] or 0), 2),
                "missing_submissions": missing,
                "late_count": row["late_count"],
                "subject": row.get("homework__subject__name") or "",
                "class_name": row.get("homework__school_class__name") or "",
                "improvement": improvement,
                "accuracy": accuracy,
            })

        # Ordering
        ordering = params.get("ordering") or "-average_score"
        reverse = ordering.startswith("-")
        key = ordering.lstrip("-")
        if key not in {"average_score", "pass_rate", "missing_submissions", "improvement"}:
            key = "average_score"
            reverse = True
        students.sort(key=lambda x: (x.get(key) is None, x.get(key, 0)), reverse=reverse)

        for item in students:
            if item["average_score"] < 60 or item["missing_submissions"] > 2 or item["pass_rate"] < 50:
                at_risk.append(item)

        # Pagination
        try:
            page = max(1, int(params.get("page") or 1))
            page_size = min(100, max(1, int(params.get("page_size") or 50)))
        except (TypeError, ValueError):
            page, page_size = 1, 50

        start = (page - 1) * page_size
        end = start + page_size
        paged_students = students[start:end]

        return paged_students, at_risk[:page_size], {
            "page": page,
            "page_size": page_size,
            "total_students": len(students),
        }


    def _subject_breakdown(self, scored_submissions, pass_flag, on_time_flag):
        breakdown = (
            scored_submissions.values("homework__subject_id", "homework__subject__name")
            .annotate(
                avg_score=Avg("score_pct"),
                pass_rate=Avg(pass_flag) * 100,
                on_time_rate=Avg(on_time_flag) * 100,
                submission_count=Count("id"),
            )
            .order_by("-avg_score")
        )
        return [
            {
                "subject_id": row["homework__subject_id"],
                "subject_name": row["homework__subject__name"],
                "average_score": round(float(row["avg_score"] or 0), 2),
                "pass_rate": round(float(row["pass_rate"] or 0), 2),
                "on_time_rate": round(float(row["on_time_rate"] or 0), 2),
                "submission_count": row["submission_count"],
            }
            for row in breakdown
        ]

    def _class_breakdown(self, scored_submissions, pass_flag):
        breakdown = (
            scored_submissions.values("homework__school_class_id", "homework__school_class__name")
            .annotate(
                avg_score=Avg("score_pct"),
                pass_rate=Avg(pass_flag) * 100,
                submission_count=Count("id"),
            )
            .order_by("homework__school_class__name")
        )
        return [
            {
                "class_id": row["homework__school_class_id"],
                "class_name": row["homework__school_class__name"],
                "average_score": round(float(row["avg_score"] or 0), 2),
                "pass_rate": round(float(row["pass_rate"] or 0), 2),
                "submission_count": row["submission_count"],
            }
            for row in breakdown
        ]

    def _recent_assessments(self, homework_qs, submissions_qs, limit=6):
        recent_homework = (
            homework_qs.select_related("subject", "school_class")
            .order_by("-due_date")[:limit]
        )

        homework_ids = [hw.id for hw in recent_homework]
        score_map = (
            submissions_qs.filter(homework_id__in=homework_ids, total_score__isnull=False)
            .annotate(score_pct=_score_pct_expression())
            .values("homework_id")
            .annotate(
                avg_score=Avg("score_pct"),
                submitted=Count("id", filter=Q(status__in=["submitted", "auto_graded", "manually_graded", "late"])),
                std_dev=StdDev("score_pct"),
            )
        )
        score_lookup = {row["homework_id"]: row for row in score_map}

        enroll_counts = (
            StudentEnrollment.objects.filter(school_class_id__in=[hw.school_class_id for hw in recent_homework])
            .values("school_class_id")
            .annotate(total=Count("id"))
        )
        enroll_lookup = {row["school_class_id"]: row["total"] for row in enroll_counts}

        results = []
        for hw in recent_homework:
            stats = score_lookup.get(hw.id, {})
            total_students = enroll_lookup.get(hw.school_class_id, 0) or 1
            submitted = stats.get("submitted", 0) or 0
            completion_rate = submitted / total_students * 100 if total_students else 0
            results.append(
                {
                    "homework_id": hw.id,
                    "title": hw.title,
                    "subject": hw.subject.name if hw.subject else "",
                    "class_name": hw.school_class.name if hw.school_class else "",
                    "average_score": round(float(stats.get("avg_score") or 0), 2),
                    "completion_rate": round(float(completion_rate), 2),
                    "std_dev": round(float(stats.get("std_dev") or 0), 2) if stats.get("std_dev") else 0,
                    "due_date": hw.due_date,
                }
            )
        return results
