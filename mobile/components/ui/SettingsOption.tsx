import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface SettingsOptionProps {
    icon: LucideIcon;
    label: string;
    value?: string;
    onPress: () => void;
    testID?: string;
}

export const SettingsOption: React.FC<SettingsOptionProps> = ({
    icon: Icon,
    label,
    value,
    onPress,
    testID,
}) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <Pressable
            testID={testID}
            onPress={handlePress}
            className="flex-row items-center justify-between py-4 px-4 bg-white dark:bg-slate-900 active:opacity-70"
        >
            <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 items-center justify-center me-3">
                    <Icon size={20} className="text-slate-700 dark:text-slate-300" />
                </View>
                <Text className="text-base font-medium text-slate-900 dark:text-slate-50 flex-1">
                    {label}
                </Text>
            </View>
            {value && (
                <Text className="text-sm text-slate-500 dark:text-slate-400 ms-2">
                    {value}
                </Text>
            )}
        </Pressable>
    );
};
