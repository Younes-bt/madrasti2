import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { TeacherPageLayout } from '../../components/teacher/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { 
  Users, 
  BookOpen, 
  Clock, 
  MapPin, 
  Search,
  GraduationCap,
  Calendar,
  Eye,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import attendanceService from '../../services/attendance';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const TeacherMyClassesPage = () => {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showStudentsDialog, setShowStudentsDialog] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchTeacherClasses = async () => {
    try {
      setLoading(true);
      console.log('Fetching teacher classes using timetable sessions...');
      
      // First, check current user info
      console.log('Current user:', user);
      
      // Get all timetable sessions first (without filter) to debug
      console.log('Fetching all timetable sessions...');
      const allSessionsResponse = await attendanceService.getTimetableSessions();
      console.log('All timetable sessions response:', allSessionsResponse);
      
      // Check teacher IDs in all sessions
      const allSessions = allSessionsResponse.results || allSessionsResponse.data || allSessionsResponse || [];
      console.log('Session teacher details:');
      allSessions.forEach((session, index) => {
        console.log(`Session ${index + 1}:`, {
          teacher_id: session.teacher?.id,
          teacher_name: session.teacher?.full_name || session.teacher?.first_name + ' ' + session.teacher?.last_name,
          subject: session.subject?.name,
          class: session.timetable?.school_class?.name
        });
      });
      
      // Now get filtered sessions for this teacher
      console.log('Fetching teacher sessions with my_sessions=true...');
      const response = await attendanceService.getTimetableSessions({ my_sessions: 'true' });
      console.log('Teacher timetable sessions response:', response);
      
      // Process sessions to extract unique classes with their details
      const sessionsData = response.results || response.data || response || [];
      const classesMap = new Map();
      
      sessionsData.forEach(session => {
        if (session.class_name && session.timetable_id) {
          const classId = session.timetable_id;
          if (!classesMap.has(classId)) {
            // Create a simplified class object
            const classData = {
              id: classId,
              school_class_id: session.school_class_id,
              name: session.class_name || 'Unknown Class',
              section: session.class_section || '',
              grade: {
                id: 0, // We don't have grade details in the simplified response
                name: 'Unknown Grade', // Will need to fetch separately if needed
                grade_number: 0,
                educational_level: {
                  id: 0,
                  name: 'Unknown Level',
                  level: 'UNKNOWN'
                }
              },
              room: session.room_name ? {
                id: session.room || 0,
                name: session.room_name,
                type: 'classroom'
              } : null,
              student_count: 0, // We'll need to fetch this separately if needed
              students: [], // We'll populate this when viewing students
              subjects_taught: [],
              weekly_sessions: 0,
              academic_year: session.academic_year ? {
                id: 0,
                year: session.academic_year
              } : null
            };
            classesMap.set(classId, classData);
          }
          
          // Add subject if not already included
          const classData = classesMap.get(classId);
          const subjectExists = classData.subjects_taught.some(s => s.id === session.subject);
          if (session.subject && session.subject_name && !subjectExists) {
            classData.subjects_taught.push({
              id: session.subject,
              name: session.subject_name,
              name_arabic: session.subject_name_arabic || '',
              code: ''
            });
          }
          
          // Count weekly sessions
          classData.weekly_sessions++;
        }
      });
      
      const classesData = Array.from(classesMap.values());
      console.log('Processed classes data:', classesData);
      setClasses(classesData);
      
      // Fetch student counts for all classes
      await fetchStudentCounts(classesData);
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      toast.error(t('error.failedToLoadData', 'Failed to load classes data'));
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch student counts for all classes
  const fetchStudentCounts = async (classesData) => {
    try {
      const updatedClasses = await Promise.all(
        classesData.map(async (classData) => {
          try {
            const params = new URLSearchParams();
            params.append('school_class', classData.school_class_id);
            params.append('is_active', 'true');
            
            const enrollmentsResponse = await apiMethods.get(`users/enrollments/?${params.toString()}`);
            const studentCount = enrollmentsResponse.count || 0;
            
            return {
              ...classData,
              student_count: studentCount
            };
          } catch (error) {
            console.error(`Error fetching student count for class ${classData.name}:`, error);
            return classData; // Return original data if error
          }
        })
      );
      
      setClasses(updatedClasses);
    } catch (error) {
      console.error('Error fetching student counts:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTeacherClasses();
    };
    loadData();
  }, []);

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.grade.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle student click to navigate to profile
  const handleStudentClick = (studentId) => {
    navigate(`/teacher/students/view/${studentId}`);
  };

  const handleViewStudents = async (classData) => {
    try {
      setSelectedClass(classData);
      setShowStudentsDialog(true);
      
      // If students are not loaded yet, fetch them
      if (classData.students.length === 0) {
        console.log('Fetching students for class:', classData.name);
        setLoadingStudents(true);
        
        // Fetch all students for this specific class using pagination
        try {
          const params = new URLSearchParams();
          params.append('school_class', classData.school_class_id);
          params.append('is_active', 'true');
          
          let allEnrollments = [];
          let nextUrl = `users/enrollments/?${params.toString()}`;
          
          // Fetch all pages
          while (nextUrl) {
            const enrollmentsResponse = await apiMethods.get(nextUrl);
            console.log('Enrollments response:', enrollmentsResponse);
            
            const currentEnrollments = enrollmentsResponse.results || enrollmentsResponse.data || enrollmentsResponse || [];
            allEnrollments = [...allEnrollments, ...currentEnrollments];
            
            // Check if there's a next page
            if (enrollmentsResponse.next) {
              // Extract the path from the full URL
              const url = new URL(enrollmentsResponse.next);
              nextUrl = `users/enrollments${url.search}`;
            } else {
              nextUrl = null;
            }
          }
          
          console.log('All enrollments:', allEnrollments);
          const classEnrollments = allEnrollments;
          
          console.log('Class enrollments:', classEnrollments);
          
          // Update the class data with student information
          const updatedClassData = {
            ...classData,
            student_count: classEnrollments.length,
            students: classEnrollments.map(enrollment => ({
              id: enrollment.student.id,
              full_name: enrollment.student.full_name || `${enrollment.student.first_name} ${enrollment.student.last_name}`,
              first_name: enrollment.student.first_name,
              last_name: enrollment.student.last_name,
              student_number: enrollment.student_number || 'N/A',
              enrollment_date: enrollment.enrollment_date
            }))
          };
          
          // Update the selected class with the new data
          setSelectedClass(updatedClassData);
          
          // Also update the classes array to cache this data
          setClasses(prevClasses => 
            prevClasses.map(cls => 
              cls.id === classData.id ? updatedClassData : cls
            )
          );
        } catch (enrollmentError) {
          console.error('Error fetching student enrollments:', enrollmentError);
          toast.error('Failed to load student information');
        } finally {
          setLoadingStudents(false);
        }
      }
    } catch (error) {
      console.error('Error opening student modal:', error);
    }
  };

  const getGradeLevelBadgeColor = (level) => {
    const colors = {
      'PRESCHOOL': 'bg-purple-100 text-purple-700',
      'PRIMARY': 'bg-blue-100 text-blue-700',
      'LOWER_SECONDARY': 'bg-green-100 text-green-700',
      'UPPER_SECONDARY': 'bg-orange-100 text-orange-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const ClassCard = ({ classData }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {classData.name} {classData.section}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {classData.grade.name} - {classData.grade.educational_level.name}
              </p>
            </div>
          </div>
          <Badge className={cn("text-xs", getGradeLevelBadgeColor(classData.grade.educational_level.level))}>
            {classData.grade.educational_level.level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{classData.student_count}</p>
            <p className="text-xs text-muted-foreground">{t('teacherMyClasses.students', 'Students')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{classData.subjects_taught.length}</p>
            <p className="text-xs text-muted-foreground">{t('teacherMyClasses.subjects', 'Subjects')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{classData.weekly_sessions}</p>
            <p className="text-xs text-muted-foreground">{t('teacherMyClasses.weeklyHours', 'Weekly Hours')}</p>
          </div>
        </div>

        <Separator />

        {/* Class Details */}
        <div className="space-y-2">
          {classData.room && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{t('teacherMyClasses.room', 'Room')}: {classData.room.name}</span>
            </div>
          )}
          
          {classData.academic_year && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{t('teacherMyClasses.academicYear', 'Academic Year')}: {classData.academic_year.year}</span>
            </div>
          )}
        </div>

        {/* Subjects Taught */}
        <div>
          <p className="text-sm font-medium mb-2">{t('teacherMyClasses.subjectsTaught', 'Subjects Taught')}:</p>
          <div className="flex flex-wrap gap-2">
            {classData.subjects_taught.map((subject, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {subject.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => handleViewStudents(classData)} 
          className="w-full"
          variant="outline"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t('teacherMyClasses.viewStudents', 'View Students')}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  const StudentsDialog = () => (
    <Dialog open={showStudentsDialog} onOpenChange={setShowStudentsDialog}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            {t('teacherMyClasses.studentsIn', 'Students in')} {selectedClass?.name} {selectedClass?.section}
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          {selectedClass && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t('teacherMyClasses.totalStudents', 'Total Students')}: </span>
                    <span className="text-primary font-bold">{selectedClass.student_count}</span>
                  </div>
                  <div>
                    <span className="font-medium">{t('teacherMyClasses.grade', 'Grade')}: </span>
                    <span>{selectedClass.grade.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {t('teacherMyClasses.studentRoster', 'Student Roster')}
                </h4>
                
                {loadingStudents ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" text="Loading students..." />
                  </div>
                ) : selectedClass.students.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No students enrolled in this class</p>
                  </div>
                ) : selectedClass.students.map((student, index) => (
                  <div 
                    key={student.id} 
                    onClick={() => handleStudentClick(student.id)}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-medium text-sm">{student.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('teacherMyClasses.studentNumber', 'Student #')}: {student.student_number || 'N/A'}
                      </p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {t('teacherMyClasses.enrolled', 'Enrolled')}: {new Date(student.enrollment_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <TeacherPageLayout 
        title={t('teacherMyClasses.title', 'My Classes')}
        description={t('teacherMyClasses.description', 'View and manage your assigned classes and students')}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </TeacherPageLayout>
    );
  }

  return (
    <TeacherPageLayout 
      title={t('teacherMyClasses.title', 'My Classes')}
      description={t('teacherMyClasses.description', 'View and manage your assigned classes and students')}
    >
      <div className="space-y-6">
        {/* Header with Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('teacherMyClasses.searchPlaceholder', 'Search classes...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {t('teacherMyClasses.showingCount', 'Showing {count} classes', { count: filteredClasses.length })}
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t('teacherMyClasses.noClasses', 'No Classes Found')}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery 
                    ? t('teacherMyClasses.noSearchResults', 'No classes match your search criteria')
                    : t('teacherMyClasses.noClassesAssigned', 'You have no classes assigned yet')
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classData) => (
              <ClassCard key={classData.id} classData={classData} />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {classes.length > 0 && (
          <Card className="border-t-4 border-t-primary">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">{classes.length}</p>
                  <p className="text-sm text-muted-foreground">{t('teacherMyClasses.totalClasses', 'Total Classes')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    {classes.reduce((acc, cls) => acc + cls.student_count, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('teacherMyClasses.totalStudents', 'Total Students')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    {classes.reduce((acc, cls) => acc + cls.subjects_taught.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('teacherMyClasses.totalSubjects', 'Total Subjects')}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">
                    {classes.reduce((acc, cls) => acc + cls.weekly_sessions, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('teacherMyClasses.weeklyHours', 'Weekly Hours')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <StudentsDialog />
    </TeacherPageLayout>
  );
};

export default TeacherMyClassesPage;