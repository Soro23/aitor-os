import styles from "./Divider.module.css";

export interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  if (!label) return <hr className={styles.hr} />;

  return <div className={`hud-label ${styles.labeled}`}>{label}</div>;
}
