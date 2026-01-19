import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function MessagesPage() {
    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <Stack.Screen options={{ headerShown: false }} />
            <Text className="text-xl font-bold text-gray-800">Messages Page</Text>
            <Text className="text-gray-500 mt-2">Coming Soon...</Text>
        </SafeAreaView>
    );
}
