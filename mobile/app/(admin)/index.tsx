import { View, Text, Pressable, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import {
    Bell,
    Building2,
    GraduationCap,
    BookOpen,
    FlaskConical,
    BarChart3,
    CircleDollarSign,
    Search,
    ChevronRight,
} from 'lucide-react-native';

export default function AdminHome() {
    const { user } = useAuth();
    const { actualTheme } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();

    const isDark = actualTheme === 'dark';

    // Get user display name
    const getUserName = () => {
        if (user?.full_name) return user.full_name;
        if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
        if (user?.first_name) return user.first_name;
        return 'Admin User';
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.full_name) {
            const parts = user.full_name.split(' ');
            return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].substring(0, 2).toUpperCase();
        }
        if (user?.first_name && user?.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        if (user?.first_name) {
            return user.first_name.substring(0, 2).toUpperCase();
        }
        return 'AU';
    };

    const modules = [
        {
            id: 'school-management',
            title: t('admin.dashboard.modules.mySchool.title'),
            description: t('admin.dashboard.modules.mySchool.description'),
            icon: Building2,
            route: '/(admin)/school-management',
            color: isDark ? 'bg-cyan-500/10' : 'bg-cyan-50',
            iconColor: isDark ? '#22d3ee' : '#0891b2', // cyan-400 : cyan-600
            borderColor: isDark ? 'border-cyan-500/20' : 'border-cyan-200'
        },
        {
            id: 'academic-management',
            title: t('admin.dashboard.modules.academic.title'),
            description: t('admin.dashboard.modules.academic.description'),
            icon: GraduationCap,
            route: '/(admin)/academic-management',
            color: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
            iconColor: isDark ? '#a78bfa' : '#7c3aed',
            borderColor: isDark ? 'border-violet-500/20' : 'border-violet-200'
        },
        {
            id: 'education-management',
            title: t('admin.dashboard.modules.education.title'),
            description: t('admin.dashboard.modules.education.description'),
            icon: BookOpen,
            route: '/(admin)/education-management',
            color: isDark ? 'bg-pink-500/10' : 'bg-pink-50',
            iconColor: isDark ? '#f472b6' : '#db2777',
            borderColor: isDark ? 'border-pink-500/20' : 'border-pink-200'
        },
        {
            id: 'lab-tools',
            title: t('admin.dashboard.modules.lab.title'),
            description: t('admin.dashboard.modules.lab.description'),
            icon: FlaskConical,
            route: '/(admin)/lab',
            color: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            iconColor: isDark ? '#fbbf24' : '#d97706',
            borderColor: isDark ? 'border-amber-500/20' : 'border-amber-200'
        },
        {
            id: 'reports-analytics',
            title: t('admin.dashboard.modules.reports.title'),
            description: t('admin.dashboard.modules.reports.description'),
            icon: BarChart3,
            route: '/(admin)/reports',
            color: isDark ? 'bg-orange-500/10' : 'bg-orange-50',
            iconColor: isDark ? '#fb923c' : '#ea580c',
            borderColor: isDark ? 'border-orange-500/20' : 'border-orange-200'
        },
        {
            id: 'finance',
            title: t('admin.dashboard.modules.finance.title'),
            description: t('admin.dashboard.modules.finance.description'),
            icon: CircleDollarSign,
            route: '/(admin)/finance',
            color: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            iconColor: isDark ? '#34d399' : '#059669',
            borderColor: isDark ? 'border-emerald-500/20' : 'border-emerald-200'
        },
    ] as const;

    // Background Themes
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f172a', '#1e293b'] // Slate 900 -> 800 (Clean, flat dark)
        : ['#f8fafc', '#f1f5f9']; // Slate 50 -> 100 (Clean, flat light)

    const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const iconColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
    const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

    return (
        <View className="flex-1 bg-background">
            {/* Subtle Gradient Background */}
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0"
            />

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header - Minimalist */}
                <View className="px-6 pt-2 pb-6 flex-row justify-between items-center">
                    <View>
                        <Text className={`${subTextColor} text-xs font-medium uppercase tracking-wider mb-0.5`}>
                            {t('admin.dashboard.title')}
                        </Text>
                        <Text className={`${textColor} text-2xl font-bold`}>
                            Dashboard
                        </Text>
                    </View>
                    <View className="flex-row gap-3">
                        <Pressable className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder} active:opacity-70`}>
                            <Bell size={20} color={iconColor} />
                        </Pressable>
                        <Pressable className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder} active:opacity-70`}>
                            <Search size={20} color={iconColor} />
                        </Pressable>
                    </View>
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Profile Card - Bento Wide Tile */}
                    <Pressable
                        className={`w-full mb-6 p-4 rounded-2xl ${cardBg} border ${cardBorder} flex-row items-center justify-between active:opacity-95`}
                        onPress={() => { }} // Navigate to profile if needed
                    >
                        <View className="flex-row items-center gap-4">
                            <View className={`w-12 h-12 rounded-xl justify-center items-center overflow-hidden ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                {user?.avatar ? (
                                    <ImageBackground source={{ uri: user.avatar }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <Text className="text-indigo-500 font-bold text-lg">{getUserInitials()}</Text>
                                )}
                            </View>
                            <View>
                                <Text className={`${textColor} text-base font-bold`}>{getUserName()}</Text>
                                <Text className={`${subTextColor} text-xs`}>{t('admin.dashboard.administrator')}</Text>
                            </View>
                        </View>
                        <View className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}>
                            <Text className={`${isDark ? 'text-emerald-400' : 'text-emerald-700'} text-xs font-semibold`}>pro</Text>
                        </View>
                    </Pressable>

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
