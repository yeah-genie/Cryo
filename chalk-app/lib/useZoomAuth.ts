import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

const TOKEN_KEY = 'zoom_access_token';
const USER_KEY = 'zoom_user';

// Supabase Edge Function URL for Zoom OAuth
const SUPABASE_ZOOM_AUTH_URL = 'https://xnjqsgdapbjnowzwhnaq.supabase.co/functions/v1/zoom-auth';

export interface ZoomUser {
    id: string;
    name: string;
    email: string;
    pic_url?: string;
}

export function useZoomAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<ZoomUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Load stored data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                const storedUser = await SecureStore.getItemAsync(USER_KEY);
                if (storedToken && storedUser) {
                    setAccessToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                    console.log('[Zoom] Loaded stored credentials');
                }
            } catch (error) {
                console.error('[Zoom] Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Check for initial URL (app opened via deep link)
    useEffect(() => {
        const checkInitialUrl = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl && initialUrl.includes('zoom-callback')) {
                    console.log('[Zoom] Initial URL detected:', initialUrl);
                    await handleCallback(initialUrl);
                }
            } catch (error) {
                console.error('[Zoom] Error checking initial URL:', error);
            }
        };
        checkInitialUrl();
    }, []);

    // Handle deep link callback
    useEffect(() => {
        const handleDeepLink = async (event: { url: string }) => {
            console.log('[Zoom] Deep link received:', event.url);
            if (event.url.includes('zoom-callback')) {
                await handleCallback(event.url);
            }
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);
        return () => subscription.remove();
    }, []);

    const handleCallback = async (url: string) => {
        try {
            const params = new URLSearchParams(url.split('?')[1]);
            const token = params.get('access_token');
            const userName = params.get('user_name');
            const userEmail = params.get('user_email');
            const error = params.get('error');

            if (error) {
                console.error('[Zoom] OAuth error:', error);
                Alert.alert('Zoom 연결 실패', error);
                return;
            }

            if (token) {
                console.log('[Zoom] Token received, saving...');
                await SecureStore.setItemAsync(TOKEN_KEY, token);
                const userData = {
                    id: 'zoom-user',
                    name: userName || 'Zoom User',
                    email: userEmail || '',
                };
                await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
                setAccessToken(token);
                setUser(userData);
                setIsAuthenticated(true);
                console.log('[Zoom] Successfully authenticated!');
            }
        } catch (error) {
            console.error('[Zoom] Error handling callback:', error);
        }
    };

    const signIn = useCallback(async () => {
        try {
            console.log('[Zoom] Starting OAuth flow...');
            // Create redirect URL using Expo's Linking
            const redirectUrl = Linking.createURL('zoom-callback');
            console.log('[Zoom] Redirect URL:', redirectUrl);

            const authUrl = `${SUPABASE_ZOOM_AUTH_URL}/authorize?redirect_uri=${encodeURIComponent(redirectUrl)}`;
            console.log('[Zoom] Auth URL:', authUrl);

            const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
            console.log('[Zoom] WebBrowser result:', result);

            if (result.type === 'success' && result.url) {
                await handleCallback(result.url);
            } else if (result.type === 'cancel') {
                console.log('[Zoom] User cancelled');
            }
        } catch (error) {
            console.error('[Zoom] Failed to start auth:', error);
            Alert.alert('오류', 'Zoom 연결을 시작할 수 없습니다.');
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
            console.log('[Zoom] Signed out');
        } catch (error) {
            console.error('[Zoom] Failed to sign out:', error);
        }
    }, []);

    return {
        isAuthenticated,
        isLoading,
        user,
        accessToken,
        signIn,
        signOut,
        isReady: true,
    };
}
