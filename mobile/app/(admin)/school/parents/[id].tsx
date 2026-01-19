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
    Users, // For Children
    ArrowRight
} from 'lucide-react-native';

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
        bannerGradient: isDark
            ? ['#f59e0b', '#b45309'] as const
            : ['#fbbf24', '#d97706'] as const, // Amber for Parents
        accentColor: isDark ? '#fbbf24' : '#d97706',
    };
};

export default function ParentProfile() {
    const { id } = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);

    const [loading, setLoading] = useState(true);
    const [parent, setParent] = useState<any | null>(null);
    const [children, setChildren] = useState<any[]>([]);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchParentDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/users/users/${id}/`);
            setParent(response.data);
            fetchChildren();
        } catch (err: any) {
            console.error('Failed to fetch parent details:', err);
            setError(t('error.failedToLoadData') || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchChildren = async () => {
        if (!id) return;
        try {
            setLoadingChildren(true);
            const response = await api.get(`/users/users/${id}/children/`);
            // API returns { children: [...], total_children: N } or just array based on endpoint variation check
            // Based on previous web page analysis: response.children is the array
            const childrenData = response.data?.children || (Array.isArray(response.data) ? response.data : []);
            setChildren(childrenData);
        } catch (err) {
            console.error('Error fetching children:', err);
        } finally {
            setLoadingChildren(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchParentDetails();
        }
    }, [id]);

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
                <ActivityIndicator size="large" color={isDark ? "#fff" : "#d97706"} />
            </View>
        );
    }

    if (error || !parent) {
        return (
            <View className="flex-1 items-center justify-center bg-background px-6">
                <LinearGradient
                    colors={colors.bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <Text className={`text-red-500 text-center mb-4 text-lg`}>{error || 'Parent not found'}</Text>
                <Pressable onPress={() => router.back()} className="bg-amber-600 px-6 py-3 rounded-xl">
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
                        {t('parent.profile') || 'Parent Profile'}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} className="px-5 pt-2">

                    {/* Profile Banner */}
                    <View className="mt-4 mb-6 items-center">
                        <View className="relative mb-4">
                            <View className={`h-28 w-28 rounded-3xl ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'} items-center justify-center overflow-hidden border-2 ${isDark ? 'border-amber-400' : 'border-amber-200'}`}>
                                {parent.profile_picture_url ? (
                                    <Image source={{ uri: parent.profile_picture_url }} className="h-full w-full" resizeMode="cover" />
                                ) : (
                                    <Text className={`text-3xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                        {(parent.first_name?.[0] || '') + (parent.last_name?.[0] || '')}
                                    </Text>
                                )}
                            </View>
                            <View className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-2 ${isDark ? 'border-[#0f0c29]' : 'border-white'} ${parent.is_active ? 'bg-green-500' : 'bg-gray-400'} flex-row items-center gap-1`}>
                                {parent.is_active ? <CheckCircle size={10} color="#fff" /> : <XCircle size={10} color="#fff" />}
                                <Text className="text-white text-[10px] font-bold uppercase">
                                    {parent.is_active ? (t('status.active') || 'Active') : (t('status.inactive') || 'Inactive')}
                                </Text>
                            </View>
                        </View>

                        <Text className={`text-2xl font-bold ${colors.textColor} text-center mb-1`}>
                            {getDisplayName(parent)}
                        </Text>

                        <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-amber-50'} border ${colors.borderColor}`}>
                            <Users size={14} color={isDark ? '#fcd34d' : '#d97706'} />
                            <Text className={`text-sm font-medium ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
                                {t('admin.school.modules.parents') || 'Parent'}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-4 mb-8">
                        {parent.phone && (
                            <Pressable
                                onPress={() => openUrl(`tel:${parent.phone}`)}
                                className="flex-1 bg-green-600 py-3 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-90"
                            >
                                <Phone size={20} color="#fff" />
                                <Text className="text-white font-bold">{t('common.call') || 'Call'}</Text>
                            </Pressable>
                        )}
                        {parent.email && (
                            <Pressable
                                onPress={() => openUrl(`mailto:${parent.email}`)}
                                className="flex-1 bg-blue-600 py-3 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-90"
                            >
                                <Mail size={20} color="#fff" />
                                <Text className="text-white font-bold">{t('common.email') || 'Email'}</Text>
                            </Pressable>
                        )}
                    </View>

                    {/* Information Cards */}
                    <View className="gap-4">

                        {/* Contact Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('staff.contactInfo') || 'Contact Information'}</Text>

                            <View className="gap-4">
                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                        <Mail size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.email') || 'Email'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`} numberOfLines={1}>{parent.email || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                        <Phone size={18} color={isDark ? '#4ade80' : '#16a34a'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.phone') || 'Phone'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{parent.phone || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                        <MapPin size={18} color={isDark ? '#c084fc' : '#9333ea'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.address') || 'Address'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{parent.address || '---'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Children Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('parent.children') || 'Children'}</Text>

                            {loadingChildren ? (
                                <ActivityIndicator size="small" color={isDark ? colors.accentColor : '#d97706'} />
                            ) : children.length > 0 ? (
                                <View className="gap-3">
                                    {children.map((child, index) => (
                                        <Pressable
                                            key={child.id || index}
                                            // Ensure this route exists or is handled
                                            onPress={() => router.push(`/(admin)/school/students/${child.id}` as any)}
                                            className={`flex-row items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/50'} border ${colors.borderColor} active:opacity-70`}
                                        >
                                            <View className={`h-10 w-10 rounded-full ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} items-center justify-center overflow-hidden border ${isDark ? 'border-indigo-400/30' : 'border-indigo-200'}`}>
                                                {child.profile_picture_url ? (
                                                    <Image source={{ uri: child.profile_picture_url }} className="h-full w-full" resizeMode="cover" />
                                                ) : (
                                                    <Text className={`text-sm font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                        {(child.first_name?.[0] || '') + (child.last_name?.[0] || '')}
                                                    </Text>
                                                )}
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`text-base font-bold ${colors.textColor}`}>
                                                    {getDisplayName(child)}
                                                </Text>
                                                <Text className={`text-xs ${colors.subTextColor}`}>
                                                    {t('student.student') || 'Student'}
                                                </Text>
                                            </View>
                                            <ArrowRight size={16} color={colors.subTextColor.replace('text-', '').replace('/60', '') /* Better manual color logic later if needed */ || '#999'} />
                                        </Pressable>
                                    ))}
                                </View>
                            ) : (
                                <Text className={`text-center ${colors.subTextColor} italic`}>{t('parent.noChildren') || 'No children linked to this account'}</Text>
                            )}
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View >
    );
}
