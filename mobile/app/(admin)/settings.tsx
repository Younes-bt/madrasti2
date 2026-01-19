import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Palette, Languages, LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SettingsSection } from '../../components/ui/SettingsSection';
import { SettingsOption } from '../../components/ui/SettingsOption';
import { ThemeSelector } from '../../components/settings/ThemeSelector';
import { LanguageSelector } from '../../components/settings/LanguageSelector';
import * as Haptics from 'expo-haptics';

export default function SettingsPage() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { theme, actualTheme } = useTheme(); // Use actualTheme for UI colors
    const { t, i18n } = useTranslation();

    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const isDark = actualTheme === 'dark';

    // Shell Colors
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f172a', '#1e293b']
        : ['#f8fafc', '#f1f5f9'];
    const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
    const iconColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
    const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

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
        if (Platform.OS === 'web') {
            const confirmed = window.confirm(t('settings.account.signOutConfirm'));
            if (confirmed) {
                try {
                    console.log('User confirmed sign out (Web)');
                    await signOut();
                    console.log('Sign out successful, redirecting to login');
                    router.replace('/login');
                } catch (error) {
                    console.error('Sign out failed:', error);
                    alert('Failed to sign out. Please try again.');
                }
            }
        } else {
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
                            try {
                                console.log('User initiated sign out (Native)');
                                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                await signOut();
                                // Small delay to ensure state updates propagate
                                setTimeout(() => {
                                    router.replace('/login');
                                }, 100);
                            } catch (error) {
                                console.error('Sign out failed:', error);
                                Alert.alert('Error', 'Failed to sign out. Please try again.');
                            }
                        },
                    },
                ]
            );
        }
    };

    return (
        <View className="flex-1 bg-background">
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0"
            />
            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-6 pt-4 pb-6 flex-row items-center gap-4">
                    <Pressable onPress={() => router.back()} className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder} active:opacity-70`}>
                        <ChevronLeft size={24} color={iconColor} />
                    </Pressable>
                    <Text className={`${textColor} text-xl font-bold`}>{t('settings.title')}</Text>
                </View>

                <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
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
                            className={`flex-row items-center py-4 px-4 active:opacity-70 bg-white dark:bg-slate-900`}
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
        </View>
    );
}
