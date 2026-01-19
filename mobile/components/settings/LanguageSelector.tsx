import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
    const { i18n, t } = useTranslation();

    const languageOptions = [
        {
            code: 'en',
            label: t('settings.language.english'),
            nativeLabel: 'English',
            flag: '🇬🇧',
        },
        {
            code: 'ar',
            label: t('settings.language.arabic'),
            nativeLabel: 'العربية',
            flag: '🇲🇦',
        },
        {
            code: 'fr',
            label: t('settings.language.french'),
            nativeLabel: 'Français',
            flag: '🇫🇷',
        },
    ];

    const handleSelect = async (languageCode: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await i18n.changeLanguage(languageCode);
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
                        {t('settings.language.select')}
                    </Text>

                    {languageOptions.map((option) => {
                        const isSelected = i18n.language === option.code;

                        return (
                            <Pressable
                                key={option.code}
                                onPress={() => handleSelect(option.code)}
                                className={`flex-row items-center p-4 rounded-2xl mb-2 active:opacity-70 ${isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                                    : 'bg-slate-50 dark:bg-slate-800 border-2 border-transparent'
                                    }`}
                            >
                                <View className={`w-12 h-12 rounded-xl items-center justify-center me-3 ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-700'
                                    }`}>
                                    <Text className="text-2xl">{option.flag}</Text>
                                </View>

                                <View className="flex-1">
                                    <Text className={`text-base font-semibold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-50'
                                        }`}>
                                        {option.nativeLabel}
                                    </Text>
                                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                                        {option.label}
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
