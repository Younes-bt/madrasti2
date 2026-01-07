# Madrasti 2.0 – Client Presentation

## 1. Executive Overview
- Madrasti 2.0 is a unified digital campus tailored to Moroccan K-12 schools, covering academics, operations, teaching, and family engagement in one platform.
- Every persona (admin, staff, teacher, student, parent, driver) signs in once and is routed to a role-specific workspace powered by JWT-secured APIs (`backend/madrasti/settings.py`, `frontend/src/App.jsx`).
- The system is multilingual (Arabic, French, English) and RTL-aware through the shared language context and locale packs (`frontend/src/contexts/LanguageContext.jsx`, `frontend/src/locales`).
- Cloud-hosted media (Cloudinary) and PWA-ready frontends keep the experience fast for web and mobile environments.

## 2. Platform Architecture
- **Backend**: Django REST Framework with custom apps for users, schools, lessons, homework, attendance, and media. JWT authentication, role-based permissions, and Cloudinary storage are configured centrally (`backend/madrasti/settings.py`).
- **Frontend**: React + Vite + Tailwind + shadcn UI. Context providers wrap authentication, theming, and i18n, while `frontend/src/App.jsx` wires the protected route map for every persona.
- **Services Layer**: Typed Axios clients in `frontend/src/services` encapsulate API calls (users, schools, lessons, homework, attendance, rewards) and a WebSocket helper for live notifications.
- **Data Cohesion**: Core school entities live in `backend/schools/models.py` (academic years, levels, grades, classes, tracks, rooms, transport, equipment) and are exposed through REST viewsets consumed by admin pages.
- **Deployment Readiness**: Frontend roadmap outlines PWA packaging, offline caching, and CI/CD practices (`docs/FRONTEND_DEVELOPMENT_ROADMAP.md.md`).

## 3. Role-Based Journeys

### 3.1 Administration & Staff
- Land on `AdminDashboard` (`frontend/src/pages/dashboard/AdminDashboard.jsx`) with KPIs, tasks, and shortcuts.
- **School Profile**: `SchoolDetailsPage.jsx` fetches and updates the singleton school configuration (`backend/schools/models.py:School`). Cloudinary-backed logo uploads and multilingual details keep the school identity consistent.
- **People Operations**: Full CRUD for staff, teachers, students, and parents backed by `users.User`, `users.Profile`, and `users.StudentEnrollment`. Pages such as `StaffManagementPage.jsx`, `TeachersManagementPage.jsx`, `StudentsManagementPage.jsx`, and `ParentsManagementPage.jsx` handle search, filters, pagination, and detail drawers while calling `frontend/src/services/users.js`.
- **Bulk Imports**: `BulkImportStudentsPage.jsx` leverages the `users.BulkImportJob` tracker for CSV ingestion with progress feedback.
- **Facilities & Assets**: `RoomsManagementPage.jsx`, `VehiclesManagementPage.jsx`, and `EquipmentManagementPage.jsx` manage rooms (`schools.Room`), transport fleets (`schools.Vehicle`, `VehicleRoute`, `VehicleMaintenanceRecord`, `GasoilRecord`), and inventory with media galleries.
- **Academic Structure**: `AcademicYearsPage.jsx`, `EducationalLevelsPage.jsx`, `GradesPage.jsx`, `ClassesPage.jsx`, `TracksPage.jsx`, `SubjectsPage.jsx`, and `TimetablesPage.jsx` orchestrate the complete hierarchy. Backend models enforce uniqueness, ordering, and integrity. Timetable creation calls conflict-checked endpoints powered by `backend/attendance/models.py:SchoolTimetable` and `TimetableSession`.
- **Documentation & Sign-off**: Progress and scope are tracked in `frontend/docs/ADMIN_DASHBOARD_PROGRESS.md`, evidencing completed modules and next milestones.

