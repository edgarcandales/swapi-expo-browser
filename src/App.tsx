import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './navigation/RootNavigator';
import { AppQueryClientProvider } from './state/queryClient';
import { SwapiClientProvider } from './state/SwapiClientContext';
import { theme } from './theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppQueryClientProvider>
        <SwapiClientProvider>
          <RootNavigator />
          <StatusBar style="light" backgroundColor={theme.colors.surface} />
        </SwapiClientProvider>
      </AppQueryClientProvider>
    </SafeAreaProvider>
  );
}
