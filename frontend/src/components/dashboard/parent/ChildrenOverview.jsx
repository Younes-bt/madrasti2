import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Users,
  User,
  GraduationCap,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  BookOpen,
  ChevronRight
} from 'lucide-react'

const ChildrenOverview = () => {
  const { t } = useLanguage()
  const [selectedChild, setSelectedChild] = useState('all')

  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Ahmed Hassan',
      profile_picture: null,
      class: '1ère Année A',
      age: 16,
      average_score: 85.2,
      attendance_rate: 92.5,
      recent_trend: 'up',
      subjects_count: 8,
      assignments_pending: 3,
      assignments_completed: 12,
      next_exam: 'Mathematics',
      next_exam_date: '2024-09-05T09:00:00Z',
      recent_achievements: [
        'Math Champion Badge',
        'Perfect Attendance Week'
      ],
      alerts: []
    },
    {
      id: 2,
      name: 'Fatima Hassan',
      profile_picture: null,
      class: '3ème Année B',
      age: 18,
      average_score: 78.8,
      attendance_rate: 88.3,
      recent_trend: 'stable',
      subjects_count: 10,
      assignments_pending: 5,
      assignments_completed: 18,
      next_exam: 'Physics',
      next_exam_date: '2024-09-07T14:00:00Z',
      recent_achievements: [
        'Science Project Excellence'
      ],
      alerts: [
        {
          type: 'attendance',
          message: 'Missed 3 classes this week',
          severity: 'medium'
        }
      ]
    }
  ])

  const currentChild = selectedChild === 'all' ? null : children.find(child => child.id.toString() === selectedChild)

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAlertColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleViewChild = (child) => {
    console.log('View child details:', child.name)
  }

  const handleContactTeacher = (child) => {
    console.log('Contact teacher for child:', child.name)
  }

  // Overview statistics when viewing all children
  const overviewStats = selectedChild === 'all' ? {
    total_children: children.length,
    average_attendance: Math.round(children.reduce((acc, child) => acc + child.attendance_rate, 0) / children.length),
    average_score: Math.round(children.reduce((acc, child) => acc + child.average_score, 0) / children.length * 10) / 10,
    total_pending_assignments: children.reduce((acc, child) => acc + child.assignments_pending, 0),
    total_alerts: children.reduce((acc, child) => acc + child.alerts.length, 0)
  } : null

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {t('parent.childrenOverview')}
            </CardTitle>
            <CardDescription>
              {t('parent.overviewDescription')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              <option value="all">{t('parent.allChildren')}</option>
              {children.map(child => (
                <option key={child.id} value={child.id.toString()}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {selectedChild === 'all' ? (
          // All Children Overview
          <>
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {overviewStats.total_children}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {t('parent.children')}
                </div>
              </div>

              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-900 dark:text-green-100">
                  {overviewStats.average_attendance}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {t('attendance.avgRate')}
                </div>
              </div>

              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {overviewStats.average_score}%
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  {t('homework.avgScore')}
                </div>
              </div>

              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {overviewStats.total_pending_assignments}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  {t('homework.pending')}
                </div>
              </div>
            </div>

            {/* Children List */}
            <div className="space-y-3">
              <h4 className="font-medium">{t('parent.children')}</h4>
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={child.profile_picture} />
                      <AvatarFallback>
                        {child.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{child.name}</div>
                      <div className="text-sm text-muted-foreground">{child.class}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{child.average_score}%</div>
                      <div className="text-muted-foreground">{t('homework.avgScore')}</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${getAttendanceColor(child.attendance_rate)}`}>
                        {child.attendance_rate}%
                      </div>
                      <div className="text-muted-foreground">{t('attendance.rate')}</div>
                    </div>
                    {child.alerts.length > 0 && (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    {getTrendIcon(child.recent_trend)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : currentChild && (
          // Individual Child Details
          <div className="space-y-6">
            {/* Child Header */}
            <div className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentChild.profile_picture} />
                <AvatarFallback className="text-lg">
                  {currentChild.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{currentChild.name}</h3>
                <p className="text-muted-foreground">{currentChild.class} • {currentChild.age} {t('common.yearsOld')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800">{currentChild.subjects_count} {t('homework.subjects')}</Badge>
                  {getTrendIcon(currentChild.recent_trend)}
                </div>
              </div>
            </div>

            {/* Academic Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {currentChild.average_score}%
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  {t('homework.avgScore')}
                </div>
              </div>

              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-900 dark:text-green-100">
                  {currentChild.attendance_rate}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {t('attendance.rate')}
                </div>
              </div>

              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {currentChild.assignments_pending}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  {t('homework.pending')}
                </div>
              </div>
            </div>

            {/* Alerts */}
            {currentChild.alerts.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  {t('parent.alerts')}
                </h4>
                <div className="space-y-2">
                  {currentChild.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Achievements */}
            {currentChild.recent_achievements.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">{t('gamification.recentAchievements')}</h4>
                <div className="flex flex-wrap gap-2">
                  {currentChild.recent_achievements.map((achievement, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-700">
                      🏆 {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Next Exam */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    {t('parent.nextExam')}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {currentChild.next_exam} • {new Date(currentChild.next_exam_date).toLocaleDateString()}
                  </p>
                </div>
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => handleViewChild(currentChild)} className="flex-1">
                {t('parent.viewDetails')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleContactTeacher(currentChild)}
              >
                {t('parent.contactTeacher')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ChildrenOverview