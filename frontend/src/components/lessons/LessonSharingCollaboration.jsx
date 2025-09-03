import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Share2, 
  Users, 
  MessageCircle, 
  Download, 
  Copy, 
  Eye, 
  Edit, 
  Star, 
  Heart, 
  BookOpen, 
  Calendar, 
  Clock, 
  Globe, 
  Lock, 
  UserPlus, 
  Send, 
  Bookmark,
  ThumbsUp,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

const LessonSharingCollaboration = () => {
  const { t } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [collaborationView, setCollaborationView] = useState('my_lessons');
  const [newComment, setNewComment] = useState('');

  // Mock data - replace with real API integration
  const [lessons] = useState([
    {
      id: 1,
      title: 'الجمع والطرح المتقدم',
      subject: 'الرياضيات',
      grade: 'الصف الخامس',
      description: 'درس تفاعلي يغطي مفاهيم الجمع والطرح المتقدمة مع أمثلة عملية',
      author: {
        id: 1,
        name: 'أ. أحمد محمد',
        avatar: '/api/placeholder/40/40',
        school: 'مدرسة النور الابتدائية'
      },
      visibility: 'public',
      sharedWith: ['teachers', 'school'],
      collaborators: [
        { id: 2, name: 'أ. فاطمة أحمد', role: 'editor' },
        { id: 3, name: 'أ. محمد علي', role: 'viewer' }
      ],
      stats: {
        views: 245,
        likes: 38,
        shares: 12,
        comments: 15,
        downloads: 28
      },
      tags: ['رياضيات', 'تفاعلي', 'أساسي'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-02-10T14:20:00Z',
      rating: 4.7,
      isFavorite: true,
      isBookmarked: false
    },
    {
      id: 2,
      title: 'قراءة وفهم النصوص',
      subject: 'اللغة العربية',
      grade: 'الصف الخامس',
      description: 'تطوير مهارات القراءة والفهم من خلال نصوص متنوعة وأسئلة تحليلية',
      author: {
        id: 4,
        name: 'أ. سارة حسن',
        avatar: '/api/placeholder/40/40',
        school: 'مدرسة الأمل الابتدائية'
      },
      visibility: 'school',
      sharedWith: ['school'],
      collaborators: [
        { id: 5, name: 'أ. مريم خالد', role: 'co-author' }
      ],
      stats: {
        views: 189,
        likes: 42,
        shares: 8,
        comments: 22,
        downloads: 35
      },
      tags: ['لغة عربية', 'قراءة', 'فهم'],
      createdAt: '2024-01-20T09:15:00Z',
      updatedAt: '2024-02-08T11:45:00Z',
      rating: 4.5,
      isFavorite: false,
      isBookmarked: true
    },
    {
      id: 3,
      title: 'تجارب العلوم التفاعلية',
      subject: 'العلوم',
      grade: 'الصف السادس',
      description: 'مجموعة من التجارب العلمية البسيطة والآمنة للطلاب',
      author: {
        id: 6,
        name: 'أ. يوسف عبدالله',
        avatar: '/api/placeholder/40/40',
        school: 'مدرسة المستقبل الابتدائية'
      },
      visibility: 'private',
      sharedWith: ['collaborators'],
      collaborators: [
        { id: 7, name: 'أ. ليلى محمد', role: 'reviewer' },
        { id: 8, name: 'أ. كريم أحمد', role: 'editor' }
      ],
      stats: {
        views: 123,
        likes: 25,
        shares: 5,
        comments: 8,
        downloads: 15
      },
      tags: ['علوم', 'تجارب', 'تفاعلي'],
      createdAt: '2024-02-01T13:30:00Z',
      updatedAt: '2024-02-12T16:20:00Z',
      rating: 4.3,
      isFavorite: false,
      isBookmarked: false
    }
  ]);

  const [comments] = useState([
    {
      id: 1,
      lessonId: 1,
      author: {
        name: 'أ. مريم خالد',
        avatar: '/api/placeholder/32/32'
      },
      content: 'درس ممتاز ومفيد جداً للطلاب. الشرح واضح والأمثلة متنوعة.',
      timestamp: '2024-02-15T10:30:00Z',
      likes: 5,
      replies: [
        {
          id: 11,
          author: { name: 'أ. أحمد محمد', avatar: '/api/placeholder/32/32' },
          content: 'شكراً لك على التعليق الإيجابي',
          timestamp: '2024-02-15T11:00:00Z'
        }
      ]
    },
    {
      id: 2,
      lessonId: 1,
      author: {
        name: 'أ. خالد يوسف',
        avatar: '/api/placeholder/32/32'
      },
      content: 'هل يمكن إضافة المزيد من التمارين العملية؟',
      timestamp: '2024-02-14T14:20:00Z',
      likes: 3,
      replies: []
    }
  ]);

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public': return <Globe className="h-4 w-4 text-green-600" />;
      case 'school': return <Users className="h-4 w-4 text-blue-600" />;
      case 'private': return <Lock className="h-4 w-4 text-gray-600" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getVisibilityText = (visibility) => {
    switch (visibility) {
      case 'public': return 'عام';
      case 'school': return 'المدرسة فقط';
      case 'private': return 'خاص';
      default: return 'غير محدد';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'co-author': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'reviewer': return 'bg-yellow-100 text-yellow-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'co-author': return 'شارك في التأليف';
      case 'editor': return 'محرر';
      case 'reviewer': return 'مراجع';
      case 'viewer': return 'مشاهد';
      default: return 'مشاهد';
    }
  };

  const handleShare = (lesson) => {
    setSelectedLesson(lesson);
    setShareModal(true);
  };

  const handleAddComment = (lessonId) => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('مشاركة الدروس والتعاون')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('شارك دروسك وتعاون مع المعلمين الآخرين')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="البحث في الدروس..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            فلترة
          </Button>
          <Button size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            مشاركة درس جديد
          </Button>
        </div>
      </div>

      {/* Collaboration Tabs */}
      <Tabs value={collaborationView} onValueChange={setCollaborationView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my_lessons">دروسي</TabsTrigger>
          <TabsTrigger value="shared_with_me">مشارك معي</TabsTrigger>
          <TabsTrigger value="public_library">المكتبة العامة</TabsTrigger>
          <TabsTrigger value="collaborations">التعاونات النشطة</TabsTrigger>
        </TabsList>

        {/* My Lessons Tab */}
        <TabsContent value="my_lessons" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {lessons.filter(l => l.author.id === 1).map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{lesson.title}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {lesson.subject} - {lesson.grade}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {getVisibilityIcon(lesson.visibility)}
                        <span className="text-xs text-gray-500">
                          {getVisibilityText(lesson.visibility)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {lesson.isFavorite && (
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      )}
                      {lesson.isBookmarked && (
                        <Bookmark className="h-4 w-4 text-blue-500 fill-current" />
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {lesson.description}
                  </p>

                  {/* Collaborators */}
                  {lesson.collaborators.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">المتعاونون:</p>
                      <div className="flex items-center gap-2">
                        {lesson.collaborators.slice(0, 3).map((collaborator) => (
                          <div key={collaborator.id} className="flex items-center gap-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/api/placeholder/24/24" />
                              <AvatarFallback className="text-xs">
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <Badge variant="outline" className={`text-xs ${getRoleColor(collaborator.role)}`}>
                              {getRoleText(collaborator.role)}
                            </Badge>
                          </div>
                        ))}
                        {lesson.collaborators.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{lesson.collaborators.length - 3} آخرين
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lesson.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {lesson.stats.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {lesson.stats.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {lesson.stats.comments}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>{lesson.rating}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleShare(lesson)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shared With Me Tab */}
        <TabsContent value="shared_with_me" className="space-y-6">
          <div className="space-y-4">
            {lessons.filter(l => l.author.id !== 1).map((lesson) => (
              <Card key={lesson.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={lesson.author.avatar} />
                      <AvatarFallback>{lesson.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{lesson.title}</h3>
                          <p className="text-sm text-gray-600">
                            بواسطة {lesson.author.name} من {lesson.author.school}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {lesson.subject} - {lesson.grade}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getVisibilityIcon(lesson.visibility)}
                          <span className="text-xs text-gray-500">
                            {getVisibilityText(lesson.visibility)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mt-3 mb-4">{lesson.description}</p>

                      {/* My Role */}
                      <div className="mb-4">
                        <Badge className={getRoleColor('viewer')}>
                          {getRoleText('viewer')}
                        </Badge>
                      </div>

                      {/* Stats and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {lesson.stats.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {lesson.stats.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {lesson.stats.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {lesson.rating}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            عرض
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4 mr-1" />
                            نسخ
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            تحميل
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Public Library Tab */}
        <TabsContent value="public_library" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lessons.filter(l => l.visibility === 'public').map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={lesson.author.avatar} />
                      <AvatarFallback>{lesson.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-1">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {lesson.subject} - {lesson.grade}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        بواسطة {lesson.author.name}
                      </p>
                      
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {lesson.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {lesson.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {lesson.stats.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {lesson.stats.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {lesson.rating}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Collaborations Tab */}
        <TabsContent value="collaborations" className="space-y-6">
          {/* Collaboration Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                طلبات التعاون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>ن</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">أ. نورا سالم</p>
                      <p className="text-sm text-gray-600">
                        تريد التعاون في درس "الكسور والنسب"
                      </p>
                      <p className="text-xs text-gray-500">منذ ساعتين</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">رفض</Button>
                    <Button size="sm">قبول</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Collaborations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                التعاونات النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessons.filter(l => l.collaborators.length > 0).map((lesson) => (
                  <div key={lesson.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-gray-600">{lesson.subject}</p>
                      </div>
                      <Badge variant="outline">نشط</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">المتعاونون:</span>
                      {lesson.collaborators.map((collaborator) => (
                        <div key={collaborator.id} className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {collaborator.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{collaborator.name}</span>
                          <Badge variant="outline" className={`text-xs ${getRoleColor(collaborator.role)}`}>
                            {getRoleText(collaborator.role)}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        مناقشة
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        تعديل
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        عرض
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comments Section */}
      {selectedLesson && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              التعليقات والمناقشات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment */}
            <div className="flex items-start gap-3 mb-6 p-4 border rounded-lg">
              <Avatar>
                <AvatarFallback>أ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب تعليقاً..."
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleAddComment(selectedLesson.id)}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    إرسال
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.filter(c => c.lessonId === selectedLesson.id).map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleDateString('ar')}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="ghost" className="text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          إعجاب ({comment.likes})
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs">
                          رد
                        </Button>
                      </div>
                      
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-3 mr-6 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{reply.author.name}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(reply.timestamp).toLocaleDateString('ar')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Modal */}
      {shareModal && selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>مشاركة الدرس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">مستوى الرؤية</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="private">خاص</option>
                  <option value="school">المدرسة فقط</option>
                  <option value="public">عام</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">إضافة متعاونين</label>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني للمعلم"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الدور</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="viewer">مشاهد</option>
                  <option value="editor">محرر</option>
                  <option value="co-author">شارك في التأليف</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShareModal(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => setShareModal(false)}>
                  مشاركة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LessonSharingCollaboration;