import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  TrendingUp, 
  BarChart3,
  PieChart,
  Calendar,
  Target,
  BookOpen,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react'

const StudyProgress = () => {
  const { t } = useLanguage()

  // Mock data - in real app, this would come from API
  const [progressData, setProgressData] = useState({
    subjects: [
      {
        id: 1,
        name: 'Mathematics',
        name_arabic: 'الرياضيات',
        name_french: 'Mathématiques',
        color: '#3B82F6',
        progress: 78,
        completed_lessons: 23,
        total_lessons: 30,
        avg_score: 85.5,
        recent_activity: '2 hours ago'
      },
      {
        id: 2,
        name: 'French Literature',
        name_arabic: 'الأدب الفرنسي',
        name_french: 'Littérature Française',
        color: '#EF4444',
        progress: 65,
        completed_lessons: 18,
        total_lessons: 28,
        avg_score: 78.2,
        recent_activity: '1 day ago'
      },
      {
        id: 3,
        name: 'Chemistry',
        name_arabic: 'الكيمياء',
        name_french: 'Chimie',
        color: '#10B981',
        progress: 82,
        completed_lessons: 16,
        total_lessons: 20,
        avg_score: 91.0,
        recent_activity: '3 hours ago'
      },
      {
        id: 4,
        name: 'History',
        name_arabic: 'التاريخ',
        name_french: 'Histoire',
        color: '#F59E0B',
        progress: 45,
        completed_lessons: 12,
        total_lessons: 25,
        avg_score: 72.8,
        recent_activity: '5 days ago'
      }
    ],
    weekly_stats: {
      study_hours: 18.5,
      assignments_completed: 7,
      lessons_viewed: 12,
      practice_sessions: 15
    },
    achievements: [
      { type: 'streak', value: 12, label: 'Day Study Streak' },
      { type: 'completion', value: 85, label: 'Assignment Completion Rate' },
      { type: 'improvement', value: '+15%', label: 'Score Improvement' }
    ]
  })

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600 bg-green-100'
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-700 bg-green-100' }
    if (score >= 80) return { grade: 'A', color: 'text-green-600 bg-green-50' }
    if (score >= 70) return { grade: 'B', color: 'text-yellow-600 bg-yellow-50' }
    if (score >= 60) return { grade: 'C', color: 'text-orange-600 bg-orange-50' }
    return { grade: 'D', color: 'text-red-600 bg-red-50' }
  }

  return (
    <div className="space-y-6">
      {/* Weekly Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            {t('student.weeklyProgress')}
          </CardTitle>
          <CardDescription>
            {t('student.weeklyProgressDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {progressData.weekly_stats.study_hours}h
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {t('student.studyHours')}
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {progressData.weekly_stats.assignments_completed}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                {t('homework.completed')}
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <BookOpen className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {progressData.weekly_stats.lessons_viewed}
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400">
                {t('lessons.viewed')}
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
              <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {progressData.weekly_stats.practice_sessions}
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400">
                {t('student.practiceSession')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-500" />
            {t('student.subjectProgress')}
          </CardTitle>
          <CardDescription>
            {t('student.subjectProgressDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.subjects.map((subject) => {
              const scoreGrade = getScoreGrade(subject.avg_score)
              return (
                <div key={subject.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      ></div>
                      <h4 className="font-medium">{subject.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={scoreGrade.color} variant="secondary">
                        {scoreGrade.grade} ({subject.avg_score}%)
                      </Badge>
                      <Badge className={getProgressColor(subject.progress)} variant="secondary">
                        {subject.progress}%
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t('lessons.progress')}</span>
                      <span>{subject.completed_lessons}/{subject.total_lessons} {t('lessons.lessons')}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${subject.progress}%`,
                          backgroundColor: subject.color
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Subject Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm font-semibold">{subject.completed_lessons}</div>
                      <div className="text-xs text-muted-foreground">{t('lessons.completed')}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{subject.avg_score}%</div>
                      <div className="text-xs text-muted-foreground">{t('homework.avgScore')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{t('student.lastActivity')}</div>
                      <div className="text-sm font-medium">{subject.recent_activity}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            {t('student.achievements')}
          </CardTitle>
          <CardDescription>
            {t('student.achievementsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {progressData.achievements.map((achievement, index) => {
              const getAchievementIcon = (type) => {
                switch(type) {
                  case 'streak': return '🔥'
                  case 'completion': return '✅'
                  case 'improvement': return '📈'
                  default: return '🏆'
                }
              }

              const getAchievementColor = (type) => {
                switch(type) {
                  case 'streak': return 'border-orange-200 bg-orange-50'
                  case 'completion': return 'border-green-200 bg-green-50'
                  case 'improvement': return 'border-blue-200 bg-blue-50'
                  default: return 'border-gray-200 bg-gray-50'
                }
              }

              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getAchievementColor(achievement.type)} text-center`}
                >
                  <div className="text-2xl mb-2">{getAchievementIcon(achievement.type)}</div>
                  <div className="text-lg font-bold mb-1">{achievement.value}</div>
                  <div className="text-sm text-muted-foreground">{achievement.label}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StudyProgress