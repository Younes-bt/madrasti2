import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { DashboardLayout } from '../../components/layout/Layout';
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
    AlertCircle,
    Shield
} from 'lucide-react';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../../components/ui/alert';

const EditParentProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const fileInputRef = useRef(null);

    const resolvedAvatarUrl = imagePreview ||
        profileData?.profile_picture_url ||
        profileData?.profile?.profile_picture_url ||
        user?.profile_picture_url ||
        user?.profile?.profile_picture_url ||
        null;

    // Fetch profile data
    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const response = await apiMethods.get('users/profile/');
            const data = response.data || response;
            setProfileData(data);

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
            toast.error(t('error.failedToLoadProfile', 'Failed to load profile data'));
            navigate('/parent/profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
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
            if (!file.type.startsWith('image/')) {
                toast.error(t('error.invalidImageFile', 'Please select a valid image file'));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t('error.imageTooLarge', 'Image size should be less than 5MB'));
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.first_name?.trim()) {
            newErrors.first_name = t('error.firstNameRequired', 'First name is required');
        }
        if (!formData.last_name?.trim()) {
            newErrors.last_name = t('error.lastNameRequired', 'Last name is required');
        }
        if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = t('error.invalidPhoneNumber', 'Invalid phone number');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error(t('error.pleaseFixErrors', 'Please fix the errors before saving'));
            return;
        }

        setSaving(true);
        try {
            let requestData;
            let headers = {};

            if (selectedImage) {
                requestData = new FormData();
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                        requestData.append(key, formData[key]);
                    }
                });
                requestData.append('profile_picture', selectedImage);
            } else {
                requestData = formData;
                headers = { 'Content-Type': 'application/json' };
            }

            const response = await apiMethods.put('users/profile/', requestData, { headers });
            const updatedData = response.data || response;
            const updatedProfile = updatedData.profile || {};
            const updatedPictureUrl = updatedData.profile_picture_url || updatedProfile.profile_picture_url || imagePreview || null;

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

            toast.success(t('success.profileUpdated', 'Profile updated successfully'));
            navigate('/parent/profile');
        } catch (error) {
            console.error('Failed to save profile:', error);
            toast.error(t('error.failedToSaveProfile', 'Failed to save profile changes'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex items-center justify-center min-h-[600px]">
                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            {t('parentMenu.editProfile', 'Edit Profile')}
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">
                            {t('parent.editProfileSubtitle', 'Update your personal and contact details')}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate('/parent/profile')} disabled={saving}>
                            <X className="mr-2 h-4 w-4" />
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Profile Picture Card */}
                    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <Camera className="h-5 w-5 text-indigo-500" />
                                {t('sections.profilePicture', 'Profile Picture')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl ring-4 ring-indigo-50">
                                        <AvatarImage src={resolvedAvatarUrl} alt={`${formData.first_name} ${formData.last_name}`} />
                                        <AvatarFallback className="text-4xl bg-indigo-50 text-indigo-700 font-bold">
                                            {formData.first_name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        onClick={handleImageClick}
                                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Camera className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <div className="text-center space-y-2">
                                    <Button type="button" variant="outline" onClick={handleImageClick} className="border-slate-300">
                                        {t('action.changePhoto', 'Choose New Photo')}
                                    </Button>
                                    <p className="text-xs text-slate-400">
                                        {t('hint.profilePictureFormat', 'JPG, PNG or GIF. Max size 5MB')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information Card */}
                    <Card className="border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <UserCircle className="h-5 w-5 text-indigo-500" />
                                {t('sections.personalInformation', 'Personal Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">{t('fields.firstName', 'First Name')} <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="first_name"
                                        value={formData.first_name || ''}
                                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                                        className={errors.first_name ? 'border-rose-500' : 'border-slate-200'}
                                    />
                                    {errors.first_name && <p className="text-xs text-rose-500">{errors.first_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">{t('fields.lastName', 'Last Name')} <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="last_name"
                                        value={formData.last_name || ''}
                                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                                        className={errors.last_name ? 'border-rose-500' : 'border-slate-200'}
                                    />
                                    {errors.last_name && <p className="text-xs text-rose-500">{errors.last_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ar_first_name">{t('fields.arabicFirstName', 'Arabic First Name')}</Label>
                                    <Input
                                        id="ar_first_name"
                                        value={formData.ar_first_name || ''}
                                        onChange={(e) => handleInputChange('ar_first_name', e.target.value)}
                                        dir="rtl"
                                        className="border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ar_last_name">{t('fields.arabicLastName', 'Arabic Last Name')}</Label>
                                    <Input
                                        id="ar_last_name"
                                        value={formData.ar_last_name || ''}
                                        onChange={(e) => handleInputChange('ar_last_name', e.target.value)}
                                        dir="rtl"
                                        className="border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">{t('fields.dateOfBirth', 'Date of Birth')}</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={formData.date_of_birth || ''}
                                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('fields.email', 'Email Address')}</Label>
                                    <Input id="email" value={profileData?.email || ''} disabled className="bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">{t('fields.bio', 'Professional Bio / About You')}</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio || ''}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={4}
                                    className="border-slate-200 resize-none"
                                    placeholder={t('placeholder.bio', 'Tell us a bit about yourself...')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information Card */}
                    <Card className="border-slate-200 shadow-sm rounded-2xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <Contact className="h-5 w-5 text-indigo-500" />
                                {t('sections.contactInformation', 'Contact Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t('fields.phone', 'Phone Number')}</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={errors.phone ? 'border-rose-500' : 'border-slate-200'}
                                    />
                                    {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">{t('fields.address', 'Address')}</Label>
                                    <Input
                                        id="address"
                                        value={formData.address || ''}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                    <div className="flex">
                                        <div className="flex items-center justify-center w-10 bg-slate-100 border border-r-0 border-slate-200 rounded-l-md">
                                            <Linkedin className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <Input
                                            id="linkedin_url"
                                            type="url"
                                            value={formData.linkedin_url || ''}
                                            onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                                            className="rounded-l-none border-slate-200"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter_url">Twitter URL</Label>
                                    <div className="flex">
                                        <div className="flex items-center justify-center w-10 bg-slate-100 border border-r-0 border-slate-200 rounded-l-md">
                                            <Twitter className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <Input
                                            id="twitter_url"
                                            type="url"
                                            value={formData.twitter_url || ''}
                                            onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                                            className="rounded-l-none border-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Contact Card */}
                    <Card className="border-slate-200 shadow-sm rounded-2xl border-l-4 border-l-rose-500">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                <Heart className="h-5 w-5 text-rose-500" />
                                {t('sections.emergencyContact', 'Emergency Contact')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="emergency_contact_name">{t('fields.emergencyName', 'Contact Name')}</Label>
                                    <Input
                                        id="emergency_contact_name"
                                        value={formData.emergency_contact_name || ''}
                                        onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergency_contact_phone">{t('fields.emergencyPhone', 'Contact Phone')}</Label>
                                    <Input
                                        id="emergency_contact_phone"
                                        type="tel"
                                        value={formData.emergency_contact_phone || ''}
                                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                                        className="border-slate-200"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EditParentProfilePage;
