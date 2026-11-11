import { useCallback, useEffect } from "react";
import type { PointerEvent } from "react";
import { useSpring } from "motion/react";
import type { MotionValue } from "motion/react";

interface UseTiltReturn {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

const TILT_SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

/**
 * Inclina un elemento hacia el cursor, hasta `maxDegrees` por eje.
 * Los manejadores van en el contenedor que delimita el área sensible.
 */
export function useTilt(enabled: boolean, maxDegrees = 6): UseTiltReturn {
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  useEffect(() => {
    if (!enabled) {
      rotateX.jump(0);
      rotateY.jump(0);
    }
  }, [enabled, rotateX, rotateY]);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();

      if (bounds.width === 0 || bounds.height === 0) {
        return;
      }

      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

      rotateY.set(horizontal * 2 * maxDegrees);
      rotateX.set(-vertical * 2 * maxDegrees);
    },
    [enabled, maxDegrees, rotateX, rotateY],
  );

  const onPointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}
