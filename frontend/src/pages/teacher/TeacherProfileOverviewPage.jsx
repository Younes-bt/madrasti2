import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { TeacherPageLayout } from '../../components/teacher/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Camera, 
  DollarSign, 
  Briefcase, 
  Globe,
  Building,
  Clock,
  Shield,
  BookOpen,
  Edit3,
  Save,
  X,
  UserCircle,
  Contact,
  Linkedin,
  Twitter,
  Heart
} from 'lucide-react';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const TeacherProfileOverviewPage = () => {
  const { t, isRTL } = useLanguage();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
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

  const handleSave = async () => {
    setSaving(true);
    try {
      let requestData;
      let headers = {};
      
      // If there's an image, use FormData for multipart upload
      if (selectedImage) {
        requestData = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null && formData[key] !== undefined) {
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
      setProfileData(updatedData);
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      
      // Update auth user context with new data
      updateUser({
        ...user,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      
      toast.success(t('success.profileUpdated'));
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error(t('error.failedToSaveProfile'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      const profile = profileData.profile || {};
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
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
    }
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notProvided');
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'}
        className={isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}
      >
        {isActive ? t('status.active') : t('status.inactive')}
      </Badge>
    );
  };

  const InfoItem = ({ icon, label, value, isEditable = false, field = null, type = 'text', isTextarea = false, isLink = false }) => (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={cn('flex-shrink-0 mt-1 text-gray-500', isRTL && 'ml-3 mr-0')}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium text-gray-900 mb-1">{label}</Label>
        {isEditing && isEditable && field ? (
          isTextarea ? (
            <Textarea
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1"
              rows={3}
            />
          ) : (
            <Input
              type={type}
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="mt-1"
            />
          )
        ) : (
          isLink && value ? (
            <a 
              href={value.startsWith('http') ? value : `https://${value}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <p className="text-sm text-gray-600 break-words">{value || t('common.notProvided')}</p>
          )
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <TeacherPageLayout title={t('teacherSidebar.profile.overview')}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </TeacherPageLayout>
    );
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.profile.overview')}
      subtitle={t('pages.teacherProfile.subtitle')}
      actions={[
        isEditing ? (
          <div key="editing-actions" className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        ) : (
          <Button
            key="edit-action"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            {t('common.edit')}
          </Button>
        )
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={imagePreview || profileData?.profile?.profile_picture_url} />
                    <AvatarFallback className="text-lg">
                      {profileData?.first_name?.[0]}{profileData?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div 
                      onClick={handleImageClick}
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  )}
                  {isEditing && (selectedImage || imagePreview) && (
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
                <h3 className="text-xl font-semibold">
                  {profileData?.first_name} {profileData?.last_name}
                </h3>
                {profileData?.profile?.ar_first_name && profileData?.profile?.ar_last_name && (
                  <p className="text-sm text-gray-600 mt-1">
                    {profileData.profile.ar_first_name} {profileData.profile.ar_last_name}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(profileData?.is_active)}
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {t('roles.teacher')}
                  </Badge>
                </div>
                {profileData?.profile?.school_subject && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    {profileData.profile.school_subject.name}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('common.overview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('common.memberSince')}</span>
                  <span className="text-sm font-medium">{formatDate(profileData?.created_at)}</span>
                </div>
                {profileData?.profile?.hire_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('fields.hireDate')}</span>
                    <span className="text-sm font-medium">{formatDate(profileData.profile.hire_date)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  {t('sections.personalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label={t('fields.firstName')}
                    value={profileData?.first_name}
                    isEditable={true}
                    field="first_name"
                  />
                  <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label={t('fields.lastName')}
                    value={profileData?.last_name}
                    isEditable={true}
                    field="last_name"
                  />
                  <InfoItem
                    icon={<Globe className="h-4 w-4" />}
                    label={t('fields.arabicFirstName')}
                    value={profileData?.profile?.ar_first_name}
                    isEditable={true}
                    field="ar_first_name"
                  />
                  <InfoItem
                    icon={<Globe className="h-4 w-4" />}
                    label={t('fields.arabicLastName')}
                    value={profileData?.profile?.ar_last_name}
                    isEditable={true}
                    field="ar_last_name"
                  />
                  <InfoItem
                    icon={<Mail className="h-4 w-4" />}
                    label={t('fields.email')}
                    value={profileData?.email}
                    isEditable={false}
                  />
                  <InfoItem
                    icon={<Calendar className="h-4 w-4" />}
                    label={t('fields.dateOfBirth')}
                    value={formatDate(profileData?.profile?.date_of_birth)}
                    isEditable={true}
                    field="date_of_birth"
                    type="date"
                  />
                </div>
                <Separator className="my-4" />
                <InfoItem
                  icon={<FileText className="h-4 w-4" />}
                  label={t('fields.bio')}
                  value={profileData?.profile?.bio}
                  isEditable={true}
                  field="bio"
                  isTextarea={true}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Contact className="h-5 w-5" />
                  {t('sections.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Phone className="h-4 w-4" />}
                    label={t('fields.phone')}
                    value={profileData?.profile?.phone}
                    isEditable={true}
                    field="phone"
                  />
                  <InfoItem
                    icon={<MapPin className="h-4 w-4" />}
                    label={t('fields.address')}
                    value={profileData?.profile?.address}
                    isEditable={true}
                    field="address"
                  />
                  <InfoItem
                    icon={<Linkedin className="h-4 w-4" />}
                    label={t('fields.linkedinUrl')}
                    value={profileData?.profile?.linkedin_url}
                    isEditable={true}
                    field="linkedin_url"
                    isLink={true}
                  />
                  <InfoItem
                    icon={<Twitter className="h-4 w-4" />}
                    label={t('fields.twitterUrl')}
                    value={profileData?.profile?.twitter_url}
                    isEditable={true}
                    field="twitter_url"
                    isLink={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  {t('sections.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<User className="h-4 w-4" />}
                    label={t('fields.emergencyContactName')}
                    value={profileData?.profile?.emergency_contact_name}
                    isEditable={true}
                    field="emergency_contact_name"
                  />
                  <InfoItem
                    icon={<Phone className="h-4 w-4" />}
                    label={t('fields.emergencyContactPhone')}
                    value={profileData?.profile?.emergency_contact_phone}
                    isEditable={true}
                    field="emergency_contact_phone"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t('sections.professionalInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<BookOpen className="h-4 w-4" />}
                    label={t('fields.subject')}
                    value={profileData?.profile?.school_subject?.name}
                    isEditable={false}
                  />
                  <InfoItem
                    icon={<Calendar className="h-4 w-4" />}
                    label={t('fields.hireDate')}
                    value={formatDate(profileData?.profile?.hire_date)}
                    isEditable={false}
                  />
                  <InfoItem
                    icon={<DollarSign className="h-4 w-4" />}
                    label={t('fields.salary')}
                    value={profileData?.profile?.salary ? `${profileData.profile.salary} MAD` : t('common.notProvided')}
                    isEditable={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TeacherPageLayout>
  );
};

export default TeacherProfileOverviewPage;