### 3.2 Teachers
- `TeacherDashboard.jsx` highlights today’s sessions, pending grading, and quick actions aligned with the UX blueprint (`frontend/docs/UX_madrasti_V2.md`).
- **Class & Schedule Management**: `TeacherMyClassesPage.jsx` and `TeacherMySchedulePage.jsx` consume timetable endpoints (`/api/attendance/timetable-sessions/`) to display rosters and weekly plans.
- **Attendance Workflow**: `TeacherAttendancePage.jsx` and `AttendanceHistoryPage.jsx` work with `AttendanceSession` and `AttendanceRecord` models. Teachers launch roll-calls from dashboard cards, mark statuses (present, late, absent), add notes, and submit. Conflict prevention and session state transitions live in backend validators.
- **Lesson Authoring**: `AddLessonPage.jsx`, `EditLessonPage.jsx`, and `LessonsPage.jsx` manage curriculum entries stored in `lessons.Lesson`. Teachers attach resources via `LessonResource` (Cloudinary-backed files, external links) and tag availability per class using `LessonAvailability`.
- **Exercises & Homework**: Dedicated flows (`LessonExercisesPage.jsx`, `LessonExerciseManagementPage.jsx`, `CreateLessonExercisePage.jsx`, `EditLessonExercisePage.jsx`, `CreateHomeworkPage.jsx`) build structured practice. Models such as `homework.Exercise`, `Question`, and `Homework` capture formats (QCM, open, mixed) with validation, auto-grading flags, and publish controls.
- **Assessment & Feedback**: `GradingPage.jsx`, `GradeSubmissionPage.jsx`, and `ViewHomeworkPage.jsx` allow rubric grading, inline feedback, re-open submissions, and trigger reward calculations via `HomeworkReward`.

### 3.3 Students
- `StudentDashboard.jsx` combines overview cards, assignments, progress charts, achievements, and attendance history. Components under `frontend/src/components/dashboard/student` render gamified stats sourced from homework and rewards endpoints.
- **Learning Space**: `StudentLessonsPage.jsx` and `StudentViewLessonPage.jsx` offer a lesson browser with progress indicators. Data comes from `Lesson` plus `homework.LessonProgress`, which aggregates exercise completions, accuracy, and time on task.
- **Homework Hub**: `StudentHomeworkPendingPage.jsx`, `StudentHomeworkWorkPage.jsx`, `StudentHomeworkCompletedPage.jsx`, `StudentHomeworkGradesPage.jsx`, and `StudentHomeworkFeedbackPage.jsx` cover the entire submission lifecycle: viewing instructions, working on exercises, uploading responses, checking scores, and reading teacher notes. The backend tracks attempts, auto-graded results, and manual grades through `ExerciseSubmission` and `SubmissionFeedback`.
- **Points & Rewards**: `StudentPointsPage.jsx` visualizes wallet balances, streaks, badges, and leaderboards sourced from `homework.StudentWallet`, `RewardTransaction`, and `BadgeAward`.
- **Attendance Awareness**: `StudentAttendanceReport.jsx` and `StudentAttendanceHistory.jsx` pull personal records, justifications, and flags from the attendance module, reinforcing accountability.

### 3.4 Parents & Guardians
- `ParentDashboard.jsx` offers child switching, alerts (absence, low grades), homework status, and upcoming payments (future module). Notifications are powered by `attendance.StudentParentRelation` and `AttendanceNotification`, ensuring the correct guardian receives SMS/Email/in-app alerts based on preferences.
- Planned features (communications, payments, transport tracking) follow the UX roadmap (`frontend/docs/UX_madrasti_V2.md`) and have API scaffolding ready in users and schools modules.

### 3.5 Operations & Drivers
- Staff users leverage the same admin toolset to manage rooms, assets, and schedules.
- Drivers authenticate with the `DRIVER` role defined in `users.User.Role`. Vehicle assignments, route manifests, and attendance integration are modeled in `schools.Vehicle`, `VehicleRoute`, and tied to timetables for future mobile workflows.

