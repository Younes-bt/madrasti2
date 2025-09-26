import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Save, ArrowLeft, AlertCircle, Hash, Layers, Calendar } from 'lucide-react';
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

// Utility function to get multilingual name based on current language
const getMultilingualName = (item, language) => {
  if (!item) return '';

  switch (language) {
    case 'ar':
      return item.name_arabic || item.name || '';
    case 'fr':
      return item.name_french || item.name || '';
    case 'en':
    default:
      return item.name || '';
  }
};

const AddClassPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [grades, setGrades] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);

  const [formData, setFormData] = useState({
    grade: '',
    track: 'none', // Optional track field - 'none' means no track
    academic_year: '',
    section: ''
  });

  useEffect(() => {
    fetchFormData();
  }, []);

  // Filter tracks when grade changes
  useEffect(() => {
    if (formData.grade && tracks.length > 0) {
      const filtered = tracks.filter(track => track.grade?.toString() === formData.grade.toString());
      setFilteredTracks(filtered);

      // Reset track if current selection is no longer valid
      if (formData.track && formData.track !== 'none' && !filtered.some(track => track.id.toString() === formData.track.toString())) {
        setFormData(prev => ({ ...prev, track: 'none' }));
      }
    } else {
      setFilteredTracks([]);
      setFormData(prev => ({ ...prev, track: 'none' }));
    }
  }, [formData.grade, tracks]);

  const fetchFormData = async () => {
    try {
      const [gradesResponse, academicYearsResponse, tracksResponse] = await Promise.all([
        apiMethods.get('schools/grades/'),
        apiMethods.get('schools/academic-years/'),
        apiMethods.get('schools/tracks/')
      ]);
      let gradesData = gradesResponse.results || (Array.isArray(gradesResponse) ? gradesResponse : gradesResponse.data?.results || gradesResponse.data || []);
      setGrades(gradesData);

      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || []);
      setAcademicYears(academicYearsData);

      let tracksData = tracksResponse.results || (Array.isArray(tracksResponse) ? tracksResponse : tracksResponse.data?.results || tracksResponse.data || []);
      setTracks(tracksData);

      // Set default academic year to current one if available
      const currentYear = academicYearsData.find(y => y.is_current);
      if (currentYear) {
        setFormData(prev => ({ ...prev, academic_year: currentYear.id.toString() }));
      }

    } catch (error) {
      console.error('Failed to fetch form data:', error);
      toast.error(t('error.failedToLoadData'));
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
        track: formData.track && formData.track !== 'none' ? parseInt(formData.track) : null
      };

      // Debug: Log what we're sending
      console.log('=== CLASS CREATION DEBUG ===');
      console.log('Form Data:', formData);
      console.log('Submit Data:', submitData);
      console.log('Academic Years Available:', academicYears);
      console.log('Filtered Tracks:', filteredTracks);
      console.log('Selected Track Details:', filteredTracks.find(t => t.id.toString() === formData.track?.toString()));

      // Validate required fields before sending
      if (!submitData.academic_year || isNaN(submitData.academic_year)) {
        console.error('❌ VALIDATION ERROR: academic_year is missing or invalid:', submitData.academic_year);
        toast.error('Academic Year is required and must be valid');
        return;
      }

      if (!submitData.grade || isNaN(submitData.grade)) {
        console.error('❌ VALIDATION ERROR: grade is missing or invalid:', submitData.grade);
        toast.error('Grade is required and must be valid');
        return;
      }

      console.log('✅ All required fields validated successfully');
      console.log('============================');

      await apiMethods.post('schools/classes/', submitData);
      toast.success(t('classes.createSuccess'));
      navigate('/admin/academic-management/classes');
    } catch (error) {
      console.error('Failed to create class:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors = {};

        // Check for duplicate class error (IntegrityError)
        if (error.response.status === 500 &&
            (apiErrors.detail?.includes('IntegrityError') ||
             apiErrors.message?.includes('UNIQUE constraint') ||
             JSON.stringify(apiErrors).includes('unique_together'))) {
          toast.error(t('classes.duplicateError') || 'A class with this grade, track, section, and academic year already exists.');
          return;
        }

        Object.keys(apiErrors).forEach(key => {
          newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(newErrors);
        toast.error(t('classes.createError'));
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

  return (
    <AdminPageLayout
      title={t('classes.addClass')}
      subtitle={t('classes.addClassSubtitle')}
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
                  <Label htmlFor="grade" className="text-sm font-medium">
                    {t('classes.grade')} <span className="text-red-500">*</span>
                  </Label>
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
                          {getMultilingualName(grade, currentLanguage)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && (
                    <p className="text-sm text-red-600">{errors.grade}</p>
                  )}
                </div>

                {/* Track Selection */}
                {filteredTracks.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="track" className="text-sm font-medium">
                      {t('classes.track') || 'Track / Specialization'}
                    </Label>
                    <Select
                      value={formData.track || ""}
                      onValueChange={(value) => handleSelectChange('track', value)}
                    >
                      <SelectTrigger className={errors.track ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('classes.selectTrack') || 'Select track (optional)'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          {t('classes.noTrack') || 'No specific track'}
                        </SelectItem>
                        {filteredTracks.map((track) => (
                          <SelectItem key={track.id} value={track.id.toString()}>
                            {getMultilingualName(track, currentLanguage)} {track.code && `(${track.code})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.track && (
                      <p className="text-sm text-red-600">{errors.track}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t('classes.trackHint') || 'Select a track for specialized programs (optional)'}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="academic_year" className="text-sm font-medium">
                    {t('classes.academicYear')} <span className="text-red-500">*</span>
                  </Label>
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
                  {errors.academic_year && (
                    <p className="text-sm text-red-600">{errors.academic_year}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section" className="text-sm font-medium">
                    {t('classes.section')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder={t('classes.sectionPlaceholder')}
                    className={errors.section ? 'border-red-500' : ''}
                  />
                  {errors.section && (
                    <p className="text-sm text-red-600">{errors.section}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/academic-management/classes')}
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
                        {t('classes.createClass')}
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

export default AddClassPage;
