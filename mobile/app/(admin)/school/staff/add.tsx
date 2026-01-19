import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
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
    Mail,
    FileText,
    Check,
    ChevronDown,
    X
} from 'lucide-react-native';
import { STAFF_POSITION_OPTIONS, getStaffPositionLabel } from '../../../../constants/staff';

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
        placeholderColor: isDark ? '#94a3b8' : '#64748b',
    };
};

export default function AddStaffPage() {
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);

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
    const [errors, setErrors] = useState<any>({});

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

    // Position Modal State
    const [showPositionModal, setShowPositionModal] = useState(false);

    const schoolName = 'madrasti'; // Should be dynamic ideally

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.first_name) newErrors.first_name = t('validation.firstNameRequired') || 'First Name is required';
        if (!formData.last_name) newErrors.last_name = t('validation.lastNameRequired') || 'Last Name is required';
        if (!formData.ar_first_name) newErrors.ar_first_name = t('validation.arabicFirstNameRequired') || 'Arabic First Name is required';
        if (!formData.ar_last_name) newErrors.ar_last_name = t('validation.arabicLastNameRequired') || 'Arabic Last Name is required';
        if (!formData.position) newErrors.position = t('validation.positionRequired') || 'Position is required';

        if (formData.phone && !/^[\+]?[0-9\-\(\)\s]+$/.test(formData.phone)) {
            newErrors.phone = t('validation.phoneInvalid') || 'Invalid phone format';
        }

        // Simple date regex for YYYY-MM-DD if manually entered, though a date picker is better.
        // For simplicity in this iteration, we use text input for date (YYYY-MM-DD).
        if (formData.date_of_birth && !/^\d{4}-\d{2}-\d{2}$/.test(formData.date_of_birth)) {
            // Optional: Be lenient or strict. Let's assume text input for now.
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showAlert(t('error.error'), t('error.pleaseFixErrors') || 'Please fix the errors in the form.', 'error');
            return;
        }

        setLoading(true);
        try {
            const cleanLastName = formData.last_name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').trim();
            const cleanSchoolName = schoolName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').trim();
            const generatedEmail = `${cleanLastName}@${cleanSchoolName}-team.com`;

            const apiData = {
                email: generatedEmail,
                password: 'defaultStrongPassword25',
                first_name: formData.first_name,
                last_name: formData.last_name,
                role: 'STAFF',
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

            await api.post('/users/register/', apiData);

            showAlert(
                t('common.success') || 'Success',
                t('staff.createSuccess', { name: `${formData.first_name} ${formData.last_name}` }) || `Staff member created successfully.`,
                'success',
                () => {
                    router.back();
                }
            );

        } catch (error: any) {
            console.error('Failed to create staff:', error);
            const msg = error.response?.data?.detail || error.response?.data?.error || t('error.createStaffFailed') || 'Failed to create staff member';

            let finalMsg = msg;
            if (error.response?.data && typeof error.response.data === 'object') {
                // Try to get the first error message from the object
                const keys = Object.keys(error.response.data);
                if (keys.length > 0) {
                    const key = keys[0];
                    const val = error.response.data[key];
                    finalMsg = `${key}: ${Array.isArray(val) ? val[0] : val}`;
                }
            }

            showAlert('Error', finalMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label: string, field: keyof typeof formData, placeholder: string, required = false, isArabicInput = false, multiline = false) => (
        <View className="mb-4">
            <Text className={`mb-2 text-sm font-medium ${colors.textColor} ${isRTL ? 'text-right' : 'text-left'}`}>
                {label} {required && <Text className="text-red-500">*</Text>}
            </Text>
            <TextInput
                value={formData[field]}
                onChangeText={(text) => handleInputChange(field, text)}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholderColor}
                className={`p-4 rounded-2xl border ${errors[field] ? 'border-red-500' : colors.borderColor} ${colors.inputBg} ${colors.textColor} ${isArabicInput ? 'text-right' : 'text-left'}`}
                textAlign={isArabicInput || (isRTL && !field.includes('email')) ? 'right' : 'left'}
                multiline={multiline}
                style={[
                    multiline && { minHeight: 100, textAlignVertical: 'top' }
                ]}
            />
            {errors[field] && <Text className="text-red-500 text-xs mt-1 text-right">{errors[field]}</Text>}
        </View>
    );

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
                        {t('staff.addNewStaff') || 'Add New Staff'}
                    </Text>
                    <View className="w-10" />
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={isDark ? "#fff" : "#4f46e5"} />
                    </View>
                ) : (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                            {/* Basic Info */}
                            <View className={`p-4 rounded-3xl ${colors.cardBgColor} border ${colors.borderColor} mb-6`}>
                                <View className="flex-row items-center gap-3 mb-6">
                                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                        <User size={20} color={isDark ? '#818cf8' : '#4f46e5'} />
                                    </View>
                                    <Text className={`text-lg font-bold ${colors.textColor}`}>{t('staff.basicInformation') || 'Basic Information'}</Text>
                                </View>

                                {renderInput(t('common.firstName') || 'First Name', 'first_name', 'Enter first name', true)}
                                {renderInput(t('common.lastName') || 'Last Name', 'last_name', 'Enter last name', true)}
                                {renderInput(t('common.arabicFirstName') || 'First Name (Arabic)', 'ar_first_name', 'الاسم الشخصي', true, true)}
                                {renderInput(t('common.arabicLastName') || 'Last Name (Arabic)', 'ar_last_name', 'الاسم العائلي', true, true)}

                                {/* Position Select */}
                                <View className="mb-4">
                                    <Text className={`mb-2 text-sm font-medium ${colors.textColor} ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {t('staff.position') || 'Position'} <Text className="text-red-500">*</Text>
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowPositionModal(true)}
                                        className={`flex-row items-center justify-between p-4 rounded-2xl border ${errors.position ? 'border-red-500' : colors.borderColor} ${colors.inputBg}`}
                                    >
                                        <Text className={`${formData.position ? colors.textColor : colors.placeholderColor}`}>
                                            {formData.position ? getStaffPositionLabel(t, formData.position, i18n.language) : (t('staff.selectPosition') || 'Select Position')}
                                        </Text>
                                        <ChevronDown size={20} color={colors.subTextColor.split(' ')[0].replace('text-', '') === 'white/60' ? '#ffffff99' : '#4b5563'} />
                                    </Pressable>
                                    {errors.position && <Text className="text-red-500 text-xs mt-1 text-right">{errors.position}</Text>}
                                </View>

                                {/* Generated Email Display */}
                                <View className="mb-4">
                                    <Text className={`mb-2 text-sm font-medium ${colors.textColor} ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {t('staff.generatedEmail') || 'Generated Email'}
                                    </Text>
                                    <View className={`p-4 rounded-2xl border ${colors.borderColor} bg-black/5 flex-row items-center gap-3`}>
                                        <Mail size={18} color={colors.placeholderColor} />
                                        <Text className={`${colors.textColor} font-mono text-sm`}>
                                            {formData.last_name ?
                                                `${formData.last_name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}@${schoolName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}-team.com`
                                                : '...'}
                                        </Text>
                                    </View>
                                </View>

                                {renderInput(t('common.phone') || 'Phone', 'phone', '+1234567890')}
                                {renderInput(t('common.dateOfBirth') || 'Date of Birth (YYYY-MM-DD)', 'date_of_birth', 'YYYY-MM-DD')}

                            </View>

                            {/* Additional Info */}
                            <View className={`p-4 rounded-3xl ${colors.cardBgColor} border ${colors.borderColor} mb-6`}>
                                <View className="flex-row items-center gap-3 mb-6">
                                    <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                        <FileText size={20} color={isDark ? '#818cf8' : '#4f46e5'} />
                                    </View>
                                    <Text className={`text-lg font-bold ${colors.textColor}`}>{t('staff.additionalInformation') || 'Additional Information'}</Text>
                                </View>

                                {renderInput(t('common.address') || 'Address', 'address', 'Full Address', false, false, true)}
                                {renderInput(t('common.bio') || 'Bio', 'bio', 'Short biography...', false, false, true)}
                                {renderInput(t('staff.emergencyContactName') || 'Emergency Contact Name', 'emergency_contact_name', 'Name')}
                                {renderInput(t('staff.emergencyContactPhone') || 'Emergency Contact Phone', 'emergency_contact_phone', 'Phone')}
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row gap-4 mb-8">
                                <Pressable
                                    onPress={() => router.back()}
                                    className={`flex-1 py-4 rounded-2xl border ${colors.borderColor} active:opacity-70 items-center`}
                                >
                                    <Text className={`${colors.textColor} font-bold text-lg`}>{t('common.cancel') || 'Cancel'}</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleSubmit}
                                    className="flex-1 py-4 rounded-2xl bg-indigo-600 active:opacity-90 items-center"
                                >
                                    <Text className="text-white font-bold text-lg">{t('common.save') || 'Save Staff'}</Text>
                                </Pressable>
                            </View>

                        </ScrollView>
                    </KeyboardAvoidingView>
                )}

                {/* Position Modal */}
                <Modal
                    visible={showPositionModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowPositionModal(false)}
                >
                    <View className="flex-1 bg-black/50 justify-center items-center p-6">
                        <View className={`w-full max-h-[80%] rounded-3xl ${isDark ? 'bg-[#1e293b]' : 'bg-white'} overflow-hidden`}>
                            <View className="p-4 border-b border-gray-200 dark:border-gray-700 flex-row justify-between items-center">
                                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('staff.selectPosition') || 'Select Position'}</Text>
                                <Pressable onPress={() => setShowPositionModal(false)}>
                                    <X size={24} color={isDark ? '#fff' : '#000'} />
                                </Pressable>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {STAFF_POSITION_OPTIONS.map((option) => (
                                    <Pressable
                                        key={option.value}
                                        onPress={() => {
                                            handleInputChange('position', option.value);
                                            setShowPositionModal(false);
                                        }}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-800 active:bg-gray-100 dark:active:bg-gray-800 flex-row justify-between items-center`}
                                    >
                                        <Text className={`text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                            {getStaffPositionLabel(t, option.value, i18n.language)}
                                        </Text>
                                        {formData.position === option.value && (
                                            <Check size={20} color="#4f46e5" />
                                        )}
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                <CustomAlert
                    visible={alertConfig.visible}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={alertConfig.onClose}
                    confirmText={t('common.ok') || "OK"}
                />

            </SafeAreaView>
        </View >
    );
}
