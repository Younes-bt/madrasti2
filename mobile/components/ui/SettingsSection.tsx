import React from 'react';
import { View, Text } from 'react-native';

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
    return (
        <View className="mb-6">
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 mb-2">
                {title}
            </Text>
            <View className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                {children}
            </View>
        </View>
    );
};
