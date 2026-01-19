import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Stack } from 'expo-router';
import ModuleGrid from '../../components/dashboard/ModuleGrid';
import { LogOut, Menu } from 'lucide-react-native';

export default function StaffHome() {
    const { signOut } = useAuth();
    const router = useRouter();

    const modules = [
        { id: 'attendance', title: 'Attendance', icon: 'CalendarCheck2', route: '/(staff)/attendance', color: 'bg-emerald-500' },
        { id: 'students', title: 'Search Students', icon: 'Search', route: '/(staff)/students', color: 'bg-blue-500' },
        { id: 'comms', title: 'Communications', icon: 'MessageSquare', route: '/(staff)/comms', color: 'bg-rose-500' },
        { id: 'profile', title: 'My Profile', icon: 'User', route: '/(staff)/profile', color: 'bg-slate-500' },
    ];

    const handleSignOut = async () => {
        await signOut();
        router.replace('/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <Stack.Screen options={{
                headerShown: true,
                title: 'Staff Dashboard',
                headerLeft: () => (
                    <Pressable className="ms-4 p-2">
                        <Menu size={24} color="#0f172a" />
                    </Pressable>
                ),
                headerRight: () => (
                    <Pressable onPress={handleSignOut} className="me-4 p-2">
                        <LogOut size={24} color="#f43f5e" />
                    </Pressable>
                ),
            }} />

            <View className="p-6 pb-0">
                <Text className="text-2xl font-bold text-slate-900">Staff Console 🛠️</Text>
                <Text className="text-slate-500">How can we help the school today?</Text>
            </View>

            <ModuleGrid modules={modules as any} />
        </SafeAreaView>
    );
}
