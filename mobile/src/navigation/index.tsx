import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button } from 'react-native';

import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';

import { PartnersScreen } from '../features/partners/screens/PartnersScreen';
import { NewsScreen } from '../features/news/screens/NewsScreen';

import { CardScreen } from '../features/card/screens/CardScreen';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
);

const AppNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Card" component={CardScreen} />
        <Tab.Screen name="Partners" component={PartnersScreen} />
        <Tab.Screen name="News" component={NewsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

export const Navigation = () => {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {userToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};
