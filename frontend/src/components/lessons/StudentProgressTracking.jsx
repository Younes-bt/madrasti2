import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  Target,
  Calendar,
  Award,
  BarChart3,
  Eye,
  Download
} from 'lucide-react';

const StudentProgressTracking = () => {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('week');
  
  // Mock data - replace with real API integration
  const [students] = useState([
    {
      id: 1,
      name: 'أحمد محمد',
      class: '5A',
      avatar: '/api/placeholder/40/40',
      overallProgress: 78,
      lessonsCompleted: 45,
      totalLessons: 58,
      averageScore: 85,
      timeSpent: 1240, // minutes
      lastActive: '2024-01-15T10:30:00Z',
      streak: 7
    },
    {
      id: 2,
      name: 'فاطمة أحمد',
      class: '5A',
      avatar: '/api/placeholder/40/40',
      overallProgress: 92,
      lessonsCompleted: 53,
      totalLessons: 58,
      averageScore: 91,
      timeSpent: 1580,
      lastActive: '2024-01-15T14:20:00Z',
      streak: 12
    },
    {
      id: 3,
      name: 'محمد علي',
      class: '5B',
      avatar: '/api/placeholder/40/40',
      overallProgress: 65,
      lessonsCompleted: 38,
      totalLessons: 58,
      averageScore: 72,
      timeSpent: 980,
      lastActive: '2024-01-14T16:45:00Z',
      streak: 3
    }
  ]);

  const [lessonProgress] = useState([
    {
      id: 1,
      title: 'الرياضيات - الجمع والطرح',
      subject: 'الرياضيات',
      unit: 'العمليات الحسابية',
      totalActivities: 8,
      completedActivities: 6,
      score: 85,
      timeSpent: 45,
      estimatedTime: 60,
      status: 'in_progress',
      startedAt: '2024-01-15T09:00:00Z',
      lastAccessed: '2024-01-15T10:30:00Z',
      attempts: 2,
      hintsUsed: 3,
      activities: [
        { id: 1, name: 'مراجعة الأرقام', status: 'completed', score: 90, timeSpent: 8 },
        { id: 2, name: 'جمع الأرقام البسيطة', status: 'completed', score: 85, timeSpent: 12 },
        { id: 3, name: 'طرح الأرقام البسيطة', status: 'completed', score: 80, timeSpent: 10 },
        { id: 4, name: 'تمارين الجمع المتقدمة', status: 'completed', score: 88, timeSpent: 15 },
        { id: 5, name: 'تمارين الطرح المتقدمة', status: 'completed', score: 82, timeSpent: 11 },
        { id: 6, name: 'حل المسائل الكلامية', status: 'completed', score: 87, timeSpent: 18 },
        { id: 7, name: 'اختبار المراجعة', status: 'in_progress', score: 0, timeSpent: 5 },
        { id: 8, name: 'التقييم النهائي', status: 'not_started', score: 0, timeSpent: 0 }
      ]
    },
    {
      id: 2,
      title: 'اللغة العربية - القراءة',
      subject: 'اللغة العربية',
      unit: 'مهارات القراءة',
      totalActivities: 6,
      completedActivities: 6,
      score: 92,
      timeSpent: 40,
      estimatedTime: 45,
      status: 'completed',
      startedAt: '2024-01-14T10:00:00Z',
      completedAt: '2024-01-15T09:30:00Z',
      attempts: 1,
      hintsUsed: 1,
      activities: [
        { id: 1, name: 'قراءة النص', status: 'completed', score: 95, timeSpent: 8 },
        { id: 2, name: 'فهم المعنى', status: 'completed', score: 90, timeSpent: 7 },
        { id: 3, name: 'تحليل الشخصيات', status: 'completed', score: 88, timeSpent: 6 },
        { id: 4, name: 'استخراج الأفكار الرئيسية', status: 'completed', score: 94, timeSpent: 8 },
        { id: 5, name: 'الإجابة على الأسئلة', status: 'completed', score: 91, timeSpent: 6 },
        { id: 6, name: 'كتابة ملخص', status: 'completed', score: 94, timeSpent: 5 }
      ]
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'not_started': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'not_started': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}س ${mins}د`;
    }
    return `${mins}د`;
  };

  const calculateProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('تتبع تقدم الطلاب')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('راقب أداء وتقدم الطلاب في الدروس المختلفة')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="term">هذا الفصل</option>
          </select>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {t('تصدير التقرير')}
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="individual">طالب محدد</TabsTrigger>
          <TabsTrigger value="lesson">درس محدد</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                    <p className="text-xl font-bold">{students.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">متوسط التقدم</p>
                    <p className="text-xl font-bold">
                      {Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">متوسط الدرجات</p>
                    <p className="text-xl font-bold">
                      {Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الوقت</p>
                    <p className="text-xl font-bold">
                      {formatDuration(students.reduce((sum, s) => sum + s.timeSpent, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students Progress List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                تقدم الطلاب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setViewMode('individual');
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-gray-600">الصف {student.class}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">التقدم</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={student.overallProgress} className="w-20" />
                          <span className="text-sm font-medium">{student.overallProgress}%</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">الدروس المكتملة</p>
                        <p className="font-medium mt-1">
                          {student.lessonsCompleted}/{student.totalLessons}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">متوسط الدرجات</p>
                        <Badge variant="outline" className="mt-1">
                          {student.averageScore}
                        </Badge>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">السلسلة</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{student.streak}</span>
                        </div>
                      </div>

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

        {/* Individual Student Tab */}
        <TabsContent value="individual" className="space-y-6">
          {/* Student Selector */}
          {!selectedStudent && (
            <Card>
              <CardHeader>
                <CardTitle>اختر طالباً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-gray-600">الصف {student.class}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={student.overallProgress} className="w-16" />
                            <span className="text-xs">{student.overallProgress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Student Details */}
          {selectedStudent && (
            <>
              {(() => {
                const student = students.find(s => s.id === selectedStudent);
                return (
                  <div className="space-y-6">
                    {/* Student Header */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-16 h-16 rounded-full"
                            />
                            <div>
                              <h2 className="text-xl font-bold">{student.name}</h2>
                              <p className="text-gray-600">الصف {student.class}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">
                                  آخر نشاط: {new Date(student.lastActive).toLocaleDateString('ar')}
                                </Badge>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Award className="h-3 w-3 mr-1" />
                                  سلسلة {student.streak} أيام
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedStudent(null)}
                          >
                            العودة للقائمة
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {student.overallProgress}%
                          </div>
                          <p className="text-sm text-gray-600">التقدم الإجمالي</p>
                          <Progress value={student.overallProgress} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {student.lessonsCompleted}
                          </div>
                          <p className="text-sm text-gray-600">درس مكتمل</p>
                          <p className="text-xs text-gray-500 mt-1">
                            من أصل {student.totalLessons} درس
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {student.averageScore}
                          </div>
                          <p className="text-sm text-gray-600">متوسط الدرجات</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatDuration(student.timeSpent)}
                          </div>
                          <p className="text-sm text-gray-600">إجمالي الوقت</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Lessons Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>تفاصيل الدروس</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {lessonProgress.map((lesson) => (
                            <div key={lesson.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="font-medium">{lesson.title}</h3>
                                  <p className="text-sm text-gray-600">
                                    {lesson.subject} - {lesson.unit}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(lesson.status)}>
                                  {lesson.status === 'completed' ? 'مكتمل' : 
                                   lesson.status === 'in_progress' ? 'قيد التنفيذ' : 'لم يبدأ'}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-gray-600">الأنشطة المكتملة</p>
                                  <p className="font-medium">
                                    {lesson.completedActivities}/{lesson.totalActivities}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">الدرجة</p>
                                  <p className="font-medium">{lesson.score}%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">الوقت المستغرق</p>
                                  <p className="font-medium">{formatDuration(lesson.timeSpent)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600">المحاولات</p>
                                  <p className="font-medium">{lesson.attempts}</p>
                                </div>
                              </div>

                              <Progress 
                                value={calculateProgressPercentage(lesson.completedActivities, lesson.totalActivities)} 
                                className="mb-2"
                              />

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedLesson(lesson.id);
                                  setViewMode('lesson');
                                }}
                              >
                                عرض التفاصيل
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </>
          )}
        </TabsContent>

        {/* Lesson Details Tab */}
        <TabsContent value="lesson" className="space-y-6">
          {/* Lesson Selector */}
          {!selectedLesson && (
            <Card>
              <CardHeader>
                <CardTitle>اختر درساً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessonProgress.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedLesson(lesson.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">
                            {lesson.subject} - {lesson.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(lesson.status)}>
                            {lesson.status === 'completed' ? 'مكتمل' : 
                             lesson.status === 'in_progress' ? 'قيد التنفيذ' : 'لم يبدأ'}
                          </Badge>
                          <Progress 
                            value={calculateProgressPercentage(lesson.completedActivities, lesson.totalActivities)} 
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Lesson Details */}
          {selectedLesson && (
            <>
              {(() => {
                const lesson = lessonProgress.find(l => l.id === selectedLesson);
                return (
                  <div className="space-y-6">
                    {/* Lesson Header */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-bold">{lesson.title}</h2>
                            <p className="text-gray-600">{lesson.subject} - {lesson.unit}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge className={getStatusColor(lesson.status)}>
                                {lesson.status === 'completed' ? 'مكتمل' : 
                                 lesson.status === 'in_progress' ? 'قيد التنفيذ' : 'لم يبدأ'}
                              </Badge>
                              {lesson.completedAt && (
                                <Badge variant="outline">
                                  مكتمل في: {new Date(lesson.completedAt).toLocaleDateString('ar')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedLesson(null)}
                          >
                            العودة للقائمة
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lesson Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {lesson.completedActivities}/{lesson.totalActivities}
                          </div>
                          <p className="text-sm text-gray-600">الأنشطة المكتملة</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {lesson.score}%
                          </div>
                          <p className="text-sm text-gray-600">الدرجة الإجمالية</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {formatDuration(lesson.timeSpent)}
                          </div>
                          <p className="text-sm text-gray-600">الوقت المستغرق</p>
                          <p className="text-xs text-gray-500">
                            من أصل {formatDuration(lesson.estimatedTime)}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {lesson.attempts}
                          </div>
                          <p className="text-sm text-gray-600">عدد المحاولات</p>
                          <p className="text-xs text-gray-500">
                            {lesson.hintsUsed} تلميحات مستخدمة
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Activities Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle>تفاصيل الأنشطة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {lesson.activities.map((activity, index) => {
                            const StatusIcon = getStatusIcon(activity.status);
                            return (
                              <div 
                                key={activity.id} 
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                                    <span className="text-sm font-medium">{index + 1}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{activity.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <StatusIcon className="h-4 w-4" />
                                      <span className="text-sm text-gray-600">
                                        {activity.status === 'completed' ? 'مكتمل' : 
                                         activity.status === 'in_progress' ? 'قيد التنفيذ' : 'لم يبدأ'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  {activity.score > 0 && (
                                    <Badge variant="outline">
                                      {activity.score}%
                                    </Badge>
                                  )}
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">الوقت</p>
                                    <p className="text-sm font-medium">
                                      {formatDuration(activity.timeSpent)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProgressTracking;