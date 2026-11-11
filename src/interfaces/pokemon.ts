export interface IPokemon {
  id: number;
  name: string;
  sprites: {
    back_default: string | null;
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default?: string | null;
      };
    };
  };
  stats: ItemStat[];
}

export interface ItemStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export type PokemonStatus = "idle" | "loading" | "success" | "error";
