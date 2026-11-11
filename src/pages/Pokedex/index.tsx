import { useCallback, useEffect, useId, useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import { LazyMotion, domAnimation, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { HistoryPanel, PokedexScreen, PokemonForm } from "../../components";
import { useHistory } from "../../hooks/useHistory";
import type { HistoryEntry } from "../../hooks/useHistory";
import { useMediaQuery, usePrefersReducedMotion } from "../../hooks/useMediaQuery";
import { usePokemon } from "../../hooks/usePokemon";
import { useTilt } from "../../hooks/useTilt";

const DEFAULT_POKEMON = "151";

// Debe coincidir con el punto de corte de la tapa en index.css.
const DESKTOP_QUERY = "(min-width: 50rem)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

const HINGE_SPRING = { stiffness: 150, damping: 15, mass: 1 };

export default function Pokedex() {
  const [name, setName] = useState<string>(DEFAULT_POKEMON);
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const memoId = useId();

  const { pokemon, status, error, errorCode, searchPokemon, cancelPokemonSearch } = usePokemon();
  const { recents, favorites, addRecent, toggleFavorite, isFavorite } = useHistory();

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const reducedMotion = usePrefersReducedMotion();

  // La tapa solo existe en escritorio; en móvil el dispositivo siempre está abierto.
  const isCovered = isDesktop && !isCoverOpen;

  const hinge = useSpring(1, HINGE_SPRING);
  const frontAngle = useTransform(hinge, (value) => value * 180);
  const backAngle = useTransform(hinge, (value) => (value - 1) * 180);
  const offsetX = useTransform(hinge, (value) => `${value * -50}%`);

  const tilt = useTilt(isDesktop && hasFinePointer && !reducedMotion);

  useEffect(() => {
    const target = isCovered ? 0 : 1;

    if (reducedMotion) {
      hinge.jump(target);
    } else {
      hinge.set(target);
    }
  }, [hinge, isCovered, reducedMotion]);

  const runSearch = useCallback(
    async (term: string) => {
      const found = await searchPokemon(term);

      if (found) {
        addRecent(found);
      }
    },
    [searchPokemon, addRecent],
  );

  useEffect(() => {
    // La carga inicial no cuenta como búsqueda del usuario: no entra en recientes.
    void searchPokemon(DEFAULT_POKEMON);

    return () => {
      cancelPokemonSearch();
    };
  }, [searchPokemon, cancelPokemonSearch]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runSearch(name);
  };

  const handleSelect = (entry: HistoryEntry) => {
    setName(entry.name);
    void runSearch(entry.name);
  };

  const isCurrentFavorite = pokemon !== null && isFavorite(pokemon.id);

  return (
    <LazyMotion features={domAnimation} strict>
      <main
        className="stage"
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
      >
        <h1 className="sr-only">Pokedex</h1>

        <m.div
          className="device"
          style={{
            x: offsetX,
            rotateX: tilt.rotateX,
            rotateY: tilt.rotateY,
            transformPerspective: 1400,
          }}
        >
          <section className="device-body" aria-label="Pokedex">
            <div className="device-top">
              <span
                className={status === "loading" ? "lens is-active" : "lens"}
                aria-hidden="true"
              />
              <span className="led" aria-hidden="true" />
              <span className="led" aria-hidden="true" />
              <span className="led" aria-hidden="true" />

              {isDesktop && (
                <button
                  type="button"
                  className="key key-cover"
                  aria-expanded={isCoverOpen}
                  aria-controls={memoId}
                  onClick={() => setIsCoverOpen((open) => !open)}
                >
                  {isCoverOpen ? "Cerrar tapa" : "Abrir tapa"}
                </button>
              )}
            </div>

            <div className="bezel" inert={isCovered}>
              <PokedexScreen
                pokemon={pokemon}
                status={status}
                errorMessage={error}
                errorCode={errorCode}
              />
            </div>

            <div className="controls" inert={isCovered}>
              <button
                type="button"
                className="key key-favorite"
                aria-pressed={isCurrentFavorite}
                disabled={pokemon === null}
                onClick={() => {
                  if (pokemon) {
                    toggleFavorite(pokemon);
                  }
                }}
              >
                <span className="key-led" aria-hidden="true" />
                Favorito
              </button>

              <PokemonForm
                handleSubmit={handleSubmit}
                pokemon={name}
                setPokemon={handleInputChange}
              />
            </div>
          </section>

          <m.div className="cover-front" aria-hidden="true" style={{ rotateY: frontAngle }} />

          <m.aside
            id={memoId}
            className="cover-back"
            aria-label="Favoritos y búsquedas recientes"
            inert={isCovered}
            style={{ rotateY: backAngle }}
          >
            <HistoryPanel favorites={favorites} recents={recents} onSelect={handleSelect} />
          </m.aside>
        </m.div>
      </main>
    </LazyMotion>
  );
}
