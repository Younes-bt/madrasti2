import { Stack } from 'expo-router';

export default function SchoolLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="details" />
            <Stack.Screen name="staff" />
            <Stack.Screen name="rooms" />
        </Stack>
    );
}
