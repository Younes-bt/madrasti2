import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AddTeacherPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    position: '',
    phone: '',
    date_of_birth: '',
    address: '',
    bio: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [schoolName, setSchoolName] = useState('madrasti'); // Will be fetched from school config

  const [errors, setErrors] = useState({});

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

    if (!formData.position) {
      newErrors.position = t('validation.positionRequired');
    }

    // Phone validation (if provided)
    if (formData.phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(formData.phone)) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    // Date of birth validation (if provided)
    if (formData.date_of_birth && new Date(formData.date_of_birth) > new Date()) {
      newErrors.date_of_birth = t('validation.dateOfBirthInvalid');
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
      // Generate email and set default values
      // Clean the last name: remove spaces, special characters, and normalize
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
      
      const generatedEmail = `${cleanLastName}@${cleanSchoolName}-teachers.com`;
      
      
      // Prepare data for API
      const apiData = {
        email: generatedEmail,
        password: 'defaultStrongPassword25',
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: 'TEACHER',
        ar_first_name: formData.ar_first_name,
        ar_last_name: formData.ar_last_name,
        position: formData.position,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
        ...(formData.address && { address: formData.address }),
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.emergency_contact_name && { emergency_contact_name: formData.emergency_contact_name }),
        ...(formData.emergency_contact_phone && { emergency_contact_phone: formData.emergency_contact_phone })
      };

      const response = await apiMethods.post('users/register/', apiData);

      toast.success(
        t('teacher.createSuccess', { 
          name: `${formData.first_name} ${formData.last_name}`,
          email: generatedEmail
        })
      );
      
      // Navigate back to teachers management page
      navigate('/admin/school-management/teachers');

    } catch (error) {
      console.error('Failed to create teacher:', error);
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
          toast.error(errorData.error || errorData.detail || t('error.createTeacherFailed'));
        } else {
          toast.error(t('error.createTeacherFailed'));
        }
      } else {
        // For other errors (network issues, 5xx errors, etc.), assume creation might have succeeded
        console.warn('Non-client error occurred, teacher might have been created successfully');
        toast.info('Request completed but with some issues. Please check if the teacher was created.');
        // Still navigate to see if the user was created
        setTimeout(() => {
          navigate('/admin/school-management/teachers');
        }, 2000);
      }
    } finally {
      setLoading(false);
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
      title={t('teacher.addNewTeacher')}
      subtitle={t('teacher.addNewTeacherDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/teachers"
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
                  placeholder={t('teacher.placeholders.lastName')}
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
                  placeholder={t('teacher.placeholders.arabicFirstName')}
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
                  placeholder={t('teacher.placeholders.arabicLastName')}
                  className={errors.ar_last_name ? 'border-red-500' : ''}
                  disabled={loading}
                  dir="rtl"
                />
                {errors.ar_last_name && (
                  <p className="text-sm text-red-600">{errors.ar_last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="required">
                  {t('teacher.position')}
                </Label>
                <Input
                  id="position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder={t('teacher.placeholders.position')}
                  className={errors.position ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.position && (
                  <p className="text-sm text-red-600">{errors.position}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  {t('teacher.generatedEmail')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.last_name ? 
                      `${formData.last_name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}@${schoolName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}-teachers.com` 
                      : ''}
                    className="pl-9 bg-gray-50"
                    disabled
                    placeholder={t('teacher.emailWillBeGenerated')}
                  />
                </div>
                <p className="text-xs text-gray-500">{t('teacher.emailGeneratedInfo')}</p>
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

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🔒</span>
                {t('teacher.accountInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">{t('teacher.accountDetails')}</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center justify-between">
                    <span>{t('common.role')}:</span>
                    <span className="font-medium">{t('roles.teacher')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('auth.defaultPassword')}:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">defaultStrongPassword25</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3">
                  {t('teacher.passwordChangeInfo')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
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

export default AddTeacherPage;