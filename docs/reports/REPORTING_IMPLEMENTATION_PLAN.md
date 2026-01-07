# Reporting Implementation Plan

Goal: deliver role-based reports for students, teachers, parents, staff, and admins across attendance, academic performance (exercises + homework), rewards/points, finance, and communications.

## Phase 0 – Prep & Alignment (1–2 days)
- Confirm scope, roles, KPIs, and access rules; map data sources (attendance, homework/submissions, lesson progress, rewards, finance, communications).
- Enable/verify apps: analytics/reports in INSTALLED_APPS, migrations applied; decide whether to aggregate on the fly vs. materialized tables.
- Define filter conventions (date range, class, subject, teacher, grade, student).

### Phase 0 Working Checklist
- [ ] Roles & scopes confirmed: Admin (all), Teacher (own classes/subjects), Student (self), Parent (children), Staff (per scope).
- [ ] KPI definitions locked: attendance %, avg score, accuracy, completion, missing/late, grade bands, trends, points/badges, payments, comms engagement.
- [ ] Data source map documented: Attendance (sessions/status), Homework (Homework/Submission), LessonProgress (avg_score, accuracy, completion), Rewards (StudentWallet/RewardTransaction), Finance (invoices/payments), Communication (messages/notifications).
- [ ] App enablement: `analytics` and `reports` not in `INSTALLED_APPS` yet—add when we wire endpoints.
- [ ] Filter contract: date_range, academic_year, grade, class, subject, teacher, student; pagination/sorting conventions.
- [ ] Decision: start with live aggregates; evaluate materialized summaries if perf needs appear.

#### KPI Definitions (proposed defaults)
- Attendance: presence %, absence %, late %, total sessions; chronic absence/late flags (threshold configurable).
- Academic scores: avg_score (0–100), pass_rate (>=50 or subject pass mark), accuracy % (correct/answered), completion % (submitted/assigned), missing/late counts.
- Grade bands: <60, 60–69, 70–79, 80–89, 90–100 (configurable).
- Trends: % change vs prior period (same length) and vs school average.
- Engagement: exercises attempted, time_spent (if tracked), rewards points/coins, badges earned, streaks.
- Finance: paid/overdue/upcoming amounts by child/parent; payment status.
- Communication: messages/notifications sent/seen per role (if data available).

#### Filter & Query Contract (backend/frontend)
- date_range (today|this_week|this_month|this_term|this_year|custom[start,end])
- academic_year_id (optional but preferred), grade_id, class_id, subject_id, teacher_id, student_id
- pagination: `page`, `page_size`; sorting: `ordering` (e.g., `-average_score`)
- role scoping: admin/staff (all); teacher (own classes/subjects); student (self); parent (their children)

#### App Enablement & Data Strategy
- Add `analytics` and `reports` to INSTALLED_APPS when endpoints land; run migrations.
- Start with live aggregates using Homework/Submission/LessonProgress and Attendance; add cached/materialized summaries only if query perf degrades.

## Phase 1 – Student Performance APIs (backend first) (3–5 days)
- Implement read-only DRF endpoints under `reports` (or `analytics`) for student performance:
  - Cohort aggregates by subject/class/grade: avg score, accuracy, completion, missing/late counts, grade bands, trends.
  - Student leaderboard + most improved + at-risk flags (rules: low avg, missing N submissions, drop Δ%).
  - Recent assessments table: from Homework/Submission with avg, std dev, completion.
  - Grade distribution buckets.
- Add serializers/viewsets, filtersets, and permissions (admin/staff full; teacher limited to their classes/subjects; student self).
- Wire URLs; basic tests for filtering/aggregation.

### Phase 1 implementation (complete)
- Endpoint: `GET /api/reports/student-performance/`
- Filters: `date_range` (today|this_week|this_month|this_term|this_year|custom), `start_date`, `end_date`, `academic_year_id`, `grade_id`, `class_id`, `subject_id`, `teacher_id`, `student_id`.
- Role scoping: admin/staff (all), teacher (own homeworks or assigned classes), student (self), parent (must supply student_id).
- Response summary: `average_score`, `pass_rate`, `completion_rate`, `missing_submissions`, `accuracy`, `trend_delta`.
- Sections: `grade_distribution`, `top_students`, `at_risk_students`, `subjects`, `classes`, `recent_assessments`, `filters_applied`, `pagination` (students).
- Data sources: Homework + Submission (scores, late, due dates) + StudentEnrollment (class size for completion); trend delta uses prior-period submissions.
- Frontend: Academic Performance page consumes this endpoint, passes ID filters (class/subject/teacher/grade/academic_year/date_range), supports pagination/ordering on students, shows trend delta and empty states.

## Phase 2 – Teacher Performance & Cohort Impact (2–4 days)
- Teacher KPIs: classes taught, homework assigned, completion %, avg student score/accuracy, attendance correlation.
- Per-class/subject breakdown for a teacher; flags for cohorts needing support.
- Expose teacher-facing limited endpoints; admin/staff can query any teacher.
- Tests for scoping and aggregates.

## Phase 3 – Attendance Reporting Parity (1–2 days)
- Reuse attendance data to surface presence/absence/late rates by student/class/teacher/subject with the same filters.
- Add flags for chronic absence/late; expose combined performance+attendance views for correlations.

## Phase 4 – Parent & Student Self Reports (2–3 days)
- Student self-report endpoint: wrap existing lesson progress + submissions + attendance + points/badges into one payload.
- Parent endpoints: child list with per-child performance, attendance, payment status, communication summary.
- Permissions: parent limited to their children; student to self only.

## Phase 5 – Finance & Communication Summaries (2–3 days)
- Finance: per-student/parent payment status, overdue amounts, upcoming invoices; cohort rollups for admins.
- Communication: message/notification engagement counts per parent/student; teacher outbound counts.

## Phase 6 – Frontend Integration & UX (2–4 days)
- Replace “Coming Soon” pages with live data for admin academic performance; then teacher/student/parent report views.
- Add exports (CSV/PDF) and pagination; ensure filters align with backend query params.
- Light caching/loading states; error messaging.

## Phase 7 – Hardening (ongoing)
- Role-based access tests; data correctness tests for aggregates; performance profiling on large cohorts.
- Background jobs (optional) to precompute heavy aggregates if needed.
- Observability: logs/metrics for report queries.

## Open Decisions
- Materialized vs. live aggregates for performance; schedule if needed.
- Location for endpoints (`reports` vs `analytics`) and naming conventions.
- Flag rules (thresholds for low score, missing submissions, drops).
