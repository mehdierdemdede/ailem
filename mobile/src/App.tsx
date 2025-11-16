import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {AppContainer} from './core/di/container';
import {Typography} from './shared/components/Typography';
import {useAppTheme} from './core/theme/theme';

export const App = (): JSX.Element => {
  const theme = useAppTheme();

  return (
    <AppContainer>
      <StatusBar barStyle={theme.statusBar} />
      <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}> 
        <Typography variant="title">AilePlus Mobile</Typography>
        <Typography>
          Clean architecture scaffold ready for features.
        </Typography>
      </SafeAreaView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default App;
