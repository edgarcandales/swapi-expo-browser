import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nothing to show</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    marginTop: spacing.xs,
  },
});
