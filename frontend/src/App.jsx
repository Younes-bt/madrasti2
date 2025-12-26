import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'

// Import page components
import LoginPage from './pages/auth/LoginPage'
import FirstLoginPage from './pages/auth/FirstLoginPage'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import StudentHome from './pages/student/StudentHome'
import StudentProfileOverview from './pages/student/StudentProfileOverview'
import StudentProgressPageStudent from './pages/student/StudentProgressPage'
import StudentTimetablePage from './pages/student/StudentTimetablePage'
import StudentAttendanceReport from './pages/student/StudentAttendanceReport'
import StudentProfileSettings from './pages/student/StudentProfileSettings'
import StudentAttendanceHistory from './pages/student/StudentAttendanceHistory'
import StudentLessonsPage from './pages/student/StudentLessonsPage'
import StudentViewLessonPage from './pages/student/StudentViewLessonPage'
import StudentExerciseEntryPage from './pages/student/StudentExerciseEntryPage'
import StudentMyExercisesPage from './pages/student/StudentMyExercisesPage'
import StudentPointsPage from './pages/student/StudentPointsPage'
import StudentHomeworkPendingPage from './pages/student/StudentHomeworkPendingPage'
import StudentHomeworkWorkPage from './pages/student/StudentHomeworkWorkPage'
import StudentHomeworkCompletedPage from './pages/student/StudentHomeworkCompletedPage'
import StudentHomeworkGradesPage from './pages/student/StudentHomeworkGradesPage'
import StudentHomeworkFeedbackPage from './pages/student/StudentHomeworkFeedbackPage'
import StudentHomework from './pages/student/StudentHomework'
import TeacherHome from './pages/teacher/TeacherHome'
import StudentSubmissionReviewPage from './pages/student/StudentSubmissionReviewPage'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherProfileOverviewPage from './pages/teacher/TeacherProfileOverviewPage'
import EditTeacherProfilePage from './pages/teacher/EditTeacherProfilePage'
import TeacherMyClassesPage from './pages/teacher/TeacherMyClassesPage'
import TeacherMySchedulePage from './pages/teacher/TeacherMySchedulePage'
import TeacherAttendancePage from './pages/teacher/TeacherAttendancePage'
import AttendanceHistoryPage from './pages/teacher/AttendanceHistoryPage'
import TeacherViewStudentPage from './pages/teacher/ViewStudentPage'
import StudentProgressPageTeacher from './pages/teacher/StudentProgressPage'
import TeacherLessonsPage from './pages/teacher/LessonsPage'
import AddLessonPage from './pages/teacher/AddLessonPage'
import EditLessonPage from './pages/teacher/EditLessonPage'
import ViewLessonPage from './pages/teacher/ViewLessonPage'
import LessonExercisesPage from './pages/teacher/LessonExercisesPage'
import LessonExerciseManagementPage from './pages/teacher/LessonExerciseManagementPage'
import CreateLessonExercisePage from './pages/teacher/CreateLessonExercisePage'
import EditLessonExercisePage from './pages/teacher/EditLessonExercisePage'
import ViewLessonExercisePage from './pages/teacher/ViewLessonExercisePage'
import AssessmentToolsPage from './pages/teacher/AssessmentToolsPage'

import HomeworkPage from './pages/teacher/HomeworkPage';
import CreateHomeworkPage from './pages/teacher/CreateHomeworkPage'
import ViewHomeworkPage from './pages/teacher/ViewHomeworkPage'
import ExamsPage from './pages/teacher/ExamsPage'
import GradingPage from './pages/teacher/GradingPage'
import GradeSubmissionPage from './pages/teacher/GradeSubmissionPage'
import ParentDashboard from './pages/dashboard/ParentDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'

