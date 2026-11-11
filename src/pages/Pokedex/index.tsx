import { useState, useEffect, ChangeEvent } from "react"
import { PokedexScreen, PokemonForm } from "../../components"

export default function Pokedex() {
  const [pokemon, setPokemon] = useState<any>(null);

  const [name, setName] =useState<string>("151")

  const fetchPokemon = async () => {
    if (!name) return
  
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLocaleLowerCase()}`
    );
    const data = await response.json();
    setPokemon(data);
    
    setName("")
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  useEffect(() => {
    fetchPokemon();
  }, [])

  return (
    <div className="pokedex">
      <div className="pokedex-left">
        <div className="pokedex-left-top">
          <div className='light is-sky is-big' />
          <div className="light is-red" />
          <div className="light is-yellow" />
          <div className="light is-green" />
        </div>
        <div className="pokedex-screen-container">
          <PokedexScreen pokemon={pokemon} loading={false} error={false} />
        </div>
        <div className="pokedex-left-bottom">
          <div className="pokedex-left-bottom-lights">
            <div className="light is-blue is-medium" />
            <div className="light is-green is-large" />
            <div className="light is-orange is-large" />
          </div>
          <PokemonForm handleSubmit={fetchPokemon} pokemon={name} setPokemon={handleInputChange} />
        </div>
      </div>
      <div className="pokedex-right-front" />
      <div className="pokedex-right-back" />
    </div>
  )

}