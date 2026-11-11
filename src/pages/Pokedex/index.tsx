import { useState, useEffect } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { PokedexScreen, PokemonForm } from "../../components";
import { usePokemon } from "../../hooks/usePokemon";

export default function Pokedex() {
  const [name, setName] = useState<string>("151");

  const { pokemon, status, error, errorCode, searchPokemon, cancelPokemonSearch } = usePokemon();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void searchPokemon(name);
  };

  useEffect(() => {
    void searchPokemon("151");

    return () => {
      cancelPokemonSearch();
    };
  }, [searchPokemon, cancelPokemonSearch]);

  return (
    <div className="pokedex">
      <div className="pokedex-left">
        <div className="pokedex-left-top">
          <div className="light is-sky is-big" />
          <div className="light is-red" />
          <div className="light is-yellow" />
          <div className="light is-green" />
        </div>

        <div className="pokedex-screen-container">
          <PokedexScreen
            pokemon={pokemon}
            status={status}
            errorMessage={error}
            errorCode={errorCode}
          />
        </div>

        <div className="pokedex-left-bottom">
          <div className="pokedex-left-bottom-lights">
            <div className="light is-blue is-medium" />
            <div className="light is-green is-large" />
            <div className="light is-orange is-large" />
          </div>

          <PokemonForm handleSubmit={handleSubmit} pokemon={name} setPokemon={handleInputChange} />
        </div>
      </div>

      <div className="pokedex-right-front" />
      <div className="pokedex-right-back" />
    </div>
  );
}
