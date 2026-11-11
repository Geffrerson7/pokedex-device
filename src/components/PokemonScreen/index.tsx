import { IPokemon, PokemonStatus } from "../../interfaces/pokemon";
import Stat from "../Stat";
import ErrorPokemon from "../../img/error.gif";
import LoadingPokemon from "../../img/carga.gif";
import { PokeApiErrorCode } from "../../services/pokeapi";

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

export default function PokedexScreen({
  pokemon,
  status,
  errorMessage,
  errorCode,
}: Props) {
  if (status === "error") {
    const { title, hint } = getErrorCopy(errorCode);

    return (
      <div className="pokedex-screen">
        <div className="pokemon-error">
          <img
            src={ErrorPokemon}
            alt="Error buscando el Pokémon"
            className="pokemon-error-img"
          />

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
        <img
          src={LoadingPokemon}
          alt={
            status === "loading" ? "Buscando Pokémon" : "Esperando una búsqueda"
          }
          className="pokedex-no-screen"
        />
      </div>
    );
  }

  return (
    <div className="pokedex-screen" aria-live="polite">
      <div className="pokemon-info">
        <h2 className="pokemon-name">{pokemon.name}</h2>

        <img
          className="pokemon-img"
          src={`https://db.pokemongohub.net/images/pokemon/${pokemon.id}.webp`}
          alt={pokemon.name}
        />

        <ul className="pokemon-stats">
          {pokemon.stats.map((item) => (
            <Stat key={item.stat.name} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
