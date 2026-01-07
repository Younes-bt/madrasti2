# Madrasti Full Feature Verification Plan (Role-Focused)

This checklist keeps you oriented while you validate every major capability across backend, frontend, and shared infrastructure. For each test, mark the status symbol (⬜️/🟡/✅) and note the date + initials so you can quickly tell what is done, in progress, or not started.

## How To Use

1. Pick a section (global or role) based on what you want to verify next.
2. Execute each test case in order, recording the status symbol plus observations/blockers.
3. When you uncover bugs, log them referencing the checklist ID (e.g., `TEA-ATS-3`).
4. Repeat high-risk suites (auth, payments/rewards, grading, attendance) before every release.

---

## 1. Platform & Environment (Global)

- ⬜️ **ENV-1:** Verify `.env` secrets (DB, Cloudinary, JWT, Google APIs) load correctly and `DEBUG` is `False` outside dev.
- ⬜️ **ENV-2:** Fresh `python manage.py check`, `makemigrations`, `migrate` on a clean database.
- ⬜️ **ENV-3:** Install frontend deps and run `npm run build` without manual intervention; confirm Vite env vars (API base URLs) match deployment.
- ⬜️ **ENV-4:** Smoke test Cloudinary Storage by creating & deleting a dummy upload through `/api/media/files/` and any UI that supports uploads.
- ⬜️ **ENV-5:** Confirm worker/cron scripts (lesson generators, bulk import processors) run with current dependencies.

Notes:

---

## 2. Authentication & Session Management (Global)

- ⬜️ **AUTH-1:** Hit `/api/users/register/`, `/api/users/login/`, `/api/token/*` with valid + invalid data; assert SimpleJWT rotation & blacklisting.
- ⬜️ **AUTH-2:** End-to-end UI flows: Login → First Login password change → Dashboard redirection, logout, and session heartbeat updates.
- ⬜️ **AUTH-3:** Role guarding – attempt protected routes (`/admin`, `/teacher`, `/student`, `/parent`, `/attendance`) with wrong roles and ensure redirects + toasts.
- ⬜️ **AUTH-4:** Force token expiry (short lifetime or tamper) and confirm refresh + automatic logout works.
- ⬜️ **AUTH-5:** Check password reset + change-password endpoints and UI (email template placeholders if email not yet wired).

Notes:

---

## 3. Shared Data Foundations

- ⬜️ **USR-1:** CRUD via `/api/users/` for every role, verifying profile fields (multilingual names, subject specialization, emergency contacts, teachable grades).
- ⬜️ **USR-2:** Student enrollments (`/api/users/enrollments/`) enforce unique class+year constraints; UI updates class rosters accordingly.
- ⬜️ **USR-3:** Bulk import jobs – start a CSV upload, follow status polling, resume on failure, inspect final results.
- ⬜️ **USR-4:** School-wide entities (academic years, levels, grades, tracks, classes, rooms, equipment, vehicles, maintenance, gasoil) expose CRUD APIs with pagination & filters.
- ⬜️ **USR-5:** Media relations (rooms/equipment/vehicles/lessons/homework) accept uploads, list attachments, and delete assets correctly.
- ⬜️ **USR-6:** React Query caching/provider is wired globally (or document fallback) so shared data is cached/offline-ready.

Notes:

---

## 4. Admin / Staff Role (School Management)

### 4.1 Dashboards & Navigation
- ⬜️ **ADM-DASH-1:** Admin dashboard cards display live stats (users per role, attendance summaries, homework load, lesson progress) sourced from backend.
- ⬜️ **ADM-DASH-2:** Sidebar/navigation links respect permissions (staff vs admin vs driver) and highlight active section with localization applied.

### 4.2 User & Role Management
- ⬜️ **ADM-USR-1:** Staff/Teacher/Student/Parent CRUD pages (list/add/edit/view) integrate validation, Cloudinary uploads, and parent-child linking.
- ⬜️ **ADM-USR-2:** Force password change + heartbeat fields update via UI toggles and propagate through `users` endpoints.
- ⬜️ **ADM-USR-3:** Bulk import UI handles upload, mapping preview, progress modal, error download, and job retry.

### 4.3 School Structure
- ⬜️ **ADM-SCH-1:** Academic years, educational levels, grades, tracks, and classes CRUD with inline stats (students count, assigned teachers). Ensure timetable creation enforces single active schedule per class/year.
- ⬜️ **ADM-SCH-2:** Rooms/Equipment/Vehicle management – create entries, attach media, assign responsible staff, mark availability; verify nested media modals.
- ⬜️ **ADM-SCH-3:** Vehicle maintenance & gasoil record pages support nested lists, attachments, and filtering by time range.
- ⬜️ **ADM-SCH-4:** School details (logo, colors, contact info) update via UpdateSchoolDetailsPage and propagate to dashboards + PDF exports.

