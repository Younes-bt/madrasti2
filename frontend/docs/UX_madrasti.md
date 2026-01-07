### **Madrasti 2.0 User Experience (UX) Design Overview (Version 1.2)**

#### **Changelog from Version 1.1**
- Added brief examples to Workflow Focus sections for better vividness (e.g., anomaly alerts in Admin Dashboard).
- Noted hypothetical endpoints in Driver Role as "proposed" and suggested integration with existing Attendance APIs.
- Incorporated quantifiable metrics in Key UX Principles (e.g., task completion times).
- Enhanced Accessibility principle with explicit mentions of voice-over support and high-contrast alerts.
- Preserved all previous updates while ensuring consistency.

Based on the provided API documentation, this document outlines a comprehensive User Experience (UX) for the Madrasti 2.0 platform. This is designed as a web-based educational management system (assuming a responsive web app for desktop and mobile, with potential for native apps). The UX focuses on intuitive navigation, role-based personalization, accessibility (e.g., multilingual support for English, Arabic, French), and real-time features (e.g., notifications via WebSockets).

The app uses a clean, modern interface with a sidebar navigation, top header (for user profile, notifications, and logout), and main content area. Colors are school-themed (e.g., blue for primary actions, red for alerts). All interactions are secured with JWT authentication, and errors (e.g., validation, permissions) are handled with user-friendly modals or toasts.

### **Key UX Principles**

*   **Role-Based Customization:** Dashboards and menus adapt to the user's role (Admin, Teacher, Student, Parent, Staff, Driver).
*   **Proactive & Guided Workflows:** The interface anticipates user needs, guiding them through tasks with clear calls-to-action, smart suggestions, and helpful onboarding for new users or empty sections. Aim for key tasks (e.g., starting attendance) to complete in <30 seconds via proactive buttons.
*   **Multilingual Support:** Users can switch languages via profile settings; fields like titles show in the preferred language.
*   **Real-Time Updates:** Notifications for attendance, grades, etc., appear in a bell icon or push alerts.
*   **Accessibility:** High contrast, keyboard navigation, screen-reader friendly, with voice-over support for empty states/guided tours and high-contrast alerts for anomalies/errors.
*   **Pagination & Search:** Lists (e.g., assignments) include search bars, filters, and infinite scroll where appropriate.
*   **File Handling:** Uploads use drag-and-drop with progress bars, integrated with Cloudinary.
*   **Error Handling:** Friendly messages (e.g., "Invalid credentials - please try again") with links to reset password.
*   **Mobile Responsiveness:** Sidebar collapses into a hamburger menu on mobile.

Below, the full UX flow is described, starting from login, then role-specific experiences. Each section includes key screens, interactions, and API mappings.

---

### **1. Authentication & Onboarding UX**

**Login Screen**
*   **URL:** `/login`
*   **Layout:** Centered form with school logo (fetched from `/api/schools/config/`). Fields: Email, Password. Buttons: "Login", "Forgot Password?", "Register (for new users)".
*   **Flow:**
    *   User enters credentials → API: `POST /api/users/login/` → Success: Stores access/refresh tokens in local storage, fetches user profile (`GET /api/users/profile/`), redirects to role-based dashboard.
    *   Error: Toast with details (e.g., "Invalid credentials" from 400 response).
    *   Token refresh: Automatically handled in background every 10 minutes via `POST /api/token/refresh/`.
*   **Forgot Password:** Modal opens → Enter email → API: `POST /api/users/password-reset/` → Success: "Reset link sent" toast.
*   **Registration (for self-onboarding, e.g., students/parents):** Link to `/register` → Form with fields from User Model (email, password, first/last name, role, phone, DOB) → API: `POST /api/users/register/` → Success: Auto-login and redirect.

