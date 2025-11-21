import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Users,
  Mail,
  Phone,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserPlus,
  BookOpen,
  GraduationCap,
  X,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { apiMethods } from '../../services/api';
import communicationService from '../../services/communication';
import { toast } from 'sonner';

const AnimatedCounter = ({ from = 0, to, duration = 2, className = "" }) => {
  const ref = useRef()
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    if (isInView && to !== undefined) {
      animate(motionValue, to, { duration: duration })
    }
  }, [motionValue, isInView, to, duration])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  )
}

const StatCard = ({ icon: Icon, label, value, description, iconColor, iconBg }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <div className="text-3xl font-bold text-foreground">
              <AnimatedCounter to={value} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TeachersManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    bySubject: {}
  });

  // Message Modal State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedTeacherForMessage, setSelectedTeacherForMessage] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = { role: 'TEACHER' };
      const response = await apiMethods.get('users/users/', { params });

      let teachersData = [];

      if (response.results && Array.isArray(response.results)) {
        teachersData = response.results;
      } else if (Array.isArray(response)) {
        teachersData = response;
      } else if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          teachersData = response.data.results;
        } else if (Array.isArray(response.data)) {
          teachersData = response.data;
        }
      }

      setTeachers(teachersData);

      // Update statistics
      const activeCount = teachersData.filter(teacher => teacher.is_active).length;

      // Calculate subject-based statistics
      const subjectStats = {};
      teachersData.forEach(teacher => {
        if (teacher.school_subject?.id) {
          const subjectId = teacher.school_subject.id;
          subjectStats[subjectId] = (subjectStats[subjectId] || 0) + 1;
        }
      });

      setStats({
        total: teachersData.length,
        active: activeCount,
        inactive: teachersData.length - activeCount,
        bySubject: subjectStats
      });

    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      toast.error(t('error.failedToLoadData'));
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await apiMethods.get('schools/subjects/');
      const subjectsData = response.results || response.data?.results || response.data || response || [];
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  // Client-side filtering
  const filteredTeachers = teachers.filter(teacher => {
    // Apply search filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch =
        teacher.first_name?.toLowerCase().includes(query) ||
        teacher.last_name?.toLowerCase().includes(query) ||
        teacher.full_name?.toLowerCase().includes(query) ||
        teacher.email?.toLowerCase().includes(query) ||
        teacher.phone?.toLowerCase().includes(query) ||
        teacher.ar_first_name?.toLowerCase().includes(query) ||
        teacher.ar_last_name?.toLowerCase().includes(query) ||
        getDisplaySubject(teacher.school_subject)?.toLowerCase().includes(query);
    }

    // Apply status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = statusFilter === 'active' ? teacher.is_active : !teacher.is_active;
    }

    // Apply subject filter
    let matchesSubject = true;
    if (subjectFilter !== 'all') {
      matchesSubject = teacher.school_subject?.id === parseInt(subjectFilter);
    }

    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Helper function to get display name based on language
  const getDisplayName = (teacher) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (teacher.ar_first_name || teacher.ar_last_name)) {
      return `${teacher.ar_first_name || ''} ${teacher.ar_last_name || ''}`.trim();
    }
    return teacher.full_name || `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim();
  };

  const getDisplaySubject = (subject) => {
    if (!subject) return null;
    const lang = i18n.language;
    if (lang === 'ar' && subject.name_arabic) {
      return subject.name_arabic;
    }
    if (lang === 'fr' && subject.name_french) {
      return subject.name_french;
    }
    return subject.name;
  };

  const getDisplayGrade = (grade) => {
    if (!grade) return null;
    const lang = i18n.language;
    if (lang === 'ar' && grade.name_arabic) {
      return grade.name_arabic;
    }
    if (lang === 'fr' && grade.name_french) {
      return grade.name_french;
    }
    return grade.name;
  };

  const handleViewTeacher = (teacherId) => {
    navigate(`/admin/school-management/teachers/view/${teacherId}`);
  };

  const handleEditTeacher = (teacherId) => {
    navigate(`/admin/school-management/teachers/edit/${teacherId}`);
  };

  const handleDeleteTeacher = (teacherId) => {
    toast.info(`${t('action.delete')} teacher: ${teacherId}`);
  };

  const handleAddTeacher = () => {
    navigate('/admin/school-management/teachers/add');
  };

  const handleSendMessage = (teacher) => {
    setSelectedTeacherForMessage(teacher);
    setIsMessageModalOpen(true);
    setMessageContent('');
  };

  const handleSendMessageSubmit = async () => {
    if (!messageContent.trim() || !selectedTeacherForMessage) return;

    setSendingMessage(true);
    try {
      // Start or get existing conversation
      const conversation = await communicationService.startDirectConversation(selectedTeacherForMessage.id);

      // Send the message
      await communicationService.sendMessage({
        conversation: conversation.id,
        content: messageContent.trim()
      });

      toast.success(t('Message sent successfully'));
      setIsMessageModalOpen(false);
      setMessageContent('');
      setSelectedTeacherForMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('Failed to send message'));
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // TeacherCard component with modern design
  const TeacherCard = ({ teacher, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group"
    >
      <Card
        className="h-full border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
        onClick={() => handleViewTeacher(teacher.id)}
      >
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            <motion.div
              className="flex-shrink-0 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
                {teacher.profile_picture_url ? (
                  <img src={teacher.profile_picture_url} alt={teacher.full_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold text-primary">
                    {(teacher.first_name?.[0] || '') + (teacher.last_name?.[0] || '')}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <div className={`w-4 h-4 rounded-full border-2 border-background ${teacher.is_active ? 'bg-green-500' : 'bg-muted'}`} />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground leading-tight truncate">
                {getDisplayName(teacher)}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <BookOpen className="h-3 w-3" />
                {getDisplaySubject(teacher.school_subject) || t('teachers.teacher', 'Teacher')}
              </p>
              <Badge
                variant={teacher.is_active ? "default" : "secondary"}
                className="mt-2 text-xs"
              >
                {teacher.is_active ? t('status.active') : t('status.inactive')}
              </Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTeacher(teacher.id);
                  }}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>{t('action.edit')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTeacher(teacher.id);
                  }}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{t('action.delete')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-auto space-y-2.5 pt-3 border-t border-border/50">
            <div className="flex items-center text-muted-foreground group/item hover:text-foreground transition-colors">
              <Mail className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="text-xs truncate">{teacher.email}</span>
            </div>
            <div className="flex items-center text-muted-foreground group/item hover:text-foreground transition-colors">
              <Phone className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <span className="text-xs">{teacher.phone || '—'}</span>
            </div>
            {teacher.teachable_grades && teacher.teachable_grades.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap pt-1">
                <GraduationCap className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {teacher.teachable_grades.slice(0, 3).map((grade) => (
                    <Badge key={grade.id} variant="outline" className="text-xs px-1.5 py-0">
                      {getDisplayGrade(grade)}
                    </Badge>
                  ))}
                  {teacher.teachable_grades.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      +{teacher.teachable_grades.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium text-foreground">{formatDate(teacher.created_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      <AdminPageLayout
        title={t('admin.teachersManagement.title')}
        subtitle={t('admin.teachersManagement.subtitle')}
        actions={[
          <Button key="add-teacher" onClick={handleAddTeacher} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('action.addTeacher')}
          </Button>
        ]}
        loading={loading}
      >
        <div className="space-y-6">
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={GraduationCap}
              label={t('admin.teachersManagement.stats.totalTeachers')}
              value={stats.total}
              description={t('admin.teachersManagement.stats.totalTeachersDescription')}
              iconColor="text-emerald-600 dark:text-emerald-400"
              iconBg="bg-emerald-100 dark:bg-emerald-500/20"
            />
            <StatCard
              icon={CheckCircle}
              label={t('admin.teachersManagement.stats.activeTeachers')}
              value={stats.active}
              description={t('admin.teachersManagement.stats.activeTeachersDescription')}
              iconColor="text-green-600 dark:text-green-400"
              iconBg="bg-green-100 dark:bg-green-500/20"
            />
            <StatCard
              icon={XCircle}
              label={t('admin.teachersManagement.stats.inactiveTeachers')}
              value={stats.inactive}
              description={t('admin.teachersManagement.stats.inactiveTeachersDescription')}
              iconColor="text-red-600 dark:text-red-400"
              iconBg="bg-red-100 dark:bg-red-500/20"
            />
          </div>

          {/* Search and Filter Section */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.teachersManagement.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-muted/50 border-0 focus-visible:ring-1"
                  />
                </div>

                {/* Filter Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>{t('common.filters')}:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-1">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-9 w-[160px] border-border/50">
                        <SelectValue placeholder={t('common.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                        <SelectItem value="active">{t('status.active')}</SelectItem>
                        <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Subject Filter */}
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger className="h-9 w-[200px] border-border/50">
                        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <SelectValue placeholder={t('teachers.filterBySubject') || 'Filter by Subject'} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">{t('common.allSubjects') || 'All Subjects'}</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {getDisplaySubject(subject)}
                            {stats.bySubject[subject.id] && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({stats.bySubject[subject.id]})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Active Filter Badges */}
                    {(searchQuery || statusFilter !== 'all' || subjectFilter !== 'all') && (
                      <>
                        {searchQuery && (
                          <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                            onClick={() => setSearchQuery('')}
                          >
                            <Search className="h-3 w-3" />
                            {searchQuery}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        )}
                        {statusFilter !== 'all' && (
                          <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                            onClick={() => setStatusFilter('all')}
                          >
                            {t(`status.${statusFilter}`)}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        )}
                        {subjectFilter !== 'all' && (
                          <Badge
                            variant="secondary"
                            className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                            onClick={() => setSubjectFilter('all')}
                          >
                            <BookOpen className="h-3 w-3" />
                            {getDisplaySubject(subjects.find(s => s.id === parseInt(subjectFilter)))}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setSubjectFilter('all');
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          {t('common.reset')}
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {filteredTeachers.length} {t('common.results') || 'results'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teachers Table */}
          <Card>
            <CardContent className="p-0">
              {filteredTeachers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Avatar</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewTeacher(teacher.id)}>
                        <TableCell>
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
                            {teacher.profile_picture_url ? (
                              <img src={teacher.profile_picture_url} alt={teacher.full_name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold text-primary">
                                {(teacher.first_name?.[0] || '') + (teacher.last_name?.[0] || '')}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{getDisplayName(teacher)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{teacher.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{teacher.phone || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getDisplaySubject(teacher.school_subject) || '—'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={teacher.is_active ? "default" : "secondary"}>
                            {teacher.is_active ? t('status.active') : t('status.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewTeacher(teacher.id);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>{t('action.view')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendMessage(teacher);
                                }}
                                className="cursor-pointer"
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                <span>{t('action.sendMessage') || 'Send Message'}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTeacher(teacher.id);
                                }}
                                className="cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>{t('action.edit')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTeacher(teacher.id);
                                }}
                                className="text-destructive focus:text-destructive cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>{t('action.delete')}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <GraduationCap className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('admin.teachersManagement.noTeachersFound')}
                  </h3>
                  <p className="text-muted-foreground text-center max-w-sm mb-6">
                    {searchQuery || statusFilter !== 'all' || subjectFilter !== 'all'
                      ? t('admin.teachersManagement.noTeachersMatchingFilters')
                      : t('admin.teachersManagement.noTeachersYet')
                    }
                  </p>
                  {(!searchQuery && statusFilter === 'all' && subjectFilter === 'all' && teachers.length === 0) && (
                    <Button onClick={handleAddTeacher} className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      {t('action.addFirstTeacher')}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Send Message Modal */}
        <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t('Send Message to')} {selectedTeacherForMessage?.full_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Message')}</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder={t('Type your message...')}
                  className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={sendingMessage}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsMessageModalOpen(false)}
                disabled={sendingMessage}
              >
                {t('Cancel')}
              </Button>
              <Button
                onClick={handleSendMessageSubmit}
                disabled={!messageContent.trim() || sendingMessage}
              >
                {sendingMessage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('Sending...')}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t('Send Message')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageLayout>
    </div>
  );
};

export default TeachersManagementPage;
