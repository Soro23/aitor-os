import type { PanelAccent } from "../Panel/Panel";
import styles from "./PulseIndicator.module.css";

export interface PulseIndicatorProps {
  label: string;
  tone?: PanelAccent;
  active?: boolean;
}

export function PulseIndicator({ label, tone = "green", active = true }: PulseIndicatorProps) {
  return (
    <div className={styles.wrapper} role="status">
      <span
        className={`${styles.dot} ${styles[`tone-${tone}`]} ${active ? styles.pulsing : ""}`}
        aria-hidden="true"
      />
      <span className="hud-label">{label}</span>
    </div>
  );
}
