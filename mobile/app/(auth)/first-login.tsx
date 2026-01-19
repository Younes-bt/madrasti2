import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Alert, Platform, KeyboardAvoidingView, ScrollView, Pressable, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import api from '../../api/client';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { User, Lock, Phone, MapPin, FileText, CheckCircle, Sparkles, ChevronLeft, ArrowRight, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SchoolConfig {
    name: string;
    name_arabic?: string;
    logo_url?: string;
}

export default function FirstLoginScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';

    // Premium Theme Constants
    const colors = {
        bgGradient: isDark
            ? ['#0f0c29', '#302b63', '#24243e'] as const
            : ['#f0f9ff', '#e0f2fe', '#bae6fd'] as const,
        textColor: isDark ? 'text-white' : 'text-slate-900',
        subTextColor: isDark ? 'text-slate-300' : 'text-slate-500',
        iconColor: isDark ? '#e0e7ff' : '#4f46e5',
        cardBg: isDark ? 'bg-white/10' : 'bg-white/60',
        cardBorder: isDark ? 'border-white/10' : 'border-white/40',
        inputBg: isDark ? 'bg-black/20' : 'bg-white/50',
        inputBorder: isDark ? 'border-white/5' : 'border-indigo-100',
        accent: '#4f46e5',
        accentGradient: ['#4f46e5', '#4338ca'] as const,
    };

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0); // 0: Language, 0.5: Welcome, 1: Profile, 2: Password
    const [showWelcome, setShowWelcome] = useState(false);

    // School Config State
    const [schoolConfig, setSchoolConfig] = useState<SchoolConfig | null>(null);

    // Profile State
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        bio: '',
        date_of_birth: '',
    });
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || '',
            }));
        }
        fetchSchoolConfig();
    }, [user]);

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

    const handleLanguageSelect = async (lang: string) => {
        await i18n.changeLanguage(lang);
        setStep(0.5);
        setTimeout(() => setShowWelcome(true), 100);
    };

    const handleBackToLanguage = () => {
        setShowWelcome(false);
        setStep(0);
    }

    const handleProfileSubmit = async () => {
        if (!profileData.first_name || !profileData.last_name) {
            Alert.alert(t('error.title') || 'Error', t('validation.nameRequired') || 'Name is required');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(profileData).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            if (profileImage) {
                const filename = profileImage.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : `image`;
                // @ts-ignore
                formData.append('profile_picture', { uri: profileImage, name: filename, type });
            }

            await api.patch('/users/profile/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setStep(2);
        } catch (error: any) {
            console.error('Profile Update Error:', error);
            const msg = error.response?.data?.message || 'Failed to update profile';
            if (Platform.OS === 'web') alert(msg);
            else Alert.alert(t('error.title') || 'Error', msg);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            Alert.alert(t('error.title') || 'Error', 'All fields are required');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert(t('error.title') || 'Error', 'New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            Alert.alert(t('error.title') || 'Error', 'Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await api.post('/users/change-password/', {
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword,
                confirm_password: passwordData.confirmPassword
            });

            if (Platform.OS === 'web') {
                window.alert(t('auth.passwordChangedSuccess'));
                await signOut();
                router.replace('/(auth)/login');
            } else {
                Alert.alert(
                    t('success.title') || 'Success',
                    t('auth.passwordChangedSuccess'),
                    [{
                        text: 'OK',
                        onPress: async () => {
                            await signOut();
                            router.replace('/(auth)/login');
                        }
                    }]
                );
            }
        } catch (error: any) {
            console.error('Password Change Error:', error);
            const msg = error.response?.data?.error || 'Failed to change password';
            if (Platform.OS === 'web') alert(msg);
            else Alert.alert(t('error.title') || 'Error', msg);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // --- RENDER HELPERS ---

    const renderHeader = (title: string, subtitle?: string, showBack = false, onBack?: () => void) => (
        <View className="mb-8 px-4">
            {showBack && onBack && (
                <Pressable
                    onPress={onBack}
                    className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} border ${colors.cardBorder} mb-4 active:opacity-70`}
                >
                    <ChevronLeft size={24} color={colors.iconColor} />
                </Pressable>
            )}
            <Text className={`text-3xl font-cairo-bold ${colors.textColor} tracking-tight`}>
                {title}
            </Text>
            {subtitle && (
                <Text className={`mt-2 ${colors.subTextColor} text-base font-cairo-medium leading-6`}>
                    {subtitle}
                </Text>
            )}
        </View>
    );

    // --- STEPS ---

    // Step 0.5: Welcome Overlay - Premium Full Screen Experience
    if (step === 0.5 && showWelcome) {
        // Determine dynamic branding
        const displayName = (isRTL && schoolConfig?.name_arabic) ? schoolConfig.name_arabic : (schoolConfig?.name || 'Madrasti');

        return (
            <View className="flex-1">
                {/* Deep Premium Gradient Background */}
                <LinearGradient
                    colors={['#312e81', '#4338ca', '#4f46e5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <SafeAreaView className="flex-1">
                    <View className="flex-1 px-6">
                        {/* Top Bar with Back Button */}
                        <View className="mt-4">
                            <Pressable
                                onPress={handleBackToLanguage}
                                className="w-10 h-10 items-center justify-center rounded-full bg-white/20 border border-white/10 active:opacity-70"
                            >
                                <ChevronLeft size={24} color="white" />
                            </Pressable>
                        </View>

                        {/* Centered Content */}
                        <View className="flex-1 items-center justify-center">
                            {/* Glowing Icon/Logo Container */}
                            <View className="mb-10 relative items-center justify-center">
                                <View className="absolute w-32 h-32 rounded-full bg-indigo-400/30 blur-xl" />
                                <View className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 items-center justify-center backdrop-blur-md rotate-3 overflow-hidden">
                                    {schoolConfig?.logo_url ? (
                                        <Image source={{ uri: schoolConfig.logo_url }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <Sparkles size={48} color="white" fill="white" />
                                    )}
                                </View>
                            </View>

                            <Text className="text-4xl font-cairo-bold text-white text-center mb-6 leading-tight">
                                {t('auth.firstLoginTitle', { appName: displayName })}
                            </Text>

                            <View className="bg-white/10 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-md">
                                <Text className="text-lg text-indigo-100 text-center font-cairo-medium leading-relaxed">
                                    {t('auth.firstLoginDescription')}
                                </Text>
                            </View>

                            {/* Action Button */}
                            <Pressable
                                className="w-full h-16 bg-white rounded-2xl items-center justify-center active:opacity-90 flex-row space-x-2 border border-indigo-100"
                                onPress={() => setStep(1)}
                            >
                                <Text className="text-indigo-600 font-bold text-xl">{t('auth.getStarted')}</Text>
                                <ArrowRight size={24} color="#4f46e5" strokeWidth={2.5} />
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <LinearGradient
                colors={colors.bgGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />
            {isDark && <View className="absolute inset-0 bg-black/5" />}

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

                        {/* HEADER & STEPS INDICATOR */}
                        <View className="px-6 pt-4">
                            {step > 0 && (
                                <View className="flex-row items-center justify-center mb-8 space-x-2">
                                    {[1, 2].map((s) => (
                                        <View key={s} className="flex-row items-center">
                                            <View className={`w-8 h-8 rounded-full items-center justify-center ${step >= s ? 'bg-indigo-600' : 'bg-slate-300/50'}`}>
                                                {step > s ? <CheckCircle size={16} color="white" /> : <Text className="text-white font-cairo-bold">{s}</Text>}
                                            </View>
                                            {s === 1 && <View className={`h-1 w-12 mx-2 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-300/30'}`} />}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* CONTENT */}
                        <View className="px-6">
                            {/* Step 0: Language */}
                            {step === 0 && (
                                <View className="mt-10">
                                    {renderHeader(t('settings.language.select'), t('settings.language.title') + " / Langue / اللغة")}

                                    <View className="gap-y-4">
                                        <LanguageCard
                                            label="English"
                                            subLabel="Professional School Management"
                                            active={i18n.language === 'en'}
                                            onPress={() => handleLanguageSelect('en')}
                                            colors={colors}
                                            icon="🇺🇸"
                                        />
                                        <LanguageCard
                                            label="Français"
                                            subLabel="Gestion Scolaire Professionnelle"
                                            active={i18n.language === 'fr'}
                                            onPress={() => handleLanguageSelect('fr')}
                                            colors={colors}
                                            icon="🇫🇷"
                                        />
                                        <LanguageCard
                                            label="العربية"
                                            subLabel="نظام إدارة مدرسية احترافي"
                                            active={i18n.language === 'ar'}
                                            onPress={() => handleLanguageSelect('ar')}
                                            colors={colors}
                                            icon="🇲🇦"
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Step 1: Profile */}
                            {step === 1 && (
                                <View>
                                    {renderHeader(t('auth.completeProfile'), t('auth.firstLoginWhatDo'), true, () => {
                                        setStep(0);
                                        setShowWelcome(false);
                                    })}

                                    <View className={`p-6 rounded-3xl ${colors.cardBg} border ${colors.cardBorder}`}>
                                        <Pressable onPress={pickImage} className="self-center mb-8 relative">
                                            <View className={`w-28 h-28 rounded-full ${colors.inputBg} border-2 ${colors.inputBorder} items-center justify-center overflow-hidden`}>
                                                {profileImage ? (
                                                    <Image source={{ uri: profileImage }} className="w-full h-full" />
                                                ) : (
                                                    <User size={48} color={colors.iconColor} opacity={0.5} />
                                                )}
                                            </View>
                                            <View className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full border-4 border-[#0f0c29]">
                                                <Camera size={16} color="white" />
                                            </View>
                                        </Pressable>

                                        <View className="space-y-4">
                                            <GlassInput icon={<User />} placeholder={t('common.firstName')} value={profileData.first_name} onChangeText={t => setProfileData({ ...profileData, first_name: t })} colors={colors} />
                                            <GlassInput icon={<User />} placeholder={t('common.lastName')} value={profileData.last_name} onChangeText={t => setProfileData({ ...profileData, last_name: t })} colors={colors} />
                                            <GlassInput icon={<Phone />} placeholder={t('common.phone')} value={profileData.phone} onChangeText={t => setProfileData({ ...profileData, phone: t })} keyboardType="phone-pad" colors={colors} />
                                            <GlassInput icon={<MapPin />} placeholder={t('common.address')} value={profileData.address} onChangeText={t => setProfileData({ ...profileData, address: t })} colors={colors} />
                                            <GlassInput icon={<FileText />} placeholder={t('common.bio')} value={profileData.bio} onChangeText={t => setProfileData({ ...profileData, bio: t })} multiline colors={colors} />
                                        </View>

                                        <Pressable
                                            className={`h-14 rounded-2xl mt-8 items-center justify-center overflow-hidden ${loading ? 'opacity-80' : ''}`}
                                            onPress={handleProfileSubmit}
                                            disabled={loading}
                                        >
                                            <LinearGradient
                                                colors={colors.accentGradient}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                className="w-full h-full items-center justify-center"
                                            >
                                                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-cairo-bold text-lg">{t('common.next')}</Text>}
                                            </LinearGradient>
                                        </Pressable>
                                    </View>
                                </View>
                            )}

                            {/* Step 2: Password */}
                            {step === 2 && (
                                <View>
                                    {renderHeader(t('auth.securityFirst'), t('auth.firstLoginWhySecurity'))}

                                    <View className={`p-6 rounded-3xl ${colors.cardBg} border ${colors.cardBorder}`}>
                                        <View className="space-y-4">
                                            <GlassInput icon={<Lock />} placeholder={t('auth.currentPassword')} value={passwordData.currentPassword} onChangeText={t => setPasswordData({ ...passwordData, currentPassword: t })} secureTextEntry colors={colors} />
                                            <GlassInput icon={<Lock />} placeholder={t('auth.newPassword')} value={passwordData.newPassword} onChangeText={t => setPasswordData({ ...passwordData, newPassword: t })} secureTextEntry colors={colors} />
                                            <GlassInput icon={<Lock />} placeholder={t('auth.confirmPassword')} value={passwordData.confirmPassword} onChangeText={t => setPasswordData({ ...passwordData, confirmPassword: t })} secureTextEntry colors={colors} />
                                        </View>

                                        <Pressable
                                            className={`h-14 rounded-2xl mt-8 items-center justify-center overflow-hidden ${loading ? 'opacity-80' : ''}`}
                                            onPress={handlePasswordSubmit}
                                            disabled={loading}
                                        >
                                            <LinearGradient
                                                colors={['#16a34a', '#15803d'] as const}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                className="w-full h-full items-center justify-center"
                                            >
                                                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-cairo-bold text-lg">{t('common.save')}</Text>}
                                            </LinearGradient>
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

// --- COMPONENTS ---

const GlassInput = ({ icon, placeholder, value, onChangeText, secureTextEntry, keyboardType, multiline, colors }: any) => {
    const IconComponent = React.cloneElement(icon, { size: 20, color: colors.iconColor });
    return (
        <View className={`flex-row items-center px-4 ${multiline ? 'h-28 items-start py-4' : 'h-14'} rounded-2xl border ${colors.inputBorder} ${colors.inputBg} mb-3 focus:border-indigo-400`}>
            {IconComponent}
            <TextInput
                className={`flex-1 ml-3 text-base ${colors.textColor} h-full font-cairo-medium`}
                placeholder={placeholder}
                placeholderTextColor={colors.subTextColor}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
};

const LanguageCard = ({ label, subLabel, active, onPress, colors, icon }: any) => (
    <Pressable
        onPress={onPress}
        className={`flex-row items-center p-5 rounded-3xl border mb-3 active:scale-95 transition-all duration-200 ${active ? 'bg-indigo-500/20 border-indigo-500' : colors.cardBg + ' ' + colors.cardBorder}`}
    >
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${active ? 'bg-indigo-500' : 'bg-slate-200/20'}`}>
            <Text className="text-2xl">{icon}</Text>
        </View>
        <View className="flex-1">
            <Text className={`text-xl font-cairo-bold ${active ? 'text-indigo-400' : colors.textColor}`}>{label}</Text>
            <Text className={`${colors.subTextColor} text-sm`}>{subLabel}</Text>
        </View>
        {active && (
            <View className="bg-indigo-500 rounded-full p-1 border border-indigo-400">
                <CheckCircle size={20} color="white" />
            </View>
        )}
    </Pressable>
);