### 4.4 Lessons, Homework & Curriculum Oversight
- ⬜️ **ADM-LES-1:** LessonsManagementPage lists lessons with filters by subject/grade/teacher; admin can archive/publish/unpublish lessons.
- ⬜️ **ADM-HW-1:** ExercisesManagementPage and StudentProgressPage show aggregated homework stats (per class, per subject) with drill-down to teacher/student detail.
- ⬜️ **ADM-HW-2:** Verify admins can override deadlines or reassign homework if business rules allow.

### 4.5 Attendance & Reporting
- ⬜️ **ADM-ATT-1:** AttendanceReportsPage runs class statistics, daily summary, and exports; check charts/tables match `/api/attendance/reports/*`.
- ⬜️ **ADM-ATT-2:** Pending absence flags list supports assignment to staff, resolution, and parent notification triggers.
- ⬜️ **ADM-ATT-3:** TimetablesPage + Add/Edit timetable wizard create sessions, detect conflicts, and push updates to teachers/students.

### 4.6 Communications & Settings
- ⬜️ **ADM-COM-1:** Placeholder “coming soon” sections (announcements, email templates, parent notifications, emergency alerts, system settings) either have working MVPs or documented status updates (update roadmap if still pending).
- ⬜️ **ADM-COM-2:** Verify translations exist for admin UI strings (AR/FR/EN) and RTL layout works.

Notes:

---

## 5. Teacher Role

### 5.1 Dashboard & Scheduling
- ⬜️ **TEA-DASH-1:** TeacherDashboard shows today’s classes, pending attendance sessions, ungraded submissions, lesson reminders, and quick links.
- ⬜️ **TEA-DASH-2:** TeacherMySchedulePage + TeacherMyClassesPage display timetable & roster with filters (by class, by day).

### 5.2 Lesson & Content Authoring
- ⬜️ **TEA-LES-1:** Add/Edit Lesson pages support multilingual titles, objectives, tags, attachments, and class availability toggles; preview mode for students.
- ⬜️ **TEA-LES-2:** LessonExerciseManagementPage + Create/Edit/View Lesson Exercise flows handle different exercise templates, attach lesson references, and publish statuses.

### 5.3 Homework & Assessment
- ⬜️ **TEA-HW-1:** CreateHomeworkPage builds assignments with mixed question types, due dates, reward settings, grade/class targets, and optional textbooks.
- ⬜️ **TEA-HW-2:** Homework list allows duplication, status change (draft/published/archived), and analytics view per assignment.
- ⬜️ **TEA-HW-3:** GradingPage + GradeSubmissionPage review submissions, annotate responses, upload feedback files, assign scores/rubrics, and trigger result notifications.
- ⬜️ **TEA-HW-4:** ExamsPage + AssessmentToolsPage integrate with backend exam endpoints (if available) or clearly mark TODO in roadmap.

### 5.4 Attendance & Classroom Management
- ⬜️ **TEA-ATT-1:** TeacherAttendancePage fetches today’s sessions, starts sessions, bulk marks attendance statuses (present/late/excused), attaches notes.
- ⬜️ **TEA-ATT-2:** AttendanceHistoryPage shows historical sessions with filters and export options.
- ⬜️ **TEA-ATT-3:** StudentAbsenceFlag actions from teacher context (create flag, escalate, resolve).

### 5.5 Student Support & Communication
- ⬜️ **TEA-COM-1:** StudentProgressPage lists students with homework/lesson progress, allows filtering by risk level, and links to Student detail view.
- ⬜️ **TEA-COM-2:** TeacherViewStudentPage aggregates attendance, homework, grades, and notes; teacher can add comments or upload supporting files.
- ⬜️ **TEA-COM-3:** Messaging/notification hooks (if implemented) allow teacher to notify parents/students from relevant screens; otherwise ensure TODO documented.

Notes:

---

## 6. Student Role

### 6.1 Dashboard & Profile
- ⬜️ **STU-DASH-1:** StudentDashboard surfaces due homework, upcoming lessons, timetable snippet, attendance status, rewards/badges, and notifications.
- ⬜️ **STU-DASH-2:** StudentProfileOverview + StudentProfileSettings allow editing contact info, preferences, password change, and display guardian info.

### 6.2 Lessons & Homework Consumption
- ⬜️ **STU-LES-1:** StudentLessonsPage list respects availability windows, cycle filters, and localization; StudentViewLessonPage shows objectives/resources/quizzes.
- ⬜️ **STU-HW-1:** StudentHomeworkPending/Work/Completed/Grades/Feedback pages correctly reflect backend statuses; transitions triggered when submitting.
- ⬜️ **STU-HW-2:** StudentHomeworkWorkPage supports answering all question types, uploading files, saving drafts, submitting final answers, and viewing teacher feedback.
- ⬜️ **STU-HW-3:** StudentSubmissionReviewPage & StudentExerciseEntryPage show rubric feedback and allow resubmission if teacher enabled.

### 6.3 Attendance & Rewards
- ⬜️ **STU-ATT-1:** StudentTimetablePage + StudentAttendanceHistory/Report show session logs, summary stats, and printable reports.
- ⬜️ **STU-ATT-2:** Absence flags/notifications appear with reason and contact instructions.
- ⬜️ **STU-REW-1:** StudentPointsPage + RewardsPage display wallet balance, recent transactions, badges earned, leaderboard rank, and reward store (if applicable).

