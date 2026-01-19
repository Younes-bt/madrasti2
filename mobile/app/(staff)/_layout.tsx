import { Stack } from 'expo-router';

export default function StaffLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: '#1e293b' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: 'inter', fontWeight: 'bold' }
        }}>
            <Stack.Screen name="index" options={{ title: 'Staff Portal' }} />
        </Stack>
    );
}
