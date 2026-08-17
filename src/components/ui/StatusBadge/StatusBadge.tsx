import type { PanelAccent } from "../Panel/Panel";
import styles from "./StatusBadge.module.css";

export interface StatusBadgeProps {
  label: string;
  tone: PanelAccent;
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span className={`hud-label ${styles.badge} ${styles[`tone-${tone}`]}`}>
      {label}
    </span>
  );
}
