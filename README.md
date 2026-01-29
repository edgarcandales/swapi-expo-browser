## SWAPI Expo App

Small Expo (React Native + TypeScript) app that browses Star Wars data from SWAPI. It shows a paginated list of people and a detail view with homeworld and film information. The data layer is typed, validated, and wrapped with React Query for caching and retries.

### Requirements / Assumptions
- Uses the public SWAPI at `https://swapi.dev/api` with no auth.
- Built with Expo SDK 54, React Native 0.81, React 19. Tested with Node 20.19.x (engine warnings appear on older patch versions).
- Network errors are surfaced with retry affordances; partial data (e.g., missing homeworld) renders with sensible fallbacks.

### Getting Started
```bash
npm install
npm run start         # start Metro/Expo
npm run ios           # run in iOS simulator
npm run android       # run in Android emulator
npm run web           # optional web preview
```

### Quality Gates
```bash
npm run lint          # eslint
npm run typecheck     # TypeScript noEmit
npm test              # jest + @testing-library/react-native
```

### Project Structure
- `src/api`: SWAPI client with typed parsing/validation and error normalization.
- `src/state`: React Query client provider and injectable SWAPI client context.
- `src/screens`: `PeopleList` (infinite scroll) and `PersonDetail` (homeworld + films).
- `src/components`: Small UI primitives (Card, Loader, Error/Empty states, InfoRow, Button).
- `src/utils`: Formatting helpers and error messaging.

### Notes / Trade-offs
- React Query handles caching, retries, and pagination; no custom global state beyond injectable client for testability.
- Runtime validation uses `zod` to guard against malformed API data.
- Detail screen fetches related resources (homeworld, films) lazily and tolerates partial failures while showing inline error hints.
- SWAPI client now falls back to `https://swapi.py4e.com/api` for retryable failures and exposes typed query keys for better cache reuse/prefetch.

# swapi-expo-browser
