import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pokedex from ".";
import { clearPokemonCache } from "../../services/pokeapi";
import { jsonResponse, mew, pikachu } from "../../test/fixtures";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  clearPokemonCache();
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => jsonResponse(mew));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function search(term: string) {
  const user = userEvent.setup();
  const input = screen.getByPlaceholderText("Busca tu pokemon");

  await user.clear(input);
  await user.type(input, `${term}{Enter}`);
}

describe("Pokedex", () => {
  it("loads the default pokemon on mount", async () => {
    render(<Pokedex />);

    expect(await screen.findByRole("heading", { name: "mew" })).toBeInTheDocument();
    expect(screen.getByText("hp:")).toBeInTheDocument();
    expect(screen.getAllByText("100")).toHaveLength(2);
  });

  it("shows the pokemon found when the form is submitted with Enter", async () => {
    render(<Pokedex />);
    await screen.findByRole("heading", { name: "mew" });

    fetchMock.mockImplementation(async () => jsonResponse(pikachu));
    await search("Pikachu");

    expect(await screen.findByRole("heading", { name: "pikachu" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://pokeapi.co/api/v2/pokemon/pikachu",
      expect.anything(),
    );
  });

  it("shows a not-found message when the API responds 404", async () => {
    render(<Pokedex />);
    await screen.findByRole("heading", { name: "mew" });

    fetchMock.mockImplementation(async () => new Response(null, { status: 404 }));
    await search("zzzznoexiste");

    expect(
      await screen.findByRole("heading", { name: "¡Pokémon no encontrado!" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "mew" })).not.toBeInTheDocument();
  });

  it("shows a connection message when the request fails", async () => {
    render(<Pokedex />);
    await screen.findByRole("heading", { name: "mew" });

    fetchMock.mockImplementation(async () => {
      throw new TypeError("Failed to fetch");
    });
    await search("pikachu");

    expect(await screen.findByRole("heading", { name: "Sin conexión" })).toBeInTheDocument();
  });

  it("recovers from an error on the next successful search", async () => {
    render(<Pokedex />);
    await screen.findByRole("heading", { name: "mew" });

    fetchMock.mockImplementation(async () => new Response(null, { status: 500 }));
    await search("pikachu");
    await screen.findByRole("heading", { name: "Error del servidor" });

    fetchMock.mockImplementation(async () => jsonResponse(pikachu));
    await search("pikachu");

    expect(await screen.findByRole("heading", { name: "pikachu" })).toBeInTheDocument();
  });

  it("shows a loader while the request is pending", async () => {
    let resolveRequest: (response: Response) => void = () => {};
    fetchMock.mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(<Pokedex />);

    expect(await screen.findByRole("status", { name: "Buscando Pokémon" })).toBeInTheDocument();

    resolveRequest(jsonResponse(mew));

    expect(await screen.findByRole("heading", { name: "mew" })).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("does not request again a pokemon that was already found", async () => {
    render(<Pokedex />);
    await screen.findByRole("heading", { name: "mew" });

    fetchMock.mockImplementation(async () => jsonResponse(pikachu));
    await search("pikachu");
    await screen.findByRole("heading", { name: "pikachu" });
    const callsBeforeRepeat = fetchMock.mock.calls.length;

    await search("mew");
    await screen.findByRole("heading", { name: "mew" });
    await search("25");
    await screen.findByRole("heading", { name: "pikachu" });

    expect(fetchMock).toHaveBeenCalledTimes(callsBeforeRepeat);
  });

  it("uses the official artwork and falls back to the sprite when it fails", async () => {
    render(<Pokedex />);

    const image = await screen.findByRole("img", { name: "mew" });
    expect(image).toHaveAttribute("src", "https://example.test/mew-artwork.png");
    expect(image).toHaveAttribute("loading", "lazy");

    fireEvent.error(image);
    expect(screen.getByRole("img", { name: "mew" })).toHaveAttribute(
      "src",
      "https://example.test/mew-front.png",
    );

    fireEvent.error(screen.getByRole("img", { name: "mew" }));
    expect(screen.getByRole("img", { name: "mew sin imagen" })).toBeInTheDocument();
  });

  it("shows a placeholder when the pokemon has no images", async () => {
    fetchMock.mockImplementation(async () => jsonResponse(pikachu));

    render(<Pokedex />);

    expect(await screen.findByRole("img", { name: "pikachu sin imagen" })).toBeInTheDocument();
  });

  it("disables the search button while the input is blank", async () => {
    render(<Pokedex />);
    await screen.findByRole("heading", { name: "mew" });

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("Busca tu pokemon");
    await user.clear(input);
    await user.type(input, "   ");

    expect(screen.getByRole("button", { name: "Buscar Pokémon" })).toBeDisabled();
  });
});
