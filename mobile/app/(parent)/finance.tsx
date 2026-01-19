import { View, Text } from 'react-native';

export default function FinancePage() {
    return (
        <View className="flex-1 bg-slate-50 p-6 justify-center items-center">
            <Text className="text-xl font-bold text-slate-900">Fees & Payments 💳</Text>
            <Text className="text-slate-500 mt-2">Manage school fees and receipts.</Text>
        </View>
    );
}
