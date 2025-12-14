import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    userToken: string | null;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await AsyncStorage.getItem('userToken');
            } catch (e) {
                // Restoring token failed
            }
            setUserToken(token || null);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            userToken,
            isLoading,
            signIn: async (token: string) => {
                setUserToken(token);
                await AsyncStorage.setItem('userToken', token);
            },
            signOut: async () => {
                setUserToken(null);
                await AsyncStorage.removeItem('userToken');
            },
        }),
        [userToken, isLoading]
    );

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
