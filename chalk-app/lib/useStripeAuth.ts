import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = '@chalk_stripe_token';

// Supabase Edge Function URL
const SUPABASE_URL = 'https://xnjqsgdapbjnowzwhnaq.supabase.co';
const STRIPE_AUTH_URL = `${SUPABASE_URL}/functions/v1/stripe-auth`;

export interface StripeTokens {
    accessToken: string;
    stripeUserId: string;
    refreshToken?: string;
}

export function useStripeAuth() {
    const [tokens, setTokens] = useState<StripeTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 저장된 토큰 로드
    useEffect(() => {
        loadStoredTokens();
    }, []);

    // Deep link 처리
    useEffect(() => {
        const subscription = Linking.addEventListener('url', handleDeepLink);

        Linking.getInitialURL().then(url => {
            if (url) handleDeepLink({ url });
        });

        return () => subscription.remove();
    }, []);

    const handleDeepLink = async ({ url }: { url: string }) => {
        if (!url.includes('auth/stripe/callback')) return;

        const parsed = Linking.parse(url);
        const { access_token, stripe_user_id, refresh_token, error } = parsed.queryParams as any;

        if (error) {
            console.error('Stripe OAuth error:', error);
            return;
        }

        if (access_token) {
            const newTokens: StripeTokens = {
                accessToken: access_token,
                stripeUserId: stripe_user_id,
                refreshToken: refresh_token,
            };
            await saveTokens(newTokens);
        }
    };

    const loadStoredTokens = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setTokens(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load Stripe tokens:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveTokens = async (newTokens: StripeTokens) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTokens));
            setTokens(newTokens);
        } catch (error) {
            console.error('Failed to save Stripe tokens:', error);
        }
    };

    const signIn = async () => {
        const result = await WebBrowser.openAuthSessionAsync(
            `${STRIPE_AUTH_URL}/authorize`,
            'chalkapp://auth/stripe/callback'
        );
        console.log('Stripe WebBrowser result:', result);
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setTokens(null);
        } catch (error) {
            console.error('Failed to sign out Stripe:', error);
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
