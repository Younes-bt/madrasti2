import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Edit, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Camera, 
  DollarSign, 
  Briefcase, 
  Globe,
  Building,
  Clock,
  Shield,
  BookOpen,
  GraduationCap,
  Users
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import attendanceService from '../../services/attendance';
import { toast } from 'sonner';

const ViewTeacherPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch teacher data
  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${teacherId}/`);
      
      let data = response.data || response;
      setTeacherData(data);
      
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
      toast.error(t('error.failedToLoadTeacherData'));
      navigate('/admin/school-management/teachers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch teacher classes
  const fetchTeacherClasses = async () => {
    if (!teacherId) return;

    try {
      setLoadingClasses(true);

      // Get all timetable sessions and filter by teacher on frontend
      // This ensures we get the same data as the teacher's own view
      const response = await attendanceService.getTimetableSessions();

      // Process sessions to extract unique classes with their details, filtering by teacher
      const allSessions = response.results || response.data || response || [];

      // Filter sessions by the specific teacher ID
      const teacherSessions = allSessions.filter(session => {
        return session.teacher && (
          session.teacher.id === parseInt(teacherId) ||
          session.teacher === parseInt(teacherId)
        );
      });

      console.log('All sessions:', allSessions.length);
      console.log('Filtered teacher sessions:', teacherSessions.length);
      console.log('Teacher ID to filter:', teacherId);
      console.log('Sample sessions:', allSessions.slice(0, 3));

      const classesMap = new Map();

      teacherSessions.forEach(session => {
        if (session.class_name && session.timetable_id) {
          const classId = session.timetable_id;
          if (!classesMap.has(classId)) {
            // Create a simplified class object
            const classData = {
              id: classId,
              school_class_id: session.school_class_id,
              name: session.class_name || 'Unknown Class',
              section: session.class_section || '',
              room: session.room_name ? {
                id: session.room || 0,
                name: session.room_name,
                type: 'classroom'
              } : null,
              student_count: 0, // We'll fetch this separately if needed
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
      setTeacherClasses(classesData);

      // Fetch student counts for all classes
      await fetchStudentCounts(classesData);
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      // Don't show error toast for classes as it's secondary information
    } finally {
      setLoadingClasses(false);
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

      setTeacherClasses(updatedClasses);
    } catch (error) {
      console.error('Error fetching student counts:', error);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchTeacherData();
      fetchTeacherClasses();
    }
  }, [teacherId]);

  const handleEdit = () => {
    navigate(`/admin/school-management/teachers/edit/${teacherId}`);
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'}
        className={isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}
      >
        {isActive ? t('status.active') : t('status.inactive')}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get localized grade name
  const getLocalizedGradeName = (grade) => {
    const currentLanguage = i18n.language;

    switch (currentLanguage) {
      case 'ar':
        return grade.name_arabic || grade.name;
      case 'fr':
        return grade.name_french || grade.name;
      default:
        return grade.name;
    }
  };

  const InfoItem = ({ icon, label, value, isLink = false, linkUrl = null }) => (
    <div className="flex items-start space-x-3 p-3">
      <div className="flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {isLink && value && linkUrl ? (
          <a 
            href={linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-gray-600 break-words">{value || '-'}</p>
        )}
      </div>
    </div>
  );

  const actions = [
    <Button
      key="edit"
      onClick={handleEdit}
      disabled={loading}
      className="gap-2"
    >
      <Edit className="h-4 w-4" />
      {t('action.edit')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('teacher.viewTeacher')}
        subtitle={t('teacher.viewTeacherDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/teachers"
        loading={true}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!teacherData) {
    return (
      <AdminPageLayout
        title={t('teacher.viewTeacher')}
        subtitle={t('teacher.viewTeacherDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/teachers"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">{t('error.teacherNotFound')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={`${teacherData.first_name} ${teacherData.last_name}`}
      subtitle={t('teacher.viewTeacherDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/teachers"
      actions={actions}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Summary - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Picture & Basic Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    {teacherData.profile_picture_url ? (
                      <img
                        src={teacherData.profile_picture_url}
                        alt={`${teacherData.first_name} ${teacherData.last_name}`}
                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {teacherData.first_name} {teacherData.last_name}
                  </h3>
                  
                  {(teacherData.ar_first_name || teacherData.ar_last_name) && (
                    <p className="text-sm text-gray-600 mt-1" dir="rtl">
                      {teacherData.ar_first_name} {teacherData.ar_last_name}
                    </p>
                  )}
                  
                  <div className="mt-2 flex items-center justify-center space-x-2 flex-wrap gap-1">
                    {(teacherData.school_subject || teacherData.profile?.school_subject) && (
                      <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {(() => {
                          const subject = teacherData.school_subject || teacherData.profile?.school_subject;
                          if (typeof subject === 'object' && subject.name) {
                            return subject.name;
                          }
                          return subject;
                        })()}
                      </Badge>
                    )}
                    {getStatusBadge(teacherData.is_active)}
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('teacher.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.role')}</span>
                  <Badge variant="secondary">{t(`roles.${teacherData.role?.toLowerCase()}`)}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.joinedDate')}</span>
                  <span className="text-sm text-gray-900">{formatDate(teacherData.created_at)}</span>
                </div>
                
                {teacherData.hire_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('teacher.hireDate')}</span>
                    <span className="text-sm text-gray-900">{formatDate(teacherData.hire_date)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.lastLogin')}</span>
                  <span className="text-sm text-gray-900">{formatDate(teacherData.last_login)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information - Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {t('teacher.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                  label={t('common.email')}
                  value={teacherData.email}
                  isLink={true}
                  linkUrl={`mailto:${teacherData.email}`}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('common.phone')}
                  value={teacherData.phone}
                  isLink={teacherData.phone}
                  linkUrl={`tel:${teacherData.phone}`}
                />
                
                <InfoItem
                  icon={<MapPin className="h-4 w-4 text-gray-400" />}
                  label={t('common.address')}
                  value={teacherData.address}
                />
                
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  label={t('common.dateOfBirth')}
                  value={formatDate(teacherData.date_of_birth)}
                />
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t('teacher.professionalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                {(teacherData.school_subject || teacherData.profile?.school_subject) && (
                  <InfoItem
                    icon={<BookOpen className="h-4 w-4 text-gray-400" />}
                    label={t('teacher.schoolSubject')}
                    value={(() => {
                      const subject = teacherData.school_subject || teacherData.profile?.school_subject;
                      if (typeof subject === 'object' && subject.name) {
                        return `${subject.name}${subject.code ? ` (${subject.code})` : ''}`;
                      }
                      return subject;
                    })()}
                  />
                )}

                {/* Teachable Grades */}
                {(teacherData.teachable_grades && teacherData.teachable_grades.length > 0) && (
                  <div className="flex items-start space-x-3 p-3">
                    <div className="flex-shrink-0 mt-1">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{t('teacher.teachableGrades')}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {teacherData.teachable_grades.map((grade) => (
                          <Badge
                            key={grade.id}
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
                          >
                            {getLocalizedGradeName(grade)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  label={t('teacher.hireDate')}
                  value={formatDate(teacherData.hire_date)}
                />
                
                {teacherData.salary && (
                  <InfoItem
                    icon={<DollarSign className="h-4 w-4 text-gray-400" />}
                    label={t('teacher.salary')}
                    value={`${parseFloat(teacherData.salary).toLocaleString()} MAD`}
                  />
                )}
              </CardContent>
            </Card>

            {/* Classes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('teacher.myClasses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingClasses ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-muted-foreground">{t('common.loading')}</span>
                  </div>
                ) : teacherClasses.length > 0 ? (
                  <div className="space-y-4">
                    {teacherClasses.map((classData) => (
                      <div key={classData.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {classData.name} {classData.section}
                              </h4>
                              {classData.room && (
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {classData.room.name}
                                </p>
                              )}
                            </div>
                          </div>
                          {classData.academic_year && (
                            <Badge variant="outline" className="text-xs">
                              {classData.academic_year.year}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">{classData.student_count}</div>
                            <div className="text-xs text-gray-500">{t('teacher.students')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">{classData.subjects_taught.length}</div>
                            <div className="text-xs text-gray-500">{t('teacher.subjects')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-600">{classData.weekly_sessions}</div>
                            <div className="text-xs text-gray-500">{t('teacher.weeklyHours')}</div>
                          </div>
                        </div>

                        {classData.subjects_taught.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">{t('teacher.subjectsTaught')}:</p>
                            <div className="flex flex-wrap gap-2">
                              {classData.subjects_taught.map((subject) => (
                                <Badge key={subject.id} variant="secondary" className="text-xs">
                                  {subject.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Summary */}
                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xl font-bold text-blue-600">{teacherClasses.length}</div>
                          <div className="text-sm text-gray-500">{t('teacher.totalClasses')}</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-600">
                            {teacherClasses.reduce((acc, cls) => acc + cls.student_count, 0)}
                          </div>
                          <div className="text-sm text-gray-500">{t('teacher.totalStudents')}</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-purple-600">
                            {teacherClasses.reduce((acc, cls) => acc + cls.weekly_sessions, 0)}
                          </div>
                          <div className="text-sm text-gray-500">{t('teacher.totalWeeklyHours')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <GraduationCap className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">{t('teacher.noClassesAssigned')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t('teacher.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<User className="h-4 w-4 text-gray-400" />}
                  label={t('teacher.emergencyContactName')}
                  value={teacherData.emergency_contact_name}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('teacher.emergencyContactPhone')}
                  value={teacherData.emergency_contact_phone}
                  isLink={teacherData.emergency_contact_phone}
                  linkUrl={`tel:${teacherData.emergency_contact_phone}`}
                />
              </CardContent>
            </Card>

            {/* Social Media & Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Social Media Links */}
              {(teacherData.linkedin_url || teacherData.twitter_url) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t('teacher.socialMediaLinks')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-gray-100">
                    {teacherData.linkedin_url && (
                      <InfoItem
                        icon={<Globe className="h-4 w-4 text-gray-400" />}
                        label={t('teacher.linkedinUrl')}
                        value={teacherData.linkedin_url}
                        isLink={true}
                        linkUrl={teacherData.linkedin_url}
                      />
                    )}
                    
                    {teacherData.twitter_url && (
                      <InfoItem
                        icon={<Globe className="h-4 w-4 text-gray-400" />}
                        label={t('teacher.twitterUrl')}
                        value={teacherData.twitter_url}
                        isLink={true}
                        linkUrl={teacherData.twitter_url}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Biography */}
              {teacherData.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('common.bio')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {teacherData.bio}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default ViewTeacherPage;