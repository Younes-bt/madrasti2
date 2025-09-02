import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  BookOpen,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  ChevronRight
} from 'lucide-react'

const AcademicProgress = () => {
  const { t } = useLanguage()
  const [selectedChild, setSelectedChild] = useState('1')

  const [academicData, setAcademicData] = useState({
    '1': { // Ahmed Hassan
      name: 'Ahmed Hassan',
      class: '1ère Année A',
      overall_average: 85.2,
      term_average: 87.1,
      trend: 'up',
      rank_in_class: 5,
      total_students: 25,
      subjects: [
        {
          id: 1,
          name: 'Mathematics',
          average: 92.5,
          last_grade: 95,
          trend: 'up',
          assignments_completed: 8,
          assignments_total: 10,
          next_exam: '2024-09-05T09:00:00Z'
        },
        {
          id: 2,
          name: 'Physics',
          average: 88.3,
          last_grade: 85,
          trend: 'down',
          assignments_completed: 6,
          assignments_total: 8,
          next_exam: '2024-09-08T11:00:00Z'
        },
        {
          id: 3,
          name: 'Chemistry',
          average: 82.7,
          last_grade: 88,
          trend: 'up',
          assignments_completed: 7,
          assignments_total: 9,
          next_exam: '2024-09-10T14:00:00Z'
        },
        {
          id: 4,
          name: 'French',
          average: 78.9,
          last_grade: 82,
          trend: 'up',
          assignments_completed: 9,
          assignments_total: 12,
          next_exam: '2024-09-07T10:00:00Z'
        },
        {
          id: 5,
          name: 'English',
          average: 91.2,
          last_grade: 89,
          trend: 'stable',
          assignments_completed: 10,
          assignments_total: 11,
          next_exam: '2024-09-12T13:00:00Z'
        }
      ],
      recent_achievements: [
        {
          title: 'Math Champion',
          description: 'Top score in algebra quiz',
          date: '2024-09-01',
          subject: 'Mathematics'
        },
        {
          title: 'Perfect Attendance',
          description: 'No absences for 2 weeks',
          date: '2024-08-30',
          subject: 'General'
        }
      ],
      areas_of_concern: [
        {
          subject: 'French',
          issue: 'Essay writing needs improvement',
          recommendation: 'Practice writing exercises'
        }
      ]
    },
    '2': { // Fatima Hassan
      name: 'Fatima Hassan',
      class: '3ème Année B',
      overall_average: 78.8,
      term_average: 80.2,
      trend: 'up',
      rank_in_class: 12,
      total_students: 28,
      subjects: [
        {
          id: 1,
          name: 'Mathematics',
          average: 75.2,
          last_grade: 78,
          trend: 'up',
          assignments_completed: 12,
          assignments_total: 15,
          next_exam: '2024-09-06T09:00:00Z'
        },
        {
          id: 2,
          name: 'Physics',
          average: 82.1,
          last_grade: 85,
          trend: 'up',
          assignments_completed: 10,
          assignments_total: 13,
          next_exam: '2024-09-07T14:00:00Z'
        },
        {
          id: 3,
          name: 'Chemistry',
          average: 79.6,
          last_grade: 76,
          trend: 'down',
          assignments_completed: 11,
          assignments_total: 14,
          next_exam: '2024-09-09T11:00:00Z'
        },
        {
          id: 4,
          name: 'Biology',
          average: 84.3,
          last_grade: 87,
          trend: 'stable',
          assignments_completed: 13,
          assignments_total: 16,
          next_exam: '2024-09-11T10:00:00Z'
        },
        {
          id: 5,
          name: 'Literature',
          average: 73.8,
          last_grade: 71,
          trend: 'down',
          assignments_completed: 8,
          assignments_total: 12,
          next_exam: '2024-09-13T15:00:00Z'
        }
      ],
      recent_achievements: [
        {
          title: 'Science Excellence',
          description: 'Outstanding project in Biology',
          date: '2024-08-28',
          subject: 'Biology'
        }
      ],
      areas_of_concern: [
        {
          subject: 'Literature',
          issue: 'Low participation in class discussions',
          recommendation: 'Encourage more active participation'
        },
        {
          subject: 'Mathematics',
          issue: 'Struggles with complex equations',
          recommendation: 'Additional tutoring recommended'
        }
      ]
    }
  })

  const currentData = academicData[selectedChild]

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCompletionRate = (completed, total) => {
    return Math.round((completed / total) * 100)
  }

  const handleViewSubjectDetails = (subject) => {
    console.log('View subject details:', subject.name)
  }

  const handleViewFullReport = () => {
    console.log('Navigate to full academic report')
  }

  const handleContactTeacher = (subject) => {
    console.log('Contact teacher for subject:', subject)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              {t('parent.academicProgress')}
            </CardTitle>
            <CardDescription>
              {t('parent.progressDescription')}
            </CardDescription>
          </div>
          <select
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
          >
            <option value="1">Ahmed Hassan</option>
            <option value="2">Fatima Hassan</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Performance */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {currentData.overall_average}%
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {t('homework.overallAvg')}
            </div>
          </div>

          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
              #{currentData.rank_in_class}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {t('parent.classRank')}
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-900 dark:text-green-100">
              {currentData.term_average}%
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {t('parent.termAverage')}
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-2">
              {getTrendIcon(currentData.trend)}
            </div>
            <div className={`text-lg font-bold ${getTrendColor(currentData.trend)}`}>
              {t(`parent.trend${currentData.trend.charAt(0).toUpperCase() + currentData.trend.slice(1)}`)}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {t('parent.performance')}
            </div>
          </div>
        </div>

        {/* Subjects Performance */}
        <div>
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t('parent.subjectPerformance')}
          </h4>
          <div className="space-y-3">
            {currentData.subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <div className="font-medium text-sm">{subject.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t('parent.lastGrade')}: {subject.last_grade}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  {/* Average Score */}
                  <div className="text-center">
                    <div className={`font-bold ${getScoreColor(subject.average)}`}>
                      {subject.average}%
                    </div>
                    <div className="text-muted-foreground">{t('homework.average')}</div>
                  </div>
                  
                  {/* Assignment Completion */}
                  <div className="text-center">
                    <div className="font-bold text-blue-600">
                      {getCompletionRate(subject.assignments_completed, subject.assignments_total)}%
                    </div>
                    <div className="text-muted-foreground">
                      {subject.assignments_completed}/{subject.assignments_total}
                    </div>
                  </div>
                  
                  {/* Next Exam */}
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">
                      {t('parent.nextExam')}
                    </div>
                    <div className="text-xs font-medium">
                      {new Date(subject.next_exam).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Trend and Actions */}
                  <div className="flex items-center gap-2">
                    {getTrendIcon(subject.trend)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewSubjectDetails(subject)}
                    >
                      {t('common.view')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        {currentData.recent_achievements.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              {t('gamification.recentAchievements')}
            </h4>
            <div className="space-y-2">
              {currentData.recent_achievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {achievement.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas of Concern */}
        {currentData.areas_of_concern.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              {t('parent.areasOfConcern')}
            </h4>
            <div className="space-y-3">
              {currentData.areas_of_concern.map((concern, index) => (
                <div key={index} className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">{concern.subject}</div>
                        <div className="text-xs text-muted-foreground mb-2">{concern.issue}</div>
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          💡 {concern.recommendation}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContactTeacher(concern.subject)}
                    >
                      {t('parent.contactTeacher')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {t('parent.overallRank')}: #{currentData.rank_in_class} {t('common.of')} {currentData.total_students}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewFullReport}
          >
            {t('parent.viewFullReport')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AcademicProgress