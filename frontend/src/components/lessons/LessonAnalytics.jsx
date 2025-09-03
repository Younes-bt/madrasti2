import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Award,
  BookOpen,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react';

const LessonAnalytics = () => {
  const { t } = useTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Mock data - replace with real API integration
  const [analyticsData] = useState({
    summary: {
      totalLessons: 156,
      activeLessons: 89,
      completedLessons: 67,
      avgCompletionRate: 73,
      totalStudents: 342,
      activeStudents: 289,
      avgEngagementTime: 18.5, // minutes
      avgScore: 78.2
    },
    completionTrends: [
      { date: '2024-01-08', completed: 45, started: 62, week: 'الأسبوع 1' },
      { date: '2024-01-15', completed: 52, started: 68, week: 'الأسبوع 2' },
      { date: '2024-01-22', completed: 48, started: 65, week: 'الأسبوع 3' },
      { date: '2024-01-29', completed: 58, started: 71, week: 'الأسبوع 4' },
      { date: '2024-02-05', completed: 63, started: 78, week: 'الأسبوع 5' },
      { date: '2024-02-12', completed: 67, started: 82, week: 'الأسبوع 6' },
      { date: '2024-02-19', completed: 71, started: 85, week: 'الأسبوع 7' }
    ],
    subjectPerformance: [
      { subject: 'الرياضيات', completionRate: 78, avgScore: 82, totalStudents: 89 },
      { subject: 'اللغة العربية', completionRate: 85, avgScore: 79, totalStudents: 92 },
      { subject: 'العلوم', completionRate: 71, avgScore: 76, totalStudents: 78 },
      { subject: 'التاريخ', completionRate: 68, avgScore: 74, totalStudents: 65 },
      { subject: 'الجغرافيا', completionRate: 73, avgScore: 77, totalStudents: 58 }
    ],
    timeDistribution: [
      { name: '0-5 دقائق', value: 15, color: '#ef4444' },
      { name: '5-15 دقيقة', value: 35, color: '#f59e0b' },
      { name: '15-30 دقيقة', value: 40, color: '#10b981' },
      { name: '30+ دقيقة', value: 10, color: '#3b82f6' }
    ],
    lessonDetails: [
      {
        id: 1,
        title: 'الجمع والطرح المتقدم',
        subject: 'الرياضيات',
        grade: '5A',
        totalStudents: 28,
        completedStudents: 24,
        avgScore: 85,
        avgTime: 22, // minutes
        completionRate: 86,
        lastAccessed: '2024-02-20T10:30:00Z',
        difficulty: 'متوسط',
        engagement: 'عالي',
        feedback: 4.3,
        retryRate: 12
      },
      {
        id: 2,
        title: 'قراءة وفهم النصوص',
        subject: 'اللغة العربية',
        grade: '5A',
        totalStudents: 28,
        completedStudents: 26,
        avgScore: 78,
        avgTime: 18,
        completionRate: 93,
        lastAccessed: '2024-02-20T14:15:00Z',
        difficulty: 'سهل',
        engagement: 'متوسط',
        feedback: 4.1,
        retryRate: 8
      },
      {
        id: 3,
        title: 'حالات المادة',
        subject: 'العلوم',
        grade: '5B',
        totalStudents: 25,
        completedStudents: 18,
        avgScore: 72,
        avgTime: 25,
        completionRate: 72,
        lastAccessed: '2024-02-19T16:45:00Z',
        difficulty: 'صعب',
        engagement: 'منخفض',
        feedback: 3.8,
        retryRate: 24
      },
      {
        id: 4,
        title: 'الحضارات القديمة',
        subject: 'التاريخ',
        grade: '5C',
        totalStudents: 22,
        completedStudents: 15,
        avgScore: 69,
        avgTime: 20,
        completionRate: 68,
        lastAccessed: '2024-02-19T11:20:00Z',
        difficulty: 'متوسط',
        engagement: 'متوسط',
        feedback: 3.9,
        retryRate: 18
      }
    ],
    performanceTrends: [
      { month: 'يناير', avgScore: 75, completionRate: 68, engagement: 3.8 },
      { month: 'فبراير', avgScore: 78, completionRate: 73, engagement: 4.1 },
      { month: 'مارس', avgScore: 82, completionRate: 76, engagement: 4.3 },
      { month: 'أبريل', avgScore: 79, completionRate: 71, engagement: 4.0 },
      { month: 'مايو', avgScore: 81, completionRate: 74, engagement: 4.2 }
    ]
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'سهل': return 'text-green-600 bg-green-50';
      case 'متوسط': return 'text-yellow-600 bg-yellow-50';
      case 'صعب': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEngagementColor = (engagement) => {
    switch (engagement) {
      case 'عالي': return 'text-green-600 bg-green-50';
      case 'متوسط': return 'text-yellow-600 bg-yellow-50';
      case 'منخفض': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatPercentage = (value) => `${Math.round(value)}%`;
  const formatTime = (minutes) => `${minutes} دقيقة`;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('تحليلات الدروس والإكمال')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('تحليل شامل لأداء الدروس ومعدلات الإكمال')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
            <option value="term">هذا الفصل</option>
            <option value="year">هذا العام</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            فلترة
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الدروس</p>
                <p className="text-2xl font-bold">{analyticsData.summary.totalLessons}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12 هذا الأسبوع
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل الإكمال</p>
                <p className="text-2xl font-bold">{analyticsData.summary.avgCompletionRate}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% من الشهر السابق
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط الدرجات</p>
                <p className="text-2xl font-bold">{analyticsData.summary.avgScore}</p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2 من الشهر السابق
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط وقت التفاعل</p>
                <p className="text-2xl font-bold">{analyticsData.summary.avgEngagementTime}د</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.5د من الأسبوع السابق
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
          <TabsTrigger value="subjects">المواد</TabsTrigger>
          <TabsTrigger value="lessons">تفاصيل الدروس</TabsTrigger>
          <TabsTrigger value="engagement">التفاعل</TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completion Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  اتجاهات الإكمال
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.completionTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.8}
                      name="مكتمل"
                    />
                    <Area
                      type="monotone"
                      dataKey="started"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.8}
                      name="بدأ"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  اتجاهات الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="متوسط الدرجات"
                    />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="معدل الإكمال"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                توزيع أوقات الدروس
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.timeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.timeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {analyticsData.timeDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.value}% من الطلاب</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء المواد الدراسية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData.subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completionRate" fill="#10b981" name="معدل الإكمال" />
                    <Bar dataKey="avgScore" fill="#3b82f6" name="متوسط الدرجات" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsData.subjectPerformance.map((subject, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-3">{subject.subject}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">معدل الإكمال</span>
                            <span className="font-medium">{subject.completionRate}%</span>
                          </div>
                          <Progress value={subject.completionRate} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">متوسط الدرجات</span>
                            <span className="font-medium">{subject.avgScore}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">عدد الطلاب</span>
                            <span className="font-medium">{subject.totalStudents}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الدروس</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.lessonDetails.map((lesson) => (
                  <div key={lesson.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{lesson.title}</h3>
                        <p className="text-gray-600">{lesson.subject} - الصف {lesson.grade}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                        <Badge className={getEngagementColor(lesson.engagement)}>
                          تفاعل {lesson.engagement}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">الطلاب المكتملون</p>
                        <p className="text-lg font-bold text-green-600">
                          {lesson.completedStudents}/{lesson.totalStudents}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPercentage(lesson.completionRate)}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">متوسط الدرجات</p>
                        <p className="text-lg font-bold text-blue-600">{lesson.avgScore}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">متوسط الوقت</p>
                        <p className="text-lg font-bold text-purple-600">
                          {formatTime(lesson.avgTime)}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">التقييم</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {lesson.feedback}/5
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">معدل الإعادة</p>
                        <p className="text-lg font-bold text-red-600">{lesson.retryRate}%</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">آخر وصول</p>
                        <p className="text-sm text-gray-700">
                          {new Date(lesson.lastAccessed).toLocaleDateString('ar')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Progress value={lesson.completionRate} className="flex-1" />
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  نشاط الطلاب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>الطلاب النشطون حالياً</span>
                    <Badge className="bg-green-100 text-green-800">
                      {analyticsData.summary.activeStudents}
                    </Badge>
                  </div>
                  <Progress 
                    value={(analyticsData.summary.activeStudents / analyticsData.summary.totalStudents) * 100} 
                  />
                  <p className="text-sm text-gray-600">
                    {formatPercentage((analyticsData.summary.activeStudents / analyticsData.summary.totalStudents) * 100)} من إجمالي الطلاب
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Popularity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  الدروس الأكثر شعبية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.lessonDetails
                    .sort((a, b) => b.completionRate - a.completionRate)
                    .slice(0, 5)
                    .map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{lesson.title}</p>
                          <p className="text-xs text-gray-600">{lesson.subject}</p>
                        </div>
                        <Badge variant="outline">
                          {formatPercentage(lesson.completionRate)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                مقاييس التفاعل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatTime(analyticsData.summary.avgEngagementTime)}
                  </div>
                  <p className="text-gray-600">متوسط وقت التفاعل</p>
                  <p className="text-sm text-green-600 mt-1">
                    +8% من الأسبوع السابق
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analyticsData.summary.activeLessons}
                  </div>
                  <p className="text-gray-600">الدروس النشطة</p>
                  <p className="text-sm text-blue-600 mt-1">
                    من أصل {analyticsData.summary.totalLessons} درس
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.2</div>
                  <p className="text-gray-600">متوسط تقييم الدروس</p>
                  <p className="text-sm text-yellow-600 mt-1">من أصل 5 نجوم</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonAnalytics;