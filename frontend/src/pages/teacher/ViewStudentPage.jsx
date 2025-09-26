import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Building,
  Clock,
  Users,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { TeacherPageLayout } from '../../components/teacher/layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const TeacherViewStudentPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  // Fetch student data
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${studentId}/`);
      
      let data = response.data || response;
      setStudentData(data);
      
    } catch (error) {
      console.error('Failed to fetch student data:', error);
      toast.error(t('error.failedToLoadStudentData', 'Failed to load student data'));
      navigate('/teacher/profile/my-classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleGoBack = () => {
    navigate('/teacher/profile/my-classes');
  };

  if (loading || !studentData) {
    return (
      <TeacherPageLayout
        title={t('teacherStudentView.title', 'Student Profile')}
        subtitle={t('teacherStudentView.subtitle', 'View student information')}
        loading={loading}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      </TeacherPageLayout>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <TeacherPageLayout
      title={studentData.full_name || `${studentData.first_name} ${studentData.last_name}`}
      subtitle={t('teacherStudentView.subtitle', 'View student information')}
      actions={[
        <Button key="back" onClick={handleGoBack} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.goBack', 'Go Back')}
        </Button>
      ]}
    >
      <div className="space-y-6">
        {/* Student Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('teacherStudentView.profileInfo', 'Profile Information')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="flex justify-center md:justify-start">
                <Avatar className="w-32 h-32">
                  <AvatarImage 
                    src={studentData.profile_picture_url} 
                    alt={studentData.full_name || `${studentData.first_name} ${studentData.last_name}`}
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <GraduationCap className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {studentData.full_name || `${studentData.first_name} ${studentData.last_name}`}
                    </h3>
                    <p className="text-muted-foreground">
                      {studentData.ar_first_name && studentData.ar_last_name && 
                        `${studentData.ar_first_name} ${studentData.ar_last_name}`
                      }
                    </p>
                    <div className="mt-2">
                      <Badge variant={studentData.is_active ? 'default' : 'secondary'}>
                        {studentData.is_active ? t('status.active', 'Active') : t('status.inactive', 'Inactive')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {studentData.student_profile?.current_grade || t('common.notSpecified', 'Not specified')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {studentData.student_profile?.current_class || t('common.notSpecified', 'Not specified')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('teacherStudentView.contactInfo', 'Contact Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.email', 'Email')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.email || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.phone', 'Phone')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.phone || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.address', 'Address')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.address || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.dateOfBirth', 'Date of Birth')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(studentData.date_of_birth)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('teacherStudentView.academicInfo', 'Academic Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.grade', 'Grade')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.student_profile?.current_grade || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.class', 'Class')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.student_profile?.current_class || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.studentId', 'Student ID')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.student_profile?.student_number || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.enrolledOn', 'Enrolled On')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(studentData.date_joined)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherPageLayout>
  );
};

export default TeacherViewStudentPage;