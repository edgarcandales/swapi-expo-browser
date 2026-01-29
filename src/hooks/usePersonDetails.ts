import { useQuery } from '@tanstack/react-query';

import { useSwapiClient } from '../state/SwapiClientContext';
import { queryKeys } from '../state/queryKeys';

export function usePersonDetails(personId: number) {
  const client = useSwapiClient();

  const personQuery = useQuery({
    queryKey: queryKeys.person(personId),
    queryFn: () => client.getPerson(personId),
    enabled: personId > 0,
    staleTime: 5 * 60_000,
  });

  const homeworldId = personQuery.data?.homeworldId;
  const filmIds = personQuery.data?.filmIds ?? [];

  const planetQuery = useQuery({
    queryKey: queryKeys.planet(homeworldId as number),
    queryFn: () => client.getPlanet(homeworldId as number),
    enabled: Boolean(homeworldId),
    staleTime: 10 * 60_000,
  });

  const filmsQuery = useQuery({
    queryKey: queryKeys.films(filmIds),
    queryFn: () => client.getFilms(filmIds),
    enabled: filmIds.length > 0,
    staleTime: 10 * 60_000,
  });

  return {
    personQuery,
    planetQuery,
    filmsQuery,
  };
}
