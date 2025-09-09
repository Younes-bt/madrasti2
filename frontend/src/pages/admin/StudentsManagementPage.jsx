import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  GraduationCap,
  CheckCircle,
  XCircle,
  UserPlus,
  BookOpen,
  Upload,
  Library,
  Building,
  Users2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { apiMethods } from '../../services/api';
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

const GlowingCard = ({ children, className = "", glowColor = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`relative group ${className}`}
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor}-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
    <div className="relative bg-card border rounded-xl backdrop-blur-sm">
      {children}
    </div>
  </motion.div>
)

const StatCard = ({ icon: Icon, label, value, colorClass, description, glowColor }) => (
  <GlowingCard glowColor={glowColor}>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <motion.div 
          className={`p-2 sm:p-3 rounded-full bg-gradient-to-br from-${glowColor}-500 to-${glowColor}-600 text-white shadow-lg flex-shrink-0`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
        <div className="flex-1 space-y-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
          <div className={`text-lg sm:text-3xl font-bold ${colorClass}`}>
            <AnimatedCounter to={value} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
        </div>
      </div>
    </CardContent>
  </GlowingCard>
);

const StudentsManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [educationalStructure, setEducationalStructure] = useState({ levels: [], academicYears: [] });
  const [allClasses, setAllClasses] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const fetchEducationalData = async () => {
    try {
      const [structureData, classesData] = await Promise.all([
        apiMethods.get('users/bulk-import/status/'),
        apiMethods.get('schools/classes/')
      ]);
      
      setEducationalStructure({
        levels: structureData.educational_levels || [],
        academicYears: structureData.academic_years || [],
      });

      if (classesData.results && Array.isArray(classesData.results)) {
        setAllClasses(classesData.results);
      } else if (Array.isArray(classesData)) {
        setAllClasses(classesData);
      }

    } catch (error) {
      console.error('Failed to fetch educational data:', error);
      toast.error(t('error.failedToLoadEducationalData'));
    }
  };

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (levelFilter) params.append('school_class__grade__educational_level', levelFilter);
      if (gradeFilter) params.append('school_class__grade', gradeFilter);
      if (classFilter) params.append('school_class', classFilter);
      if (statusFilter !== 'all') params.append('is_active', statusFilter === 'active');
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (currentPage) params.append('page', currentPage);

      const response = await apiMethods.get(`users/enrollments/?${params.toString()}`);
      
      if (response.results && Array.isArray(response.results)) {
        setEnrollments(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous
        });
        // Update stats based on total count from API
        setStats(prevStats => ({ ...prevStats, total: response.count }));
      } else {
        setEnrollments([]);
        setPagination(null);
      }

    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      toast.error(t('error.failedToLoadData'));
      setEnrollments([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [levelFilter, gradeFilter, classFilter, statusFilter, debouncedSearchQuery, currentPage, t]);

  useEffect(() => {
    fetchEducationalData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);
  
  // This effect can be simplified or removed if stats are not broken down by active/inactive
  useEffect(() => {
    if (pagination) {
      // This is an approximation, for accurate stats, a separate API endpoint would be better
      const activeCount = enrollments.filter(e => e.is_active).length;
      setStats({
        total: pagination.count,
        active: activeCount, // Note: this is only for the current page
        inactive: pagination.count - activeCount // This is an incorrect assumption
      });
    }
  }, [enrollments, pagination]);


  const gradesForSelectedLevel = useMemo(() => {
    if (!levelFilter) return [];
    const selectedLevel = educationalStructure.levels.find(l => l.id === parseInt(levelFilter));
    return selectedLevel?.grades || [];
  }, [levelFilter, educationalStructure.levels]);

  const classesForSelectedGrade = useMemo(() => {
    if (!gradeFilter) return [];
    return allClasses.filter(c => c.grade === parseInt(gradeFilter));
  }, [gradeFilter, allClasses]);

  const getDisplayName = (student) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (student.ar_first_name || student.ar_last_name)) {
      return `${student.ar_first_name || ''} ${student.ar_last_name || ''}`.trim();
    }
    return student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
  };

  const handleViewStudent = (studentId) => navigate(`/admin/school-management/students/view/${studentId}`);
  const handleEditStudent = (studentId) => navigate(`/admin/school-management/students/edit/${studentId}`);
  const handleDeleteStudent = (studentId) => toast.info(`${t('action.delete')} student: ${studentId}`);
  const handleAddStudent = () => navigate('/admin/school-management/students/add');
  const handleBulkImportStudents = () => navigate('/admin/school-management/students/bulk-import');

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const StudentCard = ({ enrollment, index }) => {
    const student = enrollment.student;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <GlowingCard glowColor="blue" className="h-full">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start space-x-3 mb-4">
              <motion.div 
                className="flex-shrink-0 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center overflow-hidden shadow-lg">
                  {student.profile_picture_url ? (
                    <img src={student.profile_picture_url} alt={student.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <motion.div
                    className={`w-4 h-4 rounded-full border-2 border-white ${enrollment.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.h3 
                  className="font-bold text-base text-card-foreground leading-tight truncate group-hover:text-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {getDisplayName(student)}
                </motion.h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  ID: {enrollment.student_number || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">{enrollment.school_class_name || '—'}</p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Badge
                    className={`mt-2 text-xs transition-colors ${enrollment.is_active 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {enrollment.is_active ? t('status.active') : t('status.inactive')}
                  </Badge>
                </motion.div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleViewStudent(student.id)} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /><span>{t('action.view')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditStudent(student.id)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteStudent(student.id)} 
                    className="text-red-600 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-auto space-y-3 pt-3 border-t border-border/50">
              <motion.div 
                className="flex items-center text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <Mail className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                <span className="text-xs truncate">{student.email}</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <Phone className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                <span className="text-xs">{student.phone || '—'}</span>
              </motion.div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30">
                <span className="text-muted-foreground">Enrolled:</span>
                <span className="font-medium text-foreground">{formatDate(enrollment.enrollment_date)}</span>
              </div>
            </div>
          </CardContent>
        </GlowingCard>
      </motion.div>
    );
  }

  const PaginationControls = () => (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => prev - 1)}
        disabled={!pagination?.previous}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t('common.previous')}
      </Button>
      <span className="text-sm text-muted-foreground">
        {t('common.page')} {currentPage} {t('common.of')} {pagination ? Math.ceil(pagination.count / 20) : 1}
      </span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => prev + 1)}
        disabled={!pagination?.next}
      >
        {t('common.next')}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AdminPageLayout
        title={t('admin.studentsManagement.title')}
        subtitle={t('admin.studentsManagement.subtitle')}
        actions={[
          <Button key="add-student" onClick={handleAddStudent} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />{t('action.addStudent')}
          </Button>,
          <Button key="bulk-import" onClick={handleBulkImportStudents} variant="outline" className="gap-2 shadow-md">
            <Upload className="h-4 w-4" />{t('bulkImport.bulkImportStudents')}
          </Button>
        ]}
        loading={loading}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Statistics Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <StatCard 
              icon={GraduationCap} 
              label={t('admin.studentsManagement.stats.totalStudents')} 
              value={stats.total} 
              colorClass="text-blue-600" 
              description={t('admin.studentsManagement.stats.totalStudentsDescription')}
              glowColor="blue"
            />
            <StatCard 
              icon={CheckCircle} 
              label={t('admin.studentsManagement.stats.activeStudents')} 
              value={stats.active} 
              colorClass="text-green-600" 
              description={t('admin.studentsManagement.stats.activeStudentsDescription')}
              glowColor="green"
            />
            <StatCard 
              icon={XCircle} 
              label={t('admin.studentsManagement.stats.inactiveStudents')} 
              value={stats.inactive} 
              colorClass="text-red-600" 
              description={t('admin.studentsManagement.stats.inactiveStudentsDescription')}
              glowColor="red"
            />
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlowingCard glowColor="blue" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder={t('admin.studentsManagement.searchPlaceholder')} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="pl-10 h-12 rounded-lg border-0 bg-gray-50 focus:bg-white transition-colors shadow-inner" 
                  />
                </div>
                <Select value={levelFilter} onValueChange={v => { setLevelFilter(v === 'all' ? '' : v); setGradeFilter(''); setClassFilter(''); setCurrentPage(1); }}>
                  <SelectTrigger className="h-12 rounded-lg border-0 bg-gray-50 shadow-inner">
                    <Library className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={t('common.level')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allLevels')}</SelectItem>
                    {educationalStructure.levels.map(level => (
                      <SelectItem key={level.id} value={level.id.toString()}>{level.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={gradeFilter} onValueChange={v => { setGradeFilter(v === 'all' ? '' : v); setClassFilter(''); setCurrentPage(1); }} disabled={!levelFilter}>
                  <SelectTrigger className="h-12 rounded-lg border-0 bg-gray-50 shadow-inner">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={t('common.grade')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allGrades')}</SelectItem>
                    {gradesForSelectedLevel.map(grade => (
                      <SelectItem key={grade.id} value={grade.id.toString()}>{grade.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={classFilter} onValueChange={v => { setClassFilter(v === 'all' ? '' : v); setCurrentPage(1); }} disabled={!gradeFilter}>
                  <SelectTrigger className="h-12 rounded-lg border-0 bg-gray-50 shadow-inner">
                    <Users2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={t('common.class')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                    {classesForSelectedGrade.map(cls => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </GlowingCard>
          </motion.div>

          {/* Students Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {enrollments.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {enrollments.map((enrollment, index) => 
                    <StudentCard key={enrollment.id} enrollment={enrollment} index={index} />
                  )}
                </div>
                <PaginationControls />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center py-20 flex flex-col items-center"
              >
                <GlowingCard glowColor="gray" className="p-12">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4,
                      ease: "easeInOut"
                    }}
                  >
                    <GraduationCap className="h-20 w-20 text-muted-foreground/50 mb-4 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('admin.studentsManagement.noStudentsFound')}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    {searchQuery || levelFilter || gradeFilter || classFilter || statusFilter !== 'all'
                      ? t('admin.studentsManagement.noStudentsMatchingFilters') 
                      : t('admin.studentsManagement.noStudentsYet')
                    }
                  </p>
                  {(enrollments.length === 0 && !loading) && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        onClick={handleAddStudent} 
                        className="mt-6 gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg"
                      >
                        <UserPlus className="h-4 w-4" />
                        {t('action.addFirstStudent')}
                      </Button>
                    </motion.div>
                  )}
                </GlowingCard>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AdminPageLayout>
    </div>
  );
};

export default StudentsManagementPage;