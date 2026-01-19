import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../api/client';
import {
    ChevronLeft,
    Search,
    Plus,
    X,
    GraduationCap,
    School,
    Filter,
    Check,
    MoreVertical
} from 'lucide-react-native';
import StudentStats from '../../../components/StudentStats';

// Premium colors following the redesign guidelines
const getColors = (isDark: boolean) => {
    return {
        // Enhanced gradient backgrounds
        bgColors: isDark
            ? ['#0A0118', '#1A0B2E', '#2D1B4E'] as const // Deep Purple Gradient
            : ['#F8FAFC', '#F1F5F9', '#E2E8F0'] as const, // Soft Gray-Blue

        // Brand colors
        primary: isDark ? '#8B5CF6' : '#7C3AED', // Vibrant Purple
        secondary: isDark ? '#EC4899' : '#DB2777', // Energetic Pink
        success: isDark ? '#10B981' : '#059669', // Fresh Green

        // Text colors
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/70' : 'text-gray-600',
        tertiaryTextColor: isDark ? 'text-white/50' : 'text-gray-500',
        iconColor: isDark ? '#fff' : '#1e293b',

        // Card styles - Enhanced glassmorphism
        cardBg: isDark ? 'bg-white/10' : 'bg-white/70',
        cardBorder: isDark ? 'border-white/20' : 'border-white/50',

        // Input styles
        inputBg: isDark ? 'bg-white/10' : 'bg-white/60',
        inputBorder: isDark ? 'border-white/20' : 'border-gray-200',
    };
};

// Modern Tab Switcher Component
const ModernTabSwitcher = ({ activeTab, onTabChange, isDark, textColor }: any) => {
    const colors = getColors(isDark);
    const { t } = useTranslation();

    return (
        <View className="flex-row gap-2 mt-4">
            <Pressable
                onPress={() => onTabChange('Overview')}
                className={`flex-1 py-3 rounded-2xl items-center justify-center ${activeTab === 'Overview' ? '' : 'border'}`}
                style={{
                    backgroundColor: activeTab === 'Overview' ? colors.primary : 'transparent',
                    borderColor: colors.inputBorder,
                }}
            >
                <Text className={`font-bold ${activeTab === 'Overview' ? 'text-white' : textColor}`}>
                    {t('tabs.overview') || 'Overview'}
                </Text>
            </Pressable>
            <Pressable
                onPress={() => onTabChange('Students')}
                className={`flex-1 py-3 rounded-2xl items-center justify-center ${activeTab === 'Students' ? '' : 'border'}`}
                style={{
                    backgroundColor: activeTab === 'Students' ? colors.primary : 'transparent',
                    borderColor: colors.inputBorder,
                }}
            >
                <Text className={`font-bold ${activeTab === 'Students' ? 'text-white' : textColor}`}>
                    {t('tabs.students') || 'Students'}
                </Text>
            </Pressable>
        </View>
    );
};

