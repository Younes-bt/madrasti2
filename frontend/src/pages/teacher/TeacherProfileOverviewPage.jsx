import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { TeacherPageLayout } from '../../components/teacher/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
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
  Edit3,
  UserCircle,
  Contact,
  Linkedin,
  Twitter,
  Heart,
  Loader2
} from 'lucide-react';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const TeacherProfileOverviewPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const resolvedAvatarUrl = profileData?.profile_picture_url ||
    profileData?.profile?.profile_picture_url ||
    user?.profile_picture_url ||
    user?.profile?.profile_picture_url ||
    null;

  // Fetch profile data
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('users/profile/');
      const data = response.data || response;
      setProfileData(data);

      const profile = data.profile || {};
      const pictureUrl = data.profile_picture_url || profile.profile_picture_url || null;
      updateUser({
        first_name: data.first_name || user?.first_name,
        last_name: data.last_name || user?.last_name,
        profile_picture_url: pictureUrl,
        profile: {
          ...(user?.profile || {}),
          ...profile,
          profile_picture_url: pictureUrl,
        },
      });
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      toast.error(t('error.failedToLoadProfile'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notProvided');
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? t('status.active') : t('status.inactive')}
      </Badge>
    );
  };

  const InfoItem = ({ icon, label, value, isLink = false }) => (
    <div className="flex items-start gap-3 p-3">
      <div className="flex-shrink-0 mt-1 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {isLink && value ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
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

  if (loading) {
    return (
      <TeacherPageLayout title={t('teacherSidebar.profile.overview')}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </TeacherPageLayout>
    );
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.profile.overview')}
      subtitle={t('pages.teacherProfile.subtitle')}
      actions={[
        <Button
          key="edit-action"
          onClick={() => navigate('/teacher/profile/edit')}
          className="flex items-center gap-2"
        >
          <Edit3 className="h-4 w-4" />
          {t('common.edit')}
        </Button>
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-border mb-4">
                  <AvatarImage
                    src={resolvedAvatarUrl}
                    alt={profileData?.full_name || profileData?.first_name || 'profile photo'}
                  />
                  <AvatarFallback className="text-lg">
                    {(profileData?.first_name || user?.first_name || '?').slice(0, 1).toUpperCase()}
                    {(profileData?.last_name || user?.last_name || '').slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {profileData?.first_name} {profileData?.last_name}
                </h3>
                {((profileData?.ar_first_name || profileData?.profile?.ar_first_name) ||
                  (profileData?.ar_last_name || profileData?.profile?.ar_last_name)) && (
                  <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                    {profileData?.ar_first_name || profileData?.profile?.ar_first_name} {profileData?.ar_last_name || profileData?.profile?.ar_last_name}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                  {(profileData?.school_subject || profileData?.profile?.school_subject) && (
                    <Badge variant="secondary" className="text-sm">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {profileData?.school_subject?.name || profileData?.profile?.school_subject?.name}
                    </Badge>
                  )}
                  {getStatusBadge(profileData?.is_active)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-primary" />
                {t('common.overview')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('common.memberSince')}</span>
                <span className="text-sm text-foreground">{formatDate(profileData?.created_at)}</span>
              </div>
              {(profileData?.hire_date || profileData?.profile?.hire_date) && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('fields.hireDate')}</span>
                  <span className="text-sm text-foreground">{formatDate(profileData?.hire_date || profileData?.profile?.hire_date)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCircle className="h-5 w-5 text-primary" />
                {t('sections.personalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label={t('fields.firstName')}
                value={profileData?.first_name}
              />
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label={t('fields.lastName')}
                value={profileData?.last_name}
              />
              <InfoItem
                icon={<Globe className="h-4 w-4" />}
                label={t('fields.arabicFirstName')}
                value={profileData?.ar_first_name || profileData?.profile?.ar_first_name}
              />
              <InfoItem
                icon={<Globe className="h-4 w-4" />}
                label={t('fields.arabicLastName')}
                value={profileData?.ar_last_name || profileData?.profile?.ar_last_name}
              />
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label={t('fields.email')}
                value={profileData?.email}
              />
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label={t('fields.dateOfBirth')}
                value={formatDate(profileData?.date_of_birth || profileData?.profile?.date_of_birth)}
              />
              {(profileData?.bio || profileData?.profile?.bio) && (
                <InfoItem
                  icon={<FileText className="h-4 w-4" />}
                  label={t('fields.bio')}
                  value={profileData?.bio || profileData?.profile?.bio}
                />
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Contact className="h-5 w-5 text-primary" />
                {t('sections.contactInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              <InfoItem
                icon={<Phone className="h-4 w-4" />}
                label={t('fields.phone')}
                value={profileData?.phone || profileData?.profile?.phone}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label={t('fields.address')}
                value={profileData?.address || profileData?.profile?.address}
              />
              {(profileData?.linkedin_url || profileData?.profile?.linkedin_url) && (
                <InfoItem
                  icon={<Linkedin className="h-4 w-4" />}
                  label={t('fields.linkedinUrl')}
                  value={profileData?.linkedin_url || profileData?.profile?.linkedin_url}
                  isLink={true}
                />
              )}
              {(profileData?.twitter_url || profileData?.profile?.twitter_url) && (
                <InfoItem
                  icon={<Twitter className="h-4 w-4" />}
                  label={t('fields.twitterUrl')}
                  value={profileData?.twitter_url || profileData?.profile?.twitter_url}
                  isLink={true}
                />
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-5 w-5 text-primary" />
                {t('sections.emergencyContact')}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label={t('fields.emergencyContactName')}
                value={profileData?.emergency_contact_name || profileData?.profile?.emergency_contact_name}
              />
              <InfoItem
                icon={<Phone className="h-4 w-4" />}
                label={t('fields.emergencyContactPhone')}
                value={profileData?.emergency_contact_phone || profileData?.profile?.emergency_contact_phone}
              />
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-5 w-5 text-primary" />
                {t('sections.professionalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              <InfoItem
                icon={<BookOpen className="h-4 w-4" />}
                label={t('fields.subject')}
                value={profileData?.school_subject?.name || profileData?.profile?.school_subject?.name}
              />
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label={t('fields.hireDate')}
                value={formatDate(profileData?.hire_date || profileData?.profile?.hire_date)}
              />
              {(profileData?.salary || profileData?.profile?.salary) && (
                <InfoItem
                  icon={<DollarSign className="h-4 w-4" />}
                  label={t('fields.salary')}
                  value={`${profileData?.salary || profileData?.profile?.salary} MAD`}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherPageLayout>
  );
};

export default TeacherProfileOverviewPage;