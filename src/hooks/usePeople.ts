import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';

import { ApiError } from '../api/swapiClient';
import { PeoplePage } from '../api/types';
import { useSwapiClient } from '../state/SwapiClientContext';

export function usePeopleList() {
  const client = useSwapiClient();

  return useInfiniteQuery<PeoplePage, ApiError, InfiniteData<PeoplePage, number>, ['people'], number>({
    queryKey: ['people'],
    queryFn: ({ pageParam = 1 }) => client.getPeoplePage(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });
}
