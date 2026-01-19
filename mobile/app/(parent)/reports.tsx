import { View, Text } from 'react-native';

export default function ReportsPage() {
    return (
        <View className="flex-1 bg-slate-50 p-6 justify-center items-center">
            <Text className="text-xl font-bold text-slate-900">Academic Reports 📑</Text>
            <Text className="text-slate-500 mt-2">Track your children's progress here.</Text>
        </View>
    );
}
