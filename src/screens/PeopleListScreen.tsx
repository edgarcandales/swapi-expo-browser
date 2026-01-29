import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Person } from '../api/types';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Loader } from '../components/Loader';
import { usePeopleList } from '../hooks/usePeople';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { describeError } from '../utils/errors';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'PeopleList'>;

export function PeopleListScreen() {
  const navigation = useNavigation<Navigation>();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = usePeopleList();

  const people = data?.pages.flatMap((page) => page.people) ?? [];

  const onPersonPress = useCallback(
    (person: Person) => navigation.navigate('PersonDetail', { personId: person.id, name: person.name }),
    [navigation],
  );

  const renderPerson = ({ item }: ListRenderItemInfo<Person>) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPersonPress(item)}
      style={({ pressed }) => [styles.cardWrapper, pressed && styles.cardPressed]}
    >
      <Card>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Birth year</Text>
          <Text style={styles.metaValue}>{item.birthYear || 'Unknown'}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Gender</Text>
          <Text style={styles.metaValue}>{item.gender || 'Unknown'}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Films</Text>
          <Text style={styles.metaValue}>{item.filmIds.length}</Text>
        </View>
        {item.homeworldId ? (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Homeworld</Text>
            <Text style={styles.metaValue}>Planet #{item.homeworldId}</Text>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Loading more...</Text>
        </View>
      );
    }
    if (!hasNextPage) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>End of list</Text>
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorState message={describeError(error)} onRetry={refetch} />;
  }

  if (!people.length) {
    return <EmptyState message="No people found. Pull to refresh." />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={people}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderPerson}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.4}
      refreshing={isRefetching}
      onRefresh={refetch}
      ListFooterComponent={renderFooter}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      accessibilityLabel={`People list (${people.length} items)`}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: spacing.lg,
  },
  cardWrapper: {
    borderRadius: 12,
  },
  cardPressed: {
    opacity: 0.92,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  metaLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  metaValue: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  separator: {
    height: spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    color: colors.muted,
  },
});
