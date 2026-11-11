import { getPokemon, PokeApiError } from "./pokeapi";
import { jsonResponse, pikachu } from "../test/fixtures";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function getError(promise: Promise<unknown>): Promise<PokeApiError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof PokeApiError) {
      return error;
    }

    throw error;
  }

  throw new Error("Expected the promise to reject");
}

describe("getPokemon", () => {
  it("returns the pokemon when the API responds with a valid payload", async () => {
    fetchMock.mockResolvedValue(jsonResponse(pikachu));

    await expect(getPokemon("pikachu")).resolves.toEqual(pikachu);
  });

  it("trims, lowercases and encodes the search term", async () => {
    fetchMock.mockResolvedValue(jsonResponse(pikachu));

    await getPokemon("  Mr Mime ");

    expect(fetchMock).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/mr%20mime", {
      signal: undefined,
    });
  });

  it.each(["", "   "])("rejects the blank input %j without calling the API", async (input) => {
    const error = await getError(getPokemon(input));

    expect(error.code).toBe("INVALID_INPUT");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects input longer than 50 characters without calling the API", async () => {
    const error = await getError(getPokemon("a".repeat(51)));

    expect(error.code).toBe("INVALID_INPUT");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports NOT_FOUND on a 404 with an empty body", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

    const error = await getError(getPokemon("zzzznoexiste"));

    expect(error.code).toBe("NOT_FOUND");
  });

  it("reports HTTP_ERROR on other failed statuses", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    const error = await getError(getPokemon("pikachu"));

    expect(error.code).toBe("HTTP_ERROR");
    expect(error.message).toContain("500");
  });

  it("reports NETWORK_ERROR when fetch rejects", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const error = await getError(getPokemon("pikachu"));

    expect(error.code).toBe("NETWORK_ERROR");
  });

  it("reports INVALID_RESPONSE when the body is not JSON", async () => {
    fetchMock.mockResolvedValue(new Response("<html>", { status: 200 }));

    const error = await getError(getPokemon("pikachu"));

    expect(error.code).toBe("INVALID_RESPONSE");
  });

  it("reports INVALID_RESPONSE when the payload has no stats", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 25, name: "pikachu", sprites: {} }));

    const error = await getError(getPokemon("pikachu"));

    expect(error.code).toBe("INVALID_RESPONSE");
  });

  it("rethrows the abort error instead of wrapping it", async () => {
    const controller = new AbortController();
    const abortError = new DOMException("Aborted", "AbortError");
    fetchMock.mockImplementation(async () => {
      controller.abort();
      throw abortError;
    });

    await expect(getPokemon("pikachu", controller.signal)).rejects.toBe(abortError);
  });
});
