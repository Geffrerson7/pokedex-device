import type { ChangeEvent, SubmitEvent } from "react";

interface Props {
  pokemon: string;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  setPokemon: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function PokemonForm({ handleSubmit, pokemon, setPokemon }: Props) {
  return (
    <form className="pokemon-form" onSubmit={handleSubmit}>
      <input
        className="pokemon-input"
        type="text"
        name="pokemon"
        value={pokemon}
        placeholder="Busca tu pokemon"
        onChange={setPokemon}
        autoComplete="off"
        maxLength={50}
      />

      <input
        type="submit"
        className="pokemon-btn"
        value=""
        disabled={!pokemon.trim()}
        aria-label="Buscar Pokémon"
      />
    </form>
  );
}
