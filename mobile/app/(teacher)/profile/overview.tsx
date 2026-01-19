import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, Linking, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../api/client';
import {
    ChevronLeft,
    Mail,
    Phone,
    Calendar,
    MapPin,
    CheckCircle,
    XCircle,
    BadgeCheck,
    Hash,
    BookOpen,
    GraduationCap,
    Users,
    DollarSign,
    Globe,
    FileText,
    User,
    LogOut
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const getColors = (isDark: boolean) => {
    return {
        bgColors: isDark
            ? ['#0f0c29', '#302b63', '#24243e'] as const
            : ['#f0f9ff', '#e0f2fe', '#bae6fd'] as const,
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/60' : 'text-gray-600',
        iconColor: isDark ? '#fff' : '#1e293b',
        cardBgColor: isDark ? 'bg-white/5' : 'bg-white/60',
        borderColor: isDark ? 'border-white/10' : 'border-white/40',
        // Pink theme for teachers
        bannerGradient: isDark
            ? ['#db2777', '#be185d'] as const
            : ['#db2777', '#be185d'] as const,
        accentColor: isDark ? '#f472b6' : '#db2777',
        accentBg: isDark ? 'bg-pink-500/20' : 'bg-pink-100',
        accentBorder: isDark ? 'border-pink-400/30' : 'border-pink-200',
    };
};

export default function TeacherProfile() {
    const { user, signOut } = useAuth();
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [teacher, setTeacher] = useState<any | null>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [contract, setContract] = useState<any | null>(null);
    const [loadingContract, setLoadingContract] = useState(false);

    const fetchTeacherDetails = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await api.get(`/users/users/${user.id}/`);
            setTeacher(response.data);
            return response.data;
        } catch (err) {
            console.error('Failed to fetch teacher details:', err);
        }
    }, [user?.id]);

    const fetchTeacherClasses = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoadingClasses(true);
            const response = await api.get('/attendance/timetable-sessions/');
            const rawData = response.data;
            const allSessions: any[] = Array.isArray(rawData) ? rawData : (rawData.results || []);

            // Filter sessions for this teacher
            const teacherSessions = allSessions.filter((session: any) => {
                const teacherIdStr = typeof session.teacher === 'object' ? session.teacher.id : session.teacher;
                return String(teacherIdStr) === String(user.id);
            });

            const classesMap = new Map();

            teacherSessions.forEach((session: any) => {
                if (session.class_name && session.timetable_id) {
                    const classId = session.timetable_id;
                    if (!classesMap.has(classId)) {
                        const classData = {
                            id: classId,
                            school_class_id: session.school_class_id,
                            name: session.class_name || 'Unknown Class',
                            section: session.class_section || '',
                            room: session.room_name ? {
                                id: session.room || 0,
                                name: session.room_name,
                                type: 'classroom'
                            } : null,
                            weekly_sessions: 0,
                            subjects_taught: [] as any[]
                        };
                        classesMap.set(classId, classData);
                    }

                    const classData = classesMap.get(classId);
                    const subjectExists = classData.subjects_taught.some((s: any) => s.id === session.subject);
                    if (session.subject && session.subject_name && !subjectExists) {
                        classData.subjects_taught.push({
                            id: session.subject,
                            name: session.subject_name,
                            name_arabic: session.subject_name_arabic || '',
                            code: ''
                        });
                    }

                    classData.weekly_sessions++;
                }
            });

            setClasses(Array.from(classesMap.values()));
        } catch (err) {
            console.error('Error fetching teacher classes:', err);
        } finally {
            setLoadingClasses(false);
        }
    }, [user?.id]);

    const fetchTeacherContract = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoadingContract(true);
            const response = await api.get(`/finance/contracts/?employee=${user.id}`);
            const results = response.data.results || response.data;
            // Get the first active contract or just the first one if none active
            const activeContract = results.find((c: any) => c.is_active) || results[0];
            setContract(activeContract);
        } catch (err) {
            console.error('Error fetching contract:', err);
        } finally {
            setLoadingContract(false);
        }
    }, [user?.id]);

    const loadAllData = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchTeacherDetails(),
            fetchTeacherClasses(),
            fetchTeacherContract()
        ]);
        setLoading(false);
    }, [fetchTeacherDetails, fetchTeacherClasses, fetchTeacherContract]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Haptics.selectionAsync();
        await loadAllData();
        setRefreshing(false);
    }, [loadAllData]);

    const handleSignOut = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await signOut();
        router.replace('/(auth)/login');
    };

    const openUrl = (url: string) => {
        if (!url) return;
        Linking.openURL(url).catch(err => console.error("Couldn't open URL", err));
    };

    const getDisplayName = (userData: any) => {
        if (!userData) return '';
        if (isRTL && (userData.ar_first_name || userData.ar_last_name)) {
            return `${userData.ar_first_name || ''} ${userData.ar_last_name || ''}`.trim();
        }
        return userData.full_name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
    };

    const getDisplaySubject = (subject: any) => {
        if (!subject) return null;
        const lang = i18n.language;
        if (typeof subject === 'string') return subject;

        if (lang === 'ar' && subject.name_arabic) {
            return subject.name_arabic;
        }
        if (lang === 'fr' && subject.name_french) {
            return subject.name_french;
        }
        return subject.name;
    };

    const getLocalizedGradeName = (grade: any) => {
        const lang = i18n.language;
        switch (lang) {
            case 'ar':
                return grade.name_arabic || grade.name;
            case 'fr':
                return grade.name_french || grade.name;
            default:
                return grade.name;
        }
    };

    if (loading && !refreshing) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <LinearGradient
                    colors={colors.bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="absolute inset-0"
                />
                <ActivityIndicator size="large" color={colors.accentColor} />
            </View>
        );
    }

    const displayUser = teacher || user;

    return (
        <View className="flex-1">
            <LinearGradient
                colors={colors.bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />
            {isDark && <View className="absolute inset-0 bg-black/10" />}

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-3 pt-4 pb-2 flex-row items-center justify-between z-50">
                    <Pressable
                        onPress={() => router.back()}
                        className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/5'} border active:opacity-70`}
                    >
                        <ChevronLeft size={24} color={colors.iconColor} />
                    </Pressable>
                    <Text className={`${colors.textColor} text-xl font-bold tracking-wider`}>
                        {t('teacher.profile.title') || 'My Profile'}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    className="px-3 pt-2"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? "#fff" : colors.accentColor} />
                    }
                >

                    {/* Profile Banner */}
                    <View className="mt-4 mb-6 items-center">
                        <View className="relative mb-4">
                            <View className={`h-28 w-28 rounded-3xl ${colors.accentBg} items-center justify-center overflow-hidden border-2 ${colors.accentBorder}`}>
                                {displayUser?.profile_picture_url || displayUser?.avatar ? (
                                    <Image source={{ uri: displayUser.profile_picture_url || displayUser?.avatar }} className="h-full w-full" resizeMode="cover" />
                                ) : (
                                    <Text className={`text-3xl font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                                        {(displayUser?.first_name?.[0] || '') + (displayUser?.last_name?.[0] || '')}
                                    </Text>
                                )}
                            </View>
                            <View className={`absolute -bottom-2 px-3 py-1 rounded-full border-2 ${isDark ? 'border-[#0f0c29]' : 'border-white'} ${displayUser?.is_active ? 'bg-green-500' : 'bg-gray-400'} flex-row items-center gap-1 self-center`}>
                                {displayUser?.is_active ? <CheckCircle size={10} color="#fff" /> : <XCircle size={10} color="#fff" />}
                                <Text className="text-white text-[10px] font-bold uppercase">
                                    {displayUser?.is_active ? (t('status.active') || 'Active') : (t('status.inactive') || 'Inactive')}
                                </Text>
                            </View>
                        </View>

                        <Text className={`text-2xl font-bold ${colors.textColor} text-center mb-1`}>
                            {getDisplayName(displayUser)}
                        </Text>

                        <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-pink-50'} border ${colors.borderColor}`}>
                            <BookOpen size={14} color={colors.accentColor} />
                            <Text className={`text-sm font-medium ${isDark ? 'text-pink-200' : 'text-pink-600'}`}>
                                {getDisplaySubject(displayUser?.school_subject) || t('teachers.teacher') || 'Teacher'}
                            </Text>
                        </View>
                    </View>

                    {/* Information Cards */}
                    <View className="gap-4">

                        {/* Contact Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('teachers.contactInfo') || 'Contact Information'}</Text>

                            <View className="gap-4">
                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                                        <Mail size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.email') || 'Email'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`} numberOfLines={1}>{displayUser?.email || '---'}</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                        <Phone size={18} color={isDark ? '#4ade80' : '#16a34a'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.phone') || 'Phone'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{displayUser?.phone || '---'}</Text>
                                    </View>
                                </View>

                                {displayUser?.address && (
                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                                            <MapPin size={18} color={isDark ? '#c084fc' : '#9333ea'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.address') || 'Address'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>{displayUser.address}</Text>
                                        </View>
                                    </View>
                                )}

                                {displayUser?.date_of_birth && (
                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                                            <Calendar size={18} color={isDark ? '#fcd34d' : '#d97706'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('common.dateOfBirth') || 'Date of Birth'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>
                                                {new Date(displayUser.date_of_birth).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Professional Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('teachers.professionalInfo') || 'Professional Details'}</Text>

                            <View className="gap-4">
                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                                        <Hash size={18} color={isDark ? '#fb923c' : '#ea580c'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.employeeId') || 'Employee ID'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{displayUser?.username || '---'}</Text>
                                    </View>
                                </View>

                                {/* Subject Field */}
                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${colors.accentBg}`}>
                                        <BookOpen size={18} color={colors.accentColor} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.subject') || 'Subject'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>
                                            {getDisplaySubject(displayUser?.school_subject) || '---'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Teachable Grades */}
                                {displayUser?.teachable_grades && displayUser.teachable_grades.length > 0 && (
                                    <View className="flex-row items-start gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                                            <GraduationCap size={18} color={isDark ? '#22d3ee' : '#0891b2'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-1.5`}>{t('teachers.teachableGrades') || 'Teachable Grades'}</Text>
                                            <View className="flex-row flex-wrap gap-2">
                                                {displayUser.teachable_grades.map((grade: any) => (
                                                    <View key={grade.id} className={`px-2 py-1 rounded-lg border ${colors.borderColor} ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                                                        <Text className={`text-xs ${colors.textColor}`}>{getLocalizedGradeName(grade)}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                )}

                                <View className="flex-row items-center gap-3">
                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
                                        <BadgeCheck size={18} color={isDark ? '#2dd4bf' : '#0d9488'} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.role') || 'System Role'}</Text>
                                        <Text className={`text-base font-medium ${colors.textColor}`}>{displayUser?.role || 'TEACHER'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Contract Info */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('teachers.contract') || 'Contract Information'}</Text>

                            {loadingContract ? (
                                <ActivityIndicator size="small" color={colors.accentColor} />
                            ) : contract ? (
                                <View className="gap-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                            <FileText size={18} color={isDark ? '#818cf8' : '#4f46e5'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.contractType') || 'Contract Type'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>
                                                {contract.contract_type ? contract.contract_type.replace(/_/g, ' ') : '---'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                                            <Hash size={18} color={isDark ? '#a78bfa' : '#7c3aed'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.contractNumber') || 'Contract No'}</Text>
                                            <Text className={`text-base font-medium ${colors.textColor}`}>{contract.contract_number || '---'}</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1 flex-row items-center gap-3">
                                            <View className={`p-2 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                                <Calendar size={18} color={isDark ? '#4ade80' : '#16a34a'} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.startDate') || 'Start Date'}</Text>
                                                <Text className={`text-base font-medium ${colors.textColor}`}>
                                                    {new Date(contract.start_date).toLocaleDateString()}
                                                </Text>
                                            </View>
                                        </View>
                                        {contract.end_date && (
                                            <View className="flex-1 flex-row items-center gap-3">
                                                <View className={`p-2 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                                    <Calendar size={18} color={isDark ? '#f87171' : '#dc2626'} />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.endDate') || 'End Date'}</Text>
                                                    <Text className={`text-base font-medium ${colors.textColor}`}>
                                                        {new Date(contract.end_date).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <View className="h-[1px] bg-gray-200/20 my-2" />

                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                                            <DollarSign size={18} color={isDark ? '#34d399' : '#059669'} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.baseSalary') || 'Base Salary'}</Text>
                                            <Text className={`text-base font-bold ${colors.textColor}`}>
                                                {parseFloat(contract.base_amount).toLocaleString()} MAD
                                            </Text>
                                        </View>
                                    </View>

                                    {(parseFloat(contract.transportation_allowance) > 0 || parseFloat(contract.housing_allowance) > 0) && (
                                        <View className="flex-row gap-4 mt-2">
                                            {parseFloat(contract.transportation_allowance) > 0 && (
                                                <View className="flex-1 bg-black/5 p-2 rounded-lg">
                                                    <Text className={`text-[10px] ${colors.subTextColor} mb-1`}>{t('teachers.transportationAllowance') || 'Transport'}</Text>
                                                    <Text className={`text-sm font-bold ${colors.textColor}`}>{parseFloat(contract.transportation_allowance).toLocaleString()}</Text>
                                                </View>
                                            )}
                                            {parseFloat(contract.housing_allowance) > 0 && (
                                                <View className="flex-1 bg-black/5 p-2 rounded-lg">
                                                    <Text className={`text-[10px] ${colors.subTextColor} mb-1`}>{t('teachers.housingAllowance') || 'Housing'}</Text>
                                                    <Text className={`text-sm font-bold ${colors.textColor}`}>{parseFloat(contract.housing_allowance).toLocaleString()}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <Text className={`text-center ${colors.subTextColor} italic`}>{t('teachers.noContract') || 'No active contract found'}</Text>
                            )}
                        </View>

                        {/* My Classes */}
                        <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                            <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('teachers.myClasses') || 'My Classes'}</Text>

                            {loadingClasses ? (
                                <View className="items-center py-4">
                                    <ActivityIndicator size="small" color={colors.accentColor} />
                                </View>
                            ) : classes.length > 0 ? (
                                <View className="gap-3">
                                    {classes.map((cls) => (
                                        <View key={cls.id} className={`p-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${colors.borderColor} gap-3`}>
                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center gap-2">
                                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                                        <Users size={14} color={isDark ? '#818cf8' : '#4f46e5'} />
                                                    </View>
                                                    <View>
                                                        <Text className={`text-base font-bold ${colors.textColor}`}>
                                                            {cls.name} {cls.section}
                                                        </Text>
                                                        {cls.room && (
                                                            <Text className={`text-xs ${colors.subTextColor} flex-row items-center`}>
                                                                {cls.room.name}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                                <View className={`px-2 py-1 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                                                    <Text className={`text-xs font-bold ${colors.textColor}`}>{cls.weekly_sessions}h / Week</Text>
                                                </View>
                                            </View>

                                            {cls.subjects_taught && cls.subjects_taught.length > 0 && (
                                                <View className="flex-row flex-wrap gap-1.5">
                                                    {cls.subjects_taught.map((subj: any) => (
                                                        <View key={subj.id} className={`px-2 py-0.5 rounded-md border ${colors.borderColor} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                            <Text className={`text-[10px] ${colors.subTextColor}`}>
                                                                {isRTL ? (subj.name_arabic || subj.name) : (i18n.language === 'fr' ? (subj.name_french || subj.name) : subj.name)}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View className="items-center py-6">
                                    <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <Users size={20} color={isDark ? '#ffffff60' : '#9ca3af'} />
                                    </View>
                                    <Text className={`text-sm ${colors.subTextColor}`}>{t('teachers.noClassesAssigned') || 'No classes assigned'}</Text>
                                </View>
                            )}
                        </View>

                        {/* Emergency Contact */}
                        {(displayUser?.emergency_contact_name || displayUser?.emergency_contact_phone) && (
                            <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                                <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('teachers.emergencyContact') || 'Emergency Contact'}</Text>

                                <View className="gap-4">
                                    {displayUser.emergency_contact_name && (
                                        <View className="flex-row items-center gap-3">
                                            <View className={`p-2 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                                <User size={18} color={isDark ? '#f87171' : '#dc2626'} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.emergencyContactName') || 'Contact Name'}</Text>
                                                <Text className={`text-base font-medium ${colors.textColor}`}>{displayUser.emergency_contact_name}</Text>
                                            </View>
                                        </View>
                                    )}

                                    {displayUser.emergency_contact_phone && (
                                        <Pressable
                                            onPress={() => openUrl(`tel:${displayUser.emergency_contact_phone}`)}
                                            className="flex-row items-center gap-3 active:opacity-70"
                                        >
                                            <View className={`p-2 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                                <Phone size={18} color={isDark ? '#f87171' : '#dc2626'} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>{t('teachers.emergencyContactPhone') || 'Contact Phone'}</Text>
                                                <Text className={`text-base font-medium ${colors.textColor}`}>{displayUser.emergency_contact_phone}</Text>
                                            </View>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Social Media & Bio */}
                        {((displayUser?.linkedin_url || displayUser?.twitter_url) || displayUser?.bio) && (
                            <View className={`rounded-3xl p-5 ${colors.cardBgColor} border ${colors.borderColor}`}>
                                <Text className={`text-lg font-bold ${colors.textColor} mb-4`}>{t('common.additionalInfo') || 'Additional Info'}</Text>

                                <View className="gap-4">
                                    {(displayUser.linkedin_url || displayUser.twitter_url) && (
                                        <View className="gap-3">
                                            {displayUser.linkedin_url && (
                                                <Pressable onPress={() => openUrl(displayUser.linkedin_url)} className="flex-row items-center gap-3">
                                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                                                        <Globe size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>LinkedIn</Text>
                                                        <Text className={`text-sm font-medium ${colors.textColor}`} numberOfLines={1}>{displayUser.linkedin_url}</Text>
                                                    </View>
                                                </Pressable>
                                            )}
                                            {displayUser.twitter_url && (
                                                <Pressable onPress={() => openUrl(displayUser.twitter_url)} className="flex-row items-center gap-3">
                                                    <View className={`p-2 rounded-xl ${isDark ? 'bg-sky-500/20' : 'bg-sky-100'}`}>
                                                        <Globe size={18} color={isDark ? '#38bdf8' : '#0284c7'} />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text className={`text-xs ${colors.subTextColor} uppercase tracking-wider mb-0.5`}>Twitter</Text>
                                                        <Text className={`text-sm font-medium ${colors.textColor}`} numberOfLines={1}>{displayUser.twitter_url}</Text>
                                                    </View>
                                                </Pressable>
                                            )}
                                        </View>
                                    )}

                                    {displayUser.bio && (
                                        <View className="mt-2">
                                            <View className="flex-row items-center gap-2 mb-2">
                                                <FileText size={16} color={colors.accentColor} />
                                                <Text className={`text-sm font-bold ${colors.textColor}`}>{t('common.bio') || 'Bio'}</Text>
                                            </View>
                                            <Text className={`text-sm ${colors.subTextColor} leading-6`}>{displayUser.bio}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Logout Button */}
                        <Pressable
                            onPress={handleSignOut}
                            className={`flex-row items-center justify-center p-4 rounded-2xl border ${isDark ? 'bg-rose-900/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'} active:opacity-70 mb-6`}
                        >
                            <LogOut size={20} color="#f43f5e" />
                            <Text className="text-rose-500 font-bold ml-2 text-base">{t('settings.account.signOut', 'Sign Out')}</Text>
                        </Pressable>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
