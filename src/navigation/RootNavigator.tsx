import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PeopleListScreen } from '../screens/PeopleListScreen';
import { PersonDetailScreen } from '../screens/PersonDetailScreen';
import { theme } from '../theme';

export type RootStackParamList = {
  PeopleList: undefined;
  PersonDetail: { personId: number; name?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    border: theme.colors.border,
    text: theme.colors.textPrimary,
    primary: theme.colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="PeopleList"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.textPrimary,
          contentStyle: { backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.lg },
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
