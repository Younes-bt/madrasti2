Of course. Here is a more structured breakdown of the Madrasti 2.0 platform, organized by user role and screen. This format is designed to be a direct blueprint for a UI/UX designer, detailing the purpose, components, and data sources for each view.

***

# Madrasti 2.0 - UI/UX Design Blueprint

This document translates the API documentation and UX journeys into a concrete, screen-by-screen structure for UI design and implementation.

## 1. Global UI Elements (Persistent Across All Roles)

These components form the main application shell.

### 1.1. Main Application Header
*   **Purpose:** Provides consistent navigation and access to user-specific actions.
*   **Components:**
    *   **Menu Icon (Mobile):** Toggles the sidebar visibility.
    *   **Platform Logo:** "Madrasti 2.0".
    *   **Notification Center Icon:** A bell icon with a badge for unread notifications. Clicking opens a dropdown list of recent notifications.
        *   *API:* `GET /api/attendance/notifications/unread/` for the count; `GET /api/attendance/notifications/` for the list.
    *   **User Profile Dropdown:** Shows user's `profile_picture_url` and `full_name`. Clicking reveals links to "My Profile" and a "Logout" button.
        *   *API:* Uses user data from the initial `/api/users/login/` response.

### 1.2. Main Navigation (Sidebar)
*   **Purpose:** Role-based primary navigation. The items listed are dynamic based on the user's role.
*   **Components:**
    *   Collapsible menu with icons and text labels.
    *   Active link highlighting for the current page.
    *   **Menu Items (Example for Teacher):** Dashboard, My Classes, Lessons, Homework, Attendance.

## 2. Admin Role - Interface Breakdown

### 2.1. Page: Dashboard
*   **Purpose:** Provide system-wide overview and quick access to administrative functions.
*   **Primary API Endpoint(s):**
    *   `GET /api/schools/analytics/overview/`
    *   `GET /api/users/stats/`
    *   `GET /api/attendance/reports/school_summary/`
    *   `GET /api/homework/analytics/school_performance/`
*   **Key Components:**
    *   **Welcome Header:** "Welcome, [Admin Name] - System Administrator"
    *   **Widget: System Overview:**
        *   Key metrics cards showing total users (staff, teachers, students, parents)
        *   Active sessions count and school-wide attendance rate
        *   System health indicators and alerts
    *   **Widget: Recent Activity:**
        *   Recent user registrations and account activations
        *   Latest assignments created and submissions received
        *   Recent attendance flags requiring attention
    *   **Widget: Quick Actions:**
        *   "Create User Account" button with role selection dropdown
        *   "Generate Report" button for common administrative reports
        *   "System Settings" link for configuration access

### 2.2. Module: User Management

#### 2.2.1. Page: Users Overview
*   **Purpose:** Comprehensive user management interface for all system roles.
*   **Primary API Endpoint(s):** `GET /api/users/` with role-based filtering
*   **Key Components:**
    *   **Header:** Page title "User Management" and "Create New User" primary button
    *   **Filter & Search Bar:**
        *   Search input (`search=...`) for names, emails, or user IDs
        *   Dropdowns to filter by `role` (Staff, Teacher, Student, Parent), `status` (Active, Inactive), and `grade/class`
        *   Date range picker for account creation dates
    *   **Users Table:**
        *   Columns: Profile Picture, Full Name, Email, Role, Status, Last Login, Actions
        *   Sortable columns and bulk selection for mass operations
        *   Action buttons (kebab menu) for "View Profile," "Edit," "Deactivate/Activate," "Reset Password"
    *   **Pagination Controls:** Standard pagination with page size options

