import { View, Text, ScrollView, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../../context/AuthContext';
import { useTheme } from '../../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import usersService from '../../../../api/users';
import schoolsService from '../../../../api/schools';
import {
    Mail,
    Phone,
    Calendar,
    MapPin,
    GraduationCap,
    BookOpen,
    Users,
    ArrowLeft,
    AlertCircle,
    Heart,
    Clock,
} from 'lucide-react-native';

export default function KidProfile() {
    useAuth(); // Hook required for context initialization
    const { actualTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const isDark = actualTheme === 'dark';

    // State
    const [childData, setChildData] = useState<any>(null);
    const [classDetails, setClassDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'teachers'>('overview');

    // Fetch child data
    useEffect(() => {
        const fetchChildData = async () => {
            try {
                setLoading(true);
                if (id) {
                    const data = await usersService.getUserById(Number(id));
                    setChildData(data);
                }
            } catch (err: any) {
                console.error('Failed to fetch child data:', err);
                setError(t('errors.failedToLoadProfile', 'Failed to load profile information.'));
            } finally {
                setLoading(false);
            }
        };

        fetchChildData();
    }, [id, t]);

    // Fetch class details when child data is loaded
    useEffect(() => {
        const fetchClassDetails = async () => {
            if (!childData) return;

            try {
                setLoadingDetails(true);

                // Get class ID from enrollment or direct field
                const enrollment = childData.student_enrollments?.find((e: any) => e.is_active);
                const classId =
                    childData.school_class_id ||
                    (enrollment?.school_class && (typeof enrollment.school_class === 'object' ? enrollment.school_class.id : enrollment.school_class));

                if (classId) {
                    const classData = await schoolsService.getClassById(classId);
                    setClassDetails(classData);
                } else {
                    setClassDetails(null);
                }
            } catch (err: any) {
                console.error('Failed to fetch class details:', err);
                // Don't block the UI, just show what we have
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchClassDetails();
    }, [childData]);

    // Formatters
    const formatDate = (dateString: string) => {
        if (!dateString) return t('common.notAvailable', 'N/A');
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return t('common.notAvailable', 'N/A');

        const localeMap: { [key: string]: string } = {
            ar: 'ar-MA',
            en: 'en-US',
            fr: 'fr-FR',
        };

        return date.toLocaleDateString(localeMap[i18n.language] || 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const calculateAge = (dateOfBirth: string) => {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getLocalizedValue = (obj: any, fieldBase: string) => {
        if (!obj) return '-';
        const lang = i18n.language;
        if (lang === 'ar') {
            return obj[`${fieldBase}_arabic`] || obj[`ar_${fieldBase}`] || obj[fieldBase] || '-';
        }
        if (lang === 'fr') {
            return obj[`${fieldBase}_french`] || obj[fieldBase] || '-';
        }
        return obj[fieldBase] || '-';
    };

    // Background Themes
    const bgColors: [string, string, ...string[]] = isDark ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#f1f5f9'];

    const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const iconColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
    const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

    // Info Item Component
    const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => {
        return (
            <View className={`p-4 rounded-xl ${cardBg} border ${cardBorder}`}>
                <View className="flex-row items-start gap-3">
                    <View className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                        <Icon size={18} color={isDark ? '#818cf8' : '#4f46e5'} />
                    </View>
                    <View className="flex-1">
                        <Text className={`${subTextColor} text-xs mb-1 font-medium`}>{label}</Text>
                        <Text className={`${textColor} text-sm font-semibold`}>{value || '-'}</Text>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background">
                <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="absolute inset-0" />
                <SafeAreaView className="flex-1">
                    <Stack.Screen options={{ headerShown: false }} />
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={isDark ? '#fff' : '#4f46e5'} />
                        <Text className={`${subTextColor} mt-4 font-medium`}>{t('common.loading', 'Loading profile...')}</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (error || !childData) {
        return (
            <View className="flex-1 bg-background">
                <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="absolute inset-0" />
                <SafeAreaView className="flex-1">
                    <Stack.Screen options={{ headerShown: false }} />
                    <View className="flex-1 items-center justify-center px-6">
                        <View className={`p-6 rounded-2xl ${cardBg} border ${cardBorder} w-full`}>
                            <View className="items-center">
                                <View className="p-3 bg-red-100 rounded-full mb-4">
                                    <AlertCircle size={32} color="#dc2626" />
                                </View>
                                <Text className={`${textColor} text-lg font-bold mb-2`}>{t('common.error', 'Error')}</Text>
                                <Text className={`${subTextColor} text-center`}>{error || t('errors.failedToLoadProfile', 'Failed to load profile.')}</Text>
                                <Pressable className="mt-6 px-6 py-3 bg-red-600 rounded-xl active:opacity-70" onPress={() => router.back()}>
                                    <Text className="text-white font-semibold">{t('common.goBack', 'Go Back')}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const age = calculateAge(childData.date_of_birth);
    const currentEnrollment = childData.student_enrollments?.find((e: any) => e.is_active);

    return (
        <View className="flex-1 bg-background">
            <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-6 pt-2 pb-4 flex-row items-center gap-4">
                    <Pressable onPress={() => router.back()} className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder} active:opacity-70`}>
                        <ArrowLeft size={20} color={iconColor} />
                    </Pressable>
                    <View className="flex-1">
                        <Text className={`${subTextColor} text-xs font-medium uppercase tracking-wider`}>{t('roles.student', 'Student')}</Text>
                        <Text className={`${textColor} text-xl font-bold`}>{childData.first_name}&apos;s {t('kids.profile', 'Profile')}</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Profile Card */}
                    <View className={`mb-6 p-6 rounded-2xl ${cardBg} border ${cardBorder}`}>
                        <View className="items-center">
                            {/* Avatar */}
                            <View className={`w-24 h-24 rounded-2xl justify-center items-center overflow-hidden ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} border-4 ${isDark ? 'border-slate-700' : 'border-white'}`}>
                                {childData.profile_picture_url || childData.profile?.profile_picture ? (
                                    <ImageBackground source={{ uri: childData.profile_picture_url || childData.profile?.profile_picture }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <Text className="text-indigo-500 font-bold text-3xl">{childData.first_name[0]}</Text>
                                )}
                            </View>

                            {/* Name */}
                            <Text className={`${textColor} text-2xl font-bold mt-4`}>{getLocalizedValue(childData, 'full_name')}</Text>
                            <Text className={`${subTextColor} text-base font-medium mt-1`}>{getLocalizedValue(childData, 'grade')}</Text>

                            {/* Badges */}
                            <View className="flex-row items-center gap-2 mt-3">
                                <View className={`px-3 py-1 rounded-full ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                                    <Text className={`${isDark ? 'text-indigo-400' : 'text-indigo-700'} text-xs font-bold`}>
                                        {t('common.studentID', 'ID')}: {childData.student_id || childData.student_number || 'N/A'}
                                    </Text>
                                </View>
                                <View
                                    className={`px-3 py-1 rounded-full ${childData.is_active ? (isDark ? 'bg-emerald-500/20' : 'bg-emerald-50') : isDark ? 'bg-slate-700' : 'bg-slate-100'
                                        }`}
                                >
                                    <Text className={`${childData.is_active ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : subTextColor} text-xs font-bold`}>
                                        {childData.is_active ? t('status.active', 'Active') : t('status.inactive', 'Inactive')}
                                    </Text>
                                </View>
                            </View>

                            {/* Quick Info */}
                            <View className={`w-full mt-6 flex-row gap-3`}>
                                <View className={`flex-1 p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} border ${cardBorder}`}>
                                    <Text className={`${subTextColor} text-xs font-bold uppercase tracking-wider text-center`}>{t('common.class', 'Class')}</Text>
                                    <Text className={`${textColor} text-sm font-bold mt-1 text-center`}>{childData.class_name || '-'}</Text>
                                </View>
                                <View className={`flex-1 p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} border ${cardBorder}`}>
                                    <Text className={`${subTextColor} text-xs font-bold uppercase tracking-wider text-center`}>{t('common.grade', 'Grade')}</Text>
                                    <Text className={`${textColor} text-sm font-bold mt-1 text-center`}>{getLocalizedValue(childData, 'grade')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className={`flex-row mb-6 p-1 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} border ${cardBorder}`}>
                        <Pressable className={`flex-1 py-2.5 rounded-lg ${activeTab === 'overview' ? (isDark ? 'bg-indigo-500/20' : 'bg-white') : ''}`} onPress={() => setActiveTab('overview')}>
                            <Text className={`text-center text-xs font-bold ${activeTab === 'overview' ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : subTextColor}`}>
                                {t('tabs.overview', 'Overview')}
                            </Text>
                        </Pressable>
                        <Pressable className={`flex-1 py-2.5 rounded-lg ${activeTab === 'academic' ? (isDark ? 'bg-indigo-500/20' : 'bg-white') : ''}`} onPress={() => setActiveTab('academic')}>
                            <Text className={`text-center text-xs font-bold ${activeTab === 'academic' ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : subTextColor}`}>
                                {t('tabs.academic', 'Academic')}
                            </Text>
                        </Pressable>
                        <Pressable className={`flex-1 py-2.5 rounded-lg ${activeTab === 'teachers' ? (isDark ? 'bg-indigo-500/20' : 'bg-white') : ''}`} onPress={() => setActiveTab('teachers')}>
                            <Text className={`text-center text-xs font-bold ${activeTab === 'teachers' ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : subTextColor}`}>
                                {t('tabs.teachers', 'Teachers')}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <View className="gap-y-6">
                            {/* Personal Info */}
                            <View>
                                <Text className={`${textColor} text-lg font-bold mb-4`}>{t('section.personalInfo', 'Personal Information')}</Text>
                                <View className="gap-y-4">
                                    <InfoItem
                                        icon={Calendar}
                                        label={t('common.dateOfBirth', 'Date of Birth')}
                                        value={childData.date_of_birth ? `${formatDate(childData.date_of_birth)}${age ? ` (${age} ${t('common.years', 'years')})` : ''}` : '-'}
                                    />
                                    <InfoItem icon={MapPin} label={t('common.address', 'Address')} value={childData.address} />
                                    <InfoItem icon={Phone} label={t('common.phone', 'Phone')} value={childData.phone} />
                                    <InfoItem icon={Mail} label={t('common.email', 'Email')} value={childData.email} />
                                </View>
                            </View>

                            {/* Bio */}
                            {childData.bio && (
                                <View className={`p-4 rounded-xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'} border ${isDark ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <BookOpen size={18} color={isDark ? '#818cf8' : '#4f46e5'} />
                                        <Text className={`${isDark ? 'text-indigo-300' : 'text-indigo-900'} text-sm font-bold`}>
                                            {t('common.bio', 'About')} {childData.first_name}
                                        </Text>
                                    </View>
                                    <Text className={`${isDark ? 'text-indigo-200' : 'text-indigo-800'} text-sm italic`}>{childData.bio}</Text>
                                </View>
                            )}

                            {/* Emergency Info */}
                            <View className={`p-4 rounded-xl ${cardBg} border-l-4 ${isDark ? 'border-l-rose-500' : 'border-l-rose-400'} border ${cardBorder}`}>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Heart size={20} color={isDark ? '#fb7185' : '#f43f5e'} />
                                    <Text className={`${textColor} text-base font-bold`}>{t('section.emergencyInfo', 'Emergency Information')}</Text>
                                </View>
                                <View className="gap-y-4">
                                    {childData.emergency_contact_name && (
                                        <View>
                                            <Text className={`${subTextColor} text-xs mb-1 font-medium`}>{t('common.emergencyContact', 'Contact Name')}</Text>
                                            <Text className={`${textColor} text-sm font-semibold`}>{childData.emergency_contact_name}</Text>
                                        </View>
                                    )}
                                    {childData.emergency_contact_phone && (
                                        <View>
                                            <Text className={`${subTextColor} text-xs mb-1 font-medium`}>{t('common.emergencyPhone', 'Contact Phone')}</Text>
                                            <Text className={`${textColor} text-sm font-semibold`}>{childData.emergency_contact_phone}</Text>
                                        </View>
                                    )}
                                    {(childData.medical_notes || childData.profile?.medical_notes) && (
                                        <View>
                                            <Text className={`${subTextColor} text-xs mb-1 font-medium`}>{t('common.medicalNotes', 'Medical Notes')}</Text>
                                            <Text className={`${textColor} text-sm font-semibold`}>{childData.medical_notes || childData.profile?.medical_notes}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Academic Tab */}
                    {activeTab === 'academic' && (
                        <View className="gap-y-6">
                            <Text className={`${textColor} text-lg font-bold mb-2`}>{t('section.academicDetails', 'Academic Details')}</Text>
                            <View className="gap-y-4">
                                <InfoItem icon={GraduationCap} label={t('common.grade', 'Grade')} value={getLocalizedValue(childData, 'grade')} />
                                <InfoItem icon={Users} label={t('common.class', 'Class')} value={childData.class_name} />
                                <InfoItem icon={Clock} label={t('common.academicYear', 'Academic Year')} value={childData.academic_year} />
                                <InfoItem
                                    icon={BookOpen}
                                    label={t('common.track', 'Track/Stream')}
                                    value={(() => {
                                        const details = classDetails || currentEnrollment?.school_class;
                                        if (!details) return '-';
                                        if (i18n.language === 'ar') return details.track_arabic || details.track_name || '-';
                                        if (i18n.language === 'fr') return details.track_french || details.track_name || '-';
                                        return details.track_name || '-';
                                    })()}
                                />
                                <InfoItem icon={Calendar} label={t('common.enrollmentDate', 'Enrollment Date')} value={formatDate(childData.enrollment_date || childData.created_at)} />
                            </View>
                        </View>
                    )}

                    {/* Teachers Tab */}
                    {activeTab === 'teachers' && (
                        <View>
                            {loadingDetails ? (
                                <View className="flex items-center justify-center py-12">
                                    <ActivityIndicator size="large" color={isDark ? '#818cf8' : '#4f46e5'} />
                                </View>
                            ) : classDetails?.teachers && classDetails.teachers.length > 0 ? (
                                <View className="gap-y-4">
                                    {classDetails.teachers.map((teacher: any) => (
                                        <View key={teacher.id} className={`p-4 rounded-2xl ${cardBg} border ${cardBorder}`}>
                                            <View className="flex-row items-center gap-4">
                                                {/* Avatar */}
                                                <View className={`w-16 h-16 rounded-xl justify-center items-center overflow-hidden ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                                    {teacher.profile?.profile_picture ? (
                                                        <ImageBackground source={{ uri: teacher.profile.profile_picture }} className="w-full h-full" resizeMode="cover" />
                                                    ) : (
                                                        <Text className="text-indigo-500 font-bold text-xl">{teacher.name?.[0]}</Text>
                                                    )}
                                                </View>

                                                {/* Info */}
                                                <View className="flex-1">
                                                    <Text className={`${textColor} text-base font-bold`}>{teacher.name}</Text>
                                                    <View className={`mt-1 px-2 py-0.5 rounded ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'} self-start`}>
                                                        <Text className={`${isDark ? 'text-indigo-400' : 'text-indigo-700'} text-xs font-semibold`}>
                                                            {getLocalizedValue(teacher, 'subject') || t('common.teacher', 'Teacher')}
                                                        </Text>
                                                    </View>
                                                    {teacher.email && (
                                                        <View className="flex-row items-center gap-1 mt-2">
                                                            <Mail size={14} color={iconColor} />
                                                            <Text className={`${subTextColor} text-xs`} numberOfLines={1}>
                                                                {teacher.email}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View className={`py-12 px-6 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'} border-2 border-dashed ${cardBorder} items-center`}>
                                    <View className={`p-4 rounded-full ${cardBg} border ${cardBorder} mb-4`}>
                                        <Users size={32} color={iconColor} />
                                    </View>
                                    <Text className={`${textColor} text-lg font-bold text-center mb-2`}>{t('common.noTeachers', 'No teachers found')}</Text>
                                    <Text className={`${subTextColor} text-sm text-center`}>{t('common.noTeachersDesc', 'Teacher information is not available for this class yet.')}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
