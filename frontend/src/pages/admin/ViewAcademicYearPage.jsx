import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, Calendar, Clock, ArrowLeft, Star, TrendingUp, Users, BookOpen, GraduationCap
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const DetailItem = ({ icon, label, value, children }) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 w-8 mt-1 text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
      <div className="text-base text-foreground break-words">{children || value || '—'}</div>
    </div>
  </div>
);

const ViewAcademicYearPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { yearId } = useParams();
  const [loading, setLoading] = useState(true);
  const [yearData, setYearData] = useState(null);

  useEffect(() => {
    const fetchYearData = async () => {
      setLoading(true);
      try {
        const response = await apiMethods.get(`schools/academic-years/${yearId}/`);
        setYearData(response.data || response);
      } catch (error) {
        console.error('Failed to fetch academic year data:', error);
        toast.error(t('error.failedToLoadData'));
        navigate('/admin/academic-management/academic-years');
      } finally {
        setLoading(false);
      }
    };

    if (yearId) {
      fetchYearData();
    }
  }, [yearId, navigate, t]);

  // Get year status
  const getYearStatus = (year) => {
    if (year.is_current) return 'current';
    const currentDate = new Date();
    if (new Date(year.start_date) > currentDate) return 'upcoming';
    if (new Date(year.end_date) < currentDate) return 'past';
    return 'current';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusMap = {
      'current': t('academicYears.status.current'),
      'upcoming': t('academicYears.status.upcoming'),
      'past': t('academicYears.status.past'),
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      'current': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'past': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  // Calculate duration in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    navigate(`/admin/academic-management/academic-years/edit/${yearId}`);
  };

  const handleBack = () => {
    navigate('/admin/academic-management/academic-years');
  };

  const actions = [
    <Button key="edit" onClick={handleEdit} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
      <Edit className="h-4 w-4" />{t('action.edit')}
    </Button>,
    <Button key="back" onClick={handleBack} variant="outline" className="gap-2">
      <ArrowLeft className="h-4 w-4" />{t('action.back')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('academicYears.viewAcademicYear')}
        subtitle={t('academicYears.subtitle')}
        actions={actions}
        loading={loading}
      />
    );
  }

  if (!yearData) {
    return (
      <AdminPageLayout
        title={t('academicYears.viewAcademicYear')}
        subtitle={t('academicYears.subtitle')}
        actions={actions}
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('error.dataNotFound')}</p>
        </div>
      </AdminPageLayout>
    );
  }

  const status = getYearStatus(yearData);
  const duration = calculateDuration(yearData.start_date, yearData.end_date);

  return (
    <AdminPageLayout
      title={yearData.year}
      subtitle={t('academicYears.yearDetails')}
      actions={actions}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    {yearData.is_current ? (
                      <Star className="h-6 w-6 text-white" />
                    ) : (
                      <Calendar className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{yearData.year}</h1>
                    <p className="text-sm text-muted-foreground">{t('academicYears.academicPeriod')}</p>
                  </div>
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(status)}>
                    {getStatusLabel(status)}
                  </Badge>
                  {yearData.is_current && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      {t('academicYears.currentYear')}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('academicYears.yearDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem
                  icon={<Calendar className="h-5 w-5" />}
                  label={t('academicYears.yearFormat')}
                  value={yearData.year}
                />
                <DetailItem
                  icon={<Clock className="h-5 w-5" />}
                  label={t('academicYears.startDate')}
                  value={formatDate(yearData.start_date)}
                />
                <DetailItem
                  icon={<Clock className="h-5 w-5" />}
                  label={t('academicYears.endDate')}
                  value={formatDate(yearData.end_date)}
                />
                <DetailItem
                  icon={<TrendingUp className="h-5 w-5" />}
                  label={t('academicYears.duration')}
                  value={`${duration} ${t('academicYears.durationInDays')}`}
                />
                <DetailItem
                  icon={<Star className="h-5 w-5" />}
                  label={t('academicYears.isCurrent')}
                >
                  <Badge className={yearData.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {yearData.is_current ? t('common.yes') : t('common.no')}
                  </Badge>
                </DetailItem>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {t('academicYears.info.totalClasses')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem
                  icon={<BookOpen className="h-5 w-5" />}
                  label={t('academicYears.info.totalClasses')}
                  value="—"
                />
                <DetailItem
                  icon={<Users className="h-5 w-5" />}
                  label={t('academicYears.info.enrolledStudents')}
                  value="—"
                />
                <DetailItem
                  icon={<GraduationCap className="h-5 w-5" />}
                  label={t('academicYears.info.activeTeachers')}
                  value="—"
                />
                <DetailItem
                  icon={<BookOpen className="h-5 w-5" />}
                  label={t('academicYears.info.subjects')}
                  value="—"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Academic Period Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('academicYears.academicPeriod')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="h-4 w-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">{t('academicYears.startDate')}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(yearData.start_date)}</p>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 mx-4"></div>
                  <div className="text-center">
                    <div className="h-4 w-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium">{t('academicYears.endDate')}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(yearData.end_date)}</p>
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="px-3 py-1">
                    {duration} {t('academicYears.durationInDays')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default ViewAcademicYearPage;