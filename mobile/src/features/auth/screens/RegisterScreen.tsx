import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import client from '../../../services/api/client';
import { theme } from '../../../theme';

export const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);
        try {
            // Note: Ensuring the backend supports 'name' field, or we ignore it for now
            const response = await client.post('/auth/register', {
                email,
                password,
                name,
            });

            if (response.status === 201 || response.status === 200) {
                Alert.alert('Başarılı', 'Hesap oluşturuldu! Lütfen giriş yapın.', [
                    { text: 'Tamam', onPress: () => navigation.navigate('Login') }
                ]);
            } else {
                Alert.alert('Kayıt Başarısız', 'Hesap oluşturulamadı.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.brandTitle}>Aile 3+'a Katıl</Text>
                <Text style={styles.brandSubtitle}>Premium yolculuğunuza başlayın</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Ad Soyad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor={theme.colors.placeholder}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>E-Posta Adresi</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="john@example.com"
                            placeholderTextColor={theme.colors.placeholder}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Şifre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Güçlü bir şifre oluşturun"
                            placeholderTextColor={theme.colors.placeholder}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    {/* Consent Checkbox Area */}
                    <View style={styles.consentContainer}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setAccepted(!accepted)}
                        >
                            {accepted && <View style={styles.checked} />}
                        </TouchableOpacity>
                        <View style={styles.consentTextContainer}>
                            <Text style={styles.consentText}>
                                <Text style={styles.link} onPress={() => navigation.navigate('KVKK')}>KVKK Aydınlatma Metni</Text>
                                {' ve '}
                                <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>Kullanım Koşulları</Text>
                                {'\'nı okudum, kabul ediyorum.'}
                            </Text>
                        </View>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
                    ) : (
                        <TouchableOpacity
                            onPress={handleRegister}
                            activeOpacity={0.8}
                            disabled={!accepted}
                            style={[styles.touchableButton, !accepted && styles.disabledButton]}
                        >
                            <LinearGradient
                                colors={accepted ? [theme.colors.secondary, '#FDD835'] : ['#e0e0e0', '#bdbdbd']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                <Text style={[styles.buttonText, !accepted && { color: '#999' }]}>HESAP OLUŞTUR</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 40,
        zIndex: 1,
        padding: 5,
    },
    backButtonText: {
        color: theme.colors.surface,
        fontSize: theme.typography.size.md,
    },
    brandTitle: {
        fontSize: 32,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.surface, // White text on dark background for variety
        letterSpacing: 1,
    },
    brandSubtitle: {
        fontSize: theme.typography.size.sm,
        color: theme.colors.secondary, // Gold accent
        letterSpacing: 1,
        marginTop: 5,
    },
    card: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.screenPadding,
        borderRadius: theme.spacing.cardBorderRadius,
        padding: theme.spacing.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: theme.typography.size.sm,
        fontWeight: theme.typography.weight.medium,
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: theme.typography.size.md,
        color: theme.colors.textPrimary,
        backgroundColor: theme.colors.background,
    },
    loader: {
        marginVertical: 20,
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: theme.colors.textPrimary,
        fontSize: theme.typography.size.md,
        fontWeight: theme.typography.weight.bold,
        letterSpacing: 1,
    },
    consentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        width: 14,
        height: 14,
        backgroundColor: theme.colors.secondary,
        borderRadius: 2,
    },
    consentTextContainer: {
        flex: 1,
    },
    consentText: {
        fontSize: 12,
        color: theme.colors.textPrimary,
        lineHeight: 18,
    },
    link: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    touchableButton: {
        marginTop: 10,
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        borderRadius: 8,
    },
    disabledButton: {
        shadowOpacity: 0,
        elevation: 0,
    }
});
