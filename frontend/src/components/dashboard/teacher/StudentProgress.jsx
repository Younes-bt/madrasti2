import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Users,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  ChevronRight,
  MessageCircle
} from 'lucide-react'

const StudentProgress = () => {
  const { t } = useLanguage()

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      student_name: 'Ahmed Hassan',
      student_avatar: null,
      activity_type: 'assignment_submitted',
      assignment_title: 'Algebra Quiz Chapter 5',
      score: 87,
      submitted_at: '2024-09-01T10:30:00Z',
      class: '1ère Année A'
    },
    {
      id: 2,
      student_name: 'Fatima Al-Zahra',
      student_avatar: null,
      activity_type: 'badge_earned',
      badge_name: 'Math Champion',
      earned_at: '2024-09-01T09:45:00Z',
      class: '1ère Année B'
    },
    {
      id: 3,
      student_name: 'Omar Benali',
      student_avatar: null,
      activity_type: 'attendance_flag',
      flag_type: 'chronic_absence',
      created_at: '2024-09-01T08:00:00Z',
      class: '1ère Année A'
    },
    {
      id: 4,
      student_name: 'Aisha Mansour',
      student_avatar: null,
      activity_type: 'assignment_submitted',
      assignment_title: 'Geometry Practice Quiz',
      score: 95,
      submitted_at: '2024-08-31T16:20:00Z',
      class: '1ère Année C'
    }
  ])

  const [topStudents, setTopStudents] = useState([
    {
      id: 1,
      name: 'Fatima Al-Zahra',
      avatar: null,
      class: '1ère Année B',
      current_score: 94.5,
      trend: 'up',
      recent_achievements: 3,
      badges_count: 8,
      streak_days: 15
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      avatar: null,
      class: '1ère Année A',
      current_score: 91.2,
      trend: 'up',
      recent_achievements: 2,
      badges_count: 6,
      streak_days: 12
    },
    {
      id: 3,
      name: 'Aisha Mansour',
      avatar: null,
      class: '1ère Année C',
      current_score: 89.8,
      trend: 'stable',
      recent_achievements: 1,
      badges_count: 5,
      streak_days: 8
    }
  ])

  const [strugglingStudents, setStrugglingStudents] = useState([
    {
      id: 1,
      name: 'Omar Benali',
      avatar: null,
      class: '1ère Année A',
      current_score: 62.5,
      attendance_rate: 78,
      issues: ['Chronic absences', 'Low assignment scores'],
      last_submission: '2024-08-28T14:30:00Z',
      needs_intervention: true
    },
    {
      id: 2,
      name: 'Youssef Tazi',
      avatar: null,
      class: '1ère Année B',
      current_score: 68.3,
      attendance_rate: 85,
      issues: ['Incomplete homework', 'Low participation'],
      last_submission: '2024-08-30T11:15:00Z',
      needs_intervention: false
    }
  ])

  const getActivityIcon = (type) => {
    switch(type) {
      case 'assignment_submitted': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'badge_earned': return <Award className="h-4 w-4 text-yellow-600" />
      case 'attendance_flag': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type) => {
    switch(type) {
      case 'assignment_submitted': return 'bg-green-50 border-green-200'
      case 'badge_earned': return 'bg-yellow-50 border-yellow-200'
      case 'attendance_flag': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return t('common.justNow')
    if (diffInHours < 24) return `${diffInHours}h ${t('common.ago')}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ${t('common.ago')}`
  }

  const handleViewStudentProfile = (student) => {
    console.log('View student profile:', student.name)
  }

  const handleContactParent = (student) => {
    console.log('Contact parent for student:', student.name)
  }

  const handleViewAllProgress = () => {
    console.log('Navigate to all student progress')
  }

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                {t('teacher.recentActivity')}
              </CardTitle>
              <CardDescription>
                {t('teacher.activityDescription')}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAllProgress}
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${getActivityColor(activity.activity_type)}`}
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.activity_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{activity.student_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.class}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {activity.activity_type === 'assignment_submitted' && (
                      <>
                        {t('teacher.submitted')} "{activity.assignment_title}" • {activity.score}%
                      </>
                    )}
                    {activity.activity_type === 'badge_earned' && (
                      <>
                        {t('teacher.earned')} "{activity.badge_name}" {t('gamification.badge')}
                      </>
                    )}
                    {activity.activity_type === 'attendance_flag' && (
                      <>
                        {t('teacher.flagged')} - {t(`teacher.${activity.flag_type}`)}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.submitted_at || activity.earned_at || activity.created_at)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            {t('teacher.topPerformers')}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {topStudents.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                    #{index + 1}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback className="text-xs">
                      {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.class}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{student.current_score}%</div>
                    <div className="text-muted-foreground">{t('homework.avgScore')}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 font-bold text-yellow-600">
                      🔥 {student.streak_days}
                    </div>
                    <div className="text-muted-foreground">{t('gamification.streak')}</div>
                  </div>
                  {getTrendIcon(student.trend)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Needing Attention */}
      {strugglingStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t('teacher.needsAttention')}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {strugglingStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-3 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="text-xs">
                          {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.class}</div>
                        <div className="text-xs text-orange-600 mt-1">
                          {student.issues.join(' • ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right text-xs">
                        <div className="font-bold text-red-600">{student.current_score}%</div>
                        <div className="text-muted-foreground">{t('homework.avgScore')}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewStudentProfile(student)}
                        >
                          {t('common.view')}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleContactParent(student)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StudentProgress