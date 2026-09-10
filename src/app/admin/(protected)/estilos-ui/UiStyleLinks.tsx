"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addUiStyleLink, removeUiStyleLink } from "@/server/actions/ui-style-links.actions";
import { MAX_LINKS_PER_UI_STYLE } from "@/lib/validation/ui-style-link.schema";
import type { UiStyleLinkDTO } from "@/types/dto/ui-style-link.dto";
import formStyles from "@/styles/admin-form.module.css";
import listStyles from "@/styles/admin-list.module.css";
import styles from "./UiStyleChildren.module.css";

export interface UiStyleLinksProps {
  uiStyleId: string;
  links: UiStyleLinkDTO[];
}

export function UiStyleLinks({ uiStyleId, links }: UiStyleLinksProps) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const limitReached = links.length >= MAX_LINKS_PER_UI_STYLE;

  function handleAdd() {
    if (!label.trim() || !url.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await addUiStyleLink({ uiStyleId, label: label.trim(), url: url.trim() });
        setLabel("");
        setUrl("");
        router.refresh();
      } catch (err) {
        const detail = err instanceof Error ? err.message : undefined;
        setError(detail ? `No se pudo añadir el enlace: ${detail}` : "No se pudo añadir el enlace.");
      }
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      try {
        await removeUiStyleLink(id);
        router.refresh();
      } catch (err) {
        const detail = err instanceof Error ? err.message : undefined;
        setError(detail ? `No se pudo quitar el enlace: ${detail}` : "No se pudo quitar el enlace.");
      }
    });
  }

  return (
    <div className={styles.section}>
      <p className="hud-label">
        Enlaces de referencia ({links.length}/{MAX_LINKS_PER_UI_STYLE})
      </p>

      {links.length > 0 ? (
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.id} className={styles.item}>
              <span className={styles.linkLabel}>{link.label}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.linkUrl}
              >
                {link.url}
              </a>
              <button
                type="button"
                className={listStyles.deleteButton}
                disabled={isPending}
                onClick={() => handleRemove(link.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Sin enlaces todavía.</p>
      )}

      {limitReached ? (
        <p className={styles.empty}>
          Límite de {MAX_LINKS_PER_UI_STYLE} enlaces alcanzado. Quita alguno para añadir más.
        </p>
      ) : (
        <div className={styles.addRow}>
          <input
            type="text"
            value={label}
            placeholder="Texto del enlace"
            className={formStyles.input}
            disabled={isPending}
            onChange={(event) => setLabel(event.target.value)}
          />
          <input
            type="url"
            value={url}
            placeholder="https://..."
            className={formStyles.input}
            disabled={isPending}
            onChange={(event) => setUrl(event.target.value)}
          />
          <button
            type="button"
            className={formStyles.submit}
            disabled={isPending || !label.trim() || !url.trim()}
            onClick={handleAdd}
          >
            Añadir
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
