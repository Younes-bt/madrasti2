import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Calendar, FileText, Camera, DollarSign, Briefcase, Globe, BookOpen, GraduationCap } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditTeacherPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    school_subject: '',
    teachable_grades: [],
    phone: '',
    date_of_birth: '',
    address: '',
    bio: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    department: '',
    hire_date: '',
    salary: '',
    linkedin_url: '',
    twitter_url: ''
  });

  const [originalEmail, setOriginalEmail] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch teacher data
  const fetchTeacherData = async () => {
    setInitialLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${teacherId}/`);
      
      let teacherData = response.data || response;
      
      // Set form data from user and profile
      // Handle school_subject which can be either an ID or an object with an id property
      let subjectId = '';
      const subjectValue = teacherData.school_subject || teacherData.profile?.school_subject;
      if (subjectValue) {
        if (typeof subjectValue === 'object' && subjectValue.id) {
          subjectId = subjectValue.id.toString();
        } else if (typeof subjectValue === 'number' || typeof subjectValue === 'string') {
          subjectId = subjectValue.toString();
        }
      }

      setFormData({
        first_name: teacherData.first_name || '',
        last_name: teacherData.last_name || '',
        ar_first_name: teacherData.ar_first_name || teacherData.profile?.ar_first_name || '',
        ar_last_name: teacherData.ar_last_name || teacherData.profile?.ar_last_name || '',
        school_subject: subjectId,
        teachable_grades: teacherData.teachable_grades?.map(grade => grade.id) || teacherData.profile?.teachable_grades?.map(grade => grade.id) || [],
        phone: teacherData.phone || teacherData.profile?.phone || '',
        date_of_birth: teacherData.date_of_birth || teacherData.profile?.date_of_birth || '',
        address: teacherData.address || teacherData.profile?.address || '',
        bio: teacherData.bio || teacherData.profile?.bio || '',
        emergency_contact_name: teacherData.emergency_contact_name || teacherData.profile?.emergency_contact_name || '',
        emergency_contact_phone: teacherData.emergency_contact_phone || teacherData.profile?.emergency_contact_phone || '',
        hire_date: teacherData.hire_date || teacherData.profile?.hire_date || '',
        salary: teacherData.salary || teacherData.profile?.salary || '',
        linkedin_url: teacherData.linkedin_url || teacherData.profile?.linkedin_url || '',
        twitter_url: teacherData.twitter_url || teacherData.profile?.twitter_url || ''
      });
      
      setOriginalEmail(teacherData.email || '');
      setProfilePictureUrl(teacherData.profile_picture_url || teacherData.profile?.profile_picture_url || '');
      
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
      toast.error(t('error.failedToLoadTeacherData'));
      navigate('/admin/school-management/teachers');
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const response = await apiMethods.get('schools/subjects/');
      const responseData = response.data || response;
      // Handle paginated response - extract results array if it exists
      const subjectsData = responseData.results || responseData;
      // Ensure we have an array
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      setSubjects([]); // Set empty array on error
      toast.error(t('error.failedToLoadSubjects'));
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Fetch grades
  const fetchGrades = async () => {
    setLoadingGrades(true);
    try {
      const response = await apiMethods.get('schools/grades/');
      const responseData = response.data || response;
      // Handle paginated response - extract results array if it exists
      const gradesData = responseData.results || responseData;
      // Ensure we have an array
      setGrades(Array.isArray(gradesData) ? gradesData : []);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
      setGrades([]); // Set empty array on error
      toast.error(t('error.failedToLoadGrades'));
    } finally {
      setLoadingGrades(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchGrades();
  }, [t]);

  useEffect(() => {
    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleGradeToggle = (gradeId) => {
    setFormData(prev => ({
      ...prev,
      teachable_grades: prev.teachable_grades.includes(gradeId)
        ? prev.teachable_grades.filter(id => id !== gradeId)
        : [...prev.teachable_grades, gradeId]
    }));
  };

  // Helper function to get localized grade name
  const getLocalizedGradeName = (grade) => {
    const currentLanguage = i18n.language;

    switch (currentLanguage) {
      case 'ar':
        return grade.name_arabic || grade.name;
      case 'fr':
        return grade.name_french || grade.name;
      default:
        return grade.name;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.first_name) {
      newErrors.first_name = t('validation.firstNameRequired');
    }

    if (!formData.last_name) {
      newErrors.last_name = t('validation.lastNameRequired');
    }

    if (!formData.ar_first_name) {
      newErrors.ar_first_name = t('validation.arabicFirstNameRequired');
    }

    if (!formData.ar_last_name) {
      newErrors.ar_last_name = t('validation.arabicLastNameRequired');
    }


    // Phone validation (if provided)
    if (formData.phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    // Date of birth validation (if provided)
    if (formData.date_of_birth && new Date(formData.date_of_birth) > new Date()) {
      newErrors.date_of_birth = t('validation.dateOfBirthInvalid');
    }

    // Note: Hire date can be in the future (for pre-registered teachers)
    // No validation needed for hire_date

    // Salary validation (if provided)
    if (formData.salary && (isNaN(formData.salary) || parseFloat(formData.salary) < 0)) {
      newErrors.salary = t('validation.salaryInvalid');
    }

    // URL validations (if provided)
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (formData.linkedin_url && !urlPattern.test(formData.linkedin_url)) {
      newErrors.linkedin_url = t('validation.urlInvalid');
    }
    if (formData.twitter_url && !urlPattern.test(formData.twitter_url)) {
      newErrors.twitter_url = t('validation.urlInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('error.pleaseFixErrors'));
      return;
    }

    setLoading(true);

    try {
      // Prepare form data for multipart/form-data if profile picture is uploaded
      const formDataToSend = new FormData();
      
      // User data
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      
      // Profile data
      formDataToSend.append('ar_first_name', formData.ar_first_name || '');
      formDataToSend.append('ar_last_name', formData.ar_last_name || '');
      formDataToSend.append('school_subject', formData.school_subject || '');

      // Handle teachable_grades array - append each grade ID individually
      if (formData.teachable_grades && formData.teachable_grades.length > 0) {
        formData.teachable_grades.forEach(gradeId => {
          formDataToSend.append('teachable_grades', gradeId);
        });
      }

      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('date_of_birth', formData.date_of_birth || '');
      formDataToSend.append('address', formData.address || '');
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('emergency_contact_name', formData.emergency_contact_name || '');
      formDataToSend.append('emergency_contact_phone', formData.emergency_contact_phone || '');
      formDataToSend.append('hire_date', formData.hire_date || '');
      formDataToSend.append('salary', formData.salary || '');
      formDataToSend.append('linkedin_url', formData.linkedin_url || '');
      formDataToSend.append('twitter_url', formData.twitter_url || '');
      
      // Add profile picture if uploaded
      if (profilePictureFile) {
        formDataToSend.append('profile_picture', profilePictureFile);
      }

      await apiMethods.patch(`users/users/${teacherId}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(t('teacher.updateSuccess', { 
        name: `${formData.first_name} ${formData.last_name}`
      }));
      
      // Navigate back to teachers management page
      navigate('/admin/school-management/teachers');

    } catch (error) {
      console.error('Failed to update teacher:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        console.error('Backend validation errors:', errorData);
        
        if (typeof errorData === 'object') {
          // Handle field-specific errors
          const newErrors = {};
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              newErrors[field] = errorData[field][0];
            } else {
              newErrors[field] = errorData[field];
            }
          });
          setErrors(newErrors);
          console.error('Parsed form errors:', newErrors);
        }
        toast.error(errorData.error || errorData.detail || t('error.updateTeacherFailed'));
      } else {
        toast.error(t('error.updateTeacherFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('validation.invalidImageType'));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('validation.fileTooLarge'));
        return;
      }
      
      setProfilePictureFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePictureUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate('/admin/school-management/teachers');
  };

  const actions = [
    <Button
      key="cancel"
      variant="outline"
      onClick={handleCancel}
      disabled={loading || initialLoading}
      className="gap-2"
    >
      <X className="h-4 w-4" />
      {t('common.cancel')}
    </Button>,
    <Button
      key="save"
      onClick={handleSubmit}
      disabled={loading || initialLoading}
      className="gap-2"
    >
      <Save className="h-4 w-4" />
      {loading ? t('common.updating') : t('common.update')}
    </Button>
  ];

  if (initialLoading) {
    return (
      <AdminPageLayout
        title={t('teacher.editTeacher')}
        subtitle={t('teacher.editTeacherDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/teachers"
        loading={true}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('teacher.editTeacher')}
      subtitle={t('teacher.editTeacherDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/teachers"
      actions={actions}
      loading={loading}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('teacher.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="required">
                  {t('common.firstName')}
                </Label>
                <Input
                  id="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder={t('teacher.placeholders.firstName')}
                  className={errors.first_name ? 'border-destructive' : ''}
                  disabled={loading}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="required">
                  {t('common.lastName')}
                </Label>
                <Input
                  id="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder={t('teacher.placeholders.lastName')}
                  className={errors.last_name ? 'border-destructive' : ''}
                  disabled={loading}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ar_first_name" className="required">
                  {t('common.arabicFirstName')}
                </Label>
                <Input
                  id="ar_first_name"
                  type="text"
                  value={formData.ar_first_name}
                  onChange={(e) => handleInputChange('ar_first_name', e.target.value)}
                  placeholder={t('teacher.placeholders.arabicFirstName')}
                  className={errors.ar_first_name ? 'border-destructive' : ''}
                  disabled={loading}
                  dir="rtl"
                />
                {errors.ar_first_name && (
                  <p className="text-sm text-destructive">{errors.ar_first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ar_last_name" className="required">
                  {t('common.arabicLastName')}
                </Label>
                <Input
                  id="ar_last_name"
                  type="text"
                  value={formData.ar_last_name}
                  onChange={(e) => handleInputChange('ar_last_name', e.target.value)}
                  placeholder={t('teacher.placeholders.arabicLastName')}
                  className={errors.ar_last_name ? 'border-destructive' : ''}
                  disabled={loading}
                  dir="rtl"
                />
                {errors.ar_last_name && (
                  <p className="text-sm text-destructive">{errors.ar_last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_subject">
                  {t('teacher.schoolSubject')}
                </Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select
                    value={formData.school_subject}
                    onValueChange={(value) => handleInputChange('school_subject', value)}
                    disabled={loading || loadingSubjects}
                  >
                    <SelectTrigger className={`pl-9 ${errors.school_subject ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder={loadingSubjects ? t('common.loading') : t('teacher.placeholders.selectSubject')} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects && subjects.length > 0 ? (
                        subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-subjects" disabled>
                          {t('teacher.noSubjectsAvailable')}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {errors.school_subject && (
                  <p className="text-sm text-destructive">{errors.school_subject}</p>
                )}
                <p className="text-xs text-muted-foreground">{t('teacher.subjectSelectionInfo')}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>
                  {t('teacher.teachableGrades')}
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <div className="border border-border/50 rounded-md p-3 pl-10 bg-muted/50 min-h-[80px] max-h-[120px] overflow-y-auto">
                    {loadingGrades ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2 text-sm text-muted-foreground">{t('common.loading')}</span>
                      </div>
                    ) : grades && grades.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {grades.map((grade) => (
                          <div key={grade.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`grade-${grade.id}`}
                              checked={formData.teachable_grades.includes(grade.id)}
                              onCheckedChange={() => handleGradeToggle(grade.id)}
                              disabled={loading}
                            />
                            <Label
                              htmlFor={`grade-${grade.id}`}
                              className="text-sm font-normal cursor-pointer text-foreground"
                            >
                              {getLocalizedGradeName(grade)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        {t('teacher.noGradesAvailable')}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t('teacher.teachableGradesInfo')}</p>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('common.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={originalEmail}
                    className="pl-9 bg-muted/50"
                    disabled
                    placeholder={t('teacher.emailCannotBeChanged')}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('teacher.emailChangeInfo')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t('common.phone')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={t('teacher.placeholders.phone')}
                    className={`pl-9 ${errors.phone ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">
                  {t('common.dateOfBirth')}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className={`pl-9 ${errors.date_of_birth ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-sm text-destructive">{errors.date_of_birth}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Picture */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t('teacher.profilePicture')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="profile_picture" className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
                      <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {profilePictureUrl ? t('teacher.changePhoto') : t('teacher.uploadPhoto')}
                      </span>
                    </div>
                  </Label>
                  <input
                    id="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    disabled={loading}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('teacher.photoRequirements')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {t('teacher.professionalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hire_date">
                  {t('teacher.hireDate')}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => handleInputChange('hire_date', e.target.value)}
                    className={`pl-9 ${errors.hire_date ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.hire_date && (
                  <p className="text-sm text-destructive">{errors.hire_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">
                  {t('teacher.salary')}
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder={t('teacher.placeholders.salary')}
                    className={`pl-9 ${errors.salary ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.salary && (
                  <p className="text-sm text-destructive">{errors.salary}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('teacher.socialMediaLinks')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">
                  {t('teacher.linkedinUrl')}
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder={t('teacher.placeholders.linkedinUrl')}
                    className={`pl-9 ${errors.linkedin_url ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.linkedin_url && (
                  <p className="text-sm text-destructive">{errors.linkedin_url}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_url">
                  {t('teacher.twitterUrl')}
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    placeholder={t('teacher.placeholders.twitterUrl')}
                    className={`pl-9 ${errors.twitter_url ? 'border-destructive' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.twitter_url && (
                  <p className="text-sm text-destructive">{errors.twitter_url}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('teacher.additionalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">
                  {t('common.address')}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={t('teacher.placeholders.address')}
                    className="pl-9 min-h-[80px]"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {t('common.bio')}
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder={t('teacher.placeholders.bio')}
                  className="min-h-[100px]"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">
                    {t('teacher.emergencyContactName')}
                  </Label>
                  <Input
                    id="emergency_contact_name"
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                    placeholder={t('teacher.placeholders.emergencyContactName')}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">
                    {t('teacher.emergencyContactPhone')}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      placeholder={t('teacher.placeholders.emergencyContactPhone')}
                      className="pl-9"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminPageLayout>
  );
};

export default EditTeacherPage;