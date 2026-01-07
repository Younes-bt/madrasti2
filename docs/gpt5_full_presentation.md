# Madrasti 2.0 – Client Presentation (Full Feature Walkthrough)

## 1. Executive Summary
- Madrasti 2.0 is a role-aware digital campus for Moroccan K‑12 schools that unifies academics, daily operations, and family engagement.
- Every user signs in once and is routed to a workspace tailored to their role (Admin, Staff, Teacher, Student, Parent, Driver) with JWT-secured APIs and multilingual UI (AR/FR/EN, RTL-aware).
- The platform ships with lessons and homework engines, attendance with parent alerts, rewards/gamification, academic scheduling, rooms and assets, and robust admin tools — all backed by a documented REST API and cloud media storage.

## 2. Architecture at a Glance
- Backend: Django + DRF with apps for `users`, `schools`, `lessons`, `homework`, `attendance`, `media`. JWT auth, RBAC, CORS, pagination, and Cloudinary storage are configured centrally (backend/madrasti/settings.py:1).
- Frontend: React + Vite + Tailwind + shadcn UI. Global providers for theme, language, and auth, and a role-protected route map (frontend/src/App.jsx:1).
- Services: Axios-based clients encapsulate API calls (frontend/src/services/*.js), with a websocket helper prepared for real-time events.
- Data Model: School core (academic years, levels, grades, classes, subjects, rooms, transport, equipment) in backend/schools/models.py:1 drives admin and academic flows end-to-end.

## 3. Roles and Home Experiences
- Admin/Staff: Operations cockpit with KPIs, shortcuts, and full CRUD over people, structures, timetables, rooms, transport, and equipment (frontend/src/pages/admin/*).
- Teacher: “Run my day” view with today’s sessions, start attendance, pending grading, and quick assignment creation (frontend/src/pages/teacher/TeacherDashboard.jsx:1).
- Student: What’s next, due-soon homework, lesson progress, achievements, and attendance summary (frontend/src/pages/dashboard/StudentDashboard.jsx:1).
- Parent: Children switcher, alerts (absence, low grade), homework status, transport/payments placeholders (frontend/src/pages/dashboard/ParentDashboard.jsx:1).
- Driver: Dedicated role exists; route and check-in flows align with transport models for upcoming mobile screens.

## 4. Authentication, RBAC, and Session Flow
- Login: Email/password over `/api/users/login/` returns refresh/access tokens and user profile with role (docs/API_DOCUMENTATION.md:1). Frontend stores tokens, adds `Authorization: Bearer` automatically, and refreshes silently.
- Roles: Custom user model `users.User` enumerates ADMIN/TEACHER/STUDENT/PARENT/STAFF/DRIVER and connects to `Profile`, `StudentEnrollment`, and relations (backend/users/models.py:1).
- Route Protection: `ProtectedRoute` checks `useAuth()` for token and role, redirecting to correct dashboard on success (frontend/src/App.jsx:1).
- First Login: `force_password_change` flag is honored by `FirstLoginPage.jsx` for secure credential rotation (frontend/src/pages/auth/FirstLoginPage.jsx:1).

## 5. School Setup & Operations (Admin)
How it works:
- School Configuration: Singleton `schools.School` stores name, contacts, social links, logo (Cloudinary), and current academic year. Admin screens read/update via REST (frontend/src/pages/admin/SchoolDetailsPage.jsx:1).
- People & Roles: Admins manage staff, teachers, students, and parents through `users` entities. List/search/filter/paginate, edit profiles, avatars, emergency contacts, academic info, and parent links (frontend/src/pages/admin/StaffManagementPage.jsx:1, TeachersManagementPage.jsx:1, StudentsManagementPage.jsx:1, ParentsManagementPage.jsx:1).
- Bulk Import: `BulkImportStudentsPage.jsx` orchestrates CSV ingestion and progress monitoring using `users.BulkImportJob` (backend/users/models.py:1).
- Rooms & Assets: `schools.Room` with types, capacity, media gallery; `schools.Equipment` captures inventory with attachments. Admin pages provide full CRUD and feature image uploads (frontend/src/pages/admin/RoomsManagementPage.jsx:1, EquipmentManagementPage.jsx:1).
- Transport: `schools.Vehicle`, `VehicleRoute`, `VehicleMaintenanceRecord`, `GasoilRecord` track fleet, routes, maintenance, and fuel with attachments. UI is implemented for management with detail views (frontend/src/pages/admin/VehiclesManagementPage.jsx:1, ViewVehiclePage.jsx:1).

## 6. Academic Structure & Timetables
How it works:
- Academic Years: `schools.AcademicYear` enforces a single current year, with CRUD pages validating ranges and status (frontend/src/pages/admin/AcademicYearsPage.jsx:1).
- Levels/Grades/Tracks/Classes: Canonical hierarchy underpins scheduling and enrollment; uniqueness/order constraints ensure consistency (frontend/src/pages/admin/EducationalLevelsPage.jsx:1, GradesPage.jsx:1, ClassesPage.jsx:1, TracksPage.jsx:1).
- Timetables: `attendance.SchoolTimetable` and `TimetableSession` bind class, subject, teacher, room, day, time, with server-side conflict prevention (teacher double-booking/overlap). Admin pages provide builders and editors (frontend/src/pages/admin/TimetablesPage.jsx:1, AddTimetablePage.jsx:1).

## 7. Lessons & Resources
How it works:
- Content Model: `lessons.Lesson` links subject/grade/track with objectives, prerequisites, difficulty, and order (backend/lessons/models.py:1).
- Resources: `LessonResource` stores ordered assets (PDF, video, audio, image, document, link, exercise) on Cloudinary with visibility and download controls.
- Per-Class Publishing: `LessonAvailability` toggles which classes can access a lesson, enabling phased release and differentiation.
- Teacher Screens: Create/edit/manage lessons and attach resources (frontend/src/pages/teacher/LessonsPage.jsx:1, AddLessonPage.jsx:1, EditLessonPage.jsx:1, ViewLessonPage.jsx:1).
- Student Screens: Discover lessons and track progress on each (frontend/src/pages/student/StudentLessonsPage.jsx:1, StudentViewLessonPage.jsx:1).

## 8. Homework, Exercises, and Grading
How it works:
- Homework: `homework.Homework` ties to subject, grade, class, lesson, and teacher. Supports formats (mixed, QCM-only, open, book exercises), publish/due/lock dates, and validation (backend/homework/models.py:1).
- Exercises & Questions: Structured exercise and question banks support auto-grading and manual review. Teachers select difficulty, randomize items, and set points.
- Submissions: Students submit work per exercise; auto-grading updates scores immediately while teachers can override, annotate, and reopen attempts.
- Rewards: `HomeworkReward` configures completion/performance/timeliness incentives; wallet and badges update on submission/grade events (see Section 10).
- Teacher UI: Build, publish, and grade (CreateLessonExercisePage.jsx:1, LessonExerciseManagementPage.jsx:1, CreateHomeworkPage.jsx:1, GradingPage.jsx:1, GradeSubmissionPage.jsx:1).
- Student UI: Workbench guides students through attempts, feedback, grades, and retakes (StudentHomeworkWorkPage.jsx:1, StudentHomeworkPendingPage.jsx:1, StudentHomeworkCompletedPage.jsx:1, StudentHomeworkGradesPage.jsx:1, StudentHomeworkFeedbackPage.jsx:1).

## 9. Attendance & Parent Alerts
How it works:
- Scheduling Foundation: `SchoolTimetable`/`TimetableSession` define who, where, and when.
- Roll Call: For each session, an `AttendanceSession` moves from not started → in progress → completed. Teachers mark `AttendanceRecord` per student as present/late/absent/excused with notes.
- Interventions: `StudentAbsenceFlag` raises alerts for chronic absence; `AttendanceJustification` captures parent-provided reasons with attachments.
- Notifications: `AttendanceNotification` records parent delivery lifecycle (pending/sent/delivered/read) with clear linkage to the underlying record or flag (backend/attendance/models.py:1).
- Teacher UI: `TeacherAttendancePage.jsx:1` and `AttendanceHistoryPage.jsx:1` enable rapid entry and review. Student and parent dashboards surface their respective summaries.

## 10. Rewards, Wallets, and Gamification
How it works:
- Global Settings: `RewardSettings` defines points, coins, penalties, conversion, leaderboards, and toggles per school (backend/homework/models.py:1).
- Wallets: `StudentWallet` accumulates lifetime/weekly/monthly balances, XP, streaks, perfect scores, and early submissions. Level names derive from XP thresholds.
- Transactions & Badges: `RewardTransaction` logs every points/coins change; badge awards recognize milestones and engagement patterns.
- Student UI: `StudentPointsPage.jsx:1` visualizes balances, achievements, and rankings; teacher grading screens trigger the rewards pipeline.

## 11. Media, Files, and Attachments
How it works:
- Cloudinary Storage: All media (images, docs, videos) use Cloudinary via `cloudinary_storage` and `CloudinaryField`.
- Central Media App: The `media` app provides generic file relations (e.g., room galleries, maintenance receipts) with ordering and type flags (backend/media/models.py:1).
- Lesson/Asset Media: Lesson resources, vehicle maintenance attachments, and room galleries all share consistent upload and retrieval semantics.

## 12. Communications & Notifications
- In-App: UI toasts and prepared websocket hooks surface attendance, grading, and announcement events (frontend/src/App.jsx:1, services/websocket.js:1).
- Email/SMS Hooks: API docs outline templating and rate limiting for parent alerts and emergency communications (docs/API_DOCUMENTATION.md:1).
- Roadmap: Admin pages reserve sections for announcements, email templates, and parent notification rules with permissions.

## 13. Analytics, Reporting, and Exports
- Dashboards: Persona home pages surface contextual analytics (progress, attendance trends, workloads) with accessible chart components and textual alternatives.
- Reports: Attendance reports, academic performance, financials, and comparative analytics have routes scaffolded and designs in admin docs (frontend/docs/ADMIN_DASHBOARD_PROGRESS.md:1).
- MASSAR & Custom Exports: Planned in reporting roadmap; schema alignment to be finalized during analytics phase.

## 14. Localization, Accessibility, and Performance
- Multilingual + RTL: Arabic-first UI with French/English alongside. Language context, localized fields, and mirrored layouts ensure natural experiences (frontend/src/locales/ar/ar.json:1).
- Accessibility: WCAG AA guidance for color contrast, focus-visible, keyboard operability, reduced motion, and clear labels (frontend/docs/UX_madrasti_V2.md:1).
- Performance: Vite bundling, Tailwind utility CSS, skeleton states, optimistic UI for fast interactions; PWA deployment plan in the frontend roadmap (docs/FRONTEND_DEVELOPMENT_ROADMAP.md.md:1).

## 15. Security & Compliance
- Authentication: JWT with access/refresh tokens, rotation, and configurable lifetimes; route guards on frontend and DRF permission classes on backend (backend/madrasti/settings.py:1).
- RBAC: `users.User.role` with dedicated query filters and permission checks across endpoints; sensitive actions require admin role.
- Privacy: Parent/student relations define notification preferences; audit fields (`created_at`, `updated_at`) and soft-delete patterns improve traceability.

## 16. Project Status & Roadmap
Completed (per admin progress tracker):
- Admin My School and Academic Management sections with live APIs: staff, teachers, students, parents, rooms, academic years, educational levels, grades, classes, subjects, timetables (frontend/docs/ADMIN_DASHBOARD_PROGRESS.md:1).
- Lessons, resources, per-class publishing; core homework engine with exercises and grading; student homework workspace.
- Attendance scheduling, roll-calls, justifications, and parent notifications.
- Rewards engine (wallets, transactions, badges) and student achievements UI.

In Progress / Next:
- Vehicles and equipment UX polish and reporting.
- Education Management expansions: assignments views, exams management, grading dashboards.
- Reports & analytics visualizations; communications center; system settings.
- Driver mobile workflows (routes, pickup/drop), transport live tracking, payments.

## 17. Demo Scenarios (Client Walkthrough)
- Admin: Create academic year → add grades/classes → build timetable → add rooms → import students → assign teachers → verify dashboards.
- Teacher: Open today’s session → start attendance → assign homework to class → grade submissions → watch rewards update.
- Student: Check dashboard → open lesson → complete exercises → view grade & feedback → see wallet/badges change.
- Parent: Switch child → receive absence alert → submit justification → review homework progress.

## 18. Why Choose Madrasti 2.0
- Centralizes operations, accelerates teaching workflows, informs families in real time, and motivates students with transparent progress and rewards.
- Modular architecture and documented APIs make rollouts, integrations, and scale straightforward across schools and regions.

## 19. Call to Action
- Approve next sprint to finalize transport/assets reporting and education management analytics.
- Greenlight staging deployment for stakeholder demos and user testing.
- Align rollout plan (pilot school cohort, training, support) to bring Madrasti 2.0 into classrooms.

