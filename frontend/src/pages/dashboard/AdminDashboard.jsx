import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { DashboardLayout } from '../../components/layout/Layout'
import SystemOverview from '../../components/dashboard/admin/SystemOverview'
import UserManagement from '../../components/dashboard/admin/UserManagement'
import SchoolStatistics from '../../components/dashboard/admin/SchoolStatistics'
import SystemHealth from '../../components/dashboard/admin/SystemHealth'
import RecentActivity from '../../components/dashboard/admin/RecentActivity'
import QuickActions from '../../components/dashboard/admin/QuickActions'

const AdminDashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('common.welcome')}, {user?.first_name}! ⚙️
            </h1>
            <p className="text-muted-foreground">
              {t('admin.dashboardDescription')}
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Primary Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* System Overview */}
            <SystemOverview />
            
            {/* School Statistics */}
            <SchoolStatistics />
            
            {/* User Management Preview */}
            <UserManagement />
          </div>

          {/* Right Column - Secondary Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* System Health */}
            <SystemHealth />
            
            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard