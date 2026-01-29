import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { theme } from '../theme';

export function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