// Import admin pages
import SchoolDetailsPage from './pages/admin/SchoolDetailsPage'
import UpdateSchoolDetailsPage from './pages/admin/UpdateSchoolDetailsPage'
import StaffManagementPage from './pages/admin/StaffManagementPage'
import AddStaffPage from './pages/admin/AddStaffPage'
import EditStaffPage from './pages/admin/EditStaffPage'
import ViewStaffPage from './pages/admin/ViewStaffPage'
import TeachersManagementPage from './pages/admin/TeachersManagementPage'
import AddTeacherPage from './pages/admin/AddTeacherPage'
import EditTeacherPage from './pages/admin/EditTeacherPage'
import ViewTeacherPage from './pages/admin/ViewTeacherPage'
import StudentsManagementPage from './pages/admin/StudentsManagementPage'
import AddStudentPage from './pages/admin/AddStudentPage'
import EditStudentPage from './pages/admin/EditStudentPage'
import ViewStudentPage from './pages/admin/ViewStudentPage'
import StudentProgressPageAdmin from './pages/admin/StudentProgressPage'
import BulkImportStudentsPage from './pages/admin/BulkImportStudentsPage'
import ParentsManagementPage from './pages/admin/ParentsManagementPage'
import AddParentPage from './pages/admin/AddParentPage'
import EditParentPage from './pages/admin/EditParentPage'
import ViewParentPage from './pages/admin/ViewParentPage'
import RoomsManagementPage from './pages/admin/RoomsManagementPage'
import AddRoomPage from './pages/admin/AddRoomPage'
import EditRoomPage from './pages/admin/EditRoomPage'
import ViewRoomPage from './pages/admin/ViewRoomPage'
import EquipmentManagementPage from './pages/admin/EquipmentManagementPage'
import ViewEquipmentPage from './pages/admin/ViewEquipmentPage'
import AcademicYearsPage from './pages/admin/AcademicYearsPage'
import AddAcademicYearPage from './pages/admin/AddAcademicYearPage'
import EditAcademicYearPage from './pages/admin/EditAcademicYearPage'
import ViewAcademicYearPage from './pages/admin/ViewAcademicYearPage'
import VehiclesManagementPage from './pages/admin/VehiclesManagementPage'
import ViewVehiclePage from './pages/admin/ViewVehiclePage'
import ViewVehicleMaintenanceRecordPage from './pages/admin/ViewVehicleMaintenanceRecordPage'
import ViewVehicleGasoilRecordPage from './pages/admin/ViewVehicleGasoilRecordPage'
import AddVehicleGasoilRecordPage from './pages/admin/AddVehicleGasoilRecordPage'
import AddVehicleMaintenanceRecordPage from './pages/admin/AddVehicleMaintenanceRecordPage'
import AddVehiclePage from './pages/admin/AddVehiclePage'
import EducationalLevelsPage from './pages/admin/EducationalLevelsPage'
import AddEducationalLevelPage from './pages/admin/AddEducationalLevelPage'
import EditEducationalLevelPage from './pages/admin/EditEducationalLevelPage'
import ViewEducationalLevelPage from './pages/admin/ViewEducationalLevelPage'
import GradesPage from './pages/admin/GradesPage'
import AddGradePage from './pages/admin/AddGradePage'
import EditGradePage from './pages/admin/EditGradePage'
import ViewGradePage from './pages/admin/ViewGradePage'
import TracksPage from './pages/admin/TracksPage'
import AddTrackPage from './pages/admin/AddTrackPage'
import EditTrackPage from './pages/admin/EditTrackPage'
import ViewTrackPage from './pages/admin/ViewTrackPage'
import ClassesPage from './pages/admin/ClassesPage'
import AddClassPage from './pages/admin/AddClassPage'
import EditClassPage from './pages/admin/EditClassPage'
import ViewClassPage from './pages/admin/ViewClassPage'
import SubjectsPage from './pages/admin/SubjectsPage'
import AddSubjectPage from './pages/admin/AddSubjectPage'
import EditSubjectPage from './pages/admin/EditSubjectPage'
import ViewSubjectPage from './pages/admin/ViewSubjectPage'
import TimetablesPage from './pages/admin/TimetablesPage'
import AddTimetablePage from './pages/admin/AddTimetablePage'
import EditTimetablePage from './pages/admin/EditTimetablePage'
import ViewTimetablePage from './pages/admin/ViewTimetablePage'
import LessonsManagementPage from './pages/admin/LessonsManagementPage'
import CreateLessonPage from './pages/admin/CreateLessonPage'
import AdminEditLessonPage from './pages/admin/EditLessonPage'
import AdminViewLessonPage from './pages/admin/ViewLessonPage'
import ExercisesManagementPage from './pages/admin/ExercisesManagementPage'
import AddExercisePage from './pages/admin/AddExercisePage'
import EditExercisePage from './pages/admin/EditExercisePage'
import ViewExercisePage from './pages/admin/ViewExercisePage'
import AttendanceReportsPage from './pages/admin/AttendanceReportsPage'
import AcademicPerformanceReportsPage from './pages/admin/AcademicPerformanceReportsPage'
import FeeSetupPage from './pages/admin/finance/FeeSetupPage'
import InvoicesPage from './pages/admin/finance/InvoicesPage'
import InvoiceDetailsPage from './pages/admin/finance/InvoiceDetailsPage'
import PaymentsPage from './pages/admin/finance/PaymentsPage'
import AdminLogs from './pages/admin/log/AdminLogs'

