import { useQuery } from '@tanstack/react-query';

import { useSwapiClient } from '../state/SwapiClientContext';

export function usePersonDetails(personId: number) {
  const client = useSwapiClient();

  const personQuery = useQuery({
    queryKey: ['person', personId],
    queryFn: () => client.getPerson(personId),
    enabled: personId > 0,
    staleTime: 5 * 60_000,
  });

  const homeworldId = personQuery.data?.homeworldId;
  const filmIds = personQuery.data?.filmIds ?? [];

  const planetQuery = useQuery({
    queryKey: ['planet', homeworldId],
    queryFn: () => client.getPlanet(homeworldId as number),
    enabled: Boolean(homeworldId),
    staleTime: 10 * 60_000,
  });

  const filmsQuery = useQuery({
    queryKey: ['films', filmIds.join(',')],
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
