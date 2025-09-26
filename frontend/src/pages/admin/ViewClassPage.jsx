import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building, Edit, ArrowLeft, Trash2, Users, Target, Layers, 
  BookOpen, GraduationCap, Star, TrendingUp, CalendarDays, 
  Award, Loader2, AlertCircle
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewClassPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClass();
  }, [id]);

  const fetchClass = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiMethods.get(`schools/classes/${id}/`);
      setClassData(response.data || response);
    } catch (error) {
      console.error('Failed to fetch class:', error);
      setError(t('classes.fetchError'));
      toast.error(t('classes.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('classes.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/classes/${id}/`);
        toast.success(t('classes.deleteSuccess'));
        navigate('/admin/academic-management/classes');
      } catch (error) {
        console.error('Failed to delete class:', error);
        toast.error(t('classes.deleteError'));
      }
    }
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => navigate('/admin/academic-management/classes')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>
      {classData && (
        <>
          <Button
            onClick={() => navigate(`/admin/academic-management/classes/${id}/edit`)}
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
        title={t('classes.viewClass')}
        subtitle={t('classes.viewClassSubtitle')}
        ActionComponent={ActionButtons}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </AdminPageLayout>
    );
  }

  if (error || !classData) {
    return (
      <AdminPageLayout
        title={t('classes.viewClass')}
        subtitle={t('classes.viewClassSubtitle')}
        ActionComponent={ActionButtons}
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || t('classes.notFound')}
          </AlertDescription>
        </Alert>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={classData.name}
      subtitle={t('classes.viewClassSubtitle')}
      ActionComponent={ActionButtons}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                {t('classes.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.className')}</h4>
                    <span className="font-medium text-lg">{classData.name}</span>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.section')}</h4>
                    <Badge variant="outline">{classData.section}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.grade')}</h4>
                    <span className="font-medium">{classData.grade_name}</span>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('classes.academicYear')}</h4>
                    <span className="font-medium">{classData.academic_year_name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Placeholder for students and teachers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                {t('classes.enrollment')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.featureComingSoon')}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default ViewClassPage;
