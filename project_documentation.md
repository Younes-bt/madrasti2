# Madrasti 2 - Project Documentation

## 1. Project Overview
**Madrasti 2** is a comprehensive, multi-tenant (scalable for single or multiple school deployments) Education Management System (EMS) and Learning Management System (LMS) designed for Moroccan educational institutions. It provides a robust full-stack solution to manage school infrastructure, academic curriculums, student progression, and administrative tasks.

The system features a modular design with high emphasis on multilingual support (Arabic, French, English), real-time attendance tracking, interactive learning experiences, and a gamified reward system.

---

## 2. Technologies Used

### Backend (Django)
- **Framework**: Django 4.2+ with Django Rest Framework (DRF).
- **Database**: PostgreSQL (Production), SQLite (Development).
- **Authentication**: JWT (JSON Web Tokens) via `rest_framework_simplejwt`.
- **Media Storage**: Cloudinary (handled by `django-cloudinary-storage`).
- **Data Processing**: Pandas and Openpyxl for bulk data imports/exports.
- **API Documentation**: Swagger/OpenAPI.

### Frontend (React)
- **Framework**: React 18+ (Vite) with JavaScript/TypeScript.
- **Styling**: Tailwind CSS for responsive and modern UI.
- **UI Components**: Radix UI / Shadcn UI components.
- **Icons**: Lucide React.
- **Internationalization**: `i18next` for Arabic, French, and English support.
- **State Management**: React Context API (Auth, Theme, Lab, Lesson).
- **Logic**: Axios for API communication, React Router for navigation.

---

## 3. Core Features

### 3.1 Role-Based Access Control (RBAC)
The system supports multiple user roles with specific permissions and dashboards:
- **Admin**: Full system control (Infrastructure, Finance, User Management).
- **Supervisor/Staff**: Day-to-day administrative tasks, attendance monitoring.
- **Teacher**: Lesson creation, homework management, attendance taking, lab assignments.
- **Student**: Learning resources, practice, homework, lab tools, reward system.
- **Parent**: Monitoring children's attendance, grades, messages, and invoices.
- **Driver**: Vehicle management and route logs (optional context).

### 3.2 Learning Management System (LMS)
- **Interactive Lessons**: Support for Notion-style content blocks including text, math (LaTeX), SVG diagrams, interactive tables, images, and videos.
- **Resource Management**: Upload/attach PDFs, slides, and external links to lessons.
- **Multi-Cycle Curriculum**: Organized by cycles (First/Second) and subjects/grades.
- **Publication Control**: Teachers can selectively publish lessons to specific classes.

### 3.3 Assessment & Practice
- **Homework System**: Mandatory assignments with diverse question types:
    - QCM (Single/Multiple choice)
    - Fill-in-the-blanks
    - Matching and Ordering
    - Open-ended questions
- **Exercise Bank**: Lesson-linked practice exercises for students.
- **Automatic Grading**: Instant grading for objective questions (QCM, Fill-blank).

### 3.4 Gamification & Rewards
- **Points & Coins**: Earned by completing homework, exercises, and on-time submissions.
- **Badges & Achievements**: Visual rewards for milestones (e.g., Weekly Top Performer).
- **Leaderboards**: Grade-wide and class-wide rankings to encourage competition.
- **Student Wallet**: Tracking accumulated XP, rewards, and items.

### 3.5 School Operations
- **Infrastructure Management**: Track Rooms, Equipment, and school Vehicles (maintenance & fuel logs).
- **Timetables**: Class-specific schedules with teacher/room conflict detection.
- **Attendance**: Real-time session-based attendance taking with auto-notifications to parents via the absence flag system.
- **Finance**: Fee structures, automated invoicing, and payment record tracking.

### 3.6 Science Lab (Virtual Lab)
- Interactive simulation tools for **Mathematics, Physics, Chemistry, and Biology**.
- Ability for teachers to assign specific lab tasks and track student interaction analytics.

---

## 4. Workflows

### 4.1 Academic Setup Workflow
1. **Infrastructure**: Admin defines Rooms and Equipment.
2. **Structure**: Admin sets up Academic Years, Educational Levels, Grades, and Tracks.
3. **Curriculum**: Admin/Teachers define Subjects and link them to Grades.
4. **Classes**: Classes are created and assigned to specific Grades/Tracks/Years.
5. **Timetable**: Admin/Teachers create session-based schedules for each class.

