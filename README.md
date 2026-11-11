# Pokedex

Pokedex to search for a Pokémon by name or ID and show its artwork and base stats, powered by [PokeAPI](https://pokeapi.co).

## Features

- Search by name or number, with loading, error and empty states on the device screen
- Favorites and recent searches saved in the browser (`localStorage`)
- Installable PWA: the app shell, Pokémon data and artwork already viewed keep working offline
- Responsive: handheld layout on mobile, hinged cover with the saved lists on desktop
- Keyboard and screen reader friendly; all animations respect `prefers-reduced-motion`

## Tech Stack

- React 19 + TypeScript
- Vite 8
- pnpm
- Motion (hinge spring and pointer tilt)
- vite-plugin-pwa (service worker and web app manifest)
- Vitest + Testing Library
- ESLint + Prettier

## Requirements

- Node.js 22.12 or newer
- pnpm 12

## Run Locally

Clone the project

```bash
  git clone https://github.com/Geffrerson7/pokedex-device.git
```

Go to the project directory

```bash
  cd pokedex-device
```

Install dependencies

```bash
  pnpm install
```

Run project

```bash
  pnpm dev
```

Build for production

```bash
  pnpm build
```

## Scripts

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `pnpm dev`          | Start the dev server on port 3000     |
| `pnpm build`        | Type-check and build for production   |
| `pnpm preview`      | Preview the production build          |
| `pnpm lint`         | Run ESLint                            |
| `pnpm format`       | Format the code with Prettier         |
| `pnpm format:check` | Check formatting without writing      |
| `pnpm type-check`   | Run the TypeScript compiler (no emit) |
| `pnpm test`         | Run the tests in watch mode           |
| `pnpm test:run`     | Run the tests once                    |

The same checks run on every pull request through GitHub Actions (`.github/workflows/ci.yml`).

## Project Structure

```
src/
├── components/   UI components (PokedexScreen, PokemonImage, PokemonForm, HistoryPanel, PowerOn, Stat, ErrorBoundary)
├── hooks/        usePokemon (search state), useHistory (favorites and recents), useTilt, useMediaQuery
├── services/     PokeAPI client, typed errors and search cache
├── interfaces/   Domain types
├── pages/        Pokedex page
└── test/         Test setup and fixtures
```

## Fonts

The fonts are self-hosted in `public/fonts`, both under the SIL Open Font License (license files included):

- [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) for names and titles
- [Departure Mono](https://departuremono.com) for stats, numbers and labels (Latin subset)

## Demo

[![Deploy with Vercel](https://vercel.com/button)](https://pokedex-react-eta.vercel.app/)

## Authors

- [Gefferson Casasola](https://github.com/Geffrerson7)
