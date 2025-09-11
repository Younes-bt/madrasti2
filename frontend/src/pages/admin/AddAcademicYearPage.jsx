import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Save, ArrowLeft, AlertCircle, Star, Clock } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AddAcademicYearPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    year: '',
    start_date: '',
    end_date: '',
    is_current: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate year format
    if (!formData.year.trim()) {
      newErrors.year = t('academicYears.validation.yearRequired');
    } else {
      const yearPattern = /^\d{4}-\d{4}$/;
      if (!yearPattern.test(formData.year)) {
        newErrors.year = t('academicYears.validation.yearFormat');
      } else {
        // Validate that years are consecutive
        const [startYear, endYear] = formData.year.split('-').map(y => parseInt(y));
        if (endYear !== startYear + 1) {
          newErrors.year = t('academicYears.validation.invalidYearRange');
        }
      }
    }

    // Validate start date
    if (!formData.start_date) {
      newErrors.start_date = t('academicYears.validation.startDateRequired');
    }

    // Validate end date
    if (!formData.end_date) {
      newErrors.end_date = t('academicYears.validation.endDateRequired');
    }

    // Validate date range
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        newErrors.end_date = t('academicYears.validation.endDateAfterStart');
      }
    }

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
      await apiMethods.post('schools/academic-years/', formData);
      toast.success(t('academicYears.createdSuccessfully'));
      navigate('/admin/academic-management/academic-years');
    } catch (error) {
      console.error('Failed to create academic year:', error);
      if (error.response?.data) {
        // Handle server validation errors
        const serverErrors = {};
        Object.keys(error.response.data).forEach(key => {
          if (Array.isArray(error.response.data[key])) {
            serverErrors[key] = error.response.data[key][0];
          } else {
            serverErrors[key] = error.response.data[key];
          }
        });
        setErrors(serverErrors);
        toast.error(t('validation.serverValidationError'));
      } else {
        toast.error(t('error.failedToSave'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/academic-management/academic-years');
  };

  const generateYearSuggestion = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };

  const actions = [
    <Button key="cancel" variant="outline" onClick={handleCancel}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      {t('common.cancel')}
    </Button>,
    <Button 
      key="save" 
      onClick={handleSubmit} 
      disabled={loading}
      className="bg-primary text-primary-foreground"
    >
      <Save className="h-4 w-4 mr-2" />
      {loading ? t('common.saving') : t('common.save')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('academicYears.addAcademicYear')}
      subtitle={t('academicYears.subtitle')}
      actions={actions}
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
                <Calendar className="h-5 w-5" />
                {t('academicYears.yearDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Year Format */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('academicYears.yearFormat')} *
                  </Label>
                  <Input
                    id="year"
                    name="year"
                    type="text"
                    placeholder={generateYearSuggestion()}
                    value={formData.year}
                    onChange={handleInputChange}
                    className={errors.year ? 'border-destructive' : ''}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('academicYears.yearFormatHelp')}
                  </p>
                  {errors.year && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.year}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('academicYears.startDate')} *
                  </Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className={errors.start_date ? 'border-destructive' : ''}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('academicYears.startDateHelp')}
                  </p>
                  {errors.start_date && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.start_date}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="end_date" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('academicYears.endDate')} *
                  </Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className={errors.end_date ? 'border-destructive' : ''}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('academicYears.endDateHelp')}
                  </p>
                  {errors.end_date && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.end_date}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Current Year Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_current"
                      name="is_current"
                      checked={formData.is_current}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, is_current: checked }))
                      }
                    />
                    <Label htmlFor="is_current" className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {t('academicYears.isCurrentLabel')}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {t('academicYears.currentYearHelp')}
                  </p>
                  {errors.is_current && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.is_current}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Duration Preview */}
                {formData.start_date && formData.end_date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{t('academicYears.duration')}:</span>
                      <span>
                        {Math.ceil((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24))} {t('academicYears.durationInDays')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminPageLayout>
  );
};

export default AddAcademicYearPage;