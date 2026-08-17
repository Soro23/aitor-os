import { Panel, type PanelAccent } from "@/components/ui/Panel/Panel";
import styles from "./PlaceholderSection.module.css";

export interface PlaceholderSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  accent?: PanelAccent;
}

export function PlaceholderSection({
  eyebrow,
  title,
  description,
  accent = "cyan",
}: PlaceholderSectionProps) {
  return (
    <Panel accent={accent}>
      <p className="hud-label">{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </Panel>
  );
}
