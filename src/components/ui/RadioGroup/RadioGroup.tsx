import { useId } from "react";
import styles from "./RadioGroup.module.css";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export function RadioGroup({ label, name, options, value, onChange }: RadioGroupProps) {
  const groupId = useId();

  return (
    <fieldset className={styles.fieldset}>
      <legend className="hud-label">{label}</legend>
      <div className={styles.options}>
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <label key={option.value} htmlFor={optionId} className={styles.row}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className={styles.input}
              />
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.label}>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
