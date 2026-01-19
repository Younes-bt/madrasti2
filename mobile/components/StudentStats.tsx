import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, User, UserMinus } from 'lucide-react-native';


interface StatItem {
    id: number;
    name: string;
    name_arabic: string;
    name_french: string;
    count: number;
}

interface StudentStatsProps {
    stats: {
        total: number;
        active: number;
        inactive: number;
        males: number;
        females: number;
        unknown?: number;
        levelCounts: StatItem[];
        gradeCounts: StatItem[];
    };
    isDark: boolean;
}

export default function StudentStats({ stats, isDark }: StudentStatsProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const getLocalizedName = (item: StatItem) => {
        if (isRTL && item.name_arabic) return item.name_arabic;
        if (i18n.language === 'fr' && item.name_french) return item.name_french;
        return item.name;
    };

    const chartData = useMemo(() => {
        const malePct = stats.total ? Math.round((stats.males / stats.total) * 100) : 0;
        const femalePct = stats.total ? Math.round((stats.females / stats.total) * 100) : 0;

        const data = [
            { value: stats.males, color: '#3b82f6', text: `${malePct}%` }, // Blue for Boys
            { value: stats.females, color: '#ec4899', text: `${femalePct}%` } // Pink for Girls
        ];

        // Add Unknown gender if present
        if (stats.unknown && stats.unknown > 0) {
            const unknownPct = stats.total ? Math.round((stats.unknown / stats.total) * 100) : 0;
            data.push({
                value: stats.unknown,
                color: isDark ? '#6B7280' : '#9CA3AF',
                text: `${unknownPct}%`
            });
        }

        return data;
    }, [stats, isDark]);

    const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <View className={`rounded-3xl p-5 mb-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-white/40'} border shadow-sm ${className}`}>
            {children}
        </View>
    );

    const DistributionBar = ({ label, count, total, color = 'bg-indigo-500' }: { label: string, count: number, total: number, color?: string }) => {
        const percentage = total ? (count / total) * 100 : 0;
        return (
            <View>
                <View className="flex-row justify-between mb-1">
                    <Text className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</Text>
                    <Text className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{count}</Text>
                </View>
                <View className={`h-2 w-full rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-100'} overflow-hidden`}>
                    <View
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                    />
                </View>
            </View>
        );
    };

    return (
        <View className="mb-20">
            {/* Key Metrics Row */}
            <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                    <LinearGradient
                        colors={isDark ? ['#3b82f6', '#1d4ed8'] : ['#60a5fa', '#2563eb']}
                        className="rounded-3xl p-4 items-center justify-center aspect-square"
                    >
                        <Users size={24} color="white" />
                        <Text className="text-white text-3xl font-bold mt-1">{stats.total}</Text>
                        <Text className="text-blue-100 text-xs text-center font-medium mt-1">{t('students.totalStudents')}</Text>
                    </LinearGradient>
                </View>
                <View className="flex-1 gap-3">
                    <View className={`flex-1 rounded-3xl flex-row items-center justify-center gap-3 ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'} border px-2`}>
                        <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center">
                            <User size={14} color="white" />
                        </View>
                        <View>
                            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.active}</Text>
                            <Text className={`text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{t('status.active')}</Text>
                        </View>
                    </View>
                    <View className={`flex-1 rounded-3xl flex-row items-center justify-center gap-3 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} border px-2`}>
                        <View className="w-8 h-8 rounded-full bg-red-400 items-center justify-center">
                            <UserMinus size={14} color="white" />
                        </View>
                        <View>
                            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.inactive}</Text>
                            <Text className={`text-[10px] ${isDark ? 'text-red-400' : 'text-red-600'}`}>{t('status.inactive')}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Gender Distribution Chart */}
            <Card>
                <Text className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('students.genderDistribution')}</Text>
                <View className="items-center">
                    <PieChart
                        data={chartData}
                        donut
                        radius={90}
                        innerRadius={65}
                        innerCircleColor={isDark ? '#1A0B2E' : '#ffffff'}
                        focusOnPress
                        sectionAutoFocus
                        centerLabelComponent={() => (
                            <View className="items-center justify-center">
                                <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</Text>
                                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{t('tabs.students')}</Text>
                            </View>
                        )}
                    />
                </View>
                <View className="mt-8 gap-4">
                    {/* Boys */}
                    <View className={`p-4 rounded-2xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-2xl bg-blue-500 items-center justify-center"
                                    style={{
                                        shadowColor: '#3b82f6',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 4,
                                    }}
                                >
                                    <Text className="text-white text-lg font-bold">{chartData[0].text}</Text>
                                </View>
                                <View>
                                    <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t('students.boys')}
                                    </Text>
                                    <Text className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {stats.males} {t('tabs.students').toLowerCase()}
                                    </Text>
                                </View>
                            </View>
                            <View className={`px-4 py-2 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                <Text className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {stats.males}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Girls */}
                    <View className={`p-4 rounded-2xl ${isDark ? 'bg-pink-500/10' : 'bg-pink-50'}`}>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 rounded-2xl bg-pink-500 items-center justify-center"
                                    style={{
                                        shadowColor: '#ec4899',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 4,
                                    }}
                                >
                                    <Text className="text-white text-lg font-bold">{chartData[1].text}</Text>
                                </View>
                                <View>
                                    <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {t('students.girls')}
                                    </Text>
                                    <Text className={`text-xs ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                                        {stats.females} {t('tabs.students').toLowerCase()}
                                    </Text>
                                </View>
                            </View>
                            <View className={`px-4 py-2 rounded-xl ${isDark ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                                <Text className={`text-2xl font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                                    {stats.females}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Unknown (Only if > 0) */}
                    {(stats.unknown || 0) > 0 && (
                        <View className={`p-4 rounded-2xl ${isDark ? 'bg-gray-500/10' : 'bg-gray-100'}`}>
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-gray-600' : 'bg-gray-400'} items-center justify-center`}
                                        style={{
                                            shadowColor: '#6B7280',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 8,
                                            elevation: 4,
                                        }}
                                    >
                                        <Text className="text-white text-lg font-bold">
                                            {stats.total ? Math.round(((stats.unknown || 0) / stats.total) * 100) : 0}%
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {t('common.unknown') || 'Unknown'}
                                        </Text>
                                        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {stats.unknown} {t('tabs.students').toLowerCase()}
                                        </Text>
                                    </View>
                                </View>
                                <View className={`px-4 py-2 rounded-xl ${isDark ? 'bg-gray-500/20' : 'bg-gray-200'}`}>
                                    <Text className={`text-2xl font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {stats.unknown}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </Card>

            {/* Levels Distribution */}
            <Card>
                <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('students.byLevel')}</Text>
                <View className="gap-3">
                    {(stats.levelCounts || []).map((item, index) => (
                        <DistributionBar
                            key={index}
                            label={getLocalizedName(item)}
                            count={item.count}
                            total={stats.total}
                            color="bg-indigo-500"
                        />
                    ))}
                </View>
            </Card>

            {/* Grades Distribution */}
            <Card>
                <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('students.byGrade')}</Text>
                <View className="gap-3">
                    {(stats.gradeCounts || []).map((item, index) => (
                        <DistributionBar
                            key={index}
                            label={getLocalizedName(item)}
                            count={item.count}
                            total={stats.total}
                            color="bg-purple-500"
                        />
                    ))}
                </View>
            </Card>
        </View>
    );
}
