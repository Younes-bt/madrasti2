import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../context/ThemeContext';
import api from '../../../../api/client';
import CustomAlert from '../../../../components/CustomAlert';
import {
    ChevronLeft,
    User,
    Briefcase,
    ArrowRight,
    CheckCircle2,
    DollarSign,
    ChevronDown,
    X,
    GraduationCap,
    Calendar
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Helper for styles
const getColors = (isDark: boolean) => {
    return {
        bgColors: isDark
            ? ['#0f0c29', '#302b63', '#24243e'] as const
            : ['#f0f9ff', '#e0f2fe', '#bae6fd'] as const,
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/60' : 'text-gray-600',
        iconColor: isDark ? '#fff' : '#1e293b',
        cardBgColor: isDark ? 'bg-white/5' : 'bg-white/60',
        borderColor: isDark ? 'border-white/10' : 'border-white/40',
        inputBg: isDark ? 'bg-white/10' : 'bg-white/50',
        modalOverlay: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
        modalBg: isDark ? '#1e293b' : '#ffffff',
    };
};

// Reusable Select Modal Component
const SelectionModal = ({
    visible,
    onClose,
    title,
    options,
    onSelect,
    currentValue,
    isDark
}: {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
    currentValue: any;
    isDark: boolean;
}) => {
    if (!visible) return null;
    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className={`w-full max-h-[80%] rounded-3xl ${isDark ? 'bg-[#1e293b]' : 'bg-white'} overflow-hidden`}>
                    <View className="p-4 border-b border-gray-200 dark:border-gray-700 flex-row justify-between items-center">
                        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</Text>
                        <Pressable onPress={onClose}>
                            <X size={24} color={isDark ? '#fff' : '#000'} />
                        </Pressable>
                    </View>
                    <ScrollView className="p-2">
                        {options.map((opt) => (
                            <Pressable
                                key={opt.value}
                                onPress={() => { onSelect(opt.value); onClose(); }}
                                className={`p-4 border-b border-gray-100 dark:border-gray-800 ${currentValue === opt.value ? (isDark ? 'bg-blue-500/20' : 'bg-blue-50') : ''}`}
                            >
                                <Text className={`text-base ${isDark ? 'text-white' : 'text-gray-900'} ${currentValue === opt.value ? 'font-bold' : ''}`}>
                                    {opt.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const Label = ({ children, required, colors }: { children: string, required?: boolean, colors: any }) => (
    <Text className={`mb-2 font-medium ${colors.textColor} text-sm ml-1`}>
        {children} {required && <Text className="text-red-500">*</Text>}
    </Text>
);

const InputField = ({ label, value, onChange, placeholder, required, keyboardType = 'default', isRTLInput = false, colors, isDark, isRTL }: any) => (
    <View className="mb-4">
        <Label required={required} colors={colors}>{label}</Label>
        <TextInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            keyboardType={keyboardType}
            className={`w-full p-4 rounded-xl border ${colors.borderColor} ${colors.inputBg} ${colors.textColor}`}
            style={{ textAlign: isRTLInput && isRTL ? 'right' : isRTLInput ? 'right' : 'left' }}
        />
    </View>
);

const SelectButton = ({ label, value, onPress, required, colors, defaultText }: any) => (
    <View className="mb-4">
        <Label required={required} colors={colors}>{label}</Label>
        <Pressable
            onPress={onPress}
            className={`w-full p-4 rounded-xl border ${colors.borderColor} ${colors.inputBg} flex-row justify-between items-center`}
        >
            <Text className={`${value ? colors.textColor : 'text-gray-400'}`}>
                {value || defaultText}
            </Text>
            <ChevronDown size={20} color={colors.iconColor} />
        </Pressable>
    </View>
);

const DateInputField = ({ label, value, onChange, placeholder, required, colors, isDark }: any) => {
    const [show, setShow] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date();
        if (Platform.OS === 'android') {
            setShow(false);
        }

        if (event.type === 'set' || Platform.OS === 'ios' || Platform.OS === 'web') {
            // Format to YYYY-MM-DD
            const formatted = currentDate.toISOString().split('T')[0];
            onChange(formatted);
        }
    };

    const dateValue = value ? new Date(value) : new Date();

    if (Platform.OS === 'web') {
        return (
            <View className="mb-4">
                <Label required={required} colors={colors}>{label}</Label>
                <View className={`w-full p-3 rounded-xl border ${colors.borderColor} ${colors.inputBg}`}>
                    {/* @ts-ignore */}
                    {React.createElement('input', {
                        type: 'date',
                        value: value || '',
                        onChange: (e: any) => onChange(e.target.value),
                        style: {
                            height: '100%',
                            width: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: isDark ? 'white' : 'black',
                            outline: 'none',
                            fontFamily: 'System',
                            fontSize: 16
                        }
                    })}
                </View>
            </View>
        );
    }

    return (
        <View className="mb-4">
            <Label required={required} colors={colors}>{label}</Label>
            <Pressable
                onPress={() => setShow(true)}
                className={`w-full p-4 rounded-xl border ${colors.borderColor} ${colors.inputBg} flex-row justify-between items-center`}
            >
                <Text className={`${value ? colors.textColor : 'text-gray-400'}`}>
                    {value || placeholder}
                </Text>
                <Calendar size={20} color={colors.iconColor} />
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dateValue}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date(1950, 0, 1)}
                    maximumDate={new Date(2050, 11, 31)}
                />
            )}
        </View>
    );
};

export default function AddTeacherPage() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Data Loading
    const [subjects, setSubjects] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        ar_first_name: '',
        ar_last_name: '',
        school_subject: 'none',
        teachable_grades: [] as number[],
        phone: '',
        date_of_birth: '',
        address: '',
        bio: '',
        emergency_contact_name: '',
        emergency_contact_phone: ''
    });

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

    const [createdTeacherId, setCreatedTeacherId] = useState<number | null>(null);
    const [createdTeacherName, setCreatedTeacherName] = useState('');

    // Modals
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [showContractTypeModal, setShowContractTypeModal] = useState(false);

    // Alert State
    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        onClose: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        onClose: () => { }
    });

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', onClose: () => void = () => { }) => {
        setAlertConfig({
            visible: true,
            title,
            message,
            type,
            onClose: () => {
                setAlertConfig(prev => ({ ...prev, visible: false }));
                onClose();
            }
        });
    };

    // Initial Data Fetch
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [subjRes, gradeRes] = await Promise.all([
                    api.get('/schools/subjects/'),
                    api.get('/schools/grades/')
                ]);
                setSubjects(Array.isArray(subjRes.data) ? subjRes.data : subjRes.data?.results || []);
                setGrades(Array.isArray(gradeRes.data) ? gradeRes.data : gradeRes.data?.results || []);
            } catch (error) {
                console.error('Failed to fetch metadata', error);
                showAlert('Error', 'Failed to load school data', 'error');
            }
        };
        fetchMetadata();
    }, []);

    // Contract Number Generator
    useEffect(() => {
        if (currentStep === 2 && !contractData.contract_number) {
            setContractData(prev => ({
                ...prev,
                contract_number: `CNT-${Date.now()}`
            }));
        }
    }, [currentStep, contractData.contract_number]);

    // Handlers
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContractChange = (field: string, value: string) => {
        setContractData(prev => ({ ...prev, [field]: value }));
    };

    const toggleGrade = (gradeId: number) => {
        setFormData(prev => ({
            ...prev,
            teachable_grades: prev.teachable_grades.includes(gradeId)
                ? prev.teachable_grades.filter(id => id !== gradeId)
                : [...prev.teachable_grades, gradeId]
        }));
    };

    const isValidDate = (dateString: string) => {
        // Basic format check YYYY-MM-DD
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        // Logical date check
        const date = new Date(dateString);
        const [year, month, day] = dateString.split('-').map(Number);

        return date instanceof Date &&
            !isNaN(date.getTime()) &&
            date.getFullYear() === year &&
            date.getMonth() + 1 === month &&
            date.getDate() === day;
    };

    const validateStep1 = () => {
        if (!formData.first_name || !formData.last_name) return false;
        if (!formData.ar_first_name || !formData.ar_last_name) return false;
        return true;
    };

    const handleSubmitStep1 = async () => {
        if (!validateStep1()) {
            showAlert(t('common.error'), t('error.fillRequiredFields') || "Please fill all required fields", 'error');
            return;
        }

        if (formData.date_of_birth && !isValidDate(formData.date_of_birth)) {
            showAlert(t('common.error'), "Invalid Date of Birth format. Please use YYYY-MM-DD (e.g. 2000-01-31)", 'error');
            return;
        }

        setLoading(true);
        try {
            const cleanLastName = formData.last_name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').trim();
            const generatedEmail = `${cleanLastName}@madrasti-teachers.com`; // Placeholder or dynamic if school name available

            const apiData = {
                ...formData,
                email: generatedEmail,
                password: 'defaultStrongPassword25', // Should be handled better in real prod but matching web logic
                role: 'TEACHER',
                school_subject: formData.school_subject !== 'none' ? formData.school_subject : undefined,
                teachable_grades: formData.teachable_grades.length > 0 ? formData.teachable_grades : undefined
            };

            const response = await api.post('/users/register/', apiData);
            const teacherId = response.data?.id || response.data?.user?.id;

            if (teacherId) {
                setCreatedTeacherId(teacherId);
                setCreatedTeacherName(`${formData.first_name} ${formData.last_name}`);
                setCurrentStep(2);
            } else {
                throw new Error("No ID returned");
            }
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.email ? 'Email/User already exists' : (error.response?.data?.detail || 'Failed to create teacher');
            showAlert('Error', msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitStep2 = async () => {
        if (!createdTeacherId) return;
        if (!contractData.base_amount || !contractData.start_date) {
            showAlert('Error', 'Please fill Base Salary and Start Date', 'error');
            return;
        }

        if (!isValidDate(contractData.start_date)) {
            showAlert(t('common.error'), "Invalid Start Date format. Please use YYYY-MM-DD", 'error');
            return;
        }
        if (contractData.end_date && !isValidDate(contractData.end_date)) {
            showAlert(t('common.error'), "Invalid End Date format. Please use YYYY-MM-DD", 'error');
            return;
        }

        setLoading(true);
        try {
            const submissionData = {
                ...contractData,
                employee: createdTeacherId,
                end_date: contractData.end_date || null,
                base_amount: parseFloat(contractData.base_amount),
                hours_per_week: contractData.hours_per_week ? parseFloat(contractData.hours_per_week) : null,
                lessons_per_week: contractData.lessons_per_week ? parseInt(contractData.lessons_per_week) : null,
                transportation_allowance: parseFloat(contractData.transportation_allowance) || 0,
                housing_allowance: parseFloat(contractData.housing_allowance) || 0,
                other_allowances: parseFloat(contractData.other_allowances) || 0,
                social_security_rate: parseFloat(contractData.social_security_rate) || 0,
                tax_exemption_amount: parseFloat(contractData.tax_exemption_amount) || 0,
            };

            await api.post('/finance/contracts/', submissionData);
            showAlert('Success', 'Teacher and Contract created successfully!', 'success', () => {
                router.push('/(admin)/school/teachers' as any);
            });
        } catch (error: any) {
            console.error(error);
            showAlert('Error', error.response?.data?.detail || 'Failed to create contract', 'error');
        } finally {
            setLoading(false);
        }
    };

    // UI Helpers


    return (
        <View className="flex-1">
            <LinearGradient
                colors={colors.bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />
            {isDark && <View className="absolute inset-0 bg-black/10" />}

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-6 pt-4 pb-2 flex-row items-center justify-between z-50">
                    <Pressable
                        onPress={() => router.back()}
                        className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'} border active:opacity-70`}
                    >
                        <ChevronLeft size={24} color={colors.iconColor} />
                    </Pressable>
                    <Text className={`${colors.textColor} text-xl font-bold tracking-wider`}>
                        {t('teacher.addNewTeacher') || 'Add New Teacher'}
                    </Text>
                    <View className="w-10" />
                </View>

                {/* Step Indicator */}
                <View className="px-6 py-4 flex-row items-center justify-center">
                    <View className={`flex-row items-center ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                        <View className={`w-8 h-8 rounded-full items-center justify-center ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-400'}`}>
                            <Text className="text-white font-bold">1</Text>
                        </View>
                        <Text className={`ml-2 font-medium ${colors.textColor}`} style={{ display: 'none' }}>{t('teacher.basicInfo')}</Text>
                    </View>
                    <View className={`w-12 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-400/30'}`} />
                    <View className={`flex-row items-center ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                        <View className={`w-8 h-8 rounded-full items-center justify-center ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-400'}`}>
                            <Text className="text-white font-bold">2</Text>
                        </View>
                    </View>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>

                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <View className="space-y-4">
                                <View className={`p-4 rounded-2xl ${colors.cardBgColor} border ${colors.borderColor}`}>
                                    <View className="flex-row items-center gap-2 mb-4">
                                        <User size={20} color={colors.iconColor} />
                                        <Text className={`text-lg font-bold ${colors.textColor}`}>Basic Information</Text>
                                    </View>

                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label={t('common.firstName') || "First Name"}
                                        value={formData.first_name}
                                        onChange={(v: string) => handleInputChange('first_name', v)}
                                        placeholder="John"
                                        required
                                    />
                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label={t('common.lastName') || "Last Name"}
                                        value={formData.last_name}
                                        onChange={(v: string) => handleInputChange('last_name', v)}
                                        placeholder="Doe"
                                        required
                                    />
                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label={t('common.arabicFirstName') || "Arabic First Name"}
                                        value={formData.ar_first_name}
                                        onChange={(v: string) => handleInputChange('ar_first_name', v)}
                                        placeholder="الاسم"
                                        required
                                        isRTLInput
                                    />
                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label={t('common.arabicLastName') || "Arabic Last Name"}
                                        value={formData.ar_last_name}
                                        onChange={(v: string) => handleInputChange('ar_last_name', v)}
                                        placeholder="النسب"
                                        required
                                        isRTLInput
                                    />

                                    <SelectButton colors={colors} defaultText={t('common.select')}
                                        label={t('teacher.schoolSubject') || "Subject"}
                                        value={formData.school_subject === 'none' ? 'None' : (subjects.find(s => s.id.toString() === formData.school_subject)?.name)}
                                        onPress={() => setShowSubjectModal(true)}
                                    />

                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label={t('common.phone') || "Phone"}
                                        value={formData.phone}
                                        onChange={(v: string) => handleInputChange('phone', v)}
                                        placeholder="+212..."
                                        keyboardType="phone-pad"
                                    />

                                    <DateInputField colors={colors} isDark={isDark}
                                        label={t('common.dob') || "Date of Birth"}
                                        value={formData.date_of_birth}
                                        onChange={(v: string) => handleInputChange('date_of_birth', v)}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>

                                {/* Grades */}
                                <View className={`p-4 rounded-2xl ${colors.cardBgColor} border ${colors.borderColor} mt-4`}>
                                    <View className="flex-row items-center gap-2 mb-4">
                                        <GraduationCap size={20} color={colors.iconColor} />
                                        <Text className={`text-lg font-bold ${colors.textColor}`}>Teachable Grades</Text>
                                    </View>
                                    <View className="flex-row flex-wrap gap-2">
                                        {grades.map(grade => {
                                            const isSelected = formData.teachable_grades.includes(grade.id);
                                            return (
                                                <Pressable
                                                    key={grade.id}
                                                    onPress={() => toggleGrade(grade.id)}
                                                    className={`px-3 py-2 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : `bg-transparent ${colors.borderColor}`}`}
                                                >
                                                    <Text className={`text-sm ${isSelected ? 'text-white' : colors.textColor}`}>
                                                        {grade.name}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </View>

                                <Pressable
                                    onPress={handleSubmitStep1}
                                    disabled={loading}
                                    className={`mt-6 w-full py-4 rounded-2xl bg-blue-600 items-center flex-row justify-center ${loading ? 'opacity-70' : ''}`}
                                >
                                    {loading ? <ActivityIndicator color="#fff" /> : (
                                        <>
                                            <Text className="text-white font-bold text-lg mr-2">{t('common.next') || "Next"}</Text>
                                            <ArrowRight size={20} color="#fff" />
                                        </>
                                    )}
                                </Pressable>
                            </View>
                        )}

                        {/* Step 2: Contract Info */}
                        {currentStep === 2 && (
                            <View className="space-y-4">
                                <View className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl mb-4 flex-row items-center gap-3">
                                    <CheckCircle2 color="#22c55e" size={24} />
                                    <View className="flex-1">
                                        <Text className={`font-bold ${colors.textColor}`}>Account Created!</Text>
                                        <Text className={`text-sm ${colors.subTextColor}`}>Now add contract details for {createdTeacherName}</Text>
                                    </View>
                                </View>

                                <View className={`p-4 rounded-2xl ${colors.cardBgColor} border ${colors.borderColor}`}>
                                    <View className="flex-row items-center gap-2 mb-4">
                                        <Briefcase size={20} color={colors.iconColor} />
                                        <Text className={`text-lg font-bold ${colors.textColor}`}>Contract Details</Text>
                                    </View>

                                    <SelectButton colors={colors} defaultText={t('common.select')}
                                        label={t('finance.contractType') || "Contract Type"}
                                        value={contractData.contract_type}
                                        onPress={() => setShowContractTypeModal(true)}
                                        required
                                    />

                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label={t('finance.contractNumber') || "Contract Number"}
                                        value={contractData.contract_number}
                                        onChange={(v: string) => handleContractChange('contract_number', v)}
                                        required
                                    />

                                    <DateInputField colors={colors} isDark={isDark}
                                        label={t('finance.startDate') || "Start Date"}
                                        value={contractData.start_date}
                                        onChange={(v: string) => handleContractChange('start_date', v)}
                                        required
                                        placeholder="YYYY-MM-DD"
                                    />

                                    <DateInputField colors={colors} isDark={isDark}
                                        label={t('finance.endDate') || "End Date"}
                                        value={contractData.end_date}
                                        onChange={(v: string) => handleContractChange('end_date', v)}
                                        placeholder="YYYY-MM-DD"
                                    />

                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label={t('finance.baseSalary') || "Base Salary (MAD)"}
                                        value={contractData.base_amount}
                                        onChange={(v: string) => handleContractChange('base_amount', v)}
                                        required
                                        keyboardType="numeric"
                                    />
                                </View>

                                {/* Allowances */}
                                <View className={`p-4 rounded-2xl ${colors.cardBgColor} border ${colors.borderColor} mt-4`}>
                                    <View className="flex-row items-center gap-2 mb-4">
                                        <DollarSign size={20} color={colors.iconColor} />
                                        <Text className={`text-lg font-bold ${colors.textColor}`}>Allowances</Text>
                                    </View>

                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label="Transportation"
                                        value={contractData.transportation_allowance}
                                        onChange={(v: string) => handleContractChange('transportation_allowance', v)}
                                        keyboardType="numeric"
                                    />
                                    <InputField colors={colors} isDark={isDark} isRTL={isRTL}
                                        label="Housing"
                                        value={contractData.housing_allowance}
                                        onChange={(v: string) => handleContractChange('housing_allowance', v)}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View className="flex-row gap-4 mt-6">
                                    <Pressable
                                        onPress={() => router.push('/(admin)/school/teachers' as any)}
                                        className={`flex-1 py-4 rounded-2xl border ${colors.borderColor} items-center`}
                                    >
                                        <Text className={`${colors.textColor} font-bold`}>{t('common.skip') || "Skip"}</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={handleSubmitStep2}
                                        disabled={loading}
                                        className={`flex-1 py-4 rounded-2xl bg-blue-600 items-center flex-row justify-center ${loading ? 'opacity-70' : ''}`}
                                    >
                                        {loading ? <ActivityIndicator color="#fff" /> : (
                                            <>
                                                <Text className="text-white font-bold text-lg mr-2">{t('common.save') || "Save"}</Text>
                                                <CheckCircle2 size={20} color="#fff" />
                                            </>
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        )}

                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Modals */}
                <SelectionModal
                    visible={showSubjectModal}
                    onClose={() => setShowSubjectModal(false)}
                    title="Select Subject"
                    options={[
                        { label: 'None', value: 'none' },
                        ...subjects.map(s => ({ label: isRTL && s.name_arabic ? s.name_arabic : s.name, value: s.id.toString() }))
                    ]}
                    onSelect={(val) => handleInputChange('school_subject', val)}
                    currentValue={formData.school_subject}
                    isDark={isDark}
                />

                <SelectionModal
                    visible={showContractTypeModal}
                    onClose={() => setShowContractTypeModal(false)}
                    title="Contract Type"
                    options={[
                        { value: 'FULL_TIME_MONTHLY', label: 'Full-Time (Monthly)' },
                        { value: 'PART_TIME_MONTHLY', label: 'Part-Time (Monthly)' },
                        { value: 'HOURLY', label: 'Hourly' },
                        { value: 'PER_LESSON', label: 'Per Lesson' },
                        { value: 'FIXED_TERM', label: 'Fixed Term' },
                        { value: 'INTERNSHIP', label: 'Internship' },
                    ]}
                    onSelect={(val) => handleContractChange('contract_type', val)}
                    currentValue={contractData.contract_type}
                    isDark={isDark}
                />

                <CustomAlert
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={alertConfig.onClose}
                    confirmText={t('common.ok') || "OK"}
                />

            </SafeAreaView>
        </View>
    );
}
