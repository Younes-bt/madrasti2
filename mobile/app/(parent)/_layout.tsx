import { Tabs } from 'expo-router';
import { Users, FileText, CreditCard, Settings } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ParentLayout() {
    const colorScheme = useColorScheme();
    const primaryColor = '#8b5cf6'; // violet-500 (Parent brand color)

    return (
        <Tabs screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: primaryColor,
            headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#fff',
            },
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: colorScheme === 'dark' ? '#1e293b' : '#e2e8f0',
                backgroundColor: colorScheme === 'dark' ? '#0f172a' : '#fff',
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Children',
                    tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="finance"
                options={{
                    title: 'Finance',
                    tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
            />

        </Tabs>
    );
}
