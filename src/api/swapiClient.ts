import {
  Film,
  FilmDto,
  PeoplePage,
  PeoplePageDto,
  Person,
  PersonDto,
  Planet,
  PlanetDto,
  mapFilm,
  mapPeoplePage,
  mapPerson,
  mapPlanet,
} from './types';

export type ApiErrorKind = 'network' | 'timeout' | 'server' | 'parse';

export interface ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  cause?: unknown;
}

export interface SwapiClient {
  getPeoplePage(page?: number): Promise<PeoplePage>;
  getPerson(id: number): Promise<Person>;
  getPlanet(id: number): Promise<Planet>;
  getFilms(ids: number[]): Promise<Film[]>;
}

interface FetchOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

interface FetchConfig extends FetchOptions {
  baseUrl: string;
  fetchImpl: typeof fetch;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_BASE_URL = 'https://swapi.dev/api';

function buildError(kind: ApiErrorKind, message: string, cause?: unknown, status?: number): ApiError {
  const error = new Error(message) as ApiError;
  error.kind = kind;
  error.cause = cause;
  error.status = status;
  return error;
}

async function fetchJson<T>(path: string, config: FetchConfig): Promise<T> {
  const { baseUrl, fetchImpl, timeoutMs = DEFAULT_TIMEOUT_MS, signal } = config;
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw buildError(
        'server',
        `Request failed with status ${response.status}`,
        undefined,
        response.status,
      );
    }

    try {
      return (await response.json()) as T;
    } catch (parseErr) {
      throw buildError('parse', 'Failed to parse response JSON', parseErr);
    }
  } catch (err) {
    if ((err as ApiError).kind === 'server' || (err as ApiError).kind === 'parse') {
      throw err;
    }

    if (err instanceof Error && err.name === 'AbortError') {
      throw buildError(timedOut ? 'timeout' : 'network', 'Request was aborted', err);
    }

    throw buildError('network', 'Network request failed', err);
  } finally {
    clearTimeout(timeoutId);
  }
}

export function createSwapiClient(
  baseUrl: string = DEFAULT_BASE_URL,
  fetchImpl: typeof fetch = fetch,
): SwapiClient {
  return {
    async getPeoplePage(page = 1): Promise<PeoplePage> {
      const data = await fetchJson<PeoplePageDto>(`/people/?page=${page}`, {
        baseUrl,
        fetchImpl,
      });
      return mapPeoplePage(data);
    },

    async getPerson(id: number): Promise<Person> {
      const data = await fetchJson<PersonDto>(`/people/${id}/`, {
        baseUrl,
        fetchImpl,
      });
      return mapPerson(data);
    },

    async getPlanet(id: number): Promise<Planet> {
      const data = await fetchJson<PlanetDto>(`/planets/${id}/`, {
        baseUrl,
        fetchImpl,
      });
      return mapPlanet(data);
    },

    async getFilms(ids: number[]): Promise<Film[]> {
      if (ids.length === 0) return [];
      const results = await Promise.all(
        ids.map((filmId) =>
          fetchJson<FilmDto>(`/films/${filmId}/`, { baseUrl, fetchImpl }).then(mapFilm),
        ),
      );
      return results;
    },
  };
}

export const swapiClient: SwapiClient = createSwapiClient();
