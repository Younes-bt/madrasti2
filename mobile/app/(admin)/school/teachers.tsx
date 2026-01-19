import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../api/client';
import {
    ChevronLeft,
    Search,
    Mail,
    Phone,
    Plus,
    X,
    BookOpen
} from 'lucide-react-native';

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

export default function TeachersPage() {
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const { bgColors, textColor, subTextColor, iconColor, cardBgColor, borderColor, inputBg } = getColors(isDark);

    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [subjectFilter, setSubjectFilter] = useState<string>('all');

    const [error, setError] = useState<string | null>(null);

    // Fetch Teachers Data
    const fetchTeachers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/users/users/', { params: { role: 'TEACHER' } });

            // Handle different response structures if necessary (e.g. pagination)
            const teachersData = response.data?.results || (Array.isArray(response.data) ? response.data : []);

            setTeachers(teachersData);
            setFilteredTeachers(teachersData);
        } catch (err: any) {
            console.error('Failed to fetch teachers:', err);
            if (err.response?.status === 401) {
                setError(t('error.unauthorized') || 'Unauthorized: Please sign in again.');
            } else {
                setError(t('error.failedToLoadData') || 'Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    }, [t]);

    // Fetch Subjects
    const fetchSubjects = async () => {
        try {
            const response = await api.get('/schools/subjects/');
            const subjectsData = response.data?.results || (Array.isArray(response.data) ? response.data : []);
            setSubjects(subjectsData);
        } catch (err) {
            console.error('Failed to fetch subjects:', err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTeachers();
            fetchSubjects();
        }, [fetchTeachers])
    );

    const getDisplaySubject = useCallback((subject: any) => {
        if (!subject) return null;
        const lang = i18n.language;
        if (lang === 'ar' && subject.name_arabic) {
            return subject.name_arabic;
        }
        if (lang === 'fr' && subject.name_french) {
            return subject.name_french;
        }
        return subject.name;
    }, [i18n.language]);

    // Filter Logic
    useEffect(() => {
        let result = teachers;

        // 1. Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(teacher =>
                statusFilter === 'active' ? teacher.is_active : !teacher.is_active
            );
        }

        // 2. Subject Filter
        if (subjectFilter !== 'all') {
            result = result.filter(teacher =>
                teacher.school_subject?.id?.toString() === subjectFilter
            );
        }

        // 3. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(teacher => {
                const subjectName = getDisplaySubject(teacher.school_subject)?.toLowerCase() || '';
                const searchableFields = [
                    teacher.first_name,
                    teacher.last_name,
                    teacher.ar_first_name,
                    teacher.ar_last_name,
                    teacher.email,
                    teacher.phone,
                    subjectName
                ].filter(Boolean).join(' ').toLowerCase();
                return searchableFields.includes(query);
            });
        }

        setFilteredTeachers(result);
    }, [teachers, statusFilter, subjectFilter, searchQuery, i18n.language, getDisplaySubject]);

    // Helper to open URLs
    const openUrl = (url: string) => {
        if (!url) return;
        Linking.openURL(url).catch(err => console.error("Couldn't open URL", err));
    };

    const getDisplayName = (teacher: any) => {
        if (isRTL && (teacher.ar_first_name || teacher.ar_last_name)) {
            return `${teacher.ar_first_name || ''} ${teacher.ar_last_name || ''}`.trim();
        }
        return teacher.full_name || `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim();
    };



    const TeacherCard = ({ teacher }: { teacher: any }) => (
        <Pressable
            // onPress={() => router.push(`/(admin)/school/teachers/${teacher.id}` as any)} // Page doesn't exist yet, disabling for now or could link to staff view if compatible
            // For now, let's keep it pressable but maybe just show detailed alert or do nothing if no detail page
            onPress={() => router.push(`/(admin)/school/teachers/${teacher.id}` as any)}
            className={`rounded-3xl p-4 mb-4 ${cardBgColor} border ${borderColor} active:scale-[0.98] transition-transform`}
        >
            <View className="flex-row items-start gap-4">
                {/* Avatar */}
                <View className="relative">
                    <View className={`h-14 w-14 rounded-2xl ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'} items-center justify-center overflow-hidden border ${isDark ? 'border-pink-400/30' : 'border-pink-200'}`}>
                        {teacher.profile_picture_url ? (
                            <Image source={{ uri: teacher.profile_picture_url }} className="h-full w-full" resizeMode="cover" />
                        ) : (
                            <Text className={`text-lg font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                                {(teacher.first_name?.[0] || '') + (teacher.last_name?.[0] || '')}
                            </Text>
                        )}
                    </View>
                    {/* Status Dot */}
                    <View className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark ? 'border-[#1e293b]' : 'border-white'} ${teacher.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                </View>

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-2">
                            <Text className={`text-lg font-bold ${textColor} leading-tight text-left`}>
                                {getDisplayName(teacher)}
                            </Text>
                            <View className="flex-row items-center gap-1 mt-1">
                                <BookOpen size={12} color={isDark ? '#94a3b8' : '#64748b'} />
                                <Text className={`text-xs ${subTextColor}`}>
                                    {getDisplaySubject(teacher.school_subject) || t('teachers.teacher') || 'Teacher'}
                                </Text>
                            </View>
                        </View>
                        {/* More Menu Placeholder (if needed later) */}
                        {/* <Pressable className="p-1"><MoreVertical size={16} color={isDark ? '#fff' : '#000'} /></Pressable> */}
                    </View>

                    {/* Quick Actions */}
                    <View className="flex-row items-center gap-2 mt-3">
                        {/* Email Action */}
                        {teacher.email && (
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                    openUrl(`mailto:${teacher.email}`);
                                }}
                                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-xl ${isDark ? 'bg-white/10' : 'bg-blue-50'} active:opacity-70`}
                            >
                                <Mail size={14} color={isDark ? '#60a5fa' : '#2563eb'} />
                                <Text className={`text-xs font-medium ml-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Email</Text>
                            </Pressable>
                        )}

                        {/* Phone Action */}
                        {teacher.phone && (
                            <Pressable
                                onPress={(e) => {
                                    e.stopPropagation();
                                    openUrl(`tel:${teacher.phone}`);
                                }}
                                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-xl ${isDark ? 'bg-white/10' : 'bg-green-50'} active:opacity-70`}
                            >
                                <Phone size={14} color={isDark ? '#4ade80' : '#16a34a'} />
                                <Text className={`text-xs font-medium ml-2 ${isDark ? 'text-green-300' : 'text-green-600'}`}>Call</Text>
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
                        className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'} border active:opacity-70`}
                    >
                        <ChevronLeft size={24} color={iconColor} />
                    </Pressable>
                    <Text className={`${textColor} text-xl font-bold tracking-wider`}>
                        {t('admin.school.modules.teachers') || 'Teachers'}
                    </Text>
                    {/* Add Teacher Button (Assuming we'll add route later or reuse) */}
                    <Pressable
                        // onPress={() => router.push('/(admin)/school/teachers/add' as any)} 
                        onPress={() => router.push('/(admin)/school/teachers/add' as any)}
                        className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-pink-500/20 border-pink-400/30' : 'bg-pink-100 border-pink-200'} border active:opacity-70`}
                    >
                        <Plus size={24} color={isDark ? '#f472b6' : '#db2777'} />
                    </Pressable>
                </View>

                {/* Search & Filter Section */}
                <View className="px-6 py-4 space-y-4">
                    {/* Search Bar */}
                    <View className={`flex-row items-center px-4 h-12 rounded-2xl border ${borderColor} ${inputBg}`}>
                        <Search size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                        <TextInput
                            placeholder={t('common.search') || "Search teachers..."}
                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className={`flex-1 ml-3 text-base ${textColor} h-full`}
                            style={{ textAlign: isRTL ? 'right' : 'left' }}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <X size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                            </Pressable>
                        )}
                    </View>

                    {/* Filters ScrollView */}
                    <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                            {/* Status Filters */}
                            <Pressable
                                onPress={() => { setStatusFilter('all'); setSubjectFilter('all'); }}
                                className={`mx-1 px-4 py-2 rounded-full border ${statusFilter === 'all' && subjectFilter === 'all' ? 'bg-pink-600 border-pink-600' : `${cardBgColor} ${borderColor}`}`}
                            >
                                <Text className={`text-sm font-medium ${(statusFilter === 'all' && subjectFilter === 'all') ? 'text-white' : textColor}`}>
                                    {t('common.all') || 'All'}
                                </Text>
                            </Pressable>

                            {/* Subject Filters (if available) */}
                            {subjects.map(subject => {
                                const isSelected = subjectFilter === subject.id.toString();
                                return (
                                    <Pressable
                                        key={subject.id}
                                        onPress={() => setSubjectFilter(isSelected ? 'all' : subject.id.toString())}
                                        className={`mx-1 px-4 py-2 rounded-full border ${isSelected ? 'bg-pink-600 border-pink-600' : `${cardBgColor} ${borderColor}`}`}
                                    >
                                        <Text className={`text-sm font-medium ${isSelected ? 'text-white' : textColor}`}>
                                            {getDisplaySubject(subject)}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>

                {/* Content */}
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={isDark ? "#fff" : "#db2777"} />
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <Text className="text-red-500 text-center mb-4">{error}</Text>
                        <Pressable onPress={fetchTeachers} className="bg-pink-600 px-6 py-2 rounded-full">
                            <Text className="text-white font-bold">Try Again</Text>
                        </Pressable>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {filteredTeachers.length > 0 ? (
                            filteredTeachers.map((teacher, index) => (
                                <TeacherCard key={teacher.id || index} teacher={teacher} />
                            ))
                        ) : (
                            <View className="py-20 items-center justify-center opacity-60">
                                <Search size={48} color={isDark ? '#fff' : '#000'} />
                                <Text className={`mt-4 text-center ${textColor}`}>
                                    {t('common.noResults') || "No teachers found"}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
