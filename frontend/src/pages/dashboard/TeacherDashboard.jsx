import React from 'react'
import { DashboardLayout } from '../../components/layout/Layout'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'

// Import Teacher Dashboard Components
import TodayOverview from '../../components/dashboard/teacher/TodayOverview'
import AttendanceSession from '../../components/dashboard/teacher/AttendanceSession'
import AssignmentManagement from '../../components/dashboard/teacher/AssignmentManagement'
import ClassAnalytics from '../../components/dashboard/teacher/ClassAnalytics'
import StudentProgress from '../../components/dashboard/teacher/StudentProgress'
import QuickActions from '../../components/dashboard/teacher/QuickActions'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl text-green font-bold tracking-tight">
              {t('common.welcome')}, {user?.first_name}! 📚
            </h1>
            <h1 className="text-3xl font-bold tracking-tight">
              teacher 📚
            </h1>
            <p className="text-muted-foreground">
              {t('teacher.dashboard.subtitle')}
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Overview */}
            <TodayOverview />
            
            {/* Assignment Management */}
            <AssignmentManagement />
            
            {/* Class Analytics */}
            <ClassAnalytics />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Attendance Session */}
            <AttendanceSession />
            
            {/* Student Progress */}
            <StudentProgress />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TeacherDashboard