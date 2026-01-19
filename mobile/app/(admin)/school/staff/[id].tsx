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
    Briefcase,
    Calendar,
    MapPin,
    CheckCircle,
    XCircle,
    BadgeCheck,
    Hash,
    FileText,
    DollarSign,
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
            ? ['#4f46e5', '#3730a3'] as const
            : ['#4f46e5', '#4338ca'] as const,
        accentColor: isDark ? '#818cf8' : '#4f46e5',
    };
};

export default function StaffProfile() {
    const { id } = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);

    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchStaffDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/ users / users / ${id}/`);
            setStaff(response.data);
            fetchStaffContract(); // Fetch contract details
        } catch (err: any) {
            console.error('Failed to fetch staff details:', err);
            setError(t('error.failedToLoadData') || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const [contract, setContract] = useState<any | null>(null);
    const [loadingContract, setLoadingContract] = useState(false);

    const fetchStaffContract = async () => {
        if (!id) return;
        try {
            setLoadingContract(true);
            const response = await api.get(`/finance/contracts/?employee=${id}`);
            const results = response.data.results || response.data;
            const activeContract = results.find((c: any) => c.is_active) || results[0];
            setContract(activeContract);
        } catch (err) {
            console.error('Error fetching contract:', err);
        } finally {
            setLoadingContract(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchStaffDetails();
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
                <ActivityIndicator size="large" color={isDark ? "#fff" : "#4f46e5"} />
            </View>
        );
    }

    if (error || !staff) {
        return (
            <View className="flex-1 items-center justify-center bg-background px-6">
                <LinearGradient
                    colors={colors.bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <Text className={`text-red-500 text-center mb-4 text-lg`}>{error || 'User not found'}</Text>
                <Pressable onPress={() => router.back()} className="bg-indigo-600 px-6 py-3 rounded-xl">
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
                        {t('staff.profile') || 'Staff Profile'}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} className="px-5 pt-2">

                    {/* Profile Banner */}
                    <View className="mt-4 mb-6 items-center">
                        <View className="relative mb-4">
                            <View className={`h-28 w-28 rounded-3xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} items-center justify-center overflow-hidden border-2 ${isDark ? 'border-indigo-400' : 'border-indigo-200'}`}>
                                {staff.profile_picture_url ? (
                                    <Image source={{ uri: staff.profile_picture_url }} className="h-full w-full" resizeMode="cover" />
                                ) : (
                                    <Text className={`text-3xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                        {(staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')}
                                    </Text>
                                )}
                            </View>
                            <View className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-2 ${isDark ? 'border-[#0f0c29]' : 'border-white'} ${staff.is_active ? 'bg-green-500' : 'bg-gray-400'} flex-row items-center gap-1`}>
                                {staff.is_active ? <CheckCircle size={10} color="#fff" /> : <XCircle size={10} color="#fff" />}
                                <Text className="text-white text-[10px] font-bold uppercase">
                                    {staff.is_active ? (t('status.active') || 'Active') : (t('status.inactive') || 'Inactive')}
                                </Text>
                            </View>
                        </View>

                        <Text className={`text-2xl font-bold ${colors.textColor} text-center mb-1`}>
                            {getDisplayName(staff)}
                        </Text>

                        <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-indigo-50'} border ${colors.borderColor}`}>
                            <Briefcase size={14} color={isDark ? '#a5b4fc' : '#6366f1'} />
                            <Text className={`text-sm font-medium ${isDark ? 'text-indigo-200' : 'text-indigo-600'}`}>
                                {staff.position || t('staff.position.unknown') || 'Staff Member'}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-4 mb-8">
                        {staff.phone && (
                            <Pressable
                                onPress={() => openUrl(`tel:${staff.phone}`)}
                                className="flex-1 bg-green-600 py-3 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-90"
                            >
                                <Phone size={20} color="#fff" />
                                <Text className="text-white font-bold">{t('common.call') || 'Call'}</Text>
                            </Pressable>
                        )}
                        {staff.email && (
                            <Pressable
                                onPress={() => openUrl(`mailto:${staff.email}`)}
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
                                        <Text className={`text-base font-medium ${colors.textColor}`} numberOfLines={1}>{staff.email || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                        <Phone size={18} color={isDark ? '#4ade80' : '#16a34a'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.phone') || 'Phone'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{staff.phone || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                        <MapPin size={18} color={isDark ? '#c084fc' : '#9333ea'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.address') || 'Address'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{staff.address || '---'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Professional Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('staff.professionalInfo') || 'Professional Details'}</Text>

                            <View className="gap-4">
                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                                        <Hash size={18} color={isDark ? '#fb923c' : '#ea580c'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('staff.employeeId') || 'Employee ID'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{staff.username || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                                        <Calendar size={18} color={isDark ? '#f472b6' : '#db2777'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.joined') || 'Joined'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>
                                            {staff.created_at ? new Date(staff.created_at).toLocaleDateString() : '---'}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
                                        <BadgeCheck size={18} color={isDark ? '#2dd4bf' : '#0d9488'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('staff.role') || 'System Role'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{staff.role || 'STAFF'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Contract Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('teachers.contract') || 'Contract Information'}</Text>

                            {loadingContract ? (
                                <ActivityIndicator size="small" color={isDark ? colors.accentColor : '#4f46e5'} />
                            ) : contract ? (
                                <View className="gap-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                            <FileText size={18} color={isDark ? '#818cf8' : '#4f46e5'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.contractType') || 'Contract Type'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>
                                                {contract.contract_type ? contract.contract_type.replace(/_/g, ' ') : '---'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                                            <Hash size={18} color={isDark ? '#a78bfa' : '#7c3aed'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.contractNumber') || 'Contract No'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>{contract.contract_number || '---'}</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1 flex-row items-center gap-3">
                                            <View className={`p-2 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                                <Calendar size={18} color={isDark ? '#4ade80' : '#16a34a'} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.startDate') || 'Start Date'}</Text>
                                                <Text className={`text-base font-medium ${colors.textColor}`}>
                                                    {new Date(contract.start_date).toLocaleDateString()}
                                                </Text>
                                            </View>
                                        </View>
                                        {contract.end_date && (
                                            <View className="flex-1 flex-row items-center gap-3">
                                                <View className={`p-2 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                                    <Calendar size={18} color={isDark ? '#f87171' : '#dc2626'} />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.endDate') || 'End Date'}</Text>
                                                    <Text className={`text-base font-medium ${colors.textColor}`}>
                                                        {new Date(contract.end_date).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <View className="h-[1px] bg-gray-200/20 my-2" />

                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                            <DollarSign size={18} color={isDark ? '#34d399' : '#059669'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.baseSalary') || 'Base Salary'}</Text>
                                            <Text className={`text-base font-bold ${colors.textColor}`}>
                                                {parseFloat(contract.base_amount).toLocaleString()} MAD
                                            </Text>
                                        </View>
                                    </View>

                                    {(parseFloat(contract.transportation_allowance) > 0 || parseFloat(contract.housing_allowance) > 0) && (
                                        <View className="flex-row gap-4 mt-2">
                                            {parseFloat(contract.transportation_allowance) > 0 && (
                                                <View className="flex-1 bg-black/5 p-2 rounded-lg">
                                                    <Text className={`text-[10px] ${colors.subTextColor} mb-1`}>{t('teachers.transportationAllowance') || 'Transport'}</Text>
                                                    <Text className={`text-sm font-bold ${colors.textColor}`}>{parseFloat(contract.transportation_allowance).toLocaleString()}</Text>
                                                </View>
                                            )}
                                            {parseFloat(contract.housing_allowance) > 0 && (
                                                <View className="flex-1 bg-black/5 p-2 rounded-lg">
                                                    <Text className={`text-[10px] ${colors.subTextColor} mb-1`}>{t('teachers.housingAllowance') || 'Housing'}</Text>
                                                    <Text className={`text-sm font-bold ${colors.textColor}`}>{parseFloat(contract.housing_allowance).toLocaleString()}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <Text className={`text-center ${colors.subTextColor} italic`}>{t('teachers.noContract') || 'No active contract found'}</Text>
                            )}
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View >
    );
}
