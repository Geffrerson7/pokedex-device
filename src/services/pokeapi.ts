import { IPokemon, ItemStat } from "../interfaces/pokemon";

export type PokeApiErrorCode =
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "HTTP_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE";

export class PokeApiError extends Error {
  constructor(
    message: string,
    public readonly code: PokeApiErrorCode,
  ) {
    super(message);
    this.name = "PokeApiError";
  }
}

const MAX_POKEMON_NAME_LENGTH = 50;

function isItemStat(value: unknown): value is ItemStat {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  const stat = item.stat;

  return (
    typeof item.base_stat === "number" &&
    typeof stat === "object" &&
    stat !== null &&
    typeof (stat as Record<string, unknown>).name === "string"
  );
}

function isPokemon(value: unknown): value is IPokemon {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const pokemon = value as Record<string, unknown>;
  const sprites = pokemon.sprites;

  if (typeof sprites !== "object" || sprites === null) {
    return false;
  }

  const spriteData = sprites as Record<string, unknown>;

  return (
    typeof pokemon.id === "number" &&
    typeof pokemon.name === "string" &&
    Array.isArray(pokemon.stats) &&
    pokemon.stats.every(isItemStat) &&
    (typeof spriteData.front_default === "string" ||
      spriteData.front_default === null) &&
    (typeof spriteData.back_default === "string" ||
      spriteData.back_default === null)
  );
}

export async function getPokemon(
  name: string,
  signal?: AbortSignal,
): Promise<IPokemon> {
  const normalizedName = name.trim().toLowerCase();

  if (!normalizedName) {
    throw new PokeApiError(
      "Ingresa el nombre o número de un Pokémon.",
      "INVALID_INPUT",
    );
  }

  if (normalizedName.length > MAX_POKEMON_NAME_LENGTH) {
    throw new PokeApiError(
      "El nombre del Pokémon supera la longitud permitida.",
      "INVALID_INPUT",
    );
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(
    normalizedName,
  )}`;

  let response: Response;

  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }

    throw new PokeApiError(
      "No se pudo conectar con el servidor. Comprueba tu conexión.",
      "NETWORK_ERROR",
    );
  }

  if (response.status === 404) {
    throw new PokeApiError(
      "No se encontró ningún Pokémon con ese nombre o número.",
      "NOT_FOUND",
    );
  }

  if (!response.ok) {
    throw new PokeApiError(
      `Error del servidor (HTTP ${response.status}). Inténtalo nuevamente.`,
      "HTTP_ERROR",
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new PokeApiError(
      "El servidor devolvió una respuesta inválida.",
      "INVALID_RESPONSE",
    );
  }

  if (!isPokemon(data)) {
    throw new PokeApiError(
      "Los datos recibidos del servidor no tienen el formato esperado.",
      "INVALID_RESPONSE",
    );
  }

  return data;
}
