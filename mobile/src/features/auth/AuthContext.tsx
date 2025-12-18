import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';
import { setAuthToken, registerLogoutCallback } from '../../services/api/client';
import { Alert } from 'react-native';

type AuthContextType = {
    userToken: string | null;
    isLoading: boolean;
    biometryType: BiometryType | undefined;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
    loginWithBiometrics: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Helper for 'lastToken' (simulating secure storage for biometric reuse)
const LAST_TOKEN_KEY = 'lastToken';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [biometryType, setBiometryType] = useState<BiometryType | undefined>(undefined);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await AsyncStorage.getItem('userToken');
            } catch (e) {
                // Restoring token failed
            }
            setUserToken(token || null);
            setAuthToken(token || null);
            setIsLoading(false);

            // Check Biometrics
            const rnBiometrics = new ReactNativeBiometrics();
            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            if (available && biometryType) {
                setBiometryType(biometryType);
            }
        };

        bootstrapAsync();
        bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            userToken,
            isLoading,
            biometryType,
            signIn: async (token: string) => {
                setUserToken(token);
                setAuthToken(token);
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem(LAST_TOKEN_KEY, token); // Store for biometric reuse
            },
            signOut: async () => {
                setUserToken(null);
                setAuthToken(null);
                await AsyncStorage.removeItem('userToken');
                // We keep LAST_TOKEN_KEY so biometric can work later
            },
            loginWithBiometrics: async () => {
                const rnBiometrics = new ReactNativeBiometrics();
                try {
                    const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm Identity' });
                    if (success) {
                        const lastToken = await AsyncStorage.getItem(LAST_TOKEN_KEY);
                        if (lastToken) {
                            setUserToken(lastToken);
                            setAuthToken(lastToken);
                            await AsyncStorage.setItem('userToken', lastToken);
                        } else {
                            Alert.alert('Login Required', 'Please log in with password once to enable biometrics.');
                        }
                    }
                } catch (error) {
                    console.error('Biometric failed', error);
                }
            }
        }),
        [userToken, isLoading, biometryType]
    );

    // Register callback for 401s
    useEffect(() => {
        registerLogoutCallback(() => {
            authContext.signOut();
        });
    }, [authContext]);

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
