import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Edit, ArrowLeft, Trash2, Loader2, AlertCircle } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const ViewSubjectPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiMethods.get(`schools/subjects/${id}/`);
      setSubject(response.data || response);
    } catch (error) {
      console.error('Failed to fetch subject:', error);
      setError(t('subjects.fetchError'));
      toast.error(t('subjects.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('subjects.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/subjects/${id}/`);
        toast.success(t('subjects.deleteSuccess'));
        navigate('/admin/academic-management/subjects');
      } catch (error) {
        console.error('Failed to delete subject:', error);
        toast.error(t('subjects.deleteError'));
      }
    }
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => navigate('/admin/academic-management/subjects')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>
      {subject && (
        <>
          <Button
            onClick={() => navigate(`/admin/academic-management/subjects/${id}/edit`)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
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
        title={t('subjects.viewSubject')}
        subtitle={t('subjects.viewSubjectSubtitle')}
        ActionComponent={ActionButtons}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </AdminPageLayout>
    );
  }

  if (error || !subject) {
    return (
      <AdminPageLayout
        title={t('subjects.viewSubject')}
        subtitle={t('subjects.viewSubjectSubtitle')}
        ActionComponent={ActionButtons}
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || t('subjects.notFound')}
          </AlertDescription>
        </Alert>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={subject.name}
      subtitle={t('subjects.viewSubjectSubtitle')}
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
                <BookOpen className="h-5 w-5 text-blue-600" />
                {t('subjects.subjectInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>{t('subjects.nameEnglish')}</Label>
                  <p>{subject.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t('subjects.code')}</Label>
                  <p>{subject.code}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t('subjects.nameArabic')}</Label>
                  <p dir="rtl">{subject.name_arabic}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t('subjects.nameFrench')}</Label>
                  <p>{subject.name_french}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default ViewSubjectPage;
