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
    Calendar,
    UserCheck,
    ClipboardCheck,
    FileText,
    ArrowLeft,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react-native';

export default function MyKids() {
    const { user } = useAuth();
    const { actualTheme } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();

    const isDark = actualTheme === 'dark';

    // State
    const [children, setChildren] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeChildIndex, setActiveChildIndex] = useState(0);

    // Fetch children data
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                setLoading(true);
                if (user?.id) {
                    const response = await usersService.getUserChildren(Number(user.id));
                    setChildren(response.children || []);
                }
            } catch (err: any) {
                console.error('Failed to fetch children data:', err);
                setError(t('parent.noKidsMessage', "We couldn't find any students linked to your account."));
            } finally {
                setLoading(false);
            }
        };

        fetchChildren();
    }, [user?.id, t]);

    // Background Themes
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f172a', '#1e293b']
        : ['#f8fafc', '#f1f5f9'];

    const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const iconColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
    const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

    if (loading) {
        return (
            <View className="flex-1 bg-background">
                <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="absolute inset-0" />
                <SafeAreaView className="flex-1">
                    <Stack.Screen options={{ headerShown: false }} />
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={isDark ? '#fff' : '#4f46e5'} />
                        <Text className={`${subTextColor} mt-4 font-medium`}>{t('common.loading', 'Loading...')}</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (error || children.length === 0) {
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
                            <Text className={`${textColor} text-xl font-bold`}>{t('parentHome.myKids', 'My Kids')}</Text>
                        </View>
                    </View>

                    <View className="flex-1 items-center justify-center px-6">
                        <View className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'} border-2 border-dashed ${cardBorder} w-full`}>
                            <View className="items-center">
                                <View className={`p-4 rounded-full ${cardBg} border ${cardBorder} mb-4`}>
                                    <Users size={32} color={iconColor} />
                                </View>
                                <Text className={`${textColor} text-lg font-bold text-center mb-2`}>
                                    {t('parent.noKidsTitle', 'No linked children')}
                                </Text>
                                <Text className={`${subTextColor} text-sm text-center`}>
                                    {error || t('parent.noKidsMessage', "We couldn't find any students linked to your account. Please contact the school to link your children.")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const activeChild = children[activeChildIndex];

    // Module cards for each child
    const modules = [
        {
            id: 'profile',
            title: t('kids.profile', 'Profile'),
            description: t('kids.profileDesc', 'View details'),
            icon: Users,
            route: `/(parent)/kids/profile/${activeChild.id}`,
            color: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
            iconColor: isDark ? '#818cf8' : '#4f46e5',
            borderColor: isDark ? 'border-indigo-500/20' : 'border-indigo-200'
        },
        {
            id: 'timetable',
            title: t('kids.timetable', 'Timetable'),
            description: t('kids.timetableDesc', 'Weekly schedule'),
            icon: Calendar,
            route: `/(parent)/kids/timetable/${activeChild.id}`,
            color: isDark ? 'bg-sky-500/10' : 'bg-sky-50',
            iconColor: isDark ? '#38bdf8' : '#0284c7',
            borderColor: isDark ? 'border-sky-500/20' : 'border-sky-200'
        },
        {
            id: 'attendance',
            title: t('kids.attendance', 'Attendance'),
            description: t('kids.attendanceDesc', 'Track presence'),
            icon: UserCheck,
            route: `/(parent)/kids/attendance/${activeChild.id}`,
            color: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            iconColor: isDark ? '#34d399' : '#059669',
            borderColor: isDark ? 'border-emerald-500/20' : 'border-emerald-200'
        },
        {
            id: 'homework',
            title: t('kids.homework', 'Homework'),
            description: t('kids.homeworkDesc', 'Assignments & grades'),
            icon: ClipboardCheck,
            route: `/(parent)/kids/homework/${activeChild.id}`,
            color: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            iconColor: isDark ? '#fbbf24' : '#d97706',
            borderColor: isDark ? 'border-amber-500/20' : 'border-amber-200'
        },
        {
            id: 'report',
            title: t('kids.report', 'Report'),
            description: t('kids.reportDesc', 'Academic progress'),
            icon: FileText,
            route: `/(parent)/kids/report/${activeChild.id}`,
            color: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
            iconColor: isDark ? '#a78bfa' : '#7c3aed',
            borderColor: isDark ? 'border-violet-500/20' : 'border-violet-200'
        },
    ];

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
                        <Text className={`${textColor} text-xl font-bold`}>{t('parentHome.myKids', 'My Kids')}</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Children Tabs - Only show if more than one child */}
                    {children.length > 1 && (
                        <View className="mb-6">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                                {children.map((child, index) => (
                                    <Pressable
                                        key={child.id}
                                        onPress={() => setActiveChildIndex(index)}
                                        className={`px-6 py-3 rounded-xl flex-row items-center gap-3 ${activeChildIndex === index
                                            ? isDark
                                                ? 'bg-indigo-500/20 border-indigo-500/30'
                                                : 'bg-white border-indigo-200'
                                            : `${cardBg} ${cardBorder}`
                                            } border active:opacity-70`}
                                    >
                                        {/* Child Avatar */}
                                        <View className={`w-10 h-10 rounded-full justify-center items-center overflow-hidden ${activeChildIndex === index
                                            ? isDark ? 'bg-indigo-500/30' : 'bg-indigo-100'
                                            : isDark ? 'bg-slate-700' : 'bg-slate-100'
                                            }`}>
                                            {child.profile_picture_url || child.profile?.profile_picture ? (
                                                <ImageBackground
                                                    source={{ uri: child.profile_picture_url || child.profile?.profile_picture }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <Text className={`font-bold ${activeChildIndex === index
                                                    ? isDark ? 'text-indigo-300' : 'text-indigo-600'
                                                    : subTextColor
                                                    }`}>
                                                    {child.first_name[0]}
                                                </Text>
                                            )}
                                        </View>
                                        <Text className={`font-bold ${activeChildIndex === index
                                            ? isDark ? 'text-indigo-300' : 'text-indigo-600'
                                            : textColor
                                            }`}>
                                            {child.first_name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Active Child Profile Card */}
                    <View className={`mb-6 p-6 rounded-2xl ${cardBg} border ${cardBorder}`}>
                        <View className="flex-row items-center gap-4">
                            {/* Avatar */}
                            <View className={`w-20 h-20 rounded-2xl justify-center items-center overflow-hidden ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                {activeChild.profile_picture_url || activeChild.profile?.profile_picture ? (
                                    <ImageBackground
                                        source={{ uri: activeChild.profile_picture_url || activeChild.profile?.profile_picture }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-blue-500 font-bold text-2xl">{activeChild.first_name[0]}</Text>
                                )}
                            </View>

                            {/* Info */}
                            <View className="flex-1">
                                <Text className={`${textColor} text-xl font-bold`}>
                                    {activeChild.full_name || `${activeChild.first_name} ${activeChild.last_name}`}
                                </Text>
                                <View className="flex-row items-center gap-2 mt-2">
                                    <View className={`px-3 py-1 rounded-lg ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                                        <Text className={`${isDark ? 'text-indigo-400' : 'text-indigo-700'} text-xs font-bold`}>
                                            {activeChild.grade || t('common.student', 'Student')}
                                        </Text>
                                    </View>
                                    {activeChild.class_name && (
                                        <Text className={`${subTextColor} text-sm font-medium`}>• {activeChild.class_name}</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Navigation Arrows for Multiple Children */}
                    {children.length > 1 && (
                        <View className="flex-row items-center justify-between mb-6">
                            <Pressable
                                onPress={() => setActiveChildIndex((prev) => (prev > 0 ? prev - 1 : children.length - 1))}
                                className={`flex-row items-center gap-2 px-4 py-2 rounded-xl ${cardBg} border ${cardBorder} active:opacity-70`}
                                disabled={children.length <= 1}
                            >
                                <ChevronLeft size={16} color={iconColor} />
                                <Text className={`${textColor} text-sm font-semibold`}>{t('common.previous', 'Previous')}</Text>
                            </Pressable>

                            <Text className={`${subTextColor} text-sm font-medium`}>
                                {activeChildIndex + 1} / {children.length}
                            </Text>

                            <Pressable
                                onPress={() => setActiveChildIndex((prev) => (prev < children.length - 1 ? prev + 1 : 0))}
                                className={`flex-row items-center gap-2 px-4 py-2 rounded-xl ${cardBg} border ${cardBorder} active:opacity-70`}
                                disabled={children.length <= 1}
                            >
                                <Text className={`${textColor} text-sm font-semibold`}>{t('common.next', 'Next')}</Text>
                                <ChevronRight size={16} color={iconColor} />
                            </Pressable>
                        </View>
                    )}

                    {/* Bento Grid - 2 Column Layout */}
                    <View className="flex-row flex-wrap justify-between gap-y-4">
                        {modules.map((module) => (
                            <Pressable
                                key={module.id}
                                className={`w-[48%] rounded-2xl p-4 border active:scale-[0.98] transition-transform ${module.color} ${module.borderColor}`}
                                onPress={() => router.push(module.route as any)}
                            >
                                <View className="mb-3 w-10 h-10 rounded-full bg-white/10 items-center justify-center">
                                    <module.icon size={24} color={module.iconColor} />
                                </View>

                                <Text className={`${textColor} text-base font-bold mb-1`} numberOfLines={1}>
                                    {module.title}
                                </Text>
                                <Text className={`${subTextColor} text-xs leading-4`} numberOfLines={2}>
                                    {module.description}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
