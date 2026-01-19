import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, RefreshControl, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../api/client';
import {
    ChevronLeft,
    Users,
    Clock,
    BookOpen,
    MapPin,
    GraduationCap,
    MoreHorizontal,
    LayoutGrid,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// --- CONSTANTS & THEME ---
const { width } = Dimensions.get('window');

const getThemeColors = (isDark: boolean) => {
    return {
        // Deep Night vs Soft Cloud
        bgGradient: isDark
            ? ['#0f0c29', '#302b63', '#24243e'] as const
            : ['#f0f9ff', '#e0f2fe', '#bae6fd'] as const,
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/60' : 'text-gray-600',
        iconColor: isDark ? '#fff' : '#1e293b',
        glassBg: isDark ? 'bg-white/5' : 'bg-white/60',
        glassBorder: isDark ? 'border-white/10' : 'border-white/40',
        shimmer: isDark ? ['#ffffff05', '#ffffff10', '#ffffff05'] : ['#ffffff40', '#ffffff60', '#ffffff40'],
    };
};

// Vibrant Gradients for Class Cards (Option A: Visual Identity)
const CARD_GRADIENTS = [
    ['#ec4899', '#db2777'], // Pink
    ['#8b5cf6', '#7c3aed'], // Violet
    ['#3b82f6', '#2563eb'], // Blue
    ['#10b981', '#059669'], // Emerald
    ['#f59e0b', '#d97706'], // Amber
    ['#6366f1', '#4f46e5'], // Indigo
];

export default function MyClassesPage() {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const theme = getThemeColors(isDark);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalClasses: 0,
        totalHours: 0,
        totalSubjects: 0,
    });

    // Hide Bottom Tab Bar
    useEffect(() => {
        router.setParams({}); // Trigger re-render to ensure navigation is ready
        const parent = router.navigation && router.navigation.getParent ? router.navigation.getParent() : null;
        if (parent) {
            parent.setOptions({ tabBarStyle: { display: 'none' } });
        }
        return () => {
            if (parent) {
                parent.setOptions({
                    tabBarStyle: {
                        display: 'flex',
                        backgroundColor: '#fff',
                        height: 85, // Restore original height from _layout
                        paddingBottom: 25,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: '#e2e8f0',
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                    }
                });
            }
        };
    }, []);

    const fetchTeacherClasses = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await api.get('/attendance/timetable-sessions/');
            const rawData = response.data;
            const allSessions: any[] = Array.isArray(rawData) ? rawData : (rawData.results || []);

            // Filter for current teacher
            const teacherSessions = allSessions.filter((session: any) => {
                const teacherIdStr = typeof session.teacher === 'object' ? session.teacher.id : session.teacher;
                return String(teacherIdStr) === String(user.id);
            });

            const classesMap = new Map();
            let totalHours = 0;
            const uniqueSubjects = new Set();

            teacherSessions.forEach((session: any) => {
                if (session.class_name && session.timetable_id) {
                    const classId = session.timetable_id;
                    if (!classesMap.has(classId)) {
                        classesMap.set(classId, {
                            id: classId,
                            school_class_id: session.school_class_id,
                            name: session.class_name || 'Unknown',
                            section: session.class_section || '',
                            room: session.room_name ? { name: session.room_name } : null,
                            weekly_sessions: 0,
                            subjects_taught: [],
                        });
                    }

                    const classData = classesMap.get(classId);

                    // Add subject if new
                    const subjectExists = classData.subjects_taught.some((s: any) => s.id === session.subject);
                    if (session.subject && session.subject_name && !subjectExists) {
                        classData.subjects_taught.push({
                            id: session.subject,
                            name: session.subject_name,
                            name_arabic: session.subject_name_arabic,
                            name_french: session.subject_name_french,
                        });
                        uniqueSubjects.add(session.subject);
                    }

                    classData.weekly_sessions++;
                    totalHours++;
                }
            });

            const classesList = Array.from(classesMap.values());
            setClasses(classesList);
            setStats({
                totalClasses: classesList.length,
                totalHours: totalHours,
                totalSubjects: uniqueSubjects.size
            });

        } catch (err) {
            console.error('Error fetching classes:', err);
        }
    }, [user?.id]);

    const loadData = useCallback(async () => {
        setLoading(true);
        await fetchTeacherClasses();
        setLoading(false);
    }, [fetchTeacherClasses]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Haptics.selectionAsync();
        await fetchTeacherClasses();
        setRefreshing(false);
    }, [fetchTeacherClasses]);

    // Helper for subject name translation
    const getSubjectName = (subj: any) => {
        if (!subj) return '';
        if (isRTL && subj.name_arabic) return subj.name_arabic;
        if (i18n.language === 'fr' && subj.name_french) return subj.name_french;
        return subj.name;
    };

    return (
        <View className="flex-1 bg-background">
            {/* Global Background */}
            <LinearGradient
                colors={theme.bgGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />
            {isDark && <View className="absolute inset-0 bg-black/10" />}

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* 1. Glass Header */}
                <View className="px-3 pt-4 pb-2 flex-row items-center justify-between z-50">
                    <Pressable
                        onPress={() => router.back()}
                        className={`w-10 h-10 items-center justify-center rounded-full ${theme.glassBg} border ${theme.glassBorder} active:opacity-70`}
                    >
                        <ChevronLeft size={24} color={theme.iconColor} />
                    </Pressable>
                    <Text className={`${theme.textColor} text-xl font-bold tracking-wider`}>
                        {t('teacherHome.myClasses', 'My Classes')}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    className="flex-1 px-3 pt-4"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? "#fff" : "#db2777"} />
                    }
                >
                    {/* 2. Premium Stats Row (Glassmorphic) */}
                    <View className="flex-row gap-3 mb-6">
                        {/* Stat Card 1: Total Classes */}
                        <LinearGradient
                            colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] : ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)']}
                            className={`flex-1 p-4 rounded-2xl border ${theme.glassBorder}`}
                        >
                            <View className="items-center">
                                <View className="w-10 h-10 rounded-full bg-pink-500/20 items-center justify-center mb-2">
                                    <View className="w-6 h-6 rounded-full bg-pink-500 items-center justify-center shadow-lg shadow-pink-500/50">
                                        <LayoutGrid size={14} color="#fff" />
                                    </View>
                                </View>
                                <Text className={`text-2xl font-bold ${theme.textColor}`}>{stats.totalClasses}</Text>
                                <Text className={`text-[10px] uppercase tracking-wider ${theme.subTextColor} font-bold opacity-70`}>
                                    {t('common.totalClasses', 'Classes')}
                                </Text>
                            </View>
                        </LinearGradient>

                        {/* Stat Card 2: Weekly Hours */}
                        <LinearGradient
                            colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] : ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)']}
                            className={`flex-1 p-4 rounded-2xl border ${theme.glassBorder}`}
                        >
                            <View className="items-center">
                                <View className="w-10 h-10 rounded-full bg-violet-500/20 items-center justify-center mb-2">
                                    <View className="w-6 h-6 rounded-full bg-violet-500 items-center justify-center shadow-lg shadow-violet-500/50">
                                        <Clock size={14} color="#fff" />
                                    </View>
                                </View>
                                <Text className={`text-2xl font-bold ${theme.textColor}`}>{stats.totalHours}h</Text>
                                <Text className={`text-[10px] uppercase tracking-wider ${theme.subTextColor} font-bold opacity-70`}>
                                    {t('common.week', 'Weekly')}
                                </Text>
                            </View>
                        </LinearGradient>

                        {/* Stat Card 3: Subjects */}
                        <LinearGradient
                            colors={isDark ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)'] : ['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.4)']}
                            className={`flex-1 p-4 rounded-2xl border ${theme.glassBorder}`}
                        >
                            <View className="items-center">
                                <View className="w-10 h-10 rounded-full bg-cyan-500/20 items-center justify-center mb-2">
                                    <View className="w-6 h-6 rounded-full bg-cyan-500 items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <BookOpen size={14} color="#fff" />
                                    </View>
                                </View>
                                <Text className={`text-2xl font-bold ${theme.textColor}`}>{stats.totalSubjects}</Text>
                                <Text className={`text-[10px] uppercase tracking-wider ${theme.subTextColor} font-bold opacity-70`}>
                                    {t('teachers.subjects', 'Subjects')}
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* 3. The Visual Grid (Option A) */}
                    <View className="gap-5">
                        {loading && !refreshing ? (
                            // Skeleton Loading Effect
                            [1, 2, 3].map((i) => (
                                <View key={i} className={`h-40 w-full rounded-2xl ${theme.glassBg} border ${theme.glassBorder} opacity-50`} />
                            ))
                        ) : classes.length > 0 ? (
                            classes.map((cls, index) => {
                                // Cycle through gradients
                                const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

                                return (
                                    <Pressable
                                        key={cls.id}
                                        className="w-full active:scale-[0.98] transition-transform"
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                            router.push({
                                                pathname: '/(teacher)/classes/[id]',
                                                params: { id: cls.school_class_id }
                                            });
                                        }}
                                    >
                                        <View className="w-full h-52 rounded-2xl overflow-hidden relative"
                                            style={{
                                                shadowColor: gradient[0],
                                                shadowOpacity: 0.15, // Reduced from 0.3
                                                shadowRadius: 8, // Reduced from 12
                                                shadowOffset: { width: 0, height: 4 },
                                                elevation: 4
                                            }}
                                        >
                                            {/* Glassy Background */}
                                            <LinearGradient
                                                colors={isDark
                                                    ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                                                    : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                className={`absolute inset-0 border ${isDark ? 'border-white/10' : 'border-white/40'}`}
                                            />

                                            {/* Decorative Circles (Subtler) */}
                                            <View className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-3xl opacity-50" />
                                            <View className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-2xl opacity-50" />

                                            {/* Content Overlay */}
                                            <View className="flex-1 p-6 justify-between gap-4">

                                                {/* Top Row: Icon & Hours Pill */}
                                                <View className="flex-row justify-between items-start">
                                                    {/* Gradient Icon Container */}
                                                    <LinearGradient
                                                        colors={gradient as any}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        className="w-12 h-12 rounded-2xl items-center justify-center shadow-lg"
                                                        style={{ shadowColor: gradient[0], shadowOpacity: 0.3, shadowRadius: 6 }}
                                                    >
                                                        <Users size={24} color="#fff" />
                                                    </LinearGradient>

                                                    <View className={`px-3 py-1.5 rounded-full ${isDark ? 'bg-black/20' : 'bg-white/40'} border ${theme.glassBorder} flex-row items-center gap-1.5`}>
                                                        <Clock size={12} color={theme.subTextColor} />
                                                        <Text className={`${theme.textColor} text-xs font-bold`}>
                                                            {cls.weekly_sessions}h / {t('common.week', 'Wk')}
                                                        </Text>
                                                    </View>
                                                </View>


                                                {/* Bottom Row: Class Info */}
                                                <View>
                                                    {/* Subject Badge */}
                                                    <View className="flex-row flex-wrap gap-2 mb-2">
                                                        {cls.subjects_taught.map((subj: any, idx: number) => (
                                                            <View key={idx} className={`px-2.5 py-1 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${theme.glassBorder} self-start`}>
                                                                <Text className={`${theme.textColor} text-[10px] font-bold uppercase tracking-wide`}>
                                                                    {getSubjectName(subj)}
                                                                </Text>
                                                            </View>
                                                        ))}
                                                    </View>

                                                    <Text className={`${theme.textColor} text-3xl font-bold tracking-tight mb-1`}>
                                                        {cls.name}
                                                    </Text>

                                                    <View className="flex-row items-center justify-between">
                                                        <Text className={`${theme.subTextColor} text-base font-medium`}>
                                                            Section {cls.section || 'A'}
                                                        </Text>

                                                        {cls.room && (
                                                            <View className="flex-row items-center gap-1.5">
                                                                <MapPin size={14} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"} />
                                                                <Text className={`${theme.subTextColor} text-sm`}>
                                                                    {cls.room.name}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </Pressable>
                                );
                            })
                        ) : (
                            // Empty State
                            <View className={`items-center justify-center py-20 rounded-[32px] ${theme.glassBg} border ${theme.glassBorder} p-8`}>
                                <View className="w-20 h-20 rounded-full bg-gray-500/10 items-center justify-center mb-4">
                                    <GraduationCap size={32} color={theme.subTextColor} />
                                </View>
                                <Text className={`text-xl font-bold ${theme.textColor} mb-2 text-center`}>
                                    {t('teachers.noClassesFound', 'No Classes Found')}
                                </Text>
                                <Text className={`text-sm ${theme.subTextColor} text-center`}>
                                    {t('teachers.noClassesMessage', 'Your schedule is currently empty.')}
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
