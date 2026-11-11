import { useCallback, useRef, useState } from "react";
import { getPokemon, PokeApiError, PokeApiErrorCode } from "../services/pokeapi";
import { IPokemon, PokemonStatus } from "../interfaces/pokemon";

interface UsePokemonReturn {
  pokemon: IPokemon | null;
  status: PokemonStatus;
  error: string | null;
  errorCode: PokeApiErrorCode | null;
  searchPokemon: (name: string) => Promise<void>;
  cancelPokemonSearch: () => void;
}

export function usePokemon(): UsePokemonReturn {
  const [pokemon, setPokemon] = useState<IPokemon | null>(null);
  const [status, setStatus] = useState<PokemonStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<PokeApiErrorCode | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const cancelPokemonSearch = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const searchPokemon = useCallback(async (name: string) => {
    // Cancelar la búsqueda anterior.
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");
    setError(null);
    setErrorCode(null);

    try {
      const data = await getPokemon(name, controller.signal);

      // Ignorar respuestas de peticiones anteriores.
      if (controllerRef.current !== controller) {
        return;
      }

      setPokemon(data);
      setStatus("success");
    } catch (error) {
      // Las cancelaciones no representan errores para el usuario.
      if (controller.signal.aborted || controllerRef.current !== controller) {
        return;
      }

      setPokemon(null);

      setError(
        error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      );

      setErrorCode(error instanceof PokeApiError ? error.code : null);

      setStatus("error");
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, []);

  return {
    pokemon,
    status,
    error,
    errorCode,
    searchPokemon,
    cancelPokemonSearch,
  };
}