## 4. Academic Operations Engine
- **Academic Year Governance**: `schools.AcademicYear` enforces a single current year and maintains chronology. Admin pages support CRUD with date validation and status toggles.
- **Education Hierarchy**: Levels, grades, tracks, and classes (with sections, capacities, advisors) provide a canon for scheduling and enrollment. Constraints (ordering, unique codes) keep data consistent.
- **Room & Capacity Planning**: `schools.Room` stores types, capacities, equipment, and media galleries. Conflicts are avoided when attaching rooms to timetable sessions.
- **Transport & Safety**: Vehicles, routes, stops, and maintenance logs enable route planning, inspection history, fuel tracking (`VehicleMaintenanceRecord`, `GasoilRecord`) with attachments stored through the media service.
- **Equipment Inventory**: Track procurement, assignment, maintenance state, and associated media for instructional or administrative assets.

## 5. Learning Content & Resources
- `lessons.Lesson` captures subject, grade, cycle, difficulty, objectives, and prerequisites with multilingual titles.
- `LessonResource` provides ordered attachments (PDF, video, audio, document, link, exercise) stored in Cloudinary. Visibility flags and download controls manage student access.
- `LessonAvailability` publishes lessons to specific classes, enabling phased releases and differentiated instruction.
- Tagging (`LessonTag`, `LessonTagging`) supports discovery, filtering, and future recommendation features.

## 6. Homework, Assessment, and Mastery Tracking
- **Homework Model**: Each assignment ties to subject, grade, class, lesson, and teacher, with format selectors (mixed, QCM-only, open-ended, book exercises) and scheduling (publish, due, lock dates). Validation ensures viability (start before due, lock after due).
- **Reward Configuration**: `HomeworkReward` allows assignment-level incentives (completion, performance, timeliness) with multipliers for difficulty or weekend challenges.
- **Exercises & Questions**: The module supports question banks, randomized sets, penalty rules, and automated scoring. Teachers decide which exercises are required vs optional.
- **Submissions Lifecycle**: Students create submissions tying to exercises. Auto-grading updates scores immediately; teachers can override, annotate, attach feedback, or reopen attempts.
- **Lesson Progress Analytics**: `LessonProgress` recalculates completion, accuracy, best attempt scores, and time on task, feeding dashboards and notifying stakeholders when mastery is reached or intervention is needed.

## 7. Attendance & Compliance Suite
- **Scheduling Foundation**: `SchoolTimetable` and `TimetableSession` connect classes, teachers, subjects, rooms, and periods. The backend prevents conflicts (teacher double-booking, overlapping sessions) and enforces ordering.
- **Attendance Sessions**: For each timetable session, an `AttendanceSession` tracks state (not started, in progress, completed), timestamps, and operator. Teachers launch attendance per session and the system locks once submitted.
- **Attendance Records**: `AttendanceRecord` stores per-student status (present, late, absent, excused), timestamps, markers, and notes. Bulk operations and status cycling are exposed to the UI for rapid entry.
- **Flags & Interventions**: `StudentAbsenceFlag` and `AttendanceJustification` capture chronic absence alerts, justification uploads, and escalation actions. These artifacts feed dashboards and parent alerts.
- **Notifications**: `AttendanceNotification` logs delivery to parents with status transitions (pending, sent, delivered, read) and ties each message to the originating record or flag.

## 8. Engagement, Rewards, and Gamification
- **Global Settings**: `RewardSettings` on the school determines point ratios, penalties, leaderboard toggles, and coin conversion rates.
- **Wallets & Transactions**: `StudentWallet` aggregates lifetime, weekly, and monthly points, coins, gems, stars, experience, streaks, and achievements. `RewardTransaction` records every change with source linkage (homework, exercise).
- **Badges & Levels**: Badge definitions, awards, and history motivate sustained effort. Level titles derive from accumulated XP (beginner to legend tiers).
- **Leaderboards & Challenges**: Weekly reset options and challenge definitions encourage class competitions and celebrate top performers in the student dashboard.

## 9. Communication & Collaboration
- **In-App Messaging**: Notification infrastructure (JWT-secured WebSocket helpers, toast system in `frontend/src/App.jsx`) surfaces attendance alerts, grading updates, and announcements.
- **Email & SMS Hooks**: API documentation (`docs/API_DOCUMENTATION.md`) outlines templating, delivery channels, and rate limiting for parent communications and emergency alerts.
- **Announcements & Templates**: Admin roadmap allocates space for announcements, template management, and parent notification workflows under the Communications sidebar section.

