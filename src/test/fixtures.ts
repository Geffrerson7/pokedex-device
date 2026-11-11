import type { IPokemon } from "../interfaces/pokemon";

export const mew: IPokemon = {
  id: 151,
  name: "mew",
  sprites: {
    back_default: "https://example.test/mew-back.png",
    front_default: "https://example.test/mew-front.png",
  },
  stats: [
    { base_stat: 100, stat: { name: "hp" } },
    { base_stat: 100, stat: { name: "attack" } },
  ],
};

export const pikachu: IPokemon = {
  id: 25,
  name: "pikachu",
  sprites: {
    back_default: null,
    front_default: null,
  },
  stats: [{ base_stat: 35, stat: { name: "hp" } }],
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
