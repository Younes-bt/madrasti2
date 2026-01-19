import { View, Text, Pressable, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRouter, Stack } from 'expo-router';
import {
    User,
    Users,
    GraduationCap,
    BookOpen,
    ClipboardCheck,
    PenTool,
    Calendar,
    UserCheck,
    MessageSquare,
    Megaphone,
    // LogOut, // Removed as unused
    ChevronRight,
    Bell,
    Search
} from 'lucide-react-native';

export default function TeacherHome() {
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
        return t('teacherHome.teacherLabel', 'Teacher');
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
        return 'TE';
    };

    // SignOut logic moved to Settings tab or removed from Header as per Admin design


    const modules = [
        {
            id: 'profile',
            title: t('teacherHome.myProfile', 'My Profile'),
            description: t('teacherHome.profileDesc', 'Manage your personal info'),
            icon: User,
            route: '/(teacher)/profile/overview',
            gradientColors: ['#38bdf8', '#0ea5e9'] as const // sky
        },
        {
            id: 'students',
            title: t('teacherHome.myStudents', 'My Students'),
            description: t('teacherHome.studentsDesc', 'View and manage students'),
            icon: Users,
            route: '/(teacher)/profile/my-students',
            gradientColors: ['#fbbf24', '#d97706'] as const // amber
        },
        {
            id: 'classes',
            title: t('teacherHome.myClasses', 'My Classes'),
            description: t('teacherHome.classesDesc', 'Overview of your classes'),
            icon: GraduationCap,
            route: '/(teacher)/profile/my-classes',
            gradientColors: ['#34d399', '#059669'] as const // emerald
        },
        {
            id: 'lessons',
            title: t('teacherHome.myLessons', 'My Lessons'),
            description: t('teacherHome.lessonsDesc', 'Course materials & plans'),
            icon: BookOpen,
            route: '/(teacher)/content/lessons',
            gradientColors: ['#60a5fa', '#2563eb'] as const // blue
        },
        {
            id: 'homework',
            title: t('teacherHome.myHomework', 'Homework'),
            description: t('teacherHome.homeworkDesc', 'Assignments & grading'),
            icon: ClipboardCheck,
            route: '/(teacher)/assignments/homework',
            gradientColors: ['#a78bfa', '#7c3aed'] as const // purple
        },
        {
            id: 'exercises',
            title: t('teacherHome.myExercises', 'Exercises'),
            description: t('teacherHome.exercisesDesc', 'Practice questions & tests'),
            icon: PenTool,
            route: '/(teacher)/content/lesson-exercises',
            gradientColors: ['#fb7185', '#e11d48'] as const // rose
        },
        {
            id: 'timetable',
            title: t('teacherHome.myTimetable', 'Timetable'),
            description: t('teacherHome.timetableDesc', 'Your weekly schedule'),
            icon: Calendar,
            route: '/(teacher)/(tabs)/schedule',
            gradientColors: ['#38bdf8', '#0284c7'] as const // sky
        },
        {
            id: 'attendance',
            title: t('teacherHome.myAttendance', 'Attendance'),
            description: t('teacherHome.attendanceDesc', 'Track student presence'),
            icon: UserCheck,
            route: '/(teacher)/attendance/history',
            gradientColors: ['#34d399', '#10b981'] as const // emerald
        },
        {
            id: 'messages',
            title: t('teacherHome.myMessages', 'Messages'),
            description: t('teacherHome.messagesDesc', 'Chat with students/parents'),
            icon: MessageSquare,
            route: '/(teacher)/communication/messages',
            gradientColors: ['#818cf8', '#4f46e5'] as const // indigo
        },
        {
            id: 'announcements',
            title: t('teacherHome.myAnnouncements', 'Announcements'),
            description: t('teacherHome.announcementsDesc', 'Broadcast updates'),
            icon: Megaphone,
            route: '/(teacher)/communication/announcements',
            gradientColors: ['#fbbf24', '#b45309'] as const // amber
        },
    ] as const;

    // Theme Colors
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f0c29', '#302b63', '#24243e']
        : ['#f0f9ff', '#e0f2fe', '#bae6fd']; // Light blueish gradient for light mode

    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const subTextColor = isDark ? 'text-white/60' : 'text-gray-600';
    const iconColor = isDark ? '#fff' : '#1e293b'; // slate-800 for light mode icons

    // Glass styles
    const cardGlassColors: [string, string, ...string[]] = isDark
        ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
        : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)'];

    const moduleGlassColors: [string, string, ...string[]] = isDark
        ? ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']
        : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)'];

    const moduleBgColor = isDark ? 'bg-white/[0.02]' : 'bg-white/50';

    return (
        <View className="flex-1 bg-background">
            {/* Background Gradients for Atmosphere */}
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />

            {/* Subtle Overlay for depth in dark mode */}
            {isDark && <View className="absolute inset-0 bg-black/10" />}

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-6 pt-4 pb-4 flex-row justify-between items-center z-50">
                    <Text className={`${textColor} text-2xl font-bold tracking-wider font-outfit-bold`}>{t('teacherHome.tabs.home', 'Home')}</Text>
                    <View className="flex-row gap-3">
                        <Pressable className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'} border active:opacity-70`}>
                            <Bell size={20} color={iconColor} />
                        </Pressable>
                        <Pressable className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'} border active:opacity-70`}>
                            <Search size={20} color={iconColor} />
                        </Pressable>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Glass User Profile Card */}
                    <LinearGradient
                        colors={cardGlassColors}
                        className="rounded-3xl p-[1px] mb-8 mt-2"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View className={`p-5 rounded-3xl ${isDark ? 'bg-black/20' : 'bg-white/40'} flex-row items-center justify-between`}>
                            <View className="flex-row items-center gap-4">
                                <View className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-blue-500">
                                    <View className={`flex-1 rounded-full ${isDark ? 'bg-gray-900' : 'bg-white'} justify-center items-center`}>
                                        {user?.avatar ? (
                                            <ImageBackground source={{ uri: user.avatar }} className="w-full h-full rounded-full" resizeMode="cover" />
                                        ) : (
                                            <Text className={`${isDark ? 'text-white' : 'text-gray-800'} font-bold text-lg`}>{getUserInitials()}</Text>
                                        )}
                                    </View>
                                </View>
                                <View>
                                    <Text className={`${textColor} text-lg font-bold`}>{getUserName()}</Text>
                                    <Text className={`${subTextColor} text-sm`}>{t('teacherHome.teacherLabel', 'Teacher')}</Text>
                                </View>
                            </View>
                            <View className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/10 border-white/5' : 'bg-black/5 border-black/5'} items-center justify-center border`}>
                                <Text className="text-cyan-400 font-bold text-xs">{getUserInitials()}</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Modules Grid */}
                    <View className="pb-4">
                        {modules.map((module) => (
                            <Pressable
                                key={module.id}
                                className="mb-4 active:scale-[0.98] transition-transform"
                                onPress={() => router.push(module.route as any)}
                            >
                                <LinearGradient
                                    colors={moduleGlassColors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="rounded-3xl p-[1px]"
                                >
                                    <View className={`p-4 rounded-3xl flex-row items-center ${moduleBgColor}`}>
                                        {/* Icon Container */}
                                        <LinearGradient
                                            colors={module.gradientColors}
                                            className="w-16 h-16 rounded-3xl items-center justify-center mr-4"
                                        >
                                            <module.icon size={28} color="#fff" />
                                        </LinearGradient>

                                        <View className="flex-1 mr-2">
                                            <Text className={`${textColor} text-base font-bold mb-0.5 font-outfit-bold`}>{module.title}</Text>
                                            <Text className={`${subTextColor} text-xs leading-4 font-outfit`} numberOfLines={1}>
                                                {module.description}
                                            </Text>
                                        </View>

                                        <View className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'} items-center justify-center border `}>
                                            <ChevronRight size={16} color={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"} />
                                        </View>
                                    </View>
                                </LinearGradient>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
