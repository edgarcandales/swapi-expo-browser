import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

export interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.body,
  },
  value: {
    ...theme.typography.bodyStrong,
    maxWidth: '65%',
    textAlign: 'right',
  },
});
