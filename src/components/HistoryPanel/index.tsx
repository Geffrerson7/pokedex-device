import type { HistoryEntry } from "../../hooks/useHistory";

interface Props {
  favorites: HistoryEntry[];
  recents: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

interface ListProps {
  title: string;
  emptyText: string;
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

function formatNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

function HistoryList({ title, emptyText, entries, onSelect }: ListProps) {
  return (
    <section className="memo-section">
      <h2 className="memo-title">{title}</h2>

      {entries.length === 0 ? (
        <p className="memo-empty">{emptyText}</p>
      ) : (
        <ul className="memo-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button type="button" className="memo-item" onClick={() => onSelect(entry)}>
                <span className="memo-number">{formatNumber(entry.id)}</span>{" "}
                <span className="memo-name">{entry.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function HistoryPanel({ favorites, recents, onSelect }: Props) {
  return (
    <div className="memo">
      <HistoryList
        title="Favoritos"
        emptyText="Marca un Pokémon como favorito para guardarlo aquí."
        entries={favorites}
        onSelect={onSelect}
      />

      <HistoryList
        title="Recientes"
        emptyText="Tus últimas búsquedas aparecerán aquí."
        entries={recents}
        onSelect={onSelect}
      />
    </div>
  );
}
