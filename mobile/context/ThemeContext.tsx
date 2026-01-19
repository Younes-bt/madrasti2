import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import * as SecureStore from 'expo-secure-store';
import { Platform, useColorScheme as useSystemColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => Promise<void>;
    actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'madrasti-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useSystemColorScheme();
    const { setColorScheme } = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');
    const [isLoading, setIsLoading] = useState(true);

    // Calculate actual theme (resolve 'system' to 'light' or 'dark')
    const actualTheme: 'light' | 'dark' =
        theme === 'system'
            ? (systemColorScheme === 'dark' ? 'dark' : 'light')
            : theme;

    // Load theme from storage on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                let savedTheme: string | null;

                if (Platform.OS === 'web') {
                    savedTheme = localStorage.getItem(STORAGE_KEY);
                } else {
                    savedTheme = await SecureStore.getItemAsync(STORAGE_KEY);
                }

                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
                    setThemeState(savedTheme as Theme);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTheme();
    }, []);

    // Sync actualTheme with NativeWind's color scheme whenever it changes
    useEffect(() => {
        setColorScheme(actualTheme);
    }, [actualTheme, setColorScheme]);

    const setTheme = async (newTheme: Theme) => {
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem(STORAGE_KEY, newTheme);
            } else {
                await SecureStore.setItemAsync(STORAGE_KEY, newTheme);
            }
            setThemeState(newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const value: ThemeContextType = {
        theme,
        setTheme,
        actualTheme,
    };

    // Don't render children until theme is loaded
    if (isLoading) {
        return null;
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
