import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { TeacherPageLayout } from '../../components/teacher/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Camera,
  Globe,
  Save,
  X,
  UserCircle,
  Contact,
  Linkedin,
  Twitter,
  Heart,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../../components/ui/alert';

const EditTeacherProfilePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const resolvedAvatarUrl = profileData?.profile_picture_url ||
    profileData?.profile?.profile_picture_url ||
    user?.profile_picture_url ||
    user?.profile?.profile_picture_url ||
    null;
  const fileInputRef = useRef(null);

  // Fetch profile data
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('users/profile/');
      const data = response.data || response;
      setProfileData(data);

      // Extract profile data from the nested profile object
      const profile = data.profile || {};
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        ar_first_name: profile.ar_first_name || '',
        ar_last_name: profile.ar_last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        bio: profile.bio || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      toast.error(t('error.failedToLoadProfile'));
      navigate('/teacher/profile/overview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('error.invalidImageFile') || 'Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('error.imageTooLarge') || 'Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = t('error.firstNameRequired') || 'First name is required';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = t('error.lastNameRequired') || 'Last name is required';
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = t('error.invalidPhoneNumber') || 'Invalid phone number';
    }

    if (formData.emergency_contact_phone && !/^[0-9+\-\s()]+$/.test(formData.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = t('error.invalidPhoneNumber') || 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error(t('error.pleaseFixErrors') || 'Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      let requestData;
      let headers = {};

      // If there's an image, use FormData for multipart upload
      if (selectedImage) {
        requestData = new FormData();

        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
            requestData.append(key, formData[key]);
          }
        });

        // Append the image file
        requestData.append('profile_picture', selectedImage);

        // Don't set Content-Type header - let the browser set it with boundary
        headers = {};
      } else {
        // If no image, send regular JSON data
        requestData = formData;
        headers = {
          'Content-Type': 'application/json',
        };
      }

      const response = await apiMethods.put('users/profile/', requestData, {
        headers,
      });

      const updatedData = response.data || response;
      const updatedProfile = updatedData.profile || {};
      const updatedPictureUrl =
        updatedData.profile_picture_url ||
        updatedProfile.profile_picture_url ||
        imagePreview ||
        null;

      updateUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        profile_picture_url: updatedPictureUrl,
        profile: {
          ...(user?.profile || {}),
          ...updatedProfile,
          profile_picture_url: updatedPictureUrl,
        },
      });

      toast.success(t('success.profileUpdated') || 'Profile updated successfully');
      navigate('/teacher/profile/overview');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error(t('error.failedToSaveProfile') || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/teacher/profile/overview');
  };

  if (loading) {
    return (
      <TeacherPageLayout
        title={t('teacherSidebar.profile.editProfile') || 'Edit Profile'}
        showBackButton={true}
        backButtonPath="/teacher/profile/overview"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t('common.loadingData') || 'Loading...'}</p>
          </div>
        </div>
      </TeacherPageLayout>
    );
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.profile.editProfile') || 'Edit Profile'}
      subtitle={t('pages.editProfile.subtitle') || 'Update your personal and professional information'}
      showBackButton={true}
      backButtonPath="/teacher/profile/overview"
      actions={[
        <Button
          key="cancel"
          variant="outline"
          onClick={handleCancel}
          disabled={saving}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          {t('common.cancel')}
        </Button>,
        <Button
          key="save"
          onClick={handleSave}
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('common.saving') || 'Saving...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t('common.save')}
            </>
          )}
        </Button>
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Picture Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-5 w-5 text-primary" />
              {t('sections.profilePicture') || 'Profile Picture'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-border">
                  <AvatarImage
                    src={imagePreview || resolvedAvatarUrl}
                    alt={profileData?.full_name || profileData?.first_name || 'profile photo'}
                  />
                  <AvatarFallback className="text-lg">
                    {(profileData?.first_name || user?.first_name || '?').slice(0, 1).toUpperCase()}
                    {(profileData?.last_name || user?.last_name || '').slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  onClick={handleImageClick}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                  <Camera className="h-6 w-6 text-white" />
                </div>
                {(selectedImage || imagePreview) && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageClick}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {t('action.changePhoto') || 'Change Photo'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('hint.profilePictureFormat') || 'JPG, PNG or GIF. Max size 5MB'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCircle className="h-5 w-5 text-primary" />
              {t('sections.personalInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="flex items-center gap-1">
                  {t('fields.firstName')}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder={t('placeholder.firstName') || 'Enter first name'}
                  className={errors.first_name ? 'border-destructive' : ''}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="flex items-center gap-1">
                  {t('fields.lastName')}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder={t('placeholder.lastName') || 'Enter last name'}
                  className={errors.last_name ? 'border-destructive' : ''}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">{errors.last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ar_first_name">
                  {t('fields.arabicFirstName')}
                </Label>
                <Input
                  id="ar_first_name"
                  value={formData.ar_first_name || ''}
                  onChange={(e) => handleInputChange('ar_first_name', e.target.value)}
                  placeholder={t('placeholder.arabicFirstName') || 'أدخل الاسم الأول'}
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ar_last_name">
                  {t('fields.arabicLastName')}
                </Label>
                <Input
                  id="ar_last_name"
                  value={formData.ar_last_name || ''}
                  onChange={(e) => handleInputChange('ar_last_name', e.target.value)}
                  placeholder={t('placeholder.arabicLastName') || 'أدخل اسم العائلة'}
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('fields.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData?.email || ''}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  {t('hint.emailCannotBeChanged') || 'Email cannot be changed'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">
                  {t('fields.dateOfBirth')}
                </Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                {t('fields.bio')}
              </Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder={t('placeholder.bio') || 'Tell us about yourself...'}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Contact className="h-5 w-5 text-primary" />
              {t('sections.contactInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t('fields.phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t('placeholder.phone') || '+212 6XX-XXXXXX'}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  {t('fields.address')}
                </Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t('placeholder.address') || 'Enter your address'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">
                  {t('fields.linkedinUrl')}
                </Label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3 bg-muted rounded-md border border-border">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_url">
                  {t('fields.twitterUrl')}
                </Label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3 bg-muted rounded-md border border-border">
                    <Twitter className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url || ''}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-5 w-5 text-primary" />
              {t('sections.emergencyContact')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('hint.emergencyContact') || 'Emergency contact information is used in case of urgent situations'}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">
                  {t('fields.emergencyContactName')}
                </Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name || ''}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  placeholder={t('placeholder.emergencyContactName') || 'Contact person name'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">
                  {t('fields.emergencyContactPhone')}
                </Label>
                <Input
                  id="emergency_contact_phone"
                  type="tel"
                  value={formData.emergency_contact_phone || ''}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  placeholder={t('placeholder.emergencyContactPhone') || '+212 6XX-XXXXXX'}
                  className={errors.emergency_contact_phone ? 'border-destructive' : ''}
                />
                {errors.emergency_contact_phone && (
                  <p className="text-sm text-destructive">{errors.emergency_contact_phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherPageLayout>
  );
};

export default EditTeacherProfilePage;
