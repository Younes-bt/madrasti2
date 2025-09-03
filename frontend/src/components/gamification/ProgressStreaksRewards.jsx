import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Flame,
  Calendar,
  Gift,
  Star,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Zap,
  Heart,
  Diamond,
  Crown,
  Sparkles,
  TrendingUp,
  RotateCcw,
  CalendarDays,
  Timer,
  Gem,
  Medal
} from 'lucide-react';

const ProgressStreaksRewards = () => {
  const { t } = useTranslation();
  const [selectedStreak, setSelectedStreak] = useState(null);
  const [claimingReward, setClaimingReward] = useState(null);
  const [streakAnimation, setStreakAnimation] = useState(false);

  // Mock data - replace with real API integration
  const [streakData] = useState({
    currentStreak: 15,
    longestStreak: 28,
    totalDays: 89,
    streakGoal: 30,
    lastActivity: '2024-02-20T18:30:00Z',
    nextResetTime: '2024-02-21T00:00:00Z',
    weeklyGoal: 7,
    weeklyProgress: 5,
    monthlyGoal: 30,
    monthlyProgress: 20
  });

  const [streakHistory] = useState([
    { date: '2024-02-20', completed: true, lessons: 3, points: 50 },
    { date: '2024-02-19', completed: true, lessons: 2, points: 40 },
    { date: '2024-02-18', completed: true, lessons: 4, points: 60 },
    { date: '2024-02-17', completed: true, lessons: 1, points: 30 },
    { date: '2024-02-16', completed: true, lessons: 3, points: 50 },
    { date: '2024-02-15', completed: true, lessons: 2, points: 40 },
    { date: '2024-02-14', completed: true, lessons: 5, points: 70 },
    { date: '2024-02-13', completed: false, lessons: 0, points: 0 },
    { date: '2024-02-12', completed: true, lessons: 2, points: 40 },
    { date: '2024-02-11', completed: true, lessons: 3, points: 50 }
  ]);

  const [rewards] = useState([
    {
      id: 1,
      type: 'streak',
      title: 'محارب السلسلة',
      description: '7 أيام متتالية من التعلم',
      requirement: 7,
      currentProgress: 7,
      isUnlocked: true,
      isClaimed: true,
      reward: {
        type: 'badge',
        value: 'شارة محارب السلسلة',
        points: 100,
        icon: '🔥'
      },
      claimedAt: '2024-02-18T10:00:00Z'
    },
    {
      id: 2,
      type: 'streak',
      title: 'أسطورة المثابرة',
      description: '15 يوماً متتالياً من التعلم',
      requirement: 15,
      currentProgress: 15,
      isUnlocked: true,
      isClaimed: false,
      reward: {
        type: 'points+badge',
        value: '250 نقطة + شارة أسطورية',
        points: 250,
        icon: '👑'
      }
    },
    {
      id: 3,
      type: 'streak',
      title: 'سيد التحدي',
      description: '30 يوماً متتالياً من التعلم',
      requirement: 30,
      currentProgress: 15,
      isUnlocked: false,
      isClaimed: false,
      reward: {
        type: 'premium',
        value: 'ميزات إضافية لشهر + 500 نقطة',
        points: 500,
        icon: '💎'
      }
    },
    {
      id: 4,
      type: 'weekly',
      title: 'بطل الأسبوع',
      description: 'أكمل هدفك الأسبوعي',
      requirement: 7,
      currentProgress: 5,
      isUnlocked: false,
      isClaimed: false,
      reward: {
        type: 'points',
        value: '150 نقطة إضافية',
        points: 150,
        icon: '⭐'
      },
      resetType: 'weekly'
    },
    {
      id: 5,
      type: 'monthly',
      title: 'أسطورة الشهر',
      description: 'أكمل هدفك الشهري',
      requirement: 30,
      currentProgress: 20,
      isUnlocked: false,
      isClaimed: false,
      reward: {
        type: 'mega',
        value: 'مكافأة ضخمة + لقب خاص',
        points: 1000,
        icon: '🏆'
      },
      resetType: 'monthly'
    },
    {
      id: 6,
      type: 'bonus',
      title: 'النشاط اليومي',
      description: 'أكمل درساً واحداً على الأقل اليوم',
      requirement: 1,
      currentProgress: 1,
      isUnlocked: true,
      isClaimed: true,
      reward: {
        type: 'daily_bonus',
        value: '25 نقطة يومية',
        points: 25,
        icon: '✨'
      },
      resetType: 'daily'
    }
  ]);

  const [milestones] = useState([
    { days: 3, reward: '50 نقطة', unlocked: true, claimed: true },
    { days: 7, reward: 'شارة + 100 نقطة', unlocked: true, claimed: true },
    { days: 15, reward: '250 نقطة + شارة', unlocked: true, claimed: false },
    { days: 30, reward: '500 نقطة + ميزات خاصة', unlocked: false, claimed: false },
    { days: 50, reward: '750 نقطة + لقب', unlocked: false, claimed: false },
    { days: 100, reward: 'مكافأة ضخمة', unlocked: false, claimed: false }
  ]);

  const getStreakFlameColor = (days) => {
    if (days >= 30) return 'text-purple-500';
    if (days >= 15) return 'text-blue-500';
    if (days >= 7) return 'text-orange-500';
    if (days >= 3) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const getRewardTypeColor = (type) => {
    switch (type) {
      case 'streak': return 'bg-red-100 text-red-800 border-red-200';
      case 'weekly': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'monthly': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bonus': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRewardIcon = (type) => {
    switch (type) {
      case 'badge': return Award;
      case 'points': return Star;
      case 'points+badge': return Crown;
      case 'premium': return Diamond;
      case 'mega': return Trophy;
      case 'daily_bonus': return Sparkles;
      default: return Gift;
    }
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}س ${minutes}د`;
  };

  const claimReward = (rewardId) => {
    setClaimingReward(rewardId);
    // Simulate API call
    setTimeout(() => {
      setClaimingReward(null);
      // Update reward status
    }, 1500);
  };

  const extendStreak = () => {
    setStreakAnimation(true);
    setTimeout(() => setStreakAnimation(false), 2000);
  };

  const isStreakActive = () => {
    const lastActivity = new Date(streakData.lastActivity);
    const now = new Date();
    const daysDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
    return daysDiff === 0;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('السلاسل والمكافآت')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('حافظ على سلسلة التعلم واحصل على مكافآت رائعة')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            إعادة تعيين
          </Button>
          <Button size="sm" className="gap-2" onClick={extendStreak}>
            <Flame className="h-4 w-4" />
            تمديد السلسلة
          </Button>
        </div>
      </div>

      {/* Main Streak Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Streak */}
        <Card className={`bg-gradient-to-br from-orange-50 to-red-50 border-2 ${streakAnimation ? 'animate-pulse' : ''}`}>
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Flame className={`h-16 w-16 mx-auto ${getStreakFlameColor(streakData.currentStreak)} ${streakAnimation ? 'animate-bounce' : ''}`} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {streakData.currentStreak}
            </h2>
            <p className="text-gray-600 mb-4">يوماً متتالياً</p>
            
            {isStreakActive() ? (
              <Badge className="bg-green-100 text-green-800 mb-3">
                السلسلة نشطة اليوم ✨
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 mb-3">
                السلسلة معرضة للخطر ⚠️
              </Badge>
            )}

            <div className="text-sm text-gray-500">
              <p>إعادة التعيين خلال: {getTimeUntilReset()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Streak Goal Progress */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-bold text-lg">هدف السلسلة</h3>
                <p className="text-sm text-gray-600">الوصول إلى {streakData.streakGoal} يوماً</p>
              </div>
            </div>

            <div className="space-y-3">
              <Progress 
                value={(streakData.currentStreak / streakData.streakGoal) * 100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{streakData.currentStreak} من {streakData.streakGoal}</span>
                <span className="font-medium text-blue-600">
                  {Math.round((streakData.currentStreak / streakData.streakGoal) * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {streakData.streakGoal - streakData.currentStreak} يوم متبقي للهدف
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              إحصائياتي
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">أطول سلسلة</span>
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{streakData.longestStreak} يوم</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">إجمالي الأيام</span>
                <span className="font-bold">{streakData.totalDays} يوم</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأسبوع الحالي</span>
                <span className="font-bold">{streakData.weeklyProgress}/{streakData.weeklyGoal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الشهر الحالي</span>
                <span className="font-bold">{streakData.monthlyProgress}/{streakData.monthlyGoal}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly and Monthly Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              الهدف الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>التقدم هذا الأسبوع</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {streakData.weeklyProgress}/{streakData.weeklyGoal} أيام
                </Badge>
              </div>
              <Progress 
                value={(streakData.weeklyProgress / streakData.weeklyGoal) * 100} 
                className="h-3"
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {streakData.weeklyGoal - streakData.weeklyProgress} أيام متبقية
                </p>
                {streakData.weeklyProgress >= streakData.weeklyGoal && (
                  <Badge className="bg-green-100 text-green-800 mt-2">
                    تم إكمال الهدف! 🎉
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              الهدف الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>التقدم هذا الشهر</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {streakData.monthlyProgress}/{streakData.monthlyGoal} يوم
                </Badge>
              </div>
              <Progress 
                value={(streakData.monthlyProgress / streakData.monthlyGoal) * 100} 
                className="h-3"
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {streakData.monthlyGoal - streakData.monthlyProgress} يوم متبقي
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((streakData.monthlyProgress / streakData.monthlyGoal) * 100)}% مكتمل
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards and Milestones */}
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards">المكافآت المتاحة</TabsTrigger>
          <TabsTrigger value="milestones">معالم السلسلة</TabsTrigger>
          <TabsTrigger value="history">سجل النشاط</TabsTrigger>
        </TabsList>

        {/* Available Rewards */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => {
              const RewardIcon = getRewardIcon(reward.reward.type);
              const isClaimable = reward.isUnlocked && !reward.isClaimed;
              
              return (
                <Card 
                  key={reward.id} 
                  className={`transition-all duration-300 ${
                    isClaimable ? 'ring-2 ring-green-200 bg-green-50/30' : 
                    reward.isClaimed ? 'opacity-75 bg-gray-50' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{reward.reward.icon}</div>
                      <Badge className={`${getRewardTypeColor(reward.type)} border mb-2`}>
                        {reward.type === 'streak' ? 'سلسلة' :
                         reward.type === 'weekly' ? 'أسبوعي' :
                         reward.type === 'monthly' ? 'شهري' : 'مكافأة'}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg text-center mb-2">{reward.title}</h3>
                    <p className="text-sm text-gray-600 text-center mb-4">{reward.description}</p>

                    {/* Progress */}
                    <div className="space-y-2 mb-4">
                      <Progress 
                        value={(reward.currentProgress / reward.requirement) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{reward.currentProgress}/{reward.requirement}</span>
                        <span>{Math.round((reward.currentProgress / reward.requirement) * 100)}%</span>
                      </div>
                    </div>

                    {/* Reward Details */}
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <RewardIcon className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{reward.reward.value}</span>
                      </div>
                      {reward.reward.points > 0 && (
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mt-1">
                          <Star className="h-3 w-3" />
                          <span>{reward.reward.points} نقطة</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="text-center">
                      {reward.isClaimed ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">تم الاستلام</span>
                        </div>
                      ) : isClaimable ? (
                        <Button 
                          size="sm" 
                          onClick={() => claimReward(reward.id)}
                          disabled={claimingReward === reward.id}
                          className="w-full"
                        >
                          {claimingReward === reward.id ? (
                            <>
                              <Timer className="h-4 w-4 mr-2 animate-spin" />
                              جاري الاستلام...
                            </>
                          ) : (
                            <>
                              <Gift className="h-4 w-4 mr-2" />
                              استلام المكافأة
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">غير متاح بعد</span>
                        </div>
                      )}
                    </div>

                    {reward.resetType && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        يتم إعادة التعيين {reward.resetType === 'daily' ? 'يومياً' : 
                                           reward.resetType === 'weekly' ? 'أسبوعياً' : 'شهرياً'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Streak Milestones */}
        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                معالم السلسلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      milestone.unlocked ? 
                        milestone.claimed ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200' :
                        'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      milestone.unlocked ? 
                        milestone.claimed ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-600'
                    }`}>
                      {milestone.days}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">معلم {milestone.days} أيام</h4>
                      <p className="text-sm text-gray-600">المكافأة: {milestone.reward}</p>
                    </div>

                    <div className="text-right">
                      {milestone.claimed ? (
                        <Badge className="bg-green-100 text-green-800">
                          تم الاستلام
                        </Badge>
                      ) : milestone.unlocked ? (
                        <Button size="sm" className="gap-2">
                          <Gift className="h-4 w-4" />
                          استلام
                        </Button>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">
                          مؤجل
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                سجل النشاط اليومي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {streakHistory.map((day, index) => (
                  <div 
                    key={day.date}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      day.completed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      day.completed ? 'bg-green-200' : 'bg-red-200'
                    }`}>
                      {day.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {new Date(day.date).toLocaleDateString('ar', { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <Badge variant="outline" className={
                          day.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }>
                          {day.completed ? 'مكتمل' : 'مفقود'}
                        </Badge>
                      </div>
                      {day.completed && (
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {day.lessons} دروس
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {day.points} نقطة
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {index < streakData.currentStreak && day.completed && (
                        <Flame className={`h-5 w-5 ${getStreakFlameColor(streakData.currentStreak - index)}`} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressStreaksRewards;