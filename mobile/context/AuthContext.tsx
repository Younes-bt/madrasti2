import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'STAFF' | 'DRIVER' | null;

interface User {
    id?: string;
    email?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    [key: string]: any;
}

interface AuthState {
    token: string | null;
    role: UserRole;
    user: User | null;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    signIn: (token: string, refresh: string, role: UserRole, user: any) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        token: null,
        role: null,
        user: null,
        isLoading: true,
    });

    useEffect(() => {
        // Load auth state
        const loadAuth = async () => {
            try {
                let token, role, user = null;
                if (Platform.OS === 'web') {
                    token = localStorage.getItem('userToken');
                    role = localStorage.getItem('userRole') as UserRole;
                    const userData = localStorage.getItem('userData');
                    if (userData) {
                        try {
                            user = JSON.parse(userData);
                        } catch (e) {
                            console.error('Failed to parse user data:', e);
                        }
                    }
                } else {
                    token = await SecureStore.getItemAsync('userToken');
                    role = await SecureStore.getItemAsync('userRole') as UserRole;
                    const userData = await SecureStore.getItemAsync('userData');
                    if (userData) {
                        try {
                            user = JSON.parse(userData);
                        } catch (e) {
                            console.error('Failed to parse user data:', e);
                        }
                    }
                }
                setState({ token, role, user, isLoading: false });
            } catch {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };
        loadAuth();
    }, []);

    const signIn = async (token: string, refresh: string, role: UserRole, user: any) => {
        if (Platform.OS === 'web') {
            localStorage.setItem('userToken', token);
            localStorage.setItem('userRefresh', refresh);
            localStorage.setItem('userRole', role || '');
            localStorage.setItem('userData', JSON.stringify(user));
        } else {
            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userRefresh', refresh);
            await SecureStore.setItemAsync('userRole', role || '');
            await SecureStore.setItemAsync('userData', JSON.stringify(user));
        }
        setState({ token, role, user, isLoading: false });
    };

    const signOut = async () => {
        if (Platform.OS === 'web') {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRefresh');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
        } else {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userRefresh');
            await SecureStore.deleteItemAsync('userRole');
            await SecureStore.deleteItemAsync('userData');
        }
        setState({ token: null, role: null, user: null, isLoading: false });
    };

    return (
        <AuthContext.Provider value={{ ...state, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
