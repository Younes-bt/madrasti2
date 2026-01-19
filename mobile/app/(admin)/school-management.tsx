import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import {
    ChevronLeft,
    Building2,
    Briefcase,
    UserCheck,
    Users,
    HeartHandshake,
    LayoutGrid,
    Bus,
    Monitor,
    Search
} from 'lucide-react-native';



export default function SchoolManagement() {
    const { actualTheme } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();

    const isDark = actualTheme === 'dark';

    // Theme Colors
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f172a', '#1e293b']
        : ['#f8fafc', '#f1f5f9'];

    const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const iconColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
    const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

    const modules = [
        {
            id: 'details',
            title: t('admin.school.modules.details'),
            icon: Building2,
            route: '/(admin)/school/details',
            color: isDark ? 'bg-blue-500/10' : 'bg-blue-50',
            borderColor: isDark ? 'border-blue-500/20' : 'border-blue-200',
            iconColor: isDark ? '#3b82f6' : '#2563eb'
        },
        {
            id: 'staff',
            title: t('admin.school.modules.staff'),
            icon: Briefcase,
            route: '/(admin)/school/staff',
            color: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
            borderColor: isDark ? 'border-violet-500/20' : 'border-violet-200',
            iconColor: isDark ? '#8b5cf6' : '#7c3aed'
        },
        {
            id: 'teachers',
            title: t('admin.school.modules.teachers'),
            icon: UserCheck,
            route: '/(admin)/school/teachers',
            color: isDark ? 'bg-pink-500/10' : 'bg-pink-50',
            borderColor: isDark ? 'border-pink-500/20' : 'border-pink-200',
            iconColor: isDark ? '#ec4899' : '#db2777'
        },
        {
            id: 'students',
            title: t('admin.school.modules.students'),
            icon: Users,
            route: '/(admin)/school/students',
            color: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            borderColor: isDark ? 'border-emerald-500/20' : 'border-emerald-200',
            iconColor: isDark ? '#10b981' : '#059669'
        },
        {
            id: 'parents',
            title: t('admin.school.modules.parents'),
            icon: HeartHandshake,
            route: '/(admin)/school/parents',
            color: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            borderColor: isDark ? 'border-amber-500/20' : 'border-amber-200',
            iconColor: isDark ? '#f59e0b' : '#d97706'
        },
        {
            id: 'rooms',
            title: t('admin.school.modules.rooms'),
            icon: LayoutGrid,
            route: '/(admin)/school/rooms',
            color: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50',
            borderColor: isDark ? 'border-indigo-500/20' : 'border-indigo-200',
            iconColor: isDark ? '#6366f1' : '#4f46e5'
        },
        {
            id: 'transport',
            title: t('admin.school.modules.transport'),
            icon: Bus,
            route: '/(admin)/school/transport',
            color: isDark ? 'bg-red-500/10' : 'bg-red-50',
            borderColor: isDark ? 'border-red-500/20' : 'border-red-200',
            iconColor: isDark ? '#ef4444' : '#dc2626'
        },
        {
            id: 'equipment',
            title: t('admin.school.modules.equipment'),
            icon: Monitor,
            route: '/(admin)/school/equipment',
            color: isDark ? 'bg-teal-500/10' : 'bg-teal-50',
            borderColor: isDark ? 'border-teal-500/20' : 'border-teal-200',
            iconColor: isDark ? '#14b8a6' : '#0d9488'
        },
    ] as const;

    return (
        <View className="flex-1 bg-background">
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0"
            />

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-6 pt-4 pb-6 flex-row justify-between items-center z-50">
                    <View className="flex-row items-center gap-4">
                        <Pressable
                            onPress={() => router.back()}
                            className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder} active:opacity-70`}
                        >
                            <ChevronLeft size={24} color={iconColor} />
                        </Pressable>
                        <View>
                            <Text className={`${subTextColor} text-xs font-medium uppercase tracking-wider mb-0.5`}>
                                {t('admin.modules.title')}
                            </Text>
                            <Text className={`${textColor} text-xl font-bold`}>
                                {t('admin.school.title')}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <Pressable className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder} active:opacity-70`}>
                            <Search size={20} color={iconColor} />
                        </Pressable>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Bento Grid */}
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
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
