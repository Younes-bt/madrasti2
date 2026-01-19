# Madrasti 2.0 - Mobile UI/UX Design System & Guidelines

This document is the **single source of truth** for creating new pages in the Madrasti 2.0 mobile app. Follow these patterns strictly to ensure a consistent, premium, and multilingual experience.

---

## 1. Design Philosophy: "Dimensional Minimalism"

We have adopted a **"No Shadow"** policy. We achieve depth and hierarchy through **Layout (Bento Grids)**, **Translucent Colors**, and **Micro-Borders**, not by simulating physical light.

*   **🚫 NO Shadows:** Do not use `elevation`, `boxShadow`, `shadowColor`, or `textShadow`.
*   **✅ YES Structure:** Use gaps, padding, and rounded corners (`rounded-2xl` or `rounded-3xl`) to define areas.
*   **✅ YES Borders:** Use extremely subtle borders (`border-white/10` or `border-black/5`) to "cut" the glass.

---

## 2. Standard Page Structure ("The Shell")

Every page MUST start with this structure to ensure the correct background gradient and safe area handling.

```tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export default function NewPage() {
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';
    
    // Standard Background Gradients (Atmospheric, not content)
    const bgColors: [string, string, ...string[]] = isDark
        ? ['#0f172a', '#1e293b'] // Slate 900 -> 800 (Clean, flat dark)
        : ['#f8fafc', '#f1f5f9']; // Slate 50 -> 100 (Clean, flat light)

    return (
        <View className="flex-1 bg-background">
            {/* 1. Global Background */}
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }} // Vertical gradient
                className="absolute inset-0"
            />

            <SafeAreaView className="flex-1">
                <Stack.Screen options={{ headerShown: false }} />
                
                {/* Content Here */}
                <ScrollView 
                    className="flex-1 px-6" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
```

---

## 3. Safe Area Issues (Android/iOS Compatibility)

**CRITICAL:** Always use `SafeAreaView` from `react-native-safe-area-context` to prevent UI overlaps with system elements (status bar, navigation buttons).

### A. Standard Pages (Headers/Content)

For regular pages with headers and scrollable content, the structure shown in Section 2 is sufficient. The `SafeAreaView` automatically handles:
- ✅ Status bar overlap (top)
- ✅ Navigation bar overlap (bottom)  
- ✅ Notch/Dynamic Island on iOS

**Example:**
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView className="flex-1">
    <Stack.Screen options={{ headerShown: false }} />
    {/* Your content here */}
</SafeAreaView>
```

### B. Tab Bar Layouts (Bottom Navigation)

For pages with bottom tab navigation (e.g., `_layout.tsx` files using `Tabs` from `expo-router`), you **MUST** use `useSafeAreaInsets` to dynamically adjust the tab bar height.

**Required imports:**
```tsx
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
```

**Implementation:**
```tsx
export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
                    height: 65 + insets.bottom, // Dynamic height
                    paddingBottom: Math.max(insets.bottom, 8), // Dynamic padding
                    paddingTop: 8,
                },
                // ... other options
            }}
        >
            {/* Tab screens */}
        </Tabs>
    );
}
```

**What This Fixes:**
- ✅ Tab bar no longer overlaps with Android navigation buttons (Home, Back, Overview)
- ✅ Proper spacing on devices with/without navigation bars
- ✅ Works on iOS devices with home indicator

---

## 4. Component Styles: Bento & Glass

### A. The Bento Grid (Dashboards/Modules)
For dashboards or lists of options, use a **2-column Bento Grid**.

*   **Logic:** `flex-row flex-wrap justify-between gap-y-4`
*   **Item Width:** `w-[48%]`
*   **Styling:** distinct background colors for each module (e.g., Cyan, Violet) but at very low opacity (`bg-cyan-500/10`) with a matching subtle border (`border-cyan-500/20`).

**Example Module Card:**
```tsx
<Pressable className="w-[48%] rounded-2xl p-4 border border-cyan-500/20 bg-cyan-500/10 active:scale-[0.98]">
    <View className="mb-3 w-10 h-10 rounded-full bg-white/10 items-center justify-center">
        <Building2 size={24} color="#22d3ee" />
    </View>
    <Text className="text-slate-100 text-base font-bold mb-1">My School</Text>
    <Text className="text-slate-400 text-xs">Manage staff & info</Text>
</Pressable>
```

### B. The Glass Tile (Profiles/Information)
For full-width information cards (like User Profiles), use a generic glass style.

```tsx
// Constants
const cardBg = isDark ? 'bg-slate-800/50' : 'bg-white';
const cardBorder = isDark ? 'border-white/5' : 'border-slate-200';

// Usage
<View className={`w-full p-4 rounded-2xl ${cardBg} border ${cardBorder}`}>
    {/* Content */}
</View>
```

---

## 5. Headers & Navigation

Use a custom header layout inside `SafeAreaView`. Keep it minimal.

```tsx
<View className="px-6 pt-2 pb-6 flex-row justify-between items-center">
    <View>
        <Text className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-0.5">
           {t('subtitle.key')}
        </Text>
        <Text className="text-slate-100 text-2xl font-bold">
            {t('page.title.key')}
        </Text>
    </View>
    {/* Optional Action Buttons */}
    <View className="flex-row gap-3">
       <Pressable className={`w-10 h-10 items-center justify-center rounded-full ${cardBg} border ${cardBorder}`}>
            <Bell size={20} color={iconColor} />
       </Pressable>
    </View>
</View>
```

---

## 6. Data Fetching & State

Handle loading and error states gracefully.

### A. Loading Indicator
```tsx
if (loading) {
    return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={isDark ? "#fff" : "#4f46e5"} />
        </View>
    );
}
```

---

## 7. Icons & Typography

*   **Icons:** `lucide-react-native`. 
    *   **Size:** `24` is standard for grid icons. `20` for buttons. `16` for metadata.
    *   **Colors:** Match the icon color to the specific module theme (e.g., Cyan icon for School module) if applicable, otherwise use neutral `slate-100`/`slate-800`.
*   **Typography:**
    *   **Heads:** `font-bold` for titles.
    *   **Subs:** `text-xs` or `text-sm` with `text-slate-400` (muted) for descriptions.
    *   **Tracking:** Use `tracking-wider` for uppercase subtitles.

---

## 8. Web Compatibility

*   **Avoid** `Alert.alert()` for critical interactions on web; use `window.confirm` or a custom Modal.
*   **Platform Check:** `import { Platform } from 'react-native';`

