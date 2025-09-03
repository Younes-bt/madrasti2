import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Trophy,
  Star,
  Medal,
  Award,
  Target,
  Flame,
  BookOpen,
  Clock,
  Users,
  Zap,
  Crown,
  Shield,
  Gem,
  Heart,
  CheckCircle,
  Lock,
  Gift,
  Sparkles,
  TrendingUp,
  Calendar
} from 'lucide-react';

const AchievementBadgeSystem = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [animatingBadges, setAnimatingBadges] = useState([]);

  // Mock data - replace with real API integration
  const [userStats] = useState({
    totalPoints: 2450,
    level: 12,
    nextLevelPoints: 2750,
    totalBadges: 23,
    rareBadges: 5,
    currentStreak: 15,
    maxStreak: 28,
    completedAchievements: 18,
    totalAchievements: 32
  });

  const [badges] = useState([
    {
      id: 1,
      name: 'عالم الرياضيات',
      description: 'أكمل 50 درساً في الرياضيات',
      icon: '🧮',
      category: 'subject',
      rarity: 'common',
      earnedAt: '2024-02-15T10:30:00Z',
      isEarned: true,
      progress: 50,
      target: 50,
      points: 100,
      requirements: ['أكمل 50 درساً في الرياضيات', 'احصل على معدل 80% أو أكثر']
    },
    {
      id: 2,
      name: 'قارئ نهم',
      description: 'اقرأ 25 نصاً في اللغة العربية',
      icon: '📚',
      category: 'subject',
      rarity: 'uncommon',
      earnedAt: '2024-02-10T14:20:00Z',
      isEarned: true,
      progress: 25,
      target: 25,
      points: 150,
      requirements: ['اقرأ 25 نصاً', 'أجب على جميع أسئلة الفهم بشكل صحيح']
    },
    {
      id: 3,
      name: 'العالم الصغير',
      description: 'أكمل جميع تجارب العلوم للفصل الدراسي',
      icon: '🔬',
      category: 'subject',
      rarity: 'rare',
      earnedAt: null,
      isEarned: false,
      progress: 8,
      target: 12,
      points: 200,
      requirements: ['أكمل 12 تجربة علمية', 'احصل على درجة ممتاز في جميع التجارب']
    },
    {
      id: 4,
      name: 'صاروخ السرعة',
      description: 'أكمل درساً في أقل من 10 دقائق مع درجة كاملة',
      icon: '🚀',
      category: 'speed',
      rarity: 'epic',
      earnedAt: '2024-02-12T16:45:00Z',
      isEarned: true,
      progress: 1,
      target: 1,
      points: 300,
      requirements: ['أكمل درساً في أقل من 10 دقائق', 'احصل على درجة 100%']
    },
    {
      id: 5,
      name: 'المثابر',
      description: 'ادرس لمدة 15 يوماً متتالياً',
      icon: '🔥',
      category: 'streak',
      rarity: 'uncommon',
      earnedAt: '2024-02-08T12:30:00Z',
      isEarned: true,
      progress: 15,
      target: 15,
      points: 175,
      requirements: ['ادرس كل يوم لمدة 15 يوماً متتالياً', 'أكمل درساً واحداً على الأقل كل يوم']
    },
    {
      id: 6,
      name: 'أسطورة التحدي',
      description: 'اكسب 30 يوماً متتالياً من الدراسة',
      icon: '👑',
      category: 'streak',
      rarity: 'legendary',
      earnedAt: null,
      isEarned: false,
      progress: 15,
      target: 30,
      points: 500,
      requirements: ['ادرس كل يوم لمدة 30 يوماً', 'أكمل 3 دروس على الأقل كل يوم', 'احتفظ بمعدل 85% أو أكثر']
    },
    {
      id: 7,
      name: 'المساعد الودود',
      description: 'ساعد 10 زملاء في الدروس',
      icon: '🤝',
      category: 'social',
      rarity: 'uncommon',
      earnedAt: null,
      isEarned: false,
      progress: 3,
      target: 10,
      points: 150,
      requirements: ['ساعد 10 طلاب مختلفين', 'احصل على شكر من كل طالب ساعدته']
    },
    {
      id: 8,
      name: 'الطالب المثالي',
      description: 'احصل على درجة ممتاز في جميع المواد لشهر كامل',
      icon: '⭐',
      category: 'performance',
      rarity: 'epic',
      earnedAt: null,
      isEarned: false,
      progress: 2,
      target: 4,
      points: 400,
      requirements: ['احصل على 90% أو أكثر في جميع المواد', 'لمدة 4 أسابيع متتالية', 'لا تفوت أي درس']
    }
  ]);

  const categories = [
    { id: 'all', name: 'الكل', icon: Trophy },
    { id: 'subject', name: 'المواد الدراسية', icon: BookOpen },
    { id: 'speed', name: 'السرعة', icon: Zap },
    { id: 'streak', name: 'السلاسل', icon: Flame },
    { id: 'social', name: 'التفاعل', icon: Users },
    { id: 'performance', name: 'الأداء', icon: Target }
  ];

  const rarityConfig = {
    common: { color: 'bg-gray-100 text-gray-800 border-gray-300', name: 'شائع', glow: '' },
    uncommon: { color: 'bg-green-100 text-green-800 border-green-300', name: 'غير شائع', glow: 'shadow-green-200' },
    rare: { color: 'bg-blue-100 text-blue-800 border-blue-300', name: 'نادر', glow: 'shadow-blue-200' },
    epic: { color: 'bg-purple-100 text-purple-800 border-purple-300', name: 'ملحمي', glow: 'shadow-purple-200' },
    legendary: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', name: 'أسطوري', glow: 'shadow-yellow-200' }
  };

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedBadges = badges.filter(badge => badge.isEarned);
  const unlockedBadges = badges.filter(badge => !badge.isEarned);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
  };

  const calculateProgress = (badge) => {
    return Math.min((badge.progress / badge.target) * 100, 100);
  };

  const simulateNewBadge = () => {
    // Simulate earning a new badge
    const unearned = badges.filter(b => !b.isEarned);
    if (unearned.length > 0) {
      const newBadge = unearned[0];
      setAnimatingBadges([newBadge.id]);
      setTimeout(() => {
        setAnimatingBadges([]);
      }, 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('نظام الإنجازات والشارات')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('اكتشف إنجازاتك واكسب شارات جديدة')}
          </p>
        </div>
        <Button onClick={simulateNewBadge} className="gap-2">
          <Sparkles className="h-4 w-4" />
          محاكاة شارة جديدة
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">إجمالي النقاط</p>
                <p className="text-2xl font-bold text-blue-800">{userStats.totalPoints.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+150 اليوم</span>
                </div>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Star className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">المستوى الحالي</p>
                <p className="text-2xl font-bold text-purple-800">{userStats.level}</p>
                <Progress 
                  value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} 
                  className="mt-1 h-2"
                />
                <p className="text-xs text-purple-600 mt-1">
                  {userStats.nextLevelPoints - userStats.totalPoints} نقطة للمستوى التالي
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <Crown className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">الشارات المحققة</p>
                <p className="text-2xl font-bold text-yellow-800">{userStats.totalBadges}</p>
                <p className="text-xs text-yellow-600 mt-1">
                  {userStats.rareBadges} شارة نادرة
                </p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-full">
                <Medal className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">السلسلة الحالية</p>
                <p className="text-2xl font-bold text-red-800">{userStats.currentStreak}</p>
                <p className="text-xs text-red-600 mt-1">
                  أقصى سلسلة: {userStats.maxStreak} يوم
                </p>
              </div>
              <div className="p-3 bg-red-200 rounded-full">
                <Flame className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badge Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            فئات الشارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges Display */}
      <Tabs defaultValue="earned" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="earned">الشارات المحققة ({earnedBadges.length})</TabsTrigger>
          <TabsTrigger value="available">متاحة للحصول ({unlockedBadges.length})</TabsTrigger>
          <TabsTrigger value="all">جميع الشارات ({badges.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="earned" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBadges.filter(badge => badge.isEarned).map((badge) => (
              <Card
                key={badge.id}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${rarityConfig[badge.rarity].glow} ${animatingBadges.includes(badge.id) ? 'animate-bounce' : ''}`}
                onClick={() => handleBadgeClick(badge)}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative mb-3">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                  
                  <div className="space-y-2">
                    <Badge className={`${rarityConfig[badge.rarity].color} border`}>
                      {rarityConfig[badge.rarity].name}
                    </Badge>
                    
                    <div className="flex items-center justify-center gap-1 text-sm text-yellow-600">
                      <Star className="h-4 w-4" />
                      <span>{badge.points} نقطة</span>
                    </div>
                    
                    {badge.earnedAt && (
                      <p className="text-xs text-gray-500">
                        حُقِّق في: {new Date(badge.earnedAt).toLocaleDateString('ar')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBadges.filter(badge => !badge.isEarned).map((badge) => (
              <Card
                key={badge.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-dashed opacity-75"
                onClick={() => handleBadgeClick(badge)}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative mb-3">
                    <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                    <div className="absolute -top-1 -right-1">
                      <Lock className="h-5 w-5 text-gray-400 bg-white rounded-full" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-gray-600">{badge.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
                  
                  <div className="space-y-2">
                    <Badge className={`${rarityConfig[badge.rarity].color} border opacity-60`}>
                      {rarityConfig[badge.rarity].name}
                    </Badge>
                    
                    <div className="flex items-center justify-center gap-1 text-sm text-yellow-600 opacity-60">
                      <Star className="h-4 w-4" />
                      <span>{badge.points} نقطة</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <Progress value={calculateProgress(badge)} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {badge.progress}/{badge.target} - {Math.round(calculateProgress(badge))}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBadges.map((badge) => (
              <Card
                key={badge.id}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-2 ${badge.isEarned ? rarityConfig[badge.rarity].glow : 'border-dashed opacity-75'}`}
                onClick={() => handleBadgeClick(badge)}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative mb-3">
                    <div className={`text-4xl mb-2 ${badge.isEarned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <div className="absolute -top-1 -right-1">
                      {badge.isEarned ? (
                        <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${badge.isEarned ? '' : 'text-gray-600'}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-sm mb-3 ${badge.isEarned ? 'text-gray-600' : 'text-gray-500'}`}>
                    {badge.description}
                  </p>
                  
                  <div className="space-y-2">
                    <Badge className={`${rarityConfig[badge.rarity].color} border ${badge.isEarned ? '' : 'opacity-60'}`}>
                      {rarityConfig[badge.rarity].name}
                    </Badge>
                    
                    <div className={`flex items-center justify-center gap-1 text-sm text-yellow-600 ${badge.isEarned ? '' : 'opacity-60'}`}>
                      <Star className="h-4 w-4" />
                      <span>{badge.points} نقطة</span>
                    </div>
                    
                    {badge.isEarned ? (
                      badge.earnedAt && (
                        <p className="text-xs text-gray-500">
                          حُقِّق في: {new Date(badge.earnedAt).toLocaleDateString('ar')}
                        </p>
                      )
                    ) : (
                      <div className="space-y-1">
                        <Progress value={calculateProgress(badge)} className="h-2" />
                        <p className="text-xs text-gray-500">
                          {badge.progress}/{badge.target} - {Math.round(calculateProgress(badge))}%
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">{selectedBadge.icon}</div>
              <CardTitle className="text-xl">{selectedBadge.name}</CardTitle>
              <Badge className={`${rarityConfig[selectedBadge.rarity].color} border mx-auto`}>
                {rarityConfig[selectedBadge.rarity].name}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-700">{selectedBadge.description}</p>
              
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-lg">{selectedBadge.points} نقطة</span>
              </div>

              {selectedBadge.isEarned ? (
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">تم تحقيق هذه الشارة</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    في: {new Date(selectedBadge.earnedAt).toLocaleDateString('ar')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center">
                    <Progress value={calculateProgress(selectedBadge)} className="mb-2" />
                    <p className="text-sm text-gray-600">
                      التقدم: {selectedBadge.progress}/{selectedBadge.target} ({Math.round(calculateProgress(selectedBadge))}%)
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-800 mb-2">المتطلبات:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedBadge.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={() => setSelectedBadge(null)}
              >
                إغلاق
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Badge Animation */}
      {animatingBadges.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card className="text-center p-8 animate-pulse">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2 text-yellow-600">شارة جديدة!</h2>
            <p className="text-gray-600">تهانينا على تحقيق إنجاز جديد</p>
            <div className="mt-4">
              <Gift className="h-12 w-12 text-yellow-500 mx-auto animate-bounce" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AchievementBadgeSystem;