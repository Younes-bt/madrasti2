import { View, Text, TextInput, ActivityIndicator, Alert, Platform, KeyboardAvoidingView, ScrollView, Pressable, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import api from '../../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SchoolConfig {
    name: string;
    name_arabic?: string;
    logo_url?: string;
}

const getColors = (isDark: boolean) => {
    return {
        bgColors: isDark
            ? ['#0f0c29', '#302b63', '#24243e'] as const
            : ['#f0f9ff', '#e0f2fe', '#bae6fd'] as const,
        textColor: isDark ? 'text-white' : 'text-slate-900',
        subTextColor: isDark ? 'text-slate-400' : 'text-slate-500',
        iconColor: isDark ? '#94a3b8' : '#64748b',
        inputBg: isDark ? 'bg-white/10' : 'bg-white/60',
        inputBorder: isDark ? 'border-white/10' : 'border-white/40',
        cardBg: isDark ? 'bg-white/5' : 'bg-white/40',
    };
};

export default function LoginScreen() {
    const { signIn } = useAuth();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // School Config State
    const [schoolConfig, setSchoolConfig] = useState<SchoolConfig | null>(null);

    useEffect(() => {
        fetchSchoolConfig();
    }, []);

    const fetchSchoolConfig = async () => {
        try {
            const response = await api.get('/schools/config/');
            const data = response.data;
            const schoolData = data.results ? data.results[0] : (Array.isArray(data) ? data[0] : data);
            setSchoolConfig(schoolData);
        } catch (error) {
            console.error('Failed to fetch school config:', error);
            // Non-blocking error, we'll just use defaults
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            const msg = t('auth.error.missingCredentials') || 'Please enter both email and password';
            if (Platform.OS === 'web') alert(msg);
            else Alert.alert(t('error.title') || 'Error', msg);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/users/login/', { email, password });
            // @ts-ignore
            const { access, refresh, user, force_password_change } = response.data;

            await signIn(access, refresh, user.role, user);

            if (force_password_change) {
                router.replace('/(auth)/first-login');
            } else {
                router.replace('/');
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            const message = error.response?.data?.error || t('auth.error.loginFailed') || 'Failed to login. Please check your credentials.';
            if (Platform.OS === 'web') alert(message);
            else Alert.alert(t('auth.loginFailed') || 'Login Failed', message);
        } finally {
            setLoading(false);
        }
    };

    // Determine dynamic branding
    const displayName = (isRTL && schoolConfig?.name_arabic) ? schoolConfig.name_arabic : (schoolConfig?.name || 'Madrasti 2.0');


    return (
        <View className="flex-1">
            <LinearGradient
                colors={colors.bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />
            {isDark && <View className="absolute inset-0 bg-black/20" />}

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-center"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
                    <View className="px-8 w-full max-w-md mx-auto">

                        {/* Header with Dynamic Branding */}
                        <View className="mb-12 items-center">
                            {/* Glowing Icon/Logo Container */}
                            <View className="mb-2 relative items-center justify-center">
                                <View className={`w-28 h-28 rounded-3xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-600'} mb-6 items-center justify-center transform rotate-3 overflow-hidden border ${isDark ? 'border-indigo-400/30' : 'border-indigo-500'}`}>
                                    {schoolConfig?.logo_url ? (
                                        <Image source={{ uri: schoolConfig.logo_url }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <Text className="text-4xl text-white font-cairo-bold">M</Text>
                                    )}
                                </View>
                            </View>

                            <Text className={`text-4xl font-cairo-bold ${colors.textColor} mb-2 text-center`}>{displayName}</Text>
                            <Text className={`${colors.subTextColor} text-lg text-center font-cairo-medium`}>
                                {t('auth.welcome') || 'Professional School Management'}
                            </Text>
                        </View>

                        {/* Form */}
                        <View className={`p-6 rounded-3xl ${colors.cardBg} border ${colors.inputBorder}`}>
                            <View className="gap-y-5">
                                {/* Email Input */}
                                <View>
                                    <Text className={`mb-2 text-sm font-cairo-medium ${colors.textColor} ml-1`}>
                                        {t('common.email') || 'Email Address'}
                                    </Text>
                                    <View className={`flex-row items-center px-4 h-14 rounded-2xl border ${colors.inputBorder} ${colors.inputBg}`}>
                                        <Mail size={20} color={colors.iconColor} />
                                        <TextInput
                                            className={`flex-1 ml-3 text-base ${colors.textColor} h-full font-cairo-medium`}
                                            placeholder={t('auth.emailPlaceholder') || "name@example.com"}
                                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            style={{ textAlign: isRTL ? 'right' : 'left' }}
                                        />
                                    </View>
                                </View>

                                {/* Password Input */}
                                <View>
                                    <Text className={`mb-2 text-sm font-cairo-medium ${colors.textColor} ml-1`}>
                                        {t('common.password') || 'Password'}
                                    </Text>
                                    <View className={`flex-row items-center px-4 h-14 rounded-2xl border ${colors.inputBorder} ${colors.inputBg}`}>
                                        <Lock size={20} color={colors.iconColor} />
                                        <TextInput
                                            className={`flex-1 ml-3 text-base ${colors.textColor} h-full font-cairo-medium`}
                                            placeholder={t('auth.passwordPlaceholder') || "••••••••"}
                                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            style={{ textAlign: isRTL ? 'right' : 'left' }}
                                        />
                                        <Pressable onPress={() => setShowPassword(!showPassword)} className="p-1">
                                            {showPassword ? (
                                                <EyeOff size={20} color={colors.iconColor} />
                                            ) : (
                                                <Eye size={20} color={colors.iconColor} />
                                            )}
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Forgot Password Link */}
                                <View className="items-end">
                                    <Pressable>
                                        <Text className="text-indigo-500 font-cairo-bold text-sm">
                                            {t('auth.forgotPassword') || 'Forgot Password?'}
                                        </Text>
                                    </Pressable>
                                </View>

                                {/* Submit Button */}
                                <Pressable
                                    className={`h-14 rounded-2xl overflow-hidden mt-2 ${loading ? 'opacity-80' : ''}`}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={['#4f46e5', '#4338ca']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        className="w-full h-full items-center justify-center flex-row gap-2"
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="white" />
                                        ) : (
                                            <>
                                                <Text className="text-white font-cairo-bold text-lg">{t('auth.login') || 'Sign In'}</Text>
                                                <LogIn size={20} color="white" strokeWidth={2.5} />
                                            </>
                                        )}
                                    </LinearGradient>
                                </Pressable>
                            </View>
                        </View>

                        {/* Footer */}
                        <Text className={`text-center ${colors.subTextColor} mt-10 text-xs font-cairo-medium`}>
                            OPICOM Tech © 2026
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
