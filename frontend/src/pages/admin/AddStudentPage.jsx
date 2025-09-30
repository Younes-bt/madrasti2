import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Calendar, FileText, GraduationCap, Users } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AddStudentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    student_id: '',
    educational_level_id: '',
    grade_id: '',
    school_class_id: '',
    academic_year_id: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    student_number: '',
    phone: '',
    date_of_birth: '',
    address: '',
    bio: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    parent_name: '',
    parent_first_name: '',
    parent_last_name: '',
    parent_phone: ''
  });

  const [schoolName, setSchoolName] = useState('madrasti'); // Will be fetched from school config
  
  // Enrollment data
  const [educationalLevels, setEducationalLevels] = useState([]);
  const [grades, setGrades] = useState([]);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState(null);

  const [errors, setErrors] = useState({});

  // Fetch enrollment data on component mount
  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        const [levelsResponse, academicYearsResponse] = await Promise.all([
          apiMethods.get('schools/levels/'),
          apiMethods.get('schools/academic-years/')
        ]);
        
        console.log('Levels response:', levelsResponse);
        console.log('Academic years response:', academicYearsResponse);
        console.log('Levels response type:', typeof levelsResponse, 'Is Array:', Array.isArray(levelsResponse));
        console.log('Academic years response type:', typeof academicYearsResponse, 'Is Array:', Array.isArray(academicYearsResponse));
        console.log('Levels response keys:', Object.keys(levelsResponse || {}));
        console.log('Academic years response keys:', Object.keys(academicYearsResponse || {}));
        
        // Extract data from paginated DRF response (results property)
        const levelsData = levelsResponse?.results || [];
        const academicYearsData = academicYearsResponse?.results || [];
        
        console.log('Processed levelsData:', levelsData);
        console.log('Processed academicYearsData:', academicYearsData);
        console.log('levelsData isArray:', Array.isArray(levelsData));
        console.log('academicYearsData isArray:', Array.isArray(academicYearsData));
        
        setEducationalLevels(levelsData);
        setAcademicYears(academicYearsData);
        
        // Set current academic year - ensure we have an array first
        if (academicYearsData.length > 0) {
          const currentYear = academicYearsData.find(year => year.is_current);
          if (currentYear) {
            setCurrentAcademicYear(currentYear);
            setFormData(prev => ({ ...prev, academic_year_id: currentYear.id }));
          } else {
            // If no current year is marked, use the first one as fallback
            console.warn('No current academic year found, using first available');
            const fallbackYear = academicYearsData[0];
            setCurrentAcademicYear(fallbackYear);
            setFormData(prev => ({ ...prev, academic_year_id: fallbackYear.id }));
          }
        } else {
          console.warn('No academic years found at all');
          toast.warning('No academic years configured. Please contact administrator.');
        }
      } catch (error) {
        console.error('Failed to fetch enrollment data:', error);
        console.error('Error details:', error.response?.data);
        toast.error(t('error.failedToLoadData'));
      }
    };
    
    fetchEnrollmentData();
  }, [t]);

  // Fetch grades when educational level changes
  useEffect(() => {
    if (formData.educational_level_id && Array.isArray(educationalLevels)) {
      const selectedLevel = educationalLevels.find(level => level.id === parseInt(formData.educational_level_id));
      if (selectedLevel && selectedLevel.grades) {
        setGrades(Array.isArray(selectedLevel.grades) ? selectedLevel.grades : []);
        // Reset dependent fields
        setFormData(prev => ({ ...prev, grade_id: '', school_class_id: '' }));
        setSchoolClasses([]);
      }
    } else {
      setGrades([]);
      setSchoolClasses([]);
    }
  }, [formData.educational_level_id, educationalLevels]);

  // Fetch classes when grade changes
  useEffect(() => {
    const fetchClasses = async () => {
      if (formData.grade_id && formData.academic_year_id) {
        try {
          const response = await apiMethods.get(`schools/classes/?grade=${formData.grade_id}&academic_year=${formData.academic_year_id}`);
          setSchoolClasses(Array.isArray(response) ? response : (response.results || response.data || []));
          // Reset class selection
          setFormData(prev => ({ ...prev, school_class_id: '' }));
        } catch (error) {
          console.error('Failed to fetch classes:', error);
          setSchoolClasses([]);
        }
      } else {
        setSchoolClasses([]);
      }
    };
    
    fetchClasses();
  }, [formData.grade_id, formData.academic_year_id]);

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

  const generateStudentId = () => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `STU${currentYear}${randomNum}`;
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

    if (!formData.educational_level_id) {
      newErrors.educational_level_id = t('validation.educationalLevelRequired');
    }

    if (!formData.grade_id) {
      newErrors.grade_id = t('validation.gradeRequired');
    }

    if (!formData.school_class_id) {
      newErrors.school_class_id = t('validation.schoolClassRequired');
    }

    // Phone validation (if provided)
    if (formData.phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    // Parent phone validation (if provided)
    if (formData.parent_phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(formData.parent_phone)) {
      newErrors.parent_phone = t('validation.phoneInvalid');
    }

    // Emergency phone validation (if provided)
    if (formData.emergency_contact_phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(formData.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = t('validation.phoneInvalid');
    }

    // Date of birth validation (if provided)
    if (formData.date_of_birth && new Date(formData.date_of_birth) > new Date()) {
      newErrors.date_of_birth = t('validation.dateOfBirthInvalid');
    }

    // Parent first and last names required for automatic parent account creation
    if (!formData.parent_first_name) {
      newErrors.parent_first_name = t('validation.parentFirstNameRequired');
    }
    if (!formData.parent_last_name) {
      newErrors.parent_last_name = t('validation.parentLastNameRequired');
    }

    // Parent email will be auto-generated, no validation needed

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
      // Generate student ID if not provided
      const studentId = formData.student_id || generateStudentId();
      
      // Generate email using initials + lastname approach
      const initial = formData.first_name ? formData.first_name[0].toLowerCase() : '';
      const cleanLastName = formData.last_name
        .toLowerCase()
        .replace(/\s+/g, '') // Remove all spaces
        .replace(/[^a-z0-9]/g, '') // Remove any non-alphanumeric characters
        .trim();
      
      const cleanSchoolName = schoolName
        .toLowerCase()
        .replace(/\s+/g, '') // Remove all spaces
        .replace(/[^a-z0-9]/g, '') // Remove any non-alphanumeric characters
        .trim();
      
      const generatedEmail = initial && cleanLastName ? 
        `${initial}.${cleanLastName}@${cleanSchoolName}-students.com` :
        `${cleanLastName}@${cleanSchoolName}-students.com`;
      
      // Prepare data for API
      const apiData = {
        email: generatedEmail,
        password: 'defaultStrongPassword25',
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: 'STUDENT',
        ar_first_name: formData.ar_first_name,
        ar_last_name: formData.ar_last_name,
        student_id: studentId,
        // Enrollment data
        school_class_id: formData.school_class_id,
        academic_year_id: formData.academic_year_id,
        enrollment_date: formData.enrollment_date,
        student_number: formData.student_number || '',
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
        ...(formData.address && { address: formData.address }),
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.emergency_contact_name && { emergency_contact_name: formData.emergency_contact_name }),
        ...(formData.emergency_contact_phone && { emergency_contact_phone: formData.emergency_contact_phone }),
        ...(formData.parent_name && { parent_name: formData.parent_name }),
        ...(formData.parent_first_name && { parent_first_name: formData.parent_first_name }),
        ...(formData.parent_last_name && { parent_last_name: formData.parent_last_name }),
        ...(formData.parent_phone && { parent_phone: formData.parent_phone })
      };

      const response = await apiMethods.post('users/register/', apiData);

      const selectedClass = schoolClasses.find(c => c.id === parseInt(formData.school_class_id));
      
      toast.success(
        t('student.createSuccess', { 
          name: `${formData.first_name} ${formData.last_name}`,
          email: generatedEmail,
          studentId: studentId,
          className: selectedClass ? selectedClass.name : ''
        })
      );
      
      // Navigate back to students management page
      navigate('/admin/school-management/students');

    } catch (error) {
      console.error('Failed to create student:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Only treat as creation failure if we get 4xx status codes
      if (error.response?.status >= 400 && error.response?.status < 500) {
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
          toast.error(errorData.error || errorData.detail || t('error.createStudentFailed'));
        } else {
          toast.error(t('error.createStudentFailed'));
        }
      } else {
        // For other errors (network issues, 5xx errors, etc.), assume creation might have succeeded
        console.warn('Non-client error occurred, student might have been created successfully');
        toast.info('Request completed but with some issues. Please check if the student was created.');
        // Still navigate to see if the user was created
        setTimeout(() => {
          navigate('/admin/school-management/students');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/school-management/students');
  };

  const actions = [
    <Button
      key="cancel"
      variant="outline"
      onClick={handleCancel}
      disabled={loading}
      className="gap-2"
    >
      <X className="h-4 w-4" />
      {t('common.cancel')}
    </Button>,
    <Button
      key="save"
      onClick={handleSubmit}
      disabled={loading}
      className="gap-2"
    >
      <Save className="h-4 w-4" />
      {loading ? t('common.saving') : t('common.save')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('student.addNewStudent')}
      subtitle={t('student.addNewStudentDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/students"
      actions={actions}
      loading={loading}
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('student.basicInformation')}
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
                  placeholder={t('student.placeholders.firstName')}
                  className={errors.first_name ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-600">{errors.first_name}</p>
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
                  placeholder={t('student.placeholders.lastName')}
                  className={errors.last_name ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-600">{errors.last_name}</p>
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
                  placeholder={t('student.placeholders.arabicFirstName')}
                  className={errors.ar_first_name ? 'border-red-500' : ''}
                  disabled={loading}
                  dir="rtl"
                />
                {errors.ar_first_name && (
                  <p className="text-sm text-red-600">{errors.ar_first_name}</p>
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
                  placeholder={t('student.placeholders.arabicLastName')}
                  className={errors.ar_last_name ? 'border-red-500' : ''}
                  disabled={loading}
                  dir="rtl"
                />
                {errors.ar_last_name && (
                  <p className="text-sm text-red-600">{errors.ar_last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_id">
                  {t('student.studentId')}
                </Label>
                <Input
                  id="student_id"
                  type="text"
                  value={formData.student_id}
                  onChange={(e) => handleInputChange('student_id', e.target.value)}
                  placeholder={t('student.placeholders.studentId')}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">{t('student.studentIdInfo')}</p>
              </div>

              <div className="space-y-2">
                <Label>
                  {t('student.generatedEmail')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={(() => {
                      const initial = formData.first_name ? formData.first_name[0].toLowerCase() : '';
                      const cleanLastName = formData.last_name
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[^a-z0-9]/g, '');
                      const cleanSchoolName = schoolName
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[^a-z0-9]/g, '');
                      
                      return initial && cleanLastName ? 
                        `${initial}.${cleanLastName}@${cleanSchoolName}-students.com` :
                        cleanLastName ? `${cleanLastName}@${cleanSchoolName}-students.com` : '';
                    })()}
                    className="pl-9 bg-gray-50"
                    disabled
                    placeholder={t('student.emailWillBeGenerated')}
                  />
                </div>
                <p className="text-xs text-gray-500">{t('student.emailGeneratedInfo')}</p>
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
                    placeholder={t('student.placeholders.phone')}
                    className={`pl-9 ${errors.phone ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
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
                    className={`pl-9 ${errors.date_of_birth ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600">{errors.date_of_birth}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t('student.enrollmentInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="educational_level" className="required">
                  {t('student.educationalLevel')}
                </Label>
                <Select value={formData.educational_level_id} onValueChange={(value) => handleInputChange('educational_level_id', value)}>
                  <SelectTrigger className={errors.educational_level_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('student.placeholders.educationalLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {educationalLevels.length > 0 ? (
                      educationalLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        No educational levels available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.educational_level_id && (
                  <p className="text-sm text-red-600">{errors.educational_level_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade" className="required">
                  {t('student.grade')}
                </Label>
                <Select 
                  value={formData.grade_id} 
                  onValueChange={(value) => handleInputChange('grade_id', value)}
                  disabled={!formData.educational_level_id}
                >
                  <SelectTrigger className={errors.grade_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('student.placeholders.grade')} />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.length > 0 ? (
                      grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {grade.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        {formData.educational_level_id ? 'No grades available' : 'Select educational level first'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.grade_id && (
                  <p className="text-sm text-red-600">{errors.grade_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_class" className="required">
                  {t('student.schoolClass')}
                </Label>
                <Select 
                  value={formData.school_class_id} 
                  onValueChange={(value) => handleInputChange('school_class_id', value)}
                  disabled={!formData.grade_id}
                >
                  <SelectTrigger className={errors.school_class_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('student.placeholders.schoolClass')} />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolClasses.length > 0 ? (
                      schoolClasses.map((schoolClass) => (
                        <SelectItem key={schoolClass.id} value={schoolClass.id.toString()}>
                          {schoolClass.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-data" disabled>
                        {formData.grade_id ? 'No classes available' : 'Select grade first'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.school_class_id && (
                  <p className="text-sm text-red-600">{errors.school_class_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic_year">
                  {t('student.academicYear')}
                </Label>
                <Input
                  id="academic_year"
                  type="text"
                  value={currentAcademicYear ? currentAcademicYear.year : ''}
                  className="bg-gray-50"
                  disabled
                  placeholder={t('student.placeholders.academicYear')}
                />
                <p className="text-xs text-gray-500">
                  {t('student.placeholders.academicYear')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment_date">
                  {t('student.enrollmentDate')}
                </Label>
                <Input
                  id="enrollment_date"
                  type="date"
                  value={formData.enrollment_date}
                  onChange={(e) => handleInputChange('enrollment_date', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="student_number">
                  {t('student.studentNumber')}
                </Label>
                <Input
                  id="student_number"
                  type="text"
                  value={formData.student_number}
                  onChange={(e) => handleInputChange('student_number', e.target.value)}
                  placeholder={t('student.placeholders.studentNumber')}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  {t('student.placeholders.studentNumber')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🔒</span>
                {t('student.accountInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">{t('student.accountDetails')}</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center justify-between">
                    <span>{t('common.role')}:</span>
                    <span className="font-medium">{t('roles.student')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('auth.defaultPassword')}:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">defaultStrongPassword25</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  {t('student.passwordChangeInfo')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('student.parentInformation')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('student.parentAccountCreationInfo')}
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="parent_first_name" className="required">
                  {t('student.parentFirstName')}
                </Label>
                <Input
                  id="parent_first_name"
                  type="text"
                  value={formData.parent_first_name}
                  onChange={(e) => handleInputChange('parent_first_name', e.target.value)}
                  placeholder={t('student.placeholders.parentFirstName')}
                  className={errors.parent_first_name ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.parent_first_name && (
                  <p className="text-sm text-red-600">{errors.parent_first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_last_name" className="required">
                  {t('student.parentLastName')}
                </Label>
                <Input
                  id="parent_last_name"
                  type="text"
                  value={formData.parent_last_name}
                  onChange={(e) => handleInputChange('parent_last_name', e.target.value)}
                  placeholder={t('student.placeholders.parentLastName')}
                  className={errors.parent_last_name ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.parent_last_name && (
                  <p className="text-sm text-red-600">{errors.parent_last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  {t('student.parentEmail')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={(() => {
                      const parentInitial = formData.parent_first_name ? formData.parent_first_name[0].toLowerCase() : '';
                      const cleanParentLastName = formData.parent_last_name
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[^a-z0-9]/g, '');
                      const cleanSchoolName = schoolName
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .replace(/[^a-z0-9]/g, '');
                      
                      return parentInitial && cleanParentLastName ? 
                        `${parentInitial}.${cleanParentLastName}@${cleanSchoolName}-parents.com` :
                        cleanParentLastName ? `${cleanParentLastName}@${cleanSchoolName}-parents.com` : '';
                    })()}
                    className="pl-9 bg-gray-50"
                    disabled
                    placeholder={t('student.parentEmailWillBeGenerated')}
                  />
                </div>
                <p className="text-xs text-gray-500">{t('student.parentEmailGeneratedInfo')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_phone">
                  {t('student.parentPhone')}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="parent_phone"
                    type="tel"
                    value={formData.parent_phone}
                    onChange={(e) => handleInputChange('parent_phone', e.target.value)}
                    placeholder={t('student.placeholders.parentPhone')}
                    className={`pl-9 ${errors.parent_phone ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.parent_phone && (
                  <p className="text-sm text-red-600">{errors.parent_phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('student.additionalInformation')}
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
                    placeholder={t('student.placeholders.address')}
                    className="pl-9 min-h-[80px]"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {t('student.notes')}
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder={t('student.placeholders.notes')}
                  className="min-h-[100px]"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">
                    {t('student.emergencyContactName')}
                  </Label>
                  <Input
                    id="emergency_contact_name"
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                    placeholder={t('student.placeholders.emergencyContactName')}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">
                    {t('student.emergencyContactPhone')}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      placeholder={t('student.placeholders.emergencyContactPhone')}
                      className={`pl-9 ${errors.emergency_contact_phone ? 'border-red-500' : ''}`}
                      disabled={loading}
                    />
                  </div>
                  {errors.emergency_contact_phone && (
                    <p className="text-sm text-red-600">{errors.emergency_contact_phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminPageLayout>
  );
};

export default AddStudentPage;