Notes:

---

## 7. Parent Role

### 7.1 Account & Linking
- ⬜️ **PAR-ACC-1:** Parent accounts list all linked children (from backend parent-child relation); ensure linking works during student creation/import.
- ⬜️ **PAR-ACC-2:** ParentDashboard (or placeholder) displays summary cards per child (attendance, homework, grades, alerts). If missing, document roadmap status.

### 7.2 Monitoring & Approvals
- ⬜️ **PAR-MON-1:** Attendance alerts/absence flags show status, allow parents to acknowledge or submit excuse notes.
- ⬜️ **PAR-MON-2:** Homework view shows due/overdue tasks, completion status, teacher feedback, and reward points earned per child.
- ⬜️ **PAR-MON-3:** Communication center lists announcements, emails, or emergency alerts once implemented.

Notes:

---

## 8. Staff & Driver Roles

- ⬜️ **STF-OPS-1:** Staff login routes them to Admin dashboard with limited permissions; verify they can manage assigned modules (e.g., equipment, attendance follow-up).
- ⬜️ **DRV-OPS-1:** Driver accounts (if front-end exists) show assigned vehicles/routes, maintenance schedules, or at minimum display instructions; otherwise update roadmap to reflect pending work.
- ⬜️ **STF-OPS-2:** Drivers/staff can upload incident reports or maintenance tickets with photos.

Notes:

---

## 9. Cross-Role Interaction Journeys

### 9.1 Student Lifecycle
- ⬜️ **JRN-STU-1:** Admin creates student + parent; student enrolls in class; teacher sees student in roster; student dashboard reflects class; parent dashboard shows linkage.

### 9.2 Lesson & Homework Lifecycle
- ⬜️ **JRN-LES-1:** Teacher creates lesson → assigns to class → student sees it → admin can audit/publish → parent optionally views summary (if feature exists).
- ⬜️ **JRN-HW-1:** Teacher publishes homework → students complete → teacher grades → student sees feedback → parent sees result → admin views aggregated progress charts.
- ⬜️ **JRN-HW-2:** Rewards triggered from homework completion increase student wallet, appear on leaderboard, and admin sees reward transactions.

### 9.3 Attendance Lifecycle
- ⬜️ **JRN-ATT-1:** Admin builds timetable → teacher runs attendance session → records persist → student dashboard updates → parent receives alert for absences → admin analytics dashboards update.
- ⬜️ **JRN-ATT-2:** Absence flag escalated by teacher/admin → parent acknowledges/clears it → notification resolves for all parties.

### 9.4 Media & Documentation
- ⬜️ **JRN-MED-1:** Admin/teacher uploads media (lesson resource, equipment photo) → Cloudinary stores it → other roles can view/download respecting permissions.

Notes:

---

## 10. Internationalization, Accessibility & UX Consistency

- ⬜️ **I18N-1:** Toggle Arabic/French/English; ensure translations exist for dashboards, management forms, homework views, notifications. Fill gaps in `frontend/src/locales/*`.
- ⬜️ **I18N-2:** RTL layout for Arabic flips navigation, form alignment, and components (cards, tables). Fix any visual regressions.
- ⬜️ **I18N-3:** Accessibility sweep—keyboard navigation, focus states, ARIA labels on interactive widgets, contrast in both light/dark themes.
- ⬜️ **I18N-4:** Print/export styles (e.g., `print.css`) produce legible reports for transcripts, attendance, etc.

Notes:

---

## 11. Performance, Offline & DevOps

- ⬜️ **PERF-1:** Backend endpoints tested for pagination/filtering to avoid huge payloads (lessons, homework, attendance records). Document any slow queries.
- ⬜️ **PERF-2:** Frontend Lighthouse audit (PWA, Performance, Best Practices, Accessibility). Record scores per build.
- ⬜️ **PERF-3:** React Query persistence + service worker / manifest deliver offline-ready experience (if PWA goal stands); otherwise capture updated scope.
- ⬜️ **PERF-4:** CI pipelines run backend tests + frontend lint/build; deployments load correct env vars; backups & monitoring (logs, alerts) exist.

Notes:

---

## 12. Documentation & Tracking

- ⬜️ **DOC-1:** Update `ADMIN_DASHBOARD_PROGRESS.md`, `FRONTEND_DEVELOPMENT_ROADMAP.md.md`, and API docs to match actual progress (mark done vs pending items).
- ⬜️ **DOC-2:** Keep lesson/homework trackers (`ALL_LESSONS_TRACKER.md`, `LESSON_EXERCISE_GENERATION_TRACKER.md`) current so educators know coverage.
- ⬜️ **DOC-3:** UX decisions recorded in `UX_madrasti*.md` (navigation, flows, pending questions).
- ⬜️ **DOC-4:** Record executions of this checklist (date/tester/outcome) to prove regression coverage.

Notes:

---

By walking through these role-specific suites and cross-role journeys, you’ll regain full project context and know exactly which features are delivered, in flight, or still on the drawing board. Happy testing! ✅
