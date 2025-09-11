import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Save, ArrowLeft, AlertCircle, BookOpen, Target, GraduationCap, Star } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditEducationalLevelPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { levelId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    level: '',
    name: '',
    name_arabic: '',
    name_french: '',
    order: ''
  });

  const levelChoices = [
    { value: 'PRESCHOOL', label: t('educationalLevels.levelTypes.preschool'), icon: Target },
    { value: 'PRIMARY', label: t('educationalLevels.levelTypes.primary'), icon: BookOpen },
    { value: 'LOWER_SECONDARY', label: t('educationalLevels.levelTypes.lowerSecondary'), icon: GraduationCap },
    { value: 'UPPER_SECONDARY', label: t('educationalLevels.levelTypes.upperSecondary'), icon: Star }
  ];

  // Fetch educational level data
  const fetchLevelData = async () => {
    setInitialLoading(true);
    try {
      const response = await apiMethods.get(`schools/levels/${levelId}/`);
      const levelData = response.data || response;
      
      setFormData({
        level: levelData.level || '',
        name: levelData.name || '',
        name_arabic: levelData.name_arabic || '',
        name_french: levelData.name_french || '',
        order: levelData.order?.toString() || ''
      });
    } catch (error) {
      console.error('Failed to fetch educational level data:', error);
      toast.error(t('error.failedToLoadData'));
      navigate('/admin/academic-management/educational-levels');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (levelId) {
      fetchLevelData();
    }
  }, [levelId]);

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

  const validateForm = () => {
    const newErrors = {};

    // Validate level
    if (!formData.level) {
      newErrors.level = t('educationalLevels.validation.levelRequired');
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('educationalLevels.validation.nameRequired');
    }

    // Validate order
    if (!formData.order || formData.order < 1) {
      newErrors.order = t('educationalLevels.validation.orderRequired');
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
      // Convert order to integer
      const submitData = {
        ...formData,
        order: parseInt(formData.order)
      };
      
      await apiMethods.patch(`schools/levels/${levelId}/`, submitData);
      toast.success(t('educationalLevels.updatedSuccessfully'));
      navigate('/admin/academic-management/educational-levels');
    } catch (error) {
      console.error('Failed to update educational level:', error);
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
        toast.error(t('error.failedToUpdate'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/academic-management/educational-levels');
  };

  const getLevelIcon = (levelType) => {
    const choice = levelChoices.find(c => c.value === levelType);
    return choice ? choice.icon : Layers;
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
      {loading ? t('common.updating') : t('common.update')}
    </Button>
  ];

  const selectedLevelIcon = formData.level ? getLevelIcon(formData.level) : Layers;
  const SelectedIcon = selectedLevelIcon;

  if (initialLoading) {
    return (
      <AdminPageLayout
        title={t('educationalLevels.editEducationalLevel')}
        subtitle={t('educationalLevels.subtitle')}
        actions={actions}
        loading={initialLoading}
      />
    );
  }

  return (
    <AdminPageLayout
      title={t('educationalLevels.editEducationalLevel')}
      subtitle={t('educationalLevels.subtitle')}
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
                <SelectedIcon className="h-5 w-5" />
                {t('educationalLevels.levelDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Level Type */}
                <div className="space-y-2">
                  <Label htmlFor="level" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    {t('educationalLevels.levelType')} *
                  </Label>
                  <Select 
                    value={formData.level} 
                    onValueChange={(value) => handleSelectChange('level', value)}
                  >
                    <SelectTrigger className={errors.level ? 'border-destructive' : ''}>
                      <SelectValue placeholder={t('educationalLevels.selectLevelType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {levelChoices.map((choice) => {
                        const IconComponent = choice.icon;
                        return (
                          <SelectItem key={choice.value} value={choice.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {choice.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {t('educationalLevels.levelTypeHelp')}
                  </p>
                  {errors.level && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.level}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Name (English) */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t('educationalLevels.nameEnglish')} *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t('educationalLevels.nameEnglishPlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('educationalLevels.nameEnglishHelp')}
                  </p>
                  {errors.name && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.name}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Name (Arabic) */}
                <div className="space-y-2">
                  <Label htmlFor="name_arabic" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t('educationalLevels.nameArabic')}
                  </Label>
                  <Input
                    id="name_arabic"
                    name="name_arabic"
                    type="text"
                    placeholder={t('educationalLevels.nameArabicPlaceholder')}
                    value={formData.name_arabic}
                    onChange={handleInputChange}
                    className={errors.name_arabic ? 'border-destructive' : ''}
                    dir="rtl"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('educationalLevels.nameArabicHelp')}
                  </p>
                  {errors.name_arabic && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.name_arabic}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Name (French) */}
                <div className="space-y-2">
                  <Label htmlFor="name_french" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t('educationalLevels.nameFrench')}
                  </Label>
                  <Input
                    id="name_french"
                    name="name_french"
                    type="text"
                    placeholder={t('educationalLevels.nameFrenchPlaceholder')}
                    value={formData.name_french}
                    onChange={handleInputChange}
                    className={errors.name_french ? 'border-destructive' : ''}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('educationalLevels.nameFrenchHelp')}
                  </p>
                  {errors.name_french && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.name_french}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Order */}
                <div className="space-y-2">
                  <Label htmlFor="order" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    {t('educationalLevels.order')} *
                  </Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.order}
                    onChange={handleInputChange}
                    className={errors.order ? 'border-destructive' : ''}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t('educationalLevels.orderHelp')}
                  </p>
                  {errors.order && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.order}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Level Preview */}
                {formData.level && formData.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                        <SelectedIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{formData.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {levelChoices.find(c => c.value === formData.level)?.label}
                          {formData.order && ` • ${t('educationalLevels.order')}: ${formData.order}`}
                        </div>
                        {formData.name_arabic && (
                          <div className="text-sm text-muted-foreground" dir="rtl">
                            {formData.name_arabic}
                          </div>
                        )}
                        {formData.name_french && (
                          <div className="text-sm text-muted-foreground">
                            {formData.name_french}
                          </div>
                        )}
                      </div>
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

export default EditEducationalLevelPage;