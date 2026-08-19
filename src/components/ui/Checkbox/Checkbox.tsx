import { useId, type InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function Checkbox({ label, id, className, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label htmlFor={checkboxId} className={`${styles.row} ${className ?? ""}`}>
      <input id={checkboxId} type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M2 6l3 3 5-6" />
        </svg>
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
