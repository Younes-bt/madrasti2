import React from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';

interface Module {
    id: string;
    title: string;
    icon: keyof typeof LucideIcons;
    route: string;
    color: string;
}

interface ModuleGridProps {
    modules: Module[];
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 16) / 2; // (Screen - Padding - Gap) / 2 columns

export default function ModuleGrid({ modules }: ModuleGridProps) {
    const router = useRouter();

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="flex-row flex-wrap justify-between">
                {modules.map((module) => {
                    const Icon = LucideIcons[module.icon] as React.ElementType;
                    return (
                        <Pressable
                            key={module.id}
                            className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-slate-100 items-center justify-center active:bg-slate-50"
                            style={{ width: cardWidth, height: cardWidth }}
                            onPress={() => router.push(module.route as any)}
                        >
                            <View
                                className={`p-4 rounded-2xl mb-3 ${module.color}`}
                            >
                                {Icon && <Icon size={28} color="#fff" />}
                            </View>
                            <Text className="text-slate-900 font-semibold text-center">{module.title}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </ScrollView>
    );
}
