import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Camera, 
  Users,
  Save,
  Loader2
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditParentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { parentId } = useParams();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    // Basic Information
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    
    // Contact Information
    address: '',
    
    // Parent-specific Information
    children_names: '',
    occupation: '',
    workplace: '',
    
    // Emergency Contact
    emergency_contact_name: '',
    emergency_contact_phone: '',
    
    // Additional Information
    bio: '',
    
    // Account Information
    is_active: true
  });

  // Fetch parent data
  const fetchParentData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${parentId}/`);
      
      let data = response.data || response;
      
      // Update form data
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        ar_first_name: data.ar_first_name || '',
        ar_last_name: data.ar_last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        address: data.address || '',
        children_names: data.children_names || '',
        occupation: data.occupation || '',
        workplace: data.workplace || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        bio: data.bio || '',
        is_active: data.is_active !== false
      });
      
      // Set profile picture preview if available
      if (data.profile_picture_url) {
        setProfileImagePreview(data.profile_picture_url);
      }
      
    } catch (error) {
      console.error('Failed to fetch parent data:', error);
      toast.error(t('error.failedToLoadParentData'));
      navigate('/admin/school-management/parents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (parentId) {
      fetchParentData();
    }
  }, [parentId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle profile picture selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('validation.invalidImageType'));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('validation.fileTooLarge'));
        return;
      }
      
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.first_name.trim()) newErrors.first_name = t('validation.firstNameRequired');
    if (!formData.last_name.trim()) newErrors.last_name = t('validation.lastNameRequired');
    if (!formData.email.trim()) newErrors.email = t('validation.emailRequired');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    // Phone validation (if provided)
    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = t('validation.phoneInvalid');
    }

    // Date of birth validation (cannot be in future)
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.date_of_birth = t('validation.dateOfBirthInvalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('error.pleaseFixErrors'));
      return;
    }

    setSaving(true);
    
    try {
      // Prepare parent data
      const parentData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        ar_first_name: formData.ar_first_name.trim() || '',
        ar_last_name: formData.ar_last_name.trim() || '',
        email: formData.email.trim(),
        phone: formData.phone.trim() || '',
        date_of_birth: formData.date_of_birth || '',
        address: formData.address.trim() || '',
        children_names: formData.children_names.trim() || '',
        occupation: formData.occupation.trim() || '',
        workplace: formData.workplace.trim() || '',
        emergency_contact_name: formData.emergency_contact_name.trim() || '',
        emergency_contact_phone: formData.emergency_contact_phone.trim() || '',
        bio: formData.bio.trim() || '',
        is_active: formData.is_active
      };

      // Update parent account
      await apiMethods.patch(`users/users/${parentId}/`, parentData);
      
      // Upload profile picture if selected
      if (profileImage) {
        try {
          const imageFormData = new FormData();
          imageFormData.append('profile_picture', profileImage);
          
          await apiMethods.patch(`users/users/${parentId}/`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } catch (uploadError) {
          console.warn('Profile picture upload failed:', uploadError);
          // Don't fail the entire process for image upload failure
        }
      }

      // Success
      toast.success(t('parent.updateSuccess', {
        name: `${parentData.first_name} ${parentData.last_name}`
      }));
      
      navigate('/admin/school-management/parents');
      
    } catch (error) {
      console.error('Failed to update parent:', error);
      
      if (error.response?.data?.email) {
        setErrors({ email: 'Email address is already registered' });
      } else {
        toast.error(t('error.updateParentFailed'));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout
        title={t('parent.editParent')}
        subtitle={t('parent.editParentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/parents"
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
      title={t('parent.editParent')}
      subtitle={t('parent.editParentDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/parents"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('parent.basicInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t('common.firstName')} *</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.firstName')}
                className={errors.first_name ? 'border-red-500' : ''}
              />
              {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">{t('common.lastName')} *</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.lastName')}
                className={errors.last_name ? 'border-red-500' : ''}
              />
              {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ar_first_name">{t('common.arabicFirstName')}</Label>
              <Input
                id="ar_first_name"
                name="ar_first_name"
                value={formData.ar_first_name}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.arabicFirstName')}
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ar_last_name">{t('common.arabicLastName')}</Label>
              <Input
                id="ar_last_name"
                name="ar_last_name"
                value={formData.ar_last_name}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.arabicLastName')}
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('common.phone')}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">{t('common.dateOfBirth')}</Label>
              <Input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className={errors.date_of_birth ? 'border-red-500' : ''}
              />
              {errors.date_of_birth && <p className="text-sm text-red-500">{errors.date_of_birth}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t('parent.accountInformation')}
            </CardTitle>
            <CardDescription>
              {t('parent.emailChangeInfo')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('common.email')} *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.email')}
                className={errors.email ? 'border-red-500' : ''}
                disabled
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              <p className="text-sm text-muted-foreground">{t('parent.emailCannotBeChanged')}</p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange({
                  target: { name: 'is_active', type: 'checkbox', checked }
                })}
              />
              <Label htmlFor="is_active">{t('status.active')}</Label>
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('parent.parentInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="children_names">{t('parent.childrenNames')}</Label>
              <Input
                id="children_names"
                name="children_names"
                value={formData.children_names}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.childrenNames')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">{t('parent.occupation')}</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.occupation')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="workplace">{t('parent.workplace')}</Label>
              <Input
                id="workplace"
                name="workplace"
                value={formData.workplace}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.workplace')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('parent.contactInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">{t('common.address')}</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.address')}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {t('parent.emergencyContact')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">{t('parent.emergencyContactName')}</Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.emergencyContactName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">{t('parent.emergencyContactPhone')}</Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.emergencyContactPhone')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              {t('parent.profilePicture')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {t('parent.changePhoto')}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {t('parent.photoRequirements')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('parent.additionalInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="bio">{t('common.bio')}</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder={t('parent.placeholders.bio')}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/school-management/parents')}
            disabled={saving}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? t('common.updating') : t('common.update')}
          </Button>
        </div>
      </form>
    </AdminPageLayout>
  );
};

export default EditParentPage;