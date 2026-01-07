# Role Features Checklist (Detailed)

This document provides a detailed, step-by-step checklist of features for each user role to facilitate comprehensive testing and implementation verification.

---

## 👨‍💼 Admin Role

### User Management

#### Student Accounts
- [ ] **Create:** Open the user creation form and successfully create a new student account.
- [ ] **Read (List):** View the list of all student accounts.
- [ ] **Read (Details):** Click on a student to view their full profile details.
- [ ] **Update:** Edit and save changes to a student's profile information.
- [ ] **Deactivate:** Deactivate a student's account, preventing login.
- [ ] **Activate:** Reactivate a deactivated student account.
- [ ] **Delete:** Delete a student account from the system.

#### Teacher Accounts
- [ ] **Create:** Open the user creation form and successfully create a new teacher account.
- [ ] **Read (List):** View the list of all teacher accounts.
- [ ] **Read (Details):** Click on a teacher to view their full profile details.
- [ ] **Update:** Edit and save changes to a teacher's profile information.
- [ ] **Deactivate:** Deactivate a teacher's account.
- [ ] **Activate:** Reactivate a deactivated teacher account.
- [ ] **Delete:** Delete a teacher account.

#### Parent Accounts
- [ ] **Create:** Create a new parent account.
- [ ] **Link to Student:** Associate a parent account with one or more student accounts.
- [ ] **Read (List):** View the list of all parent accounts.
- [ ] **Read (Details):** View a parent's profile and their linked children.
- [ ] **Update:** Edit and save changes to a parent's profile.
- [ ] **Delete:** Delete a parent account.

#### Staff & Admin Accounts
- [ ] **Create:** Create a new staff or admin account with appropriate permissions.
- [ ] **Read (List):** View the list of all administrative accounts.
- [ ] **Update:** Edit and save changes to a staff/admin profile.
- [ ] **Permissions:** Modify roles and permissions for a user.

### School Structure Management

- [ ] **School Configuration:** View and update the main school information (name, address, etc.).
- [ ] **Academic Years:** Create a new academic year (e.g., 2024-2025).
- [ ] **Academic Years:** Set an academic year as the 'current' one.
- [ ] **Educational Levels:** Create, view, and update educational levels (e.g., Primary, Secondary).
- [ ] **Grades:** Create, view, and update grades within each educational level (e.g., 1st Grade).
- [ ] **Classes:** Create, view, and update classes for each grade (e.g., Class A, Class B).
- [ ] **Subjects:** Create, view, and update subjects taught at the school.
- [ ] **Rooms:** Create, view, and update rooms and facilities (e.g., Classroom 101, Science Lab).

### System Monitoring & Reports

- [ ] **Dashboard:** View the admin dashboard with key system statistics.
- [ ] **System Health:** View the system health monitoring page.
- [ ] **Activity Log:** View a log of recent activities across the platform.
- [ ] **Generate Reports:** Generate and view school-wide reports (enrollment, performance, etc.).

---

## 👩‍🏫 Teacher Role

### Dashboard & Schedule
- [ ] **View Today's Schedule:** See a list of today's classes and sessions on the dashboard.
- [ ] **View Class Stats:** See quick statistics for assigned classes.

### Attendance Management
- [ ] **Select Session:** Choose a class session from the schedule to take attendance.
- [ ] **Mark Present:** Mark a student as 'Present'.
- [ ] **Mark Absent:** Mark a student as 'Absent'.
- [ ] **Mark Late:** Mark a student as 'Late' and add notes (e.g., arrival time).
- [ ] **Add Notes:** Add specific notes to an attendance record for a student.
- [ ] **Submit Attendance:** Finalize and submit the attendance for the session.
- [ ] **View History:** View historical attendance data for their classes.

### Assignment & Homework Management
- [ ] **Create Assignment:** Open the assignment builder and create a new assignment.
- [ ] **Set Details:** Add title, description, due date, and points.
- [ ] **Add Questions:** Add various question types (QCM, Open Text, etc.) to the assignment.
- [ ] **Publish:** Publish the assignment, making it visible to students.
- [ ] **View Submissions:** View a list of students who have submitted their work.
- [ ] **Grade Submission:** Open a submission, grade it, and provide feedback.
- [ ] **Update Assignment:** Edit details of an existing assignment.
- [ ] **Delete Assignment:** Delete an assignment they created.

### Lesson & Resource Management
- [ ] **Create Lesson:** Create a new lesson plan.
- [ ] **Add Resources:** Upload files, add links, or write content for a lesson.
- [ ] **Update Lesson:** Edit an existing lesson.
- [ ] **Delete Lesson:** Delete a lesson they created.
- [ ] **Browse Library:** View and use lessons created by other teachers.

---

## 🎓 Student Role

### Dashboard & Overview
- [ ] **View Dashboard:** See a personalized dashboard with key information.
- [ ] **Upcoming Assignments:** View a list of upcoming assignment deadlines.
- [ ] **Recent Grades:** See recently graded assignments and scores.
- [ ] **Gamification Stats:** View current points, level, and progress bar.

### Assignments & Homework
- [ ] **View All Assignments:** See a list of all pending, submitted, and graded assignments.
- [ ] **Filter Assignments:** Filter assignments by status (e.g., 'Pending').
- [ ] **View Assignment Details:** Open an assignment to see instructions and resources.
- [ ] **Submit Text Answer:** Type and submit a text-based answer.
- [ ] **Submit File Answer:** Upload and submit a file (PDF, image, etc.).
- [ ] **View Grade:** See the score and teacher's feedback for a graded assignment.

### Academic Progress
- [ ] **View Attendance:** See personal attendance history (calendar, list view).
- [ ] **View Lessons:** Access and view lesson materials for enrolled classes.
- [ ] **Download Resources:** Download files attached to lessons.

### Gamification & Engagement
- [ ] **View Points:** See total points and recent transactions.
- [ ] **View Badges:** View the collection of all earned badges.
- [ ] **View Leaderboard:** See personal ranking on the class/school leaderboard.

---

## 👨‍👩‍👧‍👦 Parent Role

### Dashboard & Child Selection
- [ ] **Switch Child:** If multiple children, switch between their profiles.
- [ ] **View Overview:** See a summary of the selected child's performance.

### Academic Tracking
- [ ] **View Assignments:** See a list of the child's assignments and their status.
- [ ] **View Grades:** View the child's grades and any feedback from teachers.
- [ ] **View Reports:** Access and view the child's academic progress reports.

### Attendance Monitoring
- [ ] **View History:** View the child's attendance calendar and history.
- [ ] **Receive Absence Alerts:** Get notifications for absences or tardiness.
- [ ] **Justify Absence:** Submit a justification for a child's absence (e.g., medical note).

### Communication
- [ ] **View Announcements:** See school-wide or class-specific announcements.
- [ ] **Contact Teacher:** Send a message to one of the child's teachers.
- [ ] **View Messages:** Read messages received from teachers or administration.