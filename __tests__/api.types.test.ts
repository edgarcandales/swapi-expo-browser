import { mapFilm, mapPeoplePage, mapPerson, mapPlanet, parseIdFromUrl } from '../src/api/types';

const basePerson = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  gender: 'male',
  birth_year: '19BBY',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: ['https://swapi.dev/api/films/1/'],
  url: 'https://swapi.dev/api/people/1/',
};

describe('api/types', () => {
  it('parses person numbers and ids', () => {
    const person = mapPerson(basePerson);
    expect(person.id).toBe(1);
    expect(person.heightCm).toBe(172);
    expect(person.massKg).toBe(77);
    expect(person.homeworldId).toBe(1);
    expect(person.filmIds).toEqual([1]);
  });

  it('handles unknown numeric fields gracefully', () => {
    const person = mapPerson({ ...basePerson, height: 'unknown', mass: 'n/a' });
    expect(person.heightCm).toBeUndefined();
    expect(person.massKg).toBeUndefined();
  });

  it('parses planet with population', () => {
    const planet = mapPlanet({
      name: 'Tatooine',
      climate: 'arid',
      terrain: 'desert',
      population: '200,000',
      url: 'https://swapi.dev/api/planets/1/',
    });
    expect(planet.population).toBe(200000);
  });

  it('maps people page and next page id', () => {
    const page = mapPeoplePage({
      results: [basePerson],
      next: 'https://swapi.dev/api/people/?page=2',
      previous: null,
    });
    expect(page.people).toHaveLength(1);
    expect(page.nextPage).toBe(2);
  });

  it('parses film id and title', () => {
    const film = mapFilm({
      title: 'A New Hope',
      director: 'George Lucas',
      release_date: '1977-05-25',
      url: 'https://swapi.dev/api/films/1/',
    });
    expect(film.id).toBe(1);
    expect(film.title).toBe('A New Hope');
  });

  it('throws on invalid url for id parsing', () => {
    expect(() => parseIdFromUrl('https://swapi.dev/api/people/')).toThrow();
  });
});
