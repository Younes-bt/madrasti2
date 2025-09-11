import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Save, ArrowLeft, Loader2 } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditClassPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [grades, setGrades] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [formData, setFormData] = useState({
    grade: '',
    academic_year: '',
    section: ''
  });

  useEffect(() => {
    fetchClassAndFormData();
  }, [id]);

  const fetchClassAndFormData = async () => {
    setInitialLoading(true);
    try {
      const [classResponse, gradesResponse, academicYearsResponse] = await Promise.all([
        apiMethods.get(`schools/classes/${id}/`),
        apiMethods.get('schools/grades/'),
        apiMethods.get('schools/academic-years/')
      ]);

      const classData = classResponse.data || classResponse;
      setFormData({
        grade: classData.grade?.toString() || '',
        academic_year: classData.academic_year?.toString() || '',
        section: classData.section || ''
      });

      let gradesData = gradesResponse.results || (Array.isArray(gradesResponse) ? gradesResponse : gradesResponse.data?.results || gradesResponse.data || []);
      setGrades(gradesData);

      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || []);
      setAcademicYears(academicYearsData);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error(t('error.failedToLoadData'));
      navigate('/admin/academic-management/classes');
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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.grade) newErrors.grade = t('classes.validation.gradeRequired');
    if (!formData.academic_year) newErrors.academic_year = t('classes.validation.academicYearRequired');
    if (!formData.section.trim()) newErrors.section = t('classes.validation.sectionRequired');
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
      const submitData = {
        ...formData,
        grade: parseInt(formData.grade),
        academic_year: parseInt(formData.academic_year),
      };

      await apiMethods.patch(`schools/classes/${id}/`, submitData);
      toast.success(t('classes.updateSuccess'));
      navigate('/admin/academic-management/classes');
    } catch (error) {
      console.error('Failed to update class:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors = {};
        Object.keys(apiErrors).forEach(key => {
          newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(newErrors);
        toast.error(t('classes.updateError'));
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
        onClick={() => navigate('/admin/academic-management/classes')}
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
        title={t('classes.editClass')}
        subtitle={t('classes.editClassSubtitle')}
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
      title={t('classes.editClass')}
      subtitle={t('classes.editClassSubtitle')}
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
                <Building className="h-5 w-5 text-blue-600" />
                {t('classes.classInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="grade">{t('classes.grade')} *</Label>
                  <Select 
                    value={formData.grade} 
                    onValueChange={(value) => handleSelectChange('grade', value)}
                  >
                    <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('classes.selectGrade')} />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && <p className="text-sm text-red-600">{errors.grade}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academic_year">{t('classes.academicYear')} *</Label>
                  <Select 
                    value={formData.academic_year} 
                    onValueChange={(value) => handleSelectChange('academic_year', value)}
                  >
                    <SelectTrigger className={errors.academic_year ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('classes.selectAcademicYear')} />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.id.toString()}>
                          {year.year}{year.is_current ? ` (${t('academicYears.current')})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.academic_year && <p className="text-sm text-red-600">{errors.academic_year}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">{t('classes.section')} *</Label>
                  <Input
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder={t('classes.sectionPlaceholder')}
                    className={errors.section ? 'border-red-500' : ''}
                  />
                  {errors.section && <p className="text-sm text-red-600">{errors.section}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/academic-management/classes')}>
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" />{t('classes.updateClass')}</>
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

export default EditClassPage;
