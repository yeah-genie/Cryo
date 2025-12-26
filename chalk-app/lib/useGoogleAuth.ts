import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useState, useEffect } from 'react';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

// Mock Auth Hook for Google
export function useGoogleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; photo?: string } | null>(null);

  // In a real app, you would use Google.useAuthRequest here with client IDs
  // const [request, response, promptAsync] = Google.useAuthRequest({ ... });

  // Mock Login
  const signIn = async () => {
    // Simulate network delay
    setTimeout(() => {
        setIsAuthenticated(true);
        setUser({
            name: 'Alex Chen',
            email: 'alex.chen@tutor.com',
            photo: 'https://i.pravatar.cc/150?u=alex',
        });
    }, 1000);
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
