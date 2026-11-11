import { IPokemon } from "../../interfaces/pokemon";
import Stat from "../Stat";
import ErrorPokemon from "../../img/error.gif";
import LoadingPokemon from "../../img/carga.gif";
interface Props {
    pokemon: IPokemon;
    loading: boolean;
    error: boolean;
}

export default function PokedexScreen({ pokemon,
    loading,
    error }: Props) {
    if (error) {
        return (
            <div className="pokedex-screen">
                <img
                    src={ErrorPokemon}
                    alt="Hubo un error buscando tu pokemon"
                    className="pokedex-no-screen"
                />
            </div>
        )
    }
    return (
        <div className="pokedex-screen">
            {!pokemon || loading ? // Si no hay pokemon o si esta cargando
                <img
                    src={LoadingPokemon}
                    alt="Aun no hay ningun pokemon"
                    className="pokedex-no-screen"
                /> :
                <div className="pokemon-info">
                    <h2 className="pokemon-name">{pokemon?.name}</h2>
                    <img
                        className="pokemon-img"
                        src={`https://db.pokemongohub.net/images/pokemon/${pokemon?.id}.webp`}
                        alt={pokemon?.name}
                    />
                    <ul className="pokemon-stats">
                        {pokemon?.stats.map((item) => (
                            <Stat key={item.stat.name} item={item} />
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}

// {pokemon?.sprites?.front_default}