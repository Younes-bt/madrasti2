import React, { useState, useEffect } from 'react'
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
  const [dashboardData, setDashboardData] = useState({
    systemOverview: null,
    userStats: null,
    attendanceReport: null,
    homeworkAnalytics: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }))
      
      const endpoints = [
        '/api/schools/analytics/overview/',
        '/api/users/stats/',
        '/api/attendance/reports/school_summary/',
        '/api/homework/analytics/school_performance/'
      ]

      const requests = endpoints.map(endpoint => 
        fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.ok ? res.json() : null).catch(() => null)
      )

      const [systemOverview, userStats, attendanceReport, homeworkAnalytics] = await Promise.all(requests)

      setDashboardData({
        systemOverview,
        userStats,
        attendanceReport,
        homeworkAnalytics,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data'
      }))
    }
  }

  const refreshData = () => {
    fetchDashboardData()
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('common.welcome')}, {user?.first_name} - {t('admin.systemAdministrator')}
            </h1>
            <p className="text-muted-foreground">
              {t('admin.dashboardDescription')}
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={dashboardData.loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {dashboardData.loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.refreshing')}
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('common.refresh')}
              </>
            )}
          </button>
        </div>

        {/* Error State */}
        {dashboardData.error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {t('common.error')}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{dashboardData.error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={refreshData}
                    className="bg-red-100 px-2 py-1.5 rounded-md text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-medium"
                  >
                    {t('common.tryAgain')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        <div className="flex flex-col gap-6">
          {/* System Overview Widget */}
          <SystemOverview 
            data={dashboardData.systemOverview}
            userStats={dashboardData.userStats}
            attendanceData={dashboardData.attendanceReport}
            loading={dashboardData.loading}
          />

          {/* Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SchoolStatistics 
              data={dashboardData.homeworkAnalytics}
              loading={dashboardData.loading}
            />
            <SystemHealth 
              data={dashboardData.systemOverview}
              loading={dashboardData.loading}
            />
          </div>

          {/* User Management Section */}
          <UserManagement 
            userStats={dashboardData.userStats}
            loading={dashboardData.loading}
          />

          {/* Actions and Activity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickActions 
              onRefresh={refreshData}
            />
            <RecentActivity 
              data={dashboardData}
              loading={dashboardData.loading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard