import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../features/auth/AuthContext';
import { theme } from '../theme';

import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { CardScreen } from '../features/card/screens/CardScreen';
import { PartnersScreen } from '../features/partners/screens/PartnersScreen';
import { NewsScreen } from '../features/news/screens/NewsScreen';

import { PartnerDetailScreen } from '../features/partners/screens/PartnerDetailScreen';
import { NewsDetailScreen } from '../features/news/screens/NewsDetailScreen';

import { FamilyRegistrationScreen } from '../features/family/screens/FamilyRegistrationScreen';

const AuthStack = createNativeStackNavigator();
const PartnersStack = createNativeStackNavigator();
const NewsStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PartnersNavigator = () => (
    <PartnersStack.Navigator screenOptions={{ headerShown: false }}>
        <PartnersStack.Screen name="PartnersList" component={PartnersScreen} />
        <PartnersStack.Screen
            name="PartnerDetail"
            component={PartnerDetailScreen}
            options={{ presentation: 'modal' }}
        />
    </PartnersStack.Navigator>
);

const NewsNavigator = () => (
    <NewsStack.Navigator screenOptions={{ headerShown: false }}>
        <NewsStack.Screen name="NewsList" component={NewsScreen} />
        <NewsStack.Screen
            name="NewsDetail"
            component={NewsDetailScreen}
            options={{ presentation: 'card' }}
        />
    </NewsStack.Navigator>
);

import { KVKKScreen } from '../features/legal/screens/KVKKScreen';
import { TermsScreen } from '../features/legal/screens/TermsScreen';

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
        <AuthStack.Screen name="KVKK" component={KVKKScreen} options={{ presentation: 'modal' }} />
        <AuthStack.Screen name="Terms" component={TermsScreen} options={{ presentation: 'modal' }} />
    </AuthStack.Navigator>
);

import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';

// ...

import { IconCard, IconPartners, IconNews, IconBell, IconProfile } from '../components/Icons';

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                const iconSize = 28;
                if (route.name === 'Card') {
                    return <IconCard color={color} size={iconSize} />;
                } else if (route.name === 'Partners') {
                    return <IconPartners color={color} size={iconSize} />;
                } else if (route.name === 'News') {
                    return <IconNews color={color} size={iconSize} />;
                } else if (route.name === 'Notifications') {
                    return <IconBell color={color} size={iconSize} />;
                } else if (route.name === 'Profile') {
                    return <IconProfile color={color} size={iconSize} />;
                }
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                height: 60,
                paddingBottom: 8,
                paddingTop: 8,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
            }
        })}
    >
        <Tab.Screen name="Card" component={CardScreen} options={{ headerShown: false, title: 'Kartım' }} />
        <Tab.Screen name="Partners" component={PartnersNavigator} options={{ headerShown: false, title: 'Partnerler' }} />
        <Tab.Screen name="News" component={NewsNavigator} options={{ headerShown: false, title: 'Fırsatlar' }} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false, title: 'Bildirimler' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false, title: 'Profil' }} />
    </Tab.Navigator>
);

const AppNavigator = () => (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Tabs" component={TabNavigator} />
        <AppStack.Screen name="FamilyRegistration" component={FamilyRegistrationScreen} />
    </AppStack.Navigator>
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
