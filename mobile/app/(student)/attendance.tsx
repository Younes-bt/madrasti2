import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import { useState, useEffect, useMemo } from 'react';
import attendanceService, { AttendanceStats, PendingFlagsResponse } from '../../api/attendance';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Clock,
    TrendingDown,
    TrendingUp,
    BarChart3,
    PieChart,
    BookOpen,
    CheckCircle
} from 'lucide-react-native';

export default function StudentAttendancePage() {
    const { actualTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const { user } = useAuth();

    // Theme Colors
    const isDark = actualTheme === 'dark';
    const bgColors: [string, string, ...string[]] = isDark ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#f1f5f9'];
    const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const iconColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
    const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

    // State
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [flagInfo, setFlagInfo] = useState<{ hasFlag: boolean; count: number }>({ hasFlag: false, count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load Data
    useEffect(() => {
        const loadReport = async () => {
            if (!user?.id) return;

            setLoading(true);
            setError(null);

            try {
                // Determine student ID - if user is parent, we might need a way to pass child ID. 
                // For now assuming logged in user IS the student.
                // If this page is reused for parent, we'd need to pass studentId as param.
                const studentId = user.id;

                const [statsData, flagsData] = await Promise.all([
                    attendanceService.getStudentStatistics(studentId),
                    attendanceService.getPendingAbsenceFlags({ student_id: studentId })
                ]);

                setStats(statsData);

                // Check flags
                // flagsData is PendingFlagsResponse { pending_flags: [], count: number }
                const count = flagsData.count || 0;
                const hasFlag = count > 0;
                setFlagInfo({ hasFlag, count });

            } catch (err: any) {
                console.error('Failed to load attendance report:', err);
                setError(t('errors.failedToLoadProfile', 'Failed to load data.'));
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [user?.id]);

    const chartColors = {
        present: isDark ? '#22c55e' : '#16a34a',
        late: isDark ? '#facc15' : '#ca8a04',
        absent: isDark ? '#ef4444' : '#dc2626',
        excused: isDark ? '#3b82f6' : '#2563eb'
    };

    const formatDate = (value: string) => {
        if (!value) return 'N/A';
        try {
            return new Date(value).toLocaleDateString(i18n.language === 'ar' ? 'ar-MA' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return value;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'present':
                return { bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50', text: isDark ? 'text-emerald-400' : 'text-emerald-700' };
            case 'absent':
                return { bg: isDark ? 'bg-red-500/10' : 'bg-red-50', text: isDark ? 'text-red-400' : 'text-red-700' };
            case 'late':
                return { bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50', text: isDark ? 'text-amber-400' : 'text-amber-700' };
            case 'excused':
                return { bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50', text: isDark ? 'text-blue-400' : 'text-blue-700' };
            default:
                return { bg: isDark ? 'bg-slate-500/10' : 'bg-slate-100', text: subTextColor };
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background">
                <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="absolute inset-0" />
                <SafeAreaView className="flex-1 justify-center items-center">
                    <Stack.Screen options={{ headerShown: false }} />
                    <ActivityIndicator size="large" color={isDark ? '#fff' : '#4f46e5'} />
                </SafeAreaView>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-background">
                <LinearGradient colors={bgColors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="absolute inset-0" />
                <SafeAreaView className="flex-1 justify-center items-center px-6">
                    <Stack.Screen options={{ headerShown: false }} />
                    <Text className="text-red-500 text-lg text-center mb-4">{error}</Text>
                    <Pressable onPress={() => router.back()} className={`px-6 py-3 rounded-xl ${cardBg} border ${cardBorder}`}>
                        <Text className={textColor}>{t('common.goBack')}</Text>
                    </Pressable>
                </SafeAreaView>
            </View>
        );
    }

    const { present_count = 0, absent_count = 0, late_count = 0, total_sessions = 0 } = stats || {};

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
                        <Text className={`${textColor} text-xl font-bold`}>{t('studentHome.myAttendance', 'My Attendance')}</Text>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Subtitle */}
                    <Text className={`${subTextColor} mb-6 leading-5`}>
                        {t('studentAttendanceReport.subtitle')}
                    </Text>

                    {/* Pending Flags Status Card */}
                    <View className={`p-4 rounded-2xl mb-6 border ${flagInfo.hasFlag
                            ? isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                            : isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                        }`}>
                        <View className="flex-row items-start gap-4">
                            <View className={`p-2 rounded-full ${flagInfo.hasFlag ? 'bg-red-100' : 'bg-emerald-100'}`}>
                                {flagInfo.hasFlag ? (
                                    <AlertTriangle size={24} color="#dc2626" />
                                ) : (
                                    <CheckCircle2 size={24} color="#16a34a" />
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className={`font-bold mb-1 ${flagInfo.hasFlag ? (isDark ? 'text-red-400' : 'text-red-700') : (isDark ? 'text-emerald-400' : 'text-emerald-700')}`}>
                                    {flagInfo.hasFlag ? t('studentAttendanceReport.absenceFlagTitle') : t('studentAttendanceReport.noAbsenceFlagTitle')}
                                </Text>
                                <Text className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-4`}>
                                    {flagInfo.hasFlag ? t('studentAttendanceReport.absenceFlagDescription') : t('studentAttendanceReport.noAbsenceFlagDescription')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Grid (Bento Grid) */}
                    <View className="flex-row flex-wrap gap-3 mb-6">
                        {/* Presence Rate */}
                        <View className={`flex-1 min-w-[45%] p-4 rounded-2xl border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                            <View className="flex-row justify-between items-start mb-2">
                                <CheckCircle2 size={20} color={chartColors.present} />
                                <Text className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{stats?.presence_rate ?? 0}%</Text>
                            </View>
                            <Text className={`text-xs font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>{t('attendance.presenceRate')}</Text>
                            <Text className={`text-[10px] ${isDark ? 'text-emerald-200/60' : 'text-emerald-600/70'}`}>
                                {present_count}/{total_sessions} {t('attendance.sessions')}
                            </Text>
                        </View>

                        {/* Absence Rate */}
                        <View className={`flex-1 min-w-[45%] p-4 rounded-2xl border ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                            <View className="flex-row justify-between items-start mb-2">
                                <TrendingDown size={20} color={chartColors.absent} />
                                <Text className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-700'}`}>{stats?.absence_rate ?? 0}%</Text>
                            </View>
                            <Text className={`text-xs font-medium ${isDark ? 'text-red-300' : 'text-red-800'}`}>{t('attendance.absenceRate')}</Text>
                            <Text className={`text-[10px] ${isDark ? 'text-red-200/60' : 'text-red-600/70'}`}>
                                {absent_count}/{total_sessions} {t('attendance.sessions')}
                            </Text>
                        </View>

                        {/* Late Rate */}
                        <View className={`flex-1 min-w-[45%] p-4 rounded-2xl border ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-100'}`}>
                            <View className="flex-row justify-between items-start mb-2">
                                <Clock size={20} color={chartColors.late} />
                                <Text className={`text-2xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                    {stats?.late_count ? ((stats.late_count / (stats.total_sessions || 1)) * 100).toFixed(1) : '0.0'}%
                                </Text>
                            </View>
                            <Text className={`text-xs font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{t('attendance.lateRate')}</Text>
                            <Text className={`text-[10px] ${isDark ? 'text-amber-200/60' : 'text-amber-600/70'}`}>
                                {late_count}/{total_sessions} {t('attendance.sessions')}
                            </Text>
                        </View>

                        {/* Total Sessions */}
                        <View className={`flex-1 min-w-[45%] p-4 rounded-2xl border ${cardBg} ${cardBorder}`}>
                            <View className="flex-row justify-between items-start mb-2">
                                <BarChart3 size={20} color={iconColor} />
                                <Text className={`text-2xl font-bold ${textColor}`}>{total_sessions}</Text>
                            </View>
                            <Text className={`text-xs font-medium ${subTextColor}`}>{t('attendance.totalSessions')}</Text>
                            <Text className={`text-[10px] ${subTextColor}`}>
                                {t('attendance.attendanceRate')}: {stats?.attendance_rate ?? 0}%
                            </Text>
                        </View>
                    </View>

                    {/* Attendance Distribution */}
                    <View className={`p-4 rounded-2xl border ${cardBg} ${cardBorder} mb-6`}>
                        <View className="flex-row items-center gap-2 mb-4">
                            <PieChart size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                            <Text className={`${textColor} font-bold`}>{t('studentAttendanceReport.distributionTitle')}</Text>
                        </View>

                        <View className="gap-3">
                            {/* Present Bar */}
                            <View>
                                <View className="flex-row justify-between mb-1">
                                    <Text className={`text-xs ${subTextColor}`}>{t('attendance.present')}</Text>
                                    <Text className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{present_count} ({((present_count / total_sessions) * 100 || 0).toFixed(0)}%)</Text>
                                </View>
                                <View className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} overflow-hidden`}>
                                    <View className={`h-full ${isDark ? 'bg-emerald-500' : 'bg-emerald-500'}`} style={{ width: `${(present_count / total_sessions) * 100 || 0}%` }} />
                                </View>
                            </View>

                            {/* Absent Bar */}
                            <View>
                                <View className="flex-row justify-between mb-1">
                                    <Text className={`text-xs ${subTextColor}`}>{t('attendance.absent')}</Text>
                                    <Text className={`text-xs font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>{absent_count} ({((absent_count / total_sessions) * 100 || 0).toFixed(0)}%)</Text>
                                </View>
                                <View className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} overflow-hidden`}>
                                    <View className={`h-full ${isDark ? 'bg-red-500' : 'bg-red-500'}`} style={{ width: `${(absent_count / total_sessions) * 100 || 0}%` }} />
                                </View>
                            </View>

                            {/* Late Bar */}
                            <View>
                                <View className="flex-row justify-between mb-1">
                                    <Text className={`text-xs ${subTextColor}`}>{t('attendance.late')}</Text>
                                    <Text className={`text-xs font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{late_count} ({((late_count / total_sessions) * 100 || 0).toFixed(0)}%)</Text>
                                </View>
                                <View className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} overflow-hidden`}>
                                    <View className={`h-full ${isDark ? 'bg-amber-500' : 'bg-amber-500'}`} style={{ width: `${(late_count / total_sessions) * 100 || 0}%` }} />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Subject Breakdown */}
                    <View className={`p-4 rounded-2xl border ${cardBg} ${cardBorder} mb-6`}>
                        <View className="flex-row items-center gap-2 mb-4">
                            <BookOpen size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                            <Text className={`${textColor} font-bold`}>{t('studentAttendanceReport.subjectBreakdownTitle')}</Text>
                        </View>

                        {stats?.subject_breakdown && stats.subject_breakdown.length > 0 ? (
                            <View className="gap-3">
                                {stats.subject_breakdown.map((subject, index) => {
                                    const rate = subject.attendance_rate ?? 0;
                                    const isLow = rate < (stats?.attendance_rate || 80);
                                    return (
                                        <View key={index} className={`p-3 rounded-xl border ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'} ${cardBorder}`}>
                                            <View className="flex-row justify-between items-center mb-2">
                                                <Text className={`${textColor} font-medium`}>{subject.subject_name}</Text>
                                                <Text className={`font-bold ${isLow ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-emerald-400' : 'text-emerald-600')}`}>{rate}%</Text>
                                            </View>
                                            <View className="flex-row gap-4">
                                                <Text className={`text-[10px] ${subTextColor}`}>{t('attendance.present')}: {subject.present}</Text>
                                                <Text className={`text-[10px] ${subTextColor}`}>{t('attendance.absent')}: {subject.absent}</Text>
                                                <Text className={`text-[10px] ${subTextColor}`}>{t('attendance.late')}: {subject.late}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <Text className={`text-sm ${subTextColor} text-center py-4`}>{t('studentAttendanceReport.noSubjectData')}</Text>
                        )}
                    </View>

                    {/* Recent Activity */}
                    <View className={`p-4 rounded-2xl border ${cardBg} ${cardBorder}`}>
                        <View className="flex-row items-center gap-2 mb-4">
                            <Clock size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                            <Text className={`${textColor} font-bold`}>{t('studentAttendanceReport.recentActivityTitle')}</Text>
                        </View>

                        {stats?.recent_history && stats.recent_history.length > 0 ? (
                            <View className="gap-3">
                                {stats.recent_history.slice(0, 5).map((item, index) => {
                                    const style = getStatusStyle(item.status);
                                    return (
                                        <View key={index} className={`flex-row items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-slate-700/30' : 'bg-slate-50'} ${cardBorder}`}>
                                            <View className="flex-row items-center gap-3">
                                                <View className={`p-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                                                    <Calendar size={14} color={iconColor} />
                                                </View>
                                                <View>
                                                    <Text className={`${textColor} text-sm font-medium`}>{item.subject_name}</Text>
                                                    <Text className={`text-[10px] ${subTextColor}`}>{formatDate(item.date)}</Text>
                                                </View>
                                            </View>
                                            <View className={`px-2 py-1 rounded-md ${style.bg}`}>
                                                <Text className={`text-[10px] font-bold ${style.text}`}>{t(`attendance.${item.status}`)}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <Text className={`text-sm ${subTextColor} text-center py-4`}>{t('studentAttendanceReport.noRecentActivity')}</Text>
                        )}
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
