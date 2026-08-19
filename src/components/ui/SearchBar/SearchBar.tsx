import type { InputHTMLAttributes } from "react";
import styles from "./SearchBar.module.css";

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function SearchBar({ label = "Buscar", className, ...rest }: SearchBarProps) {
  return (
    <div className={`${styles.search} ${className ?? ""}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="7" cy="7" r="5" />
        <path d="M11 11l3.5 3.5" />
      </svg>
      <input type="search" aria-label={label} placeholder={label} {...rest} />
    </div>
  );
}
