import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitBranch, Edit, ArrowLeft, Users, BookOpen, Hash,
  Target, Code, Calendar, CheckCircle, XCircle, Loader2,
  Eye, Trash2
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-center space-x-3 ${className}`}>
    <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    <div className="space-y-1 min-w-0 flex-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || '-'}</p>
    </div>
  </div>
);

const ViewTrackPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchTrack();
    fetchTrackClasses();
  }, [id]);

  const fetchTrack = async () => {
    try {
      setLoading(true);
      const response = await apiMethods.get(`/schools/tracks/${id}/`);
      setTrack(response.data || response);
    } catch (error) {
      console.error('Failed to fetch track:', error);
      toast.error(t('tracks.fetchError'));
      navigate('/admin/academic-management/tracks');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackClasses = async () => {
    try {
      const response = await apiMethods.get(`/schools/classes/?track=${id}`);
      setClasses(response.data || response.results || []);
    } catch (error) {
      console.error('Failed to fetch track classes:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('tracks.confirmDelete'))) {
      try {
        await apiMethods.delete(`/schools/tracks/${id}/`);
        toast.success(t('tracks.deleteSuccess'));
        navigate('/admin/academic-management/tracks');
      } catch (error) {
        console.error('Error deleting track:', error);
        toast.error(t('common.error') + ': ' + error.message);
      }
    }
  };

  const breadcrumbs = [
    { label: t('adminSidebar.academicManagement.title'), href: '/admin' },
    { label: t('adminSidebar.academicManagement.tracks'), href: '/admin/academic-management/tracks' },
    { label: track?.name || t('tracks.viewTrack'), href: `/admin/academic-management/tracks/${id}` }
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('tracks.viewTrack')}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </AdminPageLayout>
    );
  }

  if (!track) {
    return (
      <AdminPageLayout
        title={t('tracks.viewTrack')}
        breadcrumbs={breadcrumbs}
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('tracks.notFound')}</p>
        </div>
      </AdminPageLayout>
    );
  }

  const displayName = i18n.language === 'ar' && track.name_arabic ? track.name_arabic :
                      i18n.language === 'fr' && track.name_french ? track.name_french :
                      track.name;

  const displayDescription = i18n.language === 'ar' && track.description_arabic ? track.description_arabic :
                             i18n.language === 'fr' && track.description_french ? track.description_french :
                             track.description;

  return (
    <AdminPageLayout
      title={displayName}
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg">
              <GitBranch className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{track.code}</Badge>
                <Badge variant={track.is_active ? "default" : "secondary"}>
                  {track.is_active ? t('common.active') : t('common.inactive')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/academic-management/tracks')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/academic-management/tracks/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('common.delete')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5" />
                    <span>{t('tracks.basicInformation')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem
                      icon={BookOpen}
                      label={t('tracks.grade')}
                      value={track.grade_name}
                    />
                    <InfoItem
                      icon={Hash}
                      label={t('tracks.order')}
                      value={track.order}
                    />
                    <InfoItem
                      icon={Code}
                      label={t('tracks.code')}
                      value={track.code}
                    />
                    <InfoItem
                      icon={track.is_active ? CheckCircle : XCircle}
                      label={t('common.status')}
                      value={track.is_active ? t('common.active') : t('common.inactive')}
                    />
                  </div>

                  {/* Multilingual Names */}
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">{t('tracks.trackNames')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('tracks.name')} (English)
                        </Label>
                        <p className="text-base">{track.name || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('tracks.name')} (العربية)
                        </Label>
                        <p className="text-base" dir="rtl">{track.name_arabic || '-'}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t('tracks.name')} (Français)
                        </Label>
                        <p className="text-base">{track.name_french || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  {(track.description || track.description_arabic || track.description_french) && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h4 className="font-medium">{t('tracks.descriptions')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {track.description && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                {t('tracks.description')} (English)
                              </Label>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {track.description}
                              </p>
                            </div>
                          )}
                          {track.description_arabic && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                {t('tracks.description')} (العربية)
                              </Label>
                              <p className="text-sm text-muted-foreground leading-relaxed" dir="rtl">
                                {track.description_arabic}
                              </p>
                            </div>
                          )}
                          {track.description_french && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-muted-foreground">
                                {t('tracks.description')} (Français)
                              </Label>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {track.description_french}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Classes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{t('tracks.classes')} ({classes.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {classes.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">{t('tracks.noClasses')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {classes.map((classItem) => (
                        <div
                          key={classItem.id}
                          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/admin/academic-management/classes/${classItem.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{classItem.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {classItem.section} • {classItem.academic_year}
                              </p>
                            </div>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>{t('tracks.statistics')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoItem
                    icon={Users}
                    label={t('tracks.totalClasses')}
                    value={classes.length}
                  />
                  <InfoItem
                    icon={BookOpen}
                    label={t('tracks.educationalLevel')}
                    value={track.educational_level_name}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('tracks.quickActions')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/admin/academic-management/tracks/${id}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('tracks.editTrack')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/admin/academic-management/classes/add', {
                      state: { preselectedTrack: track.id }
                    })}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {t('tracks.addClass')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

const Label = ({ children, className = "" }) => (
  <label className={`text-sm font-medium ${className}`}>{children}</label>
);

export default ViewTrackPage;