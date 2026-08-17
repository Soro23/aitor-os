import type { ReactNode } from "react";
import { Panel, type PanelAccent } from "../Panel/Panel";
import styles from "./ClipCard.module.css";

export interface ClipCardProps {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  footer?: ReactNode;
  accent?: PanelAccent;
}

export function ClipCard({ eyebrow, title, children, footer, accent = "cyan" }: ClipCardProps) {
  return (
    <Panel as="article" accent={accent} className={styles.card}>
      {eyebrow ? <p className={`hud-label ${styles.eyebrow}`}>{eyebrow}</p> : null}
      <h3 className={styles.title}>{title}</h3>
      {children ? <div className={styles.body}>{children}</div> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </Panel>
  );
}
