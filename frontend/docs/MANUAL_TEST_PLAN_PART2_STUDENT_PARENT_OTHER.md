# Madrasti 2.0 - Manual Test Plan
## Part 2: Student, Parent, Staff & Cross-Role Tests

**Version**: 1.0
**Last Updated**: 2025-10-10
**Purpose**: Comprehensive manual testing guide for Student, Parent, Staff roles and cross-role functionality

---

## 4. Student Role Tests

### 4.1 Student Dashboard

**STU-001: View student dashboard**
- Steps:
  1. Login as student
  2. View dashboard
- Expected Result: Shows schedule, pending homework, grades
- Status: ☐

**STU-002: View today's classes**
- Steps:
  1. Check dashboard schedule
- Expected Result: Today's classes displayed
- Status: ☐

**STU-003: View pending homework**
- Steps:
  1. Check homework widget
- Expected Result: Pending homework listed with due dates
- Status: ☐

**STU-004: View recent grades**
- Steps:
  1. Check grades widget
- Expected Result: Recent grades displayed
- Status: ☐

**STU-005: View points/rewards**
- Steps:
  1. Check rewards widget
- Expected Result: Total points, coins, level shown
- Status: ☐

### 4.2 My Profile (Student)

**STU-006: View my profile**
- Steps:
  1. Navigate to Profile
- Expected Result: Personal information displayed
- Status: ☐

**STU-007: View my class**
- Steps:
  1. Check profile
- Expected Result: Current class and academic year shown
- Status: ☐

**STU-008: View my teachers**
- Steps:
  1. Check profile
- Expected Result: List of my teachers displayed
- Status: ☐

**STU-009: Edit profile**
- Steps:
  1. Click Edit Profile
  2. Update phone, bio
  3. Save
- Expected Result: Profile updated
- Status: ☐

**STU-010: Update profile picture**
- Steps:
  1. Edit profile
  2. Upload picture
  3. Save
- Expected Result: Picture updated
- Status: ☐

**STU-011: Change password**
- Steps:
  1. Go to settings
  2. Change password
  3. Save
- Expected Result: Password changed
- Status: ☐

### 4.3 My Timetable

**STU-012: View weekly timetable**
- Steps:
  1. Navigate to My Timetable
- Expected Result: Weekly schedule displayed
- Status: ☐

**STU-013: View today's schedule**
- Steps:
  1. Check today's tab
- Expected Result: Today's classes with times, rooms
- Status: ☐

**STU-014: View session details**
- Steps:
  1. Click on session
- Expected Result: Shows subject, teacher, room
- Status: ☐

**STU-015: Navigate between weeks**
- Steps:
  1. Use next/previous week buttons
- Expected Result: Schedule for selected week shown
- Status: ☐

### 4.4 My Lessons

**STU-016: View all my lessons**
- Steps:
  1. Navigate to Lessons
- Expected Result: All lessons for my subjects/grade shown
- Status: ☐

**STU-017: Filter lessons by subject**
- Steps:
  1. Select subject filter
- Expected Result: Only that subject's lessons shown
- Status: ☐

**STU-018: Filter lessons by cycle**
- Steps:
  1. Select cycle filter
- Expected Result: Lessons from selected cycle shown
- Status: ☐

**STU-019: Search lessons**
- Steps:
  1. Enter search term
- Expected Result: Matching lessons displayed
- Status: ☐

**STU-020: View lesson details**
- Steps:
  1. Click on lesson
- Expected Result: Lesson content displayed
- Status: ☐

**STU-021: View lesson resources**
- Steps:
  1. Open lesson
  2. View resources
- Expected Result: All visible resources listed
- Status: ☐

**STU-022: Download PDF resource**
- Steps:
  1. Click on PDF resource
  2. Download
- Expected Result: PDF downloaded
- Status: ☐

**STU-023: Watch video resource**
- Steps:
  1. Click on video
  2. Play
- Expected Result: Video plays in browser
- Status: ☐

**STU-024: View YouTube video**
- Steps:
  1. Click on YouTube link
- Expected Result: Video plays embedded or opens YouTube
- Status: ☐

**STU-025: Access external link**
- Steps:
  1. Click on external link
- Expected Result: Link opens in new tab
- Status: ☐

**STU-026: View non-downloadable resource**
- Steps:
  1. Try to download resource marked non-downloadable
- Expected Result: Only view option available
- Status: ☐

### 4.5 Lesson Exercises

