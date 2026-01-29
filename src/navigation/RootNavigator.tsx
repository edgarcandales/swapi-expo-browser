import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { PeopleListScreen } from '../screens/PeopleListScreen';
import { PersonDetailScreen } from '../screens/PersonDetailScreen';

export type RootStackParamList = {
  PeopleList: undefined;
  PersonDetail: { personId: number; name?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    text: colors.textPrimary,
    primary: colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="PeopleList"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          contentStyle: { backgroundColor: colors.background, paddingHorizontal: spacing.lg },
        }}
      >
        <Stack.Screen name="PeopleList" component={PeopleListScreen} options={{ title: 'People' }} />
        <Stack.Screen
          name="PersonDetail"
          component={PersonDetailScreen}
          options={({ route }) => ({ title: route.params.name ?? 'Person' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
