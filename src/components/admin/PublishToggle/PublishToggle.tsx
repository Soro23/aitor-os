"use client";

import { useTransition } from "react";
import styles from "./PublishToggle.module.css";

export interface PublishToggleProps {
  isPublished: boolean;
  onToggle: (value: boolean) => Promise<unknown>;
}

export function PublishToggle({ isPublished, onToggle }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPublished}
      disabled={isPending}
      className={`${styles.toggle} ${isPublished ? styles.on : ""}`}
      onClick={() =>
        startTransition(async () => {
          await onToggle(!isPublished);
        })
      }
    >
      <span className="hud-label">{isPublished ? "Publicado" : "Borrador"}</span>
    </button>
  );
}
