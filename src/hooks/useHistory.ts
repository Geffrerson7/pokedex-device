import { useCallback, useEffect, useState } from "react";
import type { IPokemon } from "../interfaces/pokemon";

export interface HistoryEntry {
  id: number;
  name: string;
}

interface HistoryState {
  recents: HistoryEntry[];
  favorites: HistoryEntry[];
}

interface UseHistoryReturn extends HistoryState {
  addRecent: (pokemon: IPokemon) => void;
  toggleFavorite: (pokemon: IPokemon) => void;
  isFavorite: (id: number) => boolean;
}

export const HISTORY_STORAGE_KEY = "pokedex:history:v1";

const MAX_RECENTS = 6;
const MAX_FAVORITES = 12;
const EMPTY_HISTORY: HistoryState = { recents: [], favorites: [] };

function toEntries(value: unknown, limit: number): HistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries: HistoryEntry[] = [];

  for (const item of value) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const { id, name } = item as Record<string, unknown>;

    if (typeof id === "number" && typeof name === "string" && name !== "") {
      entries.push({ id, name });
    }
  }

  return entries.slice(0, limit);
}

function readHistory(): HistoryState {
  try {
    const stored = window.localStorage.getItem(HISTORY_STORAGE_KEY);

    if (!stored) {
      return EMPTY_HISTORY;
    }

    const parsed = JSON.parse(stored) as Record<string, unknown> | null;

    return {
      recents: toEntries(parsed?.recents, MAX_RECENTS),
      favorites: toEntries(parsed?.favorites, MAX_FAVORITES),
    };
  } catch {
    // Almacenamiento bloqueado o contenido corrupto: se empieza de cero.
    return EMPTY_HISTORY;
  }
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryState>(readHistory);

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Sin almacenamiento disponible el historial vive solo en memoria.
    }
  }, [history]);

  const addRecent = useCallback((pokemon: IPokemon) => {
    const entry: HistoryEntry = { id: pokemon.id, name: pokemon.name };

    setHistory((current) => ({
      ...current,
      recents: [entry, ...current.recents.filter((item) => item.id !== entry.id)].slice(
        0,
        MAX_RECENTS,
      ),
    }));
  }, []);

  const toggleFavorite = useCallback((pokemon: IPokemon) => {
    const entry: HistoryEntry = { id: pokemon.id, name: pokemon.name };

    setHistory((current) => {
      const isSaved = current.favorites.some((item) => item.id === entry.id);

      return {
        ...current,
        favorites: isSaved
          ? current.favorites.filter((item) => item.id !== entry.id)
          : [entry, ...current.favorites].slice(0, MAX_FAVORITES),
      };
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => history.favorites.some((item) => item.id === id),
    [history.favorites],
  );

  return {
    recents: history.recents,
    favorites: history.favorites,
    addRecent,
    toggleFavorite,
    isFavorite,
  };
}
