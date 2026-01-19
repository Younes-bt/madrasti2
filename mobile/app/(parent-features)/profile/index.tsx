import { View, Text, ScrollView, Pressable, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import usersService from '../../../api/users';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Globe,
    Users,
    ChevronRight,
    Heart,
    ArrowLeft,
    AlertCircle,
} from 'lucide-react-native';

export default function ParentProfile() {
    const { user } = useAuth();
    const { actualTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const isDark = actualTheme === 'dark';

    // State
    const [profileData, setProfileData] = useState<any>(null);
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'children'>('personal');

    // Fetch data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Profile Data
                const profileResponse = await usersService.getProfile();
                setProfileData(profileResponse);

                // 2. Fetch Children Data
                if (user?.id) {
                    const childrenResponse = await usersService.getUserChildren(Number(user.id));
                    setChildren(childrenResponse.children || []);
                }
            } catch (err: any) {
                console.error('Failed to fetch parent profile data:', err);
                setError(t('errors.failedToLoadProfile', 'Failed to load profile information.'));
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user?.id, t]);

    // Formatters
    const formatDate = (dateString: string) => {
        if (!dateString) return t('common.notAvailable', 'N/A');
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return t('common.notAvailable', 'N/A');

        // Simple date formatting based on locale
        return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Get user display name
    const getUserName = () => {
        if (profileData?.first_name && profileData?.last_name) {
            return `${profileData.first_name} ${profileData.last_name}`;
        }
        if (profileData?.first_name) return profileData.first_name;
        return t('parentHome.parentLabel', 'Parent');
    };

    // Get user initials
    const getUserInitials = () => {
        if (profileData?.first_name && profileData?.last_name) {
            return `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase();
        }
        if (profileData?.first_name) {
            return profileData.first_name.substring(0, 2).toUpperCase();
        }
        return 'PA';
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

    const profile = profileData?.profile || {};
    const arFullName = profile.ar_first_name && profile.ar_last_name ? `${profile.ar_first_name} ${profile.ar_last_name}` : null;

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
                        <Text className={`${subTextColor} text-xs font-medium uppercase tracking-wider`}>{t('parentHome.parentLabel', 'Parent')}</Text>
                        <Text className={`${textColor} text-xl font-bold`}>{t('parentHome.myProfile', 'My Profile')}</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Profile Card */}
                    <View className={`mb-6 p-6 rounded-2xl ${cardBg} border ${cardBorder}`}>
                        <View className="items-center">
                            {/* Avatar */}
                            <View className={`w-24 h-24 rounded-2xl justify-center items-center overflow-hidden ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} border-4 ${isDark ? 'border-slate-700' : 'border-white'}`}>
                                {profileData?.profile_picture_url || profile.profile_picture ? (
                                    <ImageBackground
                                        source={{ uri: profileData?.profile_picture_url || profile.profile_picture }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-purple-500 font-bold text-3xl">{getUserInitials()}</Text>
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
                            <View className={`mt-3 px-4 py-1.5 rounded-full ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                                <Text className={`${isDark ? 'text-indigo-400' : 'text-indigo-700'} text-xs font-bold uppercase tracking-wider`}>
                                    {t('roles.parent', 'Parent')}
                                </Text>
                            </View>

                            {/* Children Count */}
                            <View className={`w-full mt-6 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} border ${cardBorder}`}>
                                <View className="flex-row items-center justify-center gap-2">
                                    <Users size={20} color={isDark ? '#818cf8' : '#4f46e5'} />
                                    <Text className={`${subTextColor} text-xs font-bold uppercase tracking-widest`}>{t('parent.children', 'Children')}</Text>
                                    <Text className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} text-xl font-bold`}>{children.length}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className={`flex-row mb-6 p-1 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} border ${cardBorder}`}>
                        <Pressable
                            className={`flex-1 py-2.5 rounded-lg ${activeTab === 'personal' ? (isDark ? 'bg-indigo-500/20' : 'bg-white') : ''}`}
                            onPress={() => setActiveTab('personal')}
                        >
                            <Text className={`text-center text-xs font-bold ${activeTab === 'personal' ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : subTextColor}`}>
                                {t('tabs.personalInfo', 'Personal')}
                            </Text>
                        </Pressable>
                        <Pressable
                            className={`flex-1 py-2.5 rounded-lg ${activeTab === 'contact' ? (isDark ? 'bg-indigo-500/20' : 'bg-white') : ''}`}
                            onPress={() => setActiveTab('contact')}
                        >
                            <Text className={`text-center text-xs font-bold ${activeTab === 'contact' ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : subTextColor}`}>
                                {t('tabs.contactDetails', 'Contact')}
                            </Text>
                        </Pressable>
                        <Pressable
                            className={`flex-1 py-2.5 rounded-lg ${activeTab === 'children' ? (isDark ? 'bg-indigo-500/20' : 'bg-white') : ''}`}
                            onPress={() => setActiveTab('children')}
                        >
                            <Text className={`text-center text-xs font-bold ${activeTab === 'children' ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : subTextColor}`}>
                                {t('tabs.linkedChildren', 'Children')}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Personal Info Tab */}
                    {activeTab === 'personal' && (
                        <View className="gap-y-4">
                            <Text className={`${textColor} text-lg font-bold mb-2`}>{t('section.identity', 'Identity Information')}</Text>
                            <InfoItem icon={User} label={t('fields.firstName', 'First Name')} value={profileData?.first_name} />
                            <InfoItem icon={User} label={t('fields.lastName', 'Last Name')} value={profileData?.last_name} />
                            <InfoItem icon={Globe} label={t('fields.arabicFirstName', 'First Name (Arabic)')} value={profile.ar_first_name} />
                            <InfoItem icon={Globe} label={t('fields.arabicLastName', 'Last Name (Arabic)')} value={profile.ar_last_name} />
                            <InfoItem icon={Calendar} label={t('fields.dateOfBirth', 'Date of Birth')} value={formatDate(profile.date_of_birth)} />

                            {/* Bio */}
                            {profile.bio && (
                                <View className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'} border ${cardBorder}`}>
                                    <Text className={`${subTextColor} text-xs font-bold uppercase tracking-widest mb-2`}>{t('fields.bio', 'About')}</Text>
                                    <Text className={`${textColor} text-sm leading-5 italic`}>{profile.bio}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Contact Info Tab */}
                    {activeTab === 'contact' && (
                        <View className="gap-y-6">
                            <View>
                                <Text className={`${textColor} text-lg font-bold mb-4`}>{t('section.communication', 'Communication')}</Text>
                                <View className="gap-y-4">
                                    <InfoItem icon={Phone} label={t('fields.phone', 'Phone Number')} value={profile.phone || profileData?.phone} />
                                    <InfoItem icon={Mail} label={t('fields.email', 'Email Address')} value={profileData?.email} />
                                    <InfoItem icon={MapPin} label={t('fields.address', 'Address')} value={profile.address} />
                                </View>
                            </View>

                            {/* Emergency Contact */}
                            {(profile.emergency_contact_name || profile.emergency_contact_phone) && (
                                <View className={`p-4 rounded-xl ${cardBg} border-l-4 ${isDark ? 'border-l-rose-500' : 'border-l-rose-400'} border ${cardBorder}`}>
                                    <View className="flex-row items-center gap-2 mb-4">
                                        <Heart size={20} color={isDark ? '#fb7185' : '#f43f5e'} />
                                        <Text className={`${textColor} text-base font-bold`}>{t('section.emergency', 'Emergency Contact')}</Text>
                                    </View>
                                    <View className="gap-y-3">
                                        {profile.emergency_contact_name && (
                                            <View>
                                                <Text className={`${subTextColor} text-xs mb-1`}>{t('fields.emergencyName', 'Contact Name')}</Text>
                                                <Text className={`${textColor} text-sm font-semibold`}>{profile.emergency_contact_name}</Text>
                                            </View>
                                        )}
                                        {profile.emergency_contact_phone && (
                                            <View>
                                                <Text className={`${subTextColor} text-xs mb-1`}>{t('fields.emergencyPhone', 'Contact Phone')}</Text>
                                                <Text className={`${textColor} text-sm font-semibold`}>{profile.emergency_contact_phone}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Children Tab */}
                    {activeTab === 'children' && (
                        <View className="gap-y-4">
                            {children.length > 0 ? (
                                children.map((child) => (
                                    <Pressable
                                        key={child.id}
                                        className={`p-4 rounded-2xl ${cardBg} border ${cardBorder} active:opacity-95`}
                                        onPress={() => router.push('/(parent)/kids')}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            {/* Avatar */}
                                            <View className={`w-16 h-16 rounded-xl justify-center items-center overflow-hidden ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                                {child.profile_picture_url || child.profile?.profile_picture ? (
                                                    <ImageBackground
                                                        source={{ uri: child.profile_picture_url || child.profile?.profile_picture }}
                                                        className="w-full h-full"
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <Text className="text-blue-500 font-bold text-xl">{child.first_name[0]}</Text>
                                                )}
                                            </View>

                                            {/* Info */}
                                            <View className="flex-1">
                                                <Text className={`${textColor} text-base font-bold`}>{child.full_name || `${child.first_name} ${child.last_name}`}</Text>
                                                <View className="flex-row items-center gap-2 mt-1">
                                                    <View className={`px-2 py-0.5 rounded ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                                                        <Text className={`${isDark ? 'text-indigo-400' : 'text-indigo-700'} text-xs font-semibold`}>{child.grade || t('common.student', 'Student')}</Text>
                                                    </View>
                                                    {child.class_name && (
                                                        <Text className={`${subTextColor} text-xs`}>• {child.class_name}</Text>
                                                    )}
                                                </View>
                                            </View>

                                            {/* Arrow */}
                                            <ChevronRight size={20} color={iconColor} />
                                        </View>
                                    </Pressable>
                                ))
                            ) : (
                                <View className={`py-16 px-6 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'} border-2 border-dashed ${cardBorder} items-center`}>
                                    <View className={`p-4 rounded-full ${cardBg} border ${cardBorder} mb-4`}>
                                        <Users size={32} color={iconColor} />
                                    </View>
                                    <Text className={`${textColor} text-lg font-bold text-center mb-2`}>{t('parent.noKidsTitle', 'No linked children')}</Text>
                                    <Text className={`${subTextColor} text-sm text-center max-w-xs`}>
                                        {t('parent.noKidsMessage', "We couldn't find any students linked to your account. Please contact the school to link your children.")}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