### 4.2 Teaching & Learning Workflow
1. **Planning**: Teachers create Lessons and attach "Blocks" or "Markdown" content.
2. **Assigning**: Teachers create Homework assignments with deadlines.
3. **Engagement**: Students access lessons, perform lab activities, and submit homework.
4. **Feedback**: Teachers grade open-ended questions and provide manual feedback.
5. **Rewards**: The system automatically updates student wallets and leaderboards based on performance.

### 4.3 Attendance Tracking Workflow
1. **Taking Attendance**: Teacher opens the current session on their dashboard and marks attendance.
2. **Absence Flag**: If a student is absent, an "Absence Flag" is generated.
3. **Notification**: Parents are notified via the system.
4. **Clearance**: Admin/Supervisor clears the flag once a justification (medical certificate, etc.) is provided.

### 4.4 Data Management Workflow
- **Bulk Import**: Admin uses the `BulkImportJob` system to upload Students/Teachers from Excel templates.
- **Reports**: System generates analytics for attendance, financial status, and student performance.

---

## 5. Database Schema (Key Models)

### `users` App
- **User**: Custom user utilizing email as identifier. Roles: `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, `STAFF`, `DRIVER`.
- **Profile**: Detailed personal info, multi-lingual name, profile picture, and role-specific bio.
- **StudentEnrollment**: Links students to classes for specific academic years.
- **BulkImportJob**: Tracks status and results of Excel imports.

### `schools` App
- **School**: Singleton model for institutional configuration (contact, logo, director).
- **AcademicYear**: Manages periods (start/end dates) and identifies the current active year.
- **Grade & Track**: Hierarchical educational levels (e.g., Lycée -> 2nd Bac -> Math A).
- **SchoolClass**: Specific class groups (e.g., 2Bac-Math-A Group 1).
- **Room & Equipment**: Physical assets of the institution.
- **Subject & SubjectGrade**: Academic subjects with coefficient and weekly hour mappings per grade.

### `lessons` App
- **Lesson**: Core topic unit with cycle (1st/2nd) and metadata.
- **LessonResource**: Attachments and interactive content (Notion blocks/Markdown).
- **LessonAvailability**: Publication status of lessons per class.

### `homework` App
- **Homework & Exercise**: Assigned tasks vs practice topics.
- **Question & QuestionChoice**: Hierarchical structure for various question formats.
- **Submission**: Records student answers, timings, and scores.
- **Wallet & RewardTransaction**: Tracks the gamification economy.

### `attendance` App
- **SchoolTimetable & TimetableSession**: The schedule backbone.
- **AttendanceSession**: A specific calendar instance for taking attendance.
- **AttendanceRecord**: Individual student status (Present, Absent, Late, Excused).
- **StudentAbsenceFlag**: Tracking justifications for absences.

### `finance` App
- **FeeStructure**: Defines costs per Grade/Category.
- **Invoice & Payment**: Financial transactions for student fees.

### `lab` App
- **LabTool**: Virtual tools (e.g., Graphing calculator, Chemical periodic table).
- **LabUsage & Analytics**: Tracking how tools are used by students.

---

## 6. Project Structure Overview
```text
madrasti2/
├── backend/                # Django Project
│   ├── madrasti/           # Core settings and URLs
│   ├── users/              # Auth and profiles
│   ├── schools/            # Educational structure & assets
│   ├── lessons/            # LMS core
│   ├── homework/           # Assessment & Gamification
│   ├── attendance/         # Timetable & Absence tracking
│   ├── lab/                # Virtual lab tools
│   ├── finance/            # Invoicing & Payments
│   └── communication/      # Messaging & Announcements
├── frontend/               # React Project
│   ├── src/
│   │   ├── components/     # UI shared components
│   │   ├── contexts/       # Global state (Auth, Theme)
│   │   ├── pages/          # Role-based views (admin, student, etc)
│   │   ├── services/       # API integration
│   │   └── locales/        # i18n JSON files (ar, fr, en)
│   └── tailwind.config.js  # Styling configuration
└── docs/                   # Additional guides and specs
```
