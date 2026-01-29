import { createSwapiClient } from '../src/api/swapiClient';

const peoplePayload = {
  results: [
    {
      name: 'Leia Organa',
      height: '150',
      mass: '49',
      gender: 'female',
      birth_year: '19BBY',
      homeworld: 'https://swapi.dev/api/planets/2/',
      films: ['https://swapi.dev/api/films/1/'],
      url: 'https://swapi.dev/api/people/5/',
    },
  ],
  next: null,
  previous: null,
};

function buildFetchStub(data: unknown, status = 200) {
  const fetchStub = jest.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
  );
  return fetchStub as unknown as typeof fetch;
}

describe('swapiClient', () => {
  it('fetches and maps people page', async () => {
    const fetchStub = buildFetchStub(peoplePayload);
    const client = createSwapiClient('https://swapi.dev/api', fetchStub);

    const result = await client.getPeoplePage(1);

    expect(fetchStub).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=1', expect.anything());
    expect(result.people[0].name).toBe('Leia Organa');
    expect(result.people[0].id).toBe(5);
  });

  it('maps server errors', async () => {
    const fetchStub = buildFetchStub({ error: 'fail' }, 500);
    const client = createSwapiClient('https://swapi.dev/api', fetchStub);

    await expect(client.getPeoplePage(1)).rejects.toMatchObject({ kind: 'server', status: 500 });
  });

  it('maps network errors', async () => {
    const fetchStub = jest.fn(async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;
    const client = createSwapiClient('https://swapi.dev/api', fetchStub);

    await expect(client.getPerson(1)).rejects.toMatchObject({ kind: 'network' });
  });

  it('falls back to secondary base url on retryable failure', async () => {
    const fetchStub = jest.fn(
      async (input: RequestInfo | URL) =>
        new Promise((resolve, reject) => {
          const url = input.toString();
          if (url.startsWith('https://swapi.dev')) {
            reject(new Error('primary down'));
            return;
          }
          resolve(
            new Response(JSON.stringify(peoplePayload), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }),
    ) as unknown as typeof fetch;

    const client = createSwapiClient('https://swapi.dev/api', fetchStub, 'https://swapi.py4e.com/api');
    const result = await client.getPeoplePage(1);

    expect(fetchStub).toHaveBeenCalledTimes(2);
    expect(fetchStub).toHaveBeenLastCalledWith('https://swapi.py4e.com/api/people/?page=1', expect.anything());
    expect(result.people[0].name).toBe('Leia Organa');
  });

  it('does not retry on server errors', async () => {
    const fetchStub = buildFetchStub({ error: 'fail' }, 500);
    const client = createSwapiClient('https://swapi.dev/api', fetchStub, 'https://swapi.py4e.com/api');

    await expect(client.getPeoplePage(1)).rejects.toMatchObject({ kind: 'server', status: 500 });
    expect(fetchStub).toHaveBeenCalledTimes(1);
  });
});
