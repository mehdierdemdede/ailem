import {useMemo} from 'react';

type Palette = {
  background: string;
  textPrimary: string;
  accent: string;
};

type AppTheme = {
  colors: Palette;
  statusBar: 'light-content' | 'dark-content';
};

const lightPalette: Palette = {
  background: '#ffffff',
  textPrimary: '#1a1a1a',
  accent: '#1c7ed6',
};

const lightTheme: AppTheme = {
  colors: lightPalette,
  statusBar: 'dark-content',
};

export const useAppTheme = (): AppTheme => {
  return useMemo(() => lightTheme, []);
};
