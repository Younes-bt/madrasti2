import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Trophy, 
  Star, 
  Medal,
  Crown,
  Award,
  Sparkles,
  ChevronRight,
  Calendar
} from 'lucide-react'

const RecentAchievements = () => {
  const { t } = useLanguage()

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      name: 'Math Champion',
      name_arabic: 'بطل الرياضيات',
      name_french: 'Champion de Math',
      description: 'Scored 95+ on 5 consecutive math assignments',
      description_arabic: 'حقق 95+ في 5 مهام رياضية متتالية',
      description_french: 'A obtenu 95+ sur 5 devoirs de maths consécutifs',
      icon: '🏆',
      rarity: 'EPIC',
      points_reward: 150,
      earned_at: '2024-08-30T14:30:00Z',
      is_new: true
    },
    {
      id: 2,
      name: 'Perfect Week',
      name_arabic: 'أسبوع مثالي',
      name_french: 'Semaine Parfaite',
      description: 'Completed all assignments with 100% attendance',
      description_arabic: 'أكمل جميع المهام مع حضور 100%',
      description_french: 'A terminé tous les devoirs avec 100% de présence',
      icon: '⭐',
      rarity: 'RARE',
      points_reward: 100,
      earned_at: '2024-08-29T16:00:00Z',
      is_new: true
    },
    {
      id: 3,
      name: 'Speed Reader',
      name_arabic: 'قارئ سريع',
      name_french: 'Lecteur Rapide',
      description: 'Completed 10 reading assignments in record time',
      description_arabic: 'أكمل 10 مهام قراءة في وقت قياسي',
      description_french: 'A terminé 10 devoirs de lecture en temps record',
      icon: '📚',
      rarity: 'COMMON',
      points_reward: 50,
      earned_at: '2024-08-28T10:15:00Z',
      is_new: false
    },
    {
      id: 4,
      name: 'Team Player',
      name_arabic: 'لاعب فريق',
      name_french: 'Joueur d\'équipe',
      description: 'Helped 5 classmates with their assignments',
      description_arabic: 'ساعد 5 زملاء في مهامهم',
      description_french: 'A aidé 5 camarades avec leurs devoirs',
      icon: '🤝',
      rarity: 'RARE',
      points_reward: 75,
      earned_at: '2024-08-27T13:45:00Z',
      is_new: false
    }
  ])

  const [leaderboardPosition, setLeaderboardPosition] = useState({
    current_rank: 12,
    total_students: 156,
    points_to_next: 45,
    next_rank: 11
  })

  const getRarityConfig = (rarity) => {
    switch(rarity) {
      case 'LEGENDARY': 
        return {
          color: 'from-purple-500 to-pink-500',
          icon: Crown,
          textColor: 'text-purple-700',
          bgColor: 'bg-purple-50 border-purple-200'
        }
      case 'EPIC': 
        return {
          color: 'from-yellow-500 to-orange-500',
          icon: Medal,
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50 border-yellow-200'
        }
      case 'RARE': 
        return {
          color: 'from-blue-500 to-cyan-500',
          icon: Star,
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50 border-blue-200'
        }
      case 'COMMON': 
        return {
          color: 'from-green-500 to-emerald-500',
          icon: Award,
          textColor: 'text-green-700',
          bgColor: 'bg-green-50 border-green-200'
        }
      default: 
        return {
          color: 'from-gray-500 to-gray-600',
          icon: Trophy,
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50 border-gray-200'
        }
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

  const handleViewAllAchievements = () => {
    console.log('Navigate to all achievements page')
    // Navigate to full achievements page
  }

  return (
    <div className="space-y-6">
      {/* Current Rank Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Trophy className="h-5 w-5" />
            {t('gamification.currentRank')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mb-1">
              #{leaderboardPosition.current_rank}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">
              {t('gamification.outOf')} {leaderboardPosition.total_students} {t('student.students')}
            </div>
            <div className="bg-white dark:bg-indigo-800 rounded-lg p-3 border border-indigo-200 dark:border-indigo-600">
              <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                {t('gamification.nextRank')}
              </div>
              <div className="font-semibold text-indigo-900 dark:text-indigo-100">
                {leaderboardPosition.points_to_next} {t('gamification.pointsAway')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                {t('gamification.recentAchievements')}
              </CardTitle>
              <CardDescription>
                {t('gamification.achievementsDescription')}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewAllAchievements}
              className="flex items-center gap-1"
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.slice(0, 3).map((achievement) => {
              const rarityConfig = getRarityConfig(achievement.rarity)
              const IconComponent = rarityConfig.icon
              
              return (
                <div
                  key={achievement.id}
                  className={`relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    achievement.is_new 
                      ? 'ring-2 ring-yellow-400 ring-opacity-50 shadow-sm' 
                      : ''
                  } ${rarityConfig.bgColor}`}
                >
                  {achievement.is_new && (
                    <div className="absolute -top-1 -right-1">
                      <Badge className="bg-yellow-500 text-white text-xs px-2 py-0.5 animate-pulse">
                        {t('common.new')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    {/* Achievement Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r ${rarityConfig.color} text-white flex-shrink-0`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    {/* Achievement Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${rarityConfig.textColor}`}>
                          {achievement.name} {achievement.icon}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${rarityConfig.textColor} border-current`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {achievement.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatTimeAgo(achievement.earned_at)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{achievement.points_reward} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-500" />
            {t('gamification.nextGoals')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Next Achievement Progress */}
            <div className="p-3 bg-accent/50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">🎯 {t('gamification.streakMaster')}</div>
                <div className="text-xs text-muted-foreground">8/15 days</div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '53%' }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {t('gamification.streakDescription')}
              </div>
            </div>

            {/* Weekly Challenge */}
            <div className="p-3 bg-accent/50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">🏃‍♂️ {t('gamification.weeklyChallenge')}</div>
                <div className="text-xs text-muted-foreground">3/5 {t('homework.assignments')}</div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: '60%' }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {t('gamification.challengeDescription')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecentAchievements