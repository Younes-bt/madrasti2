import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Save, ArrowLeft } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AddSubjectPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    name_arabic: '',
    name_french: ''
  });

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
      await apiMethods.post('schools/subjects/', formData);
      toast.success(t('subjects.createSuccess'));
      navigate('/admin/academic-management/subjects');
    } catch (error) {
      console.error('Failed to create subject:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors = {};
        Object.keys(apiErrors).forEach(key => {
          newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(newErrors);
        toast.error(t('subjects.createError'));
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

  return (
    <AdminPageLayout
      title={t('subjects.addSubject')}
      subtitle={t('subjects.addSubjectSubtitle')}
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
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('common.saving')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {t('subjects.createSubject')}
                      </div>
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

export default AddSubjectPage;