**STU-027: View lesson exercises**
- Steps:
  1. Open lesson
  2. Go to Exercises tab
- Expected Result: All exercises listed
- Status: ☐

**STU-028: View exercise details**
- Steps:
  1. Click on exercise
- Expected Result: Shows description, difficulty, questions count
- Status: ☐

**STU-029: Start exercise**
- Steps:
  1. Click Start Exercise
- Expected Result: Exercise begins, timer starts if timed
- Status: ☐

**STU-030: Answer QCM question**
- Steps:
  1. In exercise
  2. Select answer
  3. Click Next
- Expected Result: Answer saved, next question shown
- Status: ☐

**STU-031: Answer multiple choice question**
- Steps:
  1. Select multiple answers
  2. Submit
- Expected Result: Multiple selections saved
- Status: ☐

**STU-032: Answer open short question**
- Steps:
  1. Type answer in text field
  2. Submit
- Expected Result: Text answer saved
- Status: ☐

**STU-033: Answer open long question**
- Steps:
  1. Type essay in text area
  2. Submit
- Expected Result: Long answer saved
- Status: ☐

**STU-034: Answer true/false question**
- Steps:
  1. Select True or False
  2. Submit
- Expected Result: Answer saved
- Status: ☐

**STU-035: Answer fill-in-blank question**
- Steps:
  1. Select option for each blank
  2. Submit
- Expected Result: Answers saved
- Status: ☐

**STU-036: Answer matching question**
- Steps:
  1. Match left items to right items
  2. Submit
- Expected Result: Matches saved
- Status: ☐

**STU-037: Answer ordering question**
- Steps:
  1. Drag items into correct order
  2. Submit
- Expected Result: Order saved
- Status: ☐

**STU-038: Navigate between questions**
- Steps:
  1. Use Previous/Next buttons
- Expected Result: Navigation works, answers preserved
- Status: ☐

**STU-039: View question explanation**
- Steps:
  1. After answering
  2. View explanation
- Expected Result: Explanation displayed (if enabled)
- Status: ☐

**STU-040: Complete exercise**
- Steps:
  1. Answer all questions
  2. Click Submit
- Expected Result: Exercise submitted, score shown
- Status: ☐

**STU-041: View exercise results**
- Steps:
  1. After submission
- Expected Result: Score, correct/incorrect answers shown
- Status: ☐

**STU-042: Retake exercise**
- Steps:
  1. From completed exercise
  2. Click Retake
- Expected Result: New attempt started
- Status: ☐

**STU-043: View exercise attempts**
- Steps:
  1. View exercise
  2. Check attempts history
- Expected Result: All attempts with scores shown
- Status: ☐

**STU-044: Exercise time limit**
- Steps:
  1. Start timed exercise
  2. Let time expire
- Expected Result: Auto-submitted when time runs out
- Status: ☐

### 4.6 My Homework

**STU-045: View all homework**
- Steps:
  1. Navigate to Homework
- Expected Result: All assigned homework listed
- Status: ☐

**STU-046: View pending homework**
- Steps:
  1. Filter by status: Pending
- Expected Result: Only pending homework shown
- Status: ☐

**STU-047: View completed homework**
- Steps:
  1. Filter by status: Completed
- Expected Result: Only completed homework shown
- Status: ☐

**STU-048: View graded homework**
- Steps:
  1. Filter by status: Graded
- Expected Result: Only graded homework shown
- Status: ☐

**STU-049: Filter homework by subject**
- Steps:
  1. Select subject filter
- Expected Result: Only homework for that subject shown
- Status: ☐

**STU-050: Sort by due date**
- Steps:
  1. Sort by due date
- Expected Result: Homework ordered by deadline
- Status: ☐

**STU-051: View homework details**
- Steps:
  1. Click on homework
- Expected Result: Shows description, instructions, due date
- Status: ☐

**STU-052: Check overdue status**
- Steps:
  1. View homework past due date
- Expected Result: Marked as overdue
- Status: ☐

**STU-053: Start homework**
- Steps:
  1. Click Start on homework
- Expected Result: Homework opened, timer starts if timed
- Status: ☐

**STU-054: Save as draft**
- Steps:
  1. Start homework
  2. Answer some questions
  3. Click Save Draft
- Expected Result: Progress saved
- Status: ☐

**STU-055: Resume draft**
- Steps:
  1. Open saved draft
- Expected Result: Previous answers restored
- Status: ☐

**STU-056: Answer QCM questions**
- Steps:
  1. Answer multiple QCM questions
  2. Save
