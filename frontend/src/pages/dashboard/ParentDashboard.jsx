import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { DashboardLayout } from '../../components/layout/Layout'
import ChildrenOverview from '../../components/dashboard/parent/ChildrenOverview'
import AttendanceTracking from '../../components/dashboard/parent/AttendanceTracking'
import AcademicProgress from '../../components/dashboard/parent/AcademicProgress'
import UpcomingEvents from '../../components/dashboard/parent/UpcomingEvents'
import CommunicationCenter from '../../components/dashboard/parent/CommunicationCenter'
import QuickActions from '../../components/dashboard/parent/QuickActions'

const ParentDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('common.welcome')}, {user?.first_name}! 👨‍👩‍👧‍👦
            </h1>
            <p className="text-muted-foreground">
              {t('parent.dashboardDescription')}
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Children Overview */}
            <ChildrenOverview />
            
            {/* Attendance Tracking */}
            <AttendanceTracking />
            
            {/* Academic Progress */}
            <AcademicProgress />
          </div>

          {/* Right Column - Secondary Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upcoming Events */}
            <UpcomingEvents />
            
            {/* Communication Center */}
            <CommunicationCenter />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ParentDashboard