import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, TextInput, Modal, Image } from 'react-native';
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
    Filter,
    Check,
    MoreVertical,
    Building,
    Users,
    Monitor,
    BookOpen,
    Dumbbell,
    Palette,
    Music,
    Box
} from 'lucide-react-native';

// --- Design System Constants ---
const getColors = (isDark: boolean) => {
    return {
        bgColors: isDark
            ? ['#0A0118', '#1A0B2E', '#2D1B4E'] as const
            : ['#F8FAFC', '#F1F5F9', '#E2E8F0'] as const,
        primary: isDark ? '#8B5CF6' : '#7C3AED',
        secondary: isDark ? '#EC4899' : '#DB2777',
        success: isDark ? '#10B981' : '#059669',
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/70' : 'text-gray-600',
        tertiaryTextColor: isDark ? 'text-white/50' : 'text-gray-500',
        iconColor: isDark ? '#fff' : '#1e293b',
        cardBg: isDark ? 'bg-white/10' : 'bg-white/70',
        cardBorder: isDark ? 'border-white/20' : 'border-white/50',
        inputBg: isDark ? 'bg-white/10' : 'bg-white/60',
        inputBorder: isDark ? 'border-white/20' : 'border-gray-200',
    };
};

const ROOM_TYPES = [
    'CLASSROOM', 'LAB', 'COMPUTER', 'LIBRARY', 'GYM', 'ART', 'MUSIC', 'OTHER'
];