- Expected Result: Answers saved
- Status: ☐

**STU-057: Answer open questions**
- Steps:
  1. Type answers to open questions
  2. Save
- Expected Result: Text answers saved
- Status: ☐

**STU-058: Upload file for answer**
- Steps:
  1. Open question allows file upload
  2. Select and upload file
  3. Save
- Expected Result: File uploaded and linked to answer
- Status: ☐

**STU-059: Complete book exercise**
- Steps:
  1. View book exercise reference
  2. Upload work images/files
  3. Add description
  4. Save
- Expected Result: Book exercise submission saved
- Status: ☐

**STU-060: View uploaded files**
- Steps:
  1. Check book exercise answer
  2. View files
- Expected Result: Uploaded files displayed
- Status: ☐

**STU-061: Delete uploaded file**
- Steps:
  1. Select file
  2. Delete
- Expected Result: File removed
- Status: ☐

**STU-062: Submit homework**
- Steps:
  1. Complete all required questions
  2. Click Submit
- Expected Result: Homework submitted, confirmation shown
- Status: ☐

**STU-063: Submit incomplete homework**
- Steps:
  1. Try to submit with unanswered required questions
- Expected Result: Error: Must answer all required questions
- Status: ☐

**STU-064: Submit on time**
- Steps:
  1. Submit before due date
- Expected Result: Marked as on-time
- Status: ☐

**STU-065: Submit late**
- Steps:
  1. Submit after due date
- Expected Result: Marked as late, penalty applied if set
- Status: ☐

**STU-066: Submit when late not allowed**
- Steps:
  1. Try to submit after due date when not allowed
- Expected Result: Error: Late submissions not accepted
- Status: ☐

**STU-067: View submission confirmation**
- Steps:
  1. After submitting
- Expected Result: Confirmation message with timestamp
- Status: ☐

**STU-068: Attempt homework again**
- Steps:
  1. For homework allowing multiple attempts
  2. Start new attempt
- Expected Result: New attempt started
- Status: ☐

**STU-069: View attempt history**
- Steps:
  1. View homework
  2. Check attempts
- Expected Result: All attempts with scores shown
- Status: ☐

**STU-070: Homework time limit**
- Steps:
  1. Start timed homework
  2. Let timer expire
- Expected Result: Auto-submitted
- Status: ☐

**STU-071: View auto-graded results**
- Steps:
  1. After submission with auto-grading enabled
  2. View results
- Expected Result: QCM scores shown immediately
- Status: ☐

**STU-072: View manual grade**
- Steps:
  1. After teacher grades
  2. View results
- Expected Result: Total grade displayed
- Status: ☐

**STU-073: View teacher feedback**
- Steps:
  1. View graded homework
  2. Check feedback
- Expected Result: General and per-question feedback shown
- Status: ☐

**STU-074: View question-by-question results**
- Steps:
  1. View graded homework
  2. Review each question
- Expected Result: Shows correct answer, score, feedback
- Status: ☐

**STU-075: View book exercise grade**
- Steps:
  1. Check book exercise
  2. View grade
- Expected Result: Points and feedback shown
- Status: ☐

**STU-076: View total score**
- Steps:
  1. View graded homework
- Expected Result: Total score and percentage shown
- Status: ☐

**STU-077: Download graded homework**
- Steps:
  1. Click Download/Export
  2. Save
- Expected Result: Homework with grades downloaded
- Status: ☐

### 4.7 My Grades

**STU-078: View all grades**
- Steps:
  1. Navigate to Grades
- Expected Result: All graded homework/exams listed
- Status: ☐

**STU-079: Filter grades by subject**
- Steps:
  1. Select subject
- Expected Result: Only grades for that subject shown
- Status: ☐

**STU-080: View grade details**
- Steps:
  1. Click on grade
- Expected Result: Shows homework, score, date
- Status: ☐

**STU-081: View grade statistics**
- Steps:
  1. Check stats
- Expected Result: Shows average, highest, lowest
- Status: ☐

**STU-082: View grade trend**
- Steps:
  1. View grade chart
- Expected Result: Visual graph of grades over time
- Status: ☐

**STU-083: Export grades**
- Steps:
  1. Click Export
  2. Select format
- Expected Result: Grades exported
- Status: ☐

### 4.8 My Attendance

**STU-084: View attendance history**
- Steps:
  1. Navigate to My Attendance
- Expected Result: All attendance records listed
- Status: ☐

