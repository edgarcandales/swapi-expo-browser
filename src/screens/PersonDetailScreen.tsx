import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { ErrorState } from '../components/ErrorState';
import { InfoRow } from '../components/InfoRow';
import { Loader } from '../components/Loader';
import { usePersonDetails } from '../hooks/usePersonDetails';
import { RootStackParamList } from '../navigation/RootNavigator';
import { theme } from '../theme';
import { describeError } from '../utils/errors';
import { displayOrFallback, formatList, formatNumber } from '../utils/format';

type PersonDetailRoute = RouteProp<RootStackParamList, 'PersonDetail'>;

export function PersonDetailScreen() {
  const {
    params: { personId },
  } = useRoute<PersonDetailRoute>();

  const { personQuery, planetQuery, filmsQuery } = usePersonDetails(personId);

  if (personQuery.isLoading) {
    return <Loader />;
  }

  if (personQuery.isError) {
    return <ErrorState message={describeError(personQuery.error)} onRetry={personQuery.refetch} />;
  }

  const person = personQuery.data;
  if (!person) {
    return <ErrorState message="Person not found" onRetry={personQuery.refetch} />;
  }

  const planetName =
    planetQuery.data?.name ??
    (planetQuery.isLoading ? 'Loading...' : planetQuery.isError ? 'Unknown' : 'Unknown');

  const filmList =
    filmsQuery.data?.map((film) => `${film.title} (${new Date(film.releaseDate).getFullYear()})`) ??
    (filmsQuery.isLoading ? ['Loading films...'] : []);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Card style={styles.cardSpacing}>
        <Text style={styles.name}>{person.name}</Text>
        <View style={styles.section}>
          <InfoRow label="Birth year" value={displayOrFallback(person.birthYear)} />
          <InfoRow label="Gender" value={displayOrFallback(person.gender)} />
          <InfoRow label="Height" value={formatNumber(person.heightCm, 'cm')} />
          <InfoRow label="Mass" value={formatNumber(person.massKg, 'kg')} />
        </View>
      </Card>

      <Card style={styles.cardSpacing}>
        <Text style={styles.sectionTitle}>Homeworld</Text>
        <InfoRow label="Name" value={planetName} />
        {planetQuery.data ? (
          <>
            <InfoRow label="Climate" value={displayOrFallback(planetQuery.data.climate)} />
            <InfoRow label="Terrain" value={displayOrFallback(planetQuery.data.terrain)} />
            <InfoRow
              label="Population"
              value={planetQuery.data.population ? formatNumber(planetQuery.data.population) : 'Unknown'}
            />
          </>
        ) : null}
        {planetQuery.isError ? (
          <Text style={styles.inlineError}>Failed to load planet: {describeError(planetQuery.error)}</Text>
        ) : null}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Films</Text>
        <Text style={styles.bodyText}>
          {filmList.length ? formatList(filmList) : 'None'}
        </Text>
        {filmsQuery.isError ? (
          <Text style={styles.inlineError}>Failed to load films: {describeError(filmsQuery.error)}</Text>
        ) : null}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: theme.spacing.lg,
  },
  cardSpacing: {
    marginBottom: theme.spacing.lg,
  },
  name: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    marginBottom: theme.spacing.sm,
  },
  bodyText: {
    ...theme.typography.body,
  },
  inlineError: {
    color: theme.colors.error,
    marginTop: theme.spacing.sm,
  },
});
