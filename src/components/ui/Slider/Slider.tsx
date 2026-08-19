import { useId, type InputHTMLAttributes } from "react";
import styles from "./Slider.module.css";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  value: number;
}

export function Slider({ label, value, id, ...rest }: SliderProps) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={sliderId} className="hud-label">
          {label}
        </label>
        <span className="hud-label">{value}%</span>
      </div>
      <input id={sliderId} type="range" min={0} max={100} value={value} className={styles.range} {...rest} />
    </div>
  );
}