#### 2.2.2. View: Create User Form (Modal or Page)
*   **Purpose:** Step-by-step user account creation with role-specific fields.
*   **Primary API Endpoint(s):** `POST /api/users/create/` with role-specific data
*   **Key Components:**
    *   **Step 1: Basic Information:**
        *   Form fields for `first_name`, `last_name`, `email`, `phone_number`
        *   Role selection dropdown (Staff, Teacher, Student, Parent) with dynamic form updates
        *   Profile picture upload with preview
    *   **Step 2: Role-Specific Details:**
        *   **For Teachers:** Subject specializations, qualifications, employee ID
        *   **For Students:** Student ID, grade, class assignment, parent linking
        *   **For Parents:** Children linking (multi-select from existing students)
        *   **For Staff:** Department, position, permissions level
    *   **Step 3: Account Settings:**
        *   Password generation options (auto-generate or manual entry)
        *   Account status (Active/Inactive)
        *   Email notification preferences

#### 2.2.3. Page: User Profile Management
*   **Purpose:** Detailed view and editing of individual user accounts.
*   **Primary API Endpoint(s):** `GET /api/users/{id}/`, `PATCH /api/users/{id}/`
*   **Key Components:**
    *   **Profile Header:** User's photo, name, role badge, and status indicator
    *   **Tabbed Interface:**
        *   **Tab 1: Personal Info:** Editable personal details and contact information
        *   **Tab 2: Academic/Professional:** Role-specific information (classes, subjects, children)
        *   **Tab 3: Activity Log:** Login history, recent actions, and system interactions
        *   **Tab 4: Permissions:** Role-based access controls and special permissions
    *   **Action Bar:** Save Changes, Reset Password, Send Welcome Email, Deactivate Account

### 2.3. Module: School Structure Management

#### 2.3.1. Page: Academic Setup
*   **Purpose:** Configure the school's academic structure and organizational hierarchy.
*   **Primary API Endpoint(s):** `GET /api/schools/structure/`, `POST /api/schools/grades/`, `POST /api/schools/classes/`
*   **Key Components:**
    *   **Academic Years Section:**
        *   Current academic year display with start/end dates
        *   "Create New Academic Year" button with date range picker
        *   Archive/activate academic years functionality
    *   **Grades & Classes Section:**
        *   Hierarchical view: Grade → Classes → Students count
        *   "Add Grade" and "Add Class" buttons with capacity settings
        *   Drag-and-drop reordering and bulk operations
    *   **Subjects Management:**
        *   Subject list with curriculum codes and descriptions
        *   Teacher assignment to subjects with specialization levels
        *   Subject scheduling and classroom allocation

#### 2.3.2. Page: Timetable & Scheduling
*   **Purpose:** Manage school-wide schedules and session planning.
*   **Primary API Endpoint(s):** `GET /api/attendance/timetable-sessions/`, `POST /api/attendance/bulk_create_sessions/`
*   **Key Components:**
    *   **Weekly Calendar Grid:**
        *   Time slots (rows) vs. Days (columns) layout
        *   Color-coded sessions by subject or teacher
        *   Drag-and-drop session rescheduling
    *   **Bulk Operations Panel:**
        *   "Generate Weekly Schedule" with template selection
        *   "Copy Schedule" to duplicate across weeks/classes
        *   Session conflict detection and resolution suggestions
    *   **Resource Management:**
        *   Classroom availability and capacity tracking
        *   Teacher schedule conflicts and availability
        *   Special events and holiday scheduling

### 2.4. Module: Reports & Analytics

#### 2.4.1. Page: System Analytics Dashboard
*   **Purpose:** Comprehensive reporting and data visualization for school performance.
*   **Primary API Endpoint(s):** `GET /api/reports/analytics/`, `GET /api/reports/custom/`
*   **Key Components:**
    *   **Performance Overview:**
        *   School-wide attendance rates with trend analysis
        *   Academic performance metrics by grade and subject
        *   User engagement statistics (login frequency, feature usage)
    *   **Interactive Charts:**
        *   Attendance patterns over time with drill-down capabilities
        *   Assignment completion rates and grade distributions
        *   Parent engagement and communication metrics
    *   **Custom Report Builder:**
        *   Drag-and-drop report creation with field selection
        *   Date range filters and grouping options
        *   Export functionality (PDF, Excel, CSV)

