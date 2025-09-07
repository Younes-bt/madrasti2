import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'

// Import page components
import LoginPage from './pages/auth/LoginPage'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import ParentDashboard from './pages/dashboard/ParentDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'

// Import admin pages
import SchoolDetailsPage from './pages/admin/SchoolDetailsPage'
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
import ParentsManagementPage from './pages/admin/ParentsManagementPage'
import AddParentPage from './pages/admin/AddParentPage'
import EditParentPage from './pages/admin/EditParentPage'
import ViewParentPage from './pages/admin/ViewParentPage'

// Import feature pages
import LessonsPage from './pages/lessons/LessonsPage'
import AssignmentsPage from './pages/homework/AssignmentsPage'
import AttendancePage from './pages/attendance/AttendancePage'
import RewardsPage from './pages/rewards/RewardsPage'

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
    'STUDENT': '/student', 
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
        path="/teacher" 
        element={
          <ProtectedRoute requiredRoles={['TEACHER']}>
            <TeacherDashboard />
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
            <div>Rooms Management Page - Coming Soon</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/school-management/vehicles" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Vehicles Management Page - Coming Soon</div>
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
            <div>Academic Years Page - Coming Soon</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/academic-management/educational-levels" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Educational Levels Page - Coming Soon</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/academic-management/grades" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Grades Page - Coming Soon</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/academic-management/classes" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Classes Page - Coming Soon</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/academic-management/subjects" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Subjects Page - Coming Soon</div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/academic-management/timetables" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Timetables Page - Coming Soon</div>
          </ProtectedRoute>
        } 
      />

      {/* Admin Education Management Routes */}
      <Route 
        path="/admin/education-management/lessons" 
        element={
          <ProtectedRoute requiredRoles={['ADMIN', 'STAFF']}>
            <div>Lessons/Courses Page - Coming Soon</div>
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
            <div>Academic Performance Reports Page - Coming Soon</div>
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
      
      <Route 
        path="/homework" 
        element={
          <ProtectedRoute requiredRoles={['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'STAFF']}>
            <AssignmentsPage />
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
    </Routes>
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