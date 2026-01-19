import { View, Text, ScrollView, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import usersService from '../../api/users';
import {
    User,
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
    Shield,
} from 'lucide-react-native';

export default function StudentProfile() {
    useAuth(); // Hook required for context initialization
    const { actualTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const isDark = actualTheme === 'dark';

    // State
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'academic' | 'personal' | 'parent'>('academic');

    // Fetch data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const data = await usersService.getProfile();
                setProfileData(data);
            } catch (err: any) {
                console.error('Failed to fetch student profile:', err);
                setError(t('errors.failedToLoadProfile', 'Failed to load profile information.'));
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [t]);

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

    // Get user display name
    const getUserName = () => {
        if (profileData?.first_name && profileData?.last_name) {
            return `${profileData.first_name} ${profileData.last_name}`;
        }
        if (profileData?.first_name) return profileData.first_name;
        return t('studentHome.studentLabel', 'Student');
    };

    // Get user initials
    const getUserInitials = () => {
        if (profileData?.first_name && profileData?.last_name) {
            return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
        }
        if (profileData?.first_name) {
            return profileData.first_name.substring(0, 2).toUpperCase();
        }
        return 'ST';
    };

    // Helper to safely access nested profile data
    const getProfileField = (field: string) => {
        return profileData?.profile?.[field] || profileData?.[field];
    };

    // Background Themes
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f172a', '#1e293b']
        : ['#f8fafc', '#f1f5f9'];

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
                    <View className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                        <Icon size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
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

    if (error) {
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
                                <Text className={`${subTextColor} text-center`}>{error}</Text>
                                <Pressable
                                    className="mt-6 px-6 py-3 bg-red-600 rounded-xl active:opacity-70"
                                    onPress={() => router.back()}
                                >
                                    <Text className="text-white font-semibold">{t('common.goBack', 'Go Back')}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }


    const arFirstName = getProfileField('ar_first_name');
    const arLastName = getProfileField('ar_last_name');
    const arFullName = arFirstName && arLastName ? `${arFirstName} ${arLastName}` : null;
    const age = calculateAge(getProfileField('date_of_birth'));

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
                        <Text className={`${subTextColor} text-xs font-medium uppercase tracking-wider`}>{t('studentHome.studentLabel', 'Student')}</Text>
                        <Text className={`${textColor} text-xl font-bold`}>{t('studentHome.myProfile', 'My Profile')}</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Profile Card */}
                    <View className={`mb-6 p-6 rounded-2xl ${cardBg} border ${cardBorder}`}>
                        <View className="items-center">
                            {/* Avatar */}
                            <View className={`w-24 h-24 rounded-2xl justify-center items-center overflow-hidden ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} border-4 ${isDark ? 'border-slate-700' : 'border-white'}`}>
                                {getProfileField('profile_picture_url') ? (
                                    <ImageBackground
                                        source={{ uri: getProfileField('profile_picture_url') }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-blue-500 font-bold text-3xl">{getUserInitials()}</Text>
                                )}
                            </View>

                            {/* Name */}
                            <Text className={`${textColor} text-2xl font-bold mt-4`}>{getUserName()}</Text>
                            {arFullName && (
                                <Text className={`${subTextColor} text-base font-medium mt-1`} style={{ direction: 'rtl' }}>
                                    {arFullName}
                                </Text>
                            )}

                            {/* Badge */}
                            <View className={`mt-3 px-4 py-1.5 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'}`}>
                                <Text className={`${isDark ? 'text-blue-400' : 'text-blue-700'} text-xs font-bold uppercase tracking-wider`}>
                                    {t('roles.student', 'Student')}
                                </Text>
                            </View>

                            {/* Quick Info */}
                            <View className={`w-full mt-6 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} border ${cardBorder}`}>
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1 items-center">
                                        <Shield size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
                                        <Text className={`${subTextColor} text-xs mt-1 font-medium`}>{t('common.studentID', 'Student ID')}</Text>
                                        <Text className={`${textColor} text-sm font-bold mt-0.5`}>{profileData?.student_id || '-'}</Text>
                                    </View>
                                    <View className={`w-px h-12 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`} />
                                    <View className="flex-1 items-center">
                                        <Users size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
                                        <Text className={`${subTextColor} text-xs mt-1 font-medium`}>{t('common.class', 'Class')}</Text>
                                        <Text className={`${textColor} text-sm font-bold mt-0.5`}>{profileData?.class_name || '-'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className={`flex-row mb-6 p-1 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} border ${cardBorder}`}>
                        <Pressable
                            className={`flex-1 py-2.5 rounded-lg ${activeTab === 'academic' ? (isDark ? 'bg-blue-500/20' : 'bg-white') : ''}`}
                            onPress={() => setActiveTab('academic')}
                        >
                            <Text className={`text-center text-xs font-bold ${activeTab === 'academic' ? (isDark ? 'text-blue-400' : 'text-blue-600') : subTextColor}`}>
                                {t('common.academicInfo', 'Academic')}
                            </Text>
                        </Pressable>
                        <Pressable
                            className={`flex-1 py-2.5 rounded-lg ${activeTab === 'personal' ? (isDark ? 'bg-blue-500/20' : 'bg-white') : ''}`}
                            onPress={() => setActiveTab('personal')}
                        >
                            <Text className={`text-center text-xs font-bold ${activeTab === 'personal' ? (isDark ? 'text-blue-400' : 'text-blue-600') : subTextColor}`}>
                                {t('common.personalInfo', 'Personal')}
                            </Text>
                        </Pressable>
                        {(profileData?.parent_name || profileData?.parent_email || profileData?.parent_phone) && (
                            <Pressable
                                className={`flex-1 py-2.5 rounded-lg ${activeTab === 'parent' ? (isDark ? 'bg-blue-500/20' : 'bg-white') : ''}`}
                                onPress={() => setActiveTab('parent')}
                            >
                                <Text className={`text-center text-xs font-bold ${activeTab === 'parent' ? (isDark ? 'text-blue-400' : 'text-blue-600') : subTextColor}`}>
                                    {t('common.parent', 'Parent')}
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {/* Academic Info Tab */}
                    {activeTab === 'academic' && (
                        <View className="gap-y-4">
                            <Text className={`${textColor} text-lg font-bold mb-2`}>{t('common.academicInfo', 'Academic Information')}</Text>
                            <InfoItem icon={BookOpen} label={t('common.studentID', 'Student ID')} value={profileData?.student_id || t('common.notAvailable', 'N/A')} />
                            <InfoItem icon={GraduationCap} label={t('common.grade', 'Grade')} value={profileData?.grade || t('common.notAvailable', 'N/A')} />
                            <InfoItem icon={Users} label={t('common.class', 'Class')} value={profileData?.class_name || t('common.notAvailable', 'N/A')} />
                            <InfoItem icon={Calendar} label={t('common.academicYear', 'Academic Year')} value={profileData?.academic_year || t('common.notAvailable', 'N/A')} />
                            <InfoItem icon={Calendar} label={t('common.enrollmentDate', 'Enrollment Date')} value={formatDate(profileData?.enrollment_date || profileData?.created_at)} />
                        </View>
                    )}

                    {/* Personal Info Tab */}
                    {activeTab === 'personal' && (
                        <View className="gap-y-4">
                            <Text className={`${textColor} text-lg font-bold mb-2`}>{t('common.personalInfo', 'Personal Information')}</Text>
                            <InfoItem icon={Calendar} label={t('common.dateOfBirth', 'Date of Birth')} value={`${formatDate(getProfileField('date_of_birth'))}${age ? ` (${age} ${t('common.years', 'years')})` : ''}`} />
                            <InfoItem icon={Phone} label={t('common.phone', 'Phone')} value={getProfileField('phone') || t('common.notAvailable', 'N/A')} />
                            <InfoItem icon={Mail} label={t('common.email', 'Email')} value={profileData?.email || t('common.notAvailable', 'N/A')} />
                            <InfoItem icon={MapPin} label={t('common.address', 'Address')} value={getProfileField('address') || t('common.notAvailable', 'N/A')} />

                            {/* Bio */}
                            {getProfileField('bio') && (
                                <View className={`mt-2 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} border ${cardBorder}`}>
                                    <Text className={`${subTextColor} text-xs font-bold uppercase tracking-widest mb-2`}>{t('common.bio', 'About Me')}</Text>
                                    <Text className={`${textColor} text-sm leading-5 italic`}>{getProfileField('bio')}</Text>
                                </View>
                            )}

                            {/* Emergency Contact */}
                            {(getProfileField('emergency_contact_name') || getProfileField('emergency_contact_phone')) && (
                                <View className={`mt-2 p-4 rounded-xl ${cardBg} border-l-4 ${isDark ? 'border-l-rose-500' : 'border-l-rose-400'} border ${cardBorder}`}>
                                    <View className="flex-row items-center gap-2 mb-4">
                                        <Heart size={20} color={isDark ? '#fb7185' : '#f43f5e'} />
                                        <Text className={`${textColor} text-base font-bold`}>{t('common.emergencyContact', 'Emergency Contact')}</Text>
                                    </View>
                                    <View className="gap-y-3">
                                        {getProfileField('emergency_contact_name') && (
                                            <View>
                                                <Text className={`${subTextColor} text-xs mb-1`}>{t('common.name', 'Name')}</Text>
                                                <Text className={`${textColor} text-sm font-semibold`}>{getProfileField('emergency_contact_name')}</Text>
                                            </View>
                                        )}
                                        {getProfileField('emergency_contact_phone') && (
                                            <View>
                                                <Text className={`${subTextColor} text-xs mb-1`}>{t('common.phone', 'Phone')}</Text>
                                                <Text className={`${textColor} text-sm font-semibold`}>{getProfileField('emergency_contact_phone')}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Parent Info Tab */}
                    {activeTab === 'parent' && (profileData?.parent_name || profileData?.parent_email || profileData?.parent_phone) && (
                        <View className="gap-y-4">
                            <Text className={`${textColor} text-lg font-bold mb-2`}>{t('common.parentInfo', 'Parent Information')}</Text>
                            {profileData?.parent_name && <InfoItem icon={User} label={t('common.parentName', 'Parent Name')} value={profileData.parent_name} />}
                            {profileData?.parent_email && <InfoItem icon={Mail} label={t('common.email', 'Email')} value={profileData.parent_email} />}
                            {profileData?.parent_phone && <InfoItem icon={Phone} label={t('common.phone', 'Phone')} value={profileData.parent_phone} />}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
