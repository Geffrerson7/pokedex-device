import { useEffect, useRef, useState } from "react";
import type { IPokemon } from "../../interfaces/pokemon";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

interface Props {
  pokemon: IPokemon;
}

// Resolución horizontal de cada uno de los 8 pasos del revelado pixelado.
const REVEAL_STEPS = [4, 6, 8, 12, 16, 24, 36, 56];
const REVEAL_STEP_MS = 45;

// Ilustración oficial primero y sprite clásico como respaldo; ambos los sirve PokeAPI.
function getImageSources(pokemon: IPokemon): string[] {
  const candidates: unknown[] = [
    pokemon.sprites.other?.["official-artwork"]?.front_default,
    pokemon.sprites.front_default,
  ];

  return candidates.filter(
    (source): source is string => typeof source === "string" && source !== "",
  );
}

export default function PokemonImage({ pokemon }: Props) {
  const sources = getImageSources(pokemon);
  const [failedCount, setFailedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const reducedMotion = usePrefersReducedMotion();
  const source = sources[failedCount];

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  if (!source) {
    return (
      <div className="pokemon-figure">
        <div
          className="pokemon-img is-missing"
          role="img"
          aria-label={`${pokemon.name} sin imagen`}
        >
          ?
        </div>
      </div>
    );
  }

  const startReveal = (image: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const context = reducedMotion ? null : canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const drawStep = (step: number) => {
      const resolution = REVEAL_STEPS[step];

      if (resolution === undefined) {
        setIsRevealing(false);
        return;
      }

      // El lienzo se dibuja a baja resolución y el CSS lo amplía sin suavizado.
      canvas.width = resolution;
      canvas.height = resolution;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, resolution, resolution);
      context.drawImage(image, 0, 0, resolution, resolution);

      timerRef.current = window.setTimeout(() => drawStep(step + 1), REVEAL_STEP_MS);
    };

    window.clearTimeout(timerRef.current);
    setIsRevealing(true);
    drawStep(0);
  };

  // La imagen real queda oculta mientras descarga o mientras dura el revelado.
  const figureClassName =
    isLoaded && !isRevealing ? "pokemon-figure" : "pokemon-figure is-concealed";

  return (
    <div className={figureClassName}>
      <img
        className="pokemon-img"
        src={source}
        alt={pokemon.name}
        width={96}
        height={96}
        loading="lazy"
        decoding="async"
        crossOrigin="anonymous"
        onLoad={(event) => {
          setIsLoaded(true);
          startReveal(event.currentTarget);
        }}
        onError={() => {
          window.clearTimeout(timerRef.current);
          setIsLoaded(false);
          setIsRevealing(false);
          setFailedCount((count) => count + 1);
        }}
      />

      <canvas ref={canvasRef} className="pokemon-pixels" aria-hidden="true" />
    </div>
  );
}