#### 2.4.2. Page: Attendance Management
*   **Purpose:** School-wide attendance oversight and flag management.
*   **Primary API Endpoint(s):** `GET /api/attendance/flags/`, `GET /api/attendance/reports/summary/`
*   **Key Components:**
    *   **Attendance Flags Dashboard:**
        *   Urgent flags requiring immediate attention (highlighted)
        *   Flag categories (Unexcused Absence, Chronic Tardiness, Pattern Concerns)
        *   Bulk flag resolution with reason codes
    *   **Live Attendance Monitoring:**
        *   Real-time view of active sessions and attendance taking
        *   Teachers who haven't submitted attendance (alerts)
        *   Class-by-class attendance summary with anomaly detection

### 2.5. Module: System Configuration

#### 2.5.1. Page: School Settings
*   **Purpose:** Configure school-wide policies and system parameters.
*   **Primary API Endpoint(s):** `GET /api/schools/settings/`, `PATCH /api/schools/settings/`
*   **Key Components:**
    *   **School Information:**
        *   School name, logo, contact details
        *   Academic calendar and important dates
        *   School policies and attendance rules
    *   **System Preferences:**
        *   Default language and timezone settings
        *   Notification preferences and email templates
        *   Grading scales and performance thresholds
    *   **Security Settings:**
        *   Password policies and session timeouts
        *   Two-factor authentication requirements
        *   Data retention and privacy settings

#### 2.5.2. Page: Notification Center
*   **Purpose:** Manage system-wide communications and alerts.
*   **Primary API Endpoint(s):** `GET /api/notifications/admin/`, `POST /api/notifications/broadcast/`
*   **Key Components:**
    *   **Broadcast Messages:**
        *   Create school-wide announcements with role targeting
        *   Schedule notifications for future delivery
        *   Message templates for common announcements
    *   **Alert Management:**
        *   System alert configuration (attendance, performance, technical)
        *   Escalation rules and recipient management
        *   Alert history and delivery confirmation tracking

## 3. Teacher Role - Interface Breakdown

### 3.1. Page: Dashboard
*   **Purpose:** Provide an at-a-glance summary of the teacher's current day and pending tasks.
*   **Primary API Endpoint(s):**
    *   `GET /api/attendance/timetable-sessions/today_sessions/`
    *   `GET /api/homework/assignments/?created_by=self&status=published`
    *   `GET /api/homework/submissions/?assignment__teacher=self&status=submitted`
*   **Key Components:**
    *   **Welcome Header:** "Welcome back, [Teacher's Full Name]!"
    *   **Widget: Today's Schedule:**
        *   A vertical timeline or list of today's sessions.
        *   Each item shows `start_time`, `end_time`, `subject`, `class`, and `room`.
        *   A prominent "Take Attendance" button on the current or upcoming session. The button should be disabled for past sessions.
    *   **Widget: Assignments to Grade:**
        *   A list of assignments with pending submissions.
        *   Each item shows the assignment `title`, `class_names`, and `submissions_count`.
        *   Clicking an item navigates to the Assignment Grading Page.
    *   **Widget: Recent Attendance Flags:**
        *   A feed of recent, unresolved absence flags for the teacher's students.
        *   Each item shows the student's name, the date of absence, and the flag's priority.

### 3.2. Module: Homework

#### 3.2.1. Page: Assignments List
*   **Purpose:** View, manage, and create homework assignments.
*   **Primary API Endpoint(s):** `GET /api/homework/assignments/`
*   **Key Components:**
    *   **Header:** Page title "Homework" and a "Create New Assignment" primary button.
    *   **Filter & Search Bar:**
        *   Search input (`search=...`).
        *   Dropdowns to filter by `grade`, `class`, and `status` (Draft, Published, Archived).
    *   **Assignments Table/Grid:**
        *   Each row/card displays `title`, `due_date`, `class_names`, `status`, and `submissions_count`.
        *   Action buttons (kebab menu) for "Edit," "View Submissions," "Duplicate," and "Delete."
    *   **Pagination Controls:** (`page=...`, `page_size=...`).
*   **States to Consider:**
    *   **Empty State:** A message and illustration encouraging the teacher to create their first assignment.

