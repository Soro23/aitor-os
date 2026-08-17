import type { PanelAccent } from "../Panel/Panel";
import styles from "./ProgressBar.module.css";

export interface ProgressBarProps {
  value: number;
  label?: string;
  tone?: PanelAccent;
}

export function ProgressBar({ value, label, tone = "cyan" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.wrapper}>
      {label ? (
        <div className={styles.labelRow}>
          <span className="hud-label">{label}</span>
          <span className="hud-label">{clamped}%</span>
        </div>
      ) : null}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`${styles.fill} ${styles[`tone-${tone}`]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
