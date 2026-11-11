import type { IPokemon, PokemonStatus } from "../../interfaces/pokemon";
import PokemonImage from "../PokemonImage";
import PowerOn from "../PowerOn";
import Stat from "../Stat";
import type { PokeApiErrorCode } from "../../services/pokeapi";

interface Props {
  pokemon: IPokemon | null;
  status: PokemonStatus;
  errorMessage: string | null;
  errorCode: PokeApiErrorCode | null;
}

const RETRY_HINT = "Inténtalo nuevamente en unos momentos.";

function getErrorCopy(errorCode: PokeApiErrorCode | null) {
  switch (errorCode) {
    case "NOT_FOUND":
      return {
        title: "¡Pokémon no encontrado!",
        hint: "Verifica el nombre o número e inténtalo nuevamente.",
      };
    case "INVALID_INPUT":
      return {
        title: "Búsqueda no válida",
        hint: "Escribe el nombre o número de un Pokémon.",
      };
    case "NETWORK_ERROR":
      return { title: "Sin conexión", hint: RETRY_HINT };
    case "HTTP_ERROR":
      return { title: "Error del servidor", hint: RETRY_HINT };
    default:
      return { title: "Algo salió mal", hint: RETRY_HINT };
  }
}

function formatNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

function renderStatus(status: PokemonStatus, pokemon: IPokemon | null) {
  if (status === "error") {
    return null;
  }

  if (status === "loading") {
    return (
      <div className="lcd-state" role="status" aria-label="Buscando Pokémon">
        <span className="lcd-sweep" aria-hidden="true" />
        <p className="lcd-state-title">Buscando…</p>
      </div>
    );
  }

  if (status === "idle" || !pokemon) {
    return (
      <div className="lcd-state">
        <p className="lcd-state-title">Sin señal</p>
        <p>Escribe un nombre o número.</p>
      </div>
    );
  }

  return (
    <div className="pokemon-info" key={pokemon.id}>
      <header className="pokemon-header">
        <h2 className="pokemon-name" title={pokemon.name}>
          {pokemon.name}
        </h2>

        <span className="pokemon-number">{formatNumber(pokemon.id)}</span>
      </header>

      <PokemonImage key={pokemon.id} pokemon={pokemon} />

      <ul className="pokemon-stats" aria-label="Estadísticas base">
        {pokemon.stats.map((item) => (
          <Stat key={item.stat.name} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default function PokedexScreen({ pokemon, status, errorMessage, errorCode }: Props) {
  const errorCopy = status === "error" ? getErrorCopy(errorCode) : null;

  return (
    <div className="lcd">
      {/* Las dos regiones vivas permanecen montadas para que los cambios se anuncien. */}
      <div className="lcd-region" aria-live="polite">
        {renderStatus(status, pokemon)}
      </div>

      <div className="lcd-region" role="alert">
        {errorCopy && (
          <div className="lcd-state is-error">
            <h2 className="lcd-state-title">{errorCopy.title}</h2>
            <p>{errorMessage}</p>
            <p className="lcd-hint">{errorCopy.hint}</p>
          </div>
        )}
      </div>

      <PowerOn />
    </div>
  );
}
