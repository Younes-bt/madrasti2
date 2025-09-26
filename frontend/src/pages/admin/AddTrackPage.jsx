import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Save, ArrowLeft, AlertCircle, BookOpen, Target, Hash, Star } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Switch } from '../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AddTrackPage = () => {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [grades, setGrades] = useState([]);

  const [formData, setFormData] = useState({
    grade: '',
    name: '',
    name_arabic: '',
    name_french: '',
    code: '',
    description: '',
    description_arabic: '',
    description_french: '',
    is_active: true,
    order: 1
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await apiMethods.get('/schools/grades/');
      let gradesData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      setGrades(gradesData);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
      toast.error(t('error.failedToLoadData'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user makes selection
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate grade
    if (!formData.grade) {
      newErrors.grade = t('adminSidebar.tracks.validation.gradeRequired');
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('adminSidebar.tracks.validation.nameRequired');
    }

    // Validate code
    if (!formData.code.trim()) {
      newErrors.code = t('adminSidebar.tracks.validation.codeRequired');
    } else if (formData.code.length > 20) {
      newErrors.code = t('adminSidebar.tracks.validation.codeTooLong');
    }

    // Validate order
    if (!formData.order || formData.order < 1) {
      newErrors.order = t('adminSidebar.tracks.validation.orderRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('adminSidebar.form.validation.fixErrors'));
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        grade: parseInt(formData.grade),
        order: parseInt(formData.order)
      };

      await apiMethods.post('/schools/tracks/', submitData);
      toast.success(t('adminSidebar.tracks.createSuccess'));
      navigate('/admin/academic-management/tracks');
    } catch (error) {
      console.error('Error creating track:', error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === 'object') {
          setErrors(serverErrors);
        }
        toast.error(t('adminSidebar.tracks.createError'));
      } else {
        toast.error(t('common.error') + ': ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: t('adminSidebar.academicManagement.title'), href: '/admin' },
    { label: t('adminSidebar.academicManagement.tracks'), href: '/admin/academic-management/tracks' },
    { label: t('adminSidebar.tracks.addTrack'), href: '/admin/academic-management/tracks/add' }
  ];

  // Show loading screen if translations aren't ready yet
  if (!ready) {
    return (
      <AdminPageLayout
        title="Loading..."
        breadcrumbs={[]}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading translations...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('adminSidebar.tracks.addTrack')}
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5" />
                  <span>{t('adminSidebar.tracks.basicInformation')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Grade Selection */}
                <div className="space-y-2">
                  <Label htmlFor="grade">{t('adminSidebar.tracks.grade')} *</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => handleSelectChange('grade', value)}
                  >
                    <SelectTrigger className={errors.grade ? 'border-destructive' : ''}>
                      <SelectValue placeholder={t('adminSidebar.tracks.selectGrade')} />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && (
                    <p className="text-sm text-destructive">{errors.grade}</p>
                  )}
                </div>

                {/* Track Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('adminSidebar.tracks.name')} (English) *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.namePlaceholder')}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name_arabic">{t('adminSidebar.tracks.name')} (العربية)</Label>
                    <Input
                      id="name_arabic"
                      name="name_arabic"
                      value={formData.name_arabic}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.nameArabicPlaceholder')}
                      className={errors.name_arabic ? 'border-destructive' : ''}
                      dir="rtl"
                    />
                    {errors.name_arabic && (
                      <p className="text-sm text-destructive">{errors.name_arabic}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name_french">{t('adminSidebar.tracks.name')} (Français)</Label>
                    <Input
                      id="name_french"
                      name="name_french"
                      value={formData.name_french}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.nameFrenchPlaceholder')}
                      className={errors.name_french ? 'border-destructive' : ''}
                    />
                    {errors.name_french && (
                      <p className="text-sm text-destructive">{errors.name_french}</p>
                    )}
                  </div>
                </div>

                {/* Code and Order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">{t('adminSidebar.tracks.code')} *</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.codePlaceholder')}
                      className={errors.code ? 'border-destructive' : ''}
                      maxLength={20}
                    />
                    {errors.code && (
                      <p className="text-sm text-destructive">{errors.code}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">{t('adminSidebar.tracks.order')} *</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.orderPlaceholder')}
                      className={errors.order ? 'border-destructive' : ''}
                    />
                    {errors.order && (
                      <p className="text-sm text-destructive">{errors.order}</p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">{t('adminSidebar.tracks.isActive')}</Label>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{t('adminSidebar.tracks.description')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('adminSidebar.tracks.description')} (English)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.descriptionPlaceholder')}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_arabic">{t('adminSidebar.tracks.description')} (العربية)</Label>
                    <Textarea
                      id="description_arabic"
                      name="description_arabic"
                      value={formData.description_arabic}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.descriptionArabicPlaceholder')}
                      rows={3}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_french">{t('adminSidebar.tracks.description')} (Français)</Label>
                    <Textarea
                      id="description_french"
                      name="description_french"
                      value={formData.description_french}
                      onChange={handleInputChange}
                      placeholder={t('adminSidebar.tracks.descriptionFrenchPlaceholder')}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {t('adminSidebar.form.validation.fixErrors')}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/academic-management/tracks')}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? t('common.saving') : t('common.save')}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default AddTrackPage;
