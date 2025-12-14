import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const API_URL = 'http://10.0.2.2:3000';

export const NewsScreen = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch(`${API_URL}/news`);
            if (response.ok) {
                const data = await response.json();
                setNews(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
            <Text style={styles.content}>{item.content}</Text>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>News</Text>
            <FlatList
                data={news}
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginBottom: 10,
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
    },
});
