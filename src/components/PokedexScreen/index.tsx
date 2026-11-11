import type { IPokemon, PokemonStatus } from "../../interfaces/pokemon";
import PokemonImage from "../PokemonImage";
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

export default function PokedexScreen({ pokemon, status, errorMessage, errorCode }: Props) {
  if (status === "error") {
    const { title, hint } = getErrorCopy(errorCode);

    return (
      <div className="pokedex-screen">
        <div className="pokemon-error">
          <svg className="pokemon-error-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2 1 21h22L12 2Z" />
            <path className="pokemon-error-mark" d="M11 9h2v6h-2zM11 17h2v2h-2z" />
          </svg>

          <h3>{title}</h3>

          <p>{errorMessage}</p>

          <span>{hint}</span>
        </div>
      </div>
    );
  }

  if (status === "idle" || status === "loading" || !pokemon) {
    return (
      <div className="pokedex-screen" aria-live="polite">
        {status === "loading" ? (
          <div className="pokedex-loader" role="status" aria-label="Buscando Pokémon" />
        ) : (
          <p className="pokedex-message">Esperando una búsqueda</p>
        )}
      </div>
    );
  }

  return (
    <div className="pokedex-screen" aria-live="polite">
      <div className="pokemon-info">
        <h2 className="pokemon-name">{pokemon.name}</h2>

        <PokemonImage key={pokemon.id} pokemon={pokemon} />

        <ul className="pokemon-stats">
          {pokemon.stats.map((item) => (
            <Stat key={item.stat.name} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
