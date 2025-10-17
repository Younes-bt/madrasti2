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
  Shield,
  BookOpen,
  GraduationCap,
  Users,
  Loader2
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
      const response = await attendanceService.getTimetableSessions();
      const allSessions = response.results || response.data || response || [];

      const teacherSessions = allSessions.filter(session => {
        return session.teacher && (
          session.teacher.id === parseInt(teacherId) ||
          session.teacher === parseInt(teacherId)
        );
      });

      const classesMap = new Map();

      teacherSessions.forEach(session => {
        if (session.class_name && session.timetable_id) {
          const classId = session.timetable_id;
          if (!classesMap.has(classId)) {
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
              student_count: 0,
              subjects_taught: [],
              weekly_sessions: 0,
              academic_year: session.academic_year ? {
                id: 0,
                year: session.academic_year
              } : null
            };
            classesMap.set(classId, classData);
          }

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

          classData.weekly_sessions++;
        }
      });

      const classesData = Array.from(classesMap.values());
      setTeacherClasses(classesData);
      await fetchStudentCounts(classesData);
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

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
            return classData;
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

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
    <div className="flex items-start gap-3 p-3">
      <div className="flex-shrink-0 mt-1 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {isLink && value && linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground break-words">{value || '-'}</p>
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
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
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
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    {teacherData.profile_picture_url ? (
                      <img
                        src={teacherData.profile_picture_url}
                        alt={`${teacherData.first_name} ${teacherData.last_name}`}
                        className="h-32 w-32 rounded-full object-cover border-4 border-border mx-auto"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center mx-auto border-4 border-border">
                        <Camera className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {teacherData.first_name} {teacherData.last_name}
                  </h3>

                  {(teacherData.ar_first_name || teacherData.ar_last_name) && (
                    <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                      {teacherData.ar_first_name} {teacherData.ar_last_name}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                    {(teacherData.school_subject || teacherData.profile?.school_subject) && (
                      <Badge variant="secondary" className="text-sm">
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
                    <Badge variant={teacherData.is_active ? "default" : "secondary"}>
                      {teacherData.is_active ? t('status.active') : t('status.inactive')}
                    </Badge>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('teacher.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.role')}</span>
                  <Badge variant="outline">{t(`roles.${teacherData.role?.toLowerCase()}`)}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.joinedDate')}</span>
                  <span className="text-sm text-foreground">{formatDate(teacherData.created_at)}</span>
                </div>

                {teacherData.hire_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('teacher.hireDate')}</span>
                    <span className="text-sm text-foreground">{formatDate(teacherData.hire_date)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.lastLogin')}</span>
                  <span className="text-sm text-foreground">{formatDate(teacherData.last_login)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information - Right Columns */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-5 w-5 text-primary" />
                  {t('teacher.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label={t('common.email')}
                  value={teacherData.email}
                  isLink={true}
                  linkUrl={`mailto:${teacherData.email}`}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t('common.phone')}
                  value={teacherData.phone}
                  isLink={teacherData.phone}
                  linkUrl={`tel:${teacherData.phone}`}
                />

                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('common.address')}
                  value={teacherData.address}
                />

                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('common.dateOfBirth')}
                  value={formatDate(teacherData.date_of_birth)}
                />
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {t('teacher.professionalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                {(teacherData.school_subject || teacherData.profile?.school_subject) && (
                  <InfoItem
                    icon={<BookOpen className="h-4 w-4" />}
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
                  <div className="flex items-start gap-3 p-3">
                    <div className="flex-shrink-0 mt-1 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{t('teacher.teachableGrades')}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {teacherData.teachable_grades.map((grade) => (
                          <Badge
                            key={grade.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {getLocalizedGradeName(grade)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('teacher.hireDate')}
                  value={formatDate(teacherData.hire_date)}
                />

                {teacherData.salary && (
                  <InfoItem
                    icon={<DollarSign className="h-4 w-4" />}
                    label={t('teacher.salary')}
                    value={`${parseFloat(teacherData.salary).toLocaleString()} MAD`}
                  />
                )}
              </CardContent>
            </Card>

            {/* Classes Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-primary" />
                  {t('teacher.myClasses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingClasses ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">{t('common.loading')}</span>
                  </div>
                ) : teacherClasses.length > 0 ? (
                  <div className="space-y-4">
                    {teacherClasses.map((classData) => (
                      <div key={classData.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">
                                {classData.name} {classData.section}
                              </h4>
                              {classData.room && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
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
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{classData.student_count}</div>
                            <div className="text-xs text-muted-foreground">{t('teacher.students')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">{classData.subjects_taught.length}</div>
                            <div className="text-xs text-muted-foreground">{t('teacher.subjects')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">{classData.weekly_sessions}</div>
                            <div className="text-xs text-muted-foreground">{t('teacher.weeklyHours')}</div>
                          </div>
                        </div>

                        {classData.subjects_taught.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">{t('teacher.subjectsTaught')}:</p>
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
                    <div className="border-t border-border/50 pt-4 mt-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{teacherClasses.length}</div>
                          <div className="text-sm text-muted-foreground">{t('teacher.totalClasses')}</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            {teacherClasses.reduce((acc, cls) => acc + cls.student_count, 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">{t('teacher.totalStudents')}</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {teacherClasses.reduce((acc, cls) => acc + cls.weekly_sessions, 0)}
                          </div>
                          <div className="text-sm text-muted-foreground">{t('teacher.totalWeeklyHours')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                      <GraduationCap className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">{t('teacher.noClassesAssigned')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-5 w-5 text-primary" />
                  {t('teacher.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label={t('teacher.emergencyContactName')}
                  value={teacherData.emergency_contact_name}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
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
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Globe className="h-5 w-5 text-primary" />
                      {t('teacher.socialMediaLinks')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-border/50">
                    {teacherData.linkedin_url && (
                      <InfoItem
                        icon={<Globe className="h-4 w-4" />}
                        label={t('teacher.linkedinUrl')}
                        value={teacherData.linkedin_url}
                        isLink={true}
                        linkUrl={teacherData.linkedin_url}
                      />
                    )}

                    {teacherData.twitter_url && (
                      <InfoItem
                        icon={<Globe className="h-4 w-4" />}
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
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-5 w-5 text-primary" />
                      {t('common.bio')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
