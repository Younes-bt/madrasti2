import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../context/ThemeContext';
import api from '../../../../api/client';
import {
    ChevronLeft,
    Building,
    MapPin,
    Users,
    Package,
    Monitor,
    BookOpen,
    Dumbbell,
    Palette,
    Music,
    Box,
    AlertCircle,
    X,
    Image as IconImage,
    Star,
    Trash,
    MoreVertical,
    Plus
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function RoomDetailPage() {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const router = useRouter();
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';

    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState<any>(null);
    const [images, setImages] = useState<any[]>([]);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [equipmentLoading, setEquipmentLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Design Colors ---
    const colors = {
        bgColors: isDark ? ['#0F0529', '#2E1065', '#0F0529'] as const : ['#F8FAFC', '#F1F5F9', '#E2E8F0'] as const,
        primary: isDark ? '#A78BFA' : '#7C3AED',
        secondary: isDark ? '#F472B6' : '#DB2777',
        textColor: isDark ? 'text-white' : 'text-gray-900',
        subTextColor: isDark ? 'text-white/60' : 'text-gray-500',
        cardBg: isDark ? 'bg-white/5' : 'bg-white/70',
        cardBorder: isDark ? 'border-white/10' : 'border-white/50',
        glassInput: isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200',
    };

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Room Details
            const roomRes = await api.get(`/schools/rooms/${id}/`);
            setRoom(roomRes.data);

            // 2. Fetch Images
            const mediaRes = await api.get(`/schools/rooms/${id}/media/`);
            // Handle pagination or direct array
            const mediaList = Array.isArray(mediaRes.data) ? mediaRes.data : mediaRes.data?.results || [];
            setImages(mediaList);

            // 3. Fetch Equipment
            setEquipmentLoading(true);
            const eqRes = await api.get('/schools/equipment/', { params: { room: id } });
            const eqList = Array.isArray(eqRes.data) ? eqRes.data : eqRes.data?.results || [];
            setEquipment(eqList);

        } catch (err: any) {
            console.error(err);
            setError(t('error.failedToLoadData') || 'Failed to load data');
        } finally {
            setLoading(false);
            setEquipmentLoading(false);
        }
    }, [id, t]);

    useEffect(() => {
        if (id) fetchDetail();
    }, [id, fetchDetail]);

    // Helper: Room Icon
    const getRoomIcon = (type: string, size = 32) => {
        const iconColor = isDark ? '#D8B4FE' : '#7C3AED'; // Softer purple for dark mode
        switch (type) {
            case 'CLASSROOM': return <Building size={size} color={iconColor} />;
            case 'LAB': return <Dumbbell size={size} color={iconColor} />;
            case 'COMPUTER': return <Monitor size={size} color={iconColor} />;
            case 'LIBRARY': return <BookOpen size={size} color={iconColor} />;
            case 'GYM': return <Dumbbell size={size} color={iconColor} />;
            case 'ART': return <Palette size={size} color={iconColor} />;
            case 'MUSIC': return <Music size={size} color={iconColor} />;
            default: return <Box size={size} color={iconColor} />;
        }
    };

    // Helper: Room Type Label
    const getRoomTypeLabel = (type: string) => {
        const key = type?.toLowerCase();
        return t(`rooms.types.${key}`) || type;
    };

    // Helper: Detail Item Component
    const DetailItem = ({ icon, label, value, children }: any) => (
        <View className={`flex-row items-center py-4 border-b ${colors.cardBorder}`}>
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                {icon}
            </View>
            <View className="flex-1">
                <Text className={`text-xs font-medium uppercase tracking-wider mb-0.5 ${colors.subTextColor}`}>{label}</Text>
                {children || <Text className={`text-base font-semibold ${colors.textColor}`}>{value || '—'}</Text>}
            </View>
        </View>
    );

    const [selectedMenuImage, setSelectedMenuImage] = useState<any>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                await handleUploadImage(asset);
            }
        } catch (err) {
            console.error('Failed to pick image', err);
        }
    };

    const handleUploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
        if (!room?.content_type) {
            console.error('Missing content_type for room');
            // Assuming we might need to handle this gracefully or error out
            return;
        }

        try {
            setUploadingImage(true);
            const formData = new FormData();

            // File
            const fileName = asset.fileName || 'upload.jpg';
            const fileType = asset.mimeType || 'image/jpeg';

            // Check platform to determine how to append file
            if (Platform.OS === 'web') {
                // Web: Fetch blob from URI then append as File
                const response = await fetch(asset.uri);
                const blob = await response.blob();
                // @ts-ignore
                const file = new File([blob], fileName, { type: fileType });
                formData.append('file', file);
            } else {
                // Native: Append object
                // @ts-ignore
                formData.append('file', {
                    uri: asset.uri,
                    name: fileName,
                    type: fileType,
                });
            }

            formData.append('media_type', 'IMAGE');
            formData.append('title', fileName.split('.')[0]);
            formData.append('content_type_id', String(room.content_type));
            formData.append('object_id', String(room.id));
            formData.append('relation_type', 'ROOM_GALLERY');

            // Do not set Content-Type manually, let the client handle it
            await api.post('/media/files/upload/', formData);

            fetchDetail(); // Refresh images
        } catch (err) {
            console.error('Failed to upload image', err);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSetFeatured = async (imageId: string) => {
        try {
            // Correct API based on Web implementation:
            // PATCH /media/relations/{id}/ with { is_featured: true }
            await api.patch(`/media/relations/${imageId}/`, { is_featured: true });

            // We need to refresh both details (for hero) and images list
            fetchDetail();
            setSelectedMenuImage(null);
        } catch (err) {
            console.error('Failed to set featured', err);
            // setError(t('media.failedToSetFeatured')); 
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            // Correct API based on Web implementation:
            // DELETE /media/relations/{id}/
            await api.delete(`/media/relations/${imageId}/`);
            fetchDetail();
            setSelectedMenuImage(null);
        } catch (err) {
            console.error('Failed to delete image', err);
        }
    };



    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <LinearGradient colors={colors.bgColors} className="absolute inset-0" />
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error || !room) {
        return (
            <View className="flex-1">
                <LinearGradient colors={colors.bgColors} className="absolute inset-0" />
                <SafeAreaView className="flex-1">
                    <View className="px-6 pt-4 pb-4">
                        <Pressable onPress={() => router.back()} className={`w-10 h-10 items-center justify-center rounded-full border ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-100'}`}>
                            <ChevronLeft size={24} color={isDark ? '#fff' : '#000'} />
                        </Pressable>
                    </View>
                    <View className="flex-1 items-center justify-center px-6">
                        <AlertCircle size={48} color={colors.secondary} />
                        <Text className={`text-lg font-bold mt-4 ${colors.textColor}`}>{error || t('rooms.noRooms')}</Text>
                        <Pressable onPress={fetchDetail} className={`mt-8 px-8 py-3 rounded-2xl bg-white/10 border border-white/20 active:bg-white/20`}>
                            <Text className={`font-bold ${colors.textColor}`}>{t('common.retry') || 'Retry'}</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <LinearGradient colors={colors.bgColors} className="absolute inset-0" />
            <SafeAreaView className="flex-1">
                {/* Image Viewer Modal */}
                <Modal visible={!!selectedImage} transparent={true} animationType="fade" onRequestClose={() => setSelectedImage(null)}>
                    <View className="flex-1 bg-black/95 justify-center items-center p-4">
                        <Pressable
                            onPress={() => setSelectedImage(null)}
                            className="absolute top-12 right-6 z-50 p-3 rounded-full bg-white/10"
                        >
                            <X size={24} color="#fff" />
                        </Pressable>

                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={{ width: '100%', height: '80%', borderRadius: 16 }}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </Modal>

                {/* Options Menu Modal */}
                <Modal visible={!!selectedMenuImage} transparent={true} animationType="fade" onRequestClose={() => setSelectedMenuImage(null)}>
                    <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setSelectedMenuImage(null)}>
                        <View className={`rounded-t-3xl p-6 ${isDark ? 'bg-[#1A0B2E]' : 'bg-white'}`}>
                            <View className="flex-row items-center justify-between mb-6">
                                <Text className={`text-lg font-bold ${colors.textColor}`}>{t('media.imageOptions')}</Text>
                                <Pressable onPress={() => setSelectedMenuImage(null)} className="p-2 bg-gray-500/10 rounded-full">
                                    <X size={20} color={isDark ? '#fff' : '#000'} />
                                </Pressable>
                            </View>

                            <Pressable
                                className="flex-row items-center p-4 mb-3 rounded-2xl bg-blue-500/10 active:opacity-80"
                                onPress={() => handleSetFeatured(selectedMenuImage?.id)}
                            >
                                <Star size={24} color="#3B82F6" className="mr-4" />
                                <Text className="text-blue-500 font-bold text-base ml-4">{t('media.setAsFeatured')}</Text>
                            </Pressable>

                            <Pressable className={`flex-row items-center p-4 mb-3 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} opacity-50`}>
                                <IconImage size={24} color={colors.subTextColor.replace('text-', '').replace('/60', '')} className="mr-4" />
                                <Text className={`font-bold text-base ml-4 ${colors.textColor}`}>{t('media.download')}</Text>
                            </Pressable>

                            <Pressable
                                className="flex-row items-center p-4 mb-6 rounded-2xl bg-red-500/10 active:opacity-80"
                                onPress={() => handleDeleteImage(selectedMenuImage?.id)}
                            >
                                <Trash size={24} color="#EF4444" className="mr-4" />
                                <Text className="text-red-500 font-bold text-base ml-4">{t('media.delete')}</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Modal>

                <Stack.Screen options={{ headerShown: false }} />

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

                    {/* Header / Nav */}
                    <View className="px-6 pt-4 flex-row items-center justify-between z-10">
                        <Pressable onPress={() => router.back()} className={`w-10 h-10 items-center justify-center rounded-full border ${isDark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-100'}`}>
                            <ChevronLeft size={24} color={isDark ? '#fff' : '#000'} />
                        </Pressable>
                        <View className="w-10" />
                    </View>

                    {/* HERO SECTION */}
                    <View className="items-center px-6 mt-6 mb-10">
                        <View className={`w-36 h-36 rounded-[32px] items-center justify-center mb-6 ${isDark ? '' : 'border border-blue-100'} relative overflow-hidden`} >
                            {/* Gradient background for Icon Box */}
                            <LinearGradient
                                colors={isDark ? ['#2E1065', '#4C1D95'] : ['#F0F9FF', '#E0F2FE']}
                                className="absolute inset-0"
                            />

                            {/* Room Image Logic: Prioritize Featured from Images List */}
                            {(() => {
                                const featuredImg = images.find(img => img.is_featured);
                                const firstImg = images.length > 0 ? images[0] : null;
                                const displayUrl = featuredImg?.media_file?.url || room.featured_image?.url || firstImg?.media_file?.url;

                                return displayUrl ? (
                                    <Image
                                        source={{ uri: displayUrl }}
                                        className="absolute inset-0 w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <>
                                        <View className={`absolute inset-0 border-[1px] rounded-[32px] ${isDark ? 'border-white/20' : 'border-blue-500/10'}`} />
                                        {getRoomIcon(room.room_type, 48)}
                                    </>
                                );
                            })()}

                            {/* Overlay for text readability if image exists */}
                            {(() => {
                                const featuredImg = images.find(img => img.is_featured);
                                const firstImg = images.length > 0 ? images[0] : null;
                                const displayUrl = featuredImg?.media_file?.url || room.featured_image?.url || firstImg?.media_file?.url;
                                return displayUrl ? <View className="absolute inset-0 bg-black/30" /> : null;
                            })()}
                        </View>

                        <Text className={`text-3xl font-bold text-center mb-2 ${colors.textColor}`}>{room.name}</Text>

                        <View className="flex-row items-center gap-3">
                            <View className={`px-4 py-1.5 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                                <Text className={`text-xs font-semibold tracking-wide ${colors.subTextColor}`}>{getRoomTypeLabel(room.room_type)}</Text>
                            </View>
                            {room.code && (
                                <View className={`px-4 py-1.5 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                                    <Text className={`text-xs font-semibold tracking-wide ${colors.subTextColor} flex-row items-center`}>
                                        Code: {room.code}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* METRICS ROW */}
                    <View className="flex-row px-6 gap-4 mb-2">
                        {/* Capacity Card */}
                        <View className={`flex-1 p-5 rounded-3xl ${colors.cardBg} border ${colors.cardBorder} relative overflow-hidden`}>
                            <LinearGradient colors={isDark ? ['rgba(124, 58, 237, 0.15)', 'rgba(0,0,0,0)'] : ['rgba(124, 58, 237, 0.05)', 'rgba(0,0,0,0)']} className="absolute inset-0" />
                            <Text className={`text-xs font-bold uppercase tracking-wider ${colors.subTextColor} mb-1`}>{t('rooms.capacity')}</Text>
                            <View className="flex-row items-end">
                                <Text className={`text-4xl font-bold ${colors.textColor} mr-2`}>{room.capacity}</Text>
                                <Text className={`text-sm font-medium ${colors.subTextColor} mb-2`}>{t('common.seats')}</Text>
                            </View>
                        </View>

                        {/* Status/Type Card */}
                        <View className={`flex-1 p-5 rounded-3xl ${colors.cardBg} border ${colors.cardBorder} relative overflow-hidden items-center justify-center gap-1`}>
                            <View className={`w-10 h-10 rounded-full items-center justify-center ${room.room_type === 'CLASSROOM' ? 'bg-green-500/20' : 'bg-gray-500/20'} mb-1`}>
                                {room.room_type === 'CLASSROOM' ? <Users size={20} color="#22C55E" /> : <Box size={20} color={isDark ? '#fff' : '#000'} />}
                            </View>
                            <Text className={`text-xs font-bold text-center ${room.room_type === 'CLASSROOM' ? 'text-green-500' : colors.subTextColor}`}>
                                {room.room_type === 'CLASSROOM' ? t('rooms.isClassroom') : 'Standard Room'}
                            </Text>
                        </View>
                    </View>

                    {/* DETAILS LIST SECTION */}
                    <View className="px-6 mt-6">
                        <Text className={`text-sm font-bold opacity-50 uppercase tracking-widest mb-4 ${colors.textColor} pl-2`}>
                            {t('rooms.information')}
                        </Text>

                        <View className={`rounded-3xl ${colors.cardBg} border ${colors.cardBorder} px-5`}>
                            <DetailItem
                                icon={<Building size={18} color={isDark ? '#fff' : '#64748B'} />}
                                label={t('rooms.name')}
                                value={room.name}
                            />
                            <DetailItem
                                icon={<MapPin size={18} color={isDark ? '#fff' : '#64748B'} />}
                                label={t('rooms.roomCode')}
                                value={room.code}
                            />
                            <DetailItem
                                icon={<AlertCircle size={18} color={isDark ? '#fff' : '#64748B'} />}
                                label={t('rooms.note')}
                            >
                                <Text className={`text-sm font-medium ${colors.subTextColor} leading-5`}>
                                    {room.note || t('common.noNotes')}
                                </Text>
                            </DetailItem>
                        </View>
                    </View>

                    {/* IMAGES SECTION */}
                    <View className="mt-8">
                        <View className="px-8 mb-4 flex-row items-center justify-between">
                            <Text className={`text-sm font-bold opacity-50 uppercase tracking-widest ${colors.textColor}`}>
                                {t('media.roomImages')} ({images.length})
                            </Text>
                            <Pressable
                                onPress={handlePickImage}
                                disabled={uploadingImage}
                                className={`flex-row items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'bg-white/5 border-white/20' : 'bg-white border-gray-200'} active:opacity-70`}
                            >
                                {uploadingImage ? (
                                    <ActivityIndicator size="small" color={colors.primary} />
                                ) : (
                                    <>
                                        <Plus size={16} color={colors.primary} />
                                        <Text className={`text-xs font-bold ${colors.primary} uppercase`}>{t('media.addImages') || 'Add'}</Text>
                                    </>
                                )}
                            </Pressable>
                        </View>

                        {images.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
                                {images.map((img: any, index: number) => (
                                    <View key={img.id} className="mr-4 relative">
                                        <Pressable
                                            onPress={() => setSelectedImage(img.media_file.url)}
                                            className={`rounded-2xl overflow-hidden border ${colors.cardBorder}`}
                                        >
                                            <Image
                                                source={{ uri: img.media_file.url }}
                                                style={{ width: 160, height: 200 }}
                                                resizeMode="cover"
                                            />
                                            <LinearGradient
                                                colors={['transparent', 'rgba(0,0,0,0.7)']}
                                                className="absolute inset-x-0 bottom-0 h-16 justify-end p-3"
                                            >
                                                <IconImage size={16} color="white" className="opacity-80" />
                                            </LinearGradient>
                                        </Pressable>

                                        {/* Status Badge */}
                                        {img.is_featured ? (
                                            <View className="absolute top-2 right-2 flex-row gap-2">
                                                <View className="bg-yellow-500 px-2 py-1 rounded-lg">
                                                    <Text className="text-white text-[10px] font-bold">★ {t('media.featured')}</Text>
                                                </View>
                                                <Pressable onPress={() => setSelectedMenuImage(img)} className="bg-black/40 backdrop-blur-md p-1 rounded-lg">
                                                    <MoreVertical size={16} color="white" />
                                                </Pressable>
                                            </View>
                                        ) : (
                                            <View className="absolute top-2 right-2">
                                                <Pressable onPress={() => setSelectedMenuImage(img)} className="bg-black/40 backdrop-blur-md p-1.5 rounded-lg">
                                                    <MoreVertical size={16} color="white" />
                                                </Pressable>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View className={`mx-6 p-8 rounded-3xl border border-dashed ${isDark ? 'border-white/10' : 'border-gray-200'} items-center justify-center`}>
                                <IconImage size={32} color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
                                <Text className={`text-xs mt-3 ${colors.subTextColor}`}>{t('media.noImages')}</Text>
                            </View>
                        )}
                    </View>

                    {/* EQUIPMENT SECTION */}
                    <View className="px-6 mt-8">
                        <View className="flex-row items-center justify-between mb-4 pl-2">
                            <Text className={`text-sm font-bold opacity-50 uppercase tracking-widest ${colors.textColor}`}>
                                {t('rooms.equipmentSection.title')}
                            </Text>
                            {/* Optional Add Button */}
                        </View>

                        <View className={`p-2 rounded-[32px] ${colors.cardBg} border ${colors.cardBorder}`}>
                            {equipmentLoading ? (
                                <ActivityIndicator size="small" color={colors.primary} className="py-8" />
                            ) : equipment.length > 0 ? (
                                equipment.map((item, index) => (
                                    <View key={item.id} className={`flex-row items-center p-4 mb-2 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                                        <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${isDark ? 'bg-black/20' : 'bg-white border border-gray-100'}`}>
                                            <Package size={20} color={colors.primary} />
                                        </View>

                                        <View className="flex-1 mr-2">
                                            <Text className={`text-sm font-bold ${colors.textColor}`}>{item.name}</Text>
                                            <Text className={`text-xs ${colors.subTextColor} mt-0.5`} numberOfLines={1}>{item.description}</Text>
                                        </View>

                                        <View className="items-end gap-1">
                                            <View className={`px-2 py-0.5 rounded-md ${isDark ? 'bg-white/10' : 'bg-white border border-gray-200'}`}>
                                                <Text className={`text-xs font-bold ${colors.textColor}`}>x{item.quantity}</Text>
                                            </View>
                                            <View className={`px-2 py-0.5 rounded-md ${item.is_active ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                <Text className={`text-[8px] font-bold ${item.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                                    {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View className="items-center py-8">
                                    <Package size={24} color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} />
                                    <Text className={`text-xs mt-2 ${colors.subTextColor}`}>{t('rooms.equipmentSection.empty')}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                </ScrollView >
            </SafeAreaView >
        </View >
    );
}
