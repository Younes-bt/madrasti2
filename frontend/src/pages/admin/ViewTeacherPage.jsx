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
  BookOpen
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewTeacherPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);

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

  useEffect(() => {
    if (teacherId) {
      fetchTeacherData();
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
                  
                  {teacherData.department && (
                    <p className="text-sm text-gray-600 mt-2 flex items-center justify-center">
                      <Building className="h-4 w-4 mr-1" />
                      {teacherData.department}
                    </p>
                  )}
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
                
                <InfoItem
                  icon={<Building className="h-4 w-4 text-gray-400" />}
                  label={t('teacher.department')}
                  value={teacherData.department}
                />
                
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