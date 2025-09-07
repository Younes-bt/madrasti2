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
  Users,
  Clock,
  Shield,
  Briefcase,
  Building
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewParentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { parentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState(null);

  // Fetch parent data
  const fetchParentData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${parentId}/`);
      
      let data = response.data || response;
      setParentData(data);
      
    } catch (error) {
      console.error('Failed to fetch parent data:', error);
      toast.error(t('error.failedToLoadParentData'));
      navigate('/admin/school-management/parents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchParentData();
    }
  }, [parentId]);

  const handleEdit = () => {
    navigate(`/admin/school-management/parents/edit/${parentId}`);
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
        title={t('parent.viewParent')}
        subtitle={t('parent.viewParentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/parents"
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

  if (!parentData) {
    return (
      <AdminPageLayout
        title={t('parent.viewParent')}
        subtitle={t('parent.viewParentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/parents"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">{t('error.parentNotFound')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={`${parentData.first_name} ${parentData.last_name}`}
      subtitle={t('parent.viewParentDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/parents"
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
                    {parentData.profile_picture_url ? (
                      <img
                        src={parentData.profile_picture_url}
                        alt={`${parentData.first_name} ${parentData.last_name}`}
                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                        <Users className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {parentData.first_name} {parentData.last_name}
                  </h3>
                  
                  {(parentData.ar_first_name || parentData.ar_last_name) && (
                    <p className="text-sm text-gray-600 mt-1" dir="rtl">
                      {parentData.ar_first_name} {parentData.ar_last_name}
                    </p>
                  )}
                  
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    {getStatusBadge(parentData.is_active)}
                  </div>
                  
                  {parentData.occupation && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-sm">
                        {parentData.occupation}
                      </Badge>
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
                  {t('parent.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.role')}</span>
                  <Badge variant="secondary">{t(`roles.${parentData.role?.toLowerCase()}`)}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.joinedDate')}</span>
                  <span className="text-sm text-gray-900">{formatDate(parentData.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t('common.lastLogin')}</span>
                  <span className="text-sm text-gray-900">{formatDate(parentData.last_login)}</span>
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
                  {t('parent.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<Mail className="h-4 w-4 text-gray-400" />}
                  label={t('common.email')}
                  value={parentData.email}
                  isLink={true}
                  linkUrl={`mailto:${parentData.email}`}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('common.phone')}
                  value={parentData.phone}
                  isLink={parentData.phone}
                  linkUrl={`tel:${parentData.phone}`}
                />
                
                <InfoItem
                  icon={<MapPin className="h-4 w-4 text-gray-400" />}
                  label={t('common.address')}
                  value={parentData.address}
                />
                
                <InfoItem
                  icon={<Calendar className="h-4 w-4 text-gray-400" />}
                  label={t('common.dateOfBirth')}
                  value={formatDate(parentData.date_of_birth)}
                />
              </CardContent>
            </Card>

            {/* Parent Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('parent.parentInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<Users className="h-4 w-4 text-gray-400" />}
                  label={t('parent.childrenNames')}
                  value={parentData.children_names}
                />
                
                <InfoItem
                  icon={<Briefcase className="h-4 w-4 text-gray-400" />}
                  label={t('parent.occupation')}
                  value={parentData.occupation}
                />
                
                <InfoItem
                  icon={<Building className="h-4 w-4 text-gray-400" />}
                  label={t('parent.workplace')}
                  value={parentData.workplace}
                />
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t('parent.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-100">
                <InfoItem
                  icon={<User className="h-4 w-4 text-gray-400" />}
                  label={t('parent.emergencyContactName')}
                  value={parentData.emergency_contact_name}
                />
                
                <InfoItem
                  icon={<Phone className="h-4 w-4 text-gray-400" />}
                  label={t('parent.emergencyContactPhone')}
                  value={parentData.emergency_contact_phone}
                  isLink={parentData.emergency_contact_phone}
                  linkUrl={`tel:${parentData.emergency_contact_phone}`}
                />
              </CardContent>
            </Card>

            {/* Additional Notes */}
            {parentData.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('parent.notes')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {parentData.bio}
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

export default ViewParentPage;