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
  Shield
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewStaffPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState(null);

  // Fetch staff member data
  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${staffId}/`);
      
      let data = response.data || response;
      setStaffData(data);
      
    } catch (error) {
      console.error('Failed to fetch staff data:', error);
      toast.error(t('error.failedToLoadStaffData'));
      navigate('/admin/school-management/staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchStaffData();
    }
  }, [staffId]);

  const handleEdit = () => {
    navigate(`/admin/school-management/staff/edit/${staffId}`);
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
        title={t('staff.viewStaff')}
        subtitle={t('staff.viewStaffDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/staff"
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

  if (!staffData) {
    return (
      <AdminPageLayout
        title={t('staff.viewStaff')}
        subtitle={t('staff.viewStaffDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/staff"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">{t('error.staffNotFound')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={`${staffData.first_name} ${staffData.last_name}`}
      subtitle={t('staff.viewStaffDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/staff"
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
                    {staffData.profile_picture_url ? (
                      <img
                        src={staffData.profile_picture_url}
                        alt={`${staffData.first_name} ${staffData.last_name}`}
                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {staffData.first_name} {staffData.last_name}
                  </h3>
                  
                  {(staffData.ar_first_name || staffData.ar_last_name) && (
                    <p className="text-sm text-gray-600 mt-1" dir="rtl">
                      {staffData.ar_first_name} {staffData.ar_last_name}
                    </p>
                  )}
                  
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    {staffData.position && (
                      <Badge variant="outline" className="text-sm">
                        {staffData.position}
                      </Badge>
                    )}
                    {getStatusBadge(staffData.is_active)}
                  </div>
                  
                  {staffData.department && (
                    <p className="text-sm text-gray-600 mt-2 flex items-center justify-center">
                      <Building className="h-4 w-4 mr-1" />
                      {staffData.department}
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
                  {t('staff.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.role')}</span>
                  <Badge variant="secondary">{t(`roles.${staffData.role?.toLowerCase()}`)}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.joinedDate')}</span>
                  <span className="text-sm text-gray-900">{formatDate(staffData.created_at)}</span>
                </div>
                
                {staffData.hire_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('staff.hireDate')}</span>
                    <span className="text-sm text-gray-900">{formatDate(staffData.hire_date)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.lastLogin')}</span>
                  <span className="text-sm text-gray-900">{formatDate(staffData.last_login)}</span>
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
                  {t('staff.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                  label={t('common.email')}
                  value={staffData.email}
                  isLink={true}
                  linkUrl={`mailto:${staffData.email}`}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('common.phone')}
                  value={staffData.phone}
                  isLink={staffData.phone}
                  linkUrl={`tel:${staffData.phone}`}
                />
                
                <InfoItem
                  icon={<MapPin className="h-4 w-4 text-gray-400" />}
                  label={t('common.address')}
                  value={staffData.address}
                />
                
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  label={t('common.dateOfBirth')}
                  value={formatDate(staffData.date_of_birth)}
                />
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t('staff.professionalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<Briefcase className="h-4 w-4 text-gray-400" />}
                  label={t('staff.position')}
                  value={staffData.position}
                />
                
                <InfoItem
                  icon={<Building className="h-4 w-4 text-gray-400" />}
                  label={t('staff.department')}
                  value={staffData.department}
                />
                
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  label={t('staff.hireDate')}
                  value={formatDate(staffData.hire_date)}
                />
                
                {staffData.salary && (
                  <InfoItem
                    icon={<DollarSign className="h-4 w-4 text-gray-400" />}
                    label={t('staff.salary')}
                    value={`${parseFloat(staffData.salary).toLocaleString()} MAD`}
                  />
                )}
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t('staff.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<User className="h-4 w-4 text-gray-400" />}
                  label={t('staff.emergencyContactName')}
                  value={staffData.emergency_contact_name}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('staff.emergencyContactPhone')}
                  value={staffData.emergency_contact_phone}
                  isLink={staffData.emergency_contact_phone}
                  linkUrl={`tel:${staffData.emergency_contact_phone}`}
                />
              </CardContent>
            </Card>

            {/* Social Media & Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Social Media Links */}
              {(staffData.linkedin_url || staffData.twitter_url) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {t('staff.socialMediaLinks')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y divide-gray-100">
                    {staffData.linkedin_url && (
                      <InfoItem
                        icon={<Globe className="h-4 w-4 text-gray-400" />}
                        label={t('staff.linkedinUrl')}
                        value={staffData.linkedin_url}
                        isLink={true}
                        linkUrl={staffData.linkedin_url}
                      />
                    )}
                    
                    {staffData.twitter_url && (
                      <InfoItem
                        icon={<Globe className="h-4 w-4 text-gray-400" />}
                        label={t('staff.twitterUrl')}
                        value={staffData.twitter_url}
                        isLink={true}
                        linkUrl={staffData.twitter_url}
                      />
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Biography */}
              {staffData.bio && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t('common.bio')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {staffData.bio}
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

export default ViewStaffPage;