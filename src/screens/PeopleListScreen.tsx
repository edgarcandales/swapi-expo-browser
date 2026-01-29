import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { Person } from '../api/types';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Loader } from '../components/Loader';
import { usePeopleList } from '../hooks/usePeople';
import { RootStackParamList } from '../navigation/RootNavigator';
import { queryKeys } from '../state/queryKeys';
import { useSwapiClient } from '../state/SwapiClientContext';
import { theme } from '../theme';
import { describeError } from '../utils/errors';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'PeopleList'>;

export function PeopleListScreen() {
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();
  const client = useSwapiClient();
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

  const prefetchPersonBundle = useCallback(
    (person: Person) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.person(person.id),
        queryFn: () => client.getPerson(person.id),
        staleTime: 5 * 60_000,
      });

      if (person.homeworldId) {
        queryClient.prefetchQuery({
          queryKey: queryKeys.planet(person.homeworldId),
          queryFn: () => client.getPlanet(person.homeworldId as number),
          staleTime: 10 * 60_000,
        });
      }

      if (person.filmIds.length) {
        queryClient.prefetchQuery({
          queryKey: queryKeys.films(person.filmIds),
          queryFn: () => client.getFilms(person.filmIds),
          staleTime: 10 * 60_000,
        });
      }
    },
    [client, queryClient],
  );

  const onPersonPress = useCallback(
    (person: Person) => {
      prefetchPersonBundle(person);
      navigation.navigate('PersonDetail', { personId: person.id, name: person.name });
    },
    [navigation, prefetchPersonBundle],
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
    paddingVertical: theme.spacing.lg,
  },
  cardWrapper: {
    borderRadius: theme.radius.lg,
  },
  cardPressed: {
    opacity: 0.92,
  },
  title: {
    ...theme.typography.title,
    marginBottom: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  metaLabel: {
    ...theme.typography.body,
  },
  metaValue: {
    ...theme.typography.bodyStrong,
  },
  separator: {
    height: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  footerText: {
    color: theme.colors.muted,
  },
});
