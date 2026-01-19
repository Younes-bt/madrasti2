import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Save, X, User, Mail, Phone, MapPin, Calendar, FileText,
  BookOpen, GraduationCap, Briefcase, ArrowRight, CheckCircle2,
  DollarSign, AlertCircle
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { apiMethods } from '../../services/api';
import financeService from '../../services/finance';
import { toast } from 'sonner';

const AddTeacherPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdTeacherId, setCreatedTeacherId] = useState(null);
  const [createdTeacherName, setCreatedTeacherName] = useState('');

  // Teacher Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    school_subject: 'none',
    teachable_grades: [],
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    bio: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  // Contract Form State
  const [contractData, setContractData] = useState({
    contract_type: 'FULL_TIME_MONTHLY',
    contract_number: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    base_amount: '',
    currency: 'MAD',
    hours_per_week: '',
    lessons_per_week: '',
    transportation_allowance: '0',
    housing_allowance: '0',
    other_allowances: '0',
    social_security_rate: '0',
    tax_exemption_amount: '0',
    is_active: true,
    notes: ''
  });

  const [schoolName, setSchoolName] = useState('madrasti');
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [errors, setErrors] = useState({});

  // Contract Types
  const contractTypes = [
    { value: 'FULL_TIME_MONTHLY', label: t('finance.payroll.fullTime', 'Full-Time (Monthly)') },
    { value: 'PART_TIME_MONTHLY', label: t('finance.payroll.partTime', 'Part-Time (Monthly)') },
    { value: 'HOURLY', label: t('finance.payroll.hourly', 'Hourly') },
    { value: 'PER_LESSON', label: t('finance.payroll.perLesson', 'Per Lesson') },
    { value: 'FIXED_TERM', label: t('finance.payroll.fixedTerm', 'Fixed Term') },
    { value: 'INTERNSHIP', label: t('finance.payroll.internship', 'Internship') },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const response = await apiMethods.get('schools/subjects/');
        const responseData = response.data || response;
        const subjectsData = responseData.results || responseData;
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    const fetchGrades = async () => {
      setLoadingGrades(true);
      try {
        const response = await apiMethods.get('schools/grades/');
        const responseData = response.data || response;
        const gradesData = responseData.results || responseData;
        setGrades(Array.isArray(gradesData) ? gradesData : []);
      } catch (error) {
        console.error('Failed to fetch grades:', error);
        setGrades([]);
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchSubjects();
    fetchGrades();
  }, [t]);

  // Generate contract number on step 2 load
  useEffect(() => {
    if (currentStep === 2 && !contractData.contract_number) {
      setContractData(prev => ({
        ...prev,
        contract_number: `CNT-${Date.now()}`
      }));
    }
  }, [currentStep]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleContractChange = (field, value) => {
    setContractData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
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

  const getItemName = (item) => {
    if (!item) return '';
    const currentLanguage = i18n.language;
    switch (currentLanguage) {
      case 'ar': return item.name_arabic || item.name || '';
      case 'fr': return item.name_french || item.name || '';
      default: return item.name || '';
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = t('validation.firstNameRequired');
    if (!formData.last_name) newErrors.last_name = t('validation.lastNameRequired');
    if (!formData.ar_first_name) newErrors.ar_first_name = t('validation.arabicFirstNameRequired');
    if (!formData.ar_last_name) newErrors.ar_last_name = t('validation.arabicLastNameRequired');
    if (formData.phone && !/^[+]?[0-9\-()\s]+$/.test(formData.phone)) {
      newErrors.phone = t('validation.phoneInvalid');
    }
    if (!formData.gender) newErrors.gender = t('validation.genderRequired', 'Gender is required');
    if (formData.date_of_birth && new Date(formData.date_of_birth) > new Date()) {
      newErrors.date_of_birth = t('validation.dateOfBirthInvalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitStep1 = async () => {
    if (!validateStep1()) {
      toast.error(t('error.pleaseFixErrors'));
      return;
    }

    setLoading(true);
    try {
      const cleanLastName = formData.last_name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').trim();
      const cleanSchoolName = schoolName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').trim();
      const generatedEmail = `${cleanLastName}@${cleanSchoolName}-teachers.com`;

      const apiData = {
        email: generatedEmail,
        password: 'defaultStrongPassword25',
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: 'TEACHER',
        ar_first_name: formData.ar_first_name,
        ar_last_name: formData.ar_last_name,
        ...(formData.school_subject && formData.school_subject !== 'none' && { school_subject: formData.school_subject }),
        ...(formData.teachable_grades && formData.teachable_grades.length > 0 && { teachable_grades: formData.teachable_grades }),
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
        ...(formData.address && { address: formData.address }),
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.emergency_contact_name && { emergency_contact_name: formData.emergency_contact_name }),
        ...(formData.emergency_contact_phone && { emergency_contact_phone: formData.emergency_contact_phone })
      };

      const response = await apiMethods.post('users/register/', apiData);
      console.log('Teacher created response:', response);

      const teacherId = response.id || response.data?.id || response.user?.id;

      if (!teacherId) {
        console.error('Could not extract teacher ID', response);
        toast.error(t('error.createTeacherFailed', 'Failed to get teacher ID'));
        return;
      }

      setCreatedTeacherId(teacherId);
      setCreatedTeacherName(`${formData.first_name} ${formData.last_name}`);

      toast.success(t('teacher.createSuccess', { name: `${formData.first_name} ${formData.last_name}`, email: generatedEmail }));
      setCurrentStep(2);

    } catch (error) {
      console.error('Failed to create teacher:', error);

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

          // Show specific toast if common errors
          if (newErrors.email) {
            toast.error(t('error.emailExists', 'A user with this email/name already exists.'));
          } else {
            toast.error(t('error.pleaseFixErrors', 'Please fix the errors in the form.'));
          }
        } else {
          toast.error(errorData.error || errorData.detail || t('error.createTeacherFailed'));
        }
      } else {
        toast.error(t('error.createTeacherFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep2 = async () => {
    if (!createdTeacherId) {
      toast.error("Teacher ID is missing. Please restart the process.");
      console.error("Attempted to submit contract without teacher ID");
      return;
    }

    if (!contractData.base_amount || !contractData.start_date || !contractData.contract_number) {
      toast.error(t('finance.payroll.fillRequiredFields', 'Please fill in all required contract fields'));
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...contractData,
        employee: createdTeacherId,
        end_date: contractData.end_date || null,
        hours_per_week: contractData.hours_per_week || null,
        lessons_per_week: contractData.lessons_per_week || null,
        transportation_allowance: contractData.transportation_allowance || 0,
        housing_allowance: contractData.housing_allowance || 0,
        other_allowances: contractData.other_allowances || 0,
        social_security_rate: contractData.social_security_rate || 0,
        tax_exemption_amount: contractData.tax_exemption_amount || 0
      };

      await financeService.createContract(submissionData);
      toast.success(t('finance.payroll.contractCreated', 'Contract created successfully'));
      navigate('/admin/school-management/teachers');
    } catch (error) {
      console.error('Failed to create contract:', error);
      toast.error(error.message || t('finance.payroll.failedToSaveContract', 'Failed to save contract'));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/admin/school-management/teachers');
  };

  // Render Steps
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-current'}`}>
            1
          </div>
          <span className="ml-2 font-medium">{t('teacher.basicInformation')}</span>
        </div>
        <div className={`w-20 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-current'}`}>
            2
          </div>
          <span className="ml-2 font-medium">{t('finance.payroll.contractDetails', 'Contract Details')}</span>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('teacher.basicInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="required">{t('common.firstName')}</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder={t('teacher.placeholders.firstName')}
              className={errors.first_name ? 'border-destructive' : ''}
            />
            {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="required">{t('common.lastName')}</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              placeholder={t('teacher.placeholders.lastName')}
              className={errors.last_name ? 'border-destructive' : ''}
            />
            {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ar_first_name" className="required">{t('common.arabicFirstName')}</Label>
            <Input
              id="ar_first_name"
              value={formData.ar_first_name}
              onChange={(e) => handleInputChange('ar_first_name', e.target.value)}
              placeholder={t('teacher.placeholders.arabicFirstName')}
              className={errors.ar_first_name ? 'border-destructive' : ''}
              dir="rtl"
            />
            {errors.ar_first_name && <p className="text-sm text-destructive">{errors.ar_first_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ar_last_name" className="required">{t('common.arabicLastName')}</Label>
            <Input
              id="ar_last_name"
              value={formData.ar_last_name}
              onChange={(e) => handleInputChange('ar_last_name', e.target.value)}
              placeholder={t('teacher.placeholders.arabicLastName')}
              className={errors.ar_last_name ? 'border-destructive' : ''}
              dir="rtl"
            />
            {errors.ar_last_name && <p className="text-sm text-destructive">{errors.ar_last_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="school_subject">{t('teacher.schoolSubject')}</Label>
            <Select
              value={formData.school_subject}
              onValueChange={(value) => handleInputChange('school_subject', value)}
              disabled={loading || loadingSubjects}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('teacher.placeholders.selectSubject')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('teacher.selectSubject')}</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {getItemName(subject)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">{t('common.dateOfBirth')}</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="required">{t('common.gender', 'Gender')}</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            >
              <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                <SelectValue placeholder={t('common.selectGender', 'Select Gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">{t('common.male', 'Male')}</SelectItem>
                <SelectItem value="FEMALE">{t('common.female', 'Female')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('common.phone', 'Phone Number')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('teacher.placeholders.phone', 'Enter phone number')}
              className={errors.phone ? 'border-destructive' : ''}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {t('teacher.teachableGrades')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border/50 rounded-md p-3 bg-muted/50 min-h-[80px] max-h-[150px] overflow-y-auto">
            {grades && grades.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {grades.map((grade) => (
                  <div key={grade.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${grade.id}`}
                      checked={formData.teachable_grades.includes(grade.id)}
                      onCheckedChange={() => handleGradeToggle(grade.id)}
                    />
                    <Label htmlFor={`grade-${grade.id}`} className="cursor-pointer font-normal">
                      {getItemName(grade)}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center">{t('teacher.noGradesAvailable')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={() => navigate('/admin/school-management/teachers')}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmitStep1} disabled={loading}>
          {loading ? t('common.saving') : t('common.next')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg flex items-center gap-3 border border-emerald-200">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <div>
          <p className="font-medium">{t('teacher.createSuccessTitle', 'Teacher Account Created!')}</p>
          <p className="text-sm">{t('teacher.createContractDesc', 'You can now create an employment contract for')} <strong>{createdTeacherName}</strong>.</p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {t('finance.payroll.contractDetails', 'Contract Details')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="required">{t('finance.payroll.contractType', 'Contract Type')}</Label>
            <Select
              value={contractData.contract_type}
              onValueChange={(val) => handleContractChange('contract_type', val)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {contractTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="required">{t('finance.payroll.contractNumber', 'Contract Number')}</Label>
            <Input
              value={contractData.contract_number}
              onChange={(e) => handleContractChange('contract_number', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="required">{t('finance.payroll.startDate', 'Start Date')}</Label>
            <Input
              type="date"
              value={contractData.start_date}
              onChange={(e) => handleContractChange('start_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('finance.payroll.endDate', 'End Date (Optional)')}</Label>
            <Input
              type="date"
              value={contractData.end_date}
              onChange={(e) => handleContractChange('end_date', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="required">{t('finance.payroll.baseSalary', 'Base Salary')}</Label>
            <div className="relative">
              <Input
                type="number"
                value={contractData.base_amount}
                onChange={(e) => handleContractChange('base_amount', e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">MAD</span>
            </div>
          </div>
        </CardContent>

        {/* Allowances Section */}
        <div className="border-t p-6 mt-2">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            {t('finance.payroll.compensation', 'Allowances')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('finance.payroll.transportation', 'Transportation')}</Label>
              <Input
                type="number"
                value={contractData.transportation_allowance}
                onChange={(e) => handleContractChange('transportation_allowance', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('finance.payroll.housing', 'Housing')}</Label>
              <Input
                type="number"
                value={contractData.housing_allowance}
                onChange={(e) => handleContractChange('housing_allowance', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('finance.payroll.others', 'Others')}</Label>
              <Input
                type="number"
                value={contractData.other_allowances}
                onChange={(e) => handleContractChange('other_allowances', e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={handleSkip}>
          {t('common.skip', 'Skip & Finish')}
        </Button>
        <Button onClick={handleSubmitStep2} disabled={loading}>
          {loading ? t('common.saving') : t('common.saveAndFinish', 'Save & Finish')}
          <CheckCircle2 className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <AdminPageLayout
      title={t('teacher.addNewTeacher')}
      subtitle={t('teacher.addNewTeacherDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/teachers"
    >
      <div className="max-w-4xl mx-auto">
        {renderStepIndicator()}
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </div>
    </AdminPageLayout>
  );
};

export default AddTeacherPage;