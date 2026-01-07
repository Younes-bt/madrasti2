import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Calendar, FileText, Camera, GraduationCap, Users } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditStudentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    student_id: '',
    grade: '',
    class_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    bio: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    uses_transport: false,
    invoice_discount: 0
  });

  const [originalEmail, setOriginalEmail] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch student data
  const fetchStudentData = async () => {
    setInitialLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${studentId}/`);

      let studentData = response.data || response;

      // Set form data from user and profile
      setFormData({
        first_name: studentData.first_name || '',
        last_name: studentData.last_name || '',
        ar_first_name: studentData.ar_first_name || studentData.profile?.ar_first_name || '',
        ar_last_name: studentData.ar_last_name || studentData.profile?.ar_last_name || '',
        student_id: studentData.student_id || studentData.profile?.student_id || '',
        grade: studentData.grade || studentData.profile?.grade || '',
        class_name: studentData.class_name || studentData.profile?.class_name || '',
        phone: studentData.phone || studentData.profile?.phone || '',
        date_of_birth: studentData.date_of_birth || studentData.profile?.date_of_birth || '',
        address: studentData.address || studentData.profile?.address || '',
        bio: studentData.bio || studentData.profile?.bio || '',
        emergency_contact_name: studentData.emergency_contact_name || studentData.profile?.emergency_contact_name || '',
        emergency_contact_phone: studentData.emergency_contact_phone || studentData.profile?.emergency_contact_phone || '',
        parent_name: studentData.parent_name || studentData.profile?.parent_name || '',
        parent_email: studentData.parent_email || studentData.profile?.parent_email || '',
        parent_phone: studentData.parent_phone || studentData.profile?.parent_phone || '',
        uses_transport: studentData.uses_transport ?? studentData.profile?.uses_transport ?? false,
        invoice_discount: studentData.invoice_discount || studentData.profile?.invoice_discount || 0
      });

      setOriginalEmail(studentData.email || '');
      setProfilePictureUrl(studentData.profile_picture_url || studentData.profile?.profile_picture_url || '');

    } catch (error) {
      console.error('Failed to fetch student data:', error);
      toast.error(t('error.failedToLoadStudentData'));
      navigate('/admin/school-management/students');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

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

    if (!formData.grade) {
      newErrors.grade = t('validation.gradeRequired');
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

    // Parent email validation (if provided)
    if (formData.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parent_email)) {
      newErrors.parent_email = t('validation.emailInvalid');
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
      formDataToSend.append('student_id', formData.student_id || '');
      formDataToSend.append('grade', formData.grade || '');
      formDataToSend.append('class_name', formData.class_name || '');
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('date_of_birth', formData.date_of_birth || '');
      formDataToSend.append('address', formData.address || '');
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('emergency_contact_name', formData.emergency_contact_name || '');
      formDataToSend.append('emergency_contact_phone', formData.emergency_contact_phone || '');
      formDataToSend.append('parent_name', formData.parent_name || '');
      formDataToSend.append('parent_email', formData.parent_email || '');
      formDataToSend.append('parent_phone', formData.parent_phone || '');
      formDataToSend.append('uses_transport', formData.uses_transport);
      formDataToSend.append('invoice_discount', formData.invoice_discount);

      // Add profile picture if uploaded
      if (profilePictureFile) {
        formDataToSend.append('profile_picture', profilePictureFile);
      }

      await apiMethods.patch(`users/users/${studentId}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(t('student.updateSuccess', {
        name: `${formData.first_name} ${formData.last_name}`
      }));

      // Navigate back to students management page
      navigate('/admin/school-management/students');

    } catch (error) {
      console.error('Failed to update student:', error);
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
        toast.error(errorData.error || errorData.detail || t('error.updateStudentFailed'));
      } else {
        toast.error(t('error.updateStudentFailed'));
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
    navigate('/admin/school-management/students');
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
        title={t('student.editStudent')}
        subtitle={t('student.editStudentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/students"
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
      title={t('student.editStudent')}
      subtitle={t('student.editStudentDescription')}
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
                    placeholder={t('student.emailCannotBeChanged')}
                  />
                </div>
                <p className="text-xs text-gray-500">{t('student.emailChangeInfo')}</p>
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

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t('student.academicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="grade" className="required">
                  {t('student.grade')}
                </Label>
                <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                  <SelectTrigger className={errors.grade ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('student.placeholders.grade')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('grades.grade1')}</SelectItem>
                    <SelectItem value="2">{t('grades.grade2')}</SelectItem>
                    <SelectItem value="3">{t('grades.grade3')}</SelectItem>
                    <SelectItem value="4">{t('grades.grade4')}</SelectItem>
                    <SelectItem value="5">{t('grades.grade5')}</SelectItem>
                    <SelectItem value="6">{t('grades.grade6')}</SelectItem>
                    <SelectItem value="7">{t('grades.grade7')}</SelectItem>
                    <SelectItem value="8">{t('grades.grade8')}</SelectItem>
                    <SelectItem value="9">{t('grades.grade9')}</SelectItem>
                    <SelectItem value="10">{t('grades.grade10')}</SelectItem>
                    <SelectItem value="11">{t('grades.grade11')}</SelectItem>
                    <SelectItem value="12">{t('grades.grade12')}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <p className="text-sm text-red-600">{errors.grade}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="class_name">
                  {t('student.className')}
                </Label>
                <Input
                  id="class_name"
                  type="text"
                  value={formData.class_name}
                  onChange={(e) => handleInputChange('class_name', e.target.value)}
                  placeholder={t('student.placeholders.className')}
                  disabled={loading}
                />
              </div>

              {/* Transport & Discount */}
              <div className="md:col-span-2 flex flex-col space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="uses_transport" className="text-base">
                      {t('student.usesTransport')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('student.usesTransportDescription')}
                    </p>
                  </div>
                  <Switch
                    id="uses_transport"
                    checked={formData.uses_transport}
                    onCheckedChange={(checked) => handleInputChange('uses_transport', checked)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="invoice_discount">
                    {t('student.invoiceDiscount')}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">MAD</span>
                    <Input
                      id="invoice_discount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.invoice_discount}
                      onChange={(e) => handleInputChange('invoice_discount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="pl-12"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('student.invoiceDiscountDescription')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t('student.profilePicture')}
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
                        {profilePictureUrl ? t('student.changePhoto') : t('student.uploadPhoto')}
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
                    {t('student.photoRequirements')}
                  </p>
                </div>
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
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="parent_name">
                  {t('student.parentName')}
                </Label>
                <Input
                  id="parent_name"
                  type="text"
                  value={formData.parent_name}
                  onChange={(e) => handleInputChange('parent_name', e.target.value)}
                  placeholder={t('student.placeholders.parentName')}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_email">
                  {t('student.parentEmail')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="parent_email"
                    type="email"
                    value={formData.parent_email}
                    onChange={(e) => handleInputChange('parent_email', e.target.value)}
                    placeholder={t('student.placeholders.parentEmail')}
                    className={`pl-9 ${errors.parent_email ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.parent_email && (
                  <p className="text-sm text-red-600">{errors.parent_email}</p>
                )}
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

export default EditStudentPage;