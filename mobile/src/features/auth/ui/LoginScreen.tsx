import React from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import {useLoginUser} from '../application/loginUser';
import {Typography} from '../../shared/components/Typography';

export const LoginScreen: React.FC = () => {
  const {login} = useLoginUser();
  const [email, setEmail] = React.useState('demo@aileplus.com');
  const [password, setPassword] = React.useState('password');

  const onSubmit = async () => {
    await login({email, password});
  };

  return (
    <View style={styles.container}>
      <Typography variant="title">Welcome back</Typography>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Sign in" onPress={onSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
  },
});
