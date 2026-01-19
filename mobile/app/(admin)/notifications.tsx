import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { ChevronLeft, Bell } from 'lucide-react-native';

export default function NotificationsPage() {
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';

    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f172a', '#1e293b']
        : ['#f8fafc', '#f1f5f9'];

    const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
    const iconColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
    const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

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
                <View className="px-6 pt-4 pb-6 flex-row items-center gap-4">
                    <Pressable onPress={() => router.back()} className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder} active:opacity-70`}>
                        <ChevronLeft size={24} color={iconColor} />
                    </Pressable>
                    <Text className={`${textColor} text-xl font-bold`}>Notifications</Text>
                </View>

                {/* Placeholder Content */}
                <View className="flex-1 items-center justify-center px-6">
                    <View className={`w-full p-12 items-center opacity-60`}>
                        <Bell size={48} color={isDark ? '#475569' : '#cbd5e1'} />
                        <Text className={`text-lg font-semibold ${textColor} mt-6`}>No Notifications</Text>
                        <Text className={`${subTextColor} text-center mt-2`}>You&apos;re all caught up for today!</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
