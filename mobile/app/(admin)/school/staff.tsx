import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../api/client';
import { Search, Plus, ChevronLeft, Phone, Mail, Briefcase, CheckCircle, XCircle, X } from 'lucide-react-native';

// Standard colors following the guidelines
const getColors = (isDark: boolean) => {
    return {
        bgColors: isDark
            ? ['#0f0c29', '#302b63', '#24243e'] as const // Deep Purple/Blue Night
            : ['#f0f9ff', '#e0f2fe', '#bae6fd'] as const, // Soft Blue Day
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/60' : 'text-gray-600',
        iconColor: isDark ? '#fff' : '#1e293b',
        cardBgColor: isDark ? 'bg-white/5' : 'bg-white/60',
        borderColor: isDark ? 'border-white/10' : 'border-white/40',
        inputBg: isDark ? 'bg-white/10' : 'bg-white/50',
    };
};

export default function StaffPage() {
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const { bgColors, textColor, subTextColor, iconColor, cardBgColor, borderColor, inputBg } = getColors(isDark);

    const [loading, setLoading] = useState(true);
    const [staffMembers, setStaffMembers] = useState<any[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [error, setError] = useState<string | null>(null);

    // Fetch Staff Data
    const fetchStaffMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/users/users/', { params: { role: 'STAFF' } });

            // Handle different response structures if necessary (e.g. pagination)
            const staffData = response.data?.results || (Array.isArray(response.data) ? response.data : []);

            setStaffMembers(staffData);
            setFilteredStaff(staffData);
        } catch (err: any) {
            console.error('Failed to fetch staff members:', err);
            if (err.response?.status === 401) {
                setError(t('error.unauthorized') || 'Unauthorized: Please sign in again.');
            } else {
                setError(t('error.failedToLoadData') || 'Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStaffMembers();
        }, [])
    );

    // Filter Logic
    useEffect(() => {
        let result = staffMembers;

        // 1. Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(staff =>
                statusFilter === 'active' ? staff.is_active : !staff.is_active
            );
        }

        // 2. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(staff => {
                const searchableFields = [
                    staff.first_name,
                    staff.last_name,
                    staff.ar_first_name,
                    staff.ar_last_name,
                    staff.email,
                    staff.phone,
                    staff.position // Add position if available
                ].filter(Boolean).join(' ').toLowerCase();
                return searchableFields.includes(query);
            });
        }

        setFilteredStaff(result);
    }, [staffMembers, statusFilter, searchQuery]);

    // Helper to open URLs
    const openUrl = (url: string) => {
        if (!url) return;
        Linking.openURL(url).catch(err => console.error("Couldn't open URL", err));
    };

    const getDisplayName = (staff: any) => {
        if (isRTL && (staff.ar_first_name || staff.ar_last_name)) {
            return `${staff.ar_first_name || ''} ${staff.ar_last_name || ''} `.trim();
        }
        return staff.full_name || `${staff.first_name || ''} ${staff.last_name || ''} `.trim();
    };

    const StaffCard = ({ staff }: { staff: any }) => (
        <Pressable
            onPress={() => router.push(`/ (admin) / school / staff / ${staff.id} ` as any)}
            className={`rounded - 3xl p - 4 mb - 4 ${cardBgColor} border ${borderColor} active: scale - [0.98] transition - transform`}
        >
            <View className="flex-row items-start gap-4">
                {/* Avatar */}
                <View className="relative">
                    <View className={`h - 14 w - 14 rounded - 2xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} items - center justify - center overflow - hidden border ${isDark ? 'border-indigo-400/30' : 'border-indigo-200'} `}>
                        {staff.profile_picture_url ? (
                            <Image source={{ uri: staff.profile_picture_url }} className="h-full w-full" resizeMode="cover" />
                        ) : (
                            <Text className={`text - lg font - bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'} `}>
                                {(staff.first_name?.[0] || '') + (staff.last_name?.[0] || '')}
                            </Text>
                        )}
                    </View>
                    {/* Status Dot */}
                    <View className={`absolute - bottom - 1 - right - 1 w - 4 h - 4 rounded - full border - 2 ${isDark ? 'border-[#1e293b]' : 'border-white'} ${staff.is_active ? 'bg-green-500' : 'bg-gray-400'} `} />
                </View>

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-2">
                            <Text className={`text - lg font - bold ${textColor} leading - tight text - left`}>
                                {getDisplayName(staff)}
                            </Text>
                            <View className="flex-row items-center gap-1 mt-1">
                                <Briefcase size={12} color={isDark ? '#94a3b8' : '#64748b'} />
                                <Text className={`text - xs ${subTextColor} `}>
                                    {staff.position || t('staff.position.unknown') || 'Staff Member'}
                                </Text>
                            </View>
                        </View>
                        {/* More Menu Placeholder (if needed later) */}
                        {/* <Pressable className="p-1"><MoreVertical size={16} color={isDark ? '#fff' : '#000'} /></Pressable> */}
                    </View>

                    {/* Quick Actions */}
                    <View className="flex-row items-center gap-2 mt-3">
                        {/* Email Action */}
                        {staff.email && (
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                    openUrl(`mailto:${staff.email} `);
                                }}
                                className={`flex - 1 flex - row items - center justify - center py - 2 px - 3 rounded - xl ${isDark ? 'bg-white/10' : 'bg-blue-50'} active: opacity - 70`}
                            >
                                <Mail size={14} color={isDark ? '#60a5fa' : '#2563eb'} />
                                <Text className={`text - xs font - medium ml - 2 ${isDark ? 'text-blue-300' : 'text-blue-600'} `}>Email</Text>
                            </Pressable>
                        )}

                        {/* Phone Action */}
                        {staff.phone && (
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                    openUrl(`tel:${staff.phone} `);
                                }}
                                className={`flex - 1 flex - row items - center justify - center py - 2 px - 3 rounded - xl ${isDark ? 'bg-white/10' : 'bg-green-50'} active: opacity - 70`}
                            >
                                <Phone size={14} color={isDark ? '#4ade80' : '#16a34a'} />
                                <Text className={`text - xs font - medium ml - 2 ${isDark ? 'text-green-300' : 'text-green-600'} `}>Call</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    );

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
                        className={`w - 10 h - 10 items - center justify - center rounded - full ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'} border active: opacity - 70`}
                    >
                        <ChevronLeft size={24} color={iconColor} />
                    </Pressable>
                    <Text className={`${textColor} text - xl font - bold tracking - wider`}>
                        {t('admin.school.modules.staff') || 'Team/Staff'}
                    </Text>
                    <Pressable
                        onPress={() => router.push('/(admin)/school/staff/add' as any)}
                        className={`w - 10 h - 10 items - center justify - center rounded - full ${isDark ? 'bg-indigo-500/20 border-indigo-400/30' : 'bg-indigo-100 border-indigo-200'} border active: opacity - 70`}
                    >
                        <Plus size={24} color={isDark ? '#818cf8' : '#4f46e5'} />
                    </Pressable>
                </View>

                {/* Search & Filter Section */}
                <View className="px-6 py-4 space-y-4">
                    {/* Search Bar */}
                    <View className={`flex - row items - center px - 4 h - 12 rounded - 2xl border ${borderColor} ${inputBg} `}>
                        <Search size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                        <TextInput
                            placeholder={t('common.search') || "Search staff..."}
                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className={`flex - 1 ml - 3 text - base ${textColor} h - full`}
                            style={{ textAlign: isRTL ? 'right' : 'left' }}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <X size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                            </Pressable>
                        )}
                    </View>

                    {/* Filter Chips */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                        <Pressable
                            onPress={() => setStatusFilter('all')}
                            className={`mx - 1 px - 4 py - 2 rounded - full border ${statusFilter === 'all' ? 'bg-indigo-600 border-indigo-600' : `${cardBgColor} ${borderColor}`} `}
                        >
                            <Text className={`text - sm font - medium ${statusFilter === 'all' ? 'text-white' : textColor} `}>
                                {t('common.all') || 'All'}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setStatusFilter('active')}
                            className={`mx - 1 px - 4 py - 2 rounded - full border flex - row items - center gap - 1 ${statusFilter === 'active' ? 'bg-emerald-600 border-emerald-600' : `${cardBgColor} ${borderColor}`} `}
                        >
                            <CheckCircle size={14} color={statusFilter === 'active' ? '#fff' : (isDark ? '#34d399' : '#059669')} />
                            <Text className={`text - sm font - medium ${statusFilter === 'active' ? 'text-white' : textColor} `}>
                                {t('status.active') || 'Active'}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setStatusFilter('inactive')}
                            className={`mx - 1 px - 4 py - 2 rounded - full border flex - row items - center gap - 1 ${statusFilter === 'inactive' ? 'bg-slate-500 border-slate-500' : `${cardBgColor} ${borderColor}`} `}
                        >
                            <XCircle size={14} color={statusFilter === 'inactive' ? '#fff' : (isDark ? '#94a3b8' : '#64748b')} />
                            <Text className={`text - sm font - medium ${statusFilter === 'inactive' ? 'text-white' : textColor} `}>
                                {t('status.inactive') || 'Inactive'}
                            </Text>
                        </Pressable>
                    </ScrollView>
                </View>

                {/* Content */}
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={isDark ? "#fff" : "#4f46e5"} />
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <Text className="text-red-500 text-center mb-4">{error}</Text>
                        <Pressable onPress={fetchStaffMembers} className="bg-indigo-600 px-6 py-2 rounded-full">
                            <Text className="text-white font-bold">Try Again</Text>
                        </Pressable>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {filteredStaff.length > 0 ? (
                            filteredStaff.map((staff, index) => (
                                <StaffCard key={staff.id || index} staff={staff} />
                            ))
                        ) : (
                            <View className="py-20 items-center justify-center opacity-60">
                                <Search size={48} color={isDark ? '#fff' : '#000'} />
                                <Text className={`mt - 4 text - center ${textColor} `}>
                                    {t('common.noResults') || "No staff members found"}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