**STU-085: View attendance statistics**
- Steps:
  1. Check attendance stats
- Expected Result: Present/absent/late counts shown
- Status: ☐

**STU-086: View attendance rate**
- Steps:
  1. View stats
- Expected Result: Attendance percentage displayed
- Status: ☐

**STU-087: Filter by subject**
- Steps:
  1. Select subject filter
- Expected Result: Attendance for that subject shown
- Status: ☐

**STU-088: Filter by date range**
- Steps:
  1. Select date range
- Expected Result: Attendance in range shown
- Status: ☐

**STU-089: View absence flags**
- Steps:
  1. Check flags section
- Expected Result: Pending absence flags listed
- Status: ☐

**STU-090: View cleared flags**
- Steps:
  1. View flag history
- Expected Result: Cleared flags with reasons shown
- Status: ☐

**STU-091: Request absence clearance**
- Steps:
  1. View absence flag
  2. Click Justify
  3. Select reason
  4. Upload document (medical cert, etc.)
  5. Add notes
  6. Submit
- Expected Result: Clearance request submitted
- Status: ☐

**STU-092: View clearance status**
- Steps:
  1. Check absence flag
- Expected Result: Status (pending/cleared) shown
- Status: ☐

### 4.9 Rewards & Points

**STU-093: View my wallet**
- Steps:
  1. Navigate to Rewards
- Expected Result: Wallet with points, coins, stars shown
- Status: ☐

**STU-094: View earned points**
- Steps:
  1. Check transactions
- Expected Result: All point transactions listed
- Status: ☐

**STU-095: View level**
- Steps:
  1. Check profile
- Expected Result: Current level and XP shown
- Status: ☐

**STU-096: View progress to next level**
- Steps:
  1. Check level progress
- Expected Result: Progress bar to next level
- Status: ☐

**STU-097: View rewards breakdown**
- Steps:
  1. View rewards
- Expected Result: Points from homework, exercises, bonuses shown
- Status: ☐

**STU-098: View streak**
- Steps:
  1. Check wallet
- Expected Result: Current and longest streak shown
- Status: ☐

**STU-099: View earned badges**
- Steps:
  1. Navigate to My Badges
- Expected Result: All earned badges displayed
- Status: ☐

**STU-100: View badge details**
- Steps:
  1. Click on badge
- Expected Result: Shows badge name, description, earned date
- Status: ☐

**STU-101: View available badges**
- Steps:
  1. Check available badges
- Expected Result: Unearned badges shown (if not hidden)
- Status: ☐

**STU-102: View badge requirements**
- Steps:
  1. Click on available badge
- Expected Result: Requirements to earn badge shown
- Status: ☐

**STU-103: View badge rarity**
- Steps:
  1. Check badges
- Expected Result: Rarity (common, rare, epic, legendary) shown
- Status: ☐

**STU-104: View class leaderboard**
- Steps:
  1. Navigate to Leaderboard
  2. Select Class scope
- Expected Result: Class leaderboard displayed
- Status: ☐

**STU-105: View grade leaderboard**
- Steps:
  1. Select Grade scope
- Expected Result: Grade leaderboard displayed
- Status: ☐

**STU-106: View my rank**
- Steps:
  1. Check leaderboard
- Expected Result: My position highlighted
- Status: ☐

**STU-107: View weekly leaderboard**
- Steps:
  1. Select Weekly period
- Expected Result: Weekly rankings shown
- Status: ☐

**STU-108: View monthly leaderboard**
- Steps:
  1. Select Monthly period
- Expected Result: Monthly rankings shown
- Status: ☐

**STU-109: View top performers**
- Steps:
  1. View leaderboard
- Expected Result: Top 10 students listed
- Status: ☐

**STU-110: View rank change**
- Steps:
  1. Check my rank
- Expected Result: Rank change (up/down) from last period shown
- Status: ☐

---

## 5. Parent Role Tests

### 5.1 Parent Dashboard

**PAR-001: View parent dashboard**
- Steps:
  1. Login as parent
  2. View dashboard
- Expected Result: Shows children's info, notifications
- Status: ☐

**PAR-002: View linked children**
- Steps:
  1. Check dashboard
- Expected Result: All linked children displayed
- Status: ☐

**PAR-003: Select child**
- Steps:
  1. Click on child's name
  2. View details
- Expected Result: Child's information shown
- Status: ☐

### 5.2 Child Information

**PAR-004: View child profile**
- Steps:
  1. Select child
  2. View profile
