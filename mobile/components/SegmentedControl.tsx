import React, { useEffect } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface SegmentedControlProps {
    options: string[];
    selectedOption: string;
    onOptionPress: (option: string) => void;
}

export default function SegmentedControl({ options, selectedOption, onOptionPress }: SegmentedControlProps) {
    const { width } = useWindowDimensions();
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';

    const containerWidth = width - 48; // px-6 * 2 = 48
    const translateValue = useSharedValue(0);
    const tabWidth = containerWidth / options.length;

    useEffect(() => {
        const index = options.indexOf(selectedOption);
        translateValue.value = withSpring(index * tabWidth, {
            damping: 15,
            stiffness: 120,
        });
    }, [selectedOption, options, tabWidth, translateValue]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateValue.value }],
            width: tabWidth - 4, // padding
        };
    });

    return (
        <View className={`flex-row h-12 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} p-1 relative`}>
            <Animated.View
                style={[animatedStyle]}
                className={`absolute top-1 bottom-1 left-1 rounded-xl shadow-sm ${isDark ? 'bg-blue-600' : 'bg-white'}`}
            />
            {options.map((option) => {
                const isSelected = selectedOption === option;
                return (
                    <Pressable
                        key={option}
                        onPress={() => onOptionPress(option)}
                        className="flex-1 items-center justify-center z-10"
                    >
                        <Text
                            className={`text-sm font-bold ${isSelected
                                ? (isDark ? 'text-white' : 'text-blue-600')
                                : (isDark ? 'text-gray-400' : 'text-gray-500')
                                } capitalize`}
                        >
                            {option}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
