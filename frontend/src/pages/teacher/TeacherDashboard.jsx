import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import attendanceService from '../../services/attendance'
import lessonsService from '../../services/lessons'
import homeworkService from '../../services/homework'

const TeacherDashboard = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Live dashboard stats
  const [stats, setStats] = useState({
    classes: null,
    lessons: null,
    homework: null,
  })
  const [todaySessions, setTodaySessions] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoadingStats(true)

        // Classes: dedupe teacher's sessions into unique classes
        let classesCount = 0
        try {
          const sessionsRes = await attendanceService.getTimetableSessions({ my_sessions: true })
          const sessions = sessionsRes.results || sessionsRes || []
          const unique = new Set()
          sessions.forEach(s => {
            const key = s.timetable_id || s.school_class_id || s.class_name || s.school_class_name
            if (key) unique.add(key)
          })
          classesCount = unique.size
        } catch (e) {
          // Fallback to teacher_classes endpoint
          try {
            const classesRes = await attendanceService.getTeacherClasses({})
            const arr = classesRes.results || classesRes || []
            classesCount = Array.isArray(arr) ? arr.length : 0
          } catch {
            classesCount = 0
          }
        }

        // Lessons total (scoped by backend permissions)
        let lessonsCount = 0
        try {
          const lessonsRes = await lessonsService.getLessons({ page_size: 1 })
          lessonsCount = lessonsRes.count || 0
        } catch {
          lessonsCount = 0
        }

        // Homework total (published or all depending on backend default)
        let homeworkCount = 0
        try {
          const hwRes = await homeworkService.getHomeworks({ page_size: 1 })
          homeworkCount = hwRes.total || hwRes.count || 0
        } catch {
          homeworkCount = 0
        }

        // Today's sessions for quick preview
        try {
          const todayRes = await attendanceService.getTodaySessions({ my_sessions: true })
          const sessions = todayRes.results || todayRes || []
          setTodaySessions(Array.isArray(sessions) ? sessions.slice(0, 6) : [])
        } catch {
          setTodaySessions([])
        }

        setStats({ classes: classesCount, lessons: lessonsCount, homework: homeworkCount })
      } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [])

  const dashboardStats = [
    {
      title: t('teacherSidebar.profile.myClasses'),
      value: stats.classes ?? '—',
      subtitle: t('common.total'),
      icon: Users,
      color: 'text-blue-600',
      trend: null
    },
    {
      title: t('teacherSidebar.content.lessons'),
      value: stats.lessons ?? '—',
      subtitle: t('common.total'),
      icon: BookOpen,
      color: 'text-green-600',
      trend: null
    },
    {
      title: t('homework.homework', 'Homework'),
      value: stats.homework ?? '—',
      subtitle: t('common.total'),
      icon: ClipboardCheck,
      color: 'text-orange-600',
      trend: null
    },
    {
      title: `${t('common.today', 'Today')} ${t('common.schedule', 'Schedule')}`,
      value: todaySessions.length,
      subtitle: t('timetables.scheduled', 'Scheduled'),
      icon: Calendar,
      color: 'text-purple-600',
      trend: null
    }
  ]

  const quickActions = [
    {
      title: t('lessons.createLesson', 'Create Lesson'),
      description: t('lessons.createDescription', 'Create a new lesson for students'),
      icon: BookOpen,
      action: () => navigate('/teacher/content/lessons/add'),
      color: ''
    },
    {
      title: t('homework.title', 'Homework Management'),
      description: t('assignments.tooltip', 'Create assignments, homework, and manage grading'),
      icon: ClipboardCheck,
      action: () => navigate('/teacher/homework/create'),
      color: ''
    },
    {
      title: t('navigation.attendance', 'Attendance'),
      description: t('misc.todayOverview', "Today's Overview"),
      icon: Users,
      action: () => navigate('/teacher/attendance'),
      color: ''
    },
    {
      title: t('teacherSidebar.analytics.title', 'Teaching Analytics'),
      description: t('teacherSidebar.analytics.tooltip', 'Analyze class and student performance'),
      icon: BarChart3,
      action: () => navigate('/teacher/analytics/class-performance'),
      color: ''
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
      subtitle={`${t('common.welcome', 'Welcome')}, ${user?.first_name || 'Teacher'}!`}
      showRefreshButton={true}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className={cn(
                  'p-2 rounded-lg bg-muted',
                )}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
                <div className={cn('ml-4', isRTL && 'mr-4 ml-0')}>
                  <p className="text-2xl font-bold">{loadingStats ? '…' : stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
              {stat.trend && (
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{stat.trend}</span>
                </div>
              )}
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
                {t('common.quickActions', 'Quick Actions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index} 
                    className={cn('cursor-pointer transition-colors border hover:bg-accent')}
                    onClick={action.action}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <action.icon className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold text-foreground">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
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
                {t('common.recentActivity', 'Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
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
                {t('common.viewAll', 'View All')}
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
            {`${t('common.today', 'Today')} ${t('common.schedule', 'Schedule')}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaySessions.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t('teacherSidebar.myScheduleDesc', 'View your personal teaching schedule and timetable')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todaySessions.slice(0, 3).map((s, i) => (
                <div key={i} className="p-4 border rounded-lg bg-card">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{s.subject_name || t('subjects', 'Subject')}</h3>
                    <span className="text-sm text-muted-foreground">{s.class_name || s.school_class_name || ''}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.start_time} - {s.end_time}</p>
                  {s.room_name && (
                    <p className="text-sm text-muted-foreground">{s.room_name}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TeacherPageLayout>
  )
}

export default TeacherDashboard
