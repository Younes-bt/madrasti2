import React from 'react'
import { DashboardLayout } from '../../components/layout/Layout'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

const DashboardPage = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  const stats = [
    {
      title: t('attendance.totalStudents'),
      value: '1,234',
      description: 'Total enrolled students',
      change: '+2.5%',
    },
    {
      title: t('attendance.presentToday'),
      value: '1,180',
      description: 'Students present today',
      change: '+5.2%',
    },
    {
      title: t('homework.pending'),
      value: '45',
      description: 'Assignments pending review',
      change: '-12.3%',
    },
    {
      title: 'Active Teachers',
      value: '89',
      description: 'Teachers currently active',
      change: '+0.8%',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 px-2 py-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('common.dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {t('common.welcome')}, {user?.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">New student enrolled</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Homework submitted</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Lesson scheduled</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you can perform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full text-left p-2 rounded hover:bg-accent">
                Mark Attendance
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-accent">
                Create Assignment
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-accent">
                Schedule Lesson
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-accent">
                View Reports
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage