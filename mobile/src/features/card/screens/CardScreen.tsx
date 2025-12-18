import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, StatusBar, TouchableOpacity, RefreshControl, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../auth/AuthContext';
import client from '../../../services/api/client';
import { theme } from '../../../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const CardScreen = ({ navigation }: any) => {
    const { userToken } = useAuth();
    const [family, setFamily] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [qrToken, setQrToken] = useState<string>('');

    useEffect(() => {
        fetchCardData();
    }, []);

    useEffect(() => {
        if (family?.card) {
            fetchQrToken();
            const interval = setInterval(fetchQrToken, 45000); // 45s refresh
            return () => clearInterval(interval);
        }
    }, [family]);

    const fetchCardData = async () => {
        try {
            const response = await client.get('/families/me');
            setFamily(response.data);
        } catch (error) {
            console.error('Error fetching card data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchQrToken = async () => {
        try {
            const response = await client.get('/cards/qr-token');
            if (response.data && response.data.token) {
                setQrToken(response.data.token);
            }
        } catch (error) {
            console.error('Error fetching QR token:', error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchCardData();
        fetchQrToken();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.secondary} />
            </View>
        );
    }

    const renderContent = () => {
        if (!family) {
            return (
                <View style={styles.stateContainer}>
                    <Text style={styles.stateTitle}>Aile 3+'a Hoşgeldiniz</Text>
                    <Text style={styles.stateMessage}>Aile detayları yüklenemedi.</Text>
                    <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                        <Text style={styles.retryText}>Tekrar Dene</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('FamilyRegistration')} style={[styles.retryButton, { backgroundColor: theme.colors.primary, marginTop: 20 }]}>
                        <Text style={styles.retryText}>Aile Başvurusunu Tamamla</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={async () => {
                        try {
                            setLoading(true);
                            await client.post('/families/seed');
                            await fetchCardData();
                        } catch (e) {
                            console.error(e);
                            setLoading(false);
                            Alert.alert('Error', 'Failed to seed data');
                        }
                    }} style={[styles.retryButton, { backgroundColor: theme.colors.secondary, marginTop: 10 }]}>
                        <Text style={styles.retryText}>Test Verisi Oluştur (Geliştirici)</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (family.status === 'PENDING') {
            return (
                <View style={styles.stateContainer}>
                    <View style={styles.statusBadgePending}>
                        <Text style={styles.statusTextPending}>⏳ İnceleme Devam Ediyor</Text>
                    </View>
                    <Text style={styles.stateTitle}>Başvuru Alındı</Text>
                    <Text style={styles.stateMessage}>
                        Başvurunuz ekibimiz tarafından inceleniyor.
                        Onaylandığında premium dijital kartınız burada görünecektir.
                    </Text>
                </View>
            );
        }

        if (family.status === 'REJECTED') {
            return (
                <View style={styles.stateContainer}>
                    <View style={styles.statusBadgeRejected}>
                        <Text style={styles.statusTextRejected}>❌ Başvuru Reddedildi</Text>
                    </View>
                    <Text style={styles.stateTitle}>Durum Güncellemesi</Text>
                    <Text style={styles.stateMessage}>
                        Maalesef başvurunuz şu an için onaylanmadı.
                    </Text>
                </View>
            );
        }

        if (!family.card) {
            return (
                <View style={styles.stateContainer}>
                    <Text style={styles.stateTitle}>Kart Oluşturuluyor...</Text>
                    <Text style={styles.stateMessage}>
                        Onaylandı. Kartınız oluşturuluyor.
                    </Text>
                </View>
            );
        }

        // Active Card UI
        return (
            <View style={styles.cardWrapper}>
                <LinearGradient
                    colors={[theme.colors.secondary, '#FB8C00']} // Gold to Orange/Darker Gold
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>PREMIUM ÜYE</Text>
                        <Text style={styles.cardBrand}>Aile 3+</Text>
                    </View>

                    <Text style={styles.memberName}>{family.fatherName} & {family.motherName}</Text>

                    <View style={styles.qrContainer}>
                        <QRCode
                            value={qrToken || family.card.qrCodeData}
                            size={180}
                            color="black"
                            backgroundColor="white"
                        />
                    </View>

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.cardLabelSmall}>KART NUMARASI</Text>
                            <Text style={styles.cardNumber}>{family.card.cardNumber}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabelSmall}>GEÇERLİLİK TARİHİ</Text>
                            <Text style={styles.validity}>
                                {new Date(family.card.validUntil).toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <Text style={styles.instructionText}>
                    Bu QR kodunu anlaşmalı noktalarda göstererek avantajlardan yararlanabilirsiniz.
                </Text>

                <TouchableOpacity onPress={async () => {
                    try {
                        setLoading(true);
                        await client.post('/families/seed');
                        await fetchCardData();
                        Alert.alert('Bilgi', 'Bilgiler güncellendi!');
                    } catch (e) {
                        console.error(e);
                        setLoading(false);
                        Alert.alert('Hata', 'Güncelleme başarısız');
                    }
                }} style={{ marginTop: 20, padding: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Bilgileri Güncelle (Dev)</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <Text style={styles.headerTitle}>Dijital Kartım</Text>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.secondary} />
                }
            >
                {renderContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary, // Deep Navy Background
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.surface,
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    // States
    stateContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        elevation: 5,
    },
    stateTitle: {
        fontSize: 22,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 10,
        marginTop: 10,
    },
    stateMessage: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    retryButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
    },
    retryText: {
        color: theme.colors.surface,
        fontWeight: 'bold',
    },
    statusBadgePending: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusTextPending: {
        color: '#E65100',
        fontWeight: 'bold',
    },
    statusBadgeRejected: {
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusTextRejected: {
        color: '#C62828',
        fontWeight: 'bold',
    },
    // Card
    cardWrapper: {
        alignItems: 'center',
    },
    card: {
        width: '100%',
        borderRadius: 20,
        padding: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    cardLabel: {
        color: '#FFF8E1',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    cardBrand: {
        color: theme.colors.surface,
        fontWeight: 'bold',
        fontSize: 16,
        fontStyle: 'italic',
    },
    memberName: {
        fontSize: 22,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.surface,
        marginBottom: 20,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    qrContainer: {
        alignSelf: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 20,
        elevation: 5,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cardLabelSmall: {
        color: '#FFF8E1',
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    cardNumber: {
        color: theme.colors.surface,
        fontSize: 14,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    validity: {
        color: theme.colors.surface,
        fontSize: 14,
        fontWeight: 'bold',
    },
    instructionText: {
        marginTop: 30,
        color: theme.colors.surface,
        opacity: 0.8,
        textAlign: 'center',
        fontSize: 14,
        paddingHorizontal: 20,
    },
});
