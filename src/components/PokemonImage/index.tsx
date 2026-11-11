import { useState } from "react";
import type { IPokemon } from "../../interfaces/pokemon";

interface Props {
  pokemon: IPokemon;
}

// Ilustración oficial primero y sprite clásico como respaldo; ambos los sirve PokeAPI.
function getImageSources(pokemon: IPokemon): string[] {
  const candidates: unknown[] = [
    pokemon.sprites.other?.["official-artwork"]?.front_default,
    pokemon.sprites.front_default,
  ];

  return candidates.filter(
    (source): source is string => typeof source === "string" && source !== "",
  );
}

export default function PokemonImage({ pokemon }: Props) {
  const sources = getImageSources(pokemon);
  const [failedCount, setFailedCount] = useState(0);
  const source = sources[failedCount];

  if (!source) {
    return (
      <div className="pokemon-img is-missing" role="img" aria-label={`${pokemon.name} sin imagen`}>
        ?
      </div>
    );
  }

  return (
    <img
      className="pokemon-img"
      src={source}
      alt={pokemon.name}
      loading="lazy"
      decoding="async"
      onError={() => setFailedCount((count) => count + 1)}
    />
  );
}
