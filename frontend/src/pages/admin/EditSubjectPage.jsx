import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Save, ArrowLeft, Loader2 } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditSubjectPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    name_arabic: '',
    name_french: ''
  });

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    setInitialLoading(true);
    try {
      const response = await apiMethods.get(`schools/subjects/${id}/`);
      const subjectData = response.data || response;
      setFormData({
        name: subjectData.name || '',
        code: subjectData.code || '',
        name_arabic: subjectData.name_arabic || '',
        name_french: subjectData.name_french || ''
      });
    } catch (error) {
      console.error('Failed to fetch subject:', error);
      toast.error(t('error.failedToLoadData'));
      navigate('/admin/academic-management/subjects');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('subjects.validation.nameRequired');
    if (!formData.code.trim()) newErrors.code = t('subjects.validation.codeRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(t('validation.pleaseFixErrors'));
      return;
    }

    setLoading(true);
    try {
      await apiMethods.patch(`schools/subjects/${id}/`, formData);
      toast.success(t('subjects.updateSuccess'));
      navigate('/admin/academic-management/subjects');
    } catch (error) {
      console.error('Failed to update subject:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors = {};
        Object.keys(apiErrors).forEach(key => {
          newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(newErrors);
        toast.error(t('subjects.updateError'));
      } else {
        toast.error(t('error.unexpected'));
      }
    } finally {
      setLoading(false);
    }
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/admin/academic-management/subjects')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>
    </div>
  );

  if (initialLoading) {
    return (
      <AdminPageLayout
        title={t('subjects.editSubject')}
        subtitle={t('subjects.editSubjectSubtitle')}
        ActionComponent={ActionButtons}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('subjects.editSubject')}
      subtitle={t('subjects.editSubjectSubtitle')}
      ActionComponent={ActionButtons}
    >
      <div className="max-w-2xl mx-auto">
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('subjects.nameEnglish')} *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('subjects.nameEnglishPlaceholder')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">{t('subjects.code')} *</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder={t('subjects.codePlaceholder')}
                    className={errors.code ? 'border-red-500' : ''}
                  />
                  {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name_arabic">{t('subjects.nameArabic')}</Label>
                  <Input
                    id="name_arabic"
                    name="name_arabic"
                    value={formData.name_arabic}
                    onChange={handleInputChange}
                    placeholder={t('subjects.nameArabicPlaceholder')}
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name_french">{t('subjects.nameFrench')}</Label>
                  <Input
                    id="name_french"
                    name="name_french"
                    value={formData.name_french}
                    onChange={handleInputChange}
                    placeholder={t('subjects.nameFrenchPlaceholder')}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/academic-management/subjects')}>
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" />{t('subjects.updateSubject')}</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default EditSubjectPage;
