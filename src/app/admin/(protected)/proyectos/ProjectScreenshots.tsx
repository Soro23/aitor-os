"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addProjectScreenshot,
  removeProjectScreenshot,
} from "@/server/actions/project-screenshots.actions";
import { FileUploader } from "@/components/ui/FileUploader/FileUploader";
import { MAX_SCREENSHOTS_PER_PROJECT } from "@/lib/validation/project-screenshot.schema";
import type { ProjectScreenshotDTO } from "@/types/dto/project-screenshot.dto";
import formStyles from "@/styles/admin-form.module.css";
import listStyles from "@/styles/admin-list.module.css";
import styles from "./ProjectScreenshots.module.css";

export interface ProjectScreenshotsProps {
  projectId: string;
  screenshots: ProjectScreenshotDTO[];
}

export function ProjectScreenshots({ projectId, screenshots }: ProjectScreenshotsProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const remainingSlots = MAX_SCREENSHOTS_PER_PROJECT - screenshots.length;
  const limitReached = remainingSlots <= 0;

  function handleFilesSelected(selected: FileList) {
    const picked = Array.from(selected);
    if (picked.length > remainingSlots) {
      setError(
        `Solo quedan ${remainingSlots} huecos libres (límite ${MAX_SCREENSHOTS_PER_PROJECT}). Se han tomado las primeras ${remainingSlots}.`,
      );
    } else {
      setError(null);
    }
    setFiles(picked.slice(0, remainingSlots));
  }

  function handleAdd() {
    if (files.length === 0) return;
    setError(null);
    const pending = files;
    startTransition(async () => {
      setProgress({ done: 0, total: pending.length });
      for (const [index, file] of pending.entries()) {
        try {
          await addProjectScreenshot({ projectId, file });
          setProgress({ done: index + 1, total: pending.length });
        } catch (err) {
          const detail = err instanceof Error ? err.message : undefined;
          setError(
            `Se subieron ${index} de ${pending.length} capturas. Falló "${file.name}"${detail ? `: ${detail}` : "."}`,
          );
          setFiles(pending.slice(index));
          setProgress(null);
          router.refresh();
          return;
        }
      }
      setFiles([]);
      setProgress(null);
      router.refresh();
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await removeProjectScreenshot(id);
        router.refresh();
      } catch (err) {
        const detail = err instanceof Error ? err.message : undefined;
        setError(detail ? `No se pudo quitar la captura: ${detail}` : "No se pudo quitar la captura.");
      }
    });
  }

  return (
    <div className={styles.section}>
      <p className="hud-label">
        Capturas de pantalla ({screenshots.length}/{MAX_SCREENSHOTS_PER_PROJECT})
      </p>

      {screenshots.length > 0 ? (
        <ul className={styles.list}>
          {screenshots.map((shot) => (
            <li key={shot.id} className={styles.item}>
              {/* eslint-disable-next-line @next/next/no-img-element -- URLs externas de Storage, sin loader de next/image configurado todavia */}
              <img src={shot.imageUrl} alt={shot.altText ?? ""} className={styles.thumbnail} />
              <span className={styles.altText}>{shot.altText || "Sin descripción"}</span>
              <button
                type="button"
                className={listStyles.deleteButton}
                disabled={isPending}
                onClick={() => handleRemove(shot.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Sin capturas todavía.</p>
      )}

      {limitReached ? (
        <p className={styles.empty}>
          Límite de {MAX_SCREENSHOTS_PER_PROJECT} capturas alcanzado. Quita alguna para añadir más.
        </p>
      ) : (
        <div className={styles.addRow}>
          <FileUploader
            label={
              files.length > 0
                ? `${files.length} archivo${files.length > 1 ? "s" : ""} seleccionado${files.length > 1 ? "s" : ""}`
                : "Arrastra imágenes o haz clic para seleccionarlas (varias a la vez)"
            }
            hint={`PNG, JPG o WebP · hasta ${remainingSlots} más`}
            multiple
            onFilesSelected={handleFilesSelected}
          />
          <button
            type="button"
            className={formStyles.submit}
            disabled={isPending || files.length === 0}
            onClick={handleAdd}
          >
            {progress ? `Subiendo ${progress.done}/${progress.total}...` : "Añadir"}
          </button>
        </div>
      )}

      {error ? (
        <p className={formStyles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
