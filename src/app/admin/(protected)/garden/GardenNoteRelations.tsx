"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addGardenNoteRelation,
  removeGardenNoteRelation,
} from "@/server/actions/garden-note-relations.actions";
import type { GardenNoteSummary } from "@/types/dto/garden-note.dto";
import formStyles from "@/styles/admin-form.module.css";
import listStyles from "@/styles/admin-list.module.css";
import styles from "./GardenNoteRelations.module.css";

export interface GardenNoteRelationsProps {
  noteId: string;
  relatedNotes: GardenNoteSummary[];
  availableNotes: GardenNoteSummary[];
}

export function GardenNoteRelations({ noteId, relatedNotes, availableNotes }: GardenNoteRelationsProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(availableNotes[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!selectedId) return;
    setError(null);
    startTransition(async () => {
      try {
        await addGardenNoteRelation({ noteId, relatedNoteId: selectedId });
        router.refresh();
      } catch {
        setError("No se pudo añadir la relación.");
      }
    });
  }

  function handleRemove(relatedNoteId: string) {
    setError(null);
    startTransition(async () => {
      try {
        await removeGardenNoteRelation(noteId, relatedNoteId);
        router.refresh();
      } catch {
        setError("No se pudo quitar la relación.");
      }
    });
  }

  return (
    <div className={styles.section}>
      <p className="hud-label">Notas relacionadas</p>

      {relatedNotes.length > 0 ? (
        <ul className={styles.list}>
          {relatedNotes.map((related) => (
            <li key={related.id} className={styles.item}>
              <span>{related.title}</span>
              <button
                type="button"
                className={listStyles.deleteButton}
                disabled={isPending}
                onClick={() => handleRemove(related.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Sin notas relacionadas todavía.</p>
      )}

      {availableNotes.length > 0 ? (
        <div className={styles.addRow}>
          <select
            className={formStyles.input}
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {availableNotes.map((available) => (
              <option key={available.id} value={available.id}>
                {available.title}
              </option>
            ))}
          </select>
          <button type="button" className={formStyles.submit} disabled={isPending} onClick={handleAdd}>
            Añadir
          </button>
        </div>
      ) : null}

      {error ? (
        <p className={formStyles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
