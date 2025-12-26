import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = '@chalk_google_token';

// Google Cloud Console OAuth Client ID
const GOOGLE_CLIENT_ID = '410176806836-ke5s4mb9m9slqgr9gfmf3mhucrr8ktjb.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = '410176806836-ke5s4mb9m9slqgr9gfmf3mhucrr8ktjb.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = '410176806836-ke5s4mb9m9slqgr9gfmf3mhucrr8ktjb.apps.googleusercontent.com';

export interface GoogleTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
}

export function useGoogleAuth() {
    const [tokens, setTokens] = useState<GoogleTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: [
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.events.readonly',
        ],
    });

    // 저장된 토큰 로드
    useEffect(() => {
        loadStoredTokens();
    }, []);

    // OAuth 응답 처리
    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication) {
                const newTokens: GoogleTokens = {
                    accessToken: authentication.accessToken,
                    expiresAt: authentication.expiresIn
                        ? Date.now() + authentication.expiresIn * 1000
                        : undefined,
                };
                saveTokens(newTokens);
            }
        }
    }, [response]);

    const loadStoredTokens = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as GoogleTokens;
                if (!parsed.expiresAt || parsed.expiresAt > Date.now()) {
                    setTokens(parsed);
                }
            }
        } catch (error) {
            console.error('Failed to load Google tokens:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveTokens = async (newTokens: GoogleTokens) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTokens));
            setTokens(newTokens);
        } catch (error) {
            console.error('Failed to save Google tokens:', error);
        }
    };

    const signIn = async () => {
        await promptAsync();
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setTokens(null);
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return {
        tokens,
        isLoading,
        isAuthenticated: !!tokens,
        signIn,
        signOut,
        request,
    };
}
