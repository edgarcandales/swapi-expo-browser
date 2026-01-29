export const queryKeys = {
  people: ['people'] as const,
  person: (id: number) => ['person', id] as const,
  planet: (id: number) => ['planet', id] as const,
  films: (ids: number[]) => ['films', ids.slice().sort((a, b) => a - b).join(',')] as const,
};