## 10. Analytics, Reporting, and Exports
- **Dashboards**: Each persona landing page surfaces contextual analytics (student progress, teacher workload, admin KPIs). Components use charting primitives with textual fallbacks to meet accessibility goals.
- **Reports Pipeline**: Attendance reports, academic performance, financial dashboards, and comparative analytics are scoped in admin docs with route placeholders ready (`frontend/src/App.jsx` routes returning “Coming Soon” placeholders).
- **Data Integrity**: Audit fields (`created_at`, `updated_at`, `created_by`) across models plus soft-delete patterns (users, assignments) enable traceability and rollback.
- **Roadmap**: Custom report builders, MASSAR export alignment, and analytics expansions are tagged for future phases in both UX and admin progress documents.

## 11. Security, Localization, and Accessibility
- **Authentication & Authorization**: Custom user model (`users.User`) with email login, role enumeration, forced password change flag, and last-seen tracking. `ProtectedRoute` guards frontend paths, while DRF permissions enforce backend safety.
- **Internationalization**: Multilingual fields per entity (name/title/description in Arabic, French, English) and locale toggles in the frontend guarantee full translation coverage. RTL-specific styles (`frontend/src/styles/rtl.css`) and mirrored layouts ensure natural Arabic experiences.
- **Data Privacy & Audit**: Parent/student relationships and notification preferences respect consent. Attendance alerts and grading events are logged with timestamps and actors. JWT tokens rotate refresh secrets with configurable lifetimes.
- **Accessibility Commitments**: UX plan mandates WCAG AA contrast, keyboard operability, screen reader labels, reduced-motion settings, and voice-input readiness.

## 12. Delivery Status & Roadmap
- **Completed**:
  - Role-aware routing, authentication, theming, and translations.
  - Admin My School Management and Academic Management sections (staff, teachers, students, parents, rooms, academic years, levels, grades, classes, subjects, timetables) with live API integration (`frontend/docs/ADMIN_DASHBOARD_PROGRESS.md`).
  - Lesson management, resource libraries, and per-class publishing.
  - Homework creation, exercise banks, submission management, and gamified rewards.
  - Student homework workspace and lesson progress tracking.
  - Attendance scheduling, roll-call flow, parent notification pipeline.
- **In Progress / Next**:
  - Vehicles and equipment management UI polishing (structure implemented, final touches underway).
  - Education Management pages for advanced lesson analytics, assignments, exams, grading dashboards.
  - Reports & analytics visualizations, communications center, system settings.
  - Payments, transport live tracking, and mobile driver flows per UX phase plan (`frontend/docs/UX_madrasti_V2.md`).

## 13. Implementation Playbook
- **Development Standards**: ESLint, Prettier, Tailwind theme tokens, reusable UI primitives, and a component library documented in `docs/FRONTEND_DEVELOPMENT_ROADMAP.md.md`.
- **Testing Strategy**: Unit coverage across services and hooks, integration tests for critical flows, and planned E2E scripts for role journeys.
- **DevOps Path**: Staged environments (dev, staging, production), automated builds, manual production approval, and monitoring via Sentry and RUM tools once deployed.

## 14. Why Madrasti 2.0 Matters
- **Operational Excellence**: Centralizes every school process—enrollment, scheduling, attendance, assets—so leadership works from a single source of truth.
- **Instructional Impact**: Teachers gain lesson builders, smart homework, instant analytics, and attendance tools that save hours weekly.
- **Student Success**: Learners see clear paths, instant feedback, and motivation loops that reward effort and mastery.
- **Family Trust**: Parents stay informed in real time, can justify absences, and monitor progress without friction.
- **Future Proofing**: Modular architecture, documented APIs, and multilingual support make scaling across schools and regions straightforward.

## 15. Call to Action
- Approve the next sprint to finalize transport assets and education management analytics.
- Greenlight staging deployment for stakeholder walkthroughs and user testing.
- Align on rollout timeline (pilot school cohort, training schedule, support playbook) to bring Madrasti 2.0 into classrooms.

