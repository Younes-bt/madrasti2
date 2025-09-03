import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Star,
  Crown,
  Zap,
  Trophy,
  Target,
  TrendingUp,
  Gift,
  Award,
  Coins,
  Gem,
  Shield,
  Sword,
  Heart,
  Diamond,
  Sparkles,
  ChevronUp,
  BookOpen,
  Clock,
  Users,
  Flame,
  Medal,
  ArrowUp,
  Plus,
  Minus,
  Calculator,
  BarChart3
} from 'lucide-react';

const PointSystemLeveling = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);

  // Mock data - replace with real API integration
  const [playerData] = useState({
    currentPoints: 2750,
    currentLevel: 15,
    currentLevelName: 'الباحث المتميز',
    nextLevel: 16,
    nextLevelName: 'عالم المستقبل',
    pointsToNextLevel: 250,
    totalPointsForNextLevel: 3000,
    pointsThisLevel: 500, // Points needed from level 14 to 15
    earnedThisWeek: 380,
    earnedThisMonth: 1240,
    multiplier: 1.2,
    rank: 5,
    totalStudents: 150
  });

  const [pointSources] = useState([
    {
      activity: 'إكمال درس',
      basePoints: 20,
      multiplier: 1.0,
      description: 'نقاط أساسية لإكمال أي درس',
      icon: '📖',
      category: 'learning'
    },
    {
      activity: 'إكمال درس بدرجة ممتازة (90%+)',
      basePoints: 35,
      multiplier: 1.2,
      description: 'مكافأة إضافية للأداء المتميز',
      icon: '⭐',
      category: 'performance'
    },
    {
      activity: 'إكمال درس في المحاولة الأولى',
      basePoints: 15,
      multiplier: 1.0,
      description: 'مكافأة للفهم السريع',
      icon: '🎯',
      category: 'efficiency'
    },
    {
      activity: 'إكمال تمرين تفاعلي',
      basePoints: 10,
      multiplier: 1.1,
      description: 'نقاط للمشاركة الفعالة',
      icon: '🎮',
      category: 'engagement'
    },
    {
      activity: 'الحفاظ على سلسلة يومية',
      basePoints: 25,
      multiplier: 1.5,
      description: 'مكافأة الثبات والانتظام',
      icon: '🔥',
      category: 'consistency'
    },
    {
      activity: 'مساعدة زميل',
      basePoints: 30,
      multiplier: 1.3,
      description: 'تشجيع التعاون والمساعدة',
      icon: '🤝',
      category: 'social'
    },
    {
      activity: 'المشاركة في مسابقة',
      basePoints: 50,
      multiplier: 1.0,
      description: 'نقاط للمشاركة في الأنشطة الجماعية',
      icon: '🏆',
      category: 'competition'
    },
    {
      activity: 'الحصول على شارة جديدة',
      basePoints: 100,
      multiplier: 2.0,
      description: 'مكافأة كبيرة للإنجازات المميزة',
      icon: '🏅',
      category: 'achievement'
    }
  ]);

  const [levelSystem] = useState([
    { level: 1, name: 'مبتدئ', pointsRequired: 0, color: 'bg-gray-100', icon: '🌱' },
    { level: 2, name: 'متعلم نشط', pointsRequired: 100, color: 'bg-green-100', icon: '📚' },
    { level: 3, name: 'طالب مجتهد', pointsRequired: 250, color: 'bg-green-200', icon: '✏️' },
    { level: 4, name: 'باحث صغير', pointsRequired: 450, color: 'bg-blue-100', icon: '🔍' },
    { level: 5, name: 'عقل فضولي', pointsRequired: 700, color: 'bg-blue-200', icon: '🧠' },
    { level: 6, name: 'محب المعرفة', pointsRequired: 1000, color: 'bg-purple-100', icon: '💡' },
    { level: 7, name: 'طالب متميز', pointsRequired: 1350, color: 'bg-purple-200', icon: '⭐' },
    { level: 8, name: 'باحث ماهر', pointsRequired: 1750, color: 'bg-indigo-100', icon: '🎓' },
    { level: 9, name: 'عالم صغير', pointsRequired: 2200, color: 'bg-indigo-200', icon: '🔬' },
    { level: 10, name: 'خبير المعرفة', pointsRequired: 2700, color: 'bg-yellow-100', icon: '💫' },
    { level: 11, name: 'أستاذ المستقبل', pointsRequired: 3250, color: 'bg-yellow-200', icon: '👨‍🏫' },
    { level: 12, name: 'عبقري صغير', pointsRequired: 3850, color: 'bg-orange-100', icon: '🧮' },
    { level: 13, name: 'عالم رياضيات', pointsRequired: 4500, color: 'bg-orange-200', icon: '🔢' },
    { level: 14, name: 'مفكر كبير', pointsRequired: 5200, color: 'bg-red-100', icon: '🤔' },
    { level: 15, name: 'الباحث المتميز', pointsRequired: 5950, color: 'bg-red-200', icon: '🌟' },
    { level: 16, name: 'عالم المستقبل', pointsRequired: 6750, color: 'bg-pink-100', icon: '🚀' },
    { level: 17, name: 'أسطورة المعرفة', pointsRequired: 7600, color: 'bg-pink-200', icon: '👑' },
    { level: 18, name: 'سيد العقول', pointsRequired: 8500, color: 'bg-violet-100', icon: '🧙‍♂️' },
    { level: 19, name: 'إمبراطور التعلم', pointsRequired: 9450, color: 'bg-violet-200', icon: '👑' },
    { level: 20, name: 'إله المعرفة', pointsRequired: 10500, color: 'bg-gradient-to-r from-yellow-200 to-orange-200', icon: '⚡' }
  ]);

  const [pointsHistory] = useState([
    { date: '2024-02-20', points: 85, activities: ['درس رياضيات (+35)', 'تمرين تفاعلي (+15)', 'سلسلة يومية (+35)'] },
    { date: '2024-02-19', points: 65, activities: ['درس عربي (+25)', 'مساعدة زميل (+40)'] },
    { date: '2024-02-18', points: 120, activities: ['درس علوم (+35)', 'شارة جديدة (+100)', 'تمرين (+10)'] },
    { date: '2024-02-17', points: 45, activities: ['درس تاريخ (+25)', 'سلسلة يومية (+20)'] },
    { date: '2024-02-16', points: 95, activities: ['درس رياضيات (+35)', 'مشاركة مسابقة (+50)', 'تمرين (+10)'] }
  ]);

  const [multipliers] = useState([
    {
      name: 'مضاعف الأداء الممتاز',
      description: 'x1.5 للدرجات أعلى من 95%',
      isActive: true,
      multiplier: 1.5,
      condition: 'درجة > 95%',
      icon: '🌟'
    },
    {
      name: 'مضاعف السلسلة',
      description: 'x1.3 عند الوصول لسلسلة 10 أيام',
      isActive: true,
      multiplier: 1.3,
      condition: 'سلسلة ≥ 10 أيام',
      icon: '🔥'
    },
    {
      name: 'مضاعف نهاية الأسبوع',
      description: 'x2.0 للأنشطة في نهاية الأسبوع',
      isActive: false,
      multiplier: 2.0,
      condition: 'الجمعة والسبت',
      icon: '📅'
    },
    {
      name: 'مضاعف المساعدة',
      description: 'x2.5 لمساعدة الزملاء',
      isActive: true,
      multiplier: 2.5,
      condition: 'مساعدة الآخرين',
      icon: '🤝'
    }
  ]);

  const getCurrentLevel = () => {
    return levelSystem.find(level => level.level === playerData.currentLevel) || levelSystem[0];
  };

  const getNextLevel = () => {
    return levelSystem.find(level => level.level === playerData.nextLevel) || levelSystem[levelSystem.length - 1];
  };

  const calculatePointsWithMultiplier = (basePoints, multiplier = 1) => {
    return Math.round(basePoints * multiplier * playerData.multiplier);
  };

  const simulateLevelUp = () => {
    setLevelUpAnimation(true);
    setTimeout(() => setLevelUpAnimation(false), 3000);
  };

  const getProgressToNextLevel = () => {
    const currentLevelData = getCurrentLevel();
    const nextLevelData = getNextLevel();
    const progressPoints = playerData.currentPoints - currentLevelData.pointsRequired;
    const totalPoints = nextLevelData.pointsRequired - currentLevelData.pointsRequired;
    return (progressPoints / totalPoints) * 100;
  };

  const getPointsBreakdown = () => {
    const weeklyBreakdown = pointSources.map(source => ({
      ...source,
      estimatedWeekly: Math.floor(Math.random() * 100) + 20
    }));
    return weeklyBreakdown;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('نظام النقاط والمستويات')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('اكسب النقاط وارتق في المستويات')}
          </p>
        </div>
        <Button onClick={simulateLevelUp} className="gap-2">
          <Crown className="h-4 w-4" />
          محاكاة ترقية
        </Button>
      </div>

      {/* Current Level Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level Display */}
        <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 ${levelUpAnimation ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-3">{getCurrentLevel().icon}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-purple-600" />
              <span className="text-3xl font-bold">{playerData.currentLevel}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {playerData.currentLevelName}
            </h2>
            <Badge className="bg-purple-100 text-purple-800 mb-4">
              المرتبة #{playerData.rank} من {playerData.totalStudents}
            </Badge>
            
            {levelUpAnimation && (
              <div className="animate-bounce">
                <Sparkles className="h-8 w-8 text-yellow-500 mx-auto" />
                <p className="text-yellow-600 font-bold mt-2">ترقية جديدة! 🎉</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Points Display */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-bold text-lg">إجمالي النقاط</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {playerData.currentPoints.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">هذا الأسبوع</span>
                <span className="font-bold text-green-600">+{playerData.earnedThisWeek}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">هذا الشهر</span>
                <span className="font-bold text-blue-600">+{playerData.earnedThisMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">مضاعف النقاط</span>
                <Badge className="bg-orange-100 text-orange-800">
                  x{playerData.multiplier}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Level Progress */}
        <Card className="bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-bold text-lg">المستوى التالي</h3>
                <p className="text-lg font-medium text-green-600">
                  {playerData.nextLevelName}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Progress value={getProgressToNextLevel()} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">التقدم</span>
                <span className="font-bold">{Math.round(getProgressToNextLevel())}%</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {playerData.pointsToNextLevel} نقطة متبقية
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">قريب من الترقية!</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="earning">كسب النقاط</TabsTrigger>
          <TabsTrigger value="levels">المستويات</TabsTrigger>
          <TabsTrigger value="history">السجل</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(getProgressToNextLevel())}%
                </p>
                <p className="text-sm text-gray-600">تقدم المستوى</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">#{playerData.rank}</p>
                <p className="text-sm text-gray-600">الترتيب العام</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">x{playerData.multiplier}</p>
                <p className="text-sm text-gray-600">مضاعف النقاط</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{playerData.earnedThisWeek}</p>
                <p className="text-sm text-gray-600">نقاط الأسبوع</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Multipliers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                المضاعفات النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {multipliers.filter(m => m.isActive).map((multiplier, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl">{multiplier.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium">{multiplier.name}</h4>
                      <p className="text-sm text-gray-600">{multiplier.description}</p>
                    </div>
                    <Badge className="bg-yellow-200 text-yellow-800">
                      x{multiplier.multiplier}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Point Earning Tab */}
        <TabsContent value="earning" className="space-y-6">
          {/* Point Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                مصادر النقاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pointSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{source.icon}</div>
                      <div>
                        <h4 className="font-medium">{source.activity}</h4>
                        <p className="text-sm text-gray-600">{source.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-blue-600">
                          {calculatePointsWithMultiplier(source.basePoints, source.multiplier)}
                        </span>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                      {source.multiplier > 1.0 && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs mt-1">
                          مضاعف x{source.multiplier}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Points Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-500" />
                حاسبة النقاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">النقاط الأساسية</p>
                    <p className="text-xl font-bold text-blue-600">25</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">مضاعف النشاط</p>
                    <p className="text-xl font-bold text-orange-600">x1.5</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">النقاط النهائية</p>
                    <p className="text-2xl font-bold text-green-600">
                      {calculatePointsWithMultiplier(25, 1.5)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    مضاعف الطالب الحالي: x{playerData.multiplier}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Levels Tab */}
        <TabsContent value="levels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                نظام المستويات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {levelSystem.map((level, index) => {
                  const isCurrentLevel = level.level === playerData.currentLevel;
                  const isPassed = level.level < playerData.currentLevel;
                  const isNext = level.level === playerData.nextLevel;
                  
                  return (
                    <div 
                      key={level.level}
                      className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                        isCurrentLevel ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' :
                        isPassed ? 'bg-green-50 border-green-200' :
                        isNext ? 'bg-yellow-50 border-yellow-200' :
                        'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${level.color}`}>
                        {level.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">المستوى {level.level}</h3>
                          {isCurrentLevel && (
                            <Badge className="bg-blue-100 text-blue-800">الحالي</Badge>
                          )}
                          {isNext && (
                            <Badge className="bg-yellow-100 text-yellow-800">التالي</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 font-medium">{level.name}</p>
                        <p className="text-sm text-gray-600">
                          {level.pointsRequired.toLocaleString()} نقطة مطلوبة
                        </p>
                      </div>

                      <div className="text-right">
                        {isPassed && (
                          <div className="text-green-600">
                            <CheckCircle className="h-6 w-6" />
                          </div>
                        )}
                        {isCurrentLevel && (
                          <div className="text-center">
                            <Crown className="h-6 w-6 text-blue-600 mx-auto" />
                            <p className="text-xs text-blue-600 mt-1">مستواك</p>
                          </div>
                        )}
                        {isNext && (
                          <div className="text-center">
                            <Target className="h-6 w-6 text-yellow-600 mx-auto" />
                            <p className="text-xs text-yellow-600 mt-1">
                              {playerData.pointsToNextLevel} متبقي
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                سجل النقاط
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pointsHistory.map((day, index) => (
                  <div key={day.date} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">
                        {new Date(day.date).toLocaleDateString('ar', { 
                          weekday: 'long', 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          +{day.points} نقطة
                        </Badge>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {day.activities.map((activity, actIndex) => (
                        <p key={actIndex} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          {activity}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                ملخص الأسبوع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{playerData.earnedThisWeek}</p>
                  <p className="text-sm text-gray-600">نقاط الأسبوع</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(playerData.earnedThisWeek / 7)}
                  </p>
                  <p className="text-sm text-gray-600">متوسط يومي</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {pointsHistory.length}
                  </p>
                  <p className="text-sm text-gray-600">أيام نشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Level Up Modal */}
      {levelUpAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4 animate-bounce">{getNextLevel().icon}</div>
            <h2 className="text-2xl font-bold mb-2 text-yellow-600">تهانينا!</h2>
            <p className="text-lg mb-4">وصلت إلى المستوى {playerData.nextLevel}</p>
            <h3 className="text-xl font-bold text-purple-600 mb-4">
              {playerData.nextLevelName}
            </h3>
            <div className="flex items-center justify-center gap-2 text-yellow-600">
              <Star className="h-6 w-6" />
              <span className="text-lg font-bold">+200 نقطة مكافأة</span>
              <Star className="h-6 w-6" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PointSystemLeveling;