// Modern Filter Drawer Component
const FilterDrawer = ({ visible, onClose, filters, onApply, isDark, levels, grades, classes, t, isRTL, getLocalizedName }: any) => {
    const colors = getColors(isDark);
    const [localFilters, setLocalFilters] = useState(filters);
    const [localGrades, setLocalGrades] = useState(grades);
    const [localClasses, setLocalClasses] = useState(classes);
    const [loadingGrades, setLoadingGrades] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    useEffect(() => {
        setLocalGrades(grades);
    }, [grades]);

    useEffect(() => {
        setLocalClasses(classes);
    }, [classes]);

    // Fetch grades when level changes
    useEffect(() => {
        if (!localFilters.selectedLevel) {
            setLocalGrades([]);
            return;
        }

        const fetchGrades = async () => {
            setLoadingGrades(true);
            try {
                const res = await api.get(`/schools/grades/?educational_level=${localFilters.selectedLevel}`);
                setLocalGrades(res.data?.results || res.data || []);
            } catch (err) {
                console.error("Failed to fetch grades in filter", err);
                setLocalGrades([]);
            } finally {
                setLoadingGrades(false);
            }
        };
        fetchGrades();
    }, [localFilters.selectedLevel]);

    // Fetch classes when grade changes
    useEffect(() => {
        if (!localFilters.selectedGrade) {
            setLocalClasses([]);
            return;
        }

        const fetchClasses = async () => {
            setLoadingClasses(true);
            try {
                const res = await api.get(`/schools/classes/?grade=${localFilters.selectedGrade}`);
                setLocalClasses(res.data?.results || res.data || []);
            } catch (err) {
                console.error("Failed to fetch classes in filter", err);
                setLocalClasses([]);
            } finally {
                setLoadingClasses(false);
            }
        };
        fetchClasses();
    }, [localFilters.selectedGrade]);

    const FilterSection = ({ title, children }: any) => (
        <View className="mb-6">
            <Text className={`text-sm font-bold ${colors.textColor} mb-3`}>{title}</Text>
            {children}
        </View>
    );

    const StatusChip = ({ label, isActive, onPress }: any) => (
        <Pressable
            onPress={onPress}
            className="flex-row items-center px-4 py-3 rounded-xl mr-3 mb-3"
            style={{
                backgroundColor: isActive ? colors.primary : (isDark ? '#ffffff10' : '#00000005'),
                borderWidth: 1,
                borderColor: isActive ? 'transparent' : (isDark ? '#ffffff20' : '#00000010'),
            }}
        >
            {isActive && <Check size={16} color="#fff" style={{ marginRight: 8 }} />}
            <Text className={`text-sm font-semibold ${isActive ? 'text-white' : colors.textColor}`}>
                {label}
            </Text>
        </Pressable>
    );

    const activeCount = [
        localFilters.statusFilter !== 'all' ? 1 : 0,
        localFilters.selectedLevel ? 1 : 0,
        localFilters.selectedGrade ? 1 : 0,
        localFilters.selectedClass ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const handleClearAll = () => {
        const clearedFilters = {
            statusFilter: 'all',
            selectedLevel: null,
            selectedGrade: null,
            selectedClass: null,
        };
        setLocalFilters(clearedFilters);
        setLocalGrades([]);
        setLocalClasses([]);
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Pressable className="flex-1" onPress={onClose} />
                <View
                    className={`rounded-t-3xl pt-2 pb-8 ${isDark ? 'bg-[#1A0B2E]' : 'bg-white'} border-t border-x ${isDark ? 'border-white/10' : 'border-black/5'}`}
                    style={{
                        maxHeight: '80%',
                        // No shadows - Flat Drawer
                    }}
                >
                    {/* Handle Bar */}
                    <View className="items-center py-3">
                        <View className={`w-12 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
                    </View>

                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 pb-4 border-b" style={{ borderBottomColor: isDark ? '#ffffff20' : '#00000010' }}>
                        <View>
                            <Text className={`text-2xl font-bold ${colors.textColor}`}>
                                {t('common.filters') || 'Filters'}
                            </Text>
                            {activeCount > 0 && (
                                <Text className={`text-xs ${colors.tertiaryTextColor} mt-0.5`}>
                                    {activeCount} {t('common.active') || 'active'}
                                </Text>
                            )}
                        </View>
                        <Pressable onPress={onClose} className="w-10 h-10 items-center justify-center rounded-xl bg-white/5">
                            <X size={24} color={colors.iconColor} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Status Filter */}
                        <FilterSection title={t('common.status') || 'Status'}>
                            <View className="flex-row flex-wrap">
                                <StatusChip
                                    label={t('common.all') || 'All'}
                                    isActive={localFilters.statusFilter === 'all'}
                                    onPress={() => setLocalFilters({ ...localFilters, statusFilter: 'all' })}
                                />
                                <StatusChip
                                    label={t('status.active') || 'Active'}
                                    isActive={localFilters.statusFilter === 'active'}
                                    onPress={() => setLocalFilters({ ...localFilters, statusFilter: 'active' })}
                                />
                                <StatusChip
                                    label={t('status.inactive') || 'Inactive'}
                                    isActive={localFilters.statusFilter === 'inactive'}
                                    onPress={() => setLocalFilters({ ...localFilters, statusFilter: 'inactive' })}
                                />
                            </View>
                        </FilterSection>

                        {/* Level Filter */}
                        <FilterSection title={t('common.level') || 'Educational Level'}>
                            <View className="flex-row flex-wrap">
                                <StatusChip
                                    label={t('common.all') || 'All'}
                                    isActive={!localFilters.selectedLevel}
                                    onPress={() => setLocalFilters({ ...localFilters, selectedLevel: null, selectedGrade: null, selectedClass: null })}
                                />
                                {levels.map((level: any) => (
                                    <StatusChip
                                        key={level.id}
                                        label={getLocalizedName(level)}
                                        isActive={localFilters.selectedLevel === level.id.toString()}
                                        onPress={() => setLocalFilters({ ...localFilters, selectedLevel: level.id.toString(), selectedGrade: null, selectedClass: null })}
                                    />
                                ))}
                            </View>
                        </FilterSection>

                        {/* Grade Filter (Only show if Level selected) */}
                        {localFilters.selectedLevel && (
                            <FilterSection title={t('common.grade') || 'Grade'}>
                                {loadingGrades ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : localGrades.length > 0 ? (
                                    <View className="flex-row flex-wrap">
                                        <StatusChip
                                            label={t('common.all') || 'All'}
                                            isActive={!localFilters.selectedGrade}
                                            onPress={() => setLocalFilters({ ...localFilters, selectedGrade: null, selectedClass: null })}
                                        />
                                        {localGrades.map((grade: any) => (
                                            <StatusChip
                                                key={grade.id}
                                                label={getLocalizedName(grade)}
                                                isActive={localFilters.selectedGrade === grade.id.toString()}
                                                onPress={() => setLocalFilters({ ...localFilters, selectedGrade: grade.id.toString(), selectedClass: null })}
                                            />
                                        ))}
                                    </View>
                                ) : (
                                    <Text className={`text-xs ${colors.tertiaryTextColor}`}>
                                        {t('common.noResults') || 'No grades found'}
                                    </Text>
                                )}
                            </FilterSection>
                        )}

                        {/* Class Filter (Only show if Grade selected) */}
                        {localFilters.selectedGrade && (
                            <FilterSection title={t('common.class') || 'Class'}>
                                {loadingClasses ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : localClasses.length > 0 ? (
                                    <View className="flex-row flex-wrap">
                                        <StatusChip
                                            label={t('common.all') || 'All'}
                                            isActive={!localFilters.selectedClass}
                                            onPress={() => setLocalFilters({ ...localFilters, selectedClass: null })}
                                        />
                                        {localClasses.map((cls: any) => (
                                            <StatusChip
                                                key={cls.id}
                                                label={cls.name}
                                                isActive={localFilters.selectedClass === cls.id.toString()}
                                                onPress={() => setLocalFilters({ ...localFilters, selectedClass: cls.id.toString() })}
                                            />
                                        ))}
                                    </View>
                                ) : (
                                    <Text className={`text-xs ${colors.tertiaryTextColor}`}>
                                        {t('common.noResults') || 'No classes found'}
                                    </Text>
                                )}
                            </FilterSection>
                        )}

                        <View className="h-4" />
                    </ScrollView>

                    {/* Footer Actions */}
                    <View className="px-6 pt-4 flex-row gap-3" style={{ borderTopWidth: 1, borderTopColor: isDark ? '#ffffff20' : '#00000010' }}>
                        <Pressable
                            onPress={handleClearAll}
                            className="flex-1 py-3.5 rounded-xl items-center justify-center border"
                            style={{ borderColor: isDark ? '#ffffff30' : '#00000020' }}
                        >
                            <Text className={`font-bold ${colors.textColor}`}>
                                {t('common.clearAll') || 'Clear All'}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={handleApply}
                            className="flex-1 py-3.5 rounded-xl items-center justify-center"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <Text className="font-bold text-white">
                                {t('common.apply') || 'Apply'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default function StudentsPage() {
    const { t, i18n } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const isRTL = i18n.language === 'ar';
    const colors = getColors(isDark);
    const { bgColors, textColor, subTextColor, tertiaryTextColor, iconColor, primary, secondary, success } = colors;

    // Tab State
    const [activeTab, setActiveTab] = useState<'Overview' | 'Students'>('Overview');

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [enrollments, setEnrollments] = useState<any[]>([]);

    // Structure Data
    const [levels, setLevels] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    // Filter Drawer State
    const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // Helper to count active filters
    const activeFilterCount = [
        statusFilter !== 'all' ? 1 : 0,
        selectedLevel ? 1 : 0,
        selectedGrade ? 1 : 0,
        selectedClass ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    // Load Initial Data (Students & Levels)
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Stats (Overview)
            api.get('/users/enrollments/stats/')
                .then(res => {
                    setStats(res.data);
                    setStatsLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch stats:', err);
                    setStatsLoading(false);
                });

            // 2. Fetch Students List (Default Page) 
            // 3. Fetch Levels
            const [studentsRes, levelsRes] = await Promise.all([
                api.get('/users/enrollments/'),
                api.get('/schools/levels/')
            ]);

            setEnrollments(studentsRes.data?.results || studentsRes.data || []);
            setLevels(levelsRes.data?.results || levelsRes.data || []);

        } catch (err: any) {
            console.error('Failed to fetch data:', err);
            setError(t('error.failedToLoadData') || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    // Cascading Fetch: Fetch Grades when Level changes
    useEffect(() => {
        if (!selectedLevel) {
            setGrades([]);
            setSelectedGrade(null);
            return;
        }
        const fetchGrades = async () => {
            try {
                const res = await api.get(`/schools/grades/?educational_level=${selectedLevel}`);
                setGrades(res.data?.results || res.data || []);
                setSelectedGrade(null); // Reset grade selection
            } catch (err) {
                console.error("Failed to fetch grades", err);
            }
        };
        fetchGrades();
    }, [selectedLevel]);

    // Cascading Fetch: Fetch Classes when Grade changes
    useEffect(() => {
        if (!selectedGrade) {
            setClasses([]);
            setSelectedClass(null);
            return;
        }
        const fetchClasses = async () => {
            try {
                const res = await api.get(`/schools/classes/?grade=${selectedGrade}`);
                setClasses(res.data?.results || res.data || []);
                setSelectedClass(null); // Reset class selection
            } catch (err) {
                console.error("Failed to fetch classes", err);
            }
        };
        fetchClasses();
    }, [selectedGrade]);

    // Computed Filtered Results
    const filteredEnrollments = React.useMemo(() => {
        if (!enrollments) return [];

        let result = enrollments;

        // 1. Class Filter - Filter by the actual class ID
        // Note: Level and Grade filters are for the FilterDrawer UI organization only
        // The actual filtering happens by class since students are enrolled in specific classes
        if (selectedClass) {
            result = result.filter(item => {
                // school_class is the class ID field in the enrollment data
                const classId = item.school_class?.toString() || item.class_id?.toString();
                return classId === selectedClass;
            });
        }

        // 2. Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(item =>
                statusFilter === 'active' ? item.is_active : !item.is_active
            );
        }

        // 3. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(item => {
                const student = item.student;
                const className = item.school_class_name || '';
                const studentNumber = item.student_number || '';

                const searchableFields = [
                    student.first_name,
                    student.last_name,
                    student.ar_first_name,
                    student.ar_last_name,
                    student.email,
                    student.phone,
                    className,
                    studentNumber
                ].filter(Boolean).join(' ').toLowerCase();
                return searchableFields.includes(query);
            });
        }

        return result;
    }, [enrollments, selectedClass, statusFilter, searchQuery]);

    // Helper to get localized name from database objects (levels, grades, subjects, etc.)
    const getLocalizedName = (obj: any) => {
        if (!obj) return '';

        // For Arabic
        if (isRTL && obj.name_arabic) {
            return obj.name_arabic;
        }

        // For French
        if (i18n.language === 'fr' && obj.name_french) {
            return obj.name_french;
        }

        // Default to English/base name
        return obj.name || '';
    };

    // Helper to get display name with RTL support for students
    const getDisplayName = (student: any) => {
        if (!student) return '';

        // For Arabic - use ar_first_name and ar_last_name from profile
        if (isRTL && (student.ar_first_name || student.ar_last_name)) {
            return `${student.ar_first_name || ''} ${student.ar_last_name || ''}`.trim();
        }

        // For French/English - use first_name and last_name
        return student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
    };

    const StudentCard = ({ enrollment }: { enrollment: any }) => {
        const student = enrollment.student;
        if (!student) return null;

        return (
            <Pressable
                onPress={() => router.push(`/(admin)/school/students/${student.id}` as any)} // Navigate to profile
                className={`rounded-2xl p-4 mb-3 ${colors.cardBg} border ${colors.cardBorder} active:opacity-80`}
            // Flat Card - No Shadow
            >
                <View className="flex-row items-center gap-3">
                    {/* Leading: Avatar with Gradient Border */}
                    <View className="relative">
                        <LinearGradient
                            colors={[primary, secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="h-12 w-12 rounded-full items-center justify-center p-[2px]"
                        >
                            <View className={`h-full w-full rounded-full ${isDark ? 'bg-[#1A0B2E]' : 'bg-white'} items-center justify-center overflow-hidden`}>
                                {student.profile_picture_url ? (
                                    <Image source={{ uri: student.profile_picture_url }} className="h-full w-full" resizeMode="cover" />
                                ) : (
                                    <Text className="text-sm font-bold" style={{ color: primary }}>
                                        {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                                    </Text>
                                )}
                            </View>
                        </LinearGradient>
                        {/* Compact Status Dot */}
                        <View
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-[#1A0B2E]' : 'border-white'}`}
                            style={{ backgroundColor: enrollment.is_active ? success : '#9CA3AF' }}
                        />
                    </View>

                    {/* Center: Info */}
                    <View className="flex-1">
                        <Text className={`text-base font-bold ${textColor} leading-snug`} numberOfLines={1}>
                            {getDisplayName(student)}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-1">
                            <View className="flex-row items-center gap-1">
                                <School size={11} color={isDark ? '#A78BFA' : '#7C3AED'} />
                                <Text className={`text-xs ${subTextColor}`} numberOfLines={1}>
                                    {enrollment.school_class_name || t('common.noClass') || 'N/A'}
                                </Text>
                            </View>
                            {enrollment.student_number && (
                                <>
                                    <Text className={`text-xs ${tertiaryTextColor}`}>•</Text>
                                    <Text className={`text-xs ${tertiaryTextColor}`}>#{enrollment.student_number}</Text>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Trailing: Menu */}
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            // Open menu
                        }}
                        className="w-8 h-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: isDark ? '#ffffff10' : '#00000005' }}
                    >
                        <MoreVertical size={18} color={isDark ? '#ffffff80' : '#00000080'} />
                    </Pressable>
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1">
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
            />
            {isDark && <View className="absolute inset-0 bg-black/10" />}

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Enhanced Header */}
                <View className="px-6 pt-4 pb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <Pressable
                            onPress={() => router.back()}
                            className={`w-12 h-12 items-center justify-center rounded-2xl ${colors.cardBg} border ${colors.cardBorder} active:opacity-70`}
                        // Flat Button
                        >
                            <ChevronLeft size={24} color={iconColor} />
                        </Pressable>
                        <View className="flex-1 items-center">
                            <Text className={`${textColor} text-2xl font-bold tracking-wide`}>
                                {t('admin.school.modules.students') || 'Students'}
                            </Text>
                            <Text className={`${tertiaryTextColor} text-xs mt-0.5`}>
                                {t('students.subtitle') || 'Manage your student roster'}
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => { }}
                            className="w-12 h-12 items-center justify-center rounded-2xl border active:opacity-70"
                            style={{
                                backgroundColor: isDark ? primary : primary,
                                borderColor: 'transparent',
                                // Flat Button
                            }}
                        >
                            <Plus size={24} color="#fff" />
                        </Pressable>
                    </View>

                    {/* Modern Tab Switcher */}
                    <ModernTabSwitcher
                        activeTab={activeTab}
                        onTabChange={(tab: string) => setActiveTab(tab as 'Overview' | 'Students')}
                        isDark={isDark}
                        textColor={textColor}
                    />
                </View>

                {/* Content */}
                {loading && !enrollments.length ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={isDark ? "#fff" : "#2563eb"} />
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center px-6">
                        <Text className="text-red-500 text-center mb-4">{error}</Text>
                        <Pressable onPress={fetchData} className="bg-blue-600 px-6 py-2 rounded-full">
                            <Text className="text-white font-bold">Try Again</Text>
                        </Pressable>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1 px-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    >
                        {activeTab === 'Overview' ? (
                            statsLoading ? (
                                <ActivityIndicator size="small" color={isDark ? "#fff" : "#2563eb"} className="mt-10" />
                            ) : stats ? (
                                <StudentStats stats={stats} isDark={isDark} />
                            ) : (
                                <Text className={`text-center mt-10 ${textColor}`}>Failed to load statistics</Text>
                            )
                        ) : (
                            <View>
                                {/* Clean Search + Filter Bar */}
                                <View className="flex-row items-center gap-3 mb-4">
                                    {/* Enhanced Search Bar */}
                                    <View className={`flex-1 flex-row items-center px-5 h-14 rounded-2xl border ${colors.inputBorder} ${colors.inputBg}`}
                                    // Flat Input
                                    >
                                        <Search size={20} color={isDark ? '#A78BFA' : '#7C3AED'} />
                                        <TextInput
                                            placeholder={t('common.search') || "Search students..."}
                                            placeholderTextColor={isDark ? '#ffffff60' : '#00000060'}
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            className={`flex-1 ml-3 text-base ${textColor} h-full`}
                                            style={{ textAlign: isRTL ? 'right' : 'left' }}
                                        />
                                        {searchQuery.length > 0 && (
                                            <Pressable
                                                onPress={() => setSearchQuery('')}
                                                className="w-6 h-6 rounded-full items-center justify-center bg-white/10"
                                            >
                                                <X size={14} color={isDark ? '#fff' : '#000'} />
                                            </Pressable>
                                        )}
                                    </View>

                                    {/* Filter Button with Badge */}
                                    <Pressable
                                        onPress={() => setFilterDrawerVisible(true)}
                                        className="relative w-14 h-14 items-center justify-center rounded-2xl border"
                                        style={{
                                            backgroundColor: activeFilterCount > 0 ? primary : colors.inputBg,
                                            borderColor: activeFilterCount > 0 ? 'transparent' : colors.inputBorder,
                                            // Flat Filter Button
                                        }}
                                    >
                                        <Filter size={22} color={activeFilterCount > 0 ? '#fff' : (isDark ? '#A78BFA' : '#7C3AED')} />
                                        {activeFilterCount > 0 && (
                                            <View
                                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                                                style={{ backgroundColor: secondary }}
                                            >
                                                <Text className="text-white text-xs font-bold">{activeFilterCount}</Text>
                                            </View>
                                        )}
                                    </Pressable>
                                </View>

                                {/* Results List */}
                                {filteredEnrollments.length > 0 ? (
                                    filteredEnrollments.map((enrollment, index) => (
                                        <StudentCard key={enrollment.id || index} enrollment={enrollment} />
                                    ))
                                ) : (
                                    <View className="py-20 items-center justify-center opacity-60">
                                        <GraduationCap size={48} color={isDark ? '#fff' : '#000'} />
                                        <Text className={`mt-4 text-center ${textColor}`}>
                                            {t('common.noResults') || "No students found"}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>

            {/* Filter Drawer Modal */}
            <FilterDrawer
                visible={filterDrawerVisible}
                onClose={() => setFilterDrawerVisible(false)}
                filters={{ statusFilter, selectedLevel, selectedGrade, selectedClass }}
                onApply={(newFilters: any) => {
                    setStatusFilter(newFilters.statusFilter);
                    setSelectedLevel(newFilters.selectedLevel);
                    setSelectedGrade(newFilters.selectedGrade);
                    setSelectedClass(newFilters.selectedClass);
                }}
                isDark={isDark}
                levels={levels}
                grades={grades}
                classes={classes}
                t={t}
                isRTL={isRTL}
                getLocalizedName={getLocalizedName}
            />
        </View>
    );
}
