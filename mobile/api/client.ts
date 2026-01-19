import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

const getBaseUrl = () => {
    if (Platform.OS === 'web') return 'http://localhost:8000/api';

    // For physical devices, use the host URI from Expo Go
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
        const ip = hostUri.split(':')[0];
        return `http://${ip}:8000/api`;
    }

    // Fallback for emulator if hostUri is not available
    return 'http://10.0.2.2:8000/api';
};

const API_URL = getBaseUrl();
console.log('🚀 API Client Initialized. Target URL:', API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    let token;
    if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
    } else {
        token = await SecureStore.getItemAsync('userToken');
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                if (Platform.OS === 'web') {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userData');
                } else {
                    await SecureStore.deleteItemAsync('userToken');
                    await SecureStore.deleteItemAsync('userData');
                }

                // Use replace to prevent going back to the protected screen
                router.replace('/(auth)/login');
            } catch (e) {
                console.error('Error handling 401:', e);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
