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
  GraduationCap,
  Building,
  Clock,
  Shield,
  Users,
  BookOpen
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewStudentPage = () => {
  const { t } = useTranslation();
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
      toast.error(t('error.failedToLoadStudentData'));
      navigate('/admin/school-management/students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleEdit = () => {
    navigate(`/admin/school-management/students/edit/${studentId}`);
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
        title={t('student.viewStudent')}
        subtitle={t('student.viewStudentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/students"
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

  if (!studentData) {
    return (
      <AdminPageLayout
        title={t('student.viewStudent')}
        subtitle={t('student.viewStudentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/students"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">{t('error.studentNotFound')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={`${studentData.first_name} ${studentData.last_name}`}
      subtitle={t('student.viewStudentDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/students"
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
                    {studentData.profile_picture_url ? (
                      <img
                        src={studentData.profile_picture_url}
                        alt={`${studentData.first_name} ${studentData.last_name}`}
                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                        <GraduationCap className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {studentData.first_name} {studentData.last_name}
                  </h3>
                  
                  {(studentData.ar_first_name || studentData.ar_last_name) && (
                    <p className="text-sm text-gray-600 mt-1" dir="rtl">
                      {studentData.ar_first_name} {studentData.ar_last_name}
                    </p>
                  )}
                  
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    {studentData.student_id && (
                      <Badge variant="outline" className="text-sm">
                        {t('student.studentId')}: {studentData.student_id}
                      </Badge>
                    )}
                    {getStatusBadge(studentData.is_active)}
                  </div>
                  
                  {(studentData.grade || studentData.class_name) && (
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      {studentData.grade && (
                        <Badge variant="secondary" className="text-sm">
                          {t('student.grade')} {studentData.grade}
                        </Badge>
                      )}
                      {studentData.class_name && (
                        <Badge variant="secondary" className="text-sm">
                          {studentData.class_name}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('student.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.role')}</span>
                  <Badge variant="secondary">{t(`roles.${studentData.role?.toLowerCase()}`)}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.enrollmentDate')}</span>
                  <span className="text-sm text-gray-900">{formatDate(studentData.enrollment_date || studentData.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.lastLogin')}</span>
                  <span className="text-sm text-gray-900">{formatDate(studentData.last_login)}</span>
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
                  {t('student.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                  label={t('common.email')}
                  value={studentData.email}
                  isLink={true}
                  linkUrl={`mailto:${studentData.email}`}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('common.phone')}
                  value={studentData.phone}
                  isLink={studentData.phone}
                  linkUrl={`tel:${studentData.phone}`}
                />
                
                <InfoItem
                  icon={<MapPin className="h-4 w-4 text-gray-400" />}
                  label={t('common.address')}
                  value={studentData.address}
                />
                
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  label={t('common.dateOfBirth')}
                  value={formatDate(studentData.date_of_birth)}
                />
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t('student.academicInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<GraduationCap className="h-4 w-4 text-gray-400" />}
                  label={t('student.grade')}
                  value={studentData.grade ? `${t('student.grade')} ${studentData.grade}` : '-'}
                />
                
                <InfoItem
                  icon={<Building className="h-4 w-4 text-gray-400" />}
                  label={t('student.className')}
                  value={studentData.class_name}
                />
                
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  label={t('common.enrollmentDate')}
                  value={formatDate(studentData.enrollment_date || studentData.created_at)}
                />
              </CardContent>
            </Card>

            {/* Parent Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('student.parentInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<User className="h-4 w-4 text-gray-400" />}
                  label={t('student.parentName')}
                  value={studentData.parent_name}
                />
                
                <InfoItem
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                  label={t('student.parentEmail')}
                  value={studentData.parent_email}
                  isLink={studentData.parent_email}
                  linkUrl={`mailto:${studentData.parent_email}`}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('student.parentPhone')}
                  value={studentData.parent_phone}
                  isLink={studentData.parent_phone}
                  linkUrl={`tel:${studentData.parent_phone}`}
                />
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t('student.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<User className="h-4 w-4 text-gray-400" />}
                  label={t('student.emergencyContactName')}
                  value={studentData.emergency_contact_name}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('student.emergencyContactPhone')}
                  value={studentData.emergency_contact_phone}
                  isLink={studentData.emergency_contact_phone}
                  linkUrl={`tel:${studentData.emergency_contact_phone}`}
                />
              </CardContent>
            </Card>

            {/* Additional Notes */}
            {studentData.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('student.notes')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {studentData.bio}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default ViewStudentPage;