import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { useLanguage } from '../../../hooks/useLanguage'
import { useApi } from '../../../hooks/useApi'
import { 
  Trophy, 
  Star, 
  Target, 
  Award, 
  Zap, 
  TrendingUp,
  Coins,
  Medal,
  Crown,
  Flame
} from 'lucide-react'

const StudentOverview = () => {
  const { t } = useLanguage()
  const [wallet, setWallet] = useState({
    total_points: 1250,
    total_coins: 350,
    available_points: 1100,
    available_coins: 280,
    level: 8,
    level_progress: 65.5
  })

  const [recentBadges, setRecentBadges] = useState([
    {
      id: 1,
      name: 'Math Champion',
      name_arabic: 'بطل الرياضيات',
      name_french: 'Champion de Math',
      description: 'Scored 95+ on 5 consecutive math assignments',
      icon: '🏆',
      color: '#FFD700',
      rarity: 'EPIC',
      earned_at: '2024-08-30T14:30:00Z'
    },
    {
      id: 2,
      name: 'Early Bird',
      name_arabic: 'المبكر',
      name_french: 'Lève-tôt',
      description: 'Submitted 10 assignments before deadline',
      icon: '🌅',
      color: '#FF6B6B',
      rarity: 'RARE',
      earned_at: '2024-08-29T09:15:00Z'
    },
    {
      id: 3,
      name: 'Perfect Attendance',
      name_arabic: 'الحضور المثالي',
      name_french: 'Assiduité Parfaite',
      description: 'No absences for 2 weeks',
      icon: '📚',
      color: '#4ECDC4',
      rarity: 'COMMON',
      earned_at: '2024-08-28T16:00:00Z'
    }
  ])

  const [weeklyStats, setWeeklyStats] = useState({
    assignments_completed: 8,
    total_assignments: 10,
    attendance_rate: 95.5,
    average_score: 87.3,
    points_earned_this_week: 240
  })

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'LEGENDARY': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'EPIC': return 'bg-gradient-to-r from-yellow-500 to-orange-500'
      case 'RARE': return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      case 'COMMON': return 'bg-gradient-to-r from-green-500 to-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  const getRarityIcon = (rarity) => {
    switch(rarity) {
      case 'LEGENDARY': return <Crown className="h-4 w-4" />
      case 'EPIC': return <Medal className="h-4 w-4" />
      case 'RARE': return <Star className="h-4 w-4" />
      case 'COMMON': return <Award className="h-4 w-4" />
      default: return <Trophy className="h-4 w-4" />
    }
  }

  const levelProgressWidth = `${wallet.level_progress}%`

  return (
    <div className="space-y-6">
      {/* Gamification Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Points Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {t('gamification.points')}
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {wallet.available_points.toLocaleString()}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Coins Card */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  {t('gamification.coins')}
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {wallet.available_coins.toLocaleString()}
                </p>
              </div>
              <Coins className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {t('gamification.level')}
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {wallet.level}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400 mb-1">
                <span>{t('gamification.progress')}</span>
                <span>{wallet.level_progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: levelProgressWidth }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Points */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {t('gamification.thisWeek')}
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  +{weeklyStats.points_earned_this_week}
                </p>
              </div>
              <div className="flex items-center">
                <Flame className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Badges */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                {t('gamification.recentBadges')}
              </CardTitle>
              <Badge variant="secondary">{recentBadges.length}</Badge>
            </div>
            <CardDescription>
              {t('gamification.badgesDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBadges.map((badge) => (
                <div 
                  key={badge.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${getRarityColor(badge.rarity)}`}>
                    {getRarityIcon(badge.rarity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {badge.name} {badge.icon}
                      </p>
                      <Badge variant="outline" className={`text-xs ${
                        badge.rarity === 'LEGENDARY' ? 'border-purple-500 text-purple-700' :
                        badge.rarity === 'EPIC' ? 'border-yellow-500 text-yellow-700' :
                        badge.rarity === 'RARE' ? 'border-blue-500 text-blue-700' :
                        'border-green-500 text-green-700'
                      }`}>
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              {t('student.weeklyPerformance')}
            </CardTitle>
            <CardDescription>
              {t('student.performanceDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Assignments Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('homework.assignments')}</span>
                  <span className="font-medium">
                    {weeklyStats.assignments_completed}/{weeklyStats.total_assignments}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(weeklyStats.assignments_completed / weeklyStats.total_assignments) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Attendance Rate */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('attendance.rate')}</span>
                  <span className="font-medium">{weeklyStats.attendance_rate}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${weeklyStats.attendance_rate}%` }}
                  ></div>
                </div>
              </div>

              {/* Average Score */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('homework.averageScore')}</span>
                  <span className="font-medium">{weeklyStats.average_score}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${weeklyStats.average_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">85%</p>
                  <p className="text-xs text-muted-foreground">{t('homework.completion')}</p>
                </div>
                <div className="text-center p-3 bg-accent/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">12</p>
                  <p className="text-xs text-muted-foreground">{t('gamification.streak')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StudentOverview