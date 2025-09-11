import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Hash, Edit, ArrowLeft, Trash2, Users, Target, Layers, 
  BookOpen, GraduationCap, Star, TrendingUp, CalendarDays, 
  Award, Building, Loader2, AlertCircle
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewGradePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGrade();
  }, [id]);

  const fetchGrade = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiMethods.get(`schools/grades/${id}/`);
      const gradeData = response.data || response;
      setGrade(gradeData);
    } catch (error) {
      console.error('Failed to fetch grade:', error);
      setError(t('grades.fetchError'));
      toast.error(t('grades.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('grades.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/grades/${id}/`);
        toast.success(t('grades.deleteSuccess'));
        navigate('/admin/academic-management/grades');
      } catch (error) {
        console.error('Failed to delete grade:', error);
        toast.error(t('grades.deleteError'));
      }
    }
  };

  const getDisplayName = (grade) => {
    if (i18n.language === 'ar' && grade.name_arabic) return grade.name_arabic;
    if (i18n.language === 'fr' && grade.name_french) return grade.name_french;
    return grade.name;
  };

  const getEducationalLevelDisplayName = (grade) => {
    if (i18n.language === 'ar' && grade.educational_level_name_arabic) return grade.educational_level_name_arabic;
    if (i18n.language === 'fr' && grade.educational_level_name_french) return grade.educational_level_name_french;
    return grade.educational_level_name;
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => navigate('/admin/academic-management/grades')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>
      {grade && (
        <>
          <Button
            onClick={() => navigate(`/admin/academic-management/grades/${id}/edit`)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('common.delete')}
          </Button>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <AdminPageLayout
        title={t('grades.viewGrade')}
        subtitle={t('grades.viewGradeSubtitle')}
        ActionComponent={ActionButtons}
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-muted-foreground">{t('common.loading')}</span>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (error || !grade) {
    return (
      <AdminPageLayout
        title={t('grades.viewGrade')}
        subtitle={t('grades.viewGradeSubtitle')}
        ActionComponent={ActionButtons}
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || t('grades.notFound')}
          </AlertDescription>
        </Alert>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={getDisplayName(grade)}
      subtitle={t('grades.viewGradeSubtitle')}
      ActionComponent={ActionButtons}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                {t('grades.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grade Names */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('grades.gradeName')}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50">EN</Badge>
                        <span className="font-medium">{grade.name}</span>
                      </div>
                      {grade.name_arabic && (
                        <div className="flex items-center gap-2" dir="rtl">
                          <Badge variant="outline" className="bg-green-50">AR</Badge>
                          <span className="font-medium">{grade.name_arabic}</span>
                        </div>
                      )}
                      {grade.name_french && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-red-50">FR</Badge>
                          <span className="font-medium">{grade.name_french}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('grades.gradeNumber')}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-600" />
                      <span className="text-lg font-semibold">{grade.grade_number}</span>
                    </div>
                  </div>
                </div>

                {/* Educational Level */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('grades.educationalLevel')}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{getEducationalLevelDisplayName(grade)}</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {grade.educational_level_name && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">EN</Badge>
                          <span className="text-sm">{grade.educational_level_name}</span>
                        </div>
                      )}
                      {grade.educational_level_name_arabic && (
                        <div className="flex items-center gap-2" dir="rtl">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">AR</Badge>
                          <span className="text-sm">{grade.educational_level_name_arabic}</span>
                        </div>
                      )}
                      {grade.educational_level_name_french && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">FR</Badge>
                          <span className="text-sm">{grade.educational_level_name_french}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('grades.levelOrder')}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">{t('grades.order')} {grade.educational_level_order}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Academic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                {t('grades.academicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Passing Grade */}
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-green-100">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{t('grades.passingGrade')}</h4>
                  <p className="text-2xl font-bold text-green-600">{grade.passing_grade}/20</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('grades.minimumToPass')}
                  </p>
                </div>

                {/* Classes Count */}
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{t('grades.classes')}</h4>
                  <p className="text-2xl font-bold text-blue-600">{grade.classes_count || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('grades.totalClasses')}
                  </p>
                </div>

                {/* Success Rate Placeholder */}
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100">
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{t('grades.performance')}</h4>
                  <p className="text-2xl font-bold text-purple-600">--</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('grades.averagePerformance')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Additional Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-600" />
                {t('grades.additionalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('grades.gradeId')}
                  </span>
                  <span className="font-medium">#{grade.id}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('grades.educationalLevelId')}
                  </span>
                  <span className="font-medium">#{grade.educational_level}</span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">
                    {t('grades.gradeStructure')}
                  </h5>
                  <p className="text-sm text-blue-700">
                    {t('grades.gradeDescription', { 
                      gradeName: getDisplayName(grade),
                      levelName: getEducationalLevelDisplayName(grade),
                      gradeNumber: grade.grade_number 
                    })}
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

export default ViewGradePage;