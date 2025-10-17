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
  Users,
  Shield,
  Loader2
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const getLanguageCode = (language) => (language || 'en').split('-')[0];

const normalizeResponse = (response) => {
  if (!response) return null;
  return response.data ? response.data : response;
};

const getLocalizedName = (user, language) => {
  if (!user) return '';
  const lang = getLanguageCode(language);
  const profile = user.profile || {};

  const fallback =
    user.full_name ||
    profile.full_name ||
    `${user.first_name || profile.first_name || ''} ${user.last_name || profile.last_name || ''}`.trim() ||
    user.username ||
    '';

  const resolveByPrefix = (prefix) => {
    const first = user[`${prefix}_first_name`] ?? profile[`${prefix}_first_name`];
    const last = user[`${prefix}_last_name`] ?? profile[`${prefix}_last_name`];
    const full = profile[`${prefix}_full_name`];
    const combined = `${first || ''} ${last || ''}`.trim();
    return (combined || full || '').trim();
  };

  if (lang === 'ar') {
    const arabicName = resolveByPrefix('ar');
    if (arabicName) return arabicName;
  }

  if (lang === 'fr') {
    const frenchName = resolveByPrefix('fr');
    if (frenchName) return frenchName;
  }

  return fallback.trim();
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const ViewParentPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { parentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState(null);
  const [children, setChildren] = useState([]);

  const fetchParentData = async () => {
    if (!parentId) return;
    setLoading(true);
    try {
      const [parentResponse, childrenResponse] = await Promise.all([
        apiMethods.get(`users/users/${parentId}/`),
        apiMethods.get(`users/users/${parentId}/children/`).catch(() => null)
      ]);

      const parent = normalizeResponse(parentResponse);
      const childrenPayload = normalizeResponse(childrenResponse) || {};
      const childrenList = Array.isArray(childrenPayload.children) ? childrenPayload.children : [];

      setParentData({
        ...parent,
        children_count: childrenPayload?.total_children ?? childrenList.length
      });
      setChildren(childrenList);
    } catch (error) {
      console.error('Failed to fetch parent data:', error);
      toast.error(t('error.failedToLoadParentData'));
      navigate('/admin/school-management/parents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentData();
  }, [parentId]);

  const handleEdit = () => {
    navigate(`/admin/school-management/parents/edit/${parentId}`);
  };

  const handleViewChild = (childId) => {
    if (!childId) return;
    navigate(`/admin/school-management/students/view/${childId}`);
  };

  const getProfileValue = (field) => {
    if (!parentData) return '';
    if (parentData[field] !== undefined && parentData[field] !== null && parentData[field] !== '') {
      return parentData[field];
    }
    if (parentData.profile && parentData.profile[field] !== undefined && parentData.profile[field] !== null) {
      return parentData.profile[field];
    }
    return '';
  };

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
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
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
            <p className="text-muted-foreground">{t('error.failedToLoadParentData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  const displayName = getLocalizedName(parentData, i18n.language);
  const arabicName = getLocalizedName(parentData, 'ar');
  const childrenCount = parentData.children_count ?? children.length ?? 0;
  const shouldShowArabicSecondary =
    arabicName && arabicName !== displayName && getLanguageCode(i18n.language) !== 'ar';

  const InfoItem = ({ icon, label, value, isLink = false, linkUrl = null }) => (
    <div className="flex items-start gap-3 p-3">
      <div className="mt-1 text-muted-foreground">
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

  return (
    <AdminPageLayout
      title={displayName || t('parent.viewParent')}
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
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    {parentData.profile_picture_url ? (
                      <img
                        src={parentData.profile_picture_url}
                        alt={displayName}
                        className="h-32 w-32 rounded-full object-cover border-4 border-border mx-auto"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center mx-auto border-4 border-border">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {displayName || t('parent.viewParent')}
                  </h3>

                  {shouldShowArabicSecondary && (
                    <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                      {arabicName}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                    <Badge variant={parentData.is_active ? 'default' : 'secondary'}>
                      {parentData.is_active ? t('status.active') : t('status.inactive')}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="h-3 w-3" />
                      {t('parent.children')}: {childrenCount}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('parent.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.role')}</span>
                  <Badge variant="outline">
                    {t(`roles.${parentData.role?.toLowerCase()}`)}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.joinedDate')}</span>
                  <span className="text-sm text-foreground">{formatDate(parentData.created_at)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.lastLogin')}</span>
                  <span className="text-sm text-foreground">{formatDate(parentData.last_login)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Children Summary */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-primary" />
                  {t('parent.childrenNames')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {children.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {children.map((child) => {
                      const name = getLocalizedName(child, i18n.language);
                      const childId = child?.id;
                      return (
                        <Badge
                          key={childId || name}
                          variant="secondary"
                          className={`text-sm ${childId ? 'cursor-pointer hover:bg-secondary/80 transition-colors' : 'opacity-60 cursor-default'}`}
                          onClick={() => childId && handleViewChild(childId)}
                        >
                          {name || t('parent.children')}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
                )}
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
                  {t('parent.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label={t('common.email')}
                  value={parentData.email}
                  isLink={true}
                  linkUrl={`mailto:${parentData.email}`}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t('common.phone')}
                  value={getProfileValue('phone')}
                  isLink={Boolean(getProfileValue('phone'))}
                  linkUrl={`tel:${getProfileValue('phone')}`}
                />

                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('common.address')}
                  value={getProfileValue('address')}
                />

                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('common.dateOfBirth')}
                  value={formatDate(getProfileValue('date_of_birth'))}
                />
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-5 w-5 text-primary" />
                  {t('parent.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label={t('parent.emergencyContactName')}
                  value={getProfileValue('emergency_contact_name')}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t('parent.emergencyContactPhone')}
                  value={getProfileValue('emergency_contact_phone')}
                  isLink={Boolean(getProfileValue('emergency_contact_phone'))}
                  linkUrl={`tel:${getProfileValue('emergency_contact_phone')}`}
                />
              </CardContent>
            </Card>

            {/* Additional Notes */}
            {parentData.bio && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-primary" />
                    {t('parent.notes')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
