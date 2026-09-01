import { Panel, type PanelAccent } from "@/components/ui/Panel/Panel";
import styles from "./EmptyNotice.module.css";

export interface EmptyNoticeProps {
  message: string;
  accent?: PanelAccent;
}

export function EmptyNotice({ message, accent = "cyan" }: EmptyNoticeProps) {
  return (
    <Panel accent={accent}>
      <p className={styles.message}>{message}</p>
    </Panel>
  );
}