// Import feature pages
import LessonsPage from './pages/lessons/LessonsPage'
import AttendancePage from './pages/attendance/AttendancePage'
import RewardsPage from './pages/rewards/RewardsPage'

// Import Communication pages
import MessagesPage from './pages/communication/MessagesPage'
import AnnouncementsPage from './pages/communication/AnnouncementsPage'

// Import Parent Finance pages
import FinancialStatusPage from './pages/parent/finance/FinancialStatusPage'

// Import auth components
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

// Dashboard redirect component - redirects to appropriate dashboard based on user role
const DashboardRedirect = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  const roleRoutes = {
    'ADMIN': '/admin',
    'TEACHER': '/teacher',
    'STUDENT': '/student/home',
    'PARENT': '/parent',
    'STAFF': '/admin', // Staff users go to admin dashboard
    'DRIVER': '/admin' // Driver users go to admin dashboard
  }

  const redirectPath = roleRoutes[user.role] || '/student'
  return <Navigate to={redirectPath} replace />
}

// AppRoutes component that contains all routing logic
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/first-login"
        element={
          <ProtectedRoute requireAuth={true}>
            <FirstLoginPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect to role-based dashboard */}
      <Route path="/" element={<DashboardRedirect />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Role-based protected routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/home"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/homework"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentHomework />
          </ProtectedRoute>
        }
      />

      {/* Student Profile Routes */}
      <Route
        path="/student/profile/overview"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentProfileOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/progress"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentProgressPageStudent />
          </ProtectedRoute>
        }
      />

      {/* Student Timetable */}
      <Route
        path="/student/timetable"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentTimetablePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance/report"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentAttendanceReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance/history"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentAttendanceHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile/settings"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentProfileSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/lessons"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentLessonsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/lessons/:lessonId"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentViewLessonPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/exercises"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentMyExercisesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/exercises/:exerciseId"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentExerciseEntryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/achievements/points"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentPointsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/homework/pending"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentHomeworkPendingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/homework/:id"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentHomeworkWorkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/homework/completed"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentHomeworkCompletedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/homework/grades"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentHomeworkGradesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/homework/feedback"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentHomeworkFeedbackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/homework/submission/:submissionId"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <StudentSubmissionReviewPage />
          </ProtectedRoute>
        }
      />

      {/* Student Communication Routes */}
      <Route
        path="/student/communication/messages"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <MessagesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/communication/announcements"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/home"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher Profile Routes */}
      <Route
        path="/teacher/profile/overview"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherProfileOverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile/edit"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <EditTeacherProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile/my-classes"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherMyClassesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile/my-schedule"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherMySchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherAttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance/history"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <AttendanceHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students/view/:studentId"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherViewStudentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students/:studentId/progress"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <StudentProgressPageTeacher />
          </ProtectedRoute>
        }
      />

      {/* Teacher Content Management Routes */}
      <Route
        path="/teacher/content/lessons"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherLessonsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lessons/add"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <AddLessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lessons/edit/:id"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <EditLessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lessons/view/:id"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <ViewLessonPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher Exercise Routes */}
      <Route
        path="/teacher/content/lesson-exercises"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <LessonExercisesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lessons/:lessonId/exercises"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <LessonExerciseManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lessons/:lessonId/exercises/add"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <CreateLessonExercisePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lesson-exercises/create"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <CreateLessonExercisePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lesson-exercises/:id"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <ViewLessonExercisePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content/lesson-exercises/:id/edit"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <EditLessonExercisePage />
          </ProtectedRoute>
        }
      />

      {/* Teacher Assignments & Assessment Routes */}
      <Route
        path="/teacher/assignments/assessment-tools"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <AssessmentToolsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/assignments/homework"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <HomeworkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/homework/create"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <CreateHomeworkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/homework/view/:id"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <ViewHomeworkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/homework/edit/:id"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <CreateHomeworkPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments/exams"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <ExamsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments/grading"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <GradingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/grading/:submissionId"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <GradeSubmissionPage />
          </ProtectedRoute>
        }
      />

      {/* Teacher Communication Routes */}
      <Route
        path="/teacher/communication/messages"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <MessagesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/communication/announcements"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Communication Routes */}
      <Route
        path="/admin/communication/messages"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <MessagesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/communication/announcements"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/parent"
        element={
          <ProtectedRoute requiredRoles={['PARENT']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Parent Finance Routes */}
      <Route
        path="/parent/finance"
        element={
          <ProtectedRoute requiredRoles={['PARENT']}>
            <FinancialStatusPage />
          </ProtectedRoute>
        }
      />

      {/* Communication Routes - Available to all authenticated users */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute requireAuth={true}>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute requireAuth={true}>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF', 'DRIVER']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin School Management Routes */}
      <Route
        path="/admin/school-management/school-details"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <SchoolDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/school-details/edit"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <UpdateSchoolDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/staff"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <StaffManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/staff/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddStaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/staff/edit/:staffId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditStaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/staff/view/:staffId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewStaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/teachers"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <TeachersManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/teachers/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddTeacherPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/teachers/edit/:teacherId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditTeacherPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/teachers/view/:teacherId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewTeacherPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/students"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <StudentsManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/students/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddStudentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/students/bulk-import"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <BulkImportStudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/students/edit/:studentId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditStudentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/students/view/:studentId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewStudentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/students/:studentId/progress"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <StudentProgressPageAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/parents"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ParentsManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/parents/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddParentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/parents/edit/:parentId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditParentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/parents/view/:parentId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewParentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/rooms"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <RoomsManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/equipment"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EquipmentManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/equipment/view/:equipmentId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewEquipmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/rooms/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/rooms/edit/:roomId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/rooms/view/:roomId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/vehicles"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <VehiclesManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/vehicles/view/:vehicleId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewVehiclePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/vehicles/:vehicleId/maintenance/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddVehicleMaintenanceRecordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/vehicles/:vehicleId/gasoil/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddVehicleGasoilRecordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/vehicles/:vehicleId/maintenance/:recordId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewVehicleMaintenanceRecordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/vehicles/:vehicleId/gasoil/:refuelId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewVehicleGasoilRecordPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/vehicles/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddVehiclePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/school-management/equipment"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Equipment Management Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />

      {/* Admin Academic Management Routes */}
      <Route
        path="/admin/academic-management/academic-years"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AcademicYearsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/academic-years/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddAcademicYearPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/academic-years/edit/:yearId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditAcademicYearPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/academic-years/view/:yearId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewAcademicYearPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/educational-levels"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EducationalLevelsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/educational-levels/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddEducationalLevelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/educational-levels/edit/:levelId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditEducationalLevelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/educational-levels/view/:levelId"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewEducationalLevelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/grades"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <GradesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/grades/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddGradePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/grades/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewGradePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/grades/:id/edit"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditGradePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/tracks"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <TracksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/tracks/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddTrackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/tracks/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewTrackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/tracks/:id/edit"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditTrackPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/classes"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ClassesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/classes/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddClassPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/classes/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewClassPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/classes/:id/edit"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditClassPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/subjects"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <SubjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/subjects/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddSubjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/subjects/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewSubjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/subjects/:id/edit"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditSubjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timetables"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <TimetablesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timetables/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddTimetablePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timetables/view/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewTimetablePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/timetables/edit/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditTimetablePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/academic-management/timetables"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <TimetablesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Education Management Routes */}
      <Route
        path="/admin/education-management/lessons"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <LessonsManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/lessons/create"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <CreateLessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/lessons/:id/edit"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AdminEditLessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lessons/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AdminViewLessonPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Exercise Management Routes */}
      <Route
        path="/admin/education-management/exercises"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ExercisesManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/exercises/add"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AddExercisePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/exercises/edit/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <EditExercisePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/exercises/view/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <ViewExercisePage />
          </ProtectedRoute>
        }
      />

      {/* Admin Attendance Reports Route */}
      <Route
        path="/admin/reports/attendance"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AttendanceReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Finance Routes */}
      <Route
        path="/admin/finance/setup"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <FeeSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/finance/invoices"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <InvoicesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/finance/invoices/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <InvoiceDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/finance/payments"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <PaymentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/education-management/assignments"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Assignments Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/homework"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Homework Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/exams"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Exams Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/education-management/grading-system"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Grading System Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />

      {/* Admin Reports & Analytics Routes */}
      <Route
        path="/admin/reports/attendance"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Attendance Reports Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports/academic-performance"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AcademicPerformanceReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/reports/academic-performance"
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <AcademicPerformanceReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports/financial"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Financial Reports Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports/custom-builder"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Custom Report Builder Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports/comparative-analysis"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Comparative Analysis Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <AdminLogs />
          </ProtectedRoute>
        }
      />

      {/* Admin Communications Routes */}
      <Route
        path="/admin/communications/announcements"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Announcements Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/communications/email-templates"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Email Templates Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/communications/parent-notifications"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Parent Notifications Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/communications/emergency-alerts"
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Emergency Alerts Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />

      {/* Admin System Settings Routes */}
      <Route
        path="/admin/settings/general"
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <div>General Settings Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/permissions"
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <div>User Permissions Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/integrations"
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <div>Integration Settings Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings/backup-restore"
        element={
          <ProtectedRoute requiredRoles={['ADMIN']}>
            <div>Backup & Restore Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />

      {/* Feature pages - accessible to all authenticated users */}
      <Route
        path="/lessons"
        element={
          <ProtectedRoute requiredRoles={['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'STAFF']}>
            <LessonsPage />
          </ProtectedRoute>
        }
      />

      {/* Student Exercise Routes */}
      <Route
        path="/exercises"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <div>Student Exercises Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:id"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <div>Exercise Details Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:id/practice"
        element={
          <ProtectedRoute requiredRoles={['STUDENT']}>
            <div>Exercise Practice Page - Coming Soon</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/homework"
        element={
          <ProtectedRoute requiredRoles={['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'STAFF']}>
            <HomeworkPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute requiredRoles={['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'STAFF', 'DRIVER']}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rewards"
        element={
          <ProtectedRoute requiredRoles={['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'STAFF']}>
            <RewardsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to appropriate dashboard */}
      <Route path="*" element={<DashboardRedirect />} />
    </Routes >
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App




