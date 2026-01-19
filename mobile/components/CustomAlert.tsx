import React from 'react';
import { View, Text, Modal, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    type = 'info',
    onClose,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancel'
}) => {
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={48} color={isDark ? '#4ade80' : '#16a34a'} />;
            case 'error':
                return <XCircle size={48} color={isDark ? '#f87171' : '#dc2626'} />;
            case 'warning':
                return <AlertCircle size={48} color={isDark ? '#fbbf24' : '#d97706'} />;
            default:
                return <AlertCircle size={48} color={isDark ? '#60a5fa' : '#2563eb'} />;
        }
    };

    const getBgColor = () => {
        if (isDark) return 'bg-slate-900/90';
        return 'bg-white/90';
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center px-6">
                {/* Backdrop with Blur */}
                {Platform.OS === 'ios' ? (
                    <BlurView
                        intensity={20}
                        tint={isDark ? 'dark' : 'light'}
                        className="absolute inset-0"
                    />
                ) : (
                    <View className="absolute inset-0 bg-black/60" />
                )}

                <View className={`w-full max-w-sm p-6 rounded-3xl ${getBgColor()} border border-white/10 shadow-2xl items-center`}>
                    <View className="mb-4 p-4 rounded-full bg-white/5">
                        {getIcon()}
                    </View>

                    <Text className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </Text>

                    <Text className={`text-base mb-8 text-center leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {message}
                    </Text>

                    <View className="flex-row gap-3 w-full">
                        {onConfirm ? (
                            <>
                                <Pressable
                                    onPress={onClose}
                                    className={`flex-1 py-3 rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} active:opacity-70 items-center`}
                                >
                                    <Text className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {cancelText}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={onConfirm}
                                    className={`flex-1 py-3 rounded-xl ${type === 'error' ? 'bg-red-500' : 'bg-indigo-600'} active:opacity-90 items-center shadow-lg shadow-indigo-500/30`}
                                >
                                    <Text className="text-white font-bold">
                                        {confirmText}
                                    </Text>
                                </Pressable>
                            </>
                        ) : (
                            <Pressable
                                onPress={onClose}
                                className={`flex-1 py-3 rounded-xl ${type === 'error' ? 'bg-red-500' : 'bg-indigo-600'} active:opacity-90 items-center shadow-lg shadow-indigo-500/30`}
                            >
                                <Text className="text-white font-bold">
                                    {confirmText}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;
