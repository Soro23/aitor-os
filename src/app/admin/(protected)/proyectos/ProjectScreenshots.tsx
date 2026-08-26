"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addProjectScreenshot, removeProjectScreenshot } from "@/server/actions/project-screenshots.actions";
import { FileUploader } from "@/components/ui/FileUploader/FileUploader";
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
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!file) return;
    setError(null);
    startTransition(async () => {
      try {
        await addProjectScreenshot({
          projectId,
          file,
          altText: altText || undefined,
          sortOrder: screenshots.length,
        });
        setFile(null);
        setAltText("");
        router.refresh();
      } catch {
        setError("No se pudo subir la captura.");
      }
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await removeProjectScreenshot(id);
        router.refresh();
      } catch {
        setError("No se pudo quitar la captura.");
      }
    });
  }

  return (
    <div className={styles.section}>
      <p className="hud-label">Capturas de pantalla</p>

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

      <div className={styles.addRow}>
        <FileUploader
          label={file ? file.name : "Arrastra una imagen o haz clic para seleccionarla"}
          hint="PNG, JPG o WebP"
          onFilesSelected={(files) => setFile(files[0] ?? null)}
        />
        <input
          placeholder="Texto alternativo (opcional)"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          className={formStyles.input}
        />
        <button
          type="button"
          className={formStyles.submit}
          disabled={isPending || !file}
          onClick={handleAdd}
        >
          Añadir
        </button>
      </div>

      {error ? (
        <p className={formStyles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
