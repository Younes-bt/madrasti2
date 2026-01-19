import { Tabs } from 'expo-router';
import { Home, BookOpen, MessageCircle, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentLayout() {
    const { actualTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = actualTheme === 'dark';
    const primaryColor = '#3b82f6'; // blue-500

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: primaryColor,
            tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8', // slate-500 : slate-400
            tabBarStyle: {
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderTopWidth: 1,
                borderTopColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
                height: 65 + insets.bottom, // Dynamic height
                paddingBottom: Math.max(insets.bottom, 8), // Dynamic padding
                paddingTop: 8,
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="lessons"
                options={{
                    title: 'Study',
                    tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="social"
                options={{
                    title: 'Social',
                    tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="timetable"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="homework"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
