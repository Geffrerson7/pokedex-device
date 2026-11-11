import { useId } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

interface Props {
  pokemon: string;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  setPokemon: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function PokemonForm({ handleSubmit, pokemon, setPokemon }: Props) {
  const inputId = useId();

  return (
    <form className="pokemon-form" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        Nombre o número del Pokémon
      </label>

      <input
        id={inputId}
        className="pokemon-input"
        type="text"
        name="pokemon"
        value={pokemon}
        placeholder="Nombre o número"
        onChange={setPokemon}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="search"
        maxLength={50}
      />

      <button type="submit" className="key is-primary" disabled={!pokemon.trim()}>
        Buscar
      </button>
    </form>
  );
}
