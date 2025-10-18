import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Calendar, FileText, Camera, DollarSign, Briefcase, Globe } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { STAFF_POSITION_OPTIONS, getStaffPositionLabel } from '../../constants/staffPositions';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditStaffPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const language = i18n.language || 'en';
  const isArabic = language.startsWith('ar');
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
  const [errors, setErrors] = useState({});

  // Fetch staff member data
  const fetchStaffData = async () => {
    setInitialLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${staffId}/`);
      
      let staffData = response.data || response;
      
      // Set form data from user and profile
      setFormData({
        first_name: staffData.first_name || '',
        last_name: staffData.last_name || '',
        ar_first_name: staffData.ar_first_name || staffData.profile?.ar_first_name || '',
        ar_last_name: staffData.ar_last_name || staffData.profile?.ar_last_name || '',
        position: staffData.position || staffData.profile?.position || '',
        phone: staffData.phone || staffData.profile?.phone || '',
        date_of_birth: staffData.date_of_birth || staffData.profile?.date_of_birth || '',
        address: staffData.address || staffData.profile?.address || '',
        bio: staffData.bio || staffData.profile?.bio || '',
        emergency_contact_name: staffData.emergency_contact_name || staffData.profile?.emergency_contact_name || '',
        emergency_contact_phone: staffData.emergency_contact_phone || staffData.profile?.emergency_contact_phone || '',
        department: staffData.department || staffData.profile?.department || '',
        hire_date: staffData.hire_date || staffData.profile?.hire_date || '',
        salary: staffData.salary || staffData.profile?.salary || '',
        linkedin_url: staffData.linkedin_url || staffData.profile?.linkedin_url || '',
        twitter_url: staffData.twitter_url || staffData.profile?.twitter_url || ''
      });
      
      setOriginalEmail(staffData.email || '');
      setProfilePictureUrl(staffData.profile_picture_url || staffData.profile?.profile_picture_url || '');
      
    } catch (error) {
      console.error('Failed to fetch staff data:', error);
      toast.error(t('error.failedToLoadStaffData'));
      navigate('/admin/school-management/staff');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchStaffData();
    }
  }, [staffId]);

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

    // Note: Hire date can be in the future (for pre-registered staff)
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
      // Send primary profile data as JSON to avoid multipart parsing issues
      const staffPayload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        ar_first_name: formData.ar_first_name.trim(),
        ar_last_name: formData.ar_last_name.trim(),
        position: formData.position || '',
        phone: formData.phone.trim() || '',
        date_of_birth: formData.date_of_birth || null,
        address: formData.address.trim() || '',
        bio: formData.bio.trim() || '',
        emergency_contact_name: formData.emergency_contact_name.trim() || '',
        emergency_contact_phone: formData.emergency_contact_phone.trim() || '',
        department: formData.department.trim() || '',
        hire_date: formData.hire_date || null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        linkedin_url: formData.linkedin_url.trim() || '',
        twitter_url: formData.twitter_url.trim() || ''
      };

      await apiMethods.patch(`users/users/${staffId}/`, staffPayload);

      // Upload profile picture separately when provided
      if (profilePictureFile) {
        try {
          const imageFormData = new FormData();
          imageFormData.append('profile_picture', profilePictureFile);

          await apiMethods.patch(`users/users/${staffId}/`, imageFormData);
        } catch (imageError) {
          console.warn('Profile picture upload failed:', imageError);
          toast.warning(
            t('error.profilePictureUploadFailed', {
              defaultValue: 'Profile picture upload failed. You can try again later.'
            })
          );
        }
      }

      toast.success(t('staff.updateSuccess', { 
        name: `${formData.first_name} ${formData.last_name}`
      }));
      
      // Navigate back to staff management page
      navigate('/admin/school-management/staff');

    } catch (error) {
      console.error('Failed to update staff member:', error);
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
        toast.error(errorData.error || errorData.detail || t('error.updateStaffFailed'));
      } else {
        toast.error(t('error.updateStaffFailed'));
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
    navigate('/admin/school-management/staff');
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
        title={t('staff.editStaff')}
        subtitle={t('staff.editStaffDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/staff"
        loading={true}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('staff.editStaff')}
      subtitle={t('staff.editStaffDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/staff"
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
                {t('staff.basicInformation')}
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
                  placeholder={t('staff.placeholders.firstName')}
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
                  placeholder={t('staff.placeholders.lastName')}
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
                  placeholder={t('staff.placeholders.arabicFirstName')}
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
                  placeholder={t('staff.placeholders.arabicLastName')}
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
                  {isArabic ? 'الوظيفة' : t('staff.position')}
                </Label>
                <Select
                  value={formData.position || undefined}
                  onValueChange={(value) => handleInputChange('position', value)}
                  disabled={loading}
                >
                  <SelectTrigger className={`h-12 ${errors.position ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={isArabic ? 'اختر الوظيفة' : t('staff.selectPosition')} />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_POSITION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {getStaffPositionLabel(t, option.value, language)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && (
                  <p className="text-sm text-red-600">{errors.position}</p>
                )}
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
                    className="pl-9 bg-gray-50"
                    disabled
                    placeholder={t('staff.emailCannotBeChanged')}
                  />
                </div>
                <p className="text-xs text-gray-500">{t('staff.emailChangeInfo')}</p>
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
                    placeholder={t('staff.placeholders.phone')}
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

          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t('staff.profilePicture')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="profile_picture" className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg border border-blue-200">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 text-sm font-medium">
                        {profilePictureUrl ? t('staff.changePhoto') : t('staff.uploadPhoto')}
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
                  <p className="text-xs text-gray-500 mt-2">
                    {t('staff.photoRequirements')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {t('staff.professionalInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department">
                  {t('staff.department')}
                </Label>
                <Input
                  id="department"
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder={t('staff.placeholders.department')}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hire_date">
                  {t('staff.hireDate')}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => handleInputChange('hire_date', e.target.value)}
                    className={`pl-9 ${errors.hire_date ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.hire_date && (
                  <p className="text-sm text-red-600">{errors.hire_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">
                  {t('staff.salary')}
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
                    placeholder={t('staff.placeholders.salary')}
                    className={`pl-9 ${errors.salary ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.salary && (
                  <p className="text-sm text-red-600">{errors.salary}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('staff.socialMediaLinks')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">
                  {t('staff.linkedinUrl')}
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder={t('staff.placeholders.linkedinUrl')}
                    className={`pl-9 ${errors.linkedin_url ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.linkedin_url && (
                  <p className="text-sm text-red-600">{errors.linkedin_url}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_url">
                  {t('staff.twitterUrl')}
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    placeholder={t('staff.placeholders.twitterUrl')}
                    className={`pl-9 ${errors.twitter_url ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.twitter_url && (
                  <p className="text-sm text-red-600">{errors.twitter_url}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('staff.additionalInformation')}
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
                    placeholder={t('staff.placeholders.address')}
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
                  placeholder={t('staff.placeholders.bio')}
                  className="min-h-[100px]"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">
                    {t('staff.emergencyContactName')}
                  </Label>
                  <Input
                    id="emergency_contact_name"
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                    placeholder={t('staff.placeholders.emergencyContactName')}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">
                    {t('staff.emergencyContactPhone')}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      placeholder={t('staff.placeholders.emergencyContactPhone')}
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

export default EditStaffPage;