**Profile Management (Shared Across Roles)**
*   Accessible via top header avatar dropdown → "My Profile".
*   **Screen:** Form with editable fields (e.g., phone, address, bio, profile picture upload).
    *   Profile picture: Drag-and-drop uploader → API: Get signature from `POST /api/files/upload-signature/`, upload to Cloudinary, then `PATCH /api/users/profile/` with public_id.
*   **Change Password:** Separate modal → API: `POST /api/users/change-password/`.
*   **Notifications:** Bell icon shows unread count → Dropdown list of real-time alerts (e.g., "New assignment graded") via WebSocket.
**Logout:** Header dropdown → "Logout" → Clears tokens, redirects to login.

---

### **2. Admin Role UX**

Admins have full access. Dashboard emphasizes system management.

**Dashboard Screen**
*   **URL:** `/admin/dashboard`
*   **Workflow Focus:** Provide a high-level "health check" of the entire system. The admin's primary goal is to monitor activity, spot anomalies (e.g., a sudden drop in attendance shown via a red alert card if below 80%), and access management sections quickly.
*   **Layout:** Overview cards (e.g., Total Users, Active Schools, Attendance Rate). Charts for analytics (e.g., weekly absences from `/api/attendance/reports/weekly_summary/`).
*   **Navigation Sidebar:** Users, Schools, Lessons, Homework, Attendance, Reports, Settings.

**Users Management**
*   **List Screen:** `/admin/users` → Table with search/filter (by role, active status) → API: `GET /api/users/` (paginated).
*   **Empty State:** If no users exist, the screen displays a welcoming message and a prominent "Create First User" button, guiding the admin to populate the system.
*   **Actions:** View/Edit/Delete → Modals for edits (`PUT /api/users/{id}/`).
*   **Bulk actions:** Select multiple → Bulk update/delete.
*   **Create User:** Button → Form modal → API: `POST /api/users/register/` (admin can create any role).

**Schools Management**
*   **Config Screen:** `/admin/schools/config` → Form to edit school details (name, logo, etc.) → API: `PUT /api/schools/config/`.
*   **Academic Structure:**
    *   **Guided Setup:** The interface presents this as a guided flow. For a new school, it prompts: "1. Set Academic Years," then "2. Define Educational Levels," ensuring a logical setup process.
    *   Academic Years: List/create/edit → API: `/api/schools/academic-years/` (if implemented).
    *   Levels/Grades/Classes/Subjects/Rooms: Dedicated screens with lists, forms for CRUD → APIs: `/api/schools/levels/`, `/api/schools/grades/`, etc.
        *   Example: Classes list → Filter by grade/year → Enroll students via `/api/schools/classes/{id}/enroll/`.
*   **Timetables:** Create/edit weekly schedules → Drag-and-drop interface for sessions → APIs: `/api/attendance/timetables/`, `/api/attendance/timetable-sessions/`.

**Lessons & Homework**
*   Full CRUD for lessons/resources (`/api/lessons/lessons/`, `/api/lessons/resources/`).
*   Assignments: Create with question builder (add QCM, open-ended) → Publish → Analytics view.

**Attendance & Reports**
*   Monitor sessions, resolve flags (`/api/attendance/absence-flags/`).
*   Generate reports (daily/weekly) → Export to PDF/CSV.

**Settings**
*   Manage permissions, API health check (`/api/health/`).

---

### **3. Teacher Role UX**

Teachers focus on class management, assignments, and attendance.

**Dashboard Screen**
*   **URL:** `/teacher/dashboard`
*   **Workflow Focus:** Answer the teacher's immediate question: "What do I need to do right now?" The dashboard is proactive. If a class starts in 5 minutes, a large button appears: "Start Attendance for Math 5A". For anomalies, show a yellow alert if >20% of submissions are overdue.
*   **Layout:** Cards for today's sessions (from `/api/attendance/timetable-sessions/today_sessions/`), upcoming assignments, and a feed of recent submissions needing grading.
*   **Navigation Sidebar:** My Classes, Lessons, Assignments, Attendance, Students, Reports.

