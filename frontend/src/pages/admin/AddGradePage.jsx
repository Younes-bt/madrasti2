import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hash, Save, ArrowLeft, AlertCircle, BookOpen, Target, GraduationCap, Star, Layers } from 'lucide-react';
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

const AddGradePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [educationalLevels, setEducationalLevels] = useState([]);

  const [formData, setFormData] = useState({
    educational_level: '',
    grade_number: '',
    name: '',
    name_arabic: '',
    name_french: '',
    passing_grade: '10.00'
  });

  useEffect(() => {
    fetchEducationalLevels();
  }, []);

  const fetchEducationalLevels = async () => {
    try {
      const response = await apiMethods.get('schools/levels/');
      let levelsData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      setEducationalLevels(levelsData);
    } catch (error) {
      console.error('Failed to fetch educational levels:', error);
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

  const validateForm = () => {
    const newErrors = {};

    // Validate educational level
    if (!formData.educational_level) {
      newErrors.educational_level = t('grades.validation.educationalLevelRequired');
    }

    // Validate grade number
    if (!formData.grade_number || formData.grade_number < 1) {
      newErrors.grade_number = t('grades.validation.gradeNumberRequired');
    }

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('grades.validation.nameRequired');
    }

    // Validate passing grade
    if (!formData.passing_grade || parseFloat(formData.passing_grade) < 0 || parseFloat(formData.passing_grade) > 20) {
      newErrors.passing_grade = t('grades.validation.passingGradeInvalid');
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
      // Convert numeric fields to proper types
      const submitData = {
        ...formData,
        educational_level: parseInt(formData.educational_level),
        grade_number: parseInt(formData.grade_number),
        passing_grade: parseFloat(formData.passing_grade)
      };

      await apiMethods.post('schools/grades/', submitData);
      toast.success(t('grades.createSuccess'));
      navigate('/admin/academic-management/grades');
    } catch (error) {
      console.error('Failed to create grade:', error);
      
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors = {};
        
        Object.keys(apiErrors).forEach(key => {
          if (Array.isArray(apiErrors[key])) {
            newErrors[key] = apiErrors[key][0];
          } else {
            newErrors[key] = apiErrors[key];
          }
        });
        
        setErrors(newErrors);
        toast.error(t('grades.createError'));
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
        onClick={() => navigate('/admin/academic-management/grades')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title={t('grades.addGrade')}
      subtitle={t('grades.addGradeSubtitle')}
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
                <Hash className="h-5 w-5 text-blue-600" />
                {t('grades.gradeInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Educational Level Selection */}
                <div className="space-y-2">
                  <Label htmlFor="educational_level" className="text-sm font-medium">
                    {t('grades.educationalLevel')} <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.educational_level} 
                    onValueChange={(value) => handleSelectChange('educational_level', value)}
                  >
                    <SelectTrigger className={errors.educational_level ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('grades.selectEducationalLevel')} />
                    </SelectTrigger>
                    <SelectContent>
                      {educationalLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{level.name}</span>
                            {level.name_arabic && <span className="text-muted-foreground">({level.name_arabic})</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.educational_level && (
                    <p className="text-sm text-red-600">{errors.educational_level}</p>
                  )}
                </div>

                {/* Grade Number */}
                <div className="space-y-2">
                  <Label htmlFor="grade_number" className="text-sm font-medium">
                    {t('grades.gradeNumber')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="grade_number"
                    name="grade_number"
                    type="number"
                    min="1"
                    value={formData.grade_number}
                    onChange={handleInputChange}
                    placeholder={t('grades.gradeNumberPlaceholder')}
                    className={errors.grade_number ? 'border-red-500' : ''}
                  />
                  {errors.grade_number && (
                    <p className="text-sm text-red-600">{errors.grade_number}</p>
                  )}
                </div>

                {/* Grade Name in English */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t('grades.nameEnglish')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('grades.nameEnglishPlaceholder')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Grade Name in Arabic */}
                <div className="space-y-2">
                  <Label htmlFor="name_arabic" className="text-sm font-medium">
                    {t('grades.nameArabic')}
                  </Label>
                  <Input
                    id="name_arabic"
                    name="name_arabic"
                    value={formData.name_arabic}
                    onChange={handleInputChange}
                    placeholder={t('grades.nameArabicPlaceholder')}
                    className={errors.name_arabic ? 'border-red-500' : ''}
                    dir="rtl"
                  />
                  {errors.name_arabic && (
                    <p className="text-sm text-red-600">{errors.name_arabic}</p>
                  )}
                </div>

                {/* Grade Name in French */}
                <div className="space-y-2">
                  <Label htmlFor="name_french" className="text-sm font-medium">
                    {t('grades.nameFrench')}
                  </Label>
                  <Input
                    id="name_french"
                    name="name_french"
                    value={formData.name_french}
                    onChange={handleInputChange}
                    placeholder={t('grades.nameFrenchPlaceholder')}
                    className={errors.name_french ? 'border-red-500' : ''}
                  />
                  {errors.name_french && (
                    <p className="text-sm text-red-600">{errors.name_french}</p>
                  )}
                </div>

                {/* Passing Grade */}
                <div className="space-y-2">
                  <Label htmlFor="passing_grade" className="text-sm font-medium">
                    {t('grades.passingGrade')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="passing_grade"
                    name="passing_grade"
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={formData.passing_grade}
                    onChange={handleInputChange}
                    placeholder="10.00"
                    className={errors.passing_grade ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('grades.passingGradeHelp')}
                  </p>
                  {errors.passing_grade && (
                    <p className="text-sm text-red-600">{errors.passing_grade}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/academic-management/grades')}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('common.saving')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {t('grades.createGrade')}
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

export default AddGradePage;