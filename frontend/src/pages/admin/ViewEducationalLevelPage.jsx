import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit, Layers, ArrowLeft, BookOpen, Target, GraduationCap, Star, Users, TrendingUp
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

const ViewEducationalLevelPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { levelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [levelData, setLevelData] = useState(null);

  const levelChoices = {
    'PRESCHOOL': { label: t('educationalLevels.levelTypes.preschool'), icon: Target, color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
    'PRIMARY': { label: t('educationalLevels.levelTypes.primary'), icon: BookOpen, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    'LOWER_SECONDARY': { label: t('educationalLevels.levelTypes.lowerSecondary'), icon: GraduationCap, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    'UPPER_SECONDARY': { label: t('educationalLevels.levelTypes.upperSecondary'), icon: Star, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
  };

  useEffect(() => {
    const fetchLevelData = async () => {
      setLoading(true);
      try {
        const response = await apiMethods.get(`schools/levels/${levelId}/`);
        setLevelData(response.data || response);
      } catch (error) {
        console.error('Failed to fetch educational level data:', error);
        toast.error(t('error.failedToLoadData'));
        navigate('/admin/academic-management/educational-levels');
      } finally {
        setLoading(false);
      }
    };

    if (levelId) {
      fetchLevelData();
    }
  }, [levelId, navigate, t]);

  const handleEdit = () => {
    navigate(`/admin/academic-management/educational-levels/edit/${levelId}`);
  };

  const handleBack = () => {
    navigate('/admin/academic-management/educational-levels');
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
        title={t('educationalLevels.viewEducationalLevel')}
        subtitle={t('educationalLevels.subtitle')}
        actions={actions}
        loading={loading}
      />
    );
  }

  if (!levelData) {
    return (
      <AdminPageLayout
        title={t('educationalLevels.viewEducationalLevel')}
        subtitle={t('educationalLevels.subtitle')}
        actions={actions}
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('error.dataNotFound')}</p>
        </div>
      </AdminPageLayout>
    );
  }

  const levelInfo = levelChoices[levelData.level] || { label: levelData.level, icon: Layers, color: 'bg-gray-100 text-gray-800' };
  const LevelIcon = levelInfo.icon;

  return (
    <AdminPageLayout
      title={levelData.name}
      subtitle={t('educationalLevels.levelDetails')}
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
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <LevelIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{levelData.name}</h1>
                    <p className="text-sm text-muted-foreground">{t('educationalLevels.educationalLevel')}</p>
                  </div>
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={levelInfo.color}>
                    {levelInfo.label}
                  </Badge>
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
                  <Layers className="h-5 w-5" />
                  {t('educationalLevels.levelDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem
                  icon={<BookOpen className="h-5 w-5" />}
                  label={t('educationalLevels.nameEnglish')}
                  value={levelData.name}
                />
                <DetailItem
                  icon={<BookOpen className="h-5 w-5" />}
                  label={t('educationalLevels.nameArabic')}
                >
                  <div dir="rtl" className="text-right">
                    {levelData.name_arabic || '—'}
                  </div>
                </DetailItem>
                <DetailItem
                  icon={<BookOpen className="h-5 w-5" />}
                  label={t('educationalLevels.nameFrench')}
                  value={levelData.name_french}
                />
                <DetailItem
                  icon={<Layers className="h-5 w-5" />}
                  label={t('educationalLevels.levelType')}
                >
                  <Badge className={levelInfo.color}>
                    {levelInfo.label}
                  </Badge>
                </DetailItem>
                <DetailItem
                  icon={<Target className="h-5 w-5" />}
                  label={t('educationalLevels.order')}
                  value={levelData.order}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Associated Grades */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {t('educationalLevels.associatedGrades')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem
                  icon={<Users className="h-5 w-5" />}
                  label={t('educationalLevels.totalGrades')}
                  value={levelData.grades_count || 0}
                />
                
                {/* Grades List */}
                {levelData.grades && levelData.grades.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t('educationalLevels.gradesList')}
                    </p>
                    <div className="space-y-2">
                      {levelData.grades.map((grade, index) => (
                        <div key={grade.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                              {grade.grade_number}
                            </div>
                            <span className="text-sm font-medium">{grade.name}</span>
                          </div>
                          {grade.name_arabic && (
                            <span className="text-xs text-muted-foreground" dir="rtl">
                              {grade.name_arabic}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t('educationalLevels.noGradesYet')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Educational Structure Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('educationalLevels.levelOverview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="h-8 w-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <LevelIcon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">{t('educationalLevels.levelType')}</p>
                  <p className="text-xs text-muted-foreground">{levelInfo.label}</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">{t('educationalLevels.order')}</p>
                  <p className="text-xs text-muted-foreground">{levelData.order}</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="h-8 w-8 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">{t('educationalLevels.grades')}</p>
                  <p className="text-xs text-muted-foreground">{levelData.grades_count || 0} {t('educationalLevels.grades')}</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="h-8 w-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">{t('educationalLevels.translations')}</p>
                  <p className="text-xs text-muted-foreground">
                    {[levelData.name, levelData.name_arabic, levelData.name_french].filter(Boolean).length}/3
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default ViewEducationalLevelPage;