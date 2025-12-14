import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';

const API_URL = 'http://10.0.2.2:3000';

export const PartnersScreen = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await fetch(`${API_URL}/partners`);
            if (response.ok) {
                const data = await response.json();
                setPartners(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.discount}>{item.discount}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
        </View>
    );

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Partners</Text>
            <FlatList
                data={partners}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    discount: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
        marginTop: 5,
    },
});