**My Classes**
*   List of assigned classes (`/api/schools/classes/?class_teacher=me`).
*   Per class: View students (`/api/schools/classes/{id}/students/`), timetable.

**Lessons Management**
*   **List Screen:** `/teacher/lessons` → Filter by subject/grade → API: `GET /api/lessons/lessons/`.
*   **Empty State:** For new teachers, this screen shows an encouraging message: "Create your first lesson to engage your students!" with a clear "Create Lesson" button.
*   **Create/Edit Lesson:** Form with rich text editor for content, add resources (upload files) → API: `POST /api/lessons/lessons/`, nested resources.
*   **Integrated Actions:** After saving a lesson, the UI presents a modal: "Lesson Saved! What's next?" with buttons for "Create a Follow-up Assignment," "Add to Timetable," or "Return to Lessons."
*   **Actions:** Publish (`/api/lessons/lessons/{id}/publish/`), view analytics.

**Assignments (Homework)**
*   **List Screen:** `/teacher/assignments` → Filter by class/due date → API: `GET /api/homework/assignments/`.
*   **Create Assignment:** Stepper wizard:
    1.  Details (title, due date, classes).
    2.  Add questions (QCM builder with choices, open-ended text).
    3.  Settings (time limit, attempts).
    *   API: `POST /api/homework/assignments/`, then bulk questions.
*   **Grade Submissions:** View list (`/api/homework/assignments/{id}/submissions/`), auto-graded shown, manual grading modal for open-ended → `PATCH /api/homework/submissions/{id}/` (add feedback, score).
*   **Analytics:** Per assignment charts (`/api/homework/assignments/{id}/analytics/`).

**Attendance**
*   **Today's Sessions:** List with "Start Session" button → API: `POST /api/attendance/sessions/{id}/start/`.
*   **Mark Attendance:** In-session screen → Student list with toggles (present/absent/late) → Bulk mark → API: `POST /api/attendance/sessions/{id}/bulk_mark/`.
*   **Complete session** → Notifications sent automatically.
*   View records/flags (`/api/attendance/records/`, `/api/attendance/absence-flags/`).

**Students & Reports**
*   View class students, their submissions, attendance history.
*   Generate reports (e.g., student history from `/api/attendance/reports/student_history/`).
**Real-Time:** WebSocket alerts for student submissions.

---

### **4. Student Role UX**

Students have limited, personal access.

**Dashboard Screen**
*   **URL:** `/student/dashboard`
*   **Workflow Focus:** Prioritize the student's immediate tasks and achievements. The layout clearly separates what is due soon from recent accomplishments to reduce anxiety and boost motivation. For anomalies, show a gentle reminder if attendance is low (e.g., "You've missed 2 classes this week—check your records").
*   **Empty State:** For a new student, the dashboard says, "Welcome! Your assignments will appear here. For now, check out your schedule."
*   **Layout:** Cards for today's classes, pending assignments, rewards (points/badges from `/api/homework/student-wallets/`).
*   **Navigation Sidebar:** My Schedule, Lessons, Assignments, Attendance, Rewards, Profile.

**My Schedule**
*   Weekly timetable view (`/api/attendance/timetable-sessions/weekly_schedule/`).
*   Today's sessions with join buttons (if virtual).

**Lessons**
*   View assigned lessons (`/api/lessons/lessons/?grade=my_grade&subject=all`), read content, download resources.

**Assignments**
*   **List Screen:** Pending/completed → API: `GET /api/homework/assignments/?status=published&classes=my_classes`.
*   **Submit Assignment:** Timer-based quiz interface (QCM radio buttons, text inputs) → Save draft → Submit → API: `POST /api/homework/submissions/`, then `/api/homework/submissions/{id}/submit/`.
*   View grades/feedback once published.

**Attendance**
*   View own records (`/api/attendance/records/?student=me`), calendar view with statuses.

