import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../auth/AuthContext';
import client from '../../../services/api/client';
import { theme } from '../../../theme';
import { IconBell, IconLock, IconShield, IconChevronRight } from '../../../components/Icons';

export const ProfileScreen = () => {
    const { signOut } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchProfile();
        }, [])
    );

    const fetchProfile = async () => {
        try {
            const response = await client.get('/families/me');
            if (response.status === 200) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Çıkış yapmak istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                { text: 'Çıkış Yap', style: 'destructive', onPress: signOut },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <Text style={styles.headerTitle}>Profilim</Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {profile ? (
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>
                                {profile.fatherName ? profile.fatherName.charAt(0) : 'A'}
                            </Text>
                        </View>
                        <Text style={styles.name}>
                            {profile.fatherName} & {profile.motherName}
                        </Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{profile.status}</Text>
                        </View>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.numberOfChildren}</Text>
                                <Text style={styles.statLabel}>Çocuk</Text>
                            </View>
                            <View style={[styles.statItem, styles.statBorder]}>
                                <Text style={styles.statNumber}>
                                    {new Date(profile.createdAt).getFullYear()}
                                </Text>
                                <Text style={styles.statLabel}>Üyelik Yılı</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>Aile detayları bulunamadı.</Text>
                )}





                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ayarlar</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconBell color={theme.colors.primary} size={22} />
                            <Text style={styles.menuText}>Bildirimler</Text>
                        </View>
                        <IconChevronRight color={theme.colors.textSecondary} size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconLock color={theme.colors.primary} size={22} />
                            <Text style={styles.menuText}>Şifre Değiştir</Text>
                        </View>
                        <IconChevronRight color={theme.colors.textSecondary} size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconShield color={theme.colors.primary} size={22} />
                            <Text style={styles.menuText}>Gizlilik Politikası</Text>
                        </View>
                        <IconChevronRight color={theme.colors.textSecondary} size={20} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Çıkış Yap</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Versiyon 1.0.0</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.primary,
        paddingVertical: 20,
        textAlign: 'center',
        backgroundColor: theme.colors.surface,
        elevation: 2,
    },
    scrollContent: {
        padding: theme.spacing.screenPadding,
    },
    profileCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.spacing.cardBorderRadius,
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: theme.colors.secondary,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.secondary,
    },
    name: {
        fontSize: theme.typography.size.xl,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    statusBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        marginBottom: 20,
    },
    statusText: {
        color: theme.colors.primary,
        fontSize: theme.typography.size.sm,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 15,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.border,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: theme.typography.size.md,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.textSecondary,
        marginBottom: 10,
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 16, // Increased padding
        marginBottom: 12, // Increased spacing
        borderRadius: 12, // More rounded
        borderWidth: 1,
        borderColor: '#F0F0F0', // Subtle border
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15, // Gap between icon and text
    },
    menuText: {
        fontSize: 16,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#FFEBEE',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    logoutText: {
        color: '#D32F2F',
        fontSize: theme.typography.size.md,
        fontWeight: 'bold',
    },
    versionText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: 16,
        marginBottom: 20,
    }
});