// --- Filter Component ---
const FilterDrawer = ({ visible, onClose, filters, onApply, isDark, t }: any) => {
    const colors = getColors(isDark);
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => { setLocalFilters(filters); }, [filters]);

    const handleApply = () => { onApply(localFilters); onClose(); };
    const handleClear = () => { setLocalFilters({ type: 'all' }); };

    const FilterSection = ({ title, children }: any) => (
        <View className="mb-6">
            <Text className={`text-sm font-bold ${colors.textColor} mb-3`}>{title}</Text>
            {children}
        </View>
    );

    const Chip = ({ label, isActive, onPress }: any) => (
        <Pressable
            onPress={onPress}
            className="flex-row items-center px-4 py-3 rounded-xl mr-3 mb-3 border"
            style={{
                backgroundColor: isActive ? colors.primary : (isDark ? '#ffffff10' : '#00000005'),
                borderColor: isActive ? 'transparent' : (isDark ? '#ffffff20' : '#00000010'),
            }}
        >
            {isActive && <Check size={16} color="#fff" style={{ marginRight: 8 }} />}
            <Text className={`text-sm font-semibold ${isActive ? 'text-white' : colors.textColor}`}>
                {label}
            </Text>
        </Pressable>
    );

    const getRoomTypeLabel = (type: string) => {
        const key = type.toLowerCase();
        return t(`rooms.types.${key}`);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Pressable className="flex-1" onPress={onClose} />
                <View className={`rounded-t-3xl pt-2 pb-8 ${isDark ? 'bg-[#1A0B2E]' : 'bg-white'}`} style={{ maxHeight: '80%' }}>
                    <View className="items-center py-3">
                        <View className={`w-12 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
                    </View>
                    <View className="flex-row items-center justify-between px-6 pb-4 border-b" style={{ borderBottomColor: isDark ? '#ffffff20' : '#00000010' }}>
                        <Text className={`text-2xl font-bold ${colors.textColor}`}>{t('common.filters')}</Text>
                        <Pressable onPress={onClose} className="w-10 h-10 items-center justify-center rounded-xl bg-white/5">
                            <X size={24} color={colors.iconColor} />
                        </Pressable>
                    </View>
                    <ScrollView className="px-6 pt-6">
                        <FilterSection title={t('rooms.filterType') || 'Room Type'}>
                            <View className="flex-row flex-wrap">
                                <Chip
                                    label={t('common.all')}
                                    isActive={localFilters.type === 'all'}
                                    onPress={() => setLocalFilters({ ...localFilters, type: 'all' })}
                                />
                                {ROOM_TYPES.map(type => (
                                    <Chip
                                        key={type}
                                        label={getRoomTypeLabel(type)}
                                        isActive={localFilters.type === type}
                                        onPress={() => setLocalFilters({ ...localFilters, type })}
                                    />
                                ))}
                            </View>
                        </FilterSection>
                    </ScrollView>
                    <View className="px-6 pt-4 flex-row gap-3 border-t" style={{ borderColor: isDark ? '#ffffff20' : '#00000010' }}>
                        <Pressable onPress={handleClear} className="flex-1 py-3.5 rounded-xl items-center justify-center border" style={{ borderColor: isDark ? '#ffffff30' : '#00000020' }}>
                            <Text className={`font-bold ${colors.textColor}`}>{t('common.clearAll')}</Text>
                        </Pressable>
                        <Pressable onPress={handleApply} className="flex-1 py-3.5 rounded-xl items-center justify-center" style={{ backgroundColor: colors.primary }}>
                            <Text className="font-bold text-white">{t('common.apply')}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// --- Main Page Component ---
export default function RoomsPage() {
    const { t } = useTranslation();
    const { actualTheme } = useTheme();
    const router = useRouter();
    const isDark = actualTheme === 'dark';
    const colors = getColors(isDark);

    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ type: 'all' });
    const [filterVisible, setFilterVisible] = useState(false);
    const [stats, setStats] = useState({ total: 0, capacity: 0, classrooms: 0 });

    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/schools/rooms/');
            const data = res.data?.results || res.data || [];

            // Calculate stats locally
            const total = data.length;
            const capacity = data.reduce((acc: number, r: any) => acc + (r.capacity || 0), 0);
            const classrooms = data.filter((r: any) => r.room_type === 'CLASSROOM').length;

            setRooms(data);
            setStats({ total, capacity, classrooms });
        } catch (err: any) {
            console.error('Fetch Rooms Error:', err);
            setError(t('error.failedToLoadData') || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [t]);

    useFocusEffect(useCallback(() => { fetchRooms(); }, [fetchRooms]));

    const filteredRooms = React.useMemo(() => {
        return rooms.filter(room => {
            const matchesSearch =
                room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filters.type === 'all' || room.room_type === filters.type;
            return matchesSearch && matchesType;
        });
    }, [rooms, searchQuery, filters]);

    // Helpers
    const getRoomIcon = (type: string) => {
        switch (type) {
            case 'CLASSROOM': return <Building size={24} color={colors.primary} />;
            case 'LAB': return <Dumbbell size={24} color={colors.secondary} />;
            case 'COMPUTER': return <Monitor size={24} color="#3B82F6" />;
            case 'LIBRARY': return <BookOpen size={24} color="#F59E0B" />;
            case 'GYM': return <Dumbbell size={24} color="#EF4444" />;
            case 'ART': return <Palette size={24} color="#EC4899" />;
            case 'MUSIC': return <Music size={24} color="#8B5CF6" />;
            default: return <Box size={24} color={colors.subTextColor} />;
        }
    };

    const getRoomTypeLabel = (type: string) => {
        const key = type.toLowerCase();
        return t(`rooms.types.${key}`);
    };

    const RoomCard = ({ room }: { room: any }) => (
        <Pressable
            onPress={() => router.push(`/school/rooms/${room.id}`)}
            className={`w-[48%] rounded-2xl mb-4 overflow-hidden ${colors.cardBg} border ${colors.cardBorder} active:opacity-80`}
        >
            {/* Image Section - Height 32 (128px) */}
            <View className={`h-32 w-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} items-center justify-center`}>
                {room.featured_image?.url ? (
                    <Image source={{ uri: room.featured_image.url }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <View className="items-center justify-center">
                        {getRoomIcon(room.room_type)}
                    </View>
                )}
                {/* Menu Button Overlay */}
                <View className="absolute top-2 right-2 flex-row gap-2">
                    <Pressable className={`p-1.5 rounded-full ${isDark ? 'bg-black/40' : 'bg-white/80'}`}>
                        <MoreVertical size={16} color={isDark ? '#fff' : '#000'} />
                    </Pressable>
                </View>
            </View>

            {/* Content Section */}
            <View className="p-3">
                <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-2">
                        <Text className={`text-base font-bold ${colors.textColor} leading-tight`} numberOfLines={1}>{room.name}</Text>
                        <Text className={`text-xs ${colors.subTextColor} mt-0.5`}>{room.code || 'No Code'}</Text>
                    </View>
                </View>

                {/* Tags/Badges */}
                <View className="flex-row flex-wrap gap-1 mb-3">
                    <View className={`px-2 py-0.5 rounded-md ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                        <Text className={`text-[10px] font-medium ${colors.textColor}`}>{getRoomTypeLabel(room.room_type)}</Text>
                    </View>
                </View>

                {/* Footer Info */}
                <View className="flex-row items-center justify-between mt-auto">
                    <View className="flex-row items-center gap-1">
                        <Users size={12} color={isDark ? '#fff' : '#64748b'} />
                        <Text className={`text-xs font-bold ${colors.textColor}`}>{room.capacity}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View className="flex-1">
            <LinearGradient colors={colors.bgColors} className="absolute inset-0" />
            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />

                {/* Header */}
                <View className="px-6 pt-4 pb-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Pressable onPress={() => router.back()} className={`w-10 h-10 items-center justify-center rounded-full border ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-100'}`}>
                            <ChevronLeft size={24} color={colors.iconColor} />
                        </Pressable>
                        <Text className={`text-xl font-bold ${colors.textColor}`}>{t('rooms.title')}</Text>
                        <Pressable className={`w-10 h-10 items-center justify-center rounded-full ${colors.primary}`} style={{ backgroundColor: colors.primary }}>
                            <Plus size={24} color="#fff" />
                        </Pressable>
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row gap-3 mb-4">
                        <View className={`flex-1 p-3 rounded-xl ${colors.cardBg} border ${colors.cardBorder}`}>
                            <Text className={`text-xs ${colors.subTextColor}`}>{t('rooms.stats.total')}</Text>
                            <Text className={`text-xl font-bold ${colors.textColor}`}>{stats.total}</Text>
                        </View>
                        <View className={`flex-1 p-3 rounded-xl ${colors.cardBg} border ${colors.cardBorder}`}>
                            <Text className={`text-xs ${colors.subTextColor}`}>{t('rooms.stats.capacity')}</Text>
                            <Text className={`text-xl font-bold ${colors.textColor}`}>{stats.capacity}</Text>
                        </View>
                        <View className={`flex-1 p-3 rounded-xl ${colors.cardBg} border ${colors.cardBorder}`}>
                            <Text className={`text-xs ${colors.subTextColor}`}>{t('rooms.stats.classrooms')}</Text>
                            <Text className={`text-xl font-bold ${colors.textColor}`}>{stats.classrooms}</Text>
                        </View>
                    </View>

                    {/* Search & Filter */}
                    <View className="flex-row gap-3">
                        <View className={`flex-1 flex-row items-center px-4 h-12 rounded-xl border ${colors.inputBg} ${colors.inputBorder}`}>
                            <Search size={20} color={colors.subTextColor.replace('text-', '').replace('/70', '')} />
                            <TextInput
                                placeholder={t('rooms.search')}
                                placeholderTextColor={isDark ? '#ffffff50' : '#94a3b8'}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                className={`flex-1 ml-3 h-full ${colors.textColor}`}
                            />
                        </View>
                        <Pressable
                            onPress={() => setFilterVisible(true)}
                            className={`w-12 h-12 items-center justify-center rounded-xl border ${filters.type !== 'all' ? `bg-${colors.primary} border-transparent` : `${colors.inputBg} ${colors.inputBorder}`}`}
                            style={{ backgroundColor: filters.type !== 'all' ? colors.primary : undefined }}
                        >
                            <Filter size={20} color={filters.type !== 'all' ? '#fff' : colors.iconColor} />
                        </Pressable>
                    </View>
                </View>

                {/* Content */}
                <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} className="mt-10" />
                    ) : error ? (
                        <View className="items-center justify-center mt-10">
                            <Text className={`text-center ${colors.secondary} mb-2`}>{error}</Text>
                            <Pressable onPress={() => fetchRooms()} className={`px-4 py-2 rounded-lg ${colors.primary}`} style={{ backgroundColor: colors.primary }}>
                                <Text className="text-white font-bold">{t('common.retry') || 'Retry'}</Text>
                            </Pressable>
                        </View>
                    ) : filteredRooms.length > 0 ? (
                        <View className="flex-row flex-wrap justify-between">
                            {filteredRooms.map(room => <RoomCard key={room.id} room={room} />)}
                        </View>
                    ) : (
                        <View className="items-center justify-center mt-20 w-full">
                            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                                <Building size={32} color={colors.subTextColor.replace('text-', '').replace('/70', '')} />
                            </View>
                            <Text className={`text-lg font-bold ${colors.textColor}`}>{t('rooms.noRooms')}</Text>
                        </View>
                    )}
                </ScrollView>

                <FilterDrawer
                    visible={filterVisible}
                    onClose={() => setFilterVisible(false)}
                    filters={filters}
                    onApply={setFilters}
                    isDark={isDark}
                    t={t}
                />
            </SafeAreaView>
        </View>
    );
}
