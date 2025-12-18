import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StatusBar, Image, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import client from '../../../services/api/client';
import { theme } from '../../../theme';

export const PartnersScreen = ({ navigation }: any) => {
    const [partners, setPartners] = useState<any[]>([]);
    const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [selectedCity, setSelectedCity] = useState('Tümü'); // New
    const [categories, setCategories] = useState<string[]>(['Tümü']);
    const [cities, setCities] = useState<string[]>(['Tümü']); // New
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPartners();
    }, []);

    useEffect(() => {
        filterPartners();
    }, [selectedCategory, selectedCity, searchQuery, partners]);

    const filterPartners = () => {
        let result = partners;

        // Filter by Category
        if (selectedCategory !== 'Tümü') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Filter by City (New)
        if (selectedCity !== 'Tümü') {
            result = result.filter(p => p.city === selectedCity);
        }

        // Filter by Search Query
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description?.toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredPartners(result);
    };

    const fetchPartners = async () => {
        try {
            const response = await client.get('/partners');
            const data = response.data;
            setPartners(data);

            // Extract unique categories
            const uniqueCategories = ['Tümü', ...Array.from(new Set(data.map((p: any) => p.category)))];
            setCategories(uniqueCategories as string[]);

            // Extract unique cities (New)
            const uniqueCities = ['Tümü', ...Array.from(new Set(data.filter((p: any) => p.city).map((p: any) => p.city)))];
            setCities(uniqueCities as string[]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPartners();
    };

    const renderCategory = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected
            ]}
            onPress={() => setSelectedCategory(item)}
        >
            <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextSelected
            ]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PartnerDetail', { partner: item })}
        >
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                </View>
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discount}</Text>
                </View>
            </View>

            {item.description ? (
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            ) : null}
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
            <Text style={styles.headerTitle}>Ayrıcalıklı Partnerler</Text>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Partner ara..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.categoryContainer}>
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            {/* City Filter (New) */}
            <View style={[styles.categoryContainer, { borderBottomWidth: 0, paddingVertical: 5 }]}>
                <FlatList
                    data={cities}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                styles.cityChip,
                                selectedCity === item && styles.activeCityChip
                            ]}
                            onPress={() => setSelectedCity(item)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCity === item && styles.categoryTextSelected
                            ]}>
                                📍 {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                />
            </View>

            <FlatList
                data={filteredPartners}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.secondary} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Partner bulunamadı.</Text>
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
    searchContainer: {
        paddingHorizontal: theme.spacing.screenPadding,
        paddingTop: 10,
        backgroundColor: theme.colors.surface,
    },
    searchInput: {
        backgroundColor: theme.colors.background,
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 45,
        fontSize: 14,
        color: theme.colors.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    categoryContainer: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    categoryList: {
        paddingHorizontal: theme.spacing.screenPadding,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.background,
        marginRight: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cityChip: {
        backgroundColor: '#F5F5F5',
    },
    categoryChipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    activeCityChip: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
        borderWidth: 1,
    },
    categoryText: {
        color: theme.colors.textSecondary,
        fontWeight: '600',
    },
    categoryTextSelected: {
        color: theme.colors.secondary,
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
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.background, // Light gray
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    iconText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: theme.typography.size.lg,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.textPrimary,
    },
    category: {
        fontSize: theme.typography.size.xs,
        color: theme.colors.textSecondary,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    discountBadge: {
        backgroundColor: '#FFF8E1', // Light gold bg
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.secondary,
    },
    discountText: {
        fontSize: theme.typography.size.sm,
        fontWeight: 'bold',
        color: '#F57F17', // Darker gold/orange for text
    },
    description: {
        fontSize: theme.typography.size.sm,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginTop: 40,
        fontSize: theme.typography.size.md,
    },
});
