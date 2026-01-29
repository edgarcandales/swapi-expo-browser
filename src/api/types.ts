import { z } from 'zod';

export interface Person {
  id: number;
  name: string;
  birthYear: string;
  gender: string;
  heightCm?: number;
  massKg?: number;
  homeworldId?: number;
  filmIds: number[];
}

export interface Planet {
  id: number;
  name: string;
  climate?: string;
  terrain?: string;
  population?: number;
}

export interface Film {
  id: number;
  title: string;
  director: string;
  releaseDate: string;
}

const personSchema = z.object({
  name: z.string(),
  height: z.string().optional(),
  mass: z.string().optional(),
  gender: z.string().optional().default('unknown'),
  birth_year: z.string().optional().default('unknown'),
  homeworld: z.string().url().optional().nullable(),
  films: z.array(z.string().url()),
  url: z.string().url(),
});

const planetSchema = z.object({
  name: z.string(),
  climate: z.string().optional(),
  terrain: z.string().optional(),
  population: z.string().optional(),
  url: z.string().url(),
});

const filmSchema = z.object({
  title: z.string(),
  director: z.string(),
  release_date: z.string(),
  url: z.string().url(),
});

const peoplePageSchema = z.object({
  results: z.array(personSchema),
  next: z.string().url().nullable().optional(),
  previous: z.string().url().nullable().optional(),
});

export type PersonDto = z.infer<typeof personSchema>;
export type PlanetDto = z.infer<typeof planetSchema>;
export type FilmDto = z.infer<typeof filmSchema>;
export type PeoplePageDto = z.infer<typeof peoplePageSchema>;

export interface PeoplePage {
  people: Person[];
  nextPage: number | null;
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export function parseIdFromUrl(url: string): number {
  const match = url.match(/(\d+)(?!.*\d)/);
  if (!match || !match[1]) {
    throw new ParseError(`Could not parse id from url: ${url}`);
  }
  return Number(match[1]);
}

function parseOptionalNumber(raw?: string | null): number | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/,/g, '');
  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function mapPerson(dto: PersonDto): Person {
  const parsed = personSchema.parse(dto);

  return {
    id: parseIdFromUrl(parsed.url),
    name: parsed.name,
    birthYear: parsed.birth_year ?? 'unknown',
    gender: parsed.gender ?? 'unknown',
    heightCm: parseOptionalNumber(parsed.height ?? undefined),
    massKg: parseOptionalNumber(parsed.mass ?? undefined),
    homeworldId: parsed.homeworld ? parseIdFromUrl(parsed.homeworld) : undefined,
    filmIds: parsed.films.map(parseIdFromUrl),
  };
}

export function mapPlanet(dto: PlanetDto): Planet {
  const parsed = planetSchema.parse(dto);

  return {
    id: parseIdFromUrl(parsed.url),
    name: parsed.name,
    climate: parsed.climate,
    terrain: parsed.terrain,
    population: parseOptionalNumber(parsed.population ?? undefined),
  };
}

export function mapFilm(dto: FilmDto): Film {
  const parsed = filmSchema.parse(dto);

  return {
    id: parseIdFromUrl(parsed.url),
    title: parsed.title,
    director: parsed.director,
    releaseDate: parsed.release_date,
  };
}

export function mapPeoplePage(dto: PeoplePageDto): PeoplePage {
  const parsed = peoplePageSchema.parse(dto);
  return {
    people: parsed.results.map(mapPerson),
    nextPage: parsed.next ? parseIdFromUrl(parsed.next) : null,
  };
}
