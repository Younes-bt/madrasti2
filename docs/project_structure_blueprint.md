# Madrasti 2.0: Ideal Project Structure & Sitemap Blueprint

This document defines the **ideal** application structure for Madrasti 2.0. It maps the strategic goals (from the Project Manager & UX/UI workflows) to concrete pages and backend capabilities.

---

## 🏗️ 1. Core Architecture Principles
*   **Role-Centric**: Each role has a distinct "App Experience" (not just a permission change).
*   **Workflow-Driven**: Navigation follows the "Daily Pulse" of the user, not the database structure.
*   **Feature Parity**: Every frontend page maps to an existing (or planned) backend module.

---

## 🛡️ 2. Admin Portal (The Command Center)
**Persona Goal**: Control, Efficiency, & "The Director's Pulse".
**Key Backend Modules**: `school`, `users`, `finance`, `analytics`, `activity_log`.

### 🧭 Sitemap
*   **Use Case**: Managing the entire institution.

#### 1. Dashboard (The Pulse)
*   **`admin/dashboard`**: The "Proactive Assistant" view.
    *   *Widgets*: Live Attendance (Staff/Student), Daily Revenue, Critical Alerts (Discipline/Maintenance).

#### 2. People & Roles (CRM)
*   **`admin/people/staff`**: Staff directory, contracts, shift management.
*   **`admin/people/teachers`**: Teacher directory, workload analysis, performance metrics.
*   **`admin/people/students`**: Student files, enrollment status, disciplinary records.
*   **`admin/people/parents`**: Family linking, contact info, financial status.

#### 3. Academic Structure (The Backbone)
*   **`admin/academic/years`**: Academic year setup, term definitions.
*   **`admin/academic/structure`**: Tracks (Science/Arts) -> Grades (10th/11th) -> Classes (A/B).
*   **`admin/academic/subjects`**: Subject registry, coefficients, curriculum mapping.
*   **`admin/academic/timetable`**: Master schedule builder (Drag & Drop), conflict resolver.

#### 4. Finance & Operations (ERP)
*   **`admin/finance/overview`**: Cash flow, budget v.s. actuals.
*   **`admin/finance/fees`**: Fee structure setup, discount rules.
*   **`admin/finance/invoices`**: Billing cycle management, overdue tracking.
*   **`admin/finance/payroll`**: Staff salaries, bonuses, deductions.
*   **`admin/logistics/inventory`**: Equipment tracking, room allocation.
*   **`admin/logistics/transport`**: Vehicle fleet, route management, fuel analytics.

#### 5. Content & Quality (LMS Admin)
*   **`admin/content/review`**: Reviewing teacher lesson plans/content quality.
*   **`admin/reports/academic`**: School-wide grade distribution, success rates.
*   **`admin/reports/attendance`**: aggregated absenteeism reports.

---

## 👩‍🏫 3. Teacher Portal (The Classroom Deck)
**Persona Goal**: Focus, Flow, & "Relationship Handling".
**Key Backend Modules**: `lessons`, `homework`, `attendance`, `communication`, `tasks`.

### 🧭 Sitemap
*   **Use Case**: Delivering education and managing classroom dynamics.

#### 1. Command Center
*   **`teacher/home`**: The "Morning Coffee" view. Today's schedule, urgent tasks, next period prep.

#### 2. Class Management (The Deck)
*   **`teacher/classes/{class_id}/dashboard`**: The specific "Classroom" hub.
*   **`teacher/classes/{class_id}/attendance`**: Quick-tap attendance register.
*   **`teacher/classes/{class_id}/students`**: Student list with "Engagement Pulse" indicators.
*   **`teacher/classes/{class_id}/gradebook`**: Spreadsheet-style grading view.

#### 3. Content Studio (The Creator)
*   **`teacher/content/library`**: Personal repository of lessons and resources.
*   **`teacher/content/builder`**: The "Studio" - Lesson planner, interactive slide builder.
*   **`teacher/content/assignments`**: Homework/Exam creator.

#### 4. Interaction (The Mentor)
*   **`teacher/communication/inbox`**: Direct line to parents (controlled).
*   **`teacher/tasks/planner`**: Personal to-do list and project tracking (e.g., "Science Fair").

---

## 🎒 4. Student Portal (The Learning Quest)
**Persona Goal**: Engagement, Gamification, & "My Journey".
**Key Backend Modules**: `lessons`, `homework`, `lab`, `rewards`.

### 🧭 Sitemap
*   **Use Case**: Consuming content and tracking personal progress.

#### 1. My World (Dashboard)
*   **`student/home`**: "Pack Your Bag" view. Timetable, "Due Today", Gamification Stats (XP/Badges).

#### 2. Learn (The Journey)
*   **`student/learn/map`**: The "Explorer" map view of the curriculum (Subjects -> Chapters).
*   **`student/learn/lesson/{id}`**: Immersive lesson player (Video + Interactive Blocks).
*   **`student/learn/lab`**: Virtual labs (Biology/Three.js integrations).

#### 3. Practice (The Gym)
*   **`student/practice/homework`**: Pending assignments list.
*   **`student/practice/quiz`**: Self-assessment tools and past exams.

#### 4. Records (The Profile)
*   **`student/my/grades`**: Visual growth charts (not just numbers).
*   **`student/my/attendance`**: Personal attendance record.
*   **`student/my/rewards`**: Achievement showcase, points redemption store.

---

## 👨‍👩‍👧‍👦 5. Parent Portal (The Partner)
**Persona Goal**: Reassurance, Pride, & "Concierge Service".
**Key Backend Modules**: `communication`, `finance`, `attendance`.

### 🧭 Sitemap
*   **Use Case**: Monitoring child's safety/progress and handling administrative duties.

#### 1. Family Overview
*   **`parent/home`**: The "Safety Check" feed. Live status of all children.

#### 2. Child View (The Lens)
*   *Switchable profile for each child*
*   **`parent/kid/academics`**: "Smart Summaries" (AI) of performance, Report Cards.
*   **`parent/kid/attendance`**: Detailed history + "Excuse Absence" requests.
*   **`parent/kid/behavior`**: Teacher notes, commendations, discipline logs.

#### 3. Admin & Finance (The Office)
*   **`parent/office/finance`**: Fee status, payment gateway, invoice history.
*   **`parent/office/requests`**: Transport changes, meeting requests, document requests.
*   **`parent/office/transport`**: Live bus tracking (Map view).

#### 4. Community
*   **`parent/community/news`**: School circulars, events calendar.
*   **`parent/community/messages`**: Direct chat with authorized staff/teachers.

---

## 📊 Summary of Gap Analysis
Comparing this Ideal Blueprint to the Current Structure:

1.  **Student**:
    *   *Missing*: The "Explorer Map" concept. Current is list-based.
    *   *Missing*: Dedicated "Virtual Lab" section (partially there, needs integration).
2.  **Parent**:
    *   *Missing*: "Transport/Bus Tracking" pages.
    *   *Missing*: dedicated "Requests" workflow.
3.  **Teacher**:
    *   *Missing*: The "Content Studio" as a distinct streamlined experience.
4.  **Admin**:
    *   *Good*: Coverage is very high (Finance, People, Academic all exist).
    *   *Missing*: The "Director's Pulse" visualization widgets.
