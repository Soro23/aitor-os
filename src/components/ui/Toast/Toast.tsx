import type { PanelAccent } from "../Panel/Panel";
import styles from "./Toast.module.css";

export interface ToastProps {
  tone: PanelAccent;
  message: string;
  onClose?: () => void;
}

export function Toast({ tone, message, onClose }: ToastProps) {
  return (
    <div className={styles.toast} role="status">
      <span className={`${styles.bar} ${styles[`tone-${tone}`]}`} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
      {onClose ? (
        <button type="button" onClick={onClose} aria-label="Cerrar notificación" className={styles.close}>
          ✕
        </button>
      ) : null}
    </div>
  );
}
