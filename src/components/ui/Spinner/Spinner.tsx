import styles from "./Spinner.module.css";

export interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = "Cargando" }: SpinnerProps) {
  return (
    <span role="status" className={styles.wrap}>
      <span className={styles.spin} aria-hidden="true" />
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
