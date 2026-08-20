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

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="8" cy="8" r="3.5" />
      <path d="M8 0.5v2M8 13.5v2M15.5 8h-2M2.5 8h-2M13.3 2.7l-1.4 1.4M4.1 11.9l-1.4 1.4M13.3 13.3l-1.4-1.4M4.1 4.1L2.7 2.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a5 5 0 0 0 7 7Z" />
    </svg>
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
      />
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
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
