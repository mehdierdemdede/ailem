import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import client from '../../../services/api/client';
import { theme } from '../../../theme';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    publishedAt: string;
    isNew?: boolean;
}

export const NewsScreen = ({ navigation }: any) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await client.get('/news');
            setNews(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchNews();
    };

    const renderItem = ({ item }: { item: NewsItem }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => navigation.navigate('NewsDetail', { newsItem: item })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>
                        {new Date(item.publishedAt).toLocaleDateString()}
                    </Text>
                </View>
                {/* We'll simulate a 'New' badge logic if needed, or use isNew from API if available */}
                {item.isNew && (
                    <View style={styles.newBadge}>
                        <Text style={styles.newText}>YENİ</Text>
                    </View>
                )}
            </View>

            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

            <View style={styles.accentLine} />

            <Text style={styles.preview} numberOfLines={3}>
                {item.content}
            </Text>

            <View style={styles.readMoreContainer}>
                <Text style={styles.readMoreText}>Devamını Oku →</Text>
            </View>
        </TouchableOpacity>
    );

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
            <Text style={styles.headerTitle}>Fırsatlar & Duyurular</Text>
            <FlatList
                data={news}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.secondary} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Şu an için haber bulunmamaktadır.</Text>
                }
            />
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
    list: {
        padding: theme.spacing.screenPadding,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.spacing.cardBorderRadius,
        padding: theme.spacing.lg,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.secondary, // Gold accent line
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dateBadge: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    dateText: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    newBadge: {
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    newText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    title: {
        fontSize: theme.typography.size.lg,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    accentLine: {
        height: 2,
        width: 40,
        backgroundColor: theme.colors.secondary,
        marginBottom: 10,
    },
    preview: {
        fontSize: theme.typography.size.md,
        color: theme.colors.textSecondary,
        lineHeight: 22,
        marginBottom: 15,
    },
    readMoreContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    readMoreText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: theme.typography.size.sm,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginTop: 40,
        fontSize: theme.typography.size.md,
    },
});
