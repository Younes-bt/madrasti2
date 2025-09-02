import React from 'react'
import { DashboardLayout } from '../../components/layout/Layout'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'

// Import Student Dashboard Components
import StudentOverview from '../../components/dashboard/student/StudentOverview'
import StudyProgress from '../../components/dashboard/student/StudyProgress'
import AssignmentsList from '../../components/dashboard/student/AssignmentsList'
import RecentAchievements from '../../components/dashboard/student/RecentAchievements'
import AttendanceHistory from '../../components/dashboard/student/AttendanceHistory'
import QuickActions from '../../components/dashboard/student/QuickActions'

const StudentDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('common.welcome')}, {user?.first_name}! 🎯
            </h1>
            <h1 className="text-3xl font-bold tracking-tight">
             Student! 🎯
            </h1>
            <p className="text-muted-foreground">
              {t('student.dashboard.subtitle')}
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Student Overview with Gamification */}
            <StudentOverview />
            
            {/* Assignments List */}
            <AssignmentsList />
            
            {/* Study Progress */}
            <StudyProgress />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent Achievements */}
            <RecentAchievements />
            
            {/* Attendance History */}
            <AttendanceHistory />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard