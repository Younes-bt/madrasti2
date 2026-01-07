# Academic Performance — Spec (Admin > Reports & Analytics)

This document defines the scope, data sources, KPIs, formulas, and API/UX needed to implement the Academic Performance area visible in the admin sidebar.

## Purpose
- Provide a consolidated view of learning outcomes across school, grade, class, subject, and student.
- Combine assessments, practice, and attendance to identify strengths, gaps, and at‑risk students.
- Enable interventions and comparative analysis across time periods (month/term/semester/year).

## Backend Data Sources (existing)
- Assessments
  - `Homework` (types: `homework|classwork|quiz|exam|project`, `total_points`) — backend/homework/models.py:344–395.
  - `Submission` (`total_score`, `status`, `attempt_number`, `time_taken`, `graded_by/at`) — backend/homework/models.py:738–777.
- Practice/Mastery
  - `Exercise` (`total_points`) and `ExerciseSubmission` (`total_score`, `percentage_score`, `is_best_score`) — backend/homework/models.py:450, 488, 896, 918–927.
- Attendance/Behavior
  - `AttendanceRecord` per session with `status` — backend/attendance/models.py:219.
  - `AttendanceSession` per timetable session/date — backend/attendance/models.py:117.
- Academic Structure
  - `Grade.passing_grade` — backend/schools/models.py:126.
  - `Subject` and `SubjectGrade.coefficient` — backend/schools/models.py:458, 468.
  - Roster via `StudentEnrollment` — backend/users/models.py:318.

## KPIs
- Student
  - Overall percentage and pass/fail vs `Grade.passing_grade`.
  - Per‑subject percentage and rank in class.
  - Completion and timeliness: assigned vs submitted; on‑time vs late; average time taken; attempts used.
  - Practice mastery: best attempt average for exercises; improvement trend.
  - Attendance rate: present+late over total sessions.
- Class/Subject/Grade
  - Average, median, distribution, pass rate, top/bottom students.
  - Breakdown by assessment type (exam/quiz/homework/project).
  - Exercise completion and accuracy by lesson/topic.
- Risk & Correlation
  - At‑risk list: low average AND high absence/late rate.
  - Attendance → performance correlation indicator.
- Trends
  - Time series for average, completion rate, and attendance rate (week/month/term).

## Formulas
- Normalized assessment percentage (within a filter window):
  - `sum(Submission.total_score) / sum(Homework.total_points) * 100` for `Submission.status ∈ {submitted, auto_graded, manually_graded}`.
- Assessment type weighting (defaults; make configurable):
  - `exam 0.60 + quiz 0.25 + homework/classwork 0.15` applied per subject/student.
- Subject weighting (overall/GPA‑like):
  - Multiply subject averages by `SubjectGrade.coefficient`, then divide by sum of coefficients for the scope.
- Pass/Fail:
  - Compare subject or overall average to `Grade.passing_grade`.
- Practice mastery:
  - Use only `ExerciseSubmission.is_best_score == True`; average `percentage_score`.
- Attendance rate:
  - `(present + late) / total_sessions * 100` (pattern used in attendance class statistics view).
- Timeliness:
  - On‑time vs late submission counts; apply `Homework.late_penalty_percentage` only to academic score, not completion rate.

## API Endpoints (to add)
Base path: `/api/reports/academic-performance/`

- `GET overview` — `?scope=school|grade|class|subject&year=…&from=…&to=…`
  - Returns top‑level cards: overall_avg, pass_rate, on_time_rate, practice_mastery, attendance_rate.
  - Includes distributions and high‑level trends.
- `GET students` — `?class_id=…&subject_id?&from=…&to=…`
  - Per‑student metrics: overall%, per‑subject%, completion, timeliness, practice mastery, attendance%.
- `GET subjects` — `?grade_id=…&from=…&to=…`
  - Subject league table using `SubjectGrade.coefficient` weighting; pass rates and distributions.
- `GET trends` — `?class_id=…&period=week|month&window=…&subject_id?`
  - Time series for averages, completion, attendance.

Implementation notes:
- Use `StudentEnrollment` for class rosters; do not rely on `school_class.students` (not defined).
- Normalize scoring across different `total_points`.
- For practice, rely on `ExerciseSubmission` with `is_best_score`.
- Reuse the aggregation approach from `attendance.views.AttendanceReportsViewSet.class_statistics` and `homework.views.HomeworkViewSet.statistics`.

## UI/UX
- Filters (top bar): academic year, date range/term preset, grade, class, subject, teacher.
- Summary Cards (school/grade/class level):
  - `Overall Average`, `Pass Rate`, `On‑Time Rate`, `Practice Mastery`, `Attendance Rate`.
- Charts
  - Score distribution (histogram), average trend (line), completion trend (line), attendance vs score (scatter).
- Tables
  - Subject league table (avg, pass rate, coefficient).
  - Top/bottom students with quick actions (view profile, message, assign remedial).
  - At‑risk students with reasons (low average + poor attendance).
- Exports
  - CSV/Excel/PDF for students/subjects tables and snapshot of cards.

## Permissions
- Admin/Staff: full access.
- Teacher: limited to their classes/subjects (use teacher’s `Profile.school_subject` and `Profile.teachable_grades`).
- Parent/Student: not exposed via Admin; separate student/parent dashboards may show personal progress only.

## Edge Cases
- Missing submissions: treat as 0 for completion, but exclude from score unless policy dictates otherwise (configurable).
- Late submissions: reflect in timeliness and optionally penalty in score per homework config.
- Multiple attempts: use final or best per `Homework.allow_multiple_attempts`; exercises use `is_best_score`.
- No `AcademicTerm` model: provide date presets; optional future `AcademicTerm(academic_year, name, start_date, end_date)`.

## Suggested Implementation Plan
- Phase 1: API aggregations for overview/students/subjects/trends.
- Phase 2: Admin UI with filters, cards, tables, and charts.
- Phase 3: Performance snapshot model for caching (nightly job), similar to `WeeklyLeaderboardSnapshot`.
- Phase 4: Configurable weighting (assessment types and subject coefficients UI).

## Validation Checklist
- Compare averages with manual Excel checks on a sample class.
- Verify pass/fail vs `Grade.passing_grade`.
- Confirm teacher scoping returns only their classes/subjects.
- Load test aggregations on realistic data volumes; add indexes as needed.

---
Last updated: generated from repository analysis to align frontend with existing backend models and views.
