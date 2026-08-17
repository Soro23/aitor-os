"use client";

import { useTransition } from "react";
import type { PanelAccent } from "@/components/ui/Panel/Panel";
import styles from "./ToggleSwitch.module.css";

export interface ToggleSwitchProps {
  value: boolean;
  onLabel: string;
  offLabel: string;
  tone?: PanelAccent;
  onToggle: (value: boolean) => Promise<unknown>;
}

/**
 * Toggle generico para flags booleanos que no son is_published/is_featured
 * (ej. is_active de now_items, is_visible de stack_items). PublishToggle y
 * FeaturedToggle siguen siendo los componentes oficiales para ese caso
 * concreto; este cubre el resto.
 */
export function ToggleSwitch({ value, onLabel, offLabel, tone = "green", onToggle }: ToggleSwitchProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      disabled={isPending}
      className={`${styles.toggle} ${value ? styles[`on-${tone}`] : ""}`}
      onClick={() =>
        startTransition(async () => {
          await onToggle(!value);
        })
      }
    >
      <span className="hud-label">{value ? onLabel : offLabel}</span>
    </button>
  );
}