- Expected Result: Child's personal info, class shown
- Status: ☐

**PAR-005: View child's teachers**
- Steps:
  1. View child profile
- Expected Result: List of teachers displayed
- Status: ☐

**PAR-006: View child's class**
- Steps:
  1. View child profile
- Expected Result: Current class and grade shown
- Status: ☐

**PAR-007: View child's timetable**
- Steps:
  1. Select child
  2. Navigate to Timetable
- Expected Result: Weekly schedule displayed
- Status: ☐

**PAR-008: View today's classes**
- Steps:
  1. Check today's schedule
- Expected Result: Today's classes with times shown
- Status: ☐

**PAR-009: View child's grades**
- Steps:
  1. Select child
  2. Navigate to Grades
- Expected Result: All grades listed by subject
- Status: ☐

**PAR-010: View grade details**
- Steps:
  1. Click on grade
- Expected Result: Shows homework, score, date
- Status: ☐

**PAR-011: View grade trends**
- Steps:
  1. View grades
  2. Check chart
- Expected Result: Visual graph of performance
- Status: ☐

**PAR-012: Filter grades by subject**
- Steps:
  1. Select subject
- Expected Result: Grades for that subject shown
- Status: ☐

**PAR-013: View homework submissions**
- Steps:
  1. Navigate to child's homework
- Expected Result: All homework with statuses shown
- Status: ☐

**PAR-014: View homework details**
- Steps:
  1. Click on homework
- Expected Result: Shows assignment, due date, status
- Status: ☐

**PAR-015: View child's attendance**
- Steps:
  1. Select child
  2. Navigate to Attendance
- Expected Result: Attendance records listed
- Status: ☐

**PAR-016: View attendance statistics**
- Steps:
  1. Check attendance stats
- Expected Result: Present/absent/late counts shown
- Status: ☐

**PAR-017: View attendance rate**
- Steps:
  1. View stats
- Expected Result: Attendance percentage displayed
- Status: ☐

**PAR-018: View absence details**
- Steps:
  1. Click on absence
- Expected Result: Shows date, subject, notes
- Status: ☐

**PAR-019: View absence flags**
- Steps:
  1. Check flags
- Expected Result: Pending flags listed
- Status: ☐

**PAR-020: View cleared absences**
- Steps:
  1. View cleared flags
- Expected Result: Clearance reasons and dates shown
- Status: ☐

**PAR-021: View child's points**
- Steps:
  1. Select child
  2. View Rewards
- Expected Result: Total points, coins displayed
- Status: ☐

**PAR-022: View child's badges**
- Steps:
  1. View Rewards
  2. Check badges
- Expected Result: Earned badges shown
- Status: ☐

**PAR-023: View child's leaderboard rank**
- Steps:
  1. View Leaderboard
- Expected Result: Child's rank displayed
- Status: ☐

**PAR-024: View reward transactions**
- Steps:
  1. View transactions
- Expected Result: All point earnings listed
- Status: ☐

### 5.3 Notifications

**PAR-025: Receive absence notification**
- Steps:
  1. When child is marked absent
  2. Check notifications
- Expected Result: Absence notification received
- Status: ☐

**PAR-026: Receive late notification**
- Steps:
  1. When child is marked late
  2. Check notifications
- Expected Result: Late notification received
- Status: ☐

**PAR-027: Receive absence flag notification**
- Steps:
  1. When absence flag created
  2. Check notifications
- Expected Result: Flag notification received
- Status: ☐

**PAR-028: View notification details**
- Steps:
  1. Click on notification
- Expected Result: Full notification details shown
- Status: ☐

**PAR-029: Mark notification as read**
- Steps:
  1. Click on notification
- Expected Result: Notification marked as read
- Status: ☐

**PAR-030: View unread notifications**
- Steps:
  1. Check notifications
  2. Filter by unread
- Expected Result: Only unread notifications shown
- Status: ☐

**PAR-031: Receive grade notification**
- Steps:
  1. When homework is graded
  2. Check notifications
- Expected Result: Grade notification received
- Status: ☐

**PAR-032: Receive homework notification**
- Steps:
  1. When homework is assigned
  2. Check notifications
- Expected Result: Assignment notification received
- Status: ☐

**PAR-033: View teacher contact**
- Steps:
  1. View child's teachers
- Expected Result: Teacher contact info shown
- Status: ☐

**PAR-034: Send message to teacher**
- Steps:
  1. Select teacher
  2. Compose message
  3. Send
