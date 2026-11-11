# Pokedex

Pokedex to search for a Pokémon by name or ID and show its artwork and base stats, powered by [PokeAPI](https://pokeapi.co).

## Tech Stack

- React 19 + TypeScript
- Vite 8
- pnpm
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
├── components/   UI components (PokedexScreen, PokemonImage, PokemonForm, Stat, ErrorBoundary)
├── hooks/        usePokemon: search state and request cancellation
├── services/     PokeAPI client, typed errors and search cache
├── interfaces/   Domain types
├── pages/        Pokedex page
└── test/         Test setup and fixtures
```

## Demo

[![Deploy with Vercel](https://vercel.com/button)](https://pokedex-react-eta.vercel.app/)

## Authors

- [Gefferson Casasola](https://github.com/Geffrerson7)
