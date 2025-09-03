import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Star,
  Trophy,
  Target,
  Flame,
  Heart,
  Zap,
  Crown,
  Gift,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Users,
  Medal,
  Sparkles,
  CheckCircle,
  ArrowUp,
  Plus,
  Play,
  ChevronRight,
  Gem,
  Shield,
  Rocket,
  Lightning,
  PartyPopper
} from 'lucide-react';

const StudentMotivationDashboard = () => {
  const { t } = useTranslation();
  const [motivationBoost, setMotivationBoost] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [celebrationMode, setCelebrationMode] = useState(false);

  // Mock data - replace with real API integration
  const [studentProfile] = useState({
    name: 'أحمد محمد',
    avatar: '/api/placeholder/80/80',
    level: 15,
    levelName: 'الباحث المتميز',
    points: 2750,
    rank: 5,
    totalStudents: 150,
    streak: 15,
    badges: 23,
    motivationScore: 85,
    weeklyGoals: 3,
    completedGoals: 2,
    nextMilestone: '30 يوم سلسلة',
    energyLevel: 78
  });

  const [recentAchievements] = useState([
    {
      id: 1,
      title: 'محارب الرياضيات',
      description: 'أكمل 20 درساً في الرياضيات',
      icon: '🧮',
      earnedAt: '2024-02-20T10:30:00Z',
      points: 200,
      rarity: 'rare'
    },
    {
      id: 2,
      title: 'سلسلة أسطورية',
      description: 'حافظ على 15 يوماً متتالياً',
      icon: '🔥',
      earnedAt: '2024-02-19T14:20:00Z',
      points: 300,
      rarity: 'epic'
    },
    {
      id: 3,
      title: 'المساعد الودود',
      description: 'ساعد 5 زملاء في الدروس',
      icon: '🤝',
      earnedAt: '2024-02-18T16:45:00Z',
      points: 150,
      rarity: 'uncommon'
    }
  ]);

  const [currentGoals] = useState([
    {
      id: 1,
      title: 'إكمال 5 دروس هذا الأسبوع',
      progress: 4,
      target: 5,
      reward: '100 نقطة + شارة',
      deadline: '2024-02-25T23:59:59Z',
      priority: 'high',
      category: 'weekly'
    },
    {
      id: 2,
      title: 'الحصول على 90% في جميع المواد',
      progress: 3,
      target: 4,
      reward: '200 نقطة + لقب جديد',
      deadline: '2024-02-28T23:59:59Z',
      priority: 'medium',
      category: 'performance'
    },
    {
      id: 3,
      title: 'الوصول للمستوى 16',
      progress: 2750,
      target: 3000,
      reward: 'ترقية + ميزات جديدة',
      deadline: null,
      priority: 'high',
      category: 'level'
    }
  ]);

  const [friendsActivity] = useState([
    {
      id: 1,
      name: 'فاطمة أحمد',
      avatar: '/api/placeholder/32/32',
      activity: 'حصلت على شارة جديدة',
      timestamp: '2024-02-20T15:30:00Z',
      points: 150
    },
    {
      id: 2,
      name: 'محمد علي',
      avatar: '/api/placeholder/32/32',
      activity: 'أكمل درس العلوم',
      timestamp: '2024-02-20T14:45:00Z',
      points: 35
    },
    {
      id: 3,
      name: 'سارة حسن',
      avatar: '/api/placeholder/32/32',
      activity: 'وصلت للمستوى 12',
      timestamp: '2024-02-20T13:20:00Z',
      points: 500
    }
  ]);

  const [dailyChallenges] = useState([
    {
      id: 1,
      title: 'درس سريع',
      description: 'أكمل درساً في أقل من 10 دقائق',
      reward: '50 نقطة',
      difficulty: 'سهل',
      icon: '⚡',
      timeLimit: '10 دقائق',
      isCompleted: false
    },
    {
      id: 2,
      title: 'الدرجة الكاملة',
      description: 'احصل على 100% في أي درس',
      reward: '75 نقطة',
      difficulty: 'متوسط',
      icon: '🎯',
      timeLimit: 'اليوم',
      isCompleted: true
    },
    {
      id: 3,
      title: 'المساعد النشط',
      description: 'ساعد زميلاً في درس صعب',
      reward: '100 نقطة',
      difficulty: 'متوسط',
      icon: '🤝',
      timeLimit: 'اليوم',
      isCompleted: false
    }
  ]);

  const [motivationalMessages] = useState([
    {
      message: 'أنت على بُعد خطوة واحدة من تحقيق هدفك الأسبوعي! 💪',
      type: 'encouragement',
      icon: '🎯'
    },
    {
      message: 'سلسلتك 15 يوم رائعة! حاول الوصول إلى 30 يوم 🔥',
      type: 'streak',
      icon: '🔥'
    },
    {
      message: 'أصدقاؤك متحمسون لرؤية إنجازاتك القادمة! 👥',
      type: 'social',
      icon: '👫'
    }
  ]);

  const [weeklyStats] = useState({
    lessonsCompleted: 8,
    timeSpent: 240, // minutes
    averageScore: 87,
    streakMaintained: true,
    badgesEarned: 2,
    pointsEarned: 380
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'سهل': return 'text-green-600 bg-green-50 border-green-200';
      case 'متوسط': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'صعب': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMotivationLevel = (score) => {
    if (score >= 80) return { level: 'عالي', color: 'text-green-600', icon: Rocket };
    if (score >= 60) return { level: 'متوسط', color: 'text-yellow-600', icon: Zap };
    return { level: 'منخفض', color: 'text-red-600', icon: Heart };
  };

  const triggerMotivationBoost = () => {
    setMotivationBoost(true);
    setTimeout(() => setMotivationBoost(false), 3000);
  };

  const celebrateAchievement = () => {
    setCelebrationMode(true);
    setTimeout(() => setCelebrationMode(false), 4000);
  };

  const motivationLevel = getMotivationLevel(studentProfile.motivationScore);
  const MotivationIcon = motivationLevel.icon;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('لوحة التحفيز')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('تابع تقدمك واحتفل بإنجازاتك')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={celebrateAchievement} variant="outline" size="sm" className="gap-2">
            <PartyPopper className="h-4 w-4" />
            احتفال
          </Button>
          <Button onClick={triggerMotivationBoost} size="sm" className="gap-2">
            <Rocket className="h-4 w-4" />
            دفعة تحفيز
          </Button>
        </div>
      </div>

      {/* Student Profile Overview */}
      <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 ${motivationBoost ? 'animate-pulse ring-4 ring-blue-300' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 ring-4 ring-blue-200">
              <AvatarImage src={studentProfile.avatar} />
              <AvatarFallback className="text-2xl">{studentProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{studentProfile.name}</h2>
                <Badge className="bg-purple-100 text-purple-800">
                  {studentProfile.levelName}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  المستوى {studentProfile.level}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-lg">{studentProfile.points.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600">نقطة</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="font-bold text-lg">#{studentProfile.rank}</span>
                  </div>
                  <p className="text-xs text-gray-600">الترتيب</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span className="font-bold text-lg">{studentProfile.streak}</span>
                  </div>
                  <p className="text-xs text-gray-600">يوم</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="font-bold text-lg">{studentProfile.badges}</span>
                  </div>
                  <p className="text-xs text-gray-600">شارة</p>
                </div>
              </div>
            </div>

            {/* Motivation Meter */}
            <div className="text-center">
              <div className="relative mb-2">
                <MotivationIcon className={`h-12 w-12 ${motivationLevel.color} mx-auto ${motivationBoost ? 'animate-bounce' : ''}`} />
                {motivationBoost && (
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-spin" />
                )}
              </div>
              <p className="font-bold text-lg">{studentProfile.motivationScore}%</p>
              <p className={`text-sm ${motivationLevel.color}`}>تحفيز {motivationLevel.level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Messages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {motivationalMessages.map((msg, index) => (
          <Card key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{msg.icon}</div>
                <p className="text-sm font-medium text-gray-800">{msg.message}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">الأهداف</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="challenges">التحديات</TabsTrigger>
          <TabsTrigger value="social">الأنشطة الاجتماعية</TabsTrigger>
        </TabsList>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          {/* Current Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                أهدافي الحالية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentGoals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedGoal(goal)}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-lg">{goal.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority === 'high' ? 'عالي' : goal.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </Badge>
                        <Badge variant="outline">
                          {goal.category === 'weekly' ? 'أسبوعي' : 
                           goal.category === 'performance' ? 'أداء' : 'مستوى'}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 mb-3">
                      <Progress 
                        value={goal.category === 'level' ? 
                          ((goal.progress / goal.target) * 100) : 
                          ((goal.progress / goal.target) * 100)} 
                        className="h-3" 
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {goal.category === 'level' ? 
                            `${goal.progress} / ${goal.target} نقطة` :
                            `${goal.progress} / ${goal.target}`}
                        </span>
                        <span className="font-medium">
                          {Math.round((goal.progress / goal.target) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{goal.reward}</span>
                      </div>
                      {goal.deadline && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(goal.deadline).toLocaleDateString('ar')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                ملخص الأسبوع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{weeklyStats.lessonsCompleted}</div>
                  <p className="text-sm text-gray-600">دروس مكتملة</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.floor(weeklyStats.timeSpent / 60)}س {weeklyStats.timeSpent % 60}د</div>
                  <p className="text-sm text-gray-600">وقت الدراسة</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{weeklyStats.averageScore}%</div>
                  <p className="text-sm text-gray-600">متوسط الدرجات</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{weeklyStats.badgesEarned}</div>
                  <p className="text-sm text-gray-600">شارات جديدة</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{weeklyStats.pointsEarned}</div>
                  <p className="text-sm text-gray-600">نقاط مكتسبة</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${weeklyStats.streakMaintained ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyStats.streakMaintained ? '✅' : '❌'}
                  </div>
                  <p className="text-sm text-gray-600">حفظ السلسلة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                إنجازاتي الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAchievements.map((achievement) => (
                  <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{achievement.points} نقطة</span>
                      </div>
                      
                      <Badge className={
                        achievement.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                        achievement.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }>
                        {achievement.rarity === 'common' ? 'شائع' :
                         achievement.rarity === 'uncommon' ? 'غير شائع' :
                         achievement.rarity === 'rare' ? 'نادر' : 'ملحمي'}
                      </Badge>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(achievement.earnedAt).toLocaleDateString('ar')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                التحديات اليومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div key={challenge.id} className={`border rounded-lg p-4 ${challenge.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{challenge.icon}</div>
                        <div>
                          <h3 className="font-bold">{challenge.title}</h3>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        {challenge.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <Button size="sm" className="gap-1">
                            <Play className="h-3 w-3" />
                            ابدأ
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{challenge.reward}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{challenge.timeLimit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                نشاط الأصدقاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {friendsActivity.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{friend.name}</span>
                        <span className="text-sm text-gray-600">{friend.activity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(friend.timestamp).toLocaleTimeString('ar')}</span>
                        <span>•</span>
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>+{friend.points} نقطة</span>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="gap-1">
                      <Heart className="h-3 w-3" />
                      إعجاب
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Encouragement from Friends */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                تشجيع من الأصدقاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-lg font-medium text-gray-800">
                  "أحمد، أنت تقوم بعمل رائع! استمر في التقدم 💪"
                </p>
                <p className="text-sm text-gray-600">- فاطمة أحمد</p>
                
                <div className="flex justify-center gap-2">
                  <Button size="sm" className="gap-1">
                    <Heart className="h-3 w-3" />
                    شكراً
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus className="h-3 w-3" />
                    رد التشجيع
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Celebration Modal */}
      {celebrationMode && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card className="text-center p-8 max-w-md">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold mb-4 text-yellow-600">
              أحسنت! أنت رائع!
            </h2>
            <p className="text-gray-600 mb-4">
              إنجازاتك تلهم الجميع في الصف
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl animate-pulse">⭐</div>
              <div className="text-4xl animate-pulse">🏆</div>
              <div className="text-4xl animate-pulse">🎖️</div>
            </div>
          </Card>
        </div>
      )}

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{selectedGoal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Progress value={(selectedGoal.progress / selectedGoal.target) * 100} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span>{selectedGoal.progress} / {selectedGoal.target}</span>
                  <span>{Math.round((selectedGoal.progress / selectedGoal.target) * 100)}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-500" />
                <span className="font-medium">{selectedGoal.reward}</span>
              </div>
              
              {selectedGoal.deadline && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>الموعد النهائي: {new Date(selectedGoal.deadline).toLocaleDateString('ar')}</span>
                </div>
              )}

              <Button className="w-full" onClick={() => setSelectedGoal(null)}>
                إغلاق
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentMotivationDashboard;