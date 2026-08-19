import type { ReactNode } from "react";
import type { PanelAccent } from "../Panel/Panel";
import styles from "./Alert.module.css";

export interface AlertProps {
  tone: PanelAccent;
  title: string;
  children: ReactNode;
}

const ICON_PATHS: Record<PanelAccent, ReactNode> = {
  cyan: <path d="M8 5.5v.01M8 7.5v3" />,
  violet: <path d="M8 5.5v.01M8 7.5v3" />,
  green: <path d="M5 8l2 2 4-4.5" />,
  amber: <path d="M8 6.5v3.5M8 12v.01" />,
  red: <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />,
};

export function Alert({ tone, title, children }: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[`tone-${tone}`]}`} role="alert">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        {ICON_PATHS[tone]}
      </svg>
      <span className={styles.text}>
        <b className="hud-label">{title}</b>
        {children}
      </span>
    </div>
  );
}
