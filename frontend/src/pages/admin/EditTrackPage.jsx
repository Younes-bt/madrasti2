import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Save, ArrowLeft, AlertCircle, BookOpen, Target, Hash, Star, Loader2 } from 'lucide-react';
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

const EditTrackPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
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
    fetchTrack();
  }, [id]);

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

  const fetchTrack = async () => {
    try {
      setDataLoading(true);
      const response = await apiMethods.get(`/schools/tracks/${id}/`);
      const track = response.data || response;

      setFormData({
        grade: track.grade?.toString() || '',
        name: track.name || '',
        name_arabic: track.name_arabic || '',
        name_french: track.name_french || '',
        code: track.code || '',
        description: track.description || '',
        description_arabic: track.description_arabic || '',
        description_french: track.description_french || '',
        is_active: track.is_active !== undefined ? track.is_active : true,
        order: track.order || 1
      });
    } catch (error) {
      console.error('Failed to fetch track:', error);
      toast.error(t('tracks.fetchError'));
      navigate('/admin/academic-management/tracks');
    } finally {
      setDataLoading(false);
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
      newErrors.grade = t('tracks.validation.gradeRequired');
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('tracks.validation.nameRequired');
    }

    // Validate code
    if (!formData.code.trim()) {
      newErrors.code = t('tracks.validation.codeRequired');
    } else if (formData.code.length > 20) {
      newErrors.code = t('tracks.validation.codeTooLong');
    }

    // Validate order
    if (!formData.order || formData.order < 1) {
      newErrors.order = t('tracks.validation.orderRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('form.validation.fixErrors'));
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        grade: parseInt(formData.grade),
        order: parseInt(formData.order)
      };

      await apiMethods.put(`/schools/tracks/${id}/`, submitData);
      toast.success(t('tracks.updateSuccess'));
      navigate('/admin/academic-management/tracks');
    } catch (error) {
      console.error('Error updating track:', error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        if (typeof serverErrors === 'object') {
          setErrors(serverErrors);
        }
        toast.error(t('tracks.updateError'));
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
    { label: t('tracks.editTrack'), href: `/admin/academic-management/tracks/${id}/edit` }
  ];

  if (dataLoading) {
    return (
      <AdminPageLayout
        title={t('tracks.editTrack')}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('tracks.editTrack')}
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
                  <span>{t('tracks.basicInformation')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Grade Selection */}
                <div className="space-y-2">
                  <Label htmlFor="grade">{t('tracks.grade')} *</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => handleSelectChange('grade', value)}
                  >
                    <SelectTrigger className={errors.grade ? 'border-destructive' : ''}>
                      <SelectValue placeholder={t('tracks.selectGrade')} />
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
                    <Label htmlFor="name">{t('tracks.name')} (English) *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('tracks.namePlaceholder')}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name_arabic">{t('tracks.name')} (العربية)</Label>
                    <Input
                      id="name_arabic"
                      name="name_arabic"
                      value={formData.name_arabic}
                      onChange={handleInputChange}
                      placeholder={t('tracks.nameArabicPlaceholder')}
                      className={errors.name_arabic ? 'border-destructive' : ''}
                      dir="rtl"
                    />
                    {errors.name_arabic && (
                      <p className="text-sm text-destructive">{errors.name_arabic}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name_french">{t('tracks.name')} (Français)</Label>
                    <Input
                      id="name_french"
                      name="name_french"
                      value={formData.name_french}
                      onChange={handleInputChange}
                      placeholder={t('tracks.nameFrenchPlaceholder')}
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
                    <Label htmlFor="code">{t('tracks.code')} *</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder={t('tracks.codePlaceholder')}
                      className={errors.code ? 'border-destructive' : ''}
                      maxLength={20}
                    />
                    {errors.code && (
                      <p className="text-sm text-destructive">{errors.code}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">{t('tracks.order')} *</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder={t('tracks.orderPlaceholder')}
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
                  <Label htmlFor="is_active">{t('tracks.isActive')}</Label>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{t('tracks.description')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">{t('tracks.description')} (English)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={t('tracks.descriptionPlaceholder')}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_arabic">{t('tracks.description')} (العربية)</Label>
                    <Textarea
                      id="description_arabic"
                      name="description_arabic"
                      value={formData.description_arabic}
                      onChange={handleInputChange}
                      placeholder={t('tracks.descriptionArabicPlaceholder')}
                      rows={3}
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_french">{t('tracks.description')} (Français)</Label>
                    <Textarea
                      id="description_french"
                      name="description_french"
                      value={formData.description_french}
                      onChange={handleInputChange}
                      placeholder={t('tracks.descriptionFrenchPlaceholder')}
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
                  {t('form.validation.fixErrors')}
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
                {loading ? t('common.updating') : t('common.update')}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default EditTrackPage;