import { Tabs } from 'expo-router';
import { Home, MessageSquare, Calendar, Settings } from 'lucide-react-native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../context/ThemeContext';

export default function TeacherTabsLayout() {
    const { t } = useTranslation();
    const { actualTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = actualTheme === 'dark';
    const primaryColor = '#4f46e5'; // indigo-600

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: primaryColor,
            tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
            tabBarStyle: {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                height: 60 + insets.bottom,
                paddingBottom: insets.bottom,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                // Removed: elevation, shadowColor, shadowOffset, shadowOpacity, shadowRadius
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
                marginTop: 4,
            }
        }}>
            <Tabs.Screen
                name="schedule"
                options={{
                    title: t('teacher.tabs.schedule', 'Schedule'),
                    tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
                }}
            />

            <Tabs.Screen
                name="index"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: focused ? primaryColor : '#0f172a',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: -28,
                            borderWidth: 4,
                            borderColor: isDark ? '#0f172a' : '#fff',
                            // Removed: shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation
                        }}>
                            <Home size={28} color="#fff" strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="messages"
                options={{
                    title: t('teacher.tabs.messages', 'Messages'),
                    tabBarIcon: ({ color }) => <MessageSquare size={22} color={color} />,
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: t('teacher.tabs.settings', 'Settings'),
                    tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}
