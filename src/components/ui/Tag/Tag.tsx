import styles from "./Tag.module.css";

export interface TagProps {
  label: string;
  active?: boolean;
  onRemove?: () => void;
}

export function Tag({ label, active, onRemove }: TagProps) {
  return (
    <span className={`${styles.tag} ${active ? styles.active : ""}`}>
      {label}
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={`Quitar ${label}`} className={styles.remove}>
          ✕
        </button>
      ) : null}
    </span>
  );
}
