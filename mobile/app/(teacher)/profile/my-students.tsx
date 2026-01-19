import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, RefreshControl, Image, TextInput } from 'react-native';
import { Stack, useRouter, useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../api/client';
import {
    ChevronLeft,
    Search,
    Users,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

// --- CONSTANTS & THEME ---

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
        inputBg: isDark ? 'bg-white/10' : 'bg-white',
    };
};

export default function MyStudentsPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const navigation = useNavigation();
    const isDark = actualTheme === 'dark';
    const theme = getThemeColors(isDark);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        males: 0,
        females: 0
    });

    // Hide Bottom Tab Bar
    useEffect(() => {
        const parent = navigation.getParent();
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
    }, [navigation]);

    const fetchStudents = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await api.get('/users/users/my_students/');
            const data = response.data;
            const studentsList = data.students || [];

            setStudents(studentsList);
            setFilteredStudents(studentsList);

            // Calculate stats
            let males = 0;
            let females = 0;
            studentsList.forEach((s: any) => {
                const gender = s.gender ? s.gender.toUpperCase() : '';
                if (gender === 'MALE') males++;
                else if (gender === 'FEMALE') females++;
            });

            setStats({
                total: studentsList.length,
                males,
                females
            });

        } catch (err) {
            console.error('Error fetching students:', err);
        }
    }, [user?.id]);

    const loadData = useCallback(async () => {
        setLoading(true);
        await fetchStudents();
        setLoading(false);
    }, [fetchStudents]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Haptics.selectionAsync();
        await fetchStudents();
        setRefreshing(false);
    }, [fetchStudents]);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (!text.trim()) {
            setFilteredStudents(students);
            return;
        }
        const lowerText = text.toLowerCase();
        const filtered = students.filter(student =>
            student.full_name?.toLowerCase().includes(lowerText) ||
            student.email?.toLowerCase().includes(lowerText)
        );
        setFilteredStudents(filtered);
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

                {/* 1. Header */}
                <View className="px-3 pt-4 pb-2 flex-row items-center justify-between z-50">
                    <Pressable
                        onPress={() => router.back()}
                        className={`w-10 h-10 items-center justify-center rounded-full ${theme.glassBg} border ${theme.glassBorder} active:opacity-70`}
                    >
                        <ChevronLeft size={24} color={theme.iconColor} />
                    </Pressable>
                    <Text className={`${theme.textColor} text-xl font-bold tracking-wider`}>
                        {t('teacherHome.myStudents', 'My Students')}
                    </Text>
                    <View className="w-10" />
                </View>

                {/* 2. Search & Stats */}
                <View className="px-3 pb-4 space-y-4">
                    {/* Search Bar */}
                    <View className={`flex-row items-center px-4 h-12 rounded-2xl ${theme.inputBg} border ${theme.glassBorder}`}>
                        <Search size={20} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"} />
                        <TextInput
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholder={t('common.search', 'Search students...')}
                            placeholderTextColor={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
                            className={`flex-1 ml-3 ${theme.textColor} text-base`}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => handleSearch('')}>
                                <Users size={16} color={theme.subTextColor} />
                            </Pressable>
                        )}
                    </View>

                    {/* Quick Stats Pill */}
                    <View className="flex-row justify-between items-center px-1">
                        <Text className={`${theme.subTextColor} text-sm font-medium`}>
                            {stats.total} {t('common.students', 'Students')}
                        </Text>
                        <View className="flex-row gap-3">
                            <View className="flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-blue-400" />
                                <Text className={`${theme.subTextColor} text-xs`}>{stats.males} M</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <View className="w-2 h-2 rounded-full bg-pink-400" />
                                <Text className={`${theme.subTextColor} text-xs`}>{stats.females} F</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 3. Students List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    className="flex-1 px-3"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? "#fff" : "#db2777"} />
                    }
                >
                    <View className="gap-3">
                        {loading && !refreshing ? (
                            // Skeleton Loading
                            [1, 2, 3, 4, 5].map((i) => (
                                <View key={i} className={`h-24 w-full rounded-2xl ${theme.glassBg} border ${theme.glassBorder} opacity-50`} />
                            ))
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <Pressable
                                    key={student.id}
                                    className={`p-4 rounded-2xl ${theme.glassBg} border ${theme.glassBorder} active:bg-black/5 transition-colors`}
                                    onPress={() => {
                                        // Potential future navigation to student details
                                        Haptics.selectionAsync();
                                        // router.push(`/(teacher)/student/${student.id}`);
                                    }}
                                >
                                    <View className="flex-row items-center gap-4">
                                        {/* Avatar */}
                                        <View className="relative">
                                            <View className={`w-14 h-14 rounded-full items-center justify-center overflow-hidden border-2 ${isDark ? 'border-white/20' : 'border-white/50'}`}>
                                                {student.avatar ? (
                                                    <Image source={{ uri: student.avatar }} className="w-full h-full" resizeMode="cover" />
                                                ) : (
                                                    <View className={`w-full h-full items-center justify-center ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                                        <Text className={`text-lg font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                            {student.full_name?.charAt(0) || 'S'}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            {/* Gender Indicator */}
                                            <View className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full items-center justify-center border-2 ${isDark ? 'border-[#0f0c29]' : 'border-white'} ${student.gender === 'FEMALE' ? 'bg-pink-500' : 'bg-blue-500'}`} />
                                        </View>

                                        {/* Info */}
                                        <View className="flex-1 gap-1">
                                            <Text className={`${theme.textColor} text-base font-bold`}>{student.full_name}</Text>

                                            {/* Classes Tags */}
                                            <View className="flex-row flex-wrap gap-1.5 mt-1">
                                                {student.classes.map((cls: any, idx: number) => (
                                                    <View key={idx} className={`px-2 py-0.5 rounded-md ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                                                        <Text className={`text-[10px] ${theme.subTextColor} font-medium`}>
                                                            {cls.name}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>

                                            {/* Contact (Optional) */}
                                            {/* <Text className={`text-xs ${theme.subTextColor} mt-1`} numberOfLines={1}>
                                                {student.email || 'No email'}
                                            </Text> */}
                                        </View>

                                        <ChevronLeft size={16} color={theme.subTextColor} style={{ transform: [{ rotate: '180deg' }] }} />
                                    </View>
                                </Pressable>
                            ))
                        ) : (
                            <View className="items-center justify-center py-20">
                                <View className="w-20 h-20 rounded-full bg-gray-500/10 items-center justify-center mb-4">
                                    <Users size={32} color={theme.subTextColor} />
                                </View>
                                <Text className={`text-xl font-bold ${theme.textColor} mb-2`}>
                                    {t('common.noResults', 'No students found')}
                                </Text>
                                <Text className={`text-sm ${theme.subTextColor}`}>
                                    {t('common.tryDifferentSearch', 'Try a different search term')}
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
