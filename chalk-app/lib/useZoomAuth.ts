import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = 'zoom_access_token';

// TODO: Replace with your actual Zoom OAuth credentials
// Get these from: https://marketplace.zoom.us
const ZOOM_CONFIG = {
    clientId: 'YOUR_ZOOM_CLIENT_ID',
    clientSecret: 'YOUR_ZOOM_CLIENT_SECRET', // Should be handled server-side!
};

const discovery = {
    authorizationEndpoint: 'https://zoom.us/oauth/authorize',
    tokenEndpoint: 'https://zoom.us/oauth/token',
};

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

    const redirectUri = makeRedirectUri({
        scheme: 'chalk-app',
        path: 'zoom-callback',
    });

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: ZOOM_CONFIG.clientId,
            scopes: ['user:read', 'meeting:read'],
            redirectUri,
        },
        discovery
    );

    // Load stored token on mount
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                if (storedToken) {
                    setAccessToken(storedToken);
                    await fetchUserInfo(storedToken);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to load Zoom token:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    // Handle OAuth response
    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            // In production, exchange code for token via your backend
            // For now, we'll simulate success
            handleCodeExchange(code);
        }
    }, [response]);

    const handleCodeExchange = async (code: string) => {
        // TODO: Implement server-side token exchange
        // For now, simulate a successful auth
        console.log('Zoom auth code:', code);
        setIsAuthenticated(true);
        setUser({
            id: 'mock-id',
            name: 'Zoom User',
            email: 'user@zoom.com',
        });
    };

    const fetchUserInfo = async (token: string) => {
        try {
            const res = await fetch('https://api.zoom.us/v2/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userInfo = await res.json();
            setUser({
                id: userInfo.id,
                name: `${userInfo.first_name} ${userInfo.last_name}`,
                email: userInfo.email,
                pic_url: userInfo.pic_url,
            });
        } catch (error) {
            console.error('Failed to fetch Zoom user info:', error);
        }
    };

    const signIn = useCallback(async () => {
        if (request) {
            await promptAsync();
        }
    }, [request, promptAsync]);

    const signOut = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Failed to sign out of Zoom:', error);
        }
    }, []);

    return {
        isAuthenticated,
        isLoading,
        user,
        accessToken,
        signIn,
        signOut,
        isReady: !!request,
    };
}
