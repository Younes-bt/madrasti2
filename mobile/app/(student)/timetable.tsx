import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import attendanceService, { MyScheduleResponse, TimetableSession } from '../../api/attendance';
import {
    Calendar,
    Clock,
    User,
    MapPin,
    ArrowLeft,
    AlertCircle,
    GraduationCap,
    LayoutList,
    LayoutGrid,
} from 'lucide-react-native';

// Week days configuration
const WEEK_DAYS = [
    { key: 'monday', value: 1 },
    { key: 'tuesday', value: 2 },
    { key: 'wednesday', value: 3 },
    { key: 'thursday', value: 4 },
    { key: 'friday', value: 5 },
    { key: 'saturday', value: 6 },
];

// Time slots configuration (matching Morocco school schedule)
const TIME_SLOTS = [
    { period: 1, start: '08:00', end: '09:00' },
    { period: 2, start: '09:00', end: '10:00' },
    { period: 3, start: '10:00', end: '11:00' },
    { period: 4, start: '11:20', end: '12:20' }, // Break 11:00-11:20
    { period: 5, start: '12:20', end: '13:20' },
    { period: 6, start: '14:30', end: '15:30' }, // Lunch 13:20-14:30
    { period: 7, start: '15:30', end: '16:30' },
    { period: 8, start: '16:30', end: '17:30' },
];