#### 3.2.2. View: Create/Edit Assignment Form (Page or Modal)
*   **Purpose:** A step-by-step wizard to create or modify an assignment's core details.
*   **Primary API Endpoint(s):** `POST /api/homework/assignments/` or `PATCH /api/homework/assignments/{id}/`
*   **Key Components:**
    *   **Step 1: Details:**
        *   Form fields for `title`, `description`, `instructions`, `due_date` (date-time picker), `assignment_type` (dropdown).
        *   Multi-select dropdowns for `subject`, `grade`, and `classes`. These are populated by `GET /api/schools/subjects/`, etc.
    *   **Step 2: Settings:**
        *   Toggles/inputs for `time_limit`, `max_attempts`, `allow_late_submission`, `shuffle_questions`.
    *   **Wizard Navigation:** "Save & Continue" and "Back" buttons.

#### 3.2.3. Page: Question Builder
*   **Purpose:** Add and manage questions for a specific assignment.
*   **Primary API Endpoint(s):** `POST /api/homework/questions/bulk_create/`
*   **Key Components:**
    *   **Assignment Header:** Displays the assignment title and a "Publish" button.
    *   **Question List:** A list of existing questions, showing `question_text`, `question_type`, and `points`. Allows for reordering (drag-and-drop).
    *   **"Add Question" Component:**
        *   A form that allows the teacher to select a `question_type` (QCM, True/False, etc.).
        *   The form fields dynamically change based on the selected type (e.g., QCM shows fields for choices and a radio/checkbox to mark the correct one).
        *   Input for `points` and `explanation`.

#### 3.2.4. Page: Assignment Grading
*   **Purpose:** To review student submissions, provide feedback, and assign grades.
*   **Primary API Endpoint(s):** `GET /api/homework/assignments/{id}/submissions/`, `PATCH /api/homework/submissions/{id}/`
*   **Key Components:**
    *   **Two-Panel Layout:**
        *   **Left Panel (Submission List):** A list of students who have submitted. Each item shows `student_name`, `submitted_at` time, `is_late` status, and auto-calculated `score`. A "Needs Grading" badge for open-ended questions.
        *   **Right Panel (Grading Canvas):** Displays the selected student's answers. For open-ended questions, provides a `feedback` text area and an input for `manual_score`.
    *   **Action Bar:** "Publish Grade" button to release the feedback and score to the student.

### 3.3. Module: Attendance

#### 3.3.1. Page: Attendance Roster
*   **Purpose:** To quickly mark attendance for an active class session.
*   **Primary API Endpoint(s):** `POST /api/attendance/sessions/{id}/start/`, `POST /api/attendance/sessions/{id}/bulk_mark/`
*   **Key Components:**
    *   **Session Header:** Displays Class Name, Subject, and current time. Includes a "Mark All Present" button.
    *   **Student Grid/List:**
        *   Each item is a card with the student's `profile_picture_url` and `student_name`.
        *   A set of status buttons: "Present," "Absent," "Late." The selected state should be visually distinct.
    *   **Modal for Absence/Lateness:** A small modal that appears when "Absent" or "Late" is clicked, allowing the teacher to add `notes` or an `absence_reason`.
    *   **Footer Action Bar:** A "Complete & Submit" button that becomes active once all students are marked.

## 4. Student Role - Interface Breakdown

### 4.1. Page: Dashboard
*   **Purpose:** Central hub for the student to see their immediate priorities and progress.
*   **Primary API Endpoint(s):** `GET /api/homework/assignments/?status=published`, `GET /api/homework/submissions/?student=self`, `GET /api/homework/student-wallets/self/`
*   **Key Components:**
    *   **Widget: Upcoming Homework:**
        *   A list of active assignments, sorted by the nearest `due_date`.
        *   Each item shows `title`, `subject_name`, and a countdown ("Due in 2 days").
        *   A "Start" or "Continue" button.
    *   **Widget: Recently Graded:**
        *   A list of the student's most recently graded submissions.
        *   Shows `assignment_title`, `score_percentage`, and a link to "View Results."
    *   **Widget: My Rewards:**
        *   A visual summary of the `student-wallet`.
        *   Displays `available_points`, `level`, and a progress bar for `level_progress`.

