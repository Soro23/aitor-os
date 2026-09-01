import type { PanelAccent } from "@/components/ui/Panel/Panel";
import styles from "./SectionIntro.module.css";

export interface SectionIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  accent?: PanelAccent;
  meta?: string;
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  accent = "cyan",
  meta,
}: SectionIntroProps) {
  return (
    <header className={styles.intro}>
      <div className={styles.top}>
        <p className={`hud-label ${styles.eyebrow}`}>
          <span
            className={styles.marker}
            style={{ backgroundColor: `var(--color-accent-${accent})` }}
          />
          {eyebrow}
        </p>
        {meta ? <p className={`hud-label ${styles.meta}`}>{meta}</p> : null}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
