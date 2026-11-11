import type { CSSProperties } from "react";
import type { ItemStat } from "../../interfaces/pokemon";

interface Props {
  item: ItemStat;
}

// Valor máximo que puede tener una estadística base.
const MAX_BASE_STAT = 255;

const STAT_LABELS: Record<string, { short: string; full: string }> = {
  hp: { short: "PS", full: "Puntos de salud" },
  attack: { short: "ATQ", full: "Ataque" },
  defense: { short: "DEF", full: "Defensa" },
  "special-attack": { short: "AT.E", full: "Ataque especial" },
  "special-defense": { short: "DF.E", full: "Defensa especial" },
  speed: { short: "VEL", full: "Velocidad" },
};

export default function Stat({ item }: Props) {
  const label = STAT_LABELS[item.stat.name];
  const level = Math.min(Math.max(item.base_stat / MAX_BASE_STAT, 0), 1);

  return (
    <li className="pokemon-stat">
      <span className="stat-name">
        {label ? <abbr title={label.full}>{label.short}</abbr> : item.stat.name}
      </span>

      <span className="stat-value">{item.base_stat}</span>

      <span className="stat-bar" aria-hidden="true" style={{ "--level": level } as CSSProperties} />
    </li>
  );
}
