import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, ActivityIndicator, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
    ChevronLeft,
    Users,
    LayoutGrid,
    Hash
} from 'lucide-react-native';
import api from '../../../api/client';
import { useTheme } from '../../../context/ThemeContext';

const getThemeColors = (isDark: boolean) => {
    return {
        bgGradient: isDark
            ? ['#0f0c29', '#302b63', '#24243e'] as const
            : ['#f0f9ff', '#e0f2fe', '#bae6fd'] as const,
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/60' : 'text-gray-600',
        iconColor: isDark ? '#fff' : '#1e293b',
        glassBg: isDark ? 'bg-white/5' : 'bg-white/60',
        glassBorder: isDark ? 'border-white/10' : 'border-white/40',
        cardBg: isDark ? 'bg-gray-900/40' : 'bg-white/50',
    };
};

export default function ClassDetailsPage() {
    const { id } = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const theme = getThemeColors(isDark);

    const [loading, setLoading] = useState(true);
    const [classData, setClassData] = useState<any>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [classRes, enrollmentsRes] = await Promise.all([
                api.get(`/schools/classes/${id}/`),
                api.get(`/users/enrollments/?school_class=${id}&page_size=100`)
            ]);
            setClassData(classRes.data);
            setEnrollments(enrollmentsRes.data.results || []);
        } catch (err) {
            console.error('Error fetching class details:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const getDisplayName = (student: any) => {
        if (!student) return '';
        const isArabic = i18n.language === 'ar';
        if (isArabic && (student.ar_first_name || student.ar_last_name)) {
            return `${student.ar_first_name || ''} ${student.ar_last_name || ''}`.trim();
        }
        return student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <LinearGradient
                    colors={theme.bgGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <ActivityIndicator size="large" color={theme.iconColor} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <LinearGradient
                colors={theme.bgGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />
            {isDark && <View className="absolute inset-0 bg-black/10" />}

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-3 pt-4 pb-2 flex-row items-center justify-between z-50">
                    <Pressable
                        onPress={() => router.back()}
                        className={`w-10 h-10 items-center justify-center rounded-full ${theme.glassBg} border ${theme.glassBorder} active:opacity-70`}
                    >
                        <ChevronLeft size={24} color={theme.iconColor} />
                    </Pressable>
                    <Text className={`${theme.textColor} text-xl font-bold tracking-wider`}>
                        {classData?.name || t('classes.viewClass', 'Class Details')}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    className="flex-1 px-4 pt-4"
                >
                    {/* Basic Info Card */}
                    <View className={`rounded-3xl overflow-hidden mb-6 border ${theme.glassBorder}`}>
                        <LinearGradient
                            colors={isDark ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] : ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)']}
                            className="p-5"
                        >
                            <View className="flex-row items-center gap-3 mb-6">
                                <View className={`w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center`}>
                                    <LayoutGrid size={20} color="#3b82f6" />
                                </View>
                                <Text className={`${theme.textColor} text-lg font-bold`}>
                                    {t('classes.basicInformation', 'Basic Information')}
                                </Text>
                            </View>

                            <View className="gap-5">
                                {/* Row 1 */}
                                <View className="flex-row justify-between">
                                    <View className="flex-1">
                                        <Text className={`${theme.subTextColor} text-xs uppercase font-bold tracking-wider mb-1`}>
                                            {t('classes.className', 'Class Name')}
                                        </Text>
                                        <Text className={`${theme.textColor} text-base font-semibold`}>
                                            {classData?.name}
                                        </Text>
                                    </View>
                                    <View className="flex-1 items-end">
                                        <Text className={`${theme.subTextColor} text-xs uppercase font-bold tracking-wider mb-1`}>
                                            {t('classes.section', 'Section')}
                                        </Text>
                                        <View className={`px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20`}>
                                            <Text className="text-blue-500 font-bold text-xs">{classData?.section}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className={`h-[1px] w-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />

                                {/* Row 2 */}
                                <View className="flex-row justify-between">
                                    <View className="flex-1">
                                        <Text className={`${theme.subTextColor} text-xs uppercase font-bold tracking-wider mb-1`}>
                                            {t('classes.grade', 'Grade')}
                                        </Text>
                                        <Text className={`${theme.textColor} text-base font-semibold`}>
                                            {classData?.grade_name}
                                        </Text>
                                    </View>
                                    <View className="flex-1 items-end">
                                        <Text className={`${theme.subTextColor} text-xs uppercase font-bold tracking-wider mb-1`}>
                                            {t('classes.academicYear', 'Academic Year')}
                                        </Text>
                                        <Text className={`${theme.textColor} text-base font-semibold`}>
                                            {classData?.academic_year_name}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Students Section */}
                    <View className="mb-4 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Users size={20} color={isDark ? '#4ade80' : '#16a34a'} />
                            <Text className={`${theme.textColor} text-lg font-bold`}>
                                {t('classes.enrollment', 'Students')}
                            </Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-green-500/20' : 'bg-green-100'} border ${isDark ? 'border-green-500/30' : 'border-green-200'}`}>
                            <Text className={`${isDark ? 'text-green-400' : 'text-green-700'} font-bold text-xs`}>
                                {enrollments.length}
                            </Text>
                        </View>
                    </View>

                    {enrollments.length > 0 ? (
                        <View className="gap-3">
                            {enrollments.map((enr: any, index: number) => (
                                <Pressable
                                    key={enr.id}
                                    onPress={() => {
                                        // Use generic router push to avoid type errors if routes aren't auto-generated yet
                                        router.push({
                                            pathname: '/(teacher)/students/[id]',
                                            params: { id: enr.student?.id }
                                        } as any);
                                    }}
                                    className={`rounded-2xl overflow-hidden border ${theme.glassBorder} active:opacity-70`}
                                >
                                    <LinearGradient
                                        colors={isDark ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)']}
                                        className="p-4 flex-row items-center gap-4"
                                    >
                                        <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 border-2 border-white/20">
                                            {enr.student?.profile_picture_url ? (
                                                <Image
                                                    source={{ uri: enr.student.profile_picture_url }}
                                                    className="w-full h-full"
                                                />
                                            ) : (
                                                <View className={`w-full h-full items-center justify-center ${isDark ? 'bg-indigo-500' : 'bg-indigo-100'}`}>
                                                    <Text className={`${isDark ? 'text-white' : 'text-indigo-600'} font-bold text-lg`}>
                                                        {(enr.student?.first_name?.[0] || '') + (enr.student?.last_name?.[0] || '')}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        <View className="flex-1">
                                            <Text className={`${theme.textColor} font-bold text-base mb-0.5`}>
                                                {getDisplayName(enr.student)}
                                            </Text>
                                            <View className="flex-row items-center gap-2">
                                                <Hash size={12} color={theme.subTextColor} />
                                                <Text className={`${theme.subTextColor} text-xs`}>
                                                    {enr.student_number || 'N/A'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className={`px-2 py-1 rounded-lg ${enr.is_active ? (isDark ? 'bg-green-500/20' : 'bg-green-100') : (isDark ? 'bg-red-500/20' : 'bg-red-100')} border ${enr.is_active ? (isDark ? 'border-green-500/30' : 'border-green-200') : (isDark ? 'border-red-500/30' : 'border-red-200')}`}>
                                            <Text className={`${enr.is_active ? (isDark ? 'text-green-400' : 'text-green-700') : (isDark ? 'text-red-400' : 'text-red-700')} text-[10px] font-bold uppercase`}>
                                                {enr.is_active ? t('status.active', 'Active') : t('status.inactive', 'Inactive')}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                </Pressable>
                            ))}
                        </View>
                    ) : (
                        <View className={`items-center justify-center py-10 rounded-2xl ${theme.glassBg} border ${theme.glassBorder}`}>
                            <Users size={32} color={theme.subTextColor} className="opacity-50 mb-3" />
                            <Text className={`${theme.subTextColor} text-center`}>
                                {t('classes.noStudentsEnrolled', 'No students enrolled')}
                            </Text>
                        </View>
                    )}

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
