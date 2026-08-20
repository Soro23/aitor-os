"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import styles from "./ThemeToggle.module.css";

export interface ThemeToggleProps {
  className?: string;
}

function subscribeNoop() {
  return () => {};
}

function useHasMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <button
        type="button"
        className={`${styles.toggle} ${className}`}
        disabled
        aria-hidden="true"
      >
        <span className="hud-label">Tema</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={`${styles.toggle} ${className}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="hud-label">{isDark ? "Oscuro" : "Claro"}</span>
    </button>
  );
}
