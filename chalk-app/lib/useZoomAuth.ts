import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = '@chalk_zoom_token';

// Supabase Edge Function URL
const SUPABASE_URL = 'https://xnjqsgdapbjnowzwhnaq.supabase.co';
const ZOOM_AUTH_URL = `${SUPABASE_URL}/functions/v1/zoom-auth`;

export interface ZoomTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
}

export function useZoomAuth() {
    const [tokens, setTokens] = useState<ZoomTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 저장된 토큰 로드
    useEffect(() => {
        loadStoredTokens();
    }, []);

    // Deep link 처리
    useEffect(() => {
        const subscription = Linking.addEventListener('url', handleDeepLink);

        // 앱이 이미 열려있을 때 초기 URL 체크
        Linking.getInitialURL().then(url => {
            if (url) handleDeepLink({ url });
        });

        return () => subscription.remove();
    }, []);

    const handleDeepLink = async ({ url }: { url: string }) => {
        if (!url.includes('auth/zoom/callback')) return;

        const parsed = Linking.parse(url);
        const { access_token, refresh_token, expires_in, error } = parsed.queryParams as any;

        if (error) {
            console.error('Zoom OAuth error:', error);
            return;
        }

        if (access_token) {
            const newTokens: ZoomTokens = {
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: expires_in ? Date.now() + parseInt(expires_in) * 1000 : undefined,
            };
            await saveTokens(newTokens);
        }
    };

    const loadStoredTokens = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as ZoomTokens;
                if (!parsed.expiresAt || parsed.expiresAt > Date.now()) {
                    setTokens(parsed);
                } else if (parsed.refreshToken) {
                    await refreshTokens(parsed.refreshToken);
                }
            }
        } catch (error) {
            console.error('Failed to load Zoom tokens:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshTokens = async (refreshToken: string) => {
        try {
            const response = await fetch(`${ZOOM_AUTH_URL}/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            const data = await response.json();

            if (data.access_token) {
                const newTokens: ZoomTokens = {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresAt: Date.now() + data.expires_in * 1000,
                };
                await saveTokens(newTokens);
            }
        } catch (error) {
            console.error('Failed to refresh Zoom tokens:', error);
        }
    };

    const saveTokens = async (newTokens: ZoomTokens) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTokens));
            setTokens(newTokens);
        } catch (error) {
            console.error('Failed to save Zoom tokens:', error);
        }
    };

    const signIn = async () => {
        const result = await WebBrowser.openAuthSessionAsync(
            `${ZOOM_AUTH_URL}/authorize`,
            'chalkapp://auth/zoom/callback'
        );
        console.log('WebBrowser result:', result);
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setTokens(null);
        } catch (error) {
            console.error('Failed to sign out Zoom:', error);
        }
    };

    return {
        tokens,
        isLoading,
        isAuthenticated: !!tokens,
        signIn,
        signOut,
    };
}