**Rewards**
*   Wallet overview (points, badges) → Leaderboard (`/api/homework/leaderboards/`).
*   Transactions history (`/api/homework/reward-transactions/`).
**Real-Time:** Alerts for new assignments, grades.

---

### **5. Parent Role UX**

Parents monitor children's data.

**Dashboard Screen**
*   **URL:** `/parent/dashboard`
*   **Workflow Focus:** Enable parents to get a quick, reassuring overview of their child's day. Key alerts (absences, low grades) are surfaced prominently to require immediate attention (e.g., red badge for unresolved absence flags).
*   **Layout:** Per-child cards (attendance today, pending assignments, recent grades). A dropdown allows switching between children if multiple are enrolled.
*   **Navigation Sidebar:** My Children, Attendance, Assignments, Reports, Notifications.

**My Children**
*   List of linked children (from permissions) → Switch between them.

**Attendance**
*   View child's records/flags (`/api/attendance/records/?student=child_id`), resolve flags with uploads (`/api/attendance/absence-flags/{id}/resolve/`).

**Assignments**
*   View child's assignments/submissions (`/api/homework/assignments/?classes=child_classes`).

**Reports & Notifications**
*   Child's history reports.
*   Unread notifications list (`/api/attendance/notifications/unread/`), mark read.
**Real-Time:** Immediate alerts for absences.

---

### **6. Staff Role UX**

Staff handle administrative tasks, similar to Admin but with limited permissions.

**Dashboard**
*   **Workflow Focus:** The dashboard is a task-list, tailored to the staff member's permissions (e.g., an admissions officer sees new enrollments; an attendance officer sees unresolved absence flags). For anomalies, highlight urgent items (e.g., "5 flags pending resolution").
*   Overview of relevant modules (school config, users, reports).
*   Manage enrollments (`/api/attendance/enrollments/`), resolve flags, generate reports.
*   Access to schools/academic structure CRUD (per permissions).

---

### **7. Driver Role UX**

Limited to transportation; UX is mobile-first and task-oriented.

**Dashboard (Mobile App View)**
*   **URL:** `/driver/dashboard`
*   **Workflow Focus:** Provide the driver with exactly what they need for their current route, ensuring safety and efficiency. No clutter.
*   **Layout:** A large card showing the "Current/Next Route" (e.g., "Morning Route - 7:30 AM"). Buttons for "Start Route" and "View Student List". A simple map view showing the route.
*   **Student List:**
    *   A scrollable list of students for the active route. Each entry shows the student's name, photo, and pickup/drop-off status.
    *   API: Proposed endpoint like `/api/transport/routes/{id}/students/` (or integrate with existing `/api/attendance/enrollments/` for bus-specific groups).
*   **Attendance:**
    *   Simple check-in/check-out buttons next to each student's name.
    *   This action marks bus attendance, potentially creating a specific record via a proposed endpoint like `POST /api/transport/attendance/` (or adapt `/api/attendance/sessions/` for bus sessions).
*   **Real-Time:**
    *   "Start Route" button triggers real-time location sharing (via WebSockets) visible to parents and school admins.
    *   Parents receive push notifications: "Sara's bus is 10 minutes away."

---

### **Additional Shared UX Features**

*   **Search Bar:** Global search in the header for resources (lessons, assignments), users, etc.
*   **Notifications Center:** Full page (`/notifications`) for all alerts, with filtering by type.
*   **Reports Hub:** Centralized page (`/reports`) for all roles to generate and export relevant reports.
*   **Onboarding Tour:** A guided, first-login wizard (using a library like Shepherd.js) explains the key features of the user's specific dashboard.
*   **Offline Support:** Basic functionality (e.g., drafting submissions, viewing cached lessons) via service workers.
*   **Security:** Auto-logout after inactivity, optional Two-Factor Authentication (2FA) in profile settings.

This UX design fully leverages the API, ensuring seamless integration. For wireframes or further details, contact the development team.

**Last Updated:** September 02, 2025  
**Version:** 1.2