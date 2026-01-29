import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { theme } from '../theme';

export interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  withPadding?: boolean;
}

export function Screen({ children, style, withPadding = true }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, withPadding && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
  },
});