- Expected Result: Message sent to teacher
- Status: ☐

---

## 6. Staff Role Tests

### 6.1 Staff Dashboard

**STAFF-001: View staff dashboard**
- Steps:
  1. Login as staff
  2. View dashboard
- Expected Result: Dashboard displayed with assigned tasks
- Status: ☐

**STAFF-002: View students**
- Steps:
  1. Navigate to Students
- Expected Result: Student list accessible
- Status: ☐

**STAFF-003: View attendance reports**
- Steps:
  1. Navigate to Reports
- Expected Result: Attendance reports accessible
- Status: ☐

---

## 7. Cross-Role Tests

### 7.1 Security & Permissions

**CROSS-001: Student cannot access admin pages**
- Steps:
  1. Login as student
  2. Try to access admin URL directly
- Expected Result: Redirected or access denied
- Status: ☐

**CROSS-002: Teacher cannot access admin functions**
- Steps:
  1. Login as teacher
  2. Try to access admin functions
- Expected Result: Access denied
- Status: ☐

**CROSS-003: Parent cannot access teacher functions**
- Steps:
  1. Login as parent
  2. Try to access teacher pages
- Expected Result: Access denied
- Status: ☐

**CROSS-004: Student cannot see other students' data**
- Steps:
  1. Login as student
  2. Try to access another student's profile
- Expected Result: Access denied
- Status: ☐

**CROSS-005: Teacher cannot see other teachers' homework**
- Steps:
  1. Login as teacher
  2. Try to access another teacher's homework
- Expected Result: Access denied or read-only
- Status: ☐

**CROSS-006: Student phone numbers hidden**
- Steps:
  1. View student list
  2. Check phone display
- Expected Result: Phone numbers properly protected
- Status: ☐

**CROSS-007: Email privacy**
- Steps:
  1. View user lists
  2. Check email display
- Expected Result: Emails shown only to authorized roles
- Status: ☐

**CROSS-008: Grade privacy**
- Steps:
  1. As student, view grades
  2. Check
- Expected Result: Only own grades visible
- Status: ☐

### 7.2 Concurrent Operations

**CROSS-009: Multiple students submit homework**
- Steps:
  1. Have 5+ students submit same homework simultaneously
- Expected Result: All submissions processed correctly
- Status: ☐

**CROSS-010: Teacher grades while student submits**
- Steps:
  1. Teacher viewing submissions
  2. Student submits new homework
- Expected Result: Both actions complete successfully
- Status: ☐

**CROSS-011: Admin edits class while teacher takes attendance**
- Steps:
  1. Admin modifies class
  2. Teacher taking attendance
- Expected Result: Both actions succeed without conflict
- Status: ☐

### 7.3 Data Consistency

**CROSS-012: Enrollment consistency**
- Steps:
  1. Enroll student
  2. Check in all views
- Expected Result: Student appears in class roster, teacher view, parent view
- Status: ☐

**CROSS-013: Grade consistency**
- Steps:
  1. Teacher assigns grade
  2. Check
- Expected Result: Grade visible to student and parent immediately
- Status: ☐

**CROSS-014: Attendance consistency**
- Steps:
  1. Teacher marks attendance
  2. Check
- Expected Result: Attendance visible in reports, parent view, student view
- Status: ☐

**CROSS-015: Homework assignment propagation**
- Steps:
  1. Teacher publishes homework
  2. Check
- Expected Result: Homework appears for all students in class
- Status: ☐

---

## 8. Multilingual Support Tests

### 8.1 Language Switching

**LANG-001: Switch to Arabic**
- Steps:
  1. Click language selector
  2. Select Arabic
- Expected Result: UI switches to Arabic (RTL layout)
- Status: ☐

**LANG-002: Switch to French**
- Steps:
  1. Click language selector
  2. Select French
- Expected Result: UI switches to French
- Status: ☐

**LANG-003: Switch to English**
- Steps:
  1. Click language selector
  2. Select English
- Expected Result: UI switches to English
- Status: ☐

**LANG-004: Language persistence**
- Steps:
  1. Select language
  2. Logout and login
- Expected Result: Selected language persists
- Status: ☐

**LANG-005: View subject names in Arabic**
- Steps:
  1. Switch to Arabic
  2. View subjects
- Expected Result: Arabic subject names displayed
- Status: ☐

**LANG-006: View grade names in French**
- Steps:
  1. Switch to French
  2. View grades
