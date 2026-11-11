import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery";

export const POWER_ON_STORAGE_KEY = "pokedex:powered-on";

function hasPlayedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(POWER_ON_STORAGE_KEY) === "1";
  } catch {
    // Sin almacenamiento de sesión no se puede garantizar "una vez": se omite.
    return true;
  }
}

/**
 * Secuencia de encendido del LCD: parpadeo y barrido de línea.
 * Se reproduce una vez por sesión y nunca con movimiento reducido.
 */
export default function PowerOn() {
  const reducedMotion = usePrefersReducedMotion();
  const [isPlaying, setIsPlaying] = useState(() => !hasPlayedThisSession());

  useEffect(() => {
    try {
      window.sessionStorage.setItem(POWER_ON_STORAGE_KEY, "1");
    } catch {
      // Ver hasPlayedThisSession.
    }
  }, []);

  if (!isPlaying || reducedMotion) {
    return null;
  }

  return <div className="power-on" aria-hidden="true" onAnimationEnd={() => setIsPlaying(false)} />;
}
