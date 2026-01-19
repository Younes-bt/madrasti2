import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { token, role, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3350f5" />
            </View>
        );
    }

    if (!token) {
        return <Redirect href="/(auth)/login" />;
    }

    // Redirect based on role
    switch (role) {
        case 'ADMIN':
            return <Redirect href="/(admin)" />;
        case 'TEACHER':
            return <Redirect href="/(teacher)" />;
        case 'STUDENT':
            return <Redirect href="/(student)" />;
        case 'PARENT':
            return <Redirect href="/(parent)" />;
        default:
            return <Redirect href="/(staff)" />;
    }
}