export default function StudentTimetable() {
    const { actualTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const isDark = actualTheme === 'dark';

    // State
    const [data, setData] = useState<MyScheduleResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(getTodayDayNumber());
    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

    // Get current day number (1-6 for Mon-Sat)
    function getTodayDayNumber(): number {
        const today = new Date().getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
        return today === 0 ? 1 : today; // Default to Monday if Sunday
    }

    // Fetch timetable data
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                setLoading(true);
                const response = await attendanceService.getMySchedule();
                setData(response);
            } catch (err: any) {
                console.error('Failed to fetch timetable:', err);
                setError(t('errors.failedToLoadProfile', 'Failed to load timetable.'));
            } finally {
                setLoading(false);
            }
        };

        fetchTimetable();
    }, [t]);

    // Get subject name based on language
    const getSubjectName = (session: TimetableSession) => {
        if (i18n.language === 'ar' && session.subject_name_arabic) {
            return session.subject_name_arabic;
        }
        return session.subject_name;
    };

    // Get sessions for a specific day
    const getSessionsForDay = (dayValue: number) => {
        if (!data?.sessions) return [];
        return data.sessions
            .filter(s => s.day_of_week === dayValue)
            .sort((a, b) => a.session_order - b.session_order);
    };

    // Subject color generator (consistent hashing)
    const getSubjectColor = (subjectName: string) => {
        const colors = [
            { bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', border: isDark ? 'border-blue-500/20' : 'border-blue-200', text: isDark ? 'text-blue-400' : 'text-blue-700' },
            { bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', border: isDark ? 'border-emerald-500/20' : 'border-emerald-200', text: isDark ? 'text-emerald-400' : 'text-emerald-700' },
            { bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50', border: isDark ? 'border-purple-500/20' : 'border-purple-200', text: isDark ? 'text-purple-400' : 'text-purple-700' },
            { bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50', border: isDark ? 'border-orange-500/20' : 'border-orange-200', text: isDark ? 'text-orange-400' : 'text-orange-700' },
            { bg: isDark ? 'bg-pink-500/10' : 'bg-pink-50', border: isDark ? 'border-pink-500/20' : 'border-pink-200', text: isDark ? 'text-pink-400' : 'text-pink-700' },
            { bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', border: isDark ? 'border-amber-500/20' : 'border-amber-200', text: isDark ? 'text-amber-400' : 'text-amber-700' },
            { bg: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50', border: isDark ? 'border-indigo-500/20' : 'border-indigo-200', text: isDark ? 'text-indigo-400' : 'text-indigo-700' },
        ];
        const hash = subjectName.split('').reduce((acc, char) => {
            acc = ((acc << 5) - acc) + char.charCodeAt(0);
            return acc & acc;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
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

    if (loading) {
        return (
            <View className="flex-1 bg-background">
                <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="absolute inset-0" />
                <SafeAreaView className="flex-1">
                    <Stack.Screen options={{ headerShown: false }} />
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={isDark ? '#fff' : '#4f46e5'} />
                        <Text className={`${subTextColor} mt-4 font-medium`}>{t('common.loading', 'Loading timetable...')}</Text>
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

    const selectedDaySessions = getSessionsForDay(selectedDay);

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
                        <Text className={`${textColor} text-xl font-bold`}>{t('studentHome.myTimetable', 'My Time Table')}</Text>
                    </View>
                    {/* View Toggle */}
                    <View className={`flex-row gap-1 p-1 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-100'} border ${cardBorder}`}>
                        <Pressable
                            onPress={() => setViewMode('cards')}
                            className={`w-9 h-9 items-center justify-center rounded-lg ${viewMode === 'cards' ? (isDark ? 'bg-blue-500/20' : 'bg-white') : ''} active:opacity-70`}
                        >
                            <LayoutList size={18} color={viewMode === 'cards' ? (isDark ? '#60a5fa' : '#2563eb') : iconColor} />
                        </Pressable>
                        <Pressable
                            onPress={() => setViewMode('table')}
                            className={`w-9 h-9 items-center justify-center rounded-lg ${viewMode === 'table' ? (isDark ? 'bg-blue-500/20' : 'bg-white') : ''} active:opacity-70`}
                        >
                            <LayoutGrid size={18} color={viewMode === 'table' ? (isDark ? '#60a5fa' : '#2563eb') : iconColor} />
                        </Pressable>
                    </View>
                </View>

                {/* Info Badges */}
                {(data?.class?.name || data?.academic_year) && (
                    <View className="px-6 pb-4 flex-row gap-2 flex-wrap">
                        {data?.class?.name && (
                            <View className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} border ${isDark ? 'border-blue-500/20' : 'border-blue-200'} flex-row items-center gap-1.5`}>
                                <GraduationCap size={14} color={isDark ? '#60a5fa' : '#2563eb'} />
                                <Text className={`${isDark ? 'text-blue-400' : 'text-blue-700'} text-xs font-semibold`}>{data.class.name}</Text>
                            </View>
                        )}
                        {data?.academic_year && (
                            <View className={`px-3 py-1.5 rounded-lg ${cardBg} border ${cardBorder} flex-row items-center gap-1.5`}>
                                <Calendar size={14} color={iconColor} />
                                <Text className={`${textColor} text-xs font-semibold`}>{data.academic_year}</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Card View - Day Selector + Sessions List */}
                {viewMode === 'cards' && (
                    <>
                        {/* Day Selector - Horizontal Scroll */}
                        <View className="px-6 pb-4">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                                {WEEK_DAYS.map((day) => {
                                    const isSelected = selectedDay === day.value;
                                    const dayName = t(`calendar.short.${day.key}`, day.key.substring(0, 3));
                                    return (
                                        <Pressable
                                            key={day.key}
                                            onPress={() => setSelectedDay(day.value)}
                                            className={`px-4 py-2.5 rounded-xl border ${isSelected
                                                ? `${isDark ? 'bg-blue-500/20 border-blue-500/40' : 'bg-blue-500 border-blue-600'}`
                                                : `${cardBg} ${cardBorder}`
                                                } active:opacity-70`}
                                        >
                                            <Text className={`text-sm font-bold ${isSelected
                                                ? isDark ? 'text-blue-400' : 'text-white'
                                                : textColor
                                                }`}>
                                                {dayName}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Sessions List */}
                        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                            {selectedDaySessions.length > 0 ? (
                                <View className="gap-y-4">
                                    {selectedDaySessions.map((session) => {
                                        const subjectStyle = getSubjectColor(getSubjectName(session));
                                        return (
                                            <View
                                                key={session.id}
                                                className={`p-4 rounded-2xl border ${subjectStyle.bg} ${subjectStyle.border}`}
                                            >
                                                {/* Subject Name */}
                                                <Text className={`text-base font-bold mb-3 ${subjectStyle.text}`}>
                                                    {getSubjectName(session)}
                                                </Text>

                                                {/* Session Details */}
                                                <View className="gap-y-2">
                                                    {/* Time */}
                                                    <View className="flex-row items-center gap-2">
                                                        <View className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                                            <Clock size={16} color={iconColor} />
                                                        </View>
                                                        <Text className={`${textColor} text-sm font-medium`}>
                                                            {session.start_time} - {session.end_time}
                                                        </Text>
                                                        <View className={`ml-auto px-2 py-0.5 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                                            <Text className={`${subTextColor} text-xs font-semibold`}>
                                                                {t('timetables.period', 'Period')} {session.session_order}
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    {/* Teacher */}
                                                    {session.teacher_name && (
                                                        <View className="flex-row items-center gap-2">
                                                            <View className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                                                <User size={16} color={iconColor} />
                                                            </View>
                                                            <Text className={`${subTextColor} text-sm`}>{session.teacher_name}</Text>
                                                        </View>
                                                    )}

                                                    {/* Room */}
                                                    {session.room_name && (
                                                        <View className="flex-row items-center gap-2">
                                                            <View className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                                                                <MapPin size={16} color={iconColor} />
                                                            </View>
                                                            <Text className={`${subTextColor} text-sm`}>{session.room_name}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            ) : (
                                <View className={`py-16 px-6 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'} border-2 border-dashed ${cardBorder} items-center`}>
                                    <View className={`p-4 rounded-full ${cardBg} border ${cardBorder} mb-4`}>
                                        <Calendar size={32} color={iconColor} />
                                    </View>
                                    <Text className={`${textColor} text-lg font-bold text-center mb-2`}>
                                        {t('timetables.noSessionsTitle', 'No sessions today')}
                                    </Text>
                                    <Text className={`${subTextColor} text-sm text-center max-w-xs`}>
                                        {t('timetables.noSessionsDescription', 'Enjoy your free time! Check other days for your upcoming schedule.')}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </>
                )}

                {/* Table View - Full Week Grid */}
                {viewMode === 'table' && (
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="px-6">
                            <View>
                                {/* Table Header */}
                                <View className="flex-row mb-2">
                                    {/* Day Column Header */}
                                    <View className={`w-24 p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'} items-center justify-center`}>
                                        <Text className={`${textColor} text-xs font-bold uppercase`}>{t('calendar.day', 'Day')}</Text>
                                    </View>
                                    {/* Period Headers (8 periods) */}
                                    {TIME_SLOTS.map((slot) => (
                                        <View key={slot.period} className={`w-28 ml-1 p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                            <Text className={`${textColor} text-[10px] font-bold text-center`}>
                                                {slot.start}-{slot.end}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Table Rows */}
                                {WEEK_DAYS.map((day) => {
                                    const daySessions = getSessionsForDay(day.value);
                                    const dayName = t(`calendar.short.${day.key}`, day.key.substring(0, 3));

                                    return (
                                        <View key={day.key} className="flex-row mb-2">
                                            {/* Day Label */}
                                            <View className={`w-24 p-3 rounded-lg ${cardBg} border ${cardBorder} items-center justify-center`}>
                                                <Text className={`${textColor} text-xs font-bold`}>{dayName}</Text>
                                            </View>

                                            {/* Period Cells */}
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => {
                                                const session = daySessions.find(s => s.session_order === period);
                                                const subjectStyle = session ? getSubjectColor(getSubjectName(session)) : null;

                                                return (
                                                    <View key={period} className="ml-1">
                                                        {session ? (
                                                            <View className={`w-28 h-20 p-2 rounded-lg border ${subjectStyle?.bg} ${subjectStyle?.border}`}>
                                                                <Text className={`${subjectStyle?.text} text-xs font-bold`} numberOfLines={2}>
                                                                    {getSubjectName(session)}
                                                                </Text>
                                                                <Text className={`${subTextColor} text-[10px] mt-1`} numberOfLines={1}>
                                                                    {session.start_time}
                                                                </Text>
                                                                {session.room_name && (
                                                                    <Text className={`${subTextColor} text-[10px]`} numberOfLines={1}>
                                                                        {session.room_name}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        ) : (
                                                            <View className={`w-28 h-20 rounded-lg border ${cardBorder} ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`} />
                                                        )}
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    );
                                })}

                                {/* Empty State for Table */}
                                {data?.sessions?.length === 0 && (
                                    <View className={`mt-8 py-12 px-6 rounded-2xl ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'} border-2 border-dashed ${cardBorder} items-center`}>
                                        <View className={`p-4 rounded-full ${cardBg} border ${cardBorder} mb-4`}>
                                            <Calendar size={32} color={iconColor} />
                                        </View>
                                        <Text className={`${textColor} text-lg font-bold text-center mb-2`}>
                                            {t('timetables.noSessions', 'No timetable data')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
