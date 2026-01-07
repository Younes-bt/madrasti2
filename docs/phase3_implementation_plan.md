# Phase 3 Implementation Plan: The Reporting UI

**Goal**: Visualize the data. This is what the users (Parents, Students, Admins) actually *see*.

---

## Part A: The Interactive Dashboards (Frontend)
**Objective**: Beautiful, responsive charts and tables using `Recharts` or `Chart.js`.

### 1. Student/Parent "My Performance" Page
*   **Header**: Student Name, Class, Current Rank (e.g., "5th / 24").
*   **The "Radar Chart"**: Visualizing strengths (Math vs Arts vs Languages).
*   **Attendance Graph**: Bar chart of absences per month.
*   **Timeline**: Scrollable list of recent achievements ("Aced Math Quiz", "Perfect Attendance Week").
*   **Download Button**: "Download Trimester 1 Report Card (PDF)".

### 2. Teacher "Class Insight" Page
*   **At-Risk List**: Table of students with dropping grades or high absence.
*   **Subject Distribution**: Histogram showing how the class performed on the last exam (Bell curve).
*   **Engagement Meter**: Metric showing homework completion rate for the whole class.

### 3. Admin "School Pulse" Page
*   **Financial Health**: Total Tuition Collected vs Outstanding.
*   **Enrollment Stats**: Students per Grade/Level.
*   **Teacher Activity**: Leaderboard of most active teachers (based on logins/uploads).

---

## Part B: The Official Documents (PDF Generation)
**Objective**: Generate official, printable school documents.

### 1. Technology Stack
*   **Backend**: `WeasyPrint` or `ReportLab` (Python).
*   **Frontend**: `react-pdf` (Optional, but backend is better for official records).

### 2. Document Types
*   **Official Report Card**:
    *   School Header (Logo, Address).
    *   Student Info.
    *   Grades Table (Subject | Grade | Coefficient | Weighted Grade).
    *   Averages (Student Avg | Class Avg | Highest Avg).
    *   Director's Signature area.
*   **Financial Receipt**:
    *   Invoice Details.
    *   "PAID" Watermark.
*   **Attendance Certificate**: Proof of attendance for legal purposes.

---

## Execution Steps

1.  **Frontend Components**: Build the Chart components (Bar, Line, Pie).
2.  **Dashboard Pages**: Assemble the components into the Student/Teacher/Admin pages.
3.  **Backend PDF Service**: Create a utility `utils/pdf_generator.py`.
4.  **API Integration**: Connect the "Download" buttons to the PDF service.
5.  **Polish**: Ensure the UI looks "Premium" (Animations, Transitions).

**Estimated Timeline**: 2 Weeks
