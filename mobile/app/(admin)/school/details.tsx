import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../api/client';
import {
    ChevronLeft,
    Building2,
    MapPin,
    Calendar,
    Phone,
    PhoneCall,
    MessageCircle,
    Mail,
    Globe,
    ShieldCheck,
    Hash,
    GraduationCap,
    Users,
    User,
    Share2,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Sparkles,
    AlertCircle
} from 'lucide-react-native';

// Helper to open URLs
const openUrl = (url: string) => {
    if (!url) return;
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
};

interface SchoolConfig {
    name: string;
    name_arabic?: string;
    city?: string;
    region?: string;
    address?: string;
    logo_url?: string;
    created_at?: string;
    director_details?: {
        full_name: string;
        email: string;
    };
    current_academic_year_details?: {
        year: string;
    };
    student_capacity?: number;
    school_code?: string;
    pattent?: string;
    rc_code?: string;
    phone?: string;
    fix_phone?: string;
    whatsapp_num?: string;
    email?: string;
    website?: string;
    facebook_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    youtube_url?: string;
}

export default function SchoolDetails() {
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';

    const [loading, setLoading] = useState(true);
    const [schoolConfig, setSchoolConfig] = useState<SchoolConfig | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchSchoolConfig = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching school config...');
            const response = await api.get('/schools/config/');
            const data = response.data;
            const schoolData = data.results ? data.results[0] : (Array.isArray(data) ? data[0] : data);
            setSchoolConfig(schoolData);
        } catch (err: any) {
            console.error('Error fetching school config:', err);
            // Handle 401 specifically
            if (err.response?.status === 401) {
                setError('Unauthorized: Please sign in again.');
            } else {
                setError(err.message || 'Failed to load school details');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchoolConfig();
    }, []);

    // Theme Colors
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f0c29', '#302b63', '#24243e']
        : ['#f0f9ff', '#e0f2fe', '#bae6fd'];

    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const subTextColor = isDark ? 'text-white/60' : 'text-gray-600';
    const iconColor = isDark ? '#fff' : '#1e293b';
    const cardBgColor = isDark ? 'bg-white/5' : 'bg-white/60';
    const borderColor = isDark ? 'border-white/10' : 'border-white/40';

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <LinearGradient
                    colors={bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <ActivityIndicator size="large" color={isDark ? "#fff" : "#4f46e5"} />
                <Text className={`mt-4 ${textColor}`}>Loading school details...</Text>
            </View>
        );
    }

    if (error || !schoolConfig) {
        return (
            <View className="flex-1 items-center justify-center bg-background px-6">
                <LinearGradient
                    colors={bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                {/* Back Button */}
                <Pressable
                    onPress={() => router.back()}
                    className={`absolute top-12 left-6 w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'} border active:opacity-70 z-50`}
                >
                    <ChevronLeft size={24} color={iconColor} />
                </Pressable>

                <AlertCircle size={48} color={isDark ? "#ef4444" : "#dc2626"} className="mb-4" />
                <Text className={`${textColor} text-lg font-bold text-center mb-2`}>Failed to load details</Text>
                <Text className={`${subTextColor} text-center mb-6`}>{error || 'No data available'}</Text>

                <Pressable
                    onPress={fetchSchoolConfig}
                    className="bg-indigo-600 px-6 py-3 rounded-xl active:opacity-80"
                >
                    <Text className="text-white font-bold">Try Again</Text>
                </Pressable>
            </View>
        );
    }

    const InfoRow = ({ icon: Icon, label, value, onPress, linkColor }: any) => (
        <View className="flex-col mb-4">
            <View className="flex-row items-center gap-2 mb-1">
                <Icon size={14} color={isDark ? "#9ca3af" : "#64748b"} />
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs font-semibold uppercase tracking-wider`}>
                    {label}
                </Text>
            </View>
            {onPress ? (
                <Pressable onPress={onPress}>
                    <Text className={`text-base font-medium ${linkColor || 'text-indigo-500'} underline`}>
                        {value || '---'}
                    </Text>
                </Pressable>
            ) : (
                <Text className={`text-base font-medium ${textColor} ${isRTL ? 'text-right' : 'text-left'}`}>
                    {value || '---'}
                </Text>
            )}
        </View>
    );

    const SocialLink = ({ icon: Icon, label, url, color, bgClass }: any) => {
        if (!url) return null;
        return (
            <Pressable
                onPress={() => openUrl(url)}
                className={`flex-row items-center gap-3 p-3 rounded-xl mb-2 ${isDark ? 'bg-white/5' : 'bg-white/50'} border ${borderColor}`}
            >
                <View className={`p-2 rounded-lg ${bgClass}`}>
                    <Icon size={20} color={color} />
                </View>
                <Text className={`text-sm font-semibold ${textColor}`}>{label}</Text>
            </Pressable>
        );
    };

    return (
        <View className="flex-1">
            <LinearGradient
                colors={bgColors}
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
                        <ChevronLeft size={24} color={iconColor} />
                    </Pressable>
                    <Text className={`${textColor} text-xl font-bold tracking-wider`}>
                        {t('admin.school.modules.details')}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} className="px-5 pt-2">

                    {/* Banner / Header Card */}
                    <View className="mt-4 mb-6">
                        <LinearGradient
                            colors={['#4f46e5', '#4338ca', '#3730a3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="rounded-[24px] p-6 overflow-hidden relative min-h-[160px]"
                        >
                            {/* Decorative Blobs */}
                            <View className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <View className="absolute bottom-[-10px] left-[-10px] w-24 h-24 bg-purple-400/20 rounded-full blur-xl" />

                            <View className="flex-row items-start gap-4 z-10">
                                <View className="w-20 h-20 rounded-2xl bg-white p-1 overflow-hidden">
                                    {schoolConfig.logo_url ? (
                                        <Image source={{ uri: schoolConfig.logo_url }} className="w-full h-full rounded-xl" resizeMode="contain" />
                                    ) : (
                                        <View className="w-full h-full items-center justify-center bg-gray-50">
                                            <Building2 size={32} color="#9ca3af" />
                                        </View>
                                    )}
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row items-center gap-1 mb-1 flex-wrap">
                                        <Text className="text-white font-bold text-xl leading-6 mr-1" numberOfLines={2}>
                                            {schoolConfig.name}
                                        </Text>
                                        <View className="bg-indigo-400/30 px-2 py-0.5 rounded-full border border-indigo-300/30 flex-row items-center">
                                            <Sparkles size={10} color="#e0e7ff" className="mr-1" />
                                            <Text className="text-indigo-50 text-[10px] font-medium uppercase tracking-wide">
                                                Certified
                                            </Text>
                                        </View>
                                    </View>

                                    {schoolConfig.name_arabic && (
                                        <Text className="text-indigo-200 text-lg font-medium text-right mb-2" style={{ fontFamily: isRTL ? 'System' : undefined }}>
                                            {schoolConfig.name_arabic}
                                        </Text>
                                    )}

                                    <View className="flex-row items-center gap-1 mt-1">
                                        <MapPin size={12} color="#c7d2fe" />
                                        <Text className="text-indigo-100 text-xs font-medium">
                                            {schoolConfig.city && `${schoolConfig.city}, `}{schoolConfig.region}
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center gap-1 mt-1">
                                        <Calendar size={12} color="#c7d2fe" />
                                        <Text className="text-indigo-100 text-xs font-medium">
                                            {t('admin.school.detailsPage.established')} {new Date(schoolConfig.created_at || Date.now()).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Columns Layout for Mobile - Vertical Stack */}
                    <View className="gap-5">

                        {/* Contact Info Card */}
                        <View className={`rounded-3xl p-5 ${cardBgColor} border ${borderColor}`}>
                            <View className="flex-row items-center gap-2 mb-6">
                                <View className="p-2 bg-blue-100/20 rounded-xl">
                                    <Phone size={20} color={isDark ? "#60a5fa" : "#2563eb"} />
                                </View>
                                <Text className={`text-lg font-bold ${textColor}`}>
                                    {t('admin.school.detailsPage.contact')}
                                </Text>
                            </View>

                            <InfoRow
                                icon={Phone}
                                label={t('admin.school.detailsPage.phone')}
                                value={schoolConfig.phone}
                                onPress={() => openUrl(`tel:${schoolConfig.phone}`)}
                            />
                            <InfoRow
                                icon={PhoneCall}
                                label={t('admin.school.detailsPage.fixPhone')}
                                value={schoolConfig.fix_phone}
                                onPress={() => openUrl(`tel:${schoolConfig.fix_phone}`)}
                            />
                            <InfoRow
                                icon={MessageCircle}
                                label={t('admin.school.detailsPage.whatsapp')}
                                value={schoolConfig.whatsapp_num}
                                onPress={() => openUrl(`whatsapp://send?phone=${schoolConfig.whatsapp_num}`)}
                                linkColor="text-green-500"
                            />
                            <InfoRow
                                icon={Mail}
                                label={t('admin.school.detailsPage.email')}
                                value={schoolConfig.email}
                                onPress={() => openUrl(`mailto:${schoolConfig.email}`)}
                            />
                            <InfoRow
                                icon={Globe}
                                label={t('admin.school.detailsPage.website')}
                                value={schoolConfig.website}
                                onPress={() => openUrl(schoolConfig.website?.startsWith('http') ? schoolConfig.website! : `https://${schoolConfig.website}`)}
                            />
                            <InfoRow
                                icon={MapPin}
                                label={t('admin.school.detailsPage.address')}
                                value={schoolConfig.address}
                            />
                        </View>

                        {/* Institutional Details - Summary Style Card */}
                        <View className={`rounded-3xl p-5 ${cardBgColor} border ${borderColor}`}>
                            <View className="flex-row items-center gap-2 mb-6">
                                <View className="p-2 bg-indigo-100/20 rounded-xl">
                                    <GraduationCap size={20} color={isDark ? "#a78bfa" : "#7c3aed"} />
                                </View>
                                <Text className={`text-lg font-bold ${textColor}`}>
                                    {t('admin.school.detailsPage.academic.title')}
                                </Text>
                            </View>

                            <View className={`p-4 rounded-2xl mb-4 items-center justify-center ${isDark ? 'bg-indigo-900/20 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'} border`}>
                                <Text className={`text-3xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                    {schoolConfig.current_academic_year_details?.year || '---'}
                                </Text>
                                <Text className={`text-xs font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-indigo-300' : 'text-indigo-400'}`}>
                                    {t('admin.school.detailsPage.academic.year')}
                                </Text>
                            </View>

                            <View className="space-y-4">
                                <View>
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <Users size={14} color={isDark ? "#9ca3af" : "#64748b"} />
                                        <Text className={`${subTextColor} text-xs font-semibold uppercase tracking-wider`}>
                                            {t('admin.school.detailsPage.academic.capacity')}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-end justify-between">
                                        <Text className={`text-xl font-bold ${textColor}`}>
                                            {schoolConfig.student_capacity}
                                        </Text>
                                        <Text className={`text-xs mb-1 ${subTextColor}`}>
                                            {t('admin.school.detailsPage.academic.students')}
                                        </Text>
                                    </View>
                                    <View className="h-1.5 w-full bg-gray-200/20 rounded-full mt-2 overflow-hidden">
                                        <View className="h-full w-[75%] bg-indigo-500 rounded-full" />
                                    </View>
                                </View>

                                <View>
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <User size={14} color={isDark ? "#9ca3af" : "#64748b"} />
                                        <Text className={`${subTextColor} text-xs font-semibold uppercase tracking-wider`}>
                                            {t('admin.school.detailsPage.academic.director')}
                                        </Text>
                                    </View>
                                    <View className={`p-3 rounded-xl border ${borderColor} ${isDark ? 'bg-white/5' : 'bg-white/40'}`}>
                                        <Text className={`${textColor} font-bold text-base`}>
                                            {schoolConfig.director_details?.full_name || '---'}
                                        </Text>
                                        <Text className={`${subTextColor} text-xs mt-0.5`}>
                                            {schoolConfig.director_details?.email || '---'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Legal Card */}
                        <View className={`rounded-3xl p-5 ${cardBgColor} border ${borderColor}`}>
                            <View className="flex-row items-center gap-2 mb-6">
                                <View className="p-2 bg-emerald-100/20 rounded-xl">
                                    <Hash size={20} color={isDark ? "#34d399" : "#059669"} />
                                </View>
                                <Text className={`text-lg font-bold ${textColor}`}>
                                    {t('admin.school.detailsPage.legal')}
                                </Text>
                            </View>

                            <View className="flex-row flex-wrap gap-3">
                                <View className={`flex-1 min-w-[100px] p-3 rounded-xl border ${borderColor} ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        {t('admin.school.detailsPage.schoolCode')}
                                    </Text>
                                    <Text className={`text-base font-bold ${textColor}`}>
                                        {schoolConfig.school_code || '---'}
                                    </Text>
                                </View>
                                <View className={`flex-1 min-w-[100px] p-3 rounded-xl border ${borderColor} ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        {t('admin.school.detailsPage.rcCode')}
                                    </Text>
                                    <Text className={`text-base font-bold ${textColor}`}>
                                        {schoolConfig.rc_code || '---'}
                                    </Text>
                                </View>
                                <View className={`w-full p-3 rounded-xl border ${borderColor} ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        {t('admin.school.detailsPage.pattent')}
                                    </Text>
                                    <Text className={`text-base font-bold ${textColor}`}>
                                        {schoolConfig.pattent || '---'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Social Media */}
                        <View className={`rounded-3xl p-5 ${cardBgColor} border ${borderColor}`}>
                            <View className="flex-row items-center gap-2 mb-4">
                                <View className="p-2 bg-pink-100/20 rounded-xl">
                                    <Share2 size={16} color={isDark ? "#f472b6" : "#db2777"} />
                                </View>
                                <Text className={`text-sm font-bold ${subTextColor} uppercase tracking-wider`}>
                                    {t('admin.school.detailsPage.social')}
                                </Text>
                            </View>

                            <SocialLink icon={Facebook} label="Facebook" url={schoolConfig.facebook_url} color="#2563eb" bgClass="bg-blue-100" />
                            <SocialLink icon={Instagram} label="Instagram" url={schoolConfig.instagram_url} color="#db2777" bgClass="bg-pink-100" />
                            <SocialLink icon={Twitter} label="Twitter" url={schoolConfig.twitter_url} color="#0284c7" bgClass="bg-sky-100" />
                            <SocialLink icon={Linkedin} label="LinkedIn" url={schoolConfig.linkedin_url} color="#1d4ed8" bgClass="bg-blue-100" />
                            <SocialLink icon={Youtube} label="YouTube" url={schoolConfig.youtube_url} color="#dc2626" bgClass="bg-red-100" />

                            {(!schoolConfig.facebook_url && !schoolConfig.instagram_url && !schoolConfig.twitter_url && !schoolConfig.linkedin_url && !schoolConfig.youtube_url) && (
                                <Text className="text-center text-gray-400 italic text-sm py-4">No social profiles found</Text>
                            )}
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
