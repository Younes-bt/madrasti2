# Phase 2 Implementation Plan: The Analytics Engine

**Goal**: Build the "Brain" of the system. Transform raw data (grades, attendance, logs) into meaningful performance metrics.

---

## The Analytics Module (`backend/analytics`)
**Objective**: Aggregation logic that runs in the background, so reports load instantly.

### 1. Database Schema (Models)
We need "Summary Tables" that are updated incrementally.

*   **`StudentDailySummary`**
    *   `student`: Link to Student.
    *   `date`: Date.
    *   `attendance_status`: `PRESENT`, `ABSENT`, `LATE`.
    *   `homework_completed`: Boolean (Did they finish due homework?).
    *   `behavior_score`: Integer (Optional, teacher input).
*   **`StudentTermPerformance`** (The "Report Card" Model)
    *   `student`: Link to Student.
    *   `term`: Link to AcademicTerm (Trimester 1, etc.).
    *   `subject`: Link to Subject.
    *   `average_grade`: Decimal.
    *   `attendance_percentage`: Decimal.
    *   `rank`: Integer (e.g., 5th in class).
    *   `teacher_comment`: Text.
*   **`TeacherPerformanceMetric`**
    *   `teacher`: Link to Teacher.
    *   `week_start`: Date.
    *   `classes_taught`: Integer.
    *   `homeworks_assigned`: Integer.
    *   `parent_communications`: Integer (Count from Communication App).
    *   `average_student_attendance`: Decimal.

### 2. The Logic (Signals & Tasks)
We cannot calculate everything on every page load. We use **Signals** and **Scheduled Tasks**.

*   **Real-time Updates (Signals)**:
    *   *Trigger*: `Attendance.save()` -> *Action*: Update `StudentDailySummary`.
    *   *Trigger*: `HomeworkSubmission.grade.save()` -> *Action*: Recalculate `StudentTermPerformance.average_grade`.
*   **Weekly/Nightly Jobs (Management Commands)**:
    *   `calculate_class_ranks`: Runs every night to update student rankings.
    *   `generate_teacher_metrics`: Runs every Friday to sum up teacher activity.

### 3. API Endpoints
*   `GET /api/analytics/student/{id}/overview/`: Returns JSON for charts (Grades vs Time).
*   `GET /api/analytics/teacher/my-performance/`: Returns teacher's own stats.
*   `GET /api/analytics/admin/school-health/`: Global stats (Total revenue, Total attendance).

---

## Execution Steps

1.  **Setup**: Create `analytics` app.
2.  **Models**: Define the summary tables.
3.  **Signals**: Write the logic to catch updates from `homework` and `attendance` apps.
4.  **Management Commands**: Write scripts for heavy calculations (Ranking).
5.  **Testing**: Simulate a week of school (create fake attendance/grades) and verify the summaries are accurate.

**Estimated Timeline**: 1.5 Weeks
