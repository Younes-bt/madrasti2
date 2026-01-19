import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Sun, Moon, Monitor, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ThemeSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ visible, onClose }) => {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();

    const themeOptions = [
        {
            value: 'light' as const,
            label: t('settings.appearance.light'),
            icon: Sun,
            description: 'Always use light theme',
        },
        {
            value: 'dark' as const,
            label: t('settings.appearance.dark'),
            icon: Moon,
            description: 'Always use dark theme',
        },
        {
            value: 'system' as const,
            label: t('settings.appearance.system'),
            icon: Monitor,
            description: 'Match device theme',
        },
    ];

    const handleSelect = async (value: 'light' | 'dark' | 'system') => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await setTheme(value);
        setTimeout(onClose, 150);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={onClose}
            >
                <Pressable
                    className="bg-white dark:bg-slate-900 rounded-t-3xl p-6"
                    onPress={(e) => e.stopPropagation()}
                >
                    <View className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full self-center mb-6" />

                    <Text className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                        {t('settings.appearance.theme')}
                    </Text>

                    {themeOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isSelected = theme === option.value;

                        return (
                            <Pressable
                                key={option.value}
                                onPress={() => handleSelect(option.value)}
                                className={`flex-row items-center p-4 rounded-2xl mb-2 active:opacity-70 ${isSelected
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                                        : 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent'
                                    }`}
                            >
                                <View className={`w-12 h-12 rounded-xl items-center justify-center me-3 ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-700'
                                    }`}>
                                    <Icon
                                        size={24}
                                        className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}
                                    />
                                </View>

                                <View className="flex-1">
                                    <Text className={`text-base font-semibold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-50'
                                        }`}>
                                        {option.label}
                                    </Text>
                                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                                        {option.description}
                                    </Text>
                                </View>

                                {isSelected && (
                                    <Check size={24} className="text-blue-600 dark:text-blue-400" />
                                )}
                            </Pressable>
                        );
                    })}
                </Pressable>
            </Pressable>
        </Modal>
    );
};
