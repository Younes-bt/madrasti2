import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Target,
  Flame,
  Users,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  Zap,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Minus,
  Filter,
  RefreshCw,
  Gift,
  Sparkles,
  Timer,
  Flag
} from 'lucide-react';

const LeaderboardCompetitions = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [activeCompetition, setActiveCompetition] = useState(null);

  // Mock data - replace with real API integration
  const [leaderboardData] = useState({
    week: [
      {
        id: 1,
        rank: 1,
        previousRank: 2,
        name: 'أحمد محمد',
        avatar: '/api/placeholder/40/40',
        class: '5A',
        points: 1250,
        weeklyPoints: 380,
        badges: 12,
        streak: 15,
        completedLessons: 8,
        level: 15,
        change: 'up',
        changeAmount: 1
      },
      {
        id: 2,
        rank: 2,
        previousRank: 1,
        name: 'فاطمة أحمد',
        avatar: '/api/placeholder/40/40',
        class: '5A',
        points: 1180,
        weeklyPoints: 350,
        badges: 15,
        streak: 12,
        completedLessons: 7,
        level: 14,
        change: 'down',
        changeAmount: 1
      },
      {
        id: 3,
        rank: 3,
        previousRank: 4,
        name: 'محمد علي',
        avatar: '/api/placeholder/40/40',
        class: '5B',
        points: 1120,
        weeklyPoints: 320,
        badges: 10,
        streak: 8,
        completedLessons: 6,
        level: 13,
        change: 'up',
        changeAmount: 1
      },
      {
        id: 4,
        rank: 4,
        previousRank: 3,
        name: 'سارة حسن',
        avatar: '/api/placeholder/40/40',
        class: '5C',
        points: 1080,
        weeklyPoints: 290,
        badges: 11,
        streak: 10,
        completedLessons: 6,
        level: 13,
        change: 'down',
        changeAmount: 1
      },
      {
        id: 5,
        rank: 5,
        previousRank: 5,
        name: 'خالد يوسف',
        avatar: '/api/placeholder/40/40',
        class: '5A',
        points: 1050,
        weeklyPoints: 280,
        badges: 9,
        streak: 6,
        completedLessons: 5,
        level: 12,
        change: 'same',
        changeAmount: 0
      }
    ]
  });

  const [competitions] = useState([
    {
      id: 1,
      title: 'تحدي الرياضيات الكبير',
      description: 'اكمل أكبر عدد من دروس الرياضيات في أسبوع واحد',
      type: 'subject',
      subject: 'الرياضيات',
      startDate: '2024-02-19T00:00:00Z',
      endDate: '2024-02-25T23:59:59Z',
      participants: 156,
      maxParticipants: 200,
      prizes: [
        { rank: 1, prize: 'شارة ذهبية + 500 نقطة', icon: '🏆' },
        { rank: 2, prize: 'شارة فضية + 300 نقطة', icon: '🥈' },
        { rank: 3, prize: 'شارة برونزية + 200 نقطة', icon: '🥉' }
      ],
      isActive: true,
      isJoined: true,
      requirements: ['أكمل على الأقل 3 دروس رياضيات', 'احصل على معدل 70% أو أكثر'],
      leaderboard: [
        { id: 1, name: 'أحمد محمد', progress: 12, points: 450 },
        { id: 2, name: 'فاطمة أحمد', progress: 10, points: 380 },
        { id: 3, name: 'محمد علي', progress: 9, points: 350 }
      ]
    },
    {
      id: 2,
      title: 'ماراثون القراءة',
      description: 'اقرأ أكبر عدد من النصوص في شهر فبراير',
      type: 'subject',
      subject: 'اللغة العربية',
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-29T23:59:59Z',
      participants: 203,
      maxParticipants: 250,
      prizes: [
        { rank: 1, prize: 'كتاب مطبوع + 600 نقطة', icon: '📚' },
        { rank: 2, prize: 'مجلة تعليمية + 400 نقطة', icon: '📖' },
        { rank: 3, prize: '300 نقطة', icon: '⭐' }
      ],
      isActive: true,
      isJoined: false,
      requirements: ['اقرأ على الأقل 5 نصوص', 'أجب على جميع الأسئلة بشكل صحيح'],
      leaderboard: [
        { id: 4, name: 'سارة حسن', progress: 18, points: 540 },
        { id: 2, name: 'فاطمة أحمد', progress: 15, points: 475 },
        { id: 5, name: 'خالد يوسف', progress: 13, points: 420 }
      ]
    },
    {
      id: 3,
      title: 'سباق السرعة',
      description: 'اكمل الدروس في أقل وقت ممكن مع الحفاظ على الدقة',
      type: 'speed',
      subject: 'جميع المواد',
      startDate: '2024-02-15T00:00:00Z',
      endDate: '2024-02-22T23:59:59Z',
      participants: 89,
      maxParticipants: 100,
      prizes: [
        { rank: 1, prize: 'شارة البرق + 400 نقطة', icon: '⚡' },
        { rank: 2, prize: '250 نقطة', icon: '🚀' },
        { rank: 3, prize: '150 نقطة', icon: '💨' }
      ],
      isActive: false,
      isJoined: true,
      requirements: ['أكمل على الأقل 5 دروس', 'الحد الأقصى للوقت: 15 دقيقة لكل درس', 'دقة لا تقل عن 80%'],
      leaderboard: [
        { id: 1, name: 'أحمد محمد', progress: 8, points: 320 },
        { id: 3, name: 'محمد علي', progress: 7, points: 290 },
        { id: 2, name: 'فاطمة أحمد', progress: 6, points: 260 }
      ]
    }
  ]);

  const periods = [
    { id: 'day', name: 'اليوم', icon: Clock },
    { id: 'week', name: 'الأسبوع', icon: Calendar },
    { id: 'month', name: 'الشهر', icon: Calendar },
    { id: 'all', name: 'الكل', icon: Trophy }
  ];

  const categories = [
    { id: 'overall', name: 'عام', icon: Trophy },
    { id: 'math', name: 'الرياضيات', icon: Target },
    { id: 'arabic', name: 'اللغة العربية', icon: BookOpen },
    { id: 'science', name: 'العلوم', icon: Zap },
    { id: 'streak', name: 'السلاسل', icon: Flame }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getChangeIcon = (change, amount) => {
    switch (change) {
      case 'up': return <ChevronUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ChevronDown className="h-4 w-4 text-red-500" />;
      case 'same': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'انتهى';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} يوم و ${hours} ساعة`;
    return `${hours} ساعة`;
  };

  const joinCompetition = (competitionId) => {
    // Handle joining competition
    console.log('Joining competition:', competitionId);
  };

  const leaveCompetition = (competitionId) => {
    // Handle leaving competition
    console.log('Leaving competition:', competitionId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('لوحة المتصدرين والمسابقات')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('تنافس مع زملائك واكسب المراكز الأولى')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            فلترة
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard">لوحة المتصدرين</TabsTrigger>
          <TabsTrigger value="competitions">المسابقات</TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          {/* Period and Category Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">الفترة:</span>
              {periods.map((period) => {
                const IconComponent = period.icon;
                return (
                  <Button
                    key={period.id}
                    variant={selectedPeriod === period.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period.id)}
                    className="gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {period.name}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">الفئة:</span>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
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
          </div>

          {/* Top 3 Podium */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                المراكز الأولى - {selectedPeriod === 'week' ? 'هذا الأسبوع' : selectedPeriod}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-end gap-4">
                {/* Second Place */}
                {leaderboardData.week[1] && (
                  <div className="text-center">
                    <div className="bg-gradient-to-t from-gray-200 to-gray-100 rounded-lg p-6 mb-4 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gray-500 text-white px-3 py-1">2</Badge>
                      </div>
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={leaderboardData.week[1].avatar} />
                        <AvatarFallback>{leaderboardData.week[1].name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg">{leaderboardData.week[1].name}</h3>
                      <p className="text-sm text-gray-600">{leaderboardData.week[1].class}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{leaderboardData.week[1].points}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* First Place */}
                {leaderboardData.week[0] && (
                  <div className="text-center">
                    <div className="bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-lg p-8 mb-4 relative transform scale-110">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Crown className="h-8 w-8 text-yellow-600" />
                      </div>
                      <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-yellow-400">
                        <AvatarImage src={leaderboardData.week[0].avatar} />
                        <AvatarFallback>{leaderboardData.week[0].name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-xl">{leaderboardData.week[0].name}</h3>
                      <p className="text-sm text-gray-600">{leaderboardData.week[0].class}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="font-bold text-lg">{leaderboardData.week[0].points}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Third Place */}
                {leaderboardData.week[2] && (
                  <div className="text-center">
                    <div className="bg-gradient-to-t from-amber-200 to-amber-100 rounded-lg p-6 mb-4 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-amber-600 text-white px-3 py-1">3</Badge>
                      </div>
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={leaderboardData.week[2].avatar} />
                        <AvatarFallback>{leaderboardData.week[2].name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg">{leaderboardData.week[2].name}</h3>
                      <p className="text-sm text-gray-600">{leaderboardData.week[2].class}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{leaderboardData.week[2].points}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                التصنيف الكامل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.week.map((student, index) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:bg-gray-50 ${student.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}
                  >
                    {/* Rank */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(student.rank)}`}>
                      {getRankIcon(student.rank)}
                    </div>

                    {/* Avatar and Info */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{student.name}</h3>
                        <Badge variant="outline">{student.class}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">المستوى {student.level}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {student.points} نقطة
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-purple-500" />
                          {student.badges} شارة
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-red-500" />
                          {student.streak} يوم
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          {student.completedLessons} دروس
                        </span>
                      </div>
                    </div>

                    {/* Weekly Points */}
                    <div className="text-center">
                      <p className="font-bold text-lg text-green-600">+{student.weeklyPoints}</p>
                      <p className="text-xs text-gray-500">نقاط الأسبوع</p>
                    </div>

                    {/* Rank Change */}
                    <div className="flex items-center gap-1 min-w-[60px] justify-center">
                      {getChangeIcon(student.change)}
                      {student.changeAmount > 0 && (
                        <span className={`text-sm ${student.change === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {student.changeAmount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitions Tab */}
        <TabsContent value="competitions" className="space-y-6">
          {/* Active Competitions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.map((competition) => (
              <Card key={competition.id} className={`${competition.isActive ? 'ring-2 ring-blue-200 bg-blue-50/30' : 'opacity-75'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {competition.isActive ? (
                          <Sparkles className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Flag className="h-5 w-5 text-gray-500" />
                        )}
                        {competition.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{competition.description}</p>
                    </div>
                    <Badge className={competition.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {competition.isActive ? 'نشط' : 'منتهي'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Competition Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">المشاركون</p>
                      <p className="font-medium">{competition.participants}/{competition.maxParticipants}</p>
                      <Progress 
                        value={(competition.participants / competition.maxParticipants) * 100} 
                        className="h-2 mt-1" 
                      />
                    </div>
                    <div>
                      <p className="text-gray-600">الوقت المتبقي</p>
                      <p className="font-medium flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {getTimeRemaining(competition.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <p className="font-medium text-gray-800 mb-2">المتطلبات:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {competition.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prizes */}
                  <div>
                    <p className="font-medium text-gray-800 mb-2">الجوائز:</p>
                    <div className="space-y-2">
                      {competition.prizes.map((prize) => (
                        <div key={prize.rank} className="flex items-center gap-2 text-sm">
                          <span className="text-lg">{prize.icon}</span>
                          <span className="font-medium">المركز {prize.rank}:</span>
                          <span className="text-gray-600">{prize.prize}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Participants Preview */}
                  {competition.isActive && (
                    <div>
                      <p className="font-medium text-gray-800 mb-2">المتصدرون:</p>
                      <div className="space-y-2">
                        {competition.leaderboard.slice(0, 3).map((participant, index) => (
                          <div key={participant.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-yellow-200 text-yellow-800' :
                                index === 1 ? 'bg-gray-200 text-gray-800' :
                                'bg-amber-200 text-amber-800'
                              }`}>
                                {index + 1}
                              </span>
                              <span>{participant.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600">{participant.progress} دروس</span>
                              <span className="font-medium text-blue-600">{participant.points} نقطة</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {competition.isActive ? (
                      competition.isJoined ? (
                        <div className="flex gap-2 w-full">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setActiveCompetition(competition)}
                            className="flex-1"
                          >
                            عرض التفاصيل
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => leaveCompetition(competition.id)}
                          >
                            إلغاء المشاركة
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => joinCompetition(competition.id)}
                          className="w-full"
                        >
                          الانضمام للمسابقة
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" size="sm" disabled className="w-full">
                        المسابقة منتهية
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Competition Button */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-bold text-lg mb-2">إنشاء مسابقة جديدة</h3>
              <p className="text-gray-600 mb-4">
                أنشئ مسابقة مخصصة لصفك أو مدرستك
              </p>
              <Button className="gap-2">
                <Trophy className="h-4 w-4" />
                إنشاء مسابقة
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Competition Detail Modal */}
      {activeCompetition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{activeCompetition.title}</CardTitle>
                <Button variant="outline" onClick={() => setActiveCompetition(null)}>
                  إغلاق
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700">{activeCompetition.description}</p>

              {/* Full Leaderboard */}
              <div>
                <h3 className="font-bold text-lg mb-3">لوحة المتصدرين</h3>
                <div className="space-y-2">
                  {activeCompetition.leaderboard.map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-200 text-yellow-800' :
                          index === 1 ? 'bg-gray-200 text-gray-800' :
                          index === 2 ? 'bg-amber-200 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{participant.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">{participant.progress} دروس</span>
                        <span className="font-bold text-blue-600">{participant.points} نقطة</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competition Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{activeCompetition.participants}</p>
                  <p className="text-sm text-gray-600">مشارك</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{getTimeRemaining(activeCompetition.endDate)}</p>
                  <p className="text-sm text-gray-600">متبقي</p>
                </div>
              </div>

              {/* Prizes Detail */}
              <div>
                <h3 className="font-bold text-lg mb-3">الجوائز</h3>
                <div className="space-y-3">
                  {activeCompetition.prizes.map((prize) => (
                    <div key={prize.rank} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="text-2xl">{prize.icon}</span>
                      <div>
                        <p className="font-medium">المركز {prize.rank}</p>
                        <p className="text-sm text-gray-600">{prize.prize}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeaderboardCompetitions;