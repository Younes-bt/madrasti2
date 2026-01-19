import { Tabs } from 'expo-router';
import { Home, MessageSquare, Bell, Calendar, Search, BarChart3, Settings } from 'lucide-react-native';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminLayout() {
    const primaryColor = '#4f46e5'; // indigo-600
    const insets = useSafeAreaInsets();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: primaryColor,
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
                backgroundColor: '#fff',
                height: 65 + insets.bottom,
                paddingBottom: Math.max(insets.bottom, 8),
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: '#e2e8f0',
                elevation: 0,
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
                marginTop: 4,
            }
        }}>
            <Tabs.Screen
                name="comms"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color }) => <MessageSquare size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
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
                            borderColor: '#fff',
                            // No shadows
                            elevation: 0,
                        }}>
                            <Home size={28} color="#fff" strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <Search size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
                }}
            />

            {/* Hidden routes - these don't show in tab bar */}
            <Tabs.Screen name="school-management" options={{ href: null }} />
            <Tabs.Screen name="academic-management" options={{ href: null }} />
            <Tabs.Screen name="education-management" options={{ href: null }} />
            <Tabs.Screen name="lab" options={{ href: null }} />
            <Tabs.Screen name="finance" options={{ href: null }} />
            <Tabs.Screen name="tasks" options={{ href: null }} />
            <Tabs.Screen name="school" options={{ href: null }} />
        </Tabs>
    );
}
