import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../auth/AuthContext';

const API_URL = 'http://10.0.2.2:3000';
const SCREEN_WIDTH = Dimensions.get('window').width;

export const CardScreen = () => {
    const { userToken } = useAuth();
    const [family, setFamily] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCardData();
    }, []);

    const fetchCardData = async () => {
        try {
            const response = await fetch(`${API_URL}/families/me`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setFamily(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    if (!family) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Could not load family details.</Text>
            </View>
        );
    }

    if (family.status === 'PENDING') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Application Pending</Text>
                <Text style={styles.message}>
                    Your application is currently under review. Once approved, your digital card will appear here.
                </Text>
            </View>
        );
    }

    if (family.status === 'REJECTED') {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Application Rejected</Text>
                <Text style={styles.message}>
                    Unfortunately, your application was not approved. Please contact support.
                </Text>
            </View>
        );
    }

    if (!family.card) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No Card Found</Text>
                <Text style={styles.message}>
                    Your status is approved but the card has not been generated yet.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>AilePlus Card</Text>

            <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>Family Card</Text>
                <Text style={styles.cardName}>{family.fatherName} & {family.motherName}</Text>

                <View style={styles.qrContainer}>
                    <QRCode
                        value={family.card.qrCodeData}
                        size={SCREEN_WIDTH * 0.5}
                    />
                </View>

                <Text style={styles.cardNumber}>{family.card.cardNumber}</Text>
                <Text style={styles.validity}>Valid Until: {new Date(family.card.validUntil).toLocaleDateString()}</Text>
            </View>

            <Text style={styles.infoText}>Show this QR code to partners to claim your discount.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginTop: 10,
    },
    cardContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardTitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    cardName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    qrContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
    },
    cardNumber: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'monospace',
        letterSpacing: 1,
    },
    validity: {
        marginTop: 5,
        fontSize: 12,
        color: '#888',
    },
    infoText: {
        marginTop: 30,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
});
