import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import { 
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  Calendar,
  Users,
  Filter,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Star
} from 'lucide-react'

const Leaderboard = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [timeFilter, setTimeFilter] = useState('weekly') // weekly, monthly, semester
  const [categoryFilter, setCategoryFilter] = useState('overall') // overall, subject, class
  const [isLoading, setIsLoading] = useState(false)

  const [leaderboardData, setLeaderboardData] = useState({
    current_user_rank: 12,
    current_user_points: 1250,
    total_participants: 156,
    rankings: [
      {
        rank: 1,
        previous_rank: 2,
        student_id: 45,
        student_name: 'Ahmed Hassan',
        student_avatar: null,
        class_name: '1ère Année A',
        total_points: 2150,
        weekly_points: 425,
        assignments_completed: 28,
        average_score: 94.5,
        badges_count: 12,
        streak_days: 18,
        change: 'up'
      },
      {
        rank: 2,
        previous_rank: 1,
        student_id: 23,
        student_name: 'Fatima Al-Zahra',
        student_avatar: null,
        class_name: '1ère Année B',
        total_points: 2080,
        weekly_points: 310,
        assignments_completed: 26,
        average_score: 91.2,
        badges_count: 10,
        streak_days: 15,
        change: 'down'
      },
      {
        rank: 3,
        previous_rank: 4,
        student_id: 67,
        student_name: 'Omar Benali',
        student_avatar: null,
        class_name: '1ère Année A',
        total_points: 1950,
        weekly_points: 390,
        assignments_completed: 25,
        average_score: 89.8,
        badges_count: 9,
        streak_days: 12,
        change: 'up'
      },
      {
        rank: 4,
        previous_rank: 3,
        student_id: 89,
        student_name: 'Aisha Mansour',
        student_avatar: null,
        class_name: '1ère Année C',
        total_points: 1875,
        weekly_points: 275,
        assignments_completed: 24,
        average_score: 87.5,
        badges_count: 8,
        streak_days: 9,
        change: 'down'
      },
      {
        rank: 5,
        previous_rank: 6,
        student_id: 34,
        student_name: 'Mohamed Cherif',
        student_avatar: null,
        class_name: '1ère Année B',
        total_points: 1820,
        weekly_points: 345,
        assignments_completed: 23,
        average_score: 86.3,
        badges_count: 7,
        streak_days: 14,
        change: 'up'
      },
      {
        rank: 6,
        previous_rank: 5,
        student_id: 56,
        student_name: 'Salma Alaoui',
        student_avatar: null,
        class_name: '1ère Année A',
        total_points: 1780,
        weekly_points: 220,
        assignments_completed: 22,
        average_score: 85.1,
        badges_count: 6,
        streak_days: 7,
        change: 'down'
      },
      {
        rank: 7,
        previous_rank: 8,
        student_id: 78,
        student_name: 'Youssef Tazi',
        student_avatar: null,
        class_name: '1ère Année C',
        total_points: 1720,
        weekly_points: 295,
        assignments_completed: 21,
        average_score: 84.2,
        badges_count: 5,
        streak_days: 11,
        change: 'up'
      },
      {
        rank: 8,
        previous_rank: 7,
        student_id: 91,
        student_name: 'Khadija Benjelloun',
        student_avatar: null,
        class_name: '1ère Année B',
        total_points: 1680,
        weekly_points: 180,
        assignments_completed: 20,
        average_score: 83.6,
        badges_count: 4,
        streak_days: 5,
        change: 'down'
      },
      {
        rank: 9,
        previous_rank: 10,
        student_id: 43,
        student_name: 'Hamid Squalli',
        student_avatar: null,
        class_name: '1ère Année A',
        total_points: 1620,
        weekly_points: 260,
        assignments_completed: 19,
        average_score: 82.4,
        badges_count: 4,
        streak_days: 8,
        change: 'up'
      },
      {
        rank: 10,
        previous_rank: 9,
        student_id: 25,
        student_name: user?.first_name || 'Current Student',
        student_avatar: user?.profile_picture_url,
        class_name: '1ère Année B',
        total_points: 1580,
        weekly_points: 240,
        assignments_completed: 18,
        average_score: 81.7,
        badges_count: 3,
        streak_days: 6,
        change: 'down',
        is_current_user: true
      }
    ]
  })

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Award className="h-5 w-5 text-orange-500" />
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'from-yellow-400 to-yellow-600'
      case 2: return 'from-gray-300 to-gray-500'
      case 3: return 'from-orange-400 to-orange-600'
      default: return 'from-blue-400 to-blue-600'
    }
  }

  const getChangeIcon = (change) => {
    switch(change) {
      case 'up': return <ChevronUp className="h-4 w-4 text-green-600" />
      case 'down': return <ChevronDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getStreakColor = (days) => {
    if (days >= 15) return 'text-orange-600 bg-orange-100'
    if (days >= 10) return 'text-blue-600 bg-blue-100'
    if (days >= 5) return 'text-green-600 bg-green-100'
    return 'text-gray-600 bg-gray-100'
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const formatPeriod = (filter) => {
    const now = new Date()
    switch(filter) {
      case 'weekly':
        return t('gamification.thisWeek')
      case 'monthly':
        return now.toLocaleString('default', { month: 'long', year: 'numeric' })
      case 'semester':
        return t('gamification.thisSemester')
      default:
        return t('gamification.allTime')
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {t('gamification.leaderboard')}
            </CardTitle>
            <CardDescription>
              {formatPeriod(timeFilter)} • {leaderboardData.total_participants} {t('student.students')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-2 py-1 border border-input bg-background rounded text-xs"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="weekly">{t('common.weekly')}</option>
              <option value="monthly">{t('common.monthly')}</option>
              <option value="semester">{t('common.semester')}</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Current User Position (if not in top 10) */}
          {leaderboardData.current_user_rank > 10 && (
            <>
              <div className="p-3 border-2 border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-blue-600">
                      #{leaderboardData.current_user_rank}
                    </div>
                    <span className="font-medium">{t('common.yourRank')}</span>
                  </div>
                  <div className="text-blue-600 font-semibold">
                    {leaderboardData.current_user_points} pts
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
            </>
          )}

          {/* Leaderboard Rankings */}
          {leaderboardData.rankings.map((student, index) => (
            <div
              key={student.student_id}
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                student.is_current_user 
                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200' 
                  : 'border-border bg-card hover:bg-accent/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank & Change */}
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    student.rank <= 3 
                      ? `bg-gradient-to-br ${getRankColor(student.rank)} text-white`
                      : 'bg-muted'
                  }`}>
                    {getRankIcon(student.rank)}
                  </div>
                  <div className="flex items-center mt-1">
                    {getChangeIcon(student.change)}
                    <span className="text-xs text-muted-foreground ml-1">
                      {student.previous_rank}
                    </span>
                  </div>
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.student_avatar} />
                      <AvatarFallback className="text-xs">
                        {student.student_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm truncate">
                        {student.student_name}
                        {student.is_current_user && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {t('common.you')}
                          </Badge>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {student.class_name}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">
                        {student.total_points}
                      </div>
                      <div className="text-muted-foreground">{t('gamification.totalPoints')}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">
                        +{student.weekly_points}
                      </div>
                      <div className="text-muted-foreground">{t('gamification.thisWeek')}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">
                        {student.average_score}%
                      </div>
                      <div className="text-muted-foreground">{t('homework.avgScore')}</div>
                    </div>
                    <div className="text-center">
                      <Badge className={getStreakColor(student.streak_days)} variant="secondary">
                        🔥 {student.streak_days}d
                      </Badge>
                      <div className="text-muted-foreground mt-1">{t('gamification.streak')}</div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-bold">{student.badges_count}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('gamification.badges')}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View More */}
          <div className="text-center pt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full"
              onClick={() => {
                console.log('Navigate to full leaderboard')
                // Navigate to full leaderboard page
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              {t('gamification.viewFullLeaderboard')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Leaderboard