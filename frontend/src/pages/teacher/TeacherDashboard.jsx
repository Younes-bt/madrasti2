import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  Calendar, 
  MessageSquare,
  Plus,
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react'
import { cn } from '../../lib/utils'

const TeacherDashboard = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()

  // Mock data for dashboard statistics
  const dashboardStats = [
    {
      title: t('teacherSidebar.profile.myClasses'),
      value: '5',
      subtitle: t('common.total'),
      icon: Users,
      color: 'bg-blue-500',
      trend: '+2 this year'
    },
    {
      title: t('teacherSidebar.content.lessons'),
      value: '32',
      subtitle: t('common.published'),
      icon: BookOpen,
      color: 'bg-green-500',
      trend: '+8 this month'
    },
    {
      title: t('teacherSidebar.assignments.assignments'),
      value: '18',
      subtitle: t('status.pending'),
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      trend: '5 due today'
    },
    {
      title: t('teacherSidebar.students.myStudents'),
      value: '127',
      subtitle: t('common.total'),
      icon: Users,
      color: 'bg-purple-500',
      trend: 'Across all classes'
    }
  ]

  const quickActions = [
    {
      title: 'Create New Lesson',
      description: 'Start creating a new lesson for your classes',
      icon: BookOpen,
      action: () => console.log('Navigate to create lesson'),
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Add Assignment',
      description: 'Create and assign homework to students',
      icon: ClipboardCheck,
      action: () => console.log('Navigate to create assignment'),
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Take Attendance',
      description: 'Mark attendance for today\'s classes',
      icon: Users,
      action: () => console.log('Navigate to attendance'),
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    },
    {
      title: 'View Analytics',
      description: 'Check your students\' performance',
      icon: BarChart3,
      action: () => console.log('Navigate to analytics'),
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  ]

  const recentActivity = [
    {
      title: 'Math Assignment Submitted',
      description: '15 students submitted their algebra homework',
      time: '2 hours ago',
      icon: ClipboardCheck,
      color: 'text-green-600'
    },
    {
      title: 'New Message from Parent',
      description: 'Parent inquiry about student progress',
      time: '4 hours ago',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Class Schedule Updated',
      description: 'Physics class moved to Room 204',
      time: '1 day ago',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      title: 'Quiz Results Ready',
      description: 'Chemistry quiz results are ready for review',
      time: '2 days ago',
      icon: BarChart3,
      color: 'text-purple-600'
    }
  ]

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.dashboard')}
      subtitle={`Welcome back, ${user?.first_name || 'Teacher'}! Here's what's happening in your classes today.`}
      showRefreshButton={true}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className={cn(
                  'p-2 rounded-lg',
                  stat.color,
                  'text-white'
                )}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn('ml-4', isRTL && 'mr-4 ml-0')}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index} 
                    className={cn(
                      'cursor-pointer transition-all duration-200',
                      action.color
                    )}
                    onClick={action.action}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <action.icon className="h-8 w-8 text-gray-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={cn('p-1 rounded', activity.color)}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Schedule Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Mathematics</h3>
                <span className="text-sm text-muted-foreground">Grade 10A</span>
              </div>
              <p className="text-sm text-muted-foreground">8:00 AM - 9:00 AM</p>
              <p className="text-sm text-muted-foreground">Room 101</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Physics</h3>
                <span className="text-sm text-muted-foreground">Grade 11B</span>
              </div>
              <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</p>
              <p className="text-sm text-muted-foreground">Room 204</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Chemistry</h3>
                <span className="text-sm text-muted-foreground">Grade 12A</span>
              </div>
              <p className="text-sm text-muted-foreground">2:00 PM - 3:00 PM</p>
              <p className="text-sm text-muted-foreground">Lab 301</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TeacherPageLayout>
  )
}

export default TeacherDashboard