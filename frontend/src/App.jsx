import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'

// Import page components
import LoginPage from './pages/auth/LoginPage'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import ParentDashboard from './pages/dashboard/ParentDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'

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
          </AuthProvider>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App