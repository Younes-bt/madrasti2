import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Palette, Languages, LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { SettingsSection } from '../../../components/ui/SettingsSection';
import { SettingsOption } from '../../../components/ui/SettingsOption';
import { ThemeSelector } from '../../../components/settings/ThemeSelector';
import { LanguageSelector } from '../../../components/settings/LanguageSelector';
import * as Haptics from 'expo-haptics';

export default function SettingsPage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();

    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const getThemeLabel = () => {
        switch (theme) {
            case 'light':
                return t('settings.appearance.light');
            case 'dark':
                return t('settings.appearance.dark');
            case 'system':
                return t('settings.appearance.system');
            default:
                return t('settings.appearance.system');
        }
    };

    const getLanguageLabel = () => {
        switch (i18n.language) {
            case 'en':
                return 'English';
            case 'ar':
                return 'العربية';
            case 'fr':
                return 'Français';
            default:
                return 'English';
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            t('settings.account.signOut'),
            t('settings.account.signOutConfirm'),
            [
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('common.confirm'),
                    style: 'destructive',
                    onPress: async () => {
                        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        await signOut();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: t('settings.title'),
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()} className="ms-4 p-2">
                            <ChevronLeft size={24} className="text-slate-900 dark:text-slate-50" />
                        </Pressable>
                    ),
                }}
            />

            <ScrollView className="flex-1 p-4">
                {/* Appearance Section */}
                <SettingsSection title={t('settings.appearance.title')}>
                    <SettingsOption
                        icon={Palette}
                        label={t('settings.appearance.theme')}
                        value={getThemeLabel()}
                        onPress={() => setShowThemeSelector(true)}
                        testID="theme-option"
                    />
                </SettingsSection>

                {/* Language Section */}
                <SettingsSection title={t('settings.language.title')}>
                    <SettingsOption
                        icon={Languages}
                        label={t('settings.language.select')}
                        value={getLanguageLabel()}
                        onPress={() => setShowLanguageSelector(true)}
                        testID="language-option"
                    />
                </SettingsSection>

                {/* Account Section */}
                <SettingsSection title={t('settings.account.title')}>
                    <Pressable
                        onPress={handleSignOut}
                        className="flex-row items-center py-4 px-4 bg-white dark:bg-slate-900 active:opacity-70"
                        testID="sign-out-button"
                    >
                        <View className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 items-center justify-center me-3">
                            <LogOut size={20} className="text-rose-600 dark:text-rose-400" />
                        </View>
                        <Text className="text-base font-medium text-rose-600 dark:text-rose-400">
                            {t('settings.account.signOut')}
                        </Text>
                    </Pressable>
                </SettingsSection>

                {/* Footer info */}
                <View className="mt-6 mb-8">
                    <Text className="text-center text-sm text-slate-400 dark:text-slate-600">
                        {t('settings.subtitle')}
                    </Text>
                </View>
            </ScrollView>

            {/* Modals */}
            <ThemeSelector
                visible={showThemeSelector}
                onClose={() => setShowThemeSelector(false)}
            />
            <LanguageSelector
                visible={showLanguageSelector}
                onClose={() => setShowLanguageSelector(false)}
            />
        </SafeAreaView>
    );
}
