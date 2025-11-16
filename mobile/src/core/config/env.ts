import {Platform} from 'react-native';

type EnvConfig = {
  apiBaseUrl: string;
  appEnv: 'development' | 'staging' | 'production';
};

const getEnv = (): EnvConfig => {
  const apiBaseUrl = process.env.API_BASE_URL ?? 'https://api.example.com';
  const appEnv = (process.env.APP_ENV as EnvConfig['appEnv']) ?? 'development';

  return {
    apiBaseUrl,
    appEnv,
  };
};

export const env = getEnv();
export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';
