import { useCallback, useSyncExternalStore } from "react";

/**
 * Devuelve si la media query coincide. Cuando el entorno no soporta
 * `matchMedia` devuelve `fallback`.
 */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return () => {};
      }

      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);

      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return fallback;
    }

    return window.matchMedia(query).matches;
  }, [query, fallback]);

  return useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}

// Sin `matchMedia` se asume movimiento reducido: es la opción segura.
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
