import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../auth/AuthContext';

const API_URL = 'http://10.0.2.2:3000';

export const ProfileScreen = () => {
    const { signOut, userToken } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/families/me`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data); // Expecting FamilyDetails
            } else {
                // Handle 401 or 404
                // Alert.alert("Error", "Could not fetch profile");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            {profile ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Father: {profile.fatherName}</Text>
                    <Text style={styles.label}>Mother: {profile.motherName}</Text>
                    <Text style={styles.label}>Children: {profile.numberOfChildren}</Text>
                    <Text style={styles.label}>Status: {profile.status}</Text>
                </View>
            ) : (
                <Text style={styles.text}>Family details not found.</Text>
            )}

            <View style={styles.logoutButton}>
                <Button title="Sign Out" onPress={signOut} color="red" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    logoutButton: {
        marginTop: 'auto',
    }
});