- Expected Result: French grade names displayed
- Status: ☐

**LANG-007: View lesson titles in all languages**
- Steps:
  1. View lesson
  2. Switch languages
- Expected Result: Appropriate title shown per language
- Status: ☐

**LANG-008: Fallback to default language**
- Steps:
  1. View content without translation
  2. Check display
- Expected Result: Falls back to English/default
- Status: ☐

**LANG-009: Navigation menu RTL**
- Steps:
  1. Switch to Arabic
  2. Check menu
- Expected Result: Menu aligned right, RTL layout
- Status: ☐

**LANG-010: Forms RTL**
- Steps:
  1. In Arabic mode
  2. View forms
- Expected Result: Form labels and inputs RTL aligned
- Status: ☐

**LANG-011: Tables RTL**
- Steps:
  1. In Arabic mode
  2. View data tables
- Expected Result: Tables display RTL
- Status: ☐

**LANG-012: Buttons RTL**
- Steps:
  1. In Arabic mode
  2. Check buttons
- Expected Result: Icons and text properly aligned
- Status: ☐

---

## 9. Additional Test Scenarios

### 9.1 Responsive Design

**RESP-001: Login on mobile**
- Steps:
  1. Access site on mobile (375x667)
  2. Login
- Expected Result: Login form responsive and functional
- Status: ☐

**RESP-002: Navigation on mobile**
- Steps:
  1. Open menu on mobile
- Expected Result: Hamburger menu works, navigation accessible
- Status: ☐

**RESP-003: Dashboard on mobile**
- Steps:
  1. View dashboard on mobile
- Expected Result: Widgets stack vertically, all info visible
- Status: ☐

**RESP-004: Forms on mobile**
- Steps:
  1. Fill form on mobile
- Expected Result: Form inputs properly sized, submits correctly
- Status: ☐

**RESP-005: Tables on mobile**
- Steps:
  1. View data table on mobile
- Expected Result: Table scrolls horizontally or stacks responsively
- Status: ☐

**RESP-006: Dashboard on tablet**
- Steps:
  1. View dashboard on tablet (768x1024)
- Expected Result: Layout adapts appropriately
- Status: ☐

**RESP-007: Homework submission on tablet**
- Steps:
  1. Complete homework on tablet
- Expected Result: All question types work properly
- Status: ☐

### 9.2 File Upload & Media

**MEDIA-001: Upload profile picture**
- Steps:
  1. Upload image as profile picture
- Expected Result: Image uploads to Cloudinary, displays correctly
- Status: ☐

**MEDIA-002: Upload PDF**
- Steps:
  1. Upload PDF to lesson resource
- Expected Result: PDF uploads and is accessible
- Status: ☐

**MEDIA-003: Upload video**
- Steps:
  1. Upload video file
- Expected Result: Video uploads and plays
- Status: ☐

**MEDIA-004: Upload large file**
- Steps:
  1. Try to upload file >10MB
- Expected Result: Size limit enforced or file uploads
- Status: ☐

**MEDIA-005: Upload invalid file type**
- Steps:
  1. Try to upload .exe file
- Expected Result: Error: File type not allowed
- Status: ☐

**MEDIA-006: View image transformations**
- Steps:
  1. Upload high-res image
  2. View in different sizes
- Expected Result: Cloudinary transformations applied
- Status: ☐

### 9.3 Performance

**PERF-001: Page load time**
- Steps:
  1. Measure page load
- Expected Result: Pages load in <3 seconds
- Status: ☐

**PERF-002: Large class roster**
- Steps:
  1. View class with 100+ students
- Expected Result: List loads reasonably fast
- Status: ☐

**PERF-003: Image gallery loading**
- Steps:
  1. View room with 20+ images
- Expected Result: Images load progressively
- Status: ☐

### 9.4 Error Handling

**ERROR-001: Submit form with network error**
- Steps:
  1. Simulate network failure
  2. Submit form
- Expected Result: Error message shown, data preserved
- Status: ☐

**ERROR-002: Load page with API error**
- Steps:
  1. Backend returns 500 error
  2. Load page
- Expected Result: User-friendly error message shown
- Status: ☐

**ERROR-003: Timeout on long operation**
- Steps:
  1. Trigger long operation
  2. Wait for timeout
- Expected Result: Timeout handled gracefully
- Status: ☐

**ERROR-004: Required field validation**
- Steps:
  1. Submit form with empty required fields
- Expected Result: Validation errors shown
- Status: ☐

