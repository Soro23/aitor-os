"use client";

import { useTransition } from "react";
import styles from "./FeaturedToggle.module.css";

export interface FeaturedToggleProps {
  isFeatured: boolean;
  onToggle: (value: boolean) => Promise<unknown>;
}

export function FeaturedToggle({ isFeatured, onToggle }: FeaturedToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isFeatured}
      disabled={isPending}
      className={`${styles.toggle} ${isFeatured ? styles.on : ""}`}
      onClick={() =>
        startTransition(async () => {
          await onToggle(!isFeatured);
        })
      }
    >
      <span className="hud-label">{isFeatured ? "Destacado" : "Normal"}</span>
    </button>
  );
}
