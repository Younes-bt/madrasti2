import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../context/ThemeContext';
import api from '../../../../api/client';
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    CheckCircle,
    XCircle,
    Calendar,
    School,
    GraduationCap
} from 'lucide-react-native';

const getColors = (isDark: boolean) => {
    return {
        bgColors: isDark
            ? ['#0A0118', '#1A0B2E', '#2D1B4E'] as const // Deep Purple Gradient
            : ['#F8FAFC', '#F1F5F9', '#E2E8F0'] as const, // Soft Gray-Blue
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/60' : 'text-gray-600',
        iconColor: isDark ? '#fff' : '#1e293b',
        cardBgColor: isDark ? 'bg-white/5' : 'bg-white/60',
        borderColor: isDark ? 'border-white/10' : 'border-white/40',
        accentColor: isDark ? '#8B5CF6' : '#7C3AED', // Purple for Students
    };
};

export default function StudentProfile() {
    const { id } = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);

    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState<any | null>(null);
    const [enrollment, setEnrollment] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchStudentDetails = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // 1. Fetch User Details
            const userRes = await api.get(`/users/users/${id}/`);
            setStudent(userRes.data);

            // 2. Fetch Enrollment (Academic Info) - Try to find by student ID
            try {
                // Assuming we can filter enrollments by student
                // If not available, we might skip this or need a specific endpoint
                const enrollRes = await api.get(`/users/enrollments/?student=${id}`);
                const enrollmentData = enrollRes.data?.results?.[0] || enrollRes.data?.[0] || null;
                setEnrollment(enrollmentData);
            } catch (e) {
                console.log('Failed to fetch enrollment specific details', e);
            }

        } catch (err: any) {
            console.error('Failed to fetch student details:', err);
            setError(t('error.failedToLoadData') || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [id, t]);

    useEffect(() => {
        if (id) {
            fetchStudentDetails();
        }
    }, [id, fetchStudentDetails]);

    const openUrl = (url: string) => {
        if (!url) return;
        Linking.openURL(url).catch(err => console.error("Couldn't open URL", err));
    };

    const getDisplayName = (user: any) => {
        if (!user) return '';
        if (isRTL && (user.ar_first_name || user.ar_last_name)) {
            return `${user.ar_first_name || ''} ${user.ar_last_name || ''}`.trim();
        }
        return user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim();
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <LinearGradient
                    colors={colors.bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <ActivityIndicator size="large" color={colors.accentColor} />
            </View>
        );
    }

    if (error || !student) {
        return (
            <View className="flex-1 items-center justify-center bg-background px-6">
                <LinearGradient
                    colors={colors.bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <Text className={`text-red-500 text-center mb-4 text-lg`}>{error || 'Student not found'}</Text>
                <Pressable onPress={() => router.back()} className="bg-purple-600 px-6 py-3 rounded-xl">
                    <Text className="text-white font-bold">{t('common.goBack') || 'Go Back'}</Text>
                </Pressable>
            </View>
        );
    }

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
                        {t('students.profile') || 'Student Profile'}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} className="px-5 pt-2">

                    {/* Profile Banner */}
                    <View className="mt-4 mb-6 items-center">
                        <View className="relative mb-4">
                            <View className={`h-28 w-28 rounded-3xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} items-center justify-center overflow-hidden border-2 ${isDark ? 'border-purple-400' : 'border-purple-200'}`}>
                                {student.profile_picture_url ? (
                                    <Image source={{ uri: student.profile_picture_url }} className="h-full w-full" resizeMode="cover" />
                                ) : (
                                    <Text className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                        {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                                    </Text>
                                )}
                            </View>
                            <View className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-2 ${isDark ? 'border-[#0A0118]' : 'border-white'} ${student.is_active ? 'bg-green-500' : 'bg-gray-400'} flex-row items-center gap-1`}>
                                {student.is_active ? <CheckCircle size={10} color="#fff" /> : <XCircle size={10} color="#fff" />}
                                <Text className="text-white text-[10px] font-bold uppercase">
                                    {student.is_active ? (t('status.active') || 'Active') : (t('status.inactive') || 'Inactive')}
                                </Text>
                            </View>
                        </View>

                        <Text className={`text-2xl font-bold ${colors.textColor} text-center mb-1`}>
                            {getDisplayName(student)}
                        </Text>

                        {/* Academic Label */}
                        <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-purple-50'} border ${colors.borderColor}`}>
                            <School size={14} color={isDark ? '#d8b4fe' : '#7c3aed'} />
                            <Text className={`text-sm font-medium ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                                {enrollment?.school_class_name || t('students.student') || 'Student'}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons (Only call/email if permitted, usually students don't have public contact info but parents do. 
                       Assuming admin can contact student directly if info exists) */}
                    {(student.phone || student.email) && (
                        <View className="flex-row gap-4 mb-8">
                            {student.phone && (
                                <Pressable
                                    onPress={() => openUrl(`tel:${student.phone}`)}
                                    className="flex-1 bg-green-600 py-3 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-90"
                                >
                                    <Phone size={20} color="#fff" />
                                    <Text className="text-white font-bold">{t('common.call') || 'Call'}</Text>
                                </Pressable>
                            )}
                            {student.email && (
                                <Pressable
                                    onPress={() => openUrl(`mailto:${student.email}`)}
                                    className="flex-1 bg-blue-600 py-3 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-90"
                                >
                                    <Mail size={20} color="#fff" />
                                    <Text className="text-white font-bold">{t('common.email') || 'Email'}</Text>
                                </Pressable>
                            )}
                        </View>
                    )}

                    {/* Information Cards */}
                    <View className="gap-4">

                        {/* Academic Info */}
                        {enrollment && (
                            <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                                <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('students.academicInfo') || 'Academic Information'}</Text>

                                <View className="gap-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                            <School size={18} color={isDark ? '#d8b4fe' : '#9333ea'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.class') || 'Class'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>{enrollment.school_class_name || '---'}</Text>
                                        </View>
                                    </View>

                                    {enrollment.student_number && (
                                        <View className="flex-row items-center gap-3">
                                            <View className={`p-2 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                                <GraduationCap size={18} color={isDark ? '#818cf8' : '#4f46e5'} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('students.studentNumber') || 'Student Number'}</Text>
                                                <Text className={`text-base font-medium ${colors.textColor}`}>#{enrollment.student_number}</Text>
                                            </View>
                                        </View>
                                    )}

                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                                            <Calendar size={18} color={isDark ? '#f472b6' : '#db2777'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('students.enrollmentDate') || 'Enrolled Since'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>
                                                {enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString() : '---'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Personal Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('students.personalInfo') || 'Personal Information'}</Text>

                            <View className="gap-4">
                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                        <Mail size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.email') || 'Email'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`} numberOfLines={1}>{student.email || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                        <Phone size={18} color={isDark ? '#4ade80' : '#16a34a'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.phone') || 'Phone'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{student.phone || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                        <MapPin size={18} color={isDark ? '#c084fc' : '#9333ea'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.address') || 'Address'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{student.address || '---'}</Text>
                                    </View>
                                </View>

                                {(student.birth_date) && (
                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                                            <Calendar size={18} color={isDark ? '#fb923c' : '#ea580c'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('students.birthDate') || 'Date of Birth'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>
                                                {new Date(student.birth_date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>


                        {/* Parent Info */}
                        {student.parent_id && (
                            <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                                <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('parent.profile') || 'Parent Profile'}</Text>

                                <Pressable
                                    onPress={() => router.push(`/(admin)/school/parents/${student.parent_id}` as any)}
                                    className={`flex-row items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/50'} border ${colors.borderColor} active:opacity-70`}
                                >
                                    <View className={`h-12 w-12 rounded-full ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} items-center justify-center overflow-hidden border ${isDark ? 'border-indigo-400/30' : 'border-indigo-200'}`}>
                                        <Text className={`text-lg font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            {(student.parent_name?.split(' ')?.[0]?.[0] || '') + (student.parent_name?.split(' ')?.[1]?.[0] || '')}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-base font-bold ${colors.textColor}`}>
                                            {student.parent_name}
                                        </Text>
                                        <Text className={`text-xs ${colors.subTextColor}`}>
                                            {t('admin.school.modules.parents') || 'Parent'}
                                        </Text>
                                    </View>

                                    {/* Arrow icon */}
                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                                        <ChevronLeft size={16} color={colors.iconColor} style={{ transform: [{ rotate: '180deg' }] }} />
                                    </View>

                                </Pressable>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View >
    );
}