**ERROR-005: Email format validation**
- Steps:
  1. Enter invalid email
- Expected Result: Email format error shown
- Status: ☐

**ERROR-006: Date validation**
- Steps:
  1. Enter invalid date
- Expected Result: Date validation error shown
- Status: ☐

**ERROR-007: Duplicate entry error**
- Steps:
  1. Try to create duplicate (e.g., same email)
- Expected Result: Clear error: Already exists
- Status: ☐

---

## 10. Test Execution Guidelines

### 10.1 Test Execution Process

**Setup Phase**
- Ensure test environment is properly configured
- Create all required test user accounts
- Populate test data
- Verify all dependencies (database, Cloudinary, etc.)

**Execution Phase**
- Execute tests in order (Authentication → Admin → Teacher → Student → Parent → Cross-Role)
- Mark status: ✓ Pass, ✗ Fail, ~ Partial, N/A Not Applicable
- Document any failures with screenshots
- Note any unexpected behavior

**Reporting Phase**
- Compile test results summary
- Document all bugs found with reproduction steps
- Prioritize issues (Critical, High, Medium, Low)
- Create bug reports in issue tracking system

### 10.2 Bug Report Template

**Bug ID**: BUG-XXX
**Test ID**: [Related Test ID]
**Title**: [Brief description]
**Severity**: [Critical/High/Medium/Low]
**Priority**: [P0/P1/P2/P3]

**Steps to Reproduce**:
1.
2.
3.

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots**:
[Attach screenshots]

**Environment**:
- Browser: [Chrome 120.0]
- OS: [Windows 11]
- Screen Size: [1920x1080]
- Role: [Admin/Teacher/Student/Parent]

**Additional Notes**:
[Any other relevant information]

### 10.3 Test Result Summary Template

**Test Execution Summary**

**Test Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: [Production/Staging/Development]

**Overall Statistics**
- Total Test Cases: [XXX]
- Passed: [XXX] (XX%)
- Failed: [XXX] (XX%)
- Blocked: [XXX] (XX%)
- Not Executed: [XXX] (XX%)

**Results by Module**
1. Authentication: XX/XX Passed (XX%)
2. Admin Functions: XX/XX Passed (XX%)
3. Teacher Functions: XX/XX Passed (XX%)
4. Student Functions: XX/XX Passed (XX%)
5. Parent Functions: XX/XX Passed (XX%)
6. Cross-Role: XX/XX Passed (XX%)
7. Multilingual: XX/XX Passed (XX%)

**Critical Issues Found**
1. [Issue description] - [Bug ID]
2. [Issue description] - [Bug ID]

**Recommendations**
1.
2.
3.

**Sign-off**
Tester: _____________________ Date: _____
QA Lead: ____________________ Date: _____

---

## 11. Regression Testing Checklist

### Core Functionality (Always Test)
- ☐ User login/logout
- ☐ Password change
- ☐ Create/edit/delete major entities (students, teachers, classes)
- ☐ Homework creation and submission
- ☐ Attendance taking
- ☐ Grade viewing
- ☐ File uploads
- ☐ Language switching

### After Major Updates
- ☐ Re-run all affected test sections
- ☐ Verify database migrations
- ☐ Check API backwards compatibility
- ☐ Test cross-browser compatibility
- ☐ Verify mobile responsiveness

---

## Appendix: Test Data Requirements

### Test Users
- **Admin**: admin@madrasti.test / Password123!
- **Teacher 1**: teacher1@madrasti.test / Password123!
- **Teacher 2**: teacher2@madrasti.test / Password123!
- **Student 1-10**: student1@madrasti.test - student10@madrasti.test / Password123!
- **Parent 1-3**: parent1@madrasti.test - parent3@madrasti.test / Password123!
- **Staff 1**: staff1@madrasti.test / Password123!

### Sample Data
- **Academic Year**: 2024-2025 (Current)
- **Educational Levels**: Preschool, Primary, Lower Secondary, Upper Secondary
- **Grades**: At least 3 grades across different levels
- **Subjects**: Arabic, French, English, Math, Science, History, Geography, PE
- **Classes**: At least 5 classes with 10+ students each
- **Rooms**: 10 rooms with different types
- **Lessons**: At least 10 lessons with resources
- **Homework**: 5 active assignments
- **Exercises**: 5 exercises with various question types

---

**End of Part 2**

**This completes the Manual Test Plan for Madrasti 2.0**

*This document should be updated regularly as new features are added to the platform.*
