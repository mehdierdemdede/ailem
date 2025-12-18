import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../AuthContext';
import client from '../../../services/api/client';
import { theme } from '../../../theme';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, biometryType, loginWithBiometrics } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);
        try {
            const response = await client.post('/auth/login', { email, password });
            const data = response.data;

            if (data.access_token) {
                await signIn(data.access_token);
            } else {
                Alert.alert('Giriş Başarısız', data.error || 'Geçersiz kimlik bilgileri');
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

            {/* Background Gradient / Color */}
            <View style={styles.header}>
                <Text style={styles.brandTitle}>Aile 3+</Text>
                <Text style={styles.brandSubtitle}>Premium Aile Avantajları</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.title}>Tekrar Hoşgeldiniz</Text>
                <Text style={styles.subtitle}>Dijital kartınıza erişmek için giriş yapın</Text>

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
                        placeholder="••••••••"
                        placeholderTextColor={theme.colors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
                ) : (
                    <>
                        <TouchableOpacity onPress={handleLogin} activeOpacity={0.8}>
                            <LinearGradient
                                colors={[theme.colors.secondary, '#FDD835']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>GİRİŞ YAP</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Biometric Login Button */}
                        {biometryType && (
                            <TouchableOpacity onPress={loginWithBiometrics} style={styles.bioButton}>
                                <Text style={styles.bioText}>
                                    {biometryType === 'FaceID' ? 'Face ID' : 'Touch ID'} ile Giriş Yap
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    style={styles.linkContainer}
                >
                    <Text style={styles.linkText}>
                        Hesabınız yok mu? <Text style={styles.linkHighlight}>Kayıt Ol</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    brandTitle: {
        fontSize: 42,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.secondary,
        letterSpacing: 1,
    },
    brandSubtitle: {
        fontSize: theme.typography.size.md,
        color: theme.colors.textInverse,
        opacity: 0.8,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginTop: 5,
    },
    card: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.screenPadding,
        borderRadius: theme.spacing.cardBorderRadius,
        padding: theme.spacing.xl,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: theme.typography.size.xl,
        fontWeight: theme.typography.weight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: theme.typography.size.sm,
        color: theme.colors.textSecondary,
        marginBottom: 30,
        textAlign: 'center',
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
        color: theme.colors.textPrimary, // Dark text on Gold looks better
        fontSize: theme.typography.size.md,
        fontWeight: theme.typography.weight.bold,
        letterSpacing: 1,
    },
    linkContainer: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        fontSize: theme.typography.size.sm,
        color: theme.colors.textSecondary,
    },
    linkHighlight: {
        color: theme.colors.primary,
        fontWeight: theme.typography.weight.bold,
    },
    bioButton: {
        marginTop: 15,
        alignItems: 'center',
        padding: 10,
    },
    bioText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: theme.typography.size.md,
    },
});
