"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addUiStyleImage,
  removeUiStyleImage,
  updateUiStyleImage,
} from "@/server/actions/ui-style-images.actions";
import { FileUploader } from "@/components/ui/FileUploader/FileUploader";
import { MAX_IMAGES_PER_UI_STYLE } from "@/lib/validation/ui-style-image.schema";
import type { UiStyleImageDTO } from "@/types/dto/ui-style-image.dto";
import formStyles from "@/styles/admin-form.module.css";
import listStyles from "@/styles/admin-list.module.css";
import styles from "./UiStyleChildren.module.css";

export interface UiStyleImagesProps {
  uiStyleId: string;
  images: UiStyleImageDTO[];
}

export function UiStyleImages({ uiStyleId, images }: UiStyleImagesProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  const remainingSlots = MAX_IMAGES_PER_UI_STYLE - images.length;
  const limitReached = remainingSlots <= 0;

  function handleFilesSelected(selected: FileList) {
    const picked = Array.from(selected);
    if (picked.length > remainingSlots) {
      setError(
        `Solo quedan ${remainingSlots} huecos libres (límite ${MAX_IMAGES_PER_UI_STYLE}). Se han tomado las primeras ${remainingSlots}.`,
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
          await addUiStyleImage({ uiStyleId, file });
          setProgress({ done: index + 1, total: pending.length });
        } catch (err) {
          const detail = err instanceof Error ? err.message : undefined;
          setError(
            `Se subieron ${index} de ${pending.length} imágenes. Falló "${file.name}"${detail ? `: ${detail}` : "."}`,
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

  function handleAltTextSave(id: string, altText: string, previous: string | null) {
    if (altText === (previous ?? "")) return;
    setError(null);
    startTransition(async () => {
      try {
        await updateUiStyleImage(id, { altText });
        router.refresh();
      } catch (err) {
        const detail = err instanceof Error ? err.message : undefined;
        setError(
          detail
            ? `No se pudo guardar la descripción: ${detail}`
            : "No se pudo guardar la descripción.",
        );
      }
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await removeUiStyleImage(id);
        router.refresh();
      } catch (err) {
        const detail = err instanceof Error ? err.message : undefined;
        setError(detail ? `No se pudo quitar la imagen: ${detail}` : "No se pudo quitar la imagen.");
      }
    });
  }

  return (
    <div className={styles.section}>
      <p className="hud-label">
        Galería de ejemplos ({images.length}/{MAX_IMAGES_PER_UI_STYLE})
      </p>

      {images.length > 0 ? (
        <ul className={styles.list}>
          {images.map((image) => (
            <li key={image.id} className={styles.item}>
              {/* eslint-disable-next-line @next/next/no-img-element -- URLs externas de Storage, sin loader de next/image configurado todavia */}
              <img src={image.imageUrl} alt={image.altText ?? ""} className={styles.thumbnail} />
              <input
                type="text"
                defaultValue={image.altText ?? ""}
                placeholder="Descripción (texto alternativo)"
                className={`${formStyles.input} ${styles.grow}`}
                disabled={isPending}
                onBlur={(event) =>
                  handleAltTextSave(image.id, event.target.value.trim(), image.altText)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
              />
              <button
                type="button"
                className={listStyles.deleteButton}
                disabled={isPending}
                onClick={() => handleRemove(image.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Sin imágenes todavía.</p>
      )}

      {limitReached ? (
        <p className={styles.empty}>
          Límite de {MAX_IMAGES_PER_UI_STYLE} imágenes alcanzado. Quita alguna para añadir más.
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