### 4.2. Module: Homework

#### 4.2.1. Page: Homework "Player"
*   **Purpose:** A focused, distraction-free environment for completing an assignment.
*   **Primary API Endpoint(s):** `GET /api/homework/assignments/{id}/` (to get questions), `PATCH /api/homework/submissions/{id}/` (to save progress)
*   **Key Components:**
    *   **Header:** Displays assignment `title`, `time_limit` (if any, as a countdown timer), and a progress indicator ("Question 5 of 20").
    *   **Question Area:** A clean display of the current `question_text` and associated image.
    *   **Answer Component:**
        *   Dynamically renders based on `question_type` (e.g., radio buttons for `QCM_SINGLE`, text area for `OPEN_LONG`).
    *   **Navigation Footer:** "Previous Question" and "Next Question" buttons. A "Review & Submit" button on the final question.

#### 4.2.2. Page: Assignment Results
*   **Purpose:** To provide clear, engaging feedback on a submitted assignment.
*   **Primary API Endpoint(s):** `GET /api/homework/submissions/{id}/`
*   **Key Components:**
    *   **Results Header:** A large, celebratory display of the final `score_percentage`.
    *   **Rewards Section:** A visual component showing any `rewards_earned` (points, coins, badges).
    *   **Review Answers Section:** A list of all questions, showing the student's answer, the correct answer, and the teacher's `explanation`. Incorrect answers should be clearly highlighted.
    *   **Teacher Feedback:** A dedicated section to display the teacher's `feedback` text.

### 4.3. Page: Rewards Hub
*   **Purpose:** A gamified space for students to track their overall progress and achievements.
*   **Primary API Endpoint(s):** `GET /api/homework/student-wallets/self/`, `GET /api/homework/badges/`, `GET /api/homework/leaderboards/`
*   **Key Components:**
    *   **Tabbed Interface:**
        *   **Tab 1: Wallet & Level:** Contains the detailed view of the student's wallet and level progress.
        *   **Tab 2: Badges:** A gallery of all available badges. Earned badges are in full color; unearned ones are greyed out. Hovering over a badge reveals its `description` and `requirements`.
        *   **Tab 3: Leaderboards:** A ranked list of students. A dropdown allows filtering by `CLASS`, `GRADE`, and `SUBJECT`, and time period (`WEEKLY`, `MONTHLY`). The current student's entry should be highlighted.

## 5. Parent Role - Interface Breakdown

### 5.1. Page: Dashboard / Child Hub
*   **Purpose:** To provide a comprehensive overview of a child's school life.
*   **Primary API Endpoint(s):** `GET /api/attendance/reports/student_history/`, `GET /api/homework/submissions/?student={child_id}`
*   **Key Components:**
    *   **Child Selector:** A prominent dropdown at the top of the page to switch between children (if more than one is linked to the parent's account). All data on the page re-loads when the selection changes.
    *   **Widget: Today's Attendance:** A simple, clear status: "Present," "Late for Math," or "Absent."
    *   **Widget: Overdue & Upcoming Homework:** A combined list of assignments that are past their `due_date` (highlighted in red) and those due soon.
    *   **Widget: Unread Notifications:** A list of recent notifications from the school, such as `ABSENCE_ALERT` or `FLAG_CREATED`.

### 5.2. Page: Child Attendance History
*   **Purpose:** A detailed view for parents to track attendance patterns over time.
*   **Primary API Endpoint(s):** `GET /api/attendance/reports/student_history/`
*   **Key Components:**
    *   **Calendar View:** A monthly calendar where each day is color-coded (e.g., green for perfect attendance, yellow for lateness, red for absence). Clicking a day shows the session details.
    *   **Absence Flags Section:** A list of all `ACTIVE` absence flags, with a clear "Provide Justification" button that initiates the "Resolve Flag" flow.
    *   **Summary Statistics:** Cards displaying key metrics like `attendance_rate`, `total_absences`, and `total_late` for the selected time period.