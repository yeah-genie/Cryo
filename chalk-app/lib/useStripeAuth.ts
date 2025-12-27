import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = 'stripe_access_token';
const ACCOUNT_KEY = 'stripe_account_id';

// TODO: Replace with your actual Stripe Connect credentials
// Get these from: https://dashboard.stripe.com/settings/connect
const STRIPE_CONFIG = {
    clientId: 'YOUR_STRIPE_CLIENT_ID', // ca_xxx
};

const discovery = {
    authorizationEndpoint: 'https://connect.stripe.com/oauth/authorize',
    tokenEndpoint: 'https://connect.stripe.com/oauth/token',
};

export interface StripeAccount {
    id: string;
    email?: string;
    business_name?: string;
}

export function useStripeAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [account, setAccount] = useState<StripeAccount | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const redirectUri = makeRedirectUri({
        scheme: 'chalk-app',
        path: 'stripe-callback',
    });

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: STRIPE_CONFIG.clientId,
            scopes: ['read_write'],
            redirectUri,
            extraParams: {
                response_type: 'code',
                scope: 'read_write',
            },
        },
        discovery
    );

    // Load stored data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                const storedAccountId = await SecureStore.getItemAsync(ACCOUNT_KEY);
                if (storedToken && storedAccountId) {
                    setAccessToken(storedToken);
                    setAccount({ id: storedAccountId });
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to load Stripe data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Handle OAuth response
    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            // In production, exchange code for token via your backend
            handleCodeExchange(code);
        }
    }, [response]);

    const handleCodeExchange = async (code: string) => {
        // TODO: Implement server-side token exchange with Stripe
        // This MUST be done server-side as it requires your secret key
        console.log('Stripe auth code:', code);

        // Simulate success for now
        setIsAuthenticated(true);
        setAccount({
            id: 'acct_mock',
            email: 'tutor@example.com',
            business_name: 'Alex Tutoring',
        });
    };

    const signIn = useCallback(async () => {
        if (request) {
            await promptAsync();
        }
    }, [request, promptAsync]);

    const signOut = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(ACCOUNT_KEY);
            setAccessToken(null);
            setAccount(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Failed to disconnect Stripe:', error);
        }
    }, []);

    return {
        isAuthenticated,
        isLoading,
        account,
        accessToken,
        signIn,
        signOut,
        isReady: !!request,
    };
}
