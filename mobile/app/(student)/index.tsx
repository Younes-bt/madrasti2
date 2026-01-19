import { View, Text, Pressable, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import {
    User,
    Calendar,
    UserCheck,
    BookOpen,
    ClipboardCheck,
    Bell,
    Search,
} from 'lucide-react-native';

export default function StudentHome() {
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
        return t('studentHome.studentLabel', 'Student');
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
        return 'ST';
    };

    const modules = [
        {
            id: 'profile',
            title: t('studentHome.myProfile', 'My Profile'),
            description: t('studentHome.profileDesc', 'View your personal info'),
            icon: User,
            route: '/(student)/profile',
            color: isDark ? 'bg-sky-500/10' : 'bg-sky-50',
            iconColor: isDark ? '#38bdf8' : '#0284c7', // sky-400 : sky-600
            borderColor: isDark ? 'border-sky-500/20' : 'border-sky-200'
        },
        {
            id: 'timetable',
            title: t('studentHome.myTimetable', 'My Time Table'),
            description: t('studentHome.timetableDesc', 'View your weekly schedule'),
            icon: Calendar,
            route: '/(student)/timetable',
            color: isDark ? 'bg-violet-500/10' : 'bg-violet-50',
            iconColor: isDark ? '#a78bfa' : '#7c3aed', // violet-400 : violet-600
            borderColor: isDark ? 'border-violet-500/20' : 'border-violet-200'
        },
        {
            id: 'attendance',
            title: t('studentHome.myAttendance', 'My Attendance'),
            description: t('studentHome.attendanceDesc', 'Track your attendance'),
            icon: UserCheck,
            route: '/(student)/attendance',
            color: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
            iconColor: isDark ? '#34d399' : '#059669', // emerald-400 : emerald-600
            borderColor: isDark ? 'border-emerald-500/20' : 'border-emerald-200'
        },
        {
            id: 'lessons',
            title: t('studentHome.myLessons', 'My Lessons'),
            description: t('studentHome.lessonsDesc', 'Access course materials'),
            icon: BookOpen,
            route: '/(student)/lessons',
            color: isDark ? 'bg-pink-500/10' : 'bg-pink-50',
            iconColor: isDark ? '#f472b6' : '#db2777', // pink-400 : pink-600
            borderColor: isDark ? 'border-pink-500/20' : 'border-pink-200'
        },
        {
            id: 'homework',
            title: t('studentHome.myHomework', 'My Homework'),
            description: t('studentHome.homeworkDesc', 'View assignments & grades'),
            icon: ClipboardCheck,
            route: '/(student)/homework',
            color: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
            iconColor: isDark ? '#fbbf24' : '#d97706', // amber-400 : amber-600
            borderColor: isDark ? 'border-amber-500/20' : 'border-amber-200'
        },
    ] as const;

    // Background Themes - MATCH ADMIN'S CLEAN SLATE COLORS
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
            {/* Subtle Gradient Background - MATCH ADMIN */}
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0"
            />

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header - Minimalist - MATCH ADMIN */}
                <View className="px-6 pt-2 pb-6 flex-row justify-between items-center">
                    <View>
                        <Text className={`${subTextColor} text-xs font-medium uppercase tracking-wider mb-0.5`}>
                            {t('studentHome.studentLabel', 'Student')}
                        </Text>
                        <Text className={`${textColor} text-2xl font-bold`}>
                            {t('studentHome.tabs.home', 'Home')}
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
                    {/* Profile Card - Bento Wide Tile - MATCH ADMIN */}
                    <Pressable
                        className={`w-full mb-6 p-4 rounded-2xl ${cardBg} border ${cardBorder} flex-row items-center justify-between active:opacity-95`}
                        onPress={() => router.push('/(student)/profile')}
                    >
                        <View className="flex-row items-center gap-4">
                            <View className={`w-12 h-12 rounded-xl justify-center items-center overflow-hidden ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                {user?.profile_picture_url || user?.avatar ? (
                                    <ImageBackground
                                        source={{ uri: user?.profile_picture_url || user?.avatar }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-blue-500 font-bold text-lg">{getUserInitials()}</Text>
                                )}
                            </View>
                            <View>
                                <Text className={`${textColor} text-base font-bold`}>{getUserName()}</Text>
                                <Text className={`${subTextColor} text-xs`}>{t('studentHome.studentLabel', 'Student')}</Text>
                            </View>
                        </View>
                        <View className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                            <Text className={`${isDark ? 'text-blue-400' : 'text-blue-700'} text-xs font-semibold`}>{getUserInitials()}</Text>
                        </View>
                    </Pressable>

                    {/* Bento Grid - 2 Column Layout - MATCH ADMIN */}